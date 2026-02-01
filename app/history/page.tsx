'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ClockIcon, TrashIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { GenerationSession } from '../types/progress';
import { getHistory, clearHistory } from '../utils/history';
import ProgressTable from '../components/ProgressTable';

export default function HistoryPage() {
    const [history, setHistory] = useState<GenerationSession[]>([]);
    const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const sessions = getHistory();
        setHistory(sessions);
        // Expand most recent by default
        if (sessions.length > 0) {
            setExpandedIds(new Set([sessions[0].id]));
        }
        setIsLoading(false);
    }, []);

    const handleToggleSession = useCallback((sessionId: string) => {
        setExpandedIds(prev => {
            const next = new Set(prev);
            if (next.has(sessionId)) {
                next.delete(sessionId);
            } else {
                next.add(sessionId);
            }
            return next;
        });
    }, []);

    const handleClearHistory = () => {
        if (confirm('Are you sure you want to clear all history? This cannot be undone.')) {
            clearHistory();
            setHistory([]);
            setExpandedIds(new Set());
        }
    };

    const handleRefresh = () => {
        const sessions = getHistory();
        setHistory(sessions);
        // Keep first one expanded on refresh
        if (sessions.length > 0 && expandedIds.size === 0) {
            setExpandedIds(new Set([sessions[0].id]));
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen py-12 px-4 flex items-center justify-center">
                <div className="animate-spin h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full" />
            </div>
        );
    }

    return (
        <div className="min-h-screen py-12 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500">
                                <ClockIcon className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                                    Generation History
                                </h1>
                                <p className="text-gray-500 dark:text-gray-400 text-sm">
                                    View all your past note generation sessions
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleRefresh}
                                className="p-2 rounded-lg bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
                                title="Refresh"
                            >
                                <ArrowPathIcon className="h-5 w-5" />
                            </button>
                            {history.length > 0 && (
                                <button
                                    onClick={handleClearHistory}
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors text-sm font-medium"
                                >
                                    <TrashIcon className="h-4 w-4" />
                                    Clear All
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Stats */}
                    {history.length > 0 && (
                        <div className="flex gap-4 text-sm text-gray-500 dark:text-gray-400">
                            <span className="flex items-center gap-1">
                                <span className="font-medium text-gray-900 dark:text-white">{history.length}</span>
                                session{history.length !== 1 ? 's' : ''}
                            </span>
                            <span className="flex items-center gap-1">
                                <span className="font-medium text-gray-900 dark:text-white">
                                    {history.reduce((acc, s) => acc + s.lectures.filter(l => l.llmStatus === 'done').length, 0)}
                                </span>
                                lecture{history.reduce((acc, s) => acc + s.lectures.filter(l => l.llmStatus === 'done').length, 0) !== 1 ? 's' : ''} generated
                            </span>
                        </div>
                    )}
                </div>

                {/* Content */}
                {history.length === 0 ? (
                    <div className="glass-card rounded-2xl p-12">
                        <div className="flex flex-col items-center text-center">
                            <ClockIcon className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                No History Yet
                            </h2>
                            <p className="text-gray-500 dark:text-gray-400" style={{ maxWidth: '400px' }}>
                                Your note generation history will appear here once you start generating notes from a course.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {history.map(session => (
                            <ProgressTable
                                key={session.id}
                                session={{ ...session, expanded: expandedIds.has(session.id) }}
                                onToggle={handleToggleSession}
                            />
                        ))}
                    </div>
                )}

                {/* Info */}
                <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800/30">
                    <p className="text-sm text-blue-600 dark:text-blue-400">
                        <strong>💡 Note:</strong> History is stored in your browser&apos;s localStorage.
                        It will persist across sessions but is limited to the last 20 generation sessions.
                    </p>
                </div>
            </div>
        </div>
    );
}
