'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    Cog6ToothIcon,
    ArrowLeftIcon,
    CheckCircleIcon,
    ExclamationTriangleIcon,
    ArrowPathIcon,
    DocumentTextIcon,
    FolderIcon,
    ArrowDownTrayIcon,
    LockClosedIcon
} from '@heroicons/react/24/outline';
import {
    getSettings,
    saveSettings,
    resetSettings,
    DEFAULT_PROMPT,
    NoteSynthSettings
} from '../utils/settings';

type TabKey = 'download' | 'output' | 'prompt';

export default function SettingsPage() {
    const [settings, setSettings] = useState<NoteSynthSettings>({
        customPrompt: DEFAULT_PROMPT,
        outputFormat: 'file-per-chapter',
        downloadContentType: 'ai-notes',
    });
    const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [isLoaded, setIsLoaded] = useState(false);
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [activeTab, setActiveTab] = useState<TabKey>('download');

    // Check if other tabs should be disabled (captions-only mode)
    const isCaptionsOnly = settings.downloadContentType === 'captions-only';

    // Load settings from localStorage on mount
    useEffect(() => {
        const loaded = getSettings();
        setSettings(loaded);
        setIsLoaded(true);
    }, []);

    const handleSave = () => {
        const result = saveSettings(settings);

        if (result.success) {
            setSaveStatus('success');
            setErrorMessage('');
            setShowSaveModal(true);
            setTimeout(() => {
                setSaveStatus('idle');
                setShowSaveModal(false);
            }, 3000);
        } else {
            setSaveStatus('error');
            setErrorMessage(result.error || 'Failed to save settings');
        }
    };

    const handleReset = () => {
        resetSettings();
        setSettings({
            customPrompt: DEFAULT_PROMPT,
            outputFormat: 'file-per-chapter',
            downloadContentType: 'ai-notes',
        });
        setSaveStatus('success');
        setErrorMessage('');
        setShowSaveModal(true);
        setTimeout(() => {
            setSaveStatus('idle');
            setShowSaveModal(false);
        }, 3000);
    };

    const handleTabClick = (tab: TabKey) => {
        // If captions-only, only allow download tab
        if (isCaptionsOnly && tab !== 'download') {
            return;
        }
        setActiveTab(tab);
    };

    if (!isLoaded) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex items-center gap-3">
                    <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                    <span className="text-gray-600 dark:text-gray-400">Loading settings...</span>
                </div>
            </div>
        );
    }

    const tabs = [
        { key: 'download' as TabKey, label: 'Download Content', icon: ArrowDownTrayIcon, disabled: false },
        { key: 'output' as TabKey, label: 'Output Format', icon: FolderIcon, disabled: isCaptionsOnly },
        { key: 'prompt' as TabKey, label: 'Prompt Configuration', icon: DocumentTextIcon, disabled: isCaptionsOnly },
    ];

    return (
        <div className="min-h-screen py-12 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Back Link */}
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors mb-8"
                >
                    <ArrowLeftIcon className="h-4 w-4" />
                    Back to Home
                </Link>

                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                        <Cog6ToothIcon className="h-7 w-7 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
                        <p className="text-gray-600 dark:text-gray-400">Customize note generation behavior</p>
                    </div>
                </div>

                {/* Status Messages */}
                {saveStatus === 'error' && (
                    <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-3 animate-fadeIn">
                        <ExclamationTriangleIcon className="h-5 w-5 text-red-600 dark:text-red-400" />
                        <span className="text-red-700 dark:text-red-300">{errorMessage}</span>
                    </div>
                )}

                {/* Tabs Navigation */}
                <div className="glass-card rounded-2xl p-2 mb-6">
                    <div className="flex gap-2">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.key;
                            const isDisabled = tab.disabled;

                            return (
                                <button
                                    key={tab.key}
                                    onClick={() => handleTabClick(tab.key)}
                                    disabled={isDisabled}
                                    className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium text-sm transition-all relative ${isActive
                                        ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg'
                                        : isDisabled
                                            ? 'bg-gray-100 dark:bg-slate-800 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700'
                                        }`}
                                >
                                    {isDisabled ? (
                                        <LockClosedIcon className="h-4 w-4" />
                                    ) : (
                                        <Icon className="h-4 w-4" />
                                    )}
                                    <span className="hidden sm:inline">{tab.label}</span>
                                    <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Captions Only Warning */}
                {isCaptionsOnly && (
                    <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl flex items-center gap-3">
                        <LockClosedIcon className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                        <p className="text-sm text-amber-700 dark:text-amber-300">
                            <strong>Captions Only mode:</strong> Output Format and Prompt Configuration are disabled because AI processing is skipped.
                        </p>
                    </div>
                )}

                {/* Tab Content */}
                <div className="glass-card rounded-2xl p-6 mb-6">
                    {/* Download Content Tab */}
                    {activeTab === 'download' && (
                        <div className="animate-fadeIn">
                            <div className="flex items-center gap-3 mb-4">
                                <ArrowDownTrayIcon className="h-6 w-6 text-emerald-500" />
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Download Content</h2>
                            </div>

                            <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
                                Choose what content to include in the downloaded ZIP file.
                            </p>

                            <div className="space-y-3">
                                {/* AI Notes option */}
                                <label className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${settings.downloadContentType === 'ai-notes'
                                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                                    : 'border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600'
                                    }`}>
                                    <input
                                        type="radio"
                                        name="downloadContentType"
                                        value="ai-notes"
                                        checked={settings.downloadContentType === 'ai-notes'}
                                        onChange={(e) => setSettings({ ...settings, downloadContentType: e.target.value as 'ai-notes' })}
                                        className="mt-1 w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold text-gray-900 dark:text-white">AI Transformed Notes</span>
                                            <span className="px-2 py-0.5 text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded">Default</span>
                                        </div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                            Lecture captions are processed by AI to generate well-structured, readable notes.
                                        </p>
                                    </div>
                                </label>

                                {/* Captions Only option */}
                                <label className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${settings.downloadContentType === 'captions-only'
                                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                                    : 'border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600'
                                    }`}>
                                    <input
                                        type="radio"
                                        name="downloadContentType"
                                        value="captions-only"
                                        checked={settings.downloadContentType === 'captions-only'}
                                        onChange={(e) => setSettings({ ...settings, downloadContentType: e.target.value as 'captions-only' })}
                                        className="mt-1 w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <div className="flex-1">
                                        <div className="font-semibold text-gray-900 dark:text-white">Captions Only</div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                            Download raw lecture captions without AI processing. Faster and doesn&apos;t use AI credits.
                                        </p>
                                        <div className="mt-2 p-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded text-xs text-amber-700 dark:text-amber-300">
                                            ⚡ This option skips AI model calls, making downloads much faster. You can use AI-powered IDEs like <strong>Cursor</strong> or <strong>Antigravity</strong> to generate structured notes from the raw captions.
                                        </div>
                                    </div>
                                </label>
                            </div>
                        </div>
                    )}

                    {/* Output Format Tab */}
                    {activeTab === 'output' && (
                        <div className="animate-fadeIn">
                            <div className="flex items-center gap-3 mb-4">
                                <FolderIcon className="h-6 w-6 text-purple-500" />
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Output Format</h2>
                            </div>

                            <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
                                Choose how notes are organized in the downloaded ZIP file.
                            </p>

                            <div className="space-y-3">
                                {/* File per chapter option */}
                                <label className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${settings.outputFormat === 'file-per-chapter'
                                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                                    : 'border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600'
                                    }`}>
                                    <input
                                        type="radio"
                                        name="outputFormat"
                                        value="file-per-chapter"
                                        checked={settings.outputFormat === 'file-per-chapter'}
                                        onChange={(e) => setSettings({ ...settings, outputFormat: e.target.value as 'file-per-chapter' })}
                                        className="mt-1 w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold text-gray-900 dark:text-white">One file per chapter</span>
                                            <span className="px-2 py-0.5 text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded">Default</span>
                                        </div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                            Each chapter/lecture gets its own markdown file, organized in section folders.
                                        </p>
                                        <div className="mt-2 text-xs font-mono text-gray-500 dark:text-gray-500 bg-gray-100 dark:bg-slate-800 p-2 rounded">
                                            📁 Section-01/<br />
                                            &nbsp;&nbsp;├── 01-chapter.md<br />
                                            &nbsp;&nbsp;└── 02-chapter.md
                                        </div>
                                    </div>
                                </label>

                                {/* File per section option */}
                                <label className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${settings.outputFormat === 'file-per-section'
                                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                                    : 'border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600'
                                    }`}>
                                    <input
                                        type="radio"
                                        name="outputFormat"
                                        value="file-per-section"
                                        checked={settings.outputFormat === 'file-per-section'}
                                        onChange={(e) => setSettings({ ...settings, outputFormat: e.target.value as 'file-per-section' })}
                                        className="mt-1 w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <div className="flex-1">
                                        <div className="font-semibold text-gray-900 dark:text-white">One file per section</div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                            All chapters in a section are combined into a single markdown file with a table of contents.
                                        </p>
                                        <div className="mt-2 text-xs font-mono text-gray-500 dark:text-gray-500 bg-gray-100 dark:bg-slate-800 p-2 rounded">
                                            📁 Course-Notes/<br />
                                            &nbsp;&nbsp;├── 01_section_name.md<br />
                                            &nbsp;&nbsp;└── 02_section_name.md
                                        </div>
                                    </div>
                                </label>
                            </div>
                        </div>
                    )}

                    {/* Prompt Configuration Tab */}
                    {activeTab === 'prompt' && (
                        <div className="animate-fadeIn">
                            <div className="flex items-center gap-3 mb-4">
                                <DocumentTextIcon className="h-6 w-6 text-indigo-500" />
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Prompt Configuration</h2>
                            </div>

                            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                                Customize the prompt sent to the AI for note generation. The <code className="px-1.5 py-0.5 bg-gray-100 dark:bg-slate-700 rounded text-indigo-600 dark:text-indigo-400">{'{{TRANSCRIPT}}'}</code> placeholder is required and will be replaced with the lecture transcript.
                            </p>

                            <div className="relative">
                                <textarea
                                    value={settings.customPrompt}
                                    onChange={(e) => setSettings({ ...settings, customPrompt: e.target.value })}
                                    className="w-full h-80 p-4 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-white font-mono text-sm resize-y focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                    placeholder="Enter your custom prompt..."
                                />
                                <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                                    {settings.customPrompt.length} / 10,000 characters
                                </div>
                            </div>

                            <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
                                <p className="text-sm text-amber-700 dark:text-amber-300">
                                    <strong>💡 Tip:</strong> For the &quot;One file per section&quot; output format, avoid emoji in headings as they may break the table of contents links.
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <button
                        onClick={handleSave}
                        className="btn-gradient flex-1 flex items-center justify-center gap-2"
                    >
                        <CheckCircleIcon className="h-5 w-5" />
                        Save Settings
                    </button>

                    <button
                        onClick={handleReset}
                        className="flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl border-2 border-gray-200 dark:border-slate-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-slate-700 transition-all"
                    >
                        <ArrowPathIcon className="h-5 w-5" />
                        Reset to Defaults
                    </button>
                </div>

                {/* Info Box */}
                <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                        <strong>ℹ️ Storage Info:</strong> Your settings are stored locally in your browser&apos;s localStorage. They will persist across sessions but are not synced across devices.
                    </p>
                </div>
            </div>

            {/* Save Success Modal */}
            {showSaveModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/60"
                        onClick={() => setShowSaveModal(false)}
                    />
                    {/* Modal Content */}
                    <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 max-w-2xl w-full animate-fadeIn border border-gray-200 dark:border-slate-600">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center mb-4">
                                <CheckCircleIcon className="h-8 w-8 text-green-600 dark:text-green-400" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Settings Saved!</h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                                Your preferences have been saved successfully.
                            </p>
                            <button
                                onClick={() => setShowSaveModal(false)}
                                className="mt-4 px-6 py-2 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
                            >
                                Dismiss
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
