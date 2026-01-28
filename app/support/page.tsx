"use client";

import { motion } from "framer-motion";
import { Coffee, Heart } from "lucide-react";
import Link from "next/link";

export default function SupportPage() {
    return (
        <div className="min-h-screen bg-[#FFFDF5] text-slate-800 font-sans flex flex-col">
            <nav className="p-6 flex justify-between items-center max-w-7xl mx-auto w-full">
                <Link href="/" className="text-2xl font-bold text-sage-800 tracking-tighter">
                    Delumie<span className="text-sage-500">.</span>
                </Link>
                <Link href="/" className="text-sm font-medium text-slate-500 hover:text-sage-700 transition-colors">
                    Back to Home
                </Link>
            </nav>

            <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
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
                    className="text-4xl md:text-5xl font-black mb-6 text-slate-900 tracking-tight"
                >
                    Fuel the Development
                </motion.h1>

                <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-xl text-slate-600 max-w-md mx-auto mb-10 leading-relaxed"
                >
                    Delumie is free and open source. If you love using it, consider buying me a coffee to keep the updates coming!
                </motion.p>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-4 w-full max-w-sm"
                >
                    <a
                        href="https://buymeacoffee.com/akshaysasi"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-3 w-full py-4 bg-[#FFDD00] text-black font-bold text-lg rounded-2xl hover:bg-[#FFEA00] transition-transform hover:-translate-y-1 shadow-xl shadow-yellow-400/20 active:scale-95"
                    >
                        <Heart size={24} className="fill-black" />
                        Buy me a Coffee
                    </a>

                    <p className="text-sm text-slate-400">
                        Managed by Akshay Sasi
                    </p>
                </motion.div>

                {/* Optional QR Code Placeholder */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-12 bg-white p-4 rounded-xl shadow-sm border border-slate-100 rotate-2 hover:rotate-0 transition-transform duration-500"
                >
                    {/* You would put the real QR image here */}
                    <div className="w-32 h-32 bg-slate-100 rounded-lg flex items-center justify-center text-xs text-slate-400">
                        [QR Code]
                    </div>
                </motion.div>
            </main>
        </div>
    );
}
