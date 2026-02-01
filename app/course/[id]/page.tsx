'use client';

import { useState, useEffect } from 'react';
import { use } from 'react';
import Image from 'next/image';
import { CurriculumItem } from '../../types/udemy';
import GenerateProgress from '../../components/GenerateProgress';
import { ChevronDownIcon, ChevronRightIcon, CheckIcon, LockClosedIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { SparklesIcon } from '@heroicons/react/24/solid';

interface ChapterData {
  id: number;
  title: string;
  lectures: CurriculumItem[];
}

interface CourseInfo {
  title: string;
  image_480x270: string;
  completion_ratio: number;
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function CoursePage({ params }: PageProps) {
  const resolvedParams = use(params);
  const id = resolvedParams?.id;
  const [curriculum, setCurriculum] = useState<ChapterData[]>([]);
  const [courseInfo, setCourseInfo] = useState<CourseInfo | null>(null);
  const [selectedLectures, setSelectedLectures] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [expandedChapters, setExpandedChapters] = useState<Set<number>>(new Set());
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [showDemoError, setShowDemoError] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      try {
        const demoMode = localStorage.getItem('isDemoMode') === 'true';
        setIsDemoMode(demoMode);

        if (demoMode) {
          // Load from demo data
          const coursesResponse = await fetch('/demo/demoCourses.json');
          const coursesData = await coursesResponse.json();
          const course = coursesData.results.find((c: { id: number }) => c.id.toString() === id);
          if (course) {
            setCourseInfo({
              title: course.title,
              image_480x270: course.image_480x270,
              completion_ratio: course.completion_ratio,
            });
          }

          const curriculumResponse = await fetch('/demo/demoCurriculum.json');
          const curriculumData = await curriculumResponse.json();
          const demoCurriculum = curriculumData[id];

          if (demoCurriculum) {
            // Organize curriculum into chapters (same structure as real API)
            const chapters: ChapterData[] = [];
            let currentChapter: ChapterData | null = null;

            demoCurriculum.results.forEach((item: CurriculumItem) => {
              if (item._class === 'chapter') {
                currentChapter = {
                  id: item.id,
                  title: item.title,
                  lectures: [],
                };
                chapters.push(currentChapter);
              } else if (item._class === 'lecture' && currentChapter) {
                currentChapter.lectures.push(item);
              }
            });

            setCurriculum(chapters);
          }
        } else {
          const cookie = localStorage.getItem('udemyCookie');
          if (!cookie) {
            throw new Error('No cookie found. Please go back and enter your Udemy cookie.');
          }

          // Fetch course info
          const courseResponse = await fetch('/api/udemy/courses', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ cookie }),
          });

          if (!courseResponse.ok) {
            throw new Error('Failed to fetch course information');
          }

          const coursesData = await courseResponse.json();
          const course = coursesData.results.find((c: unknown) => {
            if (typeof c === 'object' && c !== null && 'id' in c) {
              // @ts-expect-error: dynamic object from API
              return c.id.toString() === id;
            }
            return false;
          });
          if (course) {
            setCourseInfo({
              title: course.title,
              image_480x270: course.image_480x270,
              completion_ratio: course.completion_ratio,
            });
          }

          // Fetch curriculum
          const curriculumResponse = await fetch('/api/udemy/curriculum', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ courseId: id, cookie }),
          });

          if (!curriculumResponse.ok) {
            throw new Error('Failed to fetch curriculum');
          }

          const data = await curriculumResponse.json();

          // Organize curriculum into chapters
          const chapters: ChapterData[] = [];
          let currentChapter: ChapterData | null = null;

          data.results.forEach((item: CurriculumItem) => {
            if (item._class === 'chapter') {
              currentChapter = {
                id: item.id,
                title: item.title,
                lectures: [],
              };
              chapters.push(currentChapter);
            } else if (item._class === 'lecture' && currentChapter) {
              currentChapter.lectures.push(item);
            }
          });

          setCurriculum(chapters);
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const toggleChapterExpand = (chapterId: number) => {
    const newExpanded = new Set(expandedChapters);
    if (newExpanded.has(chapterId)) {
      newExpanded.delete(chapterId);
    } else {
      newExpanded.add(chapterId);
    }
    setExpandedChapters(newExpanded);
  };

  const toggleChapter = (chapterId: number, lectures: CurriculumItem[], e: React.MouseEvent) => {
    e.stopPropagation();
    const lectureIds = lectures.map(l => l.id);
    const newSelected = new Set(selectedLectures);
    const allSelected = lectures.every(l => selectedLectures.has(l.id));

    if (allSelected) {
      lectureIds.forEach(id => newSelected.delete(id));
    } else {
      lectureIds.forEach(id => newSelected.add(id));
    }

    setSelectedLectures(newSelected);
  };

  const toggleLecture = (lectureId: number) => {
    const newSelected = new Set(selectedLectures);
    if (newSelected.has(lectureId)) {
      newSelected.delete(lectureId);
    } else {
      newSelected.add(lectureId);
    }
    setSelectedLectures(newSelected);
  };

  const handleGenerateNotes = () => {
    if (selectedLectures.size === 0) return;
    if (isDemoMode) {
      setShowDemoError(true);
      return;
    }
    setIsGenerating(true);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 scale-in">
        <div className="relative w-16 h-16 mb-4">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 opacity-20 animate-ping"></div>
          <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500">
            <SparklesIcon className="h-8 w-8 text-white animate-pulse" />
          </div>
        </div>
        <p className="text-gray-600 dark:text-gray-400 font-medium">Loading curriculum...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto py-12 scale-in">
        <div className="glass-card rounded-2xl p-6 border-l-4 border-red-500">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0">
              <span className="text-red-500 text-xl">!</span>
            </div>
            <div>
              <h3 className="font-semibold text-red-700 dark:text-red-400 mb-1">Error</h3>
              <p className="text-red-600 dark:text-red-300">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!id) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-600 dark:text-gray-400">Loading course...</div>
      </div>
    );
  }

  return (
    <div className="pb-24">
      {/* Demo Mode Banner */}
      {isDemoMode && (
        <div className="mb-6 glass-card rounded-xl p-4 border-l-4 border-amber-500 scale-in">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0">
              <LockClosedIcon className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-amber-700 dark:text-amber-400">Demo Mode</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                You&apos;re viewing demo content. <a href="/" className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium">Enter your Udemy cookie</a> to access your courses.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Course Header Card */}
      {courseInfo && (
        <div className="glass-card rounded-2xl p-6 mb-8 scale-in">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <div className="relative flex-shrink-0">
              <Image
                src={courseInfo.image_480x270}
                alt={courseInfo.title}
                width={200}
                height={113}
                className="rounded-xl shadow-lg"
              />
              <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                {courseInfo.completion_ratio}%
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2">
                {courseInfo.title}
              </h1>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="flex-1 max-w-sm bg-gray-200 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="h-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
                      style={{ width: `${courseInfo.completion_ratio}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    {courseInfo.completion_ratio}% Complete
                  </span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {curriculum.length} sections • {curriculum.reduce((acc, ch) => acc + ch.lectures.length, 0)} lectures
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Course Curriculum
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Click to expand • Check to select
        </p>
      </div>

      {/* Multi-Column Chapter Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
        {curriculum.map((chapter, index) => {
          const isExpanded = expandedChapters.has(chapter.id);
          const allSelected = chapter.lectures.every(l => selectedLectures.has(l.id));
          const someSelected = chapter.lectures.some(l => selectedLectures.has(l.id));
          const selectedCount = chapter.lectures.filter(l => selectedLectures.has(l.id)).length;

          return (
            <div
              key={chapter.id}
              className={`
                glass-card rounded-xl overflow-hidden transition-all duration-300
                ${isExpanded ? 'lg:col-span-2 ring-2 ring-indigo-500/50' : ''}
                ${allSelected ? 'ring-2 ring-green-500/50' : ''}
              `}
            >
              {/* Chapter Header */}
              <div
                onClick={() => toggleChapterExpand(chapter.id)}
                className={`
                  flex items-center gap-3 p-4 cursor-pointer transition-all duration-200
                  hover:bg-gray-50 dark:hover:bg-slate-700/50
                  ${isExpanded ? 'bg-indigo-50/50 dark:bg-indigo-900/20' : ''}
                `}
              >
                {/* Expand/Collapse Icon */}
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-md">
                  {isExpanded ? (
                    <ChevronDownIcon className="h-5 w-5" />
                  ) : (
                    <ChevronRightIcon className="h-5 w-5" />
                  )}
                </div>

                {/* Section Number Badge */}
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-100 dark:bg-slate-700 flex items-center justify-center">
                  <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                    {index + 1}
                  </span>
                </div>

                {/* Chapter Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                    {chapter.title}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {chapter.lectures.length} lectures
                    {someSelected && ` • ${selectedCount} selected`}
                  </p>
                </div>

                {/* Select All Checkbox */}
                <button
                  onClick={(e) => toggleChapter(chapter.id, chapter.lectures, e)}
                  className={`
                    flex-shrink-0 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all duration-200
                    ${allSelected
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-500 border-transparent'
                      : someSelected
                        ? 'border-indigo-400 bg-indigo-100 dark:bg-indigo-900/30'
                        : 'border-gray-300 dark:border-slate-600 hover:border-indigo-400'
                    }
                  `}
                >
                  {allSelected && <CheckIcon className="h-4 w-4 text-white" />}
                  {someSelected && !allSelected && <div className="w-2 h-2 bg-indigo-500 rounded-sm" />}
                </button>
              </div>

              {/* Expanded Lectures */}
              {isExpanded && (
                <div className="border-t border-gray-200 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800/50 p-4 space-y-2">
                  {chapter.lectures.map((lecture, lectureIndex) => (
                    <label
                      key={lecture.id}
                      className={`
                        flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200
                        ${selectedLectures.has(lecture.id)
                          ? 'bg-indigo-50 dark:bg-indigo-900/30 ring-1 ring-indigo-200 dark:ring-indigo-800'
                          : 'hover:bg-white dark:hover:bg-slate-700/50'
                        }
                      `}
                    >
                      {/* Lecture Number */}
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-200 dark:bg-slate-600 flex items-center justify-center text-xs font-medium text-gray-600 dark:text-gray-300">
                        {lectureIndex + 1}
                      </span>

                      {/* Lecture Title */}
                      <span className="flex-1 text-sm text-gray-800 dark:text-gray-200">
                        {lecture.title}
                      </span>

                      {/* Checkbox */}
                      <div
                        className={`
                          flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200
                          ${selectedLectures.has(lecture.id)
                            ? 'bg-gradient-to-r from-indigo-500 to-purple-500 border-transparent'
                            : 'border-gray-300 dark:border-slate-600'
                          }
                        `}
                        onClick={() => toggleLecture(lecture.id)}
                      >
                        {selectedLectures.has(lecture.id) && (
                          <CheckIcon className="h-3 w-3 text-white" />
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Floating Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40">
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-t border-gray-200 dark:border-slate-700 shadow-lg">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold">
                  {selectedLectures.size}
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {selectedLectures.size} lecture{selectedLectures.size !== 1 ? 's' : ''} selected
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Ready to generate notes
                  </p>
                </div>
              </div>
              <button
                onClick={handleGenerateNotes}
                disabled={selectedLectures.size === 0}
                className="btn-gradient flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <SparklesIcon className="h-5 w-5" />
                <span className="font-semibold">Generate Notes</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <GenerateProgress
        isGenerating={isGenerating}
        onClose={() => setIsGenerating(false)}
        courseId={id}
        lectureIds={Array.from(selectedLectures)}
      />

      {/* Demo Mode Error Modal */}
      {showDemoError && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          style={{ padding: '1rem' }}
        >
          <div
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 relative"
            style={{ width: '100%', maxWidth: '480px', padding: '2rem' }}
          >
            {/* Close button */}
            <button
              onClick={() => setShowDemoError(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>

            {/* Content centered */}
            <div className="text-center">
              {/* Icon */}
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900/30 dark:to-amber-800/30 flex items-center justify-center">
                <LockClosedIcon className="h-8 w-8 text-amber-600 dark:text-amber-400" />
              </div>

              {/* Title */}
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                Demo Mode
              </h3>

              {/* Description */}
              <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                Note generation is not available in demo mode. To generate notes from your courses,
                please enter your Udemy cookie on the home page.
              </p>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setShowDemoError(false)}
                  className="flex-1 py-3 px-6 rounded-xl border-2 border-gray-200 dark:border-slate-600 
                    text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-slate-700 transition-all"
                >
                  Close
                </button>
                <a
                  href="/"
                  className="flex-1 btn-gradient py-3 px-6 rounded-xl text-center font-medium"
                >
                  Enter Cookie
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 