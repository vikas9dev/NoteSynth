'use client';

import Link from 'next/link';
import { ArrowLeftIcon, ClockIcon, CalendarIcon, SparklesIcon, FolderIcon, ShieldCheckIcon, PlayIcon, RocketLaunchIcon, LightBulbIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

export default function WhatIsNoteSynth() {
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
                    <span className="inline-block px-3 py-1 text-xs font-semibold bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full mb-4">
                        Featured
                    </span>
                    <h1 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                        Transform Your Udemy Course Videos into <span className="gradient-text">Beautiful Study Notes</span>
                    </h1>

                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                            <CalendarIcon className="h-4 w-4" />
                            February 2026
                        </span>
                        <span className="flex items-center gap-1">
                            <ClockIcon className="h-4 w-4" />
                            5 min read
                        </span>
                    </div>
                </header>

                {/* Hero Section */}
                <div className="glass-card rounded-2xl p-8 mb-8">
                    <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                        Have you ever watched a Udemy course, only to realize later that you can't remember half of what was covered?
                        You're not alone. Studies show that we forget up to <strong className="text-indigo-600 dark:text-indigo-400">70% of new information within 24 hours</strong> without proper note-taking.
                    </p>
                    <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mt-4">
                        <strong className="text-gray-900 dark:text-white">NoteSynth</strong> is a free, open-source tool that solves this problem by automatically
                        converting your Udemy course videos into well-structured, beautiful Markdown notes you can review anytime.
                    </p>
                </div>

                {/* What is NoteSynth Section */}
                <section className="mb-12">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                            <SparklesIcon className="h-5 w-5 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">What is NoteSynth?</h2>
                    </div>

                    <div className="glass-card rounded-2xl p-6">
                        <p className="text-gray-600 dark:text-gray-300 mb-4">NoteSynth is an AI-powered application that:</p>
                        <ul className="space-y-3">
                            {[
                                { icon: '📥', text: 'Extracts captions from your Udemy course lectures' },
                                { icon: '✨', text: 'Transforms them into clean, organized study notes' },
                                { icon: '📦', text: 'Downloads everything as a structured ZIP file with chapters and lectures organized' },
                            ].map((item, i) => (
                                <li key={i} className="flex items-start gap-3">
                                    <span className="text-xl">{item.icon}</span>
                                    <span className="text-gray-600 dark:text-gray-300">{item.text}</span>
                                </li>
                            ))}
                        </ul>
                        <p className="text-gray-600 dark:text-gray-300 mt-4 italic">
                            Think of it as your personal study assistant that takes notes for you while you focus on learning.
                        </p>
                    </div>
                </section>

                {/* Key Features Section */}
                <section className="mb-12">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                            <LightBulbIcon className="h-5 w-5 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Key Features</h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {/* AI-Powered Note Generation */}
                        <div className="glass-card rounded-2xl p-6 hover:shadow-lg transition-shadow">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="text-2xl">📝</span>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">AI-Powered Note Generation</h3>
                            </div>
                            <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
                                Using advanced language models (Groq and Google Gemini), NoteSynth doesn't just copy the captions—it intelligently restructures them:
                            </p>
                            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                                <li>✅ Clear headings and subheadings</li>
                                <li>✅ Bullet points for key concepts</li>
                                <li>✅ Code snippets when applicable</li>
                                <li>✅ Emoji highlights for tips & warnings</li>
                            </ul>
                        </div>

                        {/* Organized Output */}
                        <div className="glass-card rounded-2xl p-6 hover:shadow-lg transition-shadow">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="text-2xl">📁</span>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Organized Output</h3>
                            </div>
                            <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
                                Your notes are automatically organized by chapter and lecture:
                            </p>
                            <div className="bg-gray-900 dark:bg-slate-900 rounded-lg p-4 font-mono text-sm text-gray-300">
                                <div>📂 My-Course-Notes/</div>
                                <div className="ml-4">├── 📁 01-Introduction/</div>
                                <div className="ml-8">├── 01-welcome.md</div>
                                <div className="ml-8">└── 02-overview.md</div>
                                <div className="ml-4">├── 📁 02-Getting-Started/</div>
                                <div className="ml-4">└── ...</div>
                            </div>
                        </div>

                        {/* Privacy First */}
                        <div className="glass-card rounded-2xl p-6 hover:shadow-lg transition-shadow">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="text-2xl">🔒</span>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Privacy First</h3>
                            </div>
                            <p className="text-gray-600 dark:text-gray-300 text-sm">
                                Your Udemy cookie is stored only in your browser—never on our servers.
                                We don't have access to your account or course data.
                            </p>
                        </div>

                        {/* Demo Mode */}
                        <div className="glass-card rounded-2xl p-6 hover:shadow-lg transition-shadow">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="text-2xl">🎮</span>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Try Before You Commit</h3>
                            </div>
                            <p className="text-gray-600 dark:text-gray-300 text-sm">
                                Not sure if it's for you? Try our <strong>Demo Mode</strong> to explore the interface
                                with sample courses—no login required!
                            </p>
                        </div>
                    </div>
                </section>

                {/* Who Is This For Section */}
                <section className="mb-12">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                            <RocketLaunchIcon className="h-5 w-5 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Who Is This For?</h2>
                    </div>

                    <div className="glass-card rounded-2xl p-6">
                        <div className="grid sm:grid-cols-2 gap-4">
                            {[
                                { emoji: '🎓', title: 'Students', desc: 'Who want searchable, reviewable notes from video courses' },
                                { emoji: '💼', title: 'Professionals', desc: 'Taking certification courses who need reference materials' },
                                { emoji: '📚', title: 'Lifelong learners', desc: 'Who prefer reading over rewatching' },
                                { emoji: '⏰', title: 'Busy people', desc: 'Who want to quickly review key concepts' },
                            ].map((item, i) => (
                                <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-slate-700/50">
                                    <span className="text-2xl">{item.emoji}</span>
                                    <div>
                                        <h4 className="font-semibold text-gray-900 dark:text-white">{item.title}</h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Why Markdown Section */}
                <section className="mb-12">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                            <DocumentTextIcon className="h-5 w-5 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Why Markdown?</h2>
                    </div>

                    <div className="glass-card rounded-2xl p-6">
                        <div className="grid sm:grid-cols-5 gap-4 text-center">
                            {[
                                { num: '1', title: 'Universal', desc: 'Opens in any text editor' },
                                { num: '2', title: 'Portable', desc: 'Works on any device' },
                                { num: '3', title: 'Searchable', desc: 'Easily find specific topics' },
                                { num: '4', title: 'Compatible', desc: 'Import into Notion, Obsidian' },
                                { num: '5', title: 'Version Control', desc: 'Track changes with Git' },
                            ].map((item, i) => (
                                <div key={i} className="p-4">
                                    <div className="w-8 h-8 mx-auto mb-2 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                                        {item.num}
                                    </div>
                                    <h4 className="font-semibold text-gray-900 dark:text-white text-sm">{item.title}</h4>
                                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="glass-card rounded-2xl p-8 text-center bg-gradient-to-br from-indigo-500/10 to-purple-500/10">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                        Get Started Today
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        NoteSynth is completely <strong>free and open-source</strong>. No subscriptions, no hidden fees.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/" className="btn-gradient inline-flex items-center justify-center gap-2">
                            <PlayIcon className="h-5 w-5" />
                            Try NoteSynth Now
                        </Link>
                        <a
                            href="https://github.com/vikas9dev/NoteSynth"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border-2 border-gray-200 dark:border-slate-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-slate-700 transition-all"
                        >
                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
                            View on GitHub
                        </a>
                    </div>
                </section>
            </article>
        </div>
    );
}
