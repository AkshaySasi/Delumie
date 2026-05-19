import { motion } from "framer-motion";
import { Check } from "lucide-react";

export interface ModelOption {
  id: string;
  name: string;
  description: string;
  size: string;
  recommended?: boolean;
  tags: string[];
}

const MODELS: ModelOption[] = [
  {
    id: "meditron:7b",
    name: "Meditron 7B",
    description: "Lightweight medical model. Fast everyday health advice.",
    size: "3.8 GB",
    tags: ["Fast", "Lightweight"],
  },
  {
    id: "MedAIBase/MedGemma1.5:4b",
    name: "MedGemma 4B",
    description: "Clinical-grade AI. Best balance of accuracy and performance.",
    size: "7.8 GB",
    recommended: true,
    tags: ["Recommended", "Clinical"],
  },
  {
    id: "MedAIBase/MedGemma1.5:27b",
    name: "MedGemma 27B",
    description: "Highest accuracy for complex health analysis. Needs 16 GB RAM.",
    size: "16 GB",
    tags: ["Advanced", "High RAM"],
  },
];

const EMOJIS = ["⚡", "🩺", "🧠"];

interface ModelSelectionProps {
  onSelect: (modelId: string) => void;
  selectedModel: string | null;
}

export default function ModelSelection({ onSelect, selectedModel }: ModelSelectionProps) {
  return (
    <div className="space-y-3 w-full">
      {MODELS.map((model, i) => (
        <motion.button
          key={model.id}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect(model.id)}
          className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all ${
            selectedModel === model.id
              ? "border-sage-500 bg-sage-50/70 shadow-lg shadow-sage-500/10"
              : "border-gray-200/70 bg-white/40 hover:border-sage-300 hover:bg-white/60"
          }`}
        >
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0 transition-colors ${
              selectedModel === model.id ? "bg-sage-100" : "bg-gray-100"
            }`}
          >
            {EMOJIS[i]}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-sm" style={{ color: "var(--text)" }}>
                {model.name}
              </span>
              {model.recommended && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-sage-100 text-sage-700 font-semibold">
                  RECOMMENDED
                </span>
              )}
            </div>
            <p className="text-xs mt-0.5 leading-relaxed" style={{ color: "var(--text-muted)" }}>
              {model.description}
            </p>
          </div>
          <div className="flex flex-col items-end gap-2 flex-shrink-0">
            <span className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
              {model.size}
            </span>
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                selectedModel === model.id ? "bg-sage-600 border-sage-600" : "border-gray-300"
              }`}
            >
              {selectedModel === model.id && <Check size={11} className="text-white" />}
            </div>
          </div>
        </motion.button>
      ))}
    </div>
  );
}
