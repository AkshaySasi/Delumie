import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { invoke } from "@tauri-apps/api/core";

const GENDERS = ["Male", "Female", "Non-binary", "Prefer not to say"];

const MODELS = [
  {
    id: "meditron:7b",
    name: "Meditron 7B",
    desc: "Lightweight medical model. Fast everyday health advice.",
    size: "3.8 GB",
    emoji: "⚡",
    badge: null,
  },
  {
    id: "MedAIBase/MedGemma1.5:4b",
    name: "MedGemma 4B",
    desc: "Clinical-grade AI. Best balance of accuracy and performance.",
    size: "7.8 GB",
    emoji: "🩺",
    badge: "RECOMMENDED",
  },
  {
    id: "MedAIBase/MedGemma1.5:27b",
    name: "MedGemma 27B",
    desc: "Highest accuracy for complex health analysis. Needs 16 GB RAM.",
    size: "16 GB",
    emoji: "🧠",
    badge: "ADVANCED",
  },
];

const GOAL_TAGS = [
  "Better sleep", "Weight management", "Lower cholesterol", "Manage stress",
  "Blood pressure", "Improve diet", "Stay active", "Manage diabetes",
  "More energy", "Mental wellness", "Track vitals", "Quit smoking",
];

const spring = { type: "spring" as const, damping: 26, stiffness: 220 };

