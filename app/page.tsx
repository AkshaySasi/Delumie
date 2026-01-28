"use client";

import Link from "next/link";
import { ArrowRight, Shield, Zap, Brain, Check, Database, Lock, Download } from "lucide-react";
import { motion } from "framer-motion";
import InteractiveDemo from "./components/InteractiveDemo";

export default function Home() {
    return (
        <div className="min-h-screen bg-[#FDFBF7] text-slate-900 font-sans selection:bg-sage-200 overflow-x-hidden">

            {/* Decorative Background */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
                <div className="absolute top-0 left-0 right-0 h-[400px] bg-gradient-to-b from-[#e3ebe6]/30 to-transparent" />
                <svg className="absolute top-0 left-0 w-full h-[300px]" viewBox="0 0 1440 320" preserveAspectRatio="none">
                    <path fill="#e3ebe6" fillOpacity="0.3" d="M0,96L48,112C96,128,192,160,288,181.3C384,203,480,213,576,202.7C672,192,768,160,864,154.7C960,149,1056,171,1152,165.3C1248,160,1344,128,1392,112L1440,96L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"></path>
                </svg>
            </div>

            {/* Navbar - Glassmorphic */}
            <nav className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4">
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white/30 backdrop-blur-2xl backdrop-saturate-150 border border-white/30 shadow-2xl shadow-sage-900/10 rounded-full px-4 md:px-6 py-2 md:py-3 flex items-center gap-3 md:gap-12"
                    style={{ WebkitBackdropFilter: 'blur(40px) saturate(150%)', backdropFilter: 'blur(40px) saturate(150%)' }}
                >
                    <Link href="/" className="flex items-center gap-1.5">
                        <img src="/logo.png" alt="Delumie" className="w-10 h-10 md:w-14 md:h-14 logo-depth" />
                        <span className="text-slate-900 font-black text-base md:text-xl hidden sm:block">
                            Delum<span className="relative inline-block">ı<span className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#52796f] rounded-full"></span></span>e<span className="text-[#52796f]">.</span>
                        </span>
                    </Link>

                    <div className="hidden md:flex items-center gap-6 font-medium text-sm text-slate-500">
                        <Link href="#how-it-works" className="hover:text-[#2f4540] transition-colors">How it works</Link>
                        <Link href="/privacy" className="hover:text-[#2f4540] transition-colors">Privacy</Link>
                        <Link href="/support" className="hover:text-[#2f4540] transition-colors flex items-center gap-1">
                            <span>☕</span> Support
                        </Link>
                    </div>

                    <Link
                        href="/download"
                        className="bg-[#52796f] hover:bg-[#3f5d56] text-white px-4 py-1.5 md:px-6 md:py-2 rounded-full font-bold text-[10px] md:text-xs tracking-wide transition-all shadow-lg shadow-[#52796f]/20 active:scale-95">
                        Download
                    </Link>
                </motion.div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-24 pb-8 md:pt-28 md:pb-12 px-6 max-w-7xl mx-auto">
                <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">

                    {/* Left: Text Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7 }}
                        className="relative z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 backdrop-blur border border-white/60 text-[#52796f] text-[10px] font-bold tracking-wider mb-4 md:mb-8 uppercase shadow-sm">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#52796f] opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#52796f]"></span>
                            </span>
                            V0.1.0 BETA IS LIVE
                        </motion.div>

                        <h1 className="text-4xl md:text-7xl font-black tracking-tight text-slate-900 mb-4 md:mb-6 leading-[1.1]">
                            Your personal healthcare AI <br />
                            <span className="text-[#69927d] text-2xl md:text-5xl">Private - Local - Offline</span>
                        </h1>

                        <p className="text-base md:text-xl text-slate-600 max-w-xl mb-6 md:mb-8 leading-relaxed">
                            Delumie gives personalized answers using your health data - securely stored on your device, works completely offline.
                        </p>

                        <div className="flex flex-wrap items-center gap-4">
                            <Link
                                href="/download"
                                className="px-6 py-3 md:px-8 md:py-4 bg-[#52796f] text-white rounded-xl font-bold text-sm md:text-base hover:bg-[#3f5d56] transition-all shadow-xl shadow-[#52796f]/20 flex items-center gap-2 group">
                                Download Beta
                                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link
                                href="#how-it-works"
                                className="px-6 py-3 md:px-8 md:py-4 bg-white text-slate-700 border border-slate-200 rounded-xl font-bold text-sm md:text-base hover:bg-slate-50 transition-all shadow-sm">
                                How it works
                            </Link>
                        </div>
                    </motion.div>

                    {/* Right: Phone Mockup */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        className="hidden md:block relative mt-20 md:mt-12">
                        {/* Decorative Elements */}
                        <div className="absolute -top-10 -right-10 w-64 h-64 bg-[#c5d6cc]/30 rounded-full blur-3xl" />
                        <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-[#a3beb0]/20 rounded-full blur-2xl" />

                        {/* Phone Container */}
                        <div className="relative mx-auto border-[14px] border-gray-800 bg-gray-800 rounded-[3rem] h-[650px] w-[320px] shadow-2xl">
                            {/* Notch */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[30px] w-[120px] bg-gray-800 rounded-b-2xl z-10"></div>

                            {/* Screen */}
                            <div className="rounded-[2.2rem] overflow-hidden bg-white h-full flex flex-col relative">
                                {/* Status Bar */}
                                <div className="h-10 bg-white flex justify-between items-center px-6 text-[10px] font-medium text-slate-800 pt-4">
                                    <span>9:41</span>
                                    <div className="flex gap-1">
                                        <span>100%</span>
                                        <span>📶</span>
                                    </div>
                                </div>

                                {/* App Header */}
                                <div className="px-5 py-3 bg-white border-b border-gray-100 flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full flex items-center justify-center overflow-hidden">
                                        <img src="/logo.png" alt="Delumie" className="w-full h-full object-cover logo-depth" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-sm font-bold text-slate-900">Delumie</div>
                                        <div className="text-[10px] text-green-500 flex items-center gap-1">
                                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> AI Healthcare companion
                                        </div>
                                    </div>
                                </div>

                                {/* Chat Messages */}
                                <div className="flex-1 bg-[#FAF9F6] p-4 space-y-3 overflow-hidden">
                                    <div className="bg-white p-3 rounded-2xl rounded-tl-sm shadow-sm border border-gray-50 max-w-[85%] text-[11px] text-slate-700 leading-relaxed">
                                        Hi, I'm <span className="font-bold text-[#52796f]">Delumie</span>, your AI healthcare companion. Based on your medical records, I can help with nutrition advice for your health goals!
                                    </div>

                                    <div className="bg-[#52796f] p-3 rounded-2xl rounded-tr-sm shadow-md max-w-[80%] ml-auto text-white text-[11px] leading-relaxed">
                                        Can I eat chapathis with my gluten sensitivity? ✓
                                    </div>

                                    <div className="bg-white p-3 rounded-2xl rounded-tl-sm shadow-sm border border-gray-50 max-w-[90%]">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="bg-green-100 text-green-700 text-[9px] px-1.5 py-0.5 rounded font-bold">SAFE</span>
                                            <span className="text-[9px] text-slate-400">Analysis complete</span>
                                        </div>
                                        <p className="text-[11px] text-slate-700 leading-relaxed mb-2">
                                            Based on your profile, <span className="font-semibold text-[#52796f]">regular wheat chapathis aren't suitable</span>. Try gluten-free alternatives like ragi or jowar rotis instead!
                                        </p>
                                        <div className="h-20 bg-gradient-to-br from-[#e3ebe6] to-[#f4f7f5] rounded-lg border border-[#c5d6cc] flex items-center justify-center text-[9px] text-[#52796f] font-medium">
                                            🌾 Allergy-safe alternatives
                                        </div>
                                    </div>

                                    {/* Fade overlay */}
                                    <div className="absolute bottom-[72px] left-0 right-0 h-12 bg-gradient-to-t from-[#FAF9F6] to-transparent pointer-events-none" />
                                </div>

                                {/* Input Bar */}
                                <div className="p-4 bg-white border-t border-gray-100">
                                    <div className="h-10 bg-gray-50 rounded-full border border-gray-100 flex items-center px-4 justify-between">
                                        <span className="text-xs text-gray-400">Type a message...</span>
                                        <div className="w-6 h-6 bg-[#52796f] rounded-full flex items-center justify-center text-white shadow-md">
                                            <ArrowRight size={12} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Floating Badge */}
                        <motion.div
                            animate={{ y: [0, 8, 0] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute -left-8 top-28 hidden lg:block">
                            <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/60">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                        <Check size={18} strokeWidth={3} />
                                    </div>
                                    <div>
                                        <div className="text-xs font-bold text-slate-900">100% Private</div>
                                        <div className="text-[10px] text-slate-500">No cloud sync</div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Interactive How It Works Demo */}
            <InteractiveDemo />


            {/* Footer with Decorative Wave */}
            < footer className="relative bg-white pt-12 pb-8 overflow-hidden" >
                <svg className="absolute bottom-0 left-0 w-full h-32" viewBox="0 0 1440 120" preserveAspectRatio="none">
                    <path fill="#e3ebe6" fillOpacity="0.4" d="M0,64L48,58.7C96,53,192,43,288,48C384,53,480,75,576,80C672,85,768,75,864,69.3C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"></path>
                </svg>

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6 md:gap-8 mb-8">
                        <div className="flex items-center gap-2">
                            <img src="/logo.png" alt="Delumie" className="w-12 h-12 logo-depth" />
                            <span className="font-bold text-slate-900 text-lg">Delumie<span className="text-[#52796f]">.</span></span>
                        </div>

                        <div className="flex gap-8 font-medium text-sm text-slate-500">
                            <Link href="/download" className="hover:text-[#52796f] transition-colors">Download</Link>
                            <Link href="/privacy" className="hover:text-[#52796f] transition-colors">Privacy</Link>
                            <Link href="/support" className="hover:text-[#52796f] transition-colors">Support</Link>
                        </div>
                    </div>

                    <div className="text-center text-sm text-slate-400">
                        <p>© 2026 Delumie. Open source, privacy-first.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
