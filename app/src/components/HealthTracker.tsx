import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { motion } from "framer-motion";
import { X, Plus, TrendingUp, Heart, Droplets, Smile, Scale } from "lucide-react";

interface HealthLog {
    id: number;
    metric_type: string;
    value: string;
    note: string | null;
    logged_at: string;
}

interface HealthTrackerProps {
    onClose: () => void;
    darkMode: boolean;
}

const METRICS = [
    { key: "weight", label: "Weight", unit: "kg", icon: Scale, placeholder: "e.g. 74.5", color: "text-blue-500" },
    { key: "blood_pressure", label: "Blood Pressure", unit: "mmHg", icon: Heart, placeholder: "e.g. 120/80", color: "text-red-500" },
    { key: "blood_sugar", label: "Blood Sugar", unit: "mg/dL", icon: Droplets, placeholder: "e.g. 95", color: "text-orange-500" },
    { key: "mood", label: "Mood", unit: "/10", icon: Smile, placeholder: "1–10", color: "text-yellow-500" },
];

function Sparkline({ values, color }: { values: number[]; color: string }) {
    if (values.length < 2) return null;
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;
    const w = 80, h = 28;
    const pts = values.map((v, i) => {
        const x = (i / (values.length - 1)) * w;
        const y = h - ((v - min) / range) * h;
        return `${x},${y}`;
    }).join(" ");
    return (
        <svg width={w} height={h} className="opacity-60">
            <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
    );
}