const pageVariants = {
  enter: (d: number) => ({ x: d * 48, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (d: number) => ({ x: d * -48, opacity: 0 }),
};

export default function Onboarding({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [model, setModel] = useState("MedAIBase/MedGemma1.5:4b");
  const [goals, setGoals] = useState<string[]>([]);
  const [customGoal, setCustomGoal] = useState("");
  const [saving, setSaving] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);

  const STEPS = 4; // steps 1–4 (step 0 = welcome)

  const go = (n: number) => {
    setDir(n > step ? 1 : -1);
    setStep(n);
  };
  const next = () => go(step + 1);
  const back = () => go(step - 1);

  useEffect(() => {
    if (step === 1) setTimeout(() => nameRef.current?.focus(), 320);
  }, [step]);

  const adjustAge = (delta: number) => {
    setAge((a) => String(Math.min(120, Math.max(1, (parseInt(a) || 25) + delta))));
  };

  const toggleGoal = (g: string) =>
    setGoals((prev) =>
      prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]
    );

  const addCustomGoal = () => {
    const trimmed = customGoal.trim();
    if (trimmed && !goals.includes(trimmed)) {
      setGoals((prev) => [...prev, trimmed]);
    }
    setCustomGoal("");
  };

  const handleComplete = async () => {
    setSaving(true);
    try {
      await invoke("save_user_profile", {
        profile: {
          name: name.trim() || "Friend",
          age: parseInt(age) || 0,
          gender,
          goals: goals.join(", "),
          medical_history: "",
          model,
        },
      });
      onComplete();
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const steps = [
    /* ── 0: Welcome ─────────────────────────────────────────────────── */
    <motion.div
      key="welcome"
      custom={dir}
      variants={pageVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={spring}
      className="text-center space-y-10 flex flex-col items-center"
    >
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", damping: 18, stiffness: 140, delay: 0.05 }}
        className="relative"
      >
        <div className="absolute inset-0 rounded-full bg-sage-300/30 blur-2xl scale-150" />
        <img
          src="/logo.png"
          alt="Delumie"
          className="relative w-28 h-28 logo-depth-strong drop-shadow-xl"
        />
      </motion.div>

      <motion.div
        initial={{ y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.22, ...spring }}
        className="space-y-3"
      >
        <h1 className="text-5xl font-bold tracking-tight" style={{ color: "var(--sage)" }}>
          Delumie
        </h1>
        <p className="text-xl font-medium text-slate-500">Your private health companion</p>
        <p className="text-gray-400 max-w-xs mx-auto leading-relaxed text-sm mt-2">
          AI-powered health insights — fully private, always on your device.
        </p>
      </motion.div>

      <motion.button
        initial={{ y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, ...spring }}
        whileHover={{ scale: 1.05, boxShadow: "0 12px 32px rgba(82,121,111,0.28)" }}
        whileTap={{ scale: 0.97 }}
        onClick={next}
        className="flex items-center gap-3 px-10 py-4 rounded-full text-white font-semibold text-lg shadow-lg"
        style={{ background: "linear-gradient(135deg, #52796f, #3f5d56)" }}
      >
        Begin <ArrowRight size={20} />
      </motion.button>
    </motion.div>,

    /* ── 1: Name ─────────────────────────────────────────────────────── */
    <motion.div
      key="name"
      custom={dir}
      variants={pageVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={spring}
      className="space-y-10 text-center"
    >
      <div className="space-y-2">
        <p className="text-sm font-semibold text-sage-500 uppercase tracking-widest">Step 1 of 4</p>
        <h2 className="text-4xl font-bold text-slate-800">What should I call you?</h2>
      </div>

      <input
        ref={nameRef}
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && name.trim() && next()}
        placeholder="Your name"
        className="block w-full max-w-xs mx-auto text-center text-2xl font-semibold py-3 px-4 rounded-2xl border-2 border-sage-200 focus:border-sage-500 outline-none bg-white/70 backdrop-blur-sm transition-all placeholder:text-gray-300"
      />

      <Nav onBack={back} onNext={next} nextDisabled={!name.trim()} />
    </motion.div>,

    /* ── 2: About ────────────────────────────────────────────────────── */
    <motion.div
      key="about"
      custom={dir}
      variants={pageVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={spring}
      className="space-y-8 text-center"
    >
      <div className="space-y-2">
        <p className="text-sm font-semibold text-sage-500 uppercase tracking-widest">Step 2 of 4</p>
        <h2 className="text-4xl font-bold text-slate-800">About you</h2>
        <p className="text-gray-400 text-sm">Helps personalise your health companion</p>
      </div>

      {/* Age stepper */}
      <div className="space-y-3">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Age</p>
        <div className="flex items-center justify-center gap-5">
          <motion.button
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.88 }}
            onClick={() => adjustAge(-1)}
            className="w-11 h-11 rounded-full bg-sage-100 text-sage-700 text-xl font-bold hover:bg-sage-200 transition-colors shadow-sm"
          >
            −
          </motion.button>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="—"
            min="1"
            max="120"
            className="w-24 text-center text-5xl font-bold text-slate-800 bg-transparent border-b-2 border-sage-300 focus:border-sage-600 outline-none py-1 transition-colors"
          />
          <motion.button
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.88 }}
            onClick={() => adjustAge(1)}
            className="w-11 h-11 rounded-full bg-sage-100 text-sage-700 text-xl font-bold hover:bg-sage-200 transition-colors shadow-sm"
          >
            +
          </motion.button>
        </div>
      </div>

      {/* Gender pills */}
      <div className="space-y-3">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Gender</p>
        <div className="flex flex-wrap justify-center gap-2.5">
          {GENDERS.map((g) => (
            <motion.button
              key={g}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setGender((prev) => (prev === g ? "" : g))}
              className={`px-5 py-2 rounded-full text-sm font-medium border-2 transition-all ${
                gender === g
                  ? "bg-sage-600 border-sage-600 text-white shadow-md shadow-sage-600/20"
                  : "border-sage-200 text-gray-500 bg-white/50 hover:border-sage-400"
              }`}
            >
              {g}
            </motion.button>
          ))}
        </div>
      </div>

      <Nav onBack={back} onNext={next} />
    </motion.div>,

    /* ── 3: Model ────────────────────────────────────────────────────── */
    <motion.div
      key="model"
      custom={dir}
      variants={pageVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={spring}
      className="space-y-6"
    >
      <div className="text-center space-y-2">
        <p className="text-sm font-semibold text-sage-500 uppercase tracking-widest">Step 3 of 4</p>
        <h2 className="text-4xl font-bold text-slate-800">Your AI companion</h2>
        <p className="text-gray-400 text-sm">Choose the model — you can change it later</p>
      </div>

      <div className="space-y-3">
        {MODELS.map((m, i) => (
          <motion.button
            key={m.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.07, ...spring }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setModel(m.id)}
            className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all ${
              model === m.id
                ? "border-sage-500 bg-sage-50/70 shadow-lg shadow-sage-500/10"
                : "border-gray-200/70 bg-white/40 hover:border-sage-300 hover:bg-white/60"
            }`}
          >
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 transition-colors ${
                model === m.id ? "bg-sage-100" : "bg-gray-100"
              }`}
            >
              {m.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-gray-800">{m.name}</span>
                {m.badge && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-sage-100 text-sage-700 font-semibold">
                    {m.badge}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{m.desc}</p>
            </div>
            <div className="flex flex-col items-end gap-2 flex-shrink-0">
              <span className="text-xs text-gray-400 font-medium">{m.size}</span>
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                  model === m.id ? "bg-sage-600 border-sage-600" : "border-gray-300"
                }`}
              >
                {model === m.id && <Check size={11} className="text-white" />}
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      <Nav onBack={back} onNext={next} />
    </motion.div>,

    /* ── 4: Goals ────────────────────────────────────────────────────── */
    <motion.div
      key="goals"
      custom={dir}
      variants={pageVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={spring}
      className="space-y-7"
    >
      <div className="text-center space-y-2">
        <p className="text-sm font-semibold text-sage-500 uppercase tracking-widest">Step 4 of 4</p>
        <h2 className="text-4xl font-bold text-slate-800">Your health goals</h2>
        <p className="text-gray-400 text-sm">Pick what matters to you — or skip</p>
      </div>

      <div className="flex flex-wrap justify-center gap-2.5">
        {GOAL_TAGS.map((g, i) => (
          <motion.button
            key={g}
            initial={{ opacity: 0, scale: 0.75 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.035, type: "spring", damping: 20, stiffness: 260 }}
            whileHover={{ scale: 1.07 }}
            whileTap={{ scale: 0.93 }}
            onClick={() => toggleGoal(g)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border-2 transition-all ${
              goals.includes(g)
                ? "bg-sage-600 border-sage-600 text-white shadow-md shadow-sage-600/20"
                : "border-sage-200 text-gray-500 bg-white/60 hover:border-sage-400"
            }`}
          >
            {goals.includes(g) && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 16 }}
              >
                <Check size={11} />
              </motion.span>
            )}
            {g}
          </motion.button>
        ))}
        {/* Custom goals added by user appear as removable tags */}
        {goals
          .filter((g) => !GOAL_TAGS.includes(g))
          .map((g) => (
            <motion.button
              key={g}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", damping: 18 }}
              whileHover={{ scale: 1.07 }}
              whileTap={{ scale: 0.93 }}
              onClick={() => toggleGoal(g)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border-2 bg-sage-600 border-sage-600 text-white shadow-md shadow-sage-600/20"
            >
              <Check size={11} />
              {g}
              <span className="ml-0.5 opacity-70 text-xs">×</span>
            </motion.button>
          ))}
      </div>

      {/* Custom goal input */}
      <div className="flex items-center gap-2 max-w-sm mx-auto">
        <input
          value={customGoal}
          onChange={(e) => setCustomGoal(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && customGoal.trim() && addCustomGoal()}
          placeholder="Add your own goal…"
          className="flex-1 px-4 py-2.5 rounded-full text-sm border-2 border-dashed border-sage-200 bg-white/60 outline-none focus:border-sage-400 transition-colors placeholder:text-gray-300"
        />
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={addCustomGoal}
          disabled={!customGoal.trim()}
          className="w-9 h-9 rounded-full bg-sage-600 text-white flex items-center justify-center disabled:opacity-30 transition-opacity flex-shrink-0 text-lg font-bold leading-none"
        >
          +
        </motion.button>
      </div>

      <div className="flex justify-center gap-4 pt-1">
        <button
          onClick={back}
          className="px-6 py-3 text-gray-400 hover:text-gray-600 transition-colors font-medium"
        >
          Back
        </button>
        <motion.button
          whileHover={{ scale: 1.04, boxShadow: "0 8px 24px rgba(82,121,111,0.25)" }}
          whileTap={{ scale: 0.97 }}
          onClick={handleComplete}
          disabled={saving}
          className="px-8 py-3 rounded-xl text-white font-semibold shadow-md disabled:opacity-60 transition-all"
          style={{ background: "linear-gradient(135deg, #52796f, #3f5d56)" }}
        >
          {saving
            ? "Setting up…"
            : goals.length > 0
            ? `Start with ${goals.length} goal${goals.length > 1 ? "s" : ""}`
            : "Skip & Start"}
        </motion.button>
      </div>
    </motion.div>,
  ];

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden bg-gradient-to-br from-[#f0f5f2] via-[#faf9f6] to-[#e8eeeb] text-slate-800">
      {/* Ambient blobs */}
      <div className="pointer-events-none fixed inset-0">
        <div className="blob-pulse absolute -top-40 -right-40 w-[480px] h-[480px] rounded-full bg-sage-200/30 blur-[80px]" />
        <div className="blob-pulse-delay absolute -bottom-40 -left-40 w-[480px] h-[480px] rounded-full bg-sage-300/20 blur-[80px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-white/20 blur-[60px]" />
      </div>

      {/* Progress pills — hidden on welcome */}
      <AnimatePresence>
        {step > 0 && (
          <motion.div
            key="progress"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="flex gap-2 mb-14 z-10"
          >
            {Array.from({ length: STEPS }).map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  width: step === i + 1 ? 28 : 8,
                  backgroundColor: step > i ? "#52796f" : step === i + 1 ? "#52796f" : "#d1d5db",
                  opacity: step > i ? 1 : step === i + 1 ? 1 : 0.45,
                }}
                transition={{ type: "spring", damping: 22, stiffness: 200 }}
                className="h-2 rounded-full"
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Step content */}
      <div className="relative z-10 w-full max-w-md px-6">
        <AnimatePresence mode="wait" custom={dir}>
          {steps[step]}
        </AnimatePresence>
      </div>
    </div>
  );
}

function Nav({
  onBack,
  onNext,
  nextDisabled = false,
  nextLabel = "Continue",
}: {
  onBack: () => void;
  onNext: () => void;
  nextDisabled?: boolean;
  nextLabel?: string;
}) {
  return (
    <div className="flex justify-center gap-4 pt-2">
      <button
        onClick={onBack}
        className="px-6 py-3 text-gray-400 hover:text-gray-600 font-medium transition-colors"
      >
        Back
      </button>
      <motion.button
        whileHover={{ scale: nextDisabled ? 1 : 1.04, boxShadow: nextDisabled ? "none" : "0 8px 24px rgba(82,121,111,0.22)" }}
        whileTap={{ scale: nextDisabled ? 1 : 0.97 }}
        onClick={onNext}
        disabled={nextDisabled}
        className="px-8 py-3 rounded-xl text-white font-semibold shadow-md disabled:opacity-40 transition-all"
        style={{ background: "linear-gradient(135deg, #52796f, #3f5d56)" }}
      >
        {nextLabel}
      </motion.button>
    </div>
  );
}
