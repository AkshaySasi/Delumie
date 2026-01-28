"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Check } from 'lucide-react';
import Link from 'next/link';

export default function InteractiveDemo() {
    const [currentStep, setCurrentStep] = useState(0);
    const [selectedModel, setSelectedModel] = useState('MedGemma1.5:4b');
    const [showAiResponse, setShowAiResponse] = useState(false);

    const steps = ['Profile', 'Model', 'Chat'];

    const models = [
        { id: 'meditron:7b', name: 'Meditron 7B', tag: 'Light', size: '3.8 GB' },
        { id: 'MedGemma1.5:4b', name: 'MedGemma 1.5 4B', tag: 'Recommended', size: '7.8 GB' },
        { id: 'MedGemma1.5:27b', name: 'MedGemma 27B', tag: 'Advanced', size: '16 GB' },
    ];

    const handleNext = () => {
        if (currentStep < 2) {
            setCurrentStep(currentStep + 1);
            if (currentStep === 1) {
                // Trigger AI response animation when entering step 3
                setTimeout(() => setShowAiResponse(true), 800);
            }
        }
    };

    const handlePrev = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
            setShowAiResponse(false);
        }
    };

    const handleReset = () => {
        setCurrentStep(0);
        setShowAiResponse(false);
    };

    return (
        <section id="how-it-works" className="relative py-20 px-6 bg-gradient-to-br from-[#f4f7f5] to-[#faf9f6] overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-20 left-10 w-72 h-72 bg-[#a3beb0]/10 rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#c5d6cc]/10 rounded-full blur-3xl" />

            <div className="max-w-6xl mx-auto relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
                        How <span className="text-[#52796f]">Delumie</span> Works
                    </h2>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Experience the complete workflow in 3 simple steps
                    </p>
                </motion.div>

                {/* Progress Dots */}
                <div className="flex justify-center items-center gap-3 mb-12">
                    {steps.map((step, index) => (
                        <div key={step} className="flex items-center gap-3">
                            <div className="flex flex-col items-center gap-2">
                                <div
                                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${index === currentStep
                                            ? 'bg-[#52796f] text-white scale-110 shadow-lg'
                                            : index < currentStep
                                                ? 'bg-[#84a995] text-white'
                                                : 'bg-gray-200 text-gray-400'
                                        }`}
                                >
                                    {index < currentStep ? <Check size={20} /> : index + 1}
                                </div>
                                <span className={`text-sm font-medium ${index === currentStep ? 'text-[#52796f]' : 'text-gray-500'}`}>
                                    {step}
                                </span>
                            </div>
                            {index < steps.length - 1 && (
                                <div className={`h-1 w-16 rounded transition-all duration-300 ${index < currentStep ? 'bg-[#84a995]' : 'bg-gray-200'}`} />
                            )}
                        </div>
                    ))}
                </div>

                {/* Demo Container */}
                <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 min-h-[500px] relative overflow-hidden">
                    <AnimatePresence mode="wait">
                        {/* Step 1: Health Profile */}
                        {currentStep === 0 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-6"
                            >
                                <div className="text-center mb-8">
                                    <h3 className="text-3xl font-bold text-slate-900 mb-2">Build Your Health Profile</h3>
                                    <p className="text-slate-600">Personalized AI guidance starts with knowing you</p>
                                </div>

                                <div className="max-w-md mx-auto space-y-4">
                                    {/* Age */}
                                    <div className="bg-[#f4f7f5] rounded-xl p-4 border-2 border-[#c5d6cc]">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-slate-600 font-medium">Age</span>
                                            <span className="text-2xl font-bold text-[#52796f]">32</span>
                                        </div>
                                    </div>

                                    {/* Gender */}
                                    <div className="flex gap-3">
                                        <div className="flex-1 bg-[#52796f] text-white rounded-xl p-4 border-2 border-[#52796f] shadow-lg">
                                            <div className="text-center">
                                                <div className="text-3xl mb-1">👨</div>
                                                <div className="font-bold">Male</div>
                                            </div>
                                        </div>
                                        <div className="flex-1 bg-gray-50 text-gray-400 rounded-xl p-4 border-2 border-gray-200">
                                            <div className="text-center">
                                                <div className="text-3xl mb-1">👩</div>
                                                <div className="font-bold">Female</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Weight */}
                                    <div className="bg-[#f4f7f5] rounded-xl p-4 border-2 border-[#c5d6cc]">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-slate-600 font-medium">Weight</span>
                                            <span className="text-xl font-bold text-[#52796f]">78 kg</span>
                                        </div>
                                    </div>

                                    {/* Dietary Preference */}
                                    <div className="bg-[#f4f7f5] rounded-xl p-4 border-2 border-[#c5d6cc]">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-slate-600 font-medium">Diet</span>
                                            <span className="text-lg font-bold text-[#52796f]">🥗 Vegetarian</span>
                                        </div>
                                    </div>

                                    {/* Privacy Note */}
                                    <div className="flex items-center gap-2 text-xs text-green-700 bg-green-50 rounded-lg p-3 border border-green-200">
                                        <Check size={16} />
                                        <span className="font-medium">Locally stored on your device • Never shared</span>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Step 2: Model Selection */}
                        {currentStep === 1 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-6"
                            >
                                <div className="text-center mb-8">
                                    <h3 className="text-3xl font-bold text-slate-900 mb-2">Choose Your AI Model</h3>
                                    <p className="text-slate-600">Pick based on your device capabilities</p>
                                </div>

                                <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
                                    {models.map((model) => (
                                        <div
                                            key={model.id}
                                            onClick={() => setSelectedModel(model.id)}
                                            className={`cursor-pointer rounded-2xl p-6 border-2 transition-all duration-300 ${selectedModel === model.id
                                                    ? 'border-[#52796f] bg-[#f4f7f5] shadow-xl scale-105'
                                                    : 'border-gray-200 bg-white hover:border-[#a3beb0] hover:shadow-lg'
                                                }`}
                                        >
                                            <div className="flex items-center justify-between mb-3">
                                                <div
                                                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedModel === model.id ? 'border-[#52796f] bg-[#52796f]' : 'border-gray-300'
                                                        }`}
                                                >
                                                    {selectedModel === model.id && <Check size={16} className="text-white" />}
                                                </div>
                                                <span
                                                    className={`text-xs font-bold px-2 py-1 rounded-full ${model.tag === 'Recommended'
                                                            ? 'bg-[#52796f] text-white'
                                                            : 'bg-gray-100 text-gray-600'
                                                        }`}
                                                >
                                                    {model.tag}
                                                </span>
                                            </div>
                                            <h4 className="font-bold text-lg text-slate-900 mb-1">{model.name}</h4>
                                            <p className="text-sm text-slate-500">{model.size}</p>
                                        </div>
                                    ))}
                                </div>

                                <div className="text-center text-sm text-slate-500 mt-6">
                                    💡 All models run <span className="font-bold text-[#52796f]">100% offline</span> after download
                                </div>
                            </motion.div>
                        )}

                        {/* Step 3: Chat Demo */}
                        {currentStep === 2 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-6"
                            >
                                <div className="text-center mb-8">
                                    <h3 className="text-3xl font-bold text-slate-900 mb-2">Ask Your Health Queries</h3>
                                    <p className="text-slate-600">Get personalized, instant answers</p>
                                </div>

                                {/* Chat Interface */}
                                <div className="max-w-2xl mx-auto bg-[#faf9f6] rounded-2xl border border-gray-200 overflow-hidden">
                                    {/* Chat Header */}
                                    <div className="bg-white border-b border-gray-200 p-4 flex items-center gap-3">
                                        <img src="/logo.png" alt="Delumie" className="w-10 h-10 logo-depth" />
                                        <div>
                                            <div className="font-bold text-slate-900">Delumie</div>
                                            <div className="flex items-center gap-1.5 text-xs text-green-600">
                                                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                                <span>Offline • MedGemma 1.5 4B</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Messages */}
                                    <div className="p-6 space-y-4 min-h-[300px]">
                                        {/* User Message */}
                                        <div className="flex justify-end">
                                            <div className="bg-[#52796f] text-white rounded-2xl rounded-tr-sm px-4 py-3 max-w-[80%] shadow-md">
                                                <p className="text-sm">Can I eat chapatis if I'm trying to lose weight?</p>
                                            </div>
                                        </div>

                                        {/* AI Response */}
                                        <AnimatePresence>
                                            {showAiResponse && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ duration: 0.5 }}
                                                    className="flex justify-start"
                                                >
                                                    <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 max-w-[85%] shadow-md border border-gray-100">
                                                        <div className="flex items-center gap-1.5 mb-2">
                                                            <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-bold">
                                                                SAFE
                                                            </span>
                                                            <span className="text-xs text-gray-400">Analysis complete</span>
                                                        </div>
                                                        <motion.p
                                                            initial={{ opacity: 0 }}
                                                            animate={{ opacity: 1 }}
                                                            transition={{ duration: 0.8, delay: 0.3 }}
                                                            className="text-sm text-slate-700 leading-relaxed"
                                                        >
                                                            Based on your profile (Male, 78kg), <strong>yes, chapatis can fit your weight loss plan!</strong>
                                                            <br /><br />
                                                            For your vegetarian diet, I recommend:
                                                            <br />• 2-3 whole wheat chapatis per meal
                                                            <br />• Pair with protein (dal, paneer)
                                                            <br />• Avoid excess ghee/oil
                                                            <br /><br />
                                                            <span className="text-[#52796f] font-medium">🎯 Est. 200-240 calories per chapati</span>
                                                        </motion.p>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        {!showAiResponse && (
                                            <div className="flex items-center gap-2 text-gray-400 text-sm">
                                                <div className="flex gap-1">
                                                    <motion.div
                                                        animate={{ opacity: [0.3, 1, 0.3] }}
                                                        transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                                                        className="w-2 h-2 bg-[#52796f] rounded-full"
                                                    />
                                                    <motion.div
                                                        animate={{ opacity: [0.3, 1, 0.3] }}
                                                        transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                                                        className="w-2 h-2 bg-[#52796f] rounded-full"
                                                    />
                                                    <motion.div
                                                        animate={{ opacity: [0.3, 1, 0.3] }}
                                                        transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                                                        className="w-2 h-2 bg-[#52796f] rounded-full"
                                                    />
                                                </div>
                                                <span>Delumie is thinking...</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* CTA */}
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 1.2 }}
                                    className="text-center mt-8"
                                >
                                    <Link
                                        href="/download"
                                        className="inline-flex items-center gap-2 px-8 py-4 bg-[#52796f] text-white rounded-xl font-bold text-lg hover:bg-[#3f5d56] transition-all shadow-xl shadow-[#52796f]/20"
                                    >
                                        Download Delumie to Start
                                        <ArrowRight size={20} />
                                    </Link>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Navigation Buttons */}
                    <div className="flex justify-between items-center mt-12">
                        <button
                            onClick={handlePrev}
                            disabled={currentStep === 0}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${currentStep === 0
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-white text-slate-700 border-2 border-gray-200 hover:border-[#52796f] hover:text-[#52796f]'
                                }`}
                        >
                            <ArrowLeft size={20} />
                            Previous
                        </button>

                        {currentStep < 2 ? (
                            <button
                                onClick={handleNext}
                                className="flex items-center gap-2 px-8 py-3 bg-[#52796f] text-white rounded-xl font-semibold hover:bg-[#3f5d56] transition-all shadow-lg"
                            >
                                Continue
                                <ArrowRight size={20} />
                            </button>
                        ) : (
                            <button
                                onClick={handleReset}
                                className="flex items-center gap-2 px-6 py-3 bg-white text-slate-700 border-2 border-gray-200 rounded-xl font-semibold hover:border-[#52796f] hover:text-[#52796f] transition-all"
                            >
                                Try Again
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
