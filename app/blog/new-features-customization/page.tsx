'use client';

import Link from 'next/link';
import { ArrowLeftIcon, ClockIcon, CalendarIcon, AdjustmentsHorizontalIcon, CommandLineIcon, DocumentDuplicateIcon, ShieldCheckIcon, BoltIcon } from '@heroicons/react/24/outline';

export default function NewFeaturesCustomization() {
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
                    <span className="inline-block px-3 py-1 text-xs font-semibold bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-full mb-4">
                        New Release
                    </span>
                    <h1 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                        Introducing <span className="gradient-text">Complete Customization</span>: NoteSynth 2.0
                    </h1>

                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                            <CalendarIcon className="h-4 w-4" />
                            February 2026
                        </span>
                        <span className="flex items-center gap-1">
                            <ClockIcon className="h-4 w-4" />
                            4 min read
                        </span>
                    </div>
                </header>

                {/* Intro */}
                <div className="glass-card rounded-2xl p-8 mb-12">
                    <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                        We heard you! While automatic note generation is great, sometimes you need more control.
                        Today, we&apos;re excited to announce fully customizable settings that put you in the driver&apos;s seat.
                    </p>
                </div>

                {/* Feature 1: Custom Prompts */}
                <section className="mb-12">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                            <CommandLineIcon className="h-5 w-5 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Custom AI Prompts</h2>
                    </div>

                    <div className="glass-card rounded-2xl p-6">
                        <p className="text-gray-600 dark:text-gray-300 mb-6">
                            You can now modify the exact instructions sent to the AI. Want more code examples? Need summaries in a specific language? prefer bullet points over paragraphs? It&apos;s all up to you.
                        </p>

                        <div className="bg-gray-900 rounded-xl p-6 overflow-hidden relative">
                            <div className="absolute top-4 right-4 px-2 py-1 bg-gray-800 text-gray-400 text-xs rounded">Prompt Editor</div>
                            <pre className="text-sm font-mono text-gray-300 overflow-x-auto">
                                {`Rewrite the following lecture transcript...

[Your Custom Instructions Here]
- ✅ Summarize key takeaways
- ✅ Extract all code snippets
- ✅ Translate difficult terms

{{TRANSCRIPT}}`}
                            </pre>
                        </div>
                    </div>
                </section>

                {/* Feature 2: Captions Only Mode */}
                <section className="mb-12">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                            <BoltIcon className="h-5 w-5 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Captions Only Mode</h2>
                    </div>

                    <div className="glass-card rounded-2xl p-6 border-l-4 border-amber-500">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">⚡ Lightning Fast Downloads</h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                            Need notes instantly? The new <strong>Captions Only</strong> mode skips the AI processing entirely.
                        </p>
                        <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
                            <li className="flex items-center gap-2">
                                <span className="text-green-500">✓</span> Instant downloads (no waiting for AI)
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-green-500">✓</span> Saves your AI API quota
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-green-500">✓</span> Perfect for use with <strong>Cursor</strong>, <strong>Antigravity</strong>, or <strong>ChatGPT</strong>
                            </li>
                        </ul>
                        <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-200 text-sm rounded-lg">
                            <strong>Pro Tip:</strong> Download raw captions and use them as context in your favorite AI IDE/Assistant to generate personalized study guides!
                        </div>
                    </div>
                </section>

                {/* Feature 2: Flexible Output Formats */}
                <section className="mb-12">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
                            <DocumentDuplicateIcon className="h-5 w-5 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Flexible Output Formats</h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="glass-card rounded-2xl p-6">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">📄 File Per Chapter (Default)</h3>
                            <p className="text-gray-600 dark:text-gray-300 text-sm">
                                Best for granular organization. Each lecture gets its own markdown file, organized into chapter folders.
                            </p>
                            <div className="mt-4 p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg text-xs font-mono text-gray-500 dark:text-gray-400">
                                /Chapter-1/01-Intro.md<br />
                                /Chapter-1/02-Setup.md
                            </div>
                        </div>

                        <div className="glass-card rounded-2xl p-6 ring-2 ring-indigo-500/20">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">📚 File Per Section</h3>
                                <span className="px-2 py-1 text-xs bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full font-medium">New!</span>
                            </div>
                            <p className="text-gray-600 dark:text-gray-300 text-sm">
                                Best for readability. Combines all lectures in a chapter into a single file with a Table of Contents.
                            </p>
                            <div className="mt-4 p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg text-xs font-mono text-gray-500 dark:text-gray-400">
                                /01_Introduction_combined.md<br />
                                (Contains Intro + Setup with TOC)
                            </div>
                        </div>
                    </div>
                </section>

                {/* Feature 3: Smart Persistence */}
                <section className="mb-12">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                            <ShieldCheckIcon className="h-5 w-5 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Privacy-Focused Persistence</h2>
                    </div>

                    <div className="glass-card rounded-2xl p-6">
                        <p className="text-gray-600 dark:text-gray-300">
                            Just like your Udemy cookie, your custom settings are stored locally in your browser.
                            We never see your custom prompts or preferences.
                        </p>
                    </div>
                </section>

                {/* CTA */}
                <section className="glass-card rounded-2xl p-8 text-center bg-gradient-to-br from-indigo-500/10 to-purple-500/10">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                        Try It Now
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        Head over to the new Settings page to configure your experience.
                    </p>
                    <Link href="/settings" className="btn-gradient inline-flex items-center justify-center gap-2">
                        <AdjustmentsHorizontalIcon className="h-5 w-5" />
                        Configure Settings
                    </Link>
                </section>
            </article>
        </div>
    );
}
