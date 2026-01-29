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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 scale-in">
      <div className="glass-card rounded-2xl p-8 w-full max-w-md shadow-2xl">
        {/* Header */}
        <div className="text-center mb-6">
          {progress.status === 'completed' && zipStatus === 'downloaded' ? (
            <>
              <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4 animate-bounce" />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                Success!
              </h3>
            </>
          ) : progress.status === 'error' ? (
            <>
              <XCircleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                Error
              </h3>
            </>
          ) : (
            <>
              <div className="relative w-16 h-16 mx-auto mb-4">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 opacity-20 animate-ping"></div>
                <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold text-xl">
                  {progress.progress}%
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                Generating Notes
              </h3>
            </>
          )}
        </div>

        {/* Progress Bar */}
        {progress.status !== 'error' && (
          <div className="mb-6">
            <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
              <div
                className="h-3 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 transition-all duration-500 ease-out relative overflow-hidden"
                style={{ width: `${progress.progress}%` }}
              >
                {/* Shimmer effect */}
                <div className="absolute inset-0 shimmer"></div>
              </div>
            </div>
            <p className="text-sm text-center text-gray-600 dark:text-gray-400 mt-2 font-medium">
              {progress.progress}% Complete
            </p>
          </div>
        )}

        {/* Status Messages */}
        <div className="space-y-3 mb-6">
          {zipStatus === 'generating' && (
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold">
              <ArrowDownTrayIcon className="h-5 w-5 animate-bounce" />
              <p>Generating ZIP file...</p>
            </div>
          )}
          {zipStatus === 'downloaded' && (
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-semibold">
              <CheckCircleIcon className="h-5 w-5" />
              <p>File downloaded successfully!</p>
            </div>
          )}
          {zipStatus === 'idle' && progress.status !== 'error' && (
            <p className="text-gray-700 dark:text-gray-300">{progress.message}</p>
          )}
          {progress.status === 'error' && (
            <p className="text-red-600 dark:text-red-400">{progress.message}</p>
          )}
        </div>

        {/* Details */}
        {(progress.chapter || progress.lecture) && progress.status !== 'error' && (
          <div className="bg-indigo-50 dark:bg-slate-800/50 rounded-lg p-4 space-y-2 mb-6">
            {progress.chapter && (
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <span className="font-semibold">Chapter:</span> {progress.chapter}
              </p>
            )}
            {progress.lecture && (
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <span className="font-semibold">Lecture:</span> {progress.lecture}
              </p>
            )}
          </div>
        )}

        {/* Close Button */}
        {(progress.status === 'error' || zipStatus === 'downloaded') && (
          <button
            onClick={onClose}
            className="w-full btn-gradient"
          >
            Close
          </button>
        )}
      </div>
    </div>
  );
}

