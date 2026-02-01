'use client';

import { useState, useMemo } from 'react';
import { UdemyCourse } from '../../types/udemy';
import Image from 'next/image';
import { MagnifyingGlassIcon, FunnelIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

interface CourseGridProps {
  courses: UdemyCourse[];
  selectedCourseId: number | null;
  onCourseSelect: (course: UdemyCourse) => void;
}

type SortOption = 'completion' | 'last_accessed';

export default function CourseGrid({ courses, selectedCourseId, onCourseSelect }: CourseGridProps) {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('last_accessed');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const filteredAndSortedCourses = useMemo(() => {
    let result = courses;

    // Filter by search
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(course =>
        course.title.toLowerCase().includes(searchLower)
      );
    }

    // Sort courses
    result = [...result].sort((a, b) => {
      if (sortBy === 'completion') {
        return b.completion_ratio - a.completion_ratio;
      }
      // For last_accessed, we'll use the order they come in
      return 0;
    });

    return result;
  }, [courses, search, sortBy]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredAndSortedCourses.length / itemsPerPage);
  const paginatedCourses = filteredAndSortedCourses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="text-center mb-4">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Your Courses
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Select a course to generate notes • {courses.length} courses available
        </p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search input */}
        <div className="flex-grow relative">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search courses..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1); // Reset to first page on search
            }}
            className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 dark:border-slate-700 rounded-xl
              bg-white dark:bg-slate-800 text-gray-900 dark:text-white
              placeholder:text-gray-400 dark:placeholder:text-gray-500
              focus:border-indigo-500 dark:focus:border-purple-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-purple-900
              transition-all duration-300 outline-none"
          />
        </div>

        {/* Sort dropdown */}
        <div className="relative">
          <FunnelIcon className="h-5 w-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="pl-12 pr-10 py-3 border-2 border-gray-200 dark:border-slate-700 rounded-xl
              bg-white dark:bg-slate-800 text-gray-900 dark:text-white
              focus:border-indigo-500 dark:focus:border-purple-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-purple-900
              transition-all duration-300 outline-none appearance-none cursor-pointer"
          >
            <option value="last_accessed">Recently Accessed</option>
            <option value="completion">By Completion</option>
          </select>
        </div>
      </div>

      {/* Course grid with stagger animation */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
        {paginatedCourses.map((course) => {
          const isSelected = selectedCourseId === course.id;
          return (
            <div
              key={course.id}
              className={`
                group relative premium-card cursor-pointer overflow-hidden
                ${isSelected ? 'ring-2 ring-indigo-500 dark:ring-purple-500 ring-offset-2 dark:ring-offset-slate-900' : ''}
              `}
              onClick={() => onCourseSelect(course)}
            >
              {/* Selection Indicator */}
              {isSelected && (
                <div className="absolute top-3 right-3 z-10 bg-indigo-500 dark:bg-purple-500 rounded-full p-1.5 shadow-lg scale-in">
                  <CheckCircleIcon className="h-5 w-5 text-white" />
                </div>
              )}

              {/* Course Image */}
              <div className="relative h-40 overflow-hidden rounded-t-lg bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-950 dark:to-purple-950">
                <Image
                  src={course.image_240x135}
                  alt={course.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              {/* Course Info */}
              <div className="p-5 space-y-3">
                {/* Title */}
                <h3 className="font-bold text-gray-900 dark:text-white text-base line-clamp-2 min-h-[3rem] group-hover:text-indigo-600 dark:group-hover:text-purple-400 transition-colors duration-200">
                  {course.title}
                </h3>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-600 dark:text-gray-400 font-medium">Progress</span>
                    <span className="font-bold text-indigo-600 dark:text-purple-400">{course.completion_ratio}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
                      style={{ width: `${course.completion_ratio}%` }}
                    />
                  </div>
                </div>

                {/* Selection Badge (for selected state) */}
                {isSelected && (
                  <div className="flex items-center gap-1.5 text-sm text-indigo-600 dark:text-purple-400 font-semibold">
                    <CheckCircleIcon className="h-4 w-4" />
                    <span>Selected</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredAndSortedCourses.length === 0 && (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No courses found</h3>
          <p className="text-gray-600 dark:text-gray-400">
            {search ? 'Try adjusting your search terms' : 'No courses available'}
          </p>
        </div>
      )}

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-6 py-2.5 border-2 border-gray-200 dark:border-slate-700 rounded-lg
              bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300
              hover:border-indigo-500 dark:hover:border-purple-500 hover:text-indigo-600 dark:hover:text-purple-400
              disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-gray-200 dark:disabled:hover:border-slate-700
              transition-all duration-200 font-medium"
          >
            Previous
          </button>

          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`
                  w-10 h-10 rounded-lg font-semibold transition-all duration-200
                  ${currentPage === page
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg scale-110'
                    : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 border-2 border-gray-200 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-purple-500'
                  }
                `}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-6 py-2.5 border-2 border-gray-200 dark:border-slate-700 rounded-lg
              bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300
              hover:border-indigo-500 dark:hover:border-purple-500 hover:text-indigo-600 dark:hover:text-purple-400
              disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-gray-200 dark:disabled:hover:border-slate-700
              transition-all duration-200 font-medium"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
} 