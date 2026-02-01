'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Progress, GenerationSession, LectureProgress } from '../types/progress';
import { CheckCircleIcon, XCircleIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { getSettings } from '../utils/settings';
import { getHistory, saveSession, updateSession, updateLectureInSession, createNewSession, toggleSessionExpanded } from '../utils/history';
import ProgressTable from './ProgressTable';

interface GenerateProgressProps {
  courseId: string;
  courseTitle?: string;
  lectureIds: number[];
  onClose: () => void;
  isGenerating: boolean;
}

export default function GenerateProgress({ courseId, courseTitle, lectureIds, onClose, isGenerating }: GenerateProgressProps) {
  const [progress, setProgress] = useState<Progress>({
    progress: 0,
    status: 'processing',
    message: 'Starting note generation...'
  });
  const [zipStatus, setZipStatus] = useState<'idle' | 'generating' | 'downloaded'>('idle');
  const [currentSession, setCurrentSession] = useState<GenerationSession | null>(null);
  const [, setHistory] = useState<GenerationSession[]>([]);

  // Use ref to track session ID without causing re-renders in useEffect
  const sessionIdRef = useRef<string | null>(null);

  // Load history on mount
  useEffect(() => {
    setHistory(getHistory());
  }, []);

  const handleToggleSession = useCallback((sessionId: string) => {
    toggleSessionExpanded(sessionId);

    // Update local state
    setCurrentSession(prev => {
      if (prev && prev.id === sessionId) {
        return { ...prev, expanded: !prev.expanded };
      }
      return prev;
    });
    setHistory(getHistory());
  }, []);

  useEffect(() => {
    if (!isGenerating) return;

    const cookie = localStorage.getItem('udemyCookie');
    if (!cookie) {
      setProgress({
        progress: 0,
        status: 'error',
        message: 'No Udemy cookie found. Please enter your cookie first.'
      });
      return;
    }

    // Create new session immediately
    const session = createNewSession(
      courseId,
      courseTitle || `Course ${courseId}`,
      lectureIds.map(id => id.toString())
    );
    sessionIdRef.current = session.id;
    setCurrentSession(session);
    saveSession(session);
    setHistory(getHistory());

    setProgress({
      progress: 0,
      status: 'processing',
      message: 'Starting note generation...'
    });
    setZipStatus('idle');

    const abortController = new AbortController();

    async function downloadZip() {
      try {
        const cookie = localStorage.getItem('udemyCookie');
        if (!cookie) {
          throw new Error('No Udemy cookie found');
        }

        const settings = getSettings();

        const response = await fetch('/api/generate-zip/download', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Udemy-Cookie': cookie || ''
          },
          body: JSON.stringify({
            courseId,
            lectureIds: lectureIds.map(id => id.toString()),
            customPrompt: settings.customPrompt,
            outputFormat: settings.outputFormat,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = response.headers.get('Content-Disposition')?.split('filename=')[1]?.replace(/"/g, '') || 'udemy-notes.zip';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        setZipStatus('downloaded');
        setProgress(prev => ({
          ...prev,
          status: 'completed',
          message: 'Notes downloaded successfully!'
        }));

        // Update session status with filename
        if (sessionIdRef.current) {
          const filename = a.download;
          updateSession(sessionIdRef.current, { status: 'completed', downloadedFilename: filename });
          setCurrentSession(prev => prev ? { ...prev, status: 'completed', downloadedFilename: filename } : null);
          setHistory(getHistory());
        }

      } catch (error) {
        console.error('Error downloading ZIP:', error);
        setProgress({
          progress: 100,
          status: 'error',
          message: error instanceof Error ? error.message : 'Failed to download the ZIP file. Please try again.',
        });

        if (sessionIdRef.current) {
          updateSession(sessionIdRef.current, { status: 'error' });
          setCurrentSession(prev => prev ? { ...prev, status: 'error' } : null);
          setHistory(getHistory());
        }
      }
    }

    async function startEventStream() {
      try {
        const settings = getSettings();
        const encodedPrompt = btoa(unescape(encodeURIComponent(settings.customPrompt)));

        const response = await fetch(
          `/api/generate-zip/progress?courseId=${courseId}&lectureIds=${lectureIds.map(id => id.toString()).join(',')}`,
          {
            headers: {
              'Accept': 'text/event-stream',
              'Cache-Control': 'no-cache',
              'X-Udemy-Cookie': cookie || '',
              'X-Custom-Prompt-Encoded': encodedPrompt
            },
            signal: abortController.signal
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to connect to progress stream: ${response.status} ${response.statusText}`);
        }

        const reader = response.body?.getReader();
        if (!reader) {
          throw new Error('No response body');
        }

        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data: Progress = JSON.parse(line.slice(6));
                console.log('Progress update:', data);
                setProgress(data);

                // Update lecture status in current session
                if (sessionIdRef.current && data.lectureId) {
                  const lectureUpdate: Partial<LectureProgress> = {
                    chapter: data.chapter,
                    lecture: data.lecture,
                    captionStatus: data.captionStatus || 'pending',
                    llmStatus: data.llmStatus || 'pending',
                  };

                  updateLectureInSession(sessionIdRef.current, data.lectureId, lectureUpdate);

                  // Update local session state
                  setCurrentSession(prev => {
                    if (!prev) return null;
                    const lectures = prev.lectures.map(l =>
                      l.lectureId === data.lectureId ? { ...l, ...lectureUpdate } : l
                    );
                    return { ...prev, lectures };
                  });
                }

                if (data.status === 'completed') {
                  setZipStatus('generating');
                  setProgress(prev => ({
                    ...prev,
                    message: 'Generating ZIP file...'
                  }));
                  downloadZip();
                  return;
                }
              } catch (e) {
                console.error('Error parsing progress data:', e);
              }
            }
          }
        }
      } catch (error: unknown) {
        if (error instanceof Error && error.name === 'AbortError') {
          console.log('Progress stream aborted');
          return;
        }
        console.error('Progress stream error:', error);
        setProgress({
          progress: 0,
          status: 'error',
          message: error instanceof Error ? error.message : 'Connection lost. Please try again.',
        });

        if (sessionIdRef.current) {
          updateSession(sessionIdRef.current, { status: 'error' });
          setCurrentSession(prev => prev ? { ...prev, status: 'error' } : null);
          setHistory(getHistory());
        }
      }
    }

    startEventStream();

    return () => {
      abortController.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId, isGenerating, courseTitle, lectureIds.join(',')]);

  // Only show during active generation
  if (!isGenerating) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 animate-slide-up max-h-[70vh] overflow-y-auto">
      <div className="max-w-4xl mx-auto px-4 pb-4 space-y-3">
        {/* Current Session */}
        {currentSession && isGenerating && (
          <div className="space-y-3">
            {/* Header with overall progress */}
            <div className="glass-card rounded-2xl p-4 shadow-2xl border border-gray-200/50 dark:border-slate-700/50">
              <div className="flex items-center gap-4">
                {/* Status Icon */}
                <div className="flex-shrink-0">
                  {progress.status === 'completed' && zipStatus === 'downloaded' ? (
                    <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                      <CheckCircleIcon className="h-7 w-7 text-green-500" />
                    </div>
                  ) : progress.status === 'error' ? (
                    <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                      <XCircleIcon className="h-7 w-7 text-red-500" />
                    </div>
                  ) : (
                    <div className="relative">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 opacity-20 animate-ping"></div>
                      <div className="relative flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold">
                        {progress.progress}%
                      </div>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-grow min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      {progress.status === 'completed' && zipStatus === 'downloaded'
                        ? 'Success!'
                        : progress.status === 'error'
                          ? 'Error'
                          : 'Generating Notes'}
                    </h3>
                    {zipStatus === 'generating' && (
                      <span className="flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 font-medium">
                        <ArrowDownTrayIcon className="h-4 w-4 animate-bounce" />
                        Creating ZIP...
                      </span>
                    )}
                  </div>

                  {/* Progress Bar */}
                  {progress.status !== 'error' && (
                    <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 transition-all duration-500 ease-out"
                        style={{ width: `${progress.progress}%` }}
                      />
                    </div>
                  )}

                  {/* Status Message */}
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {progress.message}
                  </p>
                </div>

                {/* Close Button */}
                {(progress.status === 'error' || zipStatus === 'downloaded') && (
                  <div className="flex-shrink-0">
                    <button
                      onClick={onClose}
                      className="btn-gradient px-4 py-2 text-sm"
                    >
                      Close
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Current Session Table */}
            <ProgressTable
              session={currentSession}
              onToggle={handleToggleSession}
              isActive
            />
          </div>
        )}
      </div>
    </div>
  );
}
