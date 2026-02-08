'use client';

import Link from 'next/link';
import { BookOpenIcon, ClockIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

// Blog metadata - in a real app this would come from a CMS or file system
const blogs = [
    {
        slug: 'history-and-progress',
        title: 'Real-Time Progress & Generation History',
        description: 'Watch your notes being generated in real-time with our new progress table. Plus, track all your past sessions in the dedicated History page.',
        readTime: '3 min',
        date: 'February 2026',
        featured: true,
    },
    {
        slug: 'new-features-customization',
        title: 'Introducing Complete Customization: NoteSynth 2.0',
        description: 'Take full control of your notes with custom AI prompts and flexible output formats. Learn how to tailor NoteSynth to your learning style.',
        readTime: '4 min',
        date: 'February 2026',
        featured: false,
    },
    {
        slug: 'what-is-notesynth',
        title: 'Transform Your Udemy Course Videos into Beautiful Study Notes with NoteSynth',
        description: 'Discover how NoteSynth automatically converts your Udemy course videos into well-structured, beautiful Markdown notes you can review anytime.',
        readTime: '5 min',
        date: 'February 2026',
        featured: false,
    },
    {
        slug: 'how-notesynth-works',
        title: 'How NoteSynth Works: A Behind-the-Scenes Look',
        description: 'Ever wondered how NoteSynth transforms video lectures into perfectly formatted study notes? Learn about the 5-step process and technical architecture.',
        readTime: '7 min',
        date: 'February 2026',
        featured: false,
    },
];

export default function BlogPage() {
    return (
        <div className="min-h-screen py-12 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <header className="mb-12">
                    <div className="text-center mb-4">
                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-sm font-medium">
                            <BookOpenIcon className="h-4 w-4" />
                            Blog
                        </span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 text-center px-4">
                        Learn More About <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">NoteSynth</span>
                    </h1>
                    <p>
                        Tips, guides, and insights on how to get the most out of your Udemy courses with AI-powered note generation.
                    </p>
                </header>

                {/* Blog Grid */}
                <div className="space-y-6">
                    {blogs.map((blog, index) => (
                        <Link
                            key={blog.slug}
                            href={`/blog/${blog.slug}`}
                            className={`block glass-card rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group ${
                                blog.featured ? 'border-2 border-indigo-500/30' : ''
                            }`}
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            {blog.featured && (
                                <span className="inline-block px-3 py-1 text-xs font-semibold bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full mb-3">
                                    Featured
                                </span>
                            )}

                            <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                {blog.title}
                            </h2>

                            <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                                {blog.description}
                            </p>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                                    <span>{blog.date}</span>
                                    <span className="flex items-center gap-1">
                                        <ClockIcon className="h-4 w-4" />
                                        {blog.readTime}
                                    </span>
                                </div>

                                <span className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-medium text-sm group-hover:gap-2 transition-all">
                                    Read more
                                    <ArrowRightIcon className="h-4 w-4" />
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Back to Home */}
                <div className="mt-12 text-center">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                    >
                        ← Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