export default function HealthTracker({ onClose, darkMode }: HealthTrackerProps) {
    const [logs, setLogs] = useState<HealthLog[]>([]);
    const [activeMetric, setActiveMetric] = useState("weight");
    const [value, setValue] = useState("");
    const [note, setNote] = useState("");
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const bg = darkMode ? "bg-[#141e1c]" : "bg-[#FAF9F6]";
    const surface = darkMode ? "bg-[#1a2421]" : "bg-white";
    const border = darkMode ? "border-[#2a3b36]" : "border-gray-100";
    const text = darkMode ? "text-[#d1e0db]" : "text-slate-800";
    const muted = darkMode ? "text-[#7a9e94]" : "text-gray-400";
    const input = darkMode
        ? "bg-[#1f2e2a] border-[#2a3b36] text-[#d1e0db] placeholder:text-[#4a6b62]"
        : "bg-white border-gray-200 text-slate-700 placeholder:text-gray-400";

    useEffect(() => {
        loadLogs();
    }, [activeMetric]);

    async function loadLogs() {
        try {
            const data = await invoke<HealthLog[]>("get_health_logs", {
                metricType: activeMetric,
                limit: 30,
            });
            setLogs(data);
        } catch {
            setLogs([]);
        }
    }

    async function handleLog() {
        if (!value.trim()) return;
        setSaving(true);
        setError("");
        try {
            await invoke("log_health_metric", {
                metricType: activeMetric,
                value: value.trim(),
                note: note.trim() || null,
            });
            setValue("");
            setNote("");
            await loadLogs();
        } catch (e) {
            setError(String(e));
        } finally {
            setSaving(false);
        }
    }

    const metric = METRICS.find((m) => m.key === activeMetric)!;
    const numericValues = logs
        .map((l) => parseFloat(l.value.split("/")[0]))
        .filter((n) => !isNaN(n))
        .reverse();

    function formatLogDate(iso: string) {
        try {
            return new Date(iso).toLocaleString(undefined, {
                month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
            });
        } catch { return iso; }
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-40 flex items-stretch"
        >
            <div className={`flex-1 ${bg} flex flex-col`}>
                {/* Header */}
                <div className={`flex items-center justify-between px-6 py-4 border-b ${border} ${surface}`}>
                    <div className="flex items-center gap-3">
                        <TrendingUp size={20} className="text-sage-600" />
                        <h2 className={`text-lg font-bold ${text}`}>Health Tracker</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className={`p-2 rounded-xl ${darkMode ? "hover:bg-[#1f2e2a]" : "hover:bg-gray-100"} ${muted} transition-colors`}
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    {/* Metric tabs */}
                    <div className="flex gap-2 flex-wrap mb-6">
                        {METRICS.map((m) => (
                            <button
                                key={m.key}
                                onClick={() => setActiveMetric(m.key)}
                                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                                    activeMetric === m.key
                                        ? "bg-sage-600 text-white shadow-md"
                                        : `${surface} ${text} border ${border} hover:border-sage-400`
                                }`}
                            >
                                <m.icon size={14} />
                                {m.label}
                            </button>
                        ))}
                    </div>

                    {/* Log form */}
                    <div className={`${surface} rounded-2xl p-6 border ${border} mb-6`}>
                        <h3 className={`font-semibold ${text} mb-4 flex items-center gap-2`}>
                            <metric.icon size={16} className={metric.color} />
                            Log {metric.label}
                        </h3>
                        <div className="flex gap-3 flex-wrap">
                            <div className="flex-1 min-w-[120px]">
                                <label className={`text-xs font-medium ${muted} block mb-1`}>
                                    Value ({metric.unit})
                                </label>
                                <input
                                    type="text"
                                    value={value}
                                    onChange={(e) => setValue(e.target.value)}
                                    placeholder={metric.placeholder}
                                    className={`w-full px-3 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-sage-200 focus:border-sage-400 transition-all ${input}`}
                                    onKeyDown={(e) => e.key === "Enter" && handleLog()}
                                />
                            </div>
                            <div className="flex-[2] min-w-[160px]">
                                <label className={`text-xs font-medium ${muted} block mb-1`}>
                                    Note (optional)
                                </label>
                                <input
                                    type="text"
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                    placeholder="e.g. after breakfast, fasted..."
                                    className={`w-full px-3 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-sage-200 focus:border-sage-400 transition-all ${input}`}
                                    onKeyDown={(e) => e.key === "Enter" && handleLog()}
                                />
                            </div>
                            <div className="flex items-end">
                                <button
                                    onClick={handleLog}
                                    disabled={!value.trim() || saving}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-sage-600 text-white rounded-xl font-semibold hover:bg-sage-700 transition-all disabled:opacity-50 active:scale-95 shadow-sm"
                                >
                                    <Plus size={16} />
                                    {saving ? "Saving..." : "Log"}
                                </button>
                            </div>
                        </div>
                        {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
                    </div>

                    {/* Trend chart */}
                    {numericValues.length >= 2 && (
                        <div className={`${surface} rounded-2xl p-5 border ${border} mb-4`}>
                            <div className="flex items-center justify-between">
                                <p className={`text-sm font-semibold ${text}`}>
                                    {metric.label} trend — last {numericValues.length} entries
                                </p>
                                <div className="flex items-center gap-2">
                                    <span className={`text-xs ${muted}`}>
                                        {numericValues[numericValues.length - 1]} {metric.unit}
                                    </span>
                                    <Sparkline values={numericValues} color="#52796f" />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Log history */}
                    {logs.length > 0 ? (
                        <div className="space-y-2">
                            <p className={`text-xs font-bold tracking-wider uppercase ${muted} mb-3`}>
                                History
                            </p>
                            {logs.map((log) => (
                                <div
                                    key={log.id}
                                    className={`${surface} rounded-xl px-4 py-3 border ${border} flex items-center justify-between`}
                                >
                                    <div>
                                        <span className={`text-base font-bold ${text}`}>
                                            {log.value}
                                            <span className={`text-xs font-normal ${muted} ml-1`}>
                                                {metric.unit}
                                            </span>
                                        </span>
                                        {log.note && (
                                            <p className={`text-xs ${muted} mt-0.5`}>{log.note}</p>
                                        )}
                                    </div>
                                    <span className={`text-xs ${muted}`}>{formatLogDate(log.logged_at)}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className={`text-center py-12 ${muted}`}>
                            <metric.icon size={32} className="mx-auto mb-3 opacity-30" />
                            <p className="text-sm">No {metric.label.toLowerCase()} entries yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
