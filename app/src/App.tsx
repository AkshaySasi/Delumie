import { useState, useEffect, useRef, useCallback } from "react";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import { open } from "@tauri-apps/plugin-dialog";
import { readTextFile } from "@tauri-apps/plugin-fs";
import { Send, Sparkles, User, Paperclip, Info, Moon, Sun, AlertCircle, RotateCcw } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Onboarding from "./components/Onboarding";
import ProfileModal from "./components/ProfileModal";
import SplashScreen from "./components/SplashScreen";
import Sidebar, { Session } from "./components/Sidebar";
import HealthTracker from "./components/HealthTracker";
import "./App.css";

// ── Suggestion chips shown in empty chat ─────────────────────────────────────
const SUGGESTIONS = [
    "What should I eat for breakfast?",
    "How can I improve my sleep?",
    "What exercises suit my goals?",
    "Check my medication interactions",
];

// ── Markdown renderer (bold, italic, bullets — no deps) ──────────────────────
function renderMarkdown(text: string) {
    const parseInline = (str: string): React.ReactNode[] => {
        const parts = str.split(/(\*\*[^*\n]+\*\*|\*[^*\n]+\*)/g);
        return parts.map((part, idx) => {
            if (part.startsWith("**") && part.endsWith("**"))
                return <strong key={idx} className="font-semibold">{part.slice(2, -2)}</strong>;
            if (part.startsWith("*") && part.endsWith("*"))
                return <em key={idx}>{part.slice(1, -1)}</em>;
            return <span key={idx}>{part}</span>;
        });
    };

    const lines = text.split("\n");
    const result: React.ReactNode[] = [];
    let i = 0;

    while (i < lines.length) {
        const line = lines[i];
        if (!line.trim()) {
            result.push(<div key={i} className="h-1.5" />);
            i++;
            continue;
        }
        if (/^[-•*]\s/.test(line.trim())) {
            const items: string[] = [];
            while (i < lines.length && /^[-•*]\s/.test(lines[i].trim())) {
                items.push(lines[i].trim().replace(/^[-•*]\s/, ""));
                i++;
            }
            result.push(
                <ul key={`ul-${i}`} className="list-none space-y-1 my-1.5">
                    {items.map((item, j) => (
                        <li key={j} className="flex gap-2 items-start">
                            <span className="text-sage-400 mt-0.5 flex-shrink-0">•</span>
                            <span>{parseInline(item)}</span>
                        </li>
                    ))}
                </ul>
            );
            continue;
        }
        result.push(<p key={i}>{parseInline(line)}</p>);
        i++;
    }
    return <div className="text-sm leading-relaxed space-y-0.5">{result}</div>;
}

// ── Message type ──────────────────────────────────────────────────────────────
interface Message {
    role: "user" | "assistant" | "system" | "error";
    content: string;
}

