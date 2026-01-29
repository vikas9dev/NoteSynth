'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UdemyCourse } from './types/udemy';
import CookieInput from './components/CookieInput';
import CourseGrid from './components/CourseGrid';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

export default function Home() {
  const router = useRouter();
  const [courses, setCourses] = useState<UdemyCourse[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<UdemyCourse | null>(null);
  const [error] = useState<string | null>(null);

  const handleGenerateNotes = () => {
    if (!selectedCourse) return;
    router.push(`/course/${selectedCourse.id}`);
  };

  return (
    <main className="min-h-screen pb-24">
      <CookieInput onCoursesLoaded={setCourses} />

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 text-red-700 dark:text-red-400 p-4 rounded-lg mb-8 slide-in">
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

          {/* Floating Action Button */}
          {selectedCourse && (
            <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-40 scale-in">
              <button
                onClick={handleGenerateNotes}
                className="btn-gradient flex items-center gap-3 px-8 py-4 text-lg shadow-2xl"
              >
                <span className="font-bold">Select Lectures from {selectedCourse.title.substring(0, 30)}...</span>
                <ArrowRightIcon className="h-6 w-6" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Empty State when no courses */}
      {courses.length === 0 && !error && (
        <div className="text-center py-16 scale-in">
          <div className="text-6xl mb-4">🎓</div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Ready to get started?
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Enter your Udemy cookie above to see your courses
          </p>
        </div>
      )}
    </main>
  );
} 