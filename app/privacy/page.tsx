"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function Privacy() {
    return (
        <div className="min-h-screen bg-[#FDFBF7] text-slate-900 font-sans">

            {/* Navbar */}
            <nav className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4">
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white/30 backdrop-blur-2xl backdrop-saturate-150 border border-white/30 shadow-2xl shadow-sage-900/10 rounded-full px-4 md:px-6 py-2 md:py-3 flex items-center gap-3 md:gap-12"
                    style={{ WebkitBackdropFilter: "blur(40px) saturate(150%)", backdropFilter: "blur(40px) saturate(150%)" }}
                >
                    <Link href="/" className="flex items-center gap-1.5">
                        <img src="/logo.png" alt="Delumie" className="w-10 h-10 md:w-14 md:h-14 logo-depth" />
                        <span className="text-slate-900 font-black text-base md:text-xl hidden sm:block">
                            Delum<span className="relative inline-block">ı<span className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#52796f] rounded-full"></span></span>e<span className="text-[#52796f]">.</span>
                        </span>
                    </Link>

                    <div className="hidden md:flex items-center gap-6 font-medium text-sm text-slate-500">
                        <Link href="/#how-it-works" className="hover:text-[#2f4540] transition-colors">How it works</Link>
                        <Link href="/privacy" className="text-[#2f4540] font-semibold">Privacy</Link>
                        <Link href="/support" className="hover:text-[#2f4540] transition-colors flex items-center gap-1">
                            <span>☕</span> Support
                        </Link>
                    </div>

                    <Link
                        href="/download"
                        className="bg-[#52796f] hover:bg-[#3f5d56] text-white px-4 py-1.5 md:px-6 md:py-2 rounded-full font-bold text-[10px] md:text-xs tracking-wide transition-all shadow-lg shadow-[#52796f]/20 active:scale-95"
                    >
                        Download
                    </Link>
                </motion.div>
            </nav>

            <main className="max-w-3xl mx-auto px-6 pt-32 pb-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-4xl md:text-5xl font-black mb-4 text-slate-900">Privacy Policy</h1>
                    <p className="text-lg text-slate-500 mb-10 leading-relaxed">
                        At Delumie, we don't just "care" about your privacy — we engineered our entire product around it.
                    </p>

                    {/* Local-first promise */}
                    <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm mb-8">
                        <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                            🔒 The Local-First Promise
                        </h2>
                        <p className="text-slate-600 mb-4">
                            Delumie runs <strong>100% locally on your device</strong>. No cloud, no server, no account required.
                        </p>
                        <ul className="space-y-2 text-slate-600">
                            <li className="flex items-start gap-3">
                                <span className="text-[#52796f] mt-1 flex-shrink-0">✓</span>
                                Your health data is stored in a local database on your device only.
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-[#52796f] mt-1 flex-shrink-0">✓</span>
                                The AI model runs on your processor — not in the cloud.
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-[#52796f] mt-1 flex-shrink-0">✓</span>
                                Your conversations never leave your machine.
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-[#52796f] mt-1 flex-shrink-0">✓</span>
                                We (the developers) have zero access to your data.
                            </li>
                        </ul>
                    </div>

                    {/* Data collection */}
                    <div className="mb-8">
                        <h2 className="text-xl font-bold text-slate-900 mb-3">Data Collection</h2>
                        <p className="text-slate-600 leading-relaxed mb-3">
                            We collect <strong>no personal data</strong>. We do not track your usage, your queries, or your health metrics.
                        </p>
                        <p className="text-slate-600 leading-relaxed">
                            The only data we may receive is anonymous crash reports (if you opt-in) and standard app store installation counts (if downloaded via a store). These contain no personal information.
                        </p>
                    </div>

                    {/* External services */}
                    <div className="mb-8">
                        <h2 className="text-xl font-bold text-slate-900 mb-3">External Services</h2>
                        <p className="text-slate-600 leading-relaxed mb-3">
                            Delumie uses <strong>Ollama</strong> as the underlying AI engine. Ollama is a local-first, open-source tool. When you first install Delumie, it connects to the internet <em>only</em> to download the AI model weights to your computer.
                        </p>
                        <p className="text-slate-600 leading-relaxed">
                            After that initial download, no internet connection is required for the AI to function. All inference happens entirely on your machine.
                        </p>
                    </div>

                    {/* Updates */}
                    <div className="mb-8">
                        <h2 className="text-xl font-bold text-slate-900 mb-3">Policy Updates</h2>
                        <p className="text-slate-600 leading-relaxed">
                            We may update this policy as Delumie evolves. Since we don't have your email (we don't require accounts), please check this page periodically for changes.
                        </p>
                    </div>

                    <div className="pt-8 border-t border-slate-100 text-sm text-slate-400">
                        Last updated: January 2026
                    </div>
                </motion.div>
            </main>

            {/* Footer */}
            <footer className="py-10 bg-white border-t border-slate-100">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2 font-bold text-slate-900">
                        <img src="/logo.png" alt="Delumie" className="w-10 h-10 logo-depth" />
                        Delumie<span className="text-[#52796f]">.</span>
                    </div>
                    <div className="flex gap-6 font-medium text-sm text-slate-500">
                        <Link href="/" className="hover:text-[#52796f] transition-colors">Home</Link>
                        <Link href="/download" className="hover:text-[#52796f] transition-colors">Download</Link>
                        <Link href="/support" className="hover:text-[#52796f] transition-colors">Support</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