// ── App ───────────────────────────────────────────────────────────────────────
function App() {
    const [status, setStatus] = useState<
        "checking" | "missing" | "installing" | "pulling" | "ready" | "onboarding" | "browser"
    >("checking");
    const [progress, setProgress] = useState(0);
    const [modelName, setModelName] = useState("llama3.2:3b");

    // Dark mode (persisted in localStorage)
    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem("dark") === "true";
    });
    useEffect(() => {
        document.documentElement.classList.toggle("dark", darkMode);
        localStorage.setItem("dark", String(darkMode));
    }, [darkMode]);

    // Sessions
    const [sessions, setSessions] = useState<Session[]>([]);
    const [activeSessionId, setActiveSessionId] = useState<string | null>(null);

    // Chat
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isThinking, setIsThinking] = useState(false);
    const [streamingContent, setStreamingContent] = useState("");
    const streamingRef = useRef("");
    const thinkingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // UI
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [showHealth, setShowHealth] = useState(false);
    const messagesEndRef = useRef<null | HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, streamingContent]);

    // ── Tauri event listeners ─────────────────────────────────────────────────
    useEffect(() => {
        // @ts-ignore
        if (!window.__TAURI_INTERNALS__) {
            setStatus("browser");
            return;
        }

        checkDeps();

        const unlistenProgress = listen<number>("setup-progress", (e) => setProgress(e.payload));

        const unlistenToken = listen<string>("chat-token", (e) => {
            streamingRef.current += e.payload;
            setStreamingContent(streamingRef.current);
            // Reset the no-response timeout on each token
            if (thinkingTimerRef.current) clearTimeout(thinkingTimerRef.current);
        });

        const unlistenDone = listen<string>("chat-stream-done", (e) => {
            if (thinkingTimerRef.current) clearTimeout(thinkingTimerRef.current);
            const fullContent = e.payload || streamingRef.current;
            setMessages((prev) => [...prev, { role: "assistant", content: fullContent }]);
            streamingRef.current = "";
            setStreamingContent("");
            setIsThinking(false);
            loadSessions();
        });

        const unlistenError = listen<string>("chat-stream-error", (e) => {
            if (thinkingTimerRef.current) clearTimeout(thinkingTimerRef.current);
            setMessages((prev) => [...prev, { role: "error", content: e.payload }]);
            streamingRef.current = "";
            setStreamingContent("");
            setIsThinking(false);
        });

        return () => {
            unlistenProgress.then((f) => f());
            unlistenToken.then((f) => f());
            unlistenDone.then((f) => f());
            unlistenError.then((f) => f());
        };
    }, []);

    // ── Startup flow ──────────────────────────────────────────────────────────
    async function checkDeps() {
        try {
            const start = Date.now();
            const installed = await invoke("check_dependencies");
            const elapsed = Date.now() - start;
            const remaining = 3000 - elapsed;
            if (remaining > 0) await new Promise((r) => setTimeout(r, remaining));
            if (installed) {
                checkUserProfile();
            } else {
                setStatus("missing");
            }
        } catch {
            setStatus("browser");
        }
    }

    async function checkUserProfile() {
        try {
            const profile: any = await invoke("get_user_profile");
            if (!profile) {
                setStatus("onboarding");
            } else {
                const model = profile.model || "llama3.2:3b";
                setModelName(model);
                setProgress(0);
                setStatus("pulling");
                pullModel(model);
            }
        } catch {
            setStatus("onboarding");
        }
    }

    async function pullModel(targetModel?: string) {
        const modelToPull = targetModel || modelName;
        try {
            await invoke("pull_model", { model: modelToPull });
        } catch {
            // Proceed anyway — model may already be present
        }
        setStatus("ready");
        await loadSessions();
    }

    async function handleInstall() {
        setStatus("installing");
        try {
            await invoke("install_ollama");
            alert("Installer launched! Please complete the setup. Delumie will check again shortly.");
            const interval = setInterval(async () => {
                const installed = await invoke("check_dependencies");
                if (installed) {
                    clearInterval(interval);
                    checkUserProfile();
                }
            }, 5000);
        } catch (error) {
            setStatus("missing");
            alert("Failed to start installer: " + error);
        }
    }

    // ── Sessions ──────────────────────────────────────────────────────────────
    const loadSessions = useCallback(async () => {
        try {
            const data = await invoke<Session[]>("get_chat_sessions");
            setSessions(data);
        } catch {
            setSessions([]);
        }
    }, []);

    async function handleNewChat() {
        try {
            const session = await invoke<Session>("create_chat_session");
            setSessions((prev) => [session, ...prev]);
            setActiveSessionId(session.id);
            setMessages([]);
        } catch { /* ignore */ }
    }

    async function handleSelectSession(id: string) {
        if (id === activeSessionId) return;
        try {
            const stored = await invoke<{ role: string; content: string }[]>(
                "load_session_messages", { sessionId: id }
            );
            setActiveSessionId(id);
            setMessages(stored.map((m) => ({
                role: m.role as Message["role"],
                content: m.content,
            })));
        } catch { /* ignore */ }
    }

    async function handleDeleteSession(id: string) {
        try {
            await invoke("delete_chat_session", { id });
            setSessions((prev) => prev.filter((s) => s.id !== id));
            if (id === activeSessionId) {
                setActiveSessionId(null);
                setMessages([]);
            }
        } catch { /* ignore */ }
    }

    // ── Upload ────────────────────────────────────────────────────────────────
    async function handleUpload() {
        try {
            const selected = await open({
                multiple: false,
                filters: [{ name: "Text files", extensions: ["txt", "md"] }],
            });
            if (selected && typeof selected === "string") {
                const content = await readTextFile(selected);
                const fileName = selected.split(/[\\/]/).pop() ?? selected;
                setMessages((prev) => [...prev, { role: "system", content: `Uploading ${fileName}…` }]);
                const result = await invoke<string>("ingest_document", {
                    text: content,
                    source: `file:${selected}`,
                });
                setMessages((prev) => [
                    ...prev,
                    { role: "system", content: `Uploaded: ${result}` },
                ]);
            }
        } catch (e) {
            setMessages((prev) => [...prev, { role: "error", content: `Upload failed: ${e}` }]);
        }
    }

    // ── Send message ──────────────────────────────────────────────────────────
    async function sendMessage(overrideInput?: string) {
        const text = (overrideInput ?? input).trim();
        if (!text || isThinking) return;

        // Ensure we have an active session
        let sessionId = activeSessionId;
        if (!sessionId) {
            try {
                const session = await invoke<Session>("create_chat_session");
                setSessions((prev) => [session, ...prev]);
                setActiveSessionId(session.id);
                sessionId = session.id;
            } catch {
                return;
            }
        }

        // Persist user message
        try {
            await invoke("save_user_message", { sessionId, content: text });
        } catch { /* non-fatal */ }

        const newMsg: Message = { role: "user", content: text };
        setMessages((prev) => [...prev, newMsg]);
        setInput("");
        setIsThinking(true);
        streamingRef.current = "";
        setStreamingContent("");

        // 60-second no-response timeout
        thinkingTimerRef.current = setTimeout(() => {
            if (streamingRef.current === "") {
                setMessages((prev) => [
                    ...prev,
                    {
                        role: "error",
                        content:
                            "No response after 60s. Ollama may be overloaded or the model is still loading.",
                    },
                ]);
                setIsThinking(false);
            }
        }, 60000);

        const validMessages = [...messages, newMsg]
            .filter((m) => m.role === "user" || m.role === "assistant")
            .slice(-10)
            .map((m) => ({ role: m.role, content: m.content }));

        try {
            await invoke("send_chat_message", {
                model: modelName,
                messages: validMessages,
                sessionId,
            });
        } catch (e) {
            if (thinkingTimerRef.current) clearTimeout(thinkingTimerRef.current);
            setMessages((prev) => [
                ...prev,
                { role: "error", content: `Failed to reach AI: ${e}` },
            ]);
            setIsThinking(false);
        }
    }

    // ── Theming helpers ───────────────────────────────────────────────────────
    const bg = darkMode ? "bg-[var(--bg)]" : "bg-[var(--bg)]";
    const headerBg = darkMode
        ? "bg-[#1a2421]/80 border-[#2a3b36]"
        : "bg-white/70 border-gray-100";
    const inputBg = darkMode
        ? "bg-[#1a2421]/90 border-[#2a3b36]"
        : "bg-white/80 border-gray-100";
    const msgInputClass = darkMode
        ? "bg-[#1f2e2a] border-[#2a3b36] text-[#d1e0db] placeholder:text-[#4a6b62] focus:border-sage-500 focus:ring-sage-900/30"
        : "bg-white border-gray-200 text-slate-700 placeholder:text-gray-400 focus:border-sage-400 focus:ring-sage-100/50";
    const aiBubble = darkMode
        ? "bg-[#1a2421] text-[#c8dbd6] border-[#2a3b36]"
        : "bg-white text-slate-700 border-gray-100";

    // ── Early returns ─────────────────────────────────────────────────────────
    if (status === "checking") return <SplashScreen />;

    if (status === "browser") {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-[#FAF9F6] to-[#E8ECE9] p-8 text-center">
                <img src="/logo.png" alt="Delumie" className="w-20 h-20 mb-6 logo-depth" />
                <h1 className="text-2xl font-bold text-sage-800 mb-2">Desktop App Required</h1>
                <p className="text-gray-500 max-w-xs leading-relaxed">
                    Delumie runs entirely on your device. Please open it as the desktop application.
                </p>
            </div>
        );
    }

    if (status === "onboarding") {
        return (
            <Onboarding onComplete={() => checkUserProfile()} />
        );
    }

    // ── Setup screens (missing / installing / pulling) ────────────────────────
    if (status !== "ready") {
        return (
            <div className="flex flex-col items-center justify-center h-screen gap-6 text-center p-8 bg-gradient-to-br from-[#FAF9F6] to-[#E8ECE9]">
                {status === "missing" && (
                    <>
                        <div className="w-24 h-24 bg-sage-100 rounded-full flex items-center justify-center">
                            <Sparkles className="text-sage-600" size={40} />
                        </div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-4xl font-bold text-sage-800 tracking-tight">Welcome to Delumie</h1>
                            <span className="bg-sage-100 text-sage-600 text-xs font-bold px-2 py-1 rounded-full border border-sage-200 mt-1">BETA</span>
                        </div>
                        <p className="max-w-md text-gray-500 text-lg leading-relaxed">
                            Your private, local AI health companion. We need to set up the AI engine first.
                        </p>
                        <button
                            className="mt-2 px-8 py-4 bg-sage-700 text-white rounded-full font-semibold hover:bg-sage-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
                            onClick={handleInstall}
                        >
                            Start Setup
                        </button>
                    </>
                )}
                {status === "installing" && (
                    <>
                        <h2 className="text-2xl font-bold text-sage-700">Setting up Engine…</h2>
                        <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-sage-600 transition-all duration-300" style={{ width: `${progress}%` }} />
                        </div>
                        <p className="text-gray-400 text-sm">{progress > 0 ? `${Math.round(progress)}%` : "Preparing…"}</p>
                    </>
                )}
                {status === "pulling" && (
                    <>
                        <img src="/logo.png" alt="Delumie" className="w-20 h-20 logo-depth" />
                        <h2 className="text-2xl font-bold text-sage-700">Loading AI Model…</h2>
                        <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-sage-600 transition-all duration-300" style={{ width: `${Math.max(progress, 5)}%` }} />
                        </div>
                        <p className="text-gray-500 text-sm font-medium">{modelName}</p>
                        <p className="text-xs text-gray-400">This may take a few minutes on first launch.</p>
                    </>
                )}
            </div>
        );
    }

    // ── Main app (ready) ──────────────────────────────────────────────────────
    return (
        <div className={`flex h-screen ${bg} font-sans overflow-hidden`}>

            {/* Sidebar */}
            <Sidebar
                sessions={sessions}
                activeSessionId={activeSessionId}
                collapsed={sidebarCollapsed}
                onToggleCollapse={() => setSidebarCollapsed((v) => !v)}
                onNewChat={handleNewChat}
                onSelectSession={handleSelectSession}
                onDeleteSession={handleDeleteSession}
                onOpenHealth={() => setShowHealth(true)}
                darkMode={darkMode}
            />

            {/* Main chat area */}
            <div className="flex-1 flex flex-col min-w-0 relative">

                {/* Health tracker overlay */}
                <AnimatePresence>
                    {showHealth && (
                        <HealthTracker onClose={() => setShowHealth(false)} darkMode={darkMode} />
                    )}
                </AnimatePresence>

                {/* Header */}
                <div className={`flex-none px-5 py-3 border-b ${headerBg} backdrop-blur-md flex justify-between items-center z-10`}>
                    <div>
                        <div className="flex items-center gap-2">
                            <img src="/logo.png" alt="Delumie" className="w-6 h-6 logo-depth" />
                            <h1 className={`text-base font-bold tracking-tight ${darkMode ? "text-[#d1e0db]" : "text-sage-800"}`}>
                                Delumie
                            </h1>
                            <span className="bg-sage-100 text-sage-600 text-[9px] font-bold px-1.5 py-0.5 rounded-full border border-sage-200">
                                BETA
                            </span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5 ml-8">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                            <p className={`text-xs font-medium ${darkMode ? "text-[#7a9e94]" : "text-sage-600"}`}>
                                Online
                            </p>
                            <span className={`text-xs ${darkMode ? "text-[#3a5550]" : "text-gray-300"}`}>·</span>
                            <p className={`text-xs truncate max-w-[160px] ${darkMode ? "text-[#5a7e74]" : "text-gray-400"}`}>
                                {modelName}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Dark mode toggle */}
                        <button
                            onClick={() => setDarkMode((v) => !v)}
                            className={`p-2 rounded-xl transition-colors ${darkMode ? "text-yellow-400 hover:bg-[#1f2e2a]" : "text-gray-400 hover:bg-gray-100"}`}
                            title="Toggle dark mode"
                        >
                            {darkMode ? <Sun size={16} /> : <Moon size={16} />}
                        </button>

                        {/* Profile */}
                        <button
                            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${darkMode ? "bg-[#1f2e2a] text-[#7a9e94] hover:bg-[#2a3b36]" : "bg-sage-100 text-sage-700 hover:bg-sage-200"}`}
                            onClick={() => setIsProfileOpen(true)}
                            title="Profile & Settings"
                        >
                            <User size={16} />
                        </button>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 space-y-5">
                    {messages.length === 0 && !isThinking && (
                        <div className="flex flex-col items-center justify-center h-full pb-16">
                            <div className="opacity-30 mb-8 text-center select-none">
                                <Sparkles size={40} className={`mx-auto mb-3 ${darkMode ? "text-[#4a6b62]" : "text-sage-300"}`} />
                                <p className={`text-base font-medium ${darkMode ? "text-[#5a7e74]" : "text-gray-400"}`}>
                                    How are you feeling today?
                                </p>
                            </div>
                            {/* Suggestion chips */}
                            <div className="flex flex-wrap gap-2 justify-center max-w-lg">
                                {SUGGESTIONS.map((s) => (
                                    <button
                                        key={s}
                                        onClick={() => sendMessage(s)}
                                        className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all active:scale-95
                                            ${darkMode
                                                ? "bg-[#1a2421] border-[#2a3b36] text-[#7a9e94] hover:border-sage-500 hover:text-[#a8c4ba]"
                                                : "bg-white border-gray-200 text-gray-500 hover:border-sage-400 hover:text-sage-700 shadow-sm"
                                            }`}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {messages.map((msg, i) => {
                        if (msg.role === "system") {
                            return (
                                <div key={i} className="flex justify-center">
                                    <span className={`text-[11px] px-3 py-1 rounded-full ${darkMode ? "bg-[#1f2e2a] text-[#7a9e94]" : "bg-gray-100 text-gray-400"}`}>
                                        {msg.content}
                                    </span>
                                </div>
                            );
                        }
                        if (msg.role === "error") {
                            return (
                                <div key={i} className="flex justify-start">
                                    <div className="flex items-start gap-2 max-w-[85%] md:max-w-[70%] bg-red-50 border border-red-200 text-red-700 rounded-2xl rounded-bl-none px-4 py-3">
                                        <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                                        <div>
                                            <p className="text-sm font-medium">Something went wrong</p>
                                            <p className="text-xs mt-0.5 opacity-70">{msg.content}</p>
                                            <button
                                                onClick={() => {
                                                    const lastUser = [...messages].reverse().find((m) => m.role === "user");
                                                    if (lastUser) sendMessage(lastUser.content);
                                                }}
                                                className="flex items-center gap-1 text-xs mt-2 text-red-600 hover:text-red-800 font-medium"
                                            >
                                                <RotateCcw size={12} /> Retry
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        }
                        return (
                            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                                <div
                                    className={`max-w-[85%] md:max-w-[72%] rounded-2xl px-5 py-3.5 shadow-sm
                                        ${msg.role === "user"
                                            ? `rounded-br-none ${darkMode ? "bg-[#3f5d56] text-[#e8f0ee]" : "bg-sage-700 text-white"}`
                                            : `rounded-bl-none ${aiBubble} border shadow-[0_2px_8px_rgba(0,0,0,0.04)]`
                                        }`}
                                >
                                    {msg.role === "assistant"
                                        ? renderMarkdown(msg.content)
                                        : <p className="text-sm leading-relaxed">{msg.content}</p>}
                                </div>
                            </div>
                        );
                    })}

                    {/* Streaming token display */}
                    {isThinking && (
                        <div className="flex justify-start">
                            <div className={`max-w-[85%] md:max-w-[72%] rounded-2xl px-5 py-3.5 rounded-bl-none border ${aiBubble} shadow-sm`}>
                                {streamingContent ? (
                                    renderMarkdown(streamingContent)
                                ) : (
                                    <div className="flex gap-1.5 items-center py-1">
                                        <span className="w-2 h-2 bg-sage-400 rounded-full animate-[bounce_1s_infinite_0ms]" />
                                        <span className="w-2 h-2 bg-sage-400 rounded-full animate-[bounce_1s_infinite_200ms]" />
                                        <span className="w-2 h-2 bg-sage-400 rounded-full animate-[bounce_1s_infinite_400ms]" />
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className={`flex-none px-4 md:px-6 py-4 backdrop-blur-md border-t ${inputBg}`}>
                    <form
                        onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
                        className="relative max-w-3xl mx-auto"
                    >
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask about your health, diet, or routine…"
                            className={`w-full py-3.5 pr-14 pl-12 rounded-2xl border outline-none transition-all shadow-sm text-sm focus:ring-4 ${msgInputClass}`}
                            disabled={isThinking}
                        />
                        <button
                            type="button"
                            onClick={handleUpload}
                            disabled={isThinking}
                            className={`absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-xl transition-all
                                ${darkMode ? "text-[#4a6b62] hover:text-[#7a9e94] hover:bg-[#1f2e2a]" : "text-gray-400 hover:text-sage-600 hover:bg-sage-50"}`}
                            title="Upload document (.txt, .md)"
                        >
                            <Paperclip size={17} />
                        </button>
                        <button
                            type="submit"
                            disabled={!input.trim() || isThinking}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-sage-700 text-white rounded-xl hover:bg-sage-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md active:scale-95"
                        >
                            <Send size={16} />
                        </button>
                    </form>
                    <div className={`flex justify-center items-center gap-2 mt-2 text-[10px] font-medium tracking-wide uppercase ${darkMode ? "text-[#3a5550]" : "text-gray-300"}`}>
                        <span>Private &amp; Local · Always verify medical info</span>
                        <div className="group relative">
                            <Info size={11} className="cursor-help hover:text-sage-400 transition-colors" />
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-52 p-2 bg-gray-800 text-white text-[10px] normal-case tracking-normal rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all text-center pointer-events-none z-50">
                                Responses depend on your hardware. For critical health decisions, always consult a doctor.
                                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-800" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Profile modal */}
            <ProfileModal
                isOpen={isProfileOpen}
                onClose={() => setIsProfileOpen(false)}
                onReset={() => { setIsProfileOpen(false); window.location.reload(); }}
                onModelChange={(newModel) => {
                    setIsProfileOpen(false);
                    setModelName(newModel);
                    setProgress(0);
                    setStatus("pulling");
                    pullModel(newModel);
                }}
            />
        </div>
    );
}

export default App;
