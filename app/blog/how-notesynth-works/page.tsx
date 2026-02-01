'use client';

import Link from 'next/link';
import { ArrowLeftIcon, ClockIcon, CalendarIcon, KeyIcon, MagnifyingGlassIcon, CheckCircleIcon, CpuChipIcon, ArchiveBoxIcon, ShieldCheckIcon, CodeBracketIcon, RocketLaunchIcon } from '@heroicons/react/24/outline';

export default function HowNoteSynthWorks() {
    return (
        <div className="min-h-screen py-12 px-4">
            <article className="max-w-4xl mx-auto">
                {/* Back Link */}
                <Link
                    href="/blog"
                    className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors mb-8"
                >
                    <ArrowLeftIcon className="h-4 w-4" />
                    Back to Blog
                </Link>

                {/* Header */}
                <header className="mb-12">
                    <h1 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                        How NoteSynth Works: <span className="gradient-text">A Behind-the-Scenes Look</span>
                    </h1>

                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                            <CalendarIcon className="h-4 w-4" />
                            February 2026
                        </span>
                        <span className="flex items-center gap-1">
                            <ClockIcon className="h-4 w-4" />
                            7 min read
                        </span>
                    </div>
                </header>

                {/* Intro */}
                <div className="glass-card rounded-2xl p-8 mb-12">
                    <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                        Ever wondered how NoteSynth transforms video lectures into perfectly formatted study notes?
                        In this post, we'll walk you through the entire process—from entering your Udemy cookie to downloading your organized notes.
                    </p>
                </div>

                {/* The 5-Step Process */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">The 5-Step Process</h2>

                    <div className="space-y-6">
                        {/* Step 1 */}
                        <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center rounded-br-2xl">
                                <span className="text-white font-bold text-xl">1</span>
                            </div>
                            <div className="ml-20">
                                <div className="flex items-center gap-3 mb-3">
                                    <KeyIcon className="h-6 w-6 text-indigo-500" />
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Authentication</h3>
                                </div>
                                <p className="text-gray-600 dark:text-gray-300">
                                    When you paste your Udemy cookie, NoteSynth uses it to access the Udemy API on your behalf.
                                    This is the same cookie your browser uses when you watch courses—no password required.
                                </p>
                                <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                                    <p className="text-sm text-blue-700 dark:text-blue-300">
                                        📝 <strong>Note:</strong> Your cookie is stored only in your browser's local storage. It never leaves your device except to make requests directly to Udemy.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Step 2 */}
                        <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center rounded-br-2xl">
                                <span className="text-white font-bold text-xl">2</span>
                            </div>
                            <div className="ml-20">
                                <div className="flex items-center gap-3 mb-3">
                                    <MagnifyingGlassIcon className="h-6 w-6 text-green-500" />
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Course Discovery</h3>
                                </div>
                                <p className="text-gray-600 dark:text-gray-300 mb-3">
                                    Once authenticated, NoteSynth fetches your enrolled courses from Udemy's API, including:
                                </p>
                                <div className="grid sm:grid-cols-3 gap-3">
                                    {['Course titles & thumbnails', 'Your progress on each course', 'Curriculum (chapters & lectures)'].map((item, i) => (
                                        <div key={i} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-slate-700/50 rounded-lg text-sm text-gray-600 dark:text-gray-400">
                                            <CheckCircleIcon className="h-4 w-4 text-green-500 flex-shrink-0" />
                                            {item}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Step 3 */}
                        <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center rounded-br-2xl">
                                <span className="text-white font-bold text-xl">3</span>
                            </div>
                            <div className="ml-20">
                                <div className="flex items-center gap-3 mb-3">
                                    <CheckCircleIcon className="h-6 w-6 text-yellow-500" />
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Lecture Selection</h3>
                                </div>
                                <p className="text-gray-600 dark:text-gray-300">
                                    You choose which lectures you want notes for. Select individual lectures, entire chapters, or choose "Select All" for the complete course.
                                </p>
                                <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
                                    <p className="text-sm text-amber-700 dark:text-amber-300">
                                        💡 <strong>Tip:</strong> For large courses, we recommend generating notes chapter-by-chapter to avoid timeouts.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Step 4 */}
                        <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center rounded-br-2xl">
                                <span className="text-white font-bold text-xl">4</span>
                            </div>
                            <div className="ml-20">
                                <div className="flex items-center gap-3 mb-3">
                                    <KeyIcon className="h-6 w-6 text-pink-500" />
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Configure Settings (Optional)</h3>
                                </div>
                                <p className="text-gray-600 dark:text-gray-300 mb-3">
                                    Tailor the output to your liking by visiting the Settings page:
                                </p>
                                <div className="grid sm:grid-cols-2 gap-3 mb-2">
                                    <div className="p-3 bg-pink-50 dark:bg-pink-900/20 rounded-lg">
                                        <p className="font-semibold text-gray-900 dark:text-white text-sm mb-1">Custom Prompt</p>
                                        <p className="text-gray-600 dark:text-gray-400 text-xs">Edit the AI instructions to change formatting, add sections, or adjust note style.</p>
                                    </div>
                                    <div className="p-3 bg-pink-50 dark:bg-pink-900/20 rounded-lg">
                                        <p className="font-semibold text-gray-900 dark:text-white text-sm mb-1">Output Format</p>
                                        <p className="text-gray-600 dark:text-gray-400 text-xs">Choose between individual files per chapter or combined files with Table of Contents.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Step 5 */}
                        <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center rounded-br-2xl">
                                <span className="text-white font-bold text-xl">5</span>
                            </div>
                            <div className="ml-20">
                                <div className="flex items-center gap-3 mb-3">
                                    <CpuChipIcon className="h-6 w-6 text-purple-500" />
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Caption Extraction & AI Processing</h3>
                                </div>
                                <p className="text-gray-600 dark:text-gray-300 mb-4">
                                    This is where the magic happens! For each selected lecture:
                                </p>
                                <div className="space-y-3 mb-4">
                                    {[
                                        { num: '1', text: 'Caption Fetch - NoteSynth retrieves the English captions from Udemy' },
                                        { num: '2', text: 'VTT Parsing - The raw caption file is cleaned up, removing timestamps' },
                                        { num: '3', text: 'AI Enhancement - The transcript is sent to Groq or Gemini' },
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-start gap-3">
                                            <span className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 text-sm font-bold flex-shrink-0">
                                                {item.num}
                                            </span>
                                            <p className="text-gray-600 dark:text-gray-400 text-sm">{item.text}</p>
                                        </div>
                                    ))}
                                </div>

                                {/* Code Example */}
                                <div className="bg-gray-900 rounded-xl overflow-hidden">
                                    <div className="px-4 py-2 bg-gray-800 text-gray-400 text-xs font-mono">Example Output</div>
                                    <pre className="p-4 text-sm text-gray-300 overflow-x-auto">
                                        {`## Lecture Title

Key concept explanation with proper formatting...

- 📌 **Example:** Real-world application
- 💡 **Tip:** Best practice suggestion
- ⚠️ **Warning:** Common mistake to avoid

\`\`\`python
def example():
    return "formatted nicely"
\`\`\``}
                                    </pre>
                                </div>
                            </div>
                        </div>

                        {/* Step 6 */}
                        <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center rounded-br-2xl">
                                <span className="text-white font-bold text-xl">6</span>
                            </div>
                            <div className="ml-20">
                                <div className="flex items-center gap-3 mb-3">
                                    <ArchiveBoxIcon className="h-6 w-6 text-cyan-500" />
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">ZIP Generation & Download</h3>
                                </div>
                                <p className="text-gray-600 dark:text-gray-300 mb-4">After all lectures are processed:</p>
                                <div className="grid sm:grid-cols-2 gap-3">
                                    {[
                                        'Notes organized into folders matching course structure',
                                        'Files named with indices for proper ordering',
                                        'Everything compressed into a single ZIP file',
                                        'Browser downloads the file automatically',
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center gap-2 p-3 bg-cyan-50 dark:bg-cyan-900/20 rounded-lg text-sm text-gray-600 dark:text-gray-400">
                                            <CheckCircleIcon className="h-4 w-4 text-cyan-500 flex-shrink-0" />
                                            {item}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Technical Architecture */}
                <section className="mb-12">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center">
                            <CodeBracketIcon className="h-5 w-5 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Technical Architecture</h2>
                    </div>

                    <div className="glass-card rounded-2xl p-6">
                        {/* Architecture Diagram */}
                        <div className="bg-gray-900 rounded-xl p-6 mb-6 overflow-x-auto">
                            <pre className="text-sm text-gray-300 font-mono text-center">
                                {`┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Browser   │────▶│  Next.js    │────▶│  Udemy API  │
│  (React)    │     │  API Routes │     │             │
└─────────────┘     └──────┬──────┘     └─────────────┘
                           │
                           ▼
                    ┌─────────────┐
                    │  AI Service │
                    │ (Groq/Gemini)│
                    └─────────────┘`}
                            </pre>
                        </div>

                        <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Key Technologies:</h4>
                        <div className="grid sm:grid-cols-2 gap-3">
                            {[
                                { label: 'Frontend', value: 'Next.js 15 with React' },
                                { label: 'Styling', value: 'Tailwind CSS with glassmorphism' },
                                { label: 'AI', value: 'Groq (Llama 3.3) & Gemini 1.5 Flash' },
                                { label: 'ZIP Generation', value: 'JSZip library' },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                                    <span className="font-medium text-gray-900 dark:text-white text-sm">{item.label}:</span>
                                    <span className="text-gray-600 dark:text-gray-400 text-sm">{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Performance Optimizations */}
                <section className="mb-12">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                            <RocketLaunchIcon className="h-5 w-5 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Performance Optimizations</h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="glass-card rounded-2xl p-6">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">⚡ Parallel Processing</h3>
                            <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
                                Instead of processing lectures one-by-one, we use concurrent requests with intelligent rate limiting:
                            </p>
                            <div className="space-y-2">
                                <div className="flex justify-between p-2 bg-gray-50 dark:bg-slate-700/50 rounded-lg text-sm">
                                    <span className="text-gray-600 dark:text-gray-400">Groq</span>
                                    <span className="text-gray-900 dark:text-white font-medium">3 concurrent, 2s interval</span>
                                </div>
                                <div className="flex justify-between p-2 bg-gray-50 dark:bg-slate-700/50 rounded-lg text-sm">
                                    <span className="text-gray-600 dark:text-gray-400">Gemini</span>
                                    <span className="text-gray-900 dark:text-white font-medium">5 concurrent, 1s interval</span>
                                </div>
                            </div>
                            <p className="text-green-600 dark:text-green-400 text-sm mt-3 font-medium">
                                10 lectures: ~20 seconds (vs 50+ seconds)
                            </p>
                        </div>

                        <div className="glass-card rounded-2xl p-6">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">🔄 Smart Retry Logic</h3>
                            <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
                                Rate limits happen. NoteSynth automatically:
                            </p>
                            <ul className="space-y-2 text-sm">
                                <li className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                    <CheckCircleIcon className="h-4 w-4 text-green-500" />
                                    Detects 429 Too Many Requests errors
                                </li>
                                <li className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                    <CheckCircleIcon className="h-4 w-4 text-green-500" />
                                    Waits with exponential backoff
                                </li>
                                <li className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                    <CheckCircleIcon className="h-4 w-4 text-green-500" />
                                    Falls back to alternate AI provider
                                </li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* Privacy & Security */}
                <section className="mb-12">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-rose-500 flex items-center justify-center">
                            <ShieldCheckIcon className="h-5 w-5 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Privacy & Security</h2>
                    </div>

                    <div className="glass-card rounded-2xl p-6">
                        <p className="text-gray-600 dark:text-gray-300 mb-4">We take your privacy seriously:</p>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-gray-200 dark:border-slate-700">
                                        <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Data</th>
                                        <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Stored Where</th>
                                        <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Duration</th>
                                    </tr>
                                </thead>
                                <tbody className="text-gray-600 dark:text-gray-400">
                                    <tr className="border-b border-gray-100 dark:border-slate-800">
                                        <td className="py-3 px-4">Udemy Cookie</td>
                                        <td className="py-3 px-4">Browser localStorage</td>
                                        <td className="py-3 px-4">Until you clear it</td>
                                    </tr>
                                    <tr className="border-b border-gray-100 dark:border-slate-800">
                                        <td className="py-3 px-4">Course Data</td>
                                        <td className="py-3 px-4">Browser memory</td>
                                        <td className="py-3 px-4">Current session only</td>
                                    </tr>
                                    <tr>
                                        <td className="py-3 px-4">Generated Notes</td>
                                        <td className="py-3 px-4">Your downloads folder</td>
                                        <td className="py-3 px-4">You control it</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
                            <p className="text-sm text-red-700 dark:text-red-300">
                                <strong>We never store:</strong> Your cookies on our servers, your course content, your generated notes, or any personal information.
                            </p>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="glass-card rounded-2xl p-8 text-center bg-gradient-to-br from-indigo-500/10 to-purple-500/10">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                        Ready to try it?
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        NoteSynth is 100% <strong>open source</strong> under the MIT license.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/" className="btn-gradient inline-flex items-center justify-center gap-2">
                            Start Generating Notes
                        </Link>
                        <a
                            href="https://github.com/vikas9dev/NoteSynth"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border-2 border-gray-200 dark:border-slate-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-slate-700 transition-all"
                        >
                            GitHub Repository
                        </a>
                    </div>
                </section>
            </article>
        </div>
    );
}
