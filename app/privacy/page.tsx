export default function Privacy() {
    return (
        <div className="min-h-screen bg-calm-50 font-sans text-calm-800">
            <div className="max-w-4xl mx-auto px-6 py-20">
                <h1 className="text-4xl md:text-5xl font-bold font-heading mb-8 text-sage-700">Privacy Policy</h1>

                <div className="prose prose-lg prose-headings:font-heading prose-headings:text-calm-800 text-gray-600">
                    <p className="lead text-xl">
                        At Delumie, we don't just "care" about your privacy. We engineered our entire product around it.
                    </p>

                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-calm-200 my-10">
                        <h2 className="text-2xl font-bold mt-0 flex items-center gap-3">
                            🔒 The Local-First Promise
                        </h2>
                        <p>
                            Delumie runs <strong>100% locally on your device</strong>.
                        </p>
                        <ul className="list-disc pl-5 space-y-2 mt-4">
                            <li>Your health data is stored in a local encrypted database on your laptop.</li>
                            <li>The AI model runs on your processor, not in the cloud.</li>
                            <li>Your conversations stay on your machine.</li>
                            <li>We (the developers) have zero access to your data.</li>
                        </ul>
                    </div>

                    <h3>Data Collection</h3>
                    <p>
                        We collect <strong>no personal data</strong>. We do not track your usage, your queries, or your health metrics.
                    </p>
                    <p>
                        The only data we receive is anonymous crash reports (if you opt-in) and standard app store installation metrics (if downloaded via a store).
                    </p>

                    <h3>External Services</h3>
                    <p>
                        Delumie uses <strong>Ollama</strong> as the underlying AI engine. Ollama is also a local-first tool.
                        When you first install Delumie, it connects to the internet <strong>only</strong> to download the AI weights (the "brain") to your computer. After that, no internet connection is required for the AI to function.
                    </p>

                    <h3>Updates</h3>
                    <p>
                        We may update this policy. Since we don't have your email (because we don't have accounts), check this page for updates.
                    </p>

                    <div className="mt-12 pt-8 border-t border-calm-200 text-sm opacity-60">
                        Last updated: {new Date().toLocaleDateString()}
                    </div>
                </div>
            </div>
        </div>
    );
}
