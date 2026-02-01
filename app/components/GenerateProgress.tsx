import React, { useEffect, useState } from 'react';
import { Progress } from '../types/progress';
import { CheckCircleIcon, XCircleIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';

interface GenerateProgressProps {
  courseId: string;
  lectureIds: number[];
  onClose: () => void;
  isGenerating: boolean;
}

export default function GenerateProgress({ courseId, lectureIds, onClose, isGenerating }: GenerateProgressProps) {
  const [progress, setProgress] = useState<Progress>({
    progress: 0,
    status: 'processing',
    message: 'Starting note generation...'
  });
  const [zipStatus, setZipStatus] = useState<'idle' | 'generating' | 'downloaded'>('idle');

  useEffect(() => {
    if (isGenerating) {
      setProgress({
        progress: 0,
        status: 'processing',
        message: 'Starting note generation...'
      });
      setZipStatus('idle');
    }
  }, [isGenerating]);

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

    const abortController = new AbortController();

    async function downloadZip() {
      try {
        const cookie = localStorage.getItem('udemyCookie');
        if (!cookie) {
          throw new Error('No Udemy cookie found');
        }

        const response = await fetch('/api/generate-zip/download', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Udemy-Cookie': cookie || ''
          },
          body: JSON.stringify({
            courseId,
            lectureIds: lectureIds.map(id => id.toString())
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
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        setZipStatus('downloaded');
        setProgress(prev => ({
          ...prev,
          message: 'File downloaded.'
        }));
        // Do not auto-close, let user close manually
      } catch (error) {
        console.error('Error downloading ZIP:', error);
        setProgress({
          progress: 100,
          status: 'error',
          message: error instanceof Error ? error.message : 'Failed to download the ZIP file. Please try again.',
        });
      }
    }

    async function startEventStream() {
      try {
        const response = await fetch(
          `/api/generate-zip/progress?courseId=${courseId}&lectureIds=${lectureIds.map(id => id.toString()).join(',')}`,
          {
            headers: {
              'Accept': 'text/event-stream',
              'Cache-Control': 'no-cache',
              'X-Udemy-Cookie': cookie || ''
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
                const data = JSON.parse(line.slice(6));
                console.log('Progress update:', data);
                setProgress(data);

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
      }
    }

    startEventStream();

    return () => {
      abortController.abort();
    };
  }, [courseId, lectureIds, isGenerating]);

  if (!isGenerating) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 animate-slide-up">
      <div className="max-w-4xl mx-auto px-4 pb-4">
        <div className="glass-card rounded-2xl p-6 shadow-2xl border border-gray-200/50 dark:border-slate-700/50">
          <div className="flex items-center gap-6">
            {/* Status Icon */}
            <div className="flex-shrink-0">
              {progress.status === 'completed' && zipStatus === 'downloaded' ? (
                <div className="w-14 h-14 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <CheckCircleIcon className="h-8 w-8 text-green-500" />
                </div>
              ) : progress.status === 'error' ? (
                <div className="w-14 h-14 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <XCircleIcon className="h-8 w-8 text-red-500" />
                </div>
              ) : (
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 opacity-20 animate-ping"></div>
                  <div className="relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold text-lg">
                    {progress.progress}%
                  </div>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-grow min-w-0">
              {/* Title and Status */}
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
                <div className="mb-2">
                  <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 transition-all duration-500 ease-out relative overflow-hidden"
                      style={{ width: `${progress.progress}%` }}
                    >
                      <div className="absolute inset-0 shimmer"></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Status Messages */}
              <div className="flex items-center gap-4 text-sm">
                {zipStatus === 'downloaded' ? (
                  <span className="text-green-600 dark:text-green-400 font-medium">
                    ✓ File downloaded successfully!
                  </span>
                ) : progress.status === 'error' ? (
                  <span className="text-red-600 dark:text-red-400">{progress.message}</span>
                ) : (
                  <>
                    {progress.chapter && (
                      <span className="text-gray-600 dark:text-gray-400 truncate">
                        <span className="font-medium">Chapter:</span> {progress.chapter}
                      </span>
                    )}
                    {progress.lecture && (
                      <span className="text-gray-600 dark:text-gray-400 truncate">
                        <span className="font-medium">Lecture:</span> {progress.lecture}
                      </span>
                    )}
                    {!progress.chapter && !progress.lecture && (
                      <span className="text-gray-600 dark:text-gray-400">{progress.message}</span>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Close Button */}
            {(progress.status === 'error' || zipStatus === 'downloaded') && (
              <div className="flex-shrink-0">
                <button
                  onClick={onClose}
                  className="btn-gradient px-6 py-2 text-sm"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

