"use client";

import { motion } from "framer-motion";
import { Coffee, Heart, Github, Mail } from "lucide-react";
import Link from "next/link";

export default function SupportPage() {
    return (
        <div className="min-h-screen bg-[#FFFDF5] text-slate-800 font-sans flex flex-col">
            <nav className="p-6 flex justify-between items-center max-w-7xl mx-auto w-full">
                <Link href="/" className="flex items-center gap-2">
                    <img src="/logo.png" alt="Delumie" className="w-10 h-10 logo-depth" />
                    <span className="text-xl font-bold text-sage-800 tracking-tighter">
                        Delumie<span className="text-[#52796f]">.</span>
                    </span>
                </Link>
                <Link href="/" className="text-sm font-medium text-slate-500 hover:text-[#52796f] transition-colors">
                    ← Back to Home
                </Link>
            </nav>

            <main className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-lg mx-auto w-full">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-yellow-400 w-20 h-20 rounded-full flex items-center justify-center mb-8 shadow-lg shadow-yellow-200"
                >
                    <Coffee size={40} className="text-stone-900" />
                </motion.div>

                <motion.h1
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-4xl md:text-5xl font-black mb-4 text-slate-900 tracking-tight"
                >
                    Support Delumie
                </motion.h1>

                <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-lg text-slate-600 mb-10 leading-relaxed"
                >
                    Delumie is free and open source. If it's helped you, consider buying a coffee
                    to keep the development going!
                </motion.p>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-3 w-full"
                >
                    <a
                        href="https://buymeacoffee.com/akshaysasi"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-3 w-full py-4 bg-[#FFDD00] text-black font-bold text-lg rounded-2xl hover:bg-[#FFEA00] transition-transform hover:-translate-y-1 shadow-xl shadow-yellow-400/20 active:scale-95"
                    >
                        <Heart size={22} className="fill-black" />
                        Buy me a Coffee
                    </a>

                    <a
                        href="https://github.com/AkshaySasi/Delumie"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-3 w-full py-3.5 bg-slate-900 text-white font-semibold rounded-2xl hover:bg-slate-800 transition-all active:scale-95"
                    >
                        <Github size={20} />
                        View on GitHub
                    </a>

                    <a
                        href="https://github.com/AkshaySasi/Delumie/issues"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-3 w-full py-3.5 bg-white border-2 border-slate-200 text-slate-700 font-semibold rounded-2xl hover:border-[#52796f] hover:text-[#52796f] transition-all active:scale-95"
                    >
                        <Mail size={20} />
                        Report an Issue
                    </a>
                </motion.div>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-8 text-sm text-slate-400"
                >
                    Built by <span className="font-semibold text-slate-600">Akshay Sasi</span>
                </motion.p>
            </main>

            <footer className="py-8 text-center text-sm text-slate-400 border-t border-slate-100">
                <div className="flex justify-center gap-6">
                    <Link href="/" className="hover:text-[#52796f] transition-colors">Home</Link>
                    <Link href="/privacy" className="hover:text-[#52796f] transition-colors">Privacy</Link>
                    <Link href="/download" className="hover:text-[#52796f] transition-colors">Download</Link>
                </div>
            </footer>
        </div>
    );
}
