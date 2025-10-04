'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UdemyCourse } from '../types/udemy';
import CookieInput from '../components/CookieInput';
import CourseGrid from '../components/CourseGrid';
import { ArrowDownTrayIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function UdemyPage() {
  const router = useRouter();
  const [courses, setCourses] = useState<UdemyCourse[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<UdemyCourse | null>(null);
  const [error] = useState<string | null>(null);

  const handleGenerateNotes = () => {
    if (!selectedCourse) return;
    router.push(`/udemy/course/${selectedCourse.id}`);
  };

  return (
    <main className="min-h-screen">
      {/* Header with back button */}
      <div className="mb-8">
        <button
          onClick={() => router.push('/')}
          className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back to Home
        </button>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mt-4">
          Udemy Course Notes
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Generate structured notes from your Udemy course lectures
        </p>
      </div>

      <CookieInput onCoursesLoaded={setCourses} />

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md mb-8">
          {error}
        </div>
      )}

      {courses.length > 0 && (
        <div className="space-y-8">
          <CourseGrid
            courses={courses}
            selectedCourseId={selectedCourse?.id || null}
            onCourseSelect={setSelectedCourse}
          />

          <div className="sticky bottom-0 bg-white dark:bg-gray-900 border-t py-4 mt-8 -mx-8 px-8">
            <div className="max-w-6xl mx-auto flex items-center justify-between">
              <div className="text-sm text-gray-600 dark:text-gray-300">
                {selectedCourse ? (
                  <span>Selected: <strong>{selectedCourse.title}</strong></span>
                ) : (
                  <span>Select a course to generate notes</span>
                )}
              </div>
              <button
                onClick={handleGenerateNotes}
                disabled={!selectedCourse}
                className="flex items-center space-x-2 bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed"
              >
                <ArrowDownTrayIcon className="h-5 w-5" />
                <span>Select Lectures</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
