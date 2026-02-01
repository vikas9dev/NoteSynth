'use client';

import React from 'react';
import { GenerationSession } from '../types/progress';
import { ChevronDownIcon, ChevronRightIcon, TrashIcon } from '@heroicons/react/24/outline';

interface ProgressTableProps {
    session: GenerationSession;
    onToggle: (sessionId: string) => void;
    onDelete?: (sessionId: string) => void;
    isActive?: boolean;
}

function StatusIcon({ status }: { status: 'pending' | 'fetching' | 'calling' | 'done' | 'error' | 'retrying' }) {
    switch (status) {
        case 'pending':
            return <span className="text-gray-400">⏳</span>;
        case 'fetching':
        case 'calling':
            return <span className="animate-pulse">🔄</span>;
        case 'retrying':
            return <span className="animate-pulse text-yellow-500">🔁</span>;
        case 'done':
            return <span className="text-green-500">✅</span>;
        case 'error':
            return <span className="text-red-500">❌</span>;
        default:
            return <span className="text-gray-400">⏳</span>;
    }
}

function formatTime(timestamp: number): string {
    return new Date(timestamp).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
    });
}

function formatDate(timestamp: number): string {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
        return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
        return 'Yesterday';
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function ProgressTable({ session, onToggle, onDelete, isActive = false }: ProgressTableProps) {
    const completedCount = session.lectures.filter(l => l.llmStatus === 'done').length;
    const errorCount = session.lectures.filter(l => l.llmStatus === 'error').length;

    return (
        <div className={`glass-card rounded-xl overflow-hidden ${isActive ? 'ring-2 ring-indigo-500/30' : ''}`}>
            {/* Header */}
            <button
                onClick={() => onToggle(session.id)}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
            >
                <div className="flex items-center gap-3">
                    {session.expanded ? (
                        <ChevronDownIcon className="h-5 w-5 text-gray-500" />
                    ) : (
                        <ChevronRightIcon className="h-5 w-5 text-gray-500" />
                    )}

                    <div className="flex items-center gap-2">
                        {isActive && (
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        )}
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {formatDate(session.timestamp)} at {formatTime(session.timestamp)}
                        </span>
                    </div>

                    <span className="text-sm text-gray-500 dark:text-gray-400">
                        ({completedCount}/{session.lectures.length} lectures)
                    </span>

                    {errorCount > 0 && (
                        <span className="text-xs text-red-500 font-medium">
                            {errorCount} failed
                        </span>
                    )}

                    {session.status === 'in-progress' && (
                        <span className="text-xs px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full font-medium">
                            In Progress
                        </span>
                    )}

                    {session.status === 'completed' && session.downloadedFilename && (
                        <span className="text-xs text-green-600 dark:text-green-400 font-medium flex items-center gap-1">
                            📁 {session.downloadedFilename}
                        </span>
                    )}
                </div>

                {onDelete && session.status !== 'in-progress' && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(session.id);
                        }}
                        className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                        title="Delete session"
                    >
                        <TrashIcon className="h-4 w-4" />
                    </button>
                )}
            </button>

            {/* Table */}
            {session.expanded && (
                <div className="border-t border-gray-200 dark:border-slate-700 overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-slate-800/50">
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-10">#</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Chapter</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Lecture</th>
                                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-20">Caption</th>
                                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-20">LLM</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                            {session.lectures.map((lecture, index) => (
                                <tr
                                    key={lecture.lectureId}
                                    className={`${lecture.llmStatus === 'calling' || lecture.captionStatus === 'fetching'
                                        ? 'bg-blue-50 dark:bg-blue-900/10'
                                        : lecture.llmStatus === 'error'
                                            ? 'bg-red-50 dark:bg-red-900/10'
                                            : ''
                                        }`}
                                >
                                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400 font-mono text-xs">
                                        {index + 1}
                                    </td>
                                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300 max-w-[200px] truncate">
                                        {lecture.chapter || '—'}
                                    </td>
                                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300 max-w-[200px] truncate">
                                        {lecture.lecture || '—'}
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <StatusIcon status={lecture.captionStatus} />
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <div className="flex items-center justify-center gap-1">
                                            <StatusIcon status={lecture.llmStatus} />
                                            {lecture.llmProvider && lecture.llmStatus === 'done' && (
                                                <span className="text-[10px] text-gray-400 uppercase">{lecture.llmProvider}</span>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
