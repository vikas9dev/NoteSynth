'use client';

import { useState, useEffect } from 'react';
import { UdemyCourse } from '../../types/udemy';
import { LockClosedIcon, CheckCircleIcon, ExclamationCircleIcon, BeakerIcon } from '@heroicons/react/24/outline';
import { SparklesIcon } from '@heroicons/react/24/solid';

interface CookieInputProps {
  onCoursesLoaded: (courses: UdemyCourse[]) => void;
}

export default function CookieInput({ onCoursesLoaded }: CookieInputProps) {
  const [cookie, setCookie] = useState('');
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Load cookie from localStorage on mount
    const storedCookie = localStorage.getItem('udemyCookie');
    if (storedCookie) {
      setCookie(storedCookie);

      // If we have stored courses, load them immediately
      const storedCourses = localStorage.getItem('storedCourses');
      if (storedCourses) {
        try {
          const courses = JSON.parse(storedCourses);
          onCoursesLoaded(courses);
          setSuccess(true);
          // Revalidate in the background
          fetchCourses(storedCookie, true);
        } catch (e) {
          console.error('Failed to parse stored courses:', e);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchCourses = async (cookieValue: string, isBackground = false) => {
    if (!isBackground) {
      setLoading(true);
      setError(null);
      setSuccess(false);
    }

    try {
      const response = await fetch('/api/udemy/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cookie: cookieValue }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('udemyCookie');
          localStorage.removeItem('storedCourses');
          throw new Error('Invalid cookie. Please provide a valid Udemy cookie.');
        }
        throw new Error('Failed to fetch courses. Please try again.');
      }

      const data = await response.json();
      localStorage.setItem('storedCourses', JSON.stringify(data.results));
      onCoursesLoaded(data.results);
      if (!isBackground) {
        setSuccess(true);
      }
    } catch (err: unknown) {
      if (!isBackground) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred.');
        }
      }
      console.error('Error fetching courses:', err);
    } finally {
      if (!isBackground) {
        setLoading(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('udemyCookie', cookie);
    localStorage.removeItem('isDemoMode'); // Clear demo mode when using real cookie
    await fetchCourses(cookie);
  };

  const loadDemoCourses = async () => {
    setDemoLoading(true);
    setError(null);
    try {
      const response = await fetch('/demo/demoCourses.json');
      if (!response.ok) throw new Error('Failed to load demo courses');
      const data = await response.json();
      localStorage.setItem('isDemoMode', 'true');
      localStorage.setItem('storedCourses', JSON.stringify(data.results));
      localStorage.removeItem('udemyCookie'); // Clear any real cookie
      onCoursesLoaded(data.results);
      setSuccess(true);
    } catch (err) {
      setError('Failed to load demo courses. Please try again.');
      console.error('Demo load error:', err);
    } finally {
      setDemoLoading(false);
    }
  };

  return (
    <div className="mb-12">
      {/* Hero Section */}
      <div className="mb-8 text-center scale-in w-full">
        <div className="flex items-center justify-center gap-2 mb-4">
          <SparklesIcon className="h-8 w-8 text-indigo-500 dark:text-purple-400 floating" />
          <h2 className="text-3xl md:text-4xl font-extrabold gradient-text">
            Get Started
          </h2>
          <SparklesIcon className="h-8 w-8 text-purple-500 dark:text-cyan-400 floating" style={{ animationDelay: '1s' }} />
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-lg max-w-[42rem] mx-auto">
          Enter your Udemy cookie to unlock your courses and transform them into beautiful,
          structured markdown notes powered by AI.
        </p>
      </div>

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="scale-in" style={{ animationDelay: '0.1s' }}>
        <div className="glass-card rounded-2xl p-6 md:p-8 max-w-3xl mx-auto">
          <div className="space-y-4">
            {/* Label with Icon */}
            <label htmlFor="cookie" className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
              <LockClosedIcon className="h-5 w-5 text-indigo-500 dark:text-purple-400" />
              <span>Udemy Cookie</span>
              <span className="text-xs font-normal text-gray-500 dark:text-gray-400 ml-auto">
                Your data stays in your browser
              </span>
            </label>

            {/* Textarea with enhanced styling */}
            <div className="relative">
              <textarea
                id="cookie"
                value={cookie}
                onChange={(e) => {
                  setCookie(e.target.value);
                  setError(null);
                  setSuccess(false);
                }}
                placeholder="Paste your Udemy cookie here..."
                className="w-full border-2 border-gray-200 dark:border-slate-700 rounded-xl p-4 h-32 text-sm 
                  bg-white dark:bg-slate-800 text-gray-900 dark:text-white
                  placeholder:text-gray-400 dark:placeholder:text-gray-500
                  focus:border-indigo-500 dark:focus:border-purple-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-purple-900
                  transition-all duration-300 outline-none resize-none
                  font-mono"
                required
              />
              {success && (
                <div className="absolute top-3 right-3">
                  <CheckCircleIcon className="h-6 w-6 text-green-500 animate-bounce" />
                </div>
              )}
            </div>

            {/* Help Text */}
            <div className="bg-indigo-50 dark:bg-slate-800/50 rounded-lg p-4 text-sm">
              <p className="text-gray-700 dark:text-gray-300 font-medium mb-2">
                📖 How to get your cookie:
              </p>
              <ol className="list-decimal list-inside space-y-1 text-gray-600 dark:text-gray-400 ml-2">
                <li>Log in to <a href="https://www.udemy.com" target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline">Udemy.com</a></li>
                <li>Open Developer Tools (Press F12)</li>
                <li>Go to Network tab and click any course</li>
                <li>Find a request and copy the <code className="px-1.5 py-0.5 bg-gray-200 dark:bg-slate-700 rounded text-xs font-mono">cookie</code> header value</li>
              </ol>
            </div>

            {/* Button and Status */}
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <button
                type="submit"
                disabled={loading || !cookie.trim()}
                className="btn-gradient w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <span className="flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Loading Courses...</span>
                    </>
                  ) : success ? (
                    <>
                      <CheckCircleIcon className="h-5 w-5" />
                      <span>Courses Loaded!</span>
                    </>
                  ) : (
                    <>
                      <SparklesIcon className="h-5 w-5" />
                      <span>Save & Load Courses</span>
                    </>
                  )}
                </span>
              </button>

              {success && !loading && (
                <p className="text-sm text-green-600 dark:text-green-400 font-medium flex items-center gap-1.5">
                  <CheckCircleIcon className="h-5 w-5" />
                  Successfully loaded your courses!
                </p>
              )}
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-slate-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white dark:bg-slate-800 text-gray-500 dark:text-gray-400">or</span>
              </div>
            </div>

            {/* Demo Button */}
            <button
              type="button"
              onClick={loadDemoCourses}
              disabled={demoLoading}
              className="w-full py-3 px-6 rounded-lg font-semibold text-gray-700 dark:text-gray-300 
                bg-gray-100 dark:bg-slate-700 border-2 border-dashed border-gray-300 dark:border-slate-600
                hover:bg-gray-200 dark:hover:bg-slate-600 hover:border-indigo-400 dark:hover:border-purple-500
                transition-all duration-300 disabled:opacity-50"
            >
              <span className="flex items-center justify-center gap-2">
                {demoLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Loading Demo...</span>
                  </>
                ) : (
                  <>
                    <BeakerIcon className="h-5 w-5 text-indigo-500" />
                    <span>Explore Demo Courses</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">(No cookie required)</span>
                  </>
                )}
              </span>
            </button>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 text-red-700 dark:text-red-400 p-4 rounded-lg flex items-start gap-3 slide-in">
                <ExclamationCircleIcon className="h-6 w-6 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Error</p>
                  <p className="text-sm">{error}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
} 