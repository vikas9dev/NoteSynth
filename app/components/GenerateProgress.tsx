'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import JSZip from 'jszip';
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

  // Buffer to store generated content for client-side zipping
  const contentBufferRef = useRef<Map<string, {
    content: string;
    chapterTitle: string;
    lectureTitle: string;
    objectIndex: number;
    lectureId: string;
  }>>(new Map());

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

    async function generateZipLocally() {
      try {
        const settings = getSettings();
        const zip = new JSZip();

        // Helper to sanitize filenames
        const sanitize = (name: string) => name.replace(/[<>:"/\\|?*]/g, '').replace(/\s+/g, '-').toLowerCase().trim();
        const formatIndex = (idx: number) => idx.toString().padStart(2, '0');

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const sanitizedCourseTitle = sanitize(courseTitle || `course-${courseId}`);
        const parentFolder = `${sanitizedCourseTitle}-${timestamp}`;
        const root = zip.folder(parentFolder);

        // Get all lectures and sort them
        const lectures = Array.from(contentBufferRef.current.values())
          .sort((a, b) => {
            // We don't have global index easily here, but we can rely on how they came in or just chapter grouping
            // For now, let's group by chapter
            if (a.chapterTitle !== b.chapterTitle) return a.chapterTitle.localeCompare(b.chapterTitle);
            return a.objectIndex - b.objectIndex;
          });

        if (settings.outputFormat === 'file-per-section') {
          // Group by chapter
          const byChapter = new Map<string, typeof lectures>();
          lectures.forEach(l => {
            if (!byChapter.has(l.chapterTitle)) byChapter.set(l.chapterTitle, []);
            byChapter.get(l.chapterTitle)?.push(l);
          });

          // Generate combined files
          let chapterIndex = 1;
          for (const [chapterTitle, chapterLectures] of byChapter.entries()) {
            chapterLectures.sort((a, b) => a.objectIndex - b.objectIndex);

            const cleanChapter = chapterTitle.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E6}-\u{1F1FF}]/gu, '').trim();

            let md = `# ${cleanChapter}\n\n## Table of Contents\n\n`;

            // TOC
            for (const l of chapterLectures) {
              const cleanTitle = l.lectureTitle.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E6}-\u{1F1FF}]/gu, '').trim();
              const anchor = cleanTitle.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
              md += `- [${cleanTitle}](#${anchor})\n`;
            }
            md += '\n---\n\n';

            // Content
            for (let i = 0; i < chapterLectures.length; i++) {
              md += chapterLectures[i].content;
              if (i < chapterLectures.length - 1) md += '\n\n---\n\n';
            }

            const filename = `${formatIndex(chapterIndex)}_${sanitize(chapterTitle)}_combined.md`;
            root?.file(filename, md);
            chapterIndex++;
          }

        } else {
          // File per lecture
          // We need to keep track of chapter indices roughly. 
          // Since we might receive them out of order, we simply use the chapter title as folder

          for (const l of lectures) {
            const folderName = sanitize(l.chapterTitle);
            const fileName = `${formatIndex(l.objectIndex)}-${sanitize(l.lectureTitle)}.md`;

            // Try to use index if we can infer it, otherwise simple folder
            const chapterFolder = root?.folder(folderName);
            chapterFolder?.file(fileName, l.content);
          }
        }

        const blob = await zip.generateAsync({ type: 'blob' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${sanitizedCourseTitle}-${timestamp}.zip`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        setZipStatus('downloaded');
        setProgress(prev => ({
          ...prev,
          status: 'completed',
          message: 'Notes (Client-Side) generated successfully!'
        }));

      } catch (error) {
        console.error('Error generating client-side ZIP:', error);
        setProgress({
          progress: 100,
          status: 'error',
          message: 'Failed to generate ZIP locally.'
        });
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

                // Buffer content if present
                if (data.content && data.lectureId && data.chapterTitle && data.lectureTitle) {
                  contentBufferRef.current.set(data.lectureId, {
                    content: data.content,
                    chapterTitle: data.chapterTitle,
                    lectureTitle: data.lectureTitle,
                    objectIndex: data.objectIndex || 0,
                    lectureId: data.lectureId
                  });
                }

                if (data.status === 'completed') {
                  setZipStatus('generating');
                  setProgress(prev => ({
                    ...prev,
                    message: 'Generating ZIP file locally...'
                  }));
                  generateZipLocally();
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
