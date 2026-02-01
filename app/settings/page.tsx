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
    FolderIcon
} from '@heroicons/react/24/outline';
import {
    getSettings,
    saveSettings,
    resetSettings,
    DEFAULT_PROMPT,
    NoteSynthSettings
} from '../utils/settings';

export default function SettingsPage() {
    const [settings, setSettings] = useState<NoteSynthSettings>({
        customPrompt: DEFAULT_PROMPT,
        outputFormat: 'file-per-chapter',
    });
    const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [isLoaded, setIsLoaded] = useState(false);

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
            setTimeout(() => setSaveStatus('idle'), 3000);
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
        });
        setSaveStatus('success');
        setErrorMessage('');
        setTimeout(() => setSaveStatus('idle'), 3000);
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
                {saveStatus === 'success' && (
                    <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl flex items-center gap-3 animate-fadeIn">
                        <CheckCircleIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
                        <span className="text-green-700 dark:text-green-300">Settings saved to your browser's local storage!</span>
                    </div>
                )}

                {saveStatus === 'error' && (
                    <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-3 animate-fadeIn">
                        <ExclamationTriangleIcon className="h-5 w-5 text-red-600 dark:text-red-400" />
                        <span className="text-red-700 dark:text-red-300">{errorMessage}</span>
                    </div>
                )}

                {/* Prompt Configuration */}
                <section className="glass-card rounded-2xl p-6 mb-6">
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
                            <strong>💡 Tip:</strong> For the "One file per section" output format, avoid emoji in headings as they may break the table of contents links.
                        </p>
                    </div>
                </section>

                {/* Output Format */}
                <section className="glass-card rounded-2xl p-6 mb-6">
                    <div className="flex items-center gap-3 mb-4">
                        <FolderIcon className="h-6 w-6 text-purple-500" />
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Output Format</h2>
                    </div>

                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
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
                </section>

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
                        <strong>ℹ️ Storage Info:</strong> Your settings are stored locally in your browser's localStorage. They will persist across sessions but are not synced across devices.
                    </p>
                </div>
            </div>
        </div>
    );
}
