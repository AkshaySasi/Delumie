"use client";

import { motion } from "framer-motion";
import { Download, Monitor, CheckCircle, AlertCircle, HelpCircle } from "lucide-react";
import Link from "next/link";

export default function DownloadPage() {
    return (
        <div className="min-h-screen bg-[#FDFBF7] text-slate-900 font-sans selection:bg-sage-200">
            {/* Navbar */}
            <nav className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4">
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="bg-white/80 backdrop-blur-xl border border-white/50 shadow-xl shadow-sage-900/5 rounded-full px-6 py-3 flex items-center gap-8 md:gap-12"
                >
                    <Link href="/" className="flex items-center gap-2">
                        <img src="/logo.png" alt="Delumie" className="w-14 h-14 logo-depth" />
                        <span className="text-sage-900 hidden sm:block">Delumie</span>
                    </Link>

                    <div className="hidden md:flex items-center gap-6 font-medium text-sm text-slate-500">
                        <Link href="/#how-it-works" className="hover:text-[#2f4540] transition-colors">How it works</Link>
                        <Link href="/privacy" className="hover:text-[#2f4540] transition-colors">Privacy</Link>
                    </div>

                    <Link
                        href="/support"
                        className="bg-[#2f4540] hover:bg-[#202f2c] text-white px-5 py-2 rounded-full font-bold text-xs tracking-wide transition-all shadow-lg active:scale-95"
                    >
                        Support
                    </Link>
                </motion.div>
            </nav>

            <main className="max-w-6xl mx-auto px-6 py-32 md:py-40">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-20"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-100 text-slate-500 font-bold text-xs tracking-wide mb-6 shadow-sm">
                        <Download size={14} className="text-[#52796f]" />
                        VERSION 0.1.0 BETA
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight text-slate-900">
                        Download <span className="text-[#52796f]">Delumie</span>
                    </h1>
                    <p className="text-xl text-slate-500 max-w-2xl mx-auto">
                        Your private AI health companion. Download for Windows and take control of your health data.
                    </p>
                </motion.div>

                {/* Main Download Card */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-3xl p-8 md:p-12 border border-slate-100 shadow-2xl shadow-sage-900/5 mb-12"
                >
                    <div className="flex flex-col md:flex-row gap-8 items-center">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="h-16 w-16 bg-[#52796f]/10 rounded-2xl flex items-center justify-center text-[#52796f]">
                                    <Monitor size={32} />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-black mb-1">Windows</h2>
                                    <p className="text-slate-500 text-sm">Windows 10/11 (64-bit)</p>
                                </div>
                            </div>

                            <div className="space-y-3 mb-8">
                                <div className="flex items-start gap-3">
                                    <CheckCircle size={20} className="text-green-600 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="font-semibold text-slate-800">Version 0.1.0 Beta</p>
                                        <p className="text-sm text-slate-500">Released January 2026</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <CheckCircle size={20} className="text-green-600 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="font-semibold text-slate-800">~15 MB Download</p>
                                        <p className="text-sm text-slate-500">Quick installer, no bloat</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <CheckCircle size={20} className="text-green-600 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="font-semibold text-slate-800">Requires ~4GB RAM</p>
                                        <p className="text-sm text-slate-500">AI model runs efficiently</p>
                                    </div>
                                </div>
                            </div>

                            <a
                                href="/Delumie-Setup.exe"
                                download
                                className="inline-flex items-center gap-3 px-8 py-4 bg-[#2f4540] text-white rounded-xl font-bold text-lg hover:bg-[#202f2c] transition-all shadow-xl shadow-[#52796f]/20 active:scale-95"
                            >
                                <Download size={24} />
                                Download for Windows
                            </a>
                        </div>

                        <div className="flex-1 bg-slate-50 rounded-2xl p-6">
                            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <HelpCircle size={20} className="text-[#52796f]" />
                                System Requirements
                            </h3>
                            <ul className="space-y-2 text-sm text-slate-600">
                                <li className="flex items-start gap-2">
                                    <span className="text-[#52796f] mt-1">•</span>
                                    <span>Windows 10 (build 1903+) or Windows 11</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-[#52796f] mt-1">•</span>
                                    <span>64-bit processor</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-[#52796f] mt-1">•</span>
                                    <span>Minimum 4GB RAM (8GB recommended)</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-[#52796f] mt-1">•</span>
                                    <span>2GB free disk space</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-[#52796f] mt-1">•</span>
                                    <span>Internet for initial AI model download</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </motion.div>

                {/* Installation Guide */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white rounded-3xl p-8 md:p-12 border border-slate-100 shadow-xl shadow-sage-900/5 mb-12"
                >
                    <h2 className="text-3xl font-black mb-8">Installation Guide</h2>

                    <div className="space-y-6">
                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-10 h-10 bg-[#52796f] text-white rounded-full flex items-center justify-center font-bold">1</div>
                            <div>
                                <h3 className="font-bold text-lg mb-2">Download the Installer</h3>
                                <p className="text-slate-600">Click the download button above. The file <code className="bg-slate-100 px-2 py-1 rounded text-sm">Delumie-Setup.exe</code> will be saved to your Downloads folder.</p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-10 h-10 bg-[#52796f] text-white rounded-full flex items-center justify-center font-bold">2</div>
                            <div>
                                <h3 className="font-bold text-lg mb-2">Run the Installer</h3>
                                <p className="text-slate-600 mb-3">Double-click the downloaded file. Windows may show a security warning—click "More info" then "Run anyway" (Delumie is safe and open-source).</p>
                                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3">
                                    <AlertCircle size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
                                    <p className="text-sm text-amber-800">Windows SmartScreen may flag new apps. This is normal for unsigned software. We're working on code signing for future releases.</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-10 h-10 bg-[#52796f] text-white rounded-full flex items-center justify-center font-bold">3</div>
                            <div>
                                <h3 className="font-bold text-lg mb-2">Complete Setup</h3>
                                <p className="text-slate-600">Follow the installation wizard. Delumie will be installed to <code className="bg-slate-100 px-2 py-1 rounded text-sm">C:\Program Files\Delumie</code> by default.</p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-10 h-10 bg-[#52796f] text-white rounded-full flex items-center justify-center font-bold">4</div>
                            <div>
                                <h3 className="font-bold text-lg mb-2">First Launch Setup</h3>
                                <p className="text-slate-600 mb-3">When you first open Delumie, it will:</p>
                                <ul className="space-y-2 text-slate-600">
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#52796f] mt-1">•</span>
                                        <span>Check if Ollama (the AI engine) is installed</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#52796f] mt-1">•</span>
                                        <span>Offer to install it automatically if missing (~500MB)</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#52796f] mt-1">•</span>
                                        <span>Download your chosen AI model (2-4GB, one-time)</span>
                                    </li>
                                </ul>
                                <p className="text-slate-600 mt-3">This process takes 5-10 minutes on first run. After that, Delumie works completely offline.</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Troubleshooting */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-slate-50 rounded-3xl p-8 md:p-12 border border-slate-100"
                >
                    <h2 className="text-2xl font-black mb-6">Troubleshooting</h2>

                    <div className="space-y-4">
                        <details className="group">
                            <summary className="cursor-pointer font-semibold text-slate-900 flex items-center gap-2 hover:text-[#52796f] transition-colors">
                                <span className="text-[#52796f]">▸</span>
                                Installer won't run / Windows Defender blocks it
                            </summary>
                            <p className="text-slate-600 mt-2 ml-6 text-sm">
                                Right-click the .exe file → Properties → check "Unblock" → Apply. Then try running again. Windows may still show SmartScreen—click "More info" → "Run anyway".
                            </p>
                        </details>

                        <details className="group">
                            <summary className="cursor-pointer font-semibold text-slate-900 flex items-center gap-2 hover:text-[#52796f] transition-colors">
                                <span className="text-[#52796f]">▸</span>
                                "Ollama failed to install" error
                            </summary>
                            <p className="text-slate-600 mt-2 ml-6 text-sm">
                                Manually download Ollama from <a href="https://ollama.com/download" className="text-[#52796f] underline" target="_blank" rel="noopener">ollama.com/download</a>, install it, then restart Delumie.
                            </p>
                        </details>

                        <details className="group">
                            <summary className="cursor-pointer font-semibold text-slate-900 flex items-center gap-2 hover:text-[#52796f] transition-colors">
                                <span className="text-[#52796f]">▸</span>
                                App is slow or crashes
                            </summary>
                            <p className="text-slate-600 mt-2 ml-6 text-sm">
                                Ensure you have at least 8GB RAM. Close other heavy applications. If problems persist, try selecting a smaller AI model in Settings (phi3:mini instead of llama3.2).
                            </p>
                        </details>

                        <details className="group">
                            <summary className="cursor-pointer font-semibold text-slate-900 flex items-center gap-2 hover:text-[#52796f] transition-colors">
                                <span className="text-[#52796f]">▸</span>
                                Still need help?
                            </summary>
                            <p className="text-slate-600 mt-2 ml-6 text-sm">
                                Join our community or contact support via <Link href="/support" className="text-[#52796f] underline">the Support page</Link>.
                            </p>
                        </details>
                    </div>
                </motion.div>

                {/* Coming Soon Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="grid md:grid-cols-2 gap-6 mt-12"
                >
                    <div className="bg-white rounded-2xl p-8 border border-slate-100 opacity-60 text-center">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                            🍎
                        </div>
                        <h3 className="text-xl font-bold text-slate-700 mb-2">macOS</h3>
                        <p className="text-slate-500 text-sm mb-4">Apple Silicon & Intel</p>
                        <div className="inline-block bg-slate-200 text-slate-500 px-4 py-2 rounded-full font-semibold text-sm">
                            Coming Soon
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-8 border border-slate-100 opacity-60 text-center">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                            🐧
                        </div>
                        <h3 className="text-xl font-bold text-slate-700 mb-2">Linux</h3>
                        <p className="text-slate-500 text-sm mb-4">Ubuntu, Arch, Fedora</p>
                        <div className="inline-block bg-slate-200 text-slate-500 px-4 py-2 rounded-full font-semibold text-sm">
                            Coming Soon
                        </div>
                    </div>
                </motion.div>
            </main>

            {/* Footer */}
            <footer className="py-12 bg-white border-t border-slate-100 mt-20">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2 font-bold text-slate-900">
                        <img src="/logo.png" alt="Delumie" className="w-12 h-12 logo-depth" />
                        Delumie.
                    </div>

                    <div className="flex gap-6 font-medium text-sm text-slate-500">
                        <Link href="/" className="hover:text-[#52796f] transition-colors">Home</Link>
                        <Link href="/privacy" className="hover:text-[#52796f] transition-colors">Privacy</Link>
                        <Link href="/support" className="hover:text-[#52796f] transition-colors">Support</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
