import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { X, Save, RotateCcw, User, Settings as SettingsIcon, Check, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ModelSelection from "./ModelSelection";

interface ProfileModalProps {
    onClose: () => void;
    onReset: () => void;
    onModelChange: (model: string) => void;
    isOpen: boolean;
}

interface UserProfile {
    name: string;
    age: number;
    gender: string;
    goals: string;
    medical_history: string;
    model: string;
}

export default function ProfileModal({ onClose, onReset, onModelChange, isOpen }: ProfileModalProps) {
    const [activeTab, setActiveTab] = useState<"profile" | "settings">("profile");
    const [showConfirmReset, setShowConfirmReset] = useState(false);
    const [alsoRemoveModel, setAlsoRemoveModel] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");
    const [pendingModel, setPendingModel] = useState<string | null>(null);

    const [formData, setFormData] = useState<UserProfile>({
        name: "",
        age: 0,
        gender: "",
        goals: "",
        medical_history: "",
        model: "MedAIBase/MedGemma1.5:4b", // default
    });

    useEffect(() => {
        if (isOpen) {
            fetchProfile();
            setSaveStatus("idle");
            setPendingModel(null);
        }
    }, [isOpen]);

    async function fetchProfile() {
        setIsLoading(true);
        try {
            const profile: any = await invoke("get_user_profile");
            if (profile) {
                setFormData(profile);
            }
        } catch (e) {
            console.error("Failed to fetch profile:", e);
        } finally {
            setIsLoading(false);
        }
    }

    const updateField = (field: keyof UserProfile, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setSaveStatus("idle");
    };

    async function handleSave() {
        setIsLoading(true);
        setSaveStatus("idle");
        try {
            await invoke("save_user_profile", { profile: formData });
            setSaveStatus("success");
            setTimeout(() => setSaveStatus("idle"), 3000);
        } catch (e) {
            console.error("Failed to save:", e);
            setSaveStatus("error");
            alert("Failed to save profile: " + e);
        } finally {
            setIsLoading(false);
        }
    }

    async function handleReset() {
        try {
            if (alsoRemoveModel && formData.model) {
                await invoke("remove_model", { modelName: formData.model }).catch(() => {});
            }
            await invoke("reset_app");
            localStorage.clear();
            onReset();
        } catch (e) {
            console.error("Failed to reset:", e);
            alert("Failed to reset application: " + e);
        }
    }

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[85vh] h-full"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                        <h2 className="text-xl font-bold text-sage-800">Your Profile</h2>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Tabs */}
                    <div className="flex border-b border-gray-100 flex-none">
                        <button
                            onClick={() => setActiveTab("profile")}
                            className={`flex-1 py-4 font-medium text-sm transition-colors flex items-center justify-center gap-2 ${activeTab === "profile"
                                ? "text-sage-700 border-b-2 border-sage-500 bg-sage-50/50"
                                : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
                                }`}
                        >
                            <User size={16} /> Edit Profile
                        </button>
                        <button
                            onClick={() => setActiveTab("settings")}
                            className={`flex-1 py-4 font-medium text-sm transition-colors flex items-center justify-center gap-2 ${activeTab === "settings"
                                ? "text-sage-700 border-b-2 border-sage-500 bg-sage-50/50"
                                : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
                                }`}
                        >
                            <SettingsIcon size={16} /> Settings
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
                        {isLoading && !formData.name ? (
                            <div className="flex justify-center items-center h-40">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sage-600"></div>
                            </div>
                        ) : activeTab === "profile" ? (
                            <div className="space-y-5">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">Name</label>
                                        <input
                                            type="text"
                                            className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sage-200 focus:border-sage-400 outline-none transition bg-gray-50/50 focus:bg-white"
                                            placeholder="Your Name"
                                            value={formData.name}
                                            onChange={(e) => updateField("name", e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">Age</label>
                                        <input
                                            type="number"
                                            className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sage-200 focus:border-sage-400 outline-none transition bg-gray-50/50 focus:bg-white"
                                            placeholder="Age"
                                            value={formData.age}
                                            onChange={(e) => updateField("age", parseInt(e.target.value) || 0)}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Gender</label>
                                    <select
                                        className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sage-200 focus:border-sage-400 outline-none transition bg-gray-50/50 focus:bg-white text-gray-700"
                                        value={formData.gender}
                                        onChange={(e) => updateField("gender", e.target.value)}
                                    >
                                        <option value="">Select Gender</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="non-binary">Non-binary</option>
                                        <option value="prefer-not-to-say">Prefer not to say</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Health Goals</label>
                                    <textarea
                                        className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sage-200 focus:border-sage-400 outline-none transition bg-gray-50/50 focus:bg-white min-h-[80px]"
                                        placeholder="e.g. Sleep better, run 5k..."
                                        value={formData.goals}
                                        onChange={(e) => updateField("goals", e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Medical History</label>
                                    <textarea
                                        className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sage-200 focus:border-sage-400 outline-none transition bg-gray-50/50 focus:bg-white min-h-[100px]"
                                        placeholder="Any conditions, allergies, or medications? (Private & Local)"
                                        value={formData.medical_history}
                                        onChange={(e) => updateField("medical_history", e.target.value)}
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div>
                                    <h3 className="font-semibold text-gray-700 mb-1">AI Model</h3>
                                    <p className="text-xs text-gray-400 mb-3">
                                        Switching will re-download the new model (one-time, ~4–16 GB).
                                    </p>
                                    <ModelSelection
                                        selectedModel={pendingModel ?? formData.model}
                                        onSelect={(model) => setPendingModel(model)}
                                    />
                                    {pendingModel && pendingModel !== formData.model && (
                                        <button
                                            onClick={async () => {
                                                setIsLoading(true);
                                                try {
                                                    await invoke("save_user_profile", {
                                                        profile: { ...formData, model: pendingModel },
                                                    });
                                                    onModelChange(pendingModel);
                                                } catch {
                                                    alert("Failed to switch model.");
                                                } finally {
                                                    setIsLoading(false);
                                                }
                                            }}
                                            disabled={isLoading}
                                            className="mt-4 w-full py-3 bg-sage-700 text-white rounded-xl font-semibold hover:bg-sage-800 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                                        >
                                            <RefreshCw size={16} />
                                            Switch to {pendingModel}
                                        </button>
                                    )}
                                </div>

                                <div>
                                    <h3 className="font-semibold text-gray-700 mb-2">Danger Zone</h3>
                                    <p className="text-sm text-gray-500 mb-4">
                                        Resets your profile, all chats, health logs, and memories.
                                        Your downloaded AI model is <span className="font-semibold text-gray-700">kept</span> by default.
                                    </p>

                                    {!showConfirmReset ? (
                                        <button
                                            onClick={() => { setShowConfirmReset(true); setAlsoRemoveModel(false); }}
                                            className="w-full py-3 border border-red-200 text-red-600 rounded-xl hover:bg-red-50 transition-colors font-semibold flex items-center justify-center gap-2"
                                        >
                                            <RotateCcw size={18} /> Reset Application
                                        </button>
                                    ) : (
                                        <div className="bg-red-50 p-4 rounded-xl border border-red-100 space-y-3">
                                            <p className="text-red-800 font-semibold text-sm">This cannot be undone.</p>

                                            <ul className="text-xs text-red-700 space-y-1 pl-1">
                                                <li>✕ &nbsp;Profile &amp; personal info</li>
                                                <li>✕ &nbsp;All chat history</li>
                                                <li>✕ &nbsp;Health logs &amp; memories</li>
                                            </ul>

                                            {/* Optional: also remove the model */}
                                            <label className="flex items-start gap-2.5 cursor-pointer group">
                                                <input
                                                    type="checkbox"
                                                    checked={alsoRemoveModel}
                                                    onChange={(e) => setAlsoRemoveModel(e.target.checked)}
                                                    className="mt-0.5 accent-red-600 cursor-pointer"
                                                />
                                                <span className="text-xs text-red-700 leading-relaxed">
                                                    Also remove downloaded AI model
                                                    <span className="text-red-400"> (frees up disk space, requires re-download)</span>
                                                </span>
                                            </label>

                                            <div className="flex gap-2 pt-1">
                                                <button
                                                    onClick={handleReset}
                                                    className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium text-sm"
                                                >
                                                    {alsoRemoveModel ? "Wipe Everything" : "Reset Profile"}
                                                </button>
                                                <button
                                                    onClick={() => setShowConfirmReset(false)}
                                                    className="flex-1 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 font-medium text-sm"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer Actions (Only for Profile Tab) */}
                    {activeTab === "profile" && (
                        <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3 flex-none">
                            <button onClick={onClose} className="px-5 py-2.5 text-gray-500 font-medium hover:bg-gray-100 rounded-xl transition-colors">
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={isLoading}
                                className="px-6 py-2.5 bg-sage-700 text-white font-medium rounded-xl hover:bg-sage-800 transition-all shadow-lg shadow-sage-200 active:scale-95 disabled:opacity-70 flex items-center gap-2"
                            >
                                {saveStatus === "success" ? (
                                    <> <Check size={18} /> Saved </>
                                ) : (
                                    <> <Save size={18} /> Save Changes </>
                                )}
                            </button>
                        </div>
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
