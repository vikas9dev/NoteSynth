'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  AcademicCapIcon, 
  PlayIcon, 
  DocumentArrowUpIcon 
} from '@heroicons/react/24/outline';

export default function Home() {
  const router = useRouter();

  const navigationCards = [
    {
      id: 'udemy',
      title: 'Udemy Courses',
      description: 'Generate structured notes from your Udemy course lectures. Connect your account and select specific lectures to create comprehensive study materials.',
      icon: AcademicCapIcon,
      image: '/udemy-icon.png', // You can add actual images later
      href: '/udemy',
      color: 'bg-purple-500',
      hoverColor: 'hover:bg-purple-600'
    },
    {
      id: 'youtube',
      title: 'YouTube Videos',
      description: 'Extract and structure notes from YouTube educational content. Perfect for tutorials, lectures, and educational videos.',
      icon: PlayIcon,
      image: '/youtube-icon.png',
      href: '/youtube',
      color: 'bg-red-500',
      hoverColor: 'hover:bg-red-600'
    },
    {
      id: 'file',
      title: 'File Upload',
      description: 'Upload your own audio or video files to generate notes. Supports various formats for maximum flexibility.',
      icon: DocumentArrowUpIcon,
      image: '/file-icon.png',
      href: '/file',
      color: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600'
    }
  ];

  const handleCardClick = (href: string) => {
    router.push(href);
  };

  return (
    <main className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            NoteSynth
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            AI-powered note generation from multiple sources
          </p>
          <p className="text-lg text-gray-500 dark:text-gray-400 max-w-3xl mx-auto">
            Transform your learning materials into structured, comprehensive notes. 
            Choose your preferred source and let AI do the heavy lifting.
          </p>
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-3 gap-8">
          {navigationCards.map((card) => {
            const IconComponent = card.icon;
            return (
              <div
                key={card.id}
                onClick={() => handleCardClick(card.href)}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2 border border-gray-200 dark:border-gray-700 overflow-hidden group"
              >
                {/* Card Header with Icon */}
                <div className={`${card.color} p-4 text-white`}>
                  <div className="flex items-center justify-center mb-3">
                    <IconComponent className="h-4 w-4 text-white" style={{ width: '48px', height: '48px' }} />
                  </div>
                  <h3 className="text-lg font-semibold text-center">
                    {card.title}
                  </h3>
                </div>

                {/* Card Content */}
                <div className="p-6">
                  <p className="text-gray-600 dark:text-gray-300 text-center leading-relaxed">
                    {card.description}
                  </p>
                  
                  {/* Action Button */}
                  <div className="mt-6 text-center">
                    <span className={`inline-flex items-center px-4 py-2 rounded-lg text-white font-medium transition-colors ${card.color} ${card.hoverColor} group-hover:scale-105`}>
                      Get Started
                      <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Features Section */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Why Choose NoteSynth?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              {/* <div className="bg-indigo-100 dark:bg-indigo-900 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center style={{ width: '48px', height: '48px' }}">
                <svg className="h-8 w-8 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div> */}
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">AI-Powered</h3>
              <p className="text-gray-600 dark:text-gray-300">Advanced AI processes your content to create structured, comprehensive notes.</p>
            </div>
            <div className="text-center">
              {/* <div className="bg-green-100 dark:bg-green-900 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <svg className="h-8 w-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div> */}
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Fast & Efficient</h3>
              <p className="text-gray-600 dark:text-gray-300">Generate notes in minutes, not hours. Save time and focus on learning.</p>
            </div>
            <div className="text-center">
              {/* className="h-4 w-4 text-white" style={{ width: '48px', height: '48px' }} */}
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Multiple Sources</h3>
              <p className="text-gray-600 dark:text-gray-300">Support for Udemy, YouTube, and file uploads. One tool for all your needs.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 