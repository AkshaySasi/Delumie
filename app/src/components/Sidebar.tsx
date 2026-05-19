import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, MessageSquare, ChevronLeft, ChevronRight, Activity } from "lucide-react";

export interface Session {
    id: string;
    title: string;
    created_at: string;
    last_message_at: string;
}

interface SidebarProps {
    sessions: Session[];
    activeSessionId: string | null;
    collapsed: boolean;
    onToggleCollapse: () => void;
    onNewChat: () => void;
    onSelectSession: (id: string) => void;
    onDeleteSession: (id: string) => void;
    onOpenHealth: () => void;
    darkMode: boolean;
}

function formatDate(iso: string): string {
    try {
        const d = new Date(iso);
        const now = new Date();
        const diffMs = now.getTime() - d.getTime();
        const diffDays = Math.floor(diffMs / 86400000);
        if (diffDays === 0) return "Today";
        if (diffDays === 1) return "Yesterday";
        if (diffDays < 7) return `${diffDays}d ago`;
        return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
    } catch {
        return "";
    }
}

export default function Sidebar({
    sessions,
    activeSessionId,
    collapsed,
    onToggleCollapse,
    onNewChat,
    onSelectSession,
    onDeleteSession,
    onOpenHealth,
    darkMode,
}: SidebarProps) {
    const [hoveredId, setHoveredId] = useState<string | null>(null);
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

    const surface = darkMode ? "bg-[#141e1c]" : "bg-[#F4F7F5]";
    const border = darkMode ? "border-[#2a3b36]" : "border-gray-200";
    const textPrimary = darkMode ? "text-[#d1e0db]" : "text-slate-700";
    const textMuted = darkMode ? "text-[#7a9e94]" : "text-gray-400";
    const activeBg = darkMode ? "bg-[#1f2e2a]" : "bg-white";
    const hoverBg = darkMode ? "hover:bg-[#1a2825]" : "hover:bg-white/70";

    return (
        <motion.div
            animate={{ width: collapsed ? 52 : 240 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className={`flex-none ${surface} border-r ${border} flex flex-col relative overflow-hidden`}
            style={{ minWidth: collapsed ? 52 : 240 }}
        >
            {/* Header */}
            <div className={`flex items-center h-14 px-2 border-b ${border} flex-shrink-0`}>
                {!collapsed && (
                    <span className={`flex-1 text-xs font-bold tracking-widest uppercase ${textMuted} pl-2`}>
                        Chats
                    </span>
                )}
                <button
                    onClick={onToggleCollapse}
                    className={`p-2 rounded-lg ${hoverBg} ${textMuted} transition-colors ml-auto`}
                    title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                    {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                </button>
            </div>

            {/* New chat */}
            <div className="px-2 pt-3 pb-1 flex-shrink-0">
                <button
                    onClick={onNewChat}
                    className={`flex items-center gap-2 w-full px-3 py-2.5 rounded-xl font-semibold text-sm transition-all
                        bg-sage-600 text-white hover:bg-sage-700 shadow-sm active:scale-95`}
                    title="New chat"
                >
                    <Plus size={16} className="flex-shrink-0" />
                    {!collapsed && <span>New Chat</span>}
                </button>
            </div>

            {/* Sessions list */}
            <div className="flex-1 overflow-y-auto px-2 pb-2 space-y-0.5">
                <AnimatePresence>
                    {sessions.map((session) => {
                        const isActive = session.id === activeSessionId;
                        return (
                            <motion.div
                                key={session.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                className="relative group"
                                onMouseEnter={() => setHoveredId(session.id)}
                                onMouseLeave={() => { setHoveredId(null); setConfirmDeleteId(null); }}
                            >
                                <button
                                    onClick={() => onSelectSession(session.id)}
                                    className={`w-full flex items-start gap-2 px-2.5 py-2.5 rounded-xl text-left transition-all
                                        ${isActive ? `${activeBg} shadow-sm` : hoverBg}`}
                                >
                                    <MessageSquare
                                        size={14}
                                        className={`mt-0.5 flex-shrink-0 ${isActive ? "text-sage-600" : textMuted}`}
                                    />
                                    {!collapsed && (
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-xs font-medium truncate ${isActive ? "text-sage-700" : textPrimary}`}>
                                                {session.title || "New Chat"}
                                            </p>
                                            <p className={`text-[10px] ${textMuted} mt-0.5`}>
                                                {formatDate(session.last_message_at)}
                                            </p>
                                        </div>
                                    )}
                                </button>

                                {/* Delete button */}
                                {!collapsed && hoveredId === session.id && (
                                    <div className="absolute right-1.5 top-1/2 -translate-y-1/2">
                                        {confirmDeleteId === session.id ? (
                                            <div className="flex gap-1">
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); onDeleteSession(session.id); setConfirmDeleteId(null); }}
                                                    className="text-[10px] bg-red-500 text-white px-2 py-1 rounded-lg font-bold"
                                                >
                                                    Del
                                                </button>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(null); }}
                                                    className={`text-[10px] ${darkMode ? "bg-[#2a3b36] text-gray-300" : "bg-gray-100 text-gray-500"} px-2 py-1 rounded-lg`}
                                                >
                                                    No
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(session.id); }}
                                                className={`p-1.5 rounded-lg ${darkMode ? "text-[#7a9e94] hover:bg-[#2a3b36]" : "text-gray-400 hover:bg-gray-200"} transition-colors`}
                                                title="Delete chat"
                                            >
                                                <Trash2 size={12} />
                                            </button>
                                        )}
                                    </div>
                                )}
                            </motion.div>
                        );
                    })}
                </AnimatePresence>

                {sessions.length === 0 && !collapsed && (
                    <p className={`text-xs ${textMuted} text-center py-6 px-2`}>
                        No chats yet. Start a new one!
                    </p>
                )}
            </div>

            {/* Health tracker button */}
            <div className={`px-2 pb-3 pt-2 border-t ${border} flex-shrink-0`}>
                <button
                    onClick={onOpenHealth}
                    className={`flex items-center gap-2 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${hoverBg} ${textPrimary}`}
                    title="Health Tracker"
                >
                    <Activity size={16} className="flex-shrink-0 text-sage-500" />
                    {!collapsed && <span>Health Tracker</span>}
                </button>
            </div>
        </motion.div>
    );
}
