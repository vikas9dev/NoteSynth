'use client';

import Link from 'next/link';
import { ArrowLeftIcon, ClockIcon, CalendarIcon, TableCellsIcon, FolderOpenIcon, ArrowPathIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

export default function HistoryAndProgressFeatures() {
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
                        New Feature
                    </span>
                    <h1 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                        Introducing <span className="gradient-text">Real-Time Progress</span> & Generation History
                    </h1>

                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                            <CalendarIcon className="h-4 w-4" />
                            February 2026
                        </span>
                        <span className="flex items-center gap-1">
                            <ClockIcon className="h-4 w-4" />
                            3 min read
                        </span>
                    </div>
                </header>

                {/* Intro */}
                <div className="glass-card rounded-2xl p-8 mb-12">
                    <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                        Ever wondered what&apos;s happening behind the scenes when NoteSynth generates your notes?
                        Now you can see it all in real-time! We&apos;ve added a detailed progress table and a dedicated History page to track all your generation sessions.
                    </p>
                </div>

                {/* Feature 1: Real-Time Progress Table */}
                <section className="mb-12">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                            <TableCellsIcon className="h-5 w-5 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Real-Time Progress Table</h2>
                    </div>

                    <div className="glass-card rounded-2xl p-6">
                        <p className="text-gray-600 dark:text-gray-300 mb-6">
                            The new progress panel appears at the bottom of your screen during note generation,
                            giving you a lecture-by-lecture breakdown of what&apos;s happening.
                        </p>

                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <CheckCircleIcon className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="font-semibold text-gray-900 dark:text-white">Caption Status</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">See when captions are being fetched from Udemy</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <CheckCircleIcon className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="font-semibold text-gray-900 dark:text-white">LLM Processing</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Watch as AI transforms transcripts into structured notes</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <XCircleIcon className="h-6 w-6 text-red-500 flex-shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="font-semibold text-gray-900 dark:text-white">Error Visibility</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Rate limits or API errors are clearly shown per lecture</p>
                                </div>
                            </div>
                        </div>

                        {/* Status Icons Legend */}
                        <div className="mt-6 p-4 bg-gray-50 dark:bg-slate-700/50 rounded-xl">
                            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Status Icons</h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                                <div className="flex items-center gap-2">
                                    <span>⏳</span>
                                    <span className="text-gray-600 dark:text-gray-400">Pending</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span>🔄</span>
                                    <span className="text-gray-600 dark:text-gray-400">Processing</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span>✅</span>
                                    <span className="text-gray-600 dark:text-gray-400">Complete</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span>❌</span>
                                    <span className="text-gray-600 dark:text-gray-400">Error</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Feature 2: History Page */}
                <section className="mb-12">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
                            <ClockIcon className="h-5 w-5 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Dedicated History Page</h2>
                    </div>

                    <div className="glass-card rounded-2xl p-6">
                        <p className="text-gray-600 dark:text-gray-300 mb-6">
                            All your past generation sessions are now saved and accessible from the new History page.
                            Click the <strong>History</strong> link in the navigation to view them anytime.
                        </p>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="p-4 bg-gray-50 dark:bg-slate-700/50 rounded-xl">
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">📊 Session Statistics</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    See total sessions, lectures generated, and success rates at a glance.
                                </p>
                            </div>
                            <div className="p-4 bg-gray-50 dark:bg-slate-700/50 rounded-xl">
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">📁 Download Filename</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Each completed session shows the ZIP filename for easy reference.
                                </p>
                            </div>
                            <div className="p-4 bg-gray-50 dark:bg-slate-700/50 rounded-xl">
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">🔍 Expandable Details</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Click any session to expand and see lecture-by-lecture details.
                                </p>
                            </div>
                            <div className="p-4 bg-gray-50 dark:bg-slate-700/50 rounded-xl">
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">🗑️ Clear History</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    One-click button to clear all history when you need a fresh start.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Feature 3: Smart Defaults */}
                <section className="mb-12">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                            <ArrowPathIcon className="h-5 w-5 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Smart Behavior</h2>
                    </div>

                    <div className="glass-card rounded-2xl p-6 space-y-4">
                        <div className="flex items-start gap-3">
                            <FolderOpenIcon className="h-6 w-6 text-indigo-500 flex-shrink-0 mt-0.5" />
                            <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white">Progress Panel Only During Generation</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    The progress panel only appears when you&apos;re actively generating notes.
                                    It won&apos;t persist after a page refresh, keeping your workspace clean.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <ClockIcon className="h-6 w-6 text-indigo-500 flex-shrink-0 mt-0.5" />
                            <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white">Most Recent Expanded</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    On the History page, the most recent session is expanded by default.
                                    All other sessions are collapsed for a cleaner view.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <TableCellsIcon className="h-6 w-6 text-indigo-500 flex-shrink-0 mt-0.5" />
                            <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white">Fallback Content on LLM Errors</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    If the AI fails to process a lecture (rate limits, API errors), you still get the raw captions.
                                    The table shows an error status, but nothing is lost.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="glass-card rounded-2xl p-8 text-center bg-gradient-to-br from-indigo-500/10 to-purple-500/10">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                        Try It Now
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        Start generating notes and watch the real-time progress!
                    </p>
                    <Link href="/" className="btn-gradient inline-flex items-center justify-center gap-2">
                        <TableCellsIcon className="h-5 w-5" />
                        Generate Notes
                    </Link>
                </section>
            </article>
        </div>
    );
}
