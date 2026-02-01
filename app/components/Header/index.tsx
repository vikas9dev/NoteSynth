'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { SunIcon, MoonIcon, Bars3Icon, XMarkIcon, Cog6ToothIcon, ClockIcon } from '@heroicons/react/24/outline';

export default function Header() {
  const [isDark, setIsDark] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Check initial dark mode state
    const isDarkMode = document.documentElement.classList.contains('dark');
    setIsDark(isDarkMode);

    // Handle scroll effect
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle('dark');
    setIsDark(!isDark);
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled
        ? 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-md'
        : 'bg-transparent'
        }`}
    >
      <div className="flex justify-between items-center py-4">
        {/* Logo */}
        <Link href="/" className="group">
          <h1 className="text-2xl md:text-3xl font-extrabold gradient-text hover:scale-105 transition-transform duration-300 cursor-pointer">
            NoteSynth
          </h1>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link
            href="/"
            className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200 relative group"
          >
            Home
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link
            href="/blog"
            className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200 relative group"
          >
            Blog
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link
            href="/history"
            className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200 relative group flex items-center gap-1"
            title="History"
          >
            <ClockIcon className="h-5 w-5" />
            <span className="md:hidden lg:inline">History</span>
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link
            href="/settings"
            className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200 relative group flex items-center gap-1"
            title="Settings"
          >
            <Cog6ToothIcon className="h-5 w-5" />
            <span className="md:hidden lg:inline">Settings</span>
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 group-hover:w-full transition-all duration-300"></span>
          </Link>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 transition-all duration-300 group"
            aria-label="Toggle dark mode"
          >
            {isDark ? (
              <SunIcon className="h-5 w-5 text-yellow-500 group-hover:rotate-180 transition-transform duration-500" />
            ) : (
              <MoonIcon className="h-5 w-5 text-indigo-600 group-hover:-rotate-12 transition-transform duration-500" />
            )}
          </button>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 rounded-lg bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors duration-200"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <XMarkIcon className="h-6 w-6 text-gray-700 dark:text-gray-300" />
          ) : (
            <Bars3Icon className="h-6 w-6 text-gray-700 dark:text-gray-300" />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden py-4 border-t border-gray-200 dark:border-slate-700 slide-in">
          <nav className="flex flex-col space-y-3">
            <Link
              href="/"
              className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200 px-2 py-1"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/blog"
              className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200 px-2 py-1"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Blog
            </Link>
            <Link
              href="/history"
              className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200 px-2 py-1 flex items-center gap-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <ClockIcon className="h-5 w-5" />
              History
            </Link>
            <Link
              href="/settings"
              className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200 px-2 py-1 flex items-center gap-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Cog6ToothIcon className="h-5 w-5" />
              Settings
            </Link>

            {/* Dark Mode Toggle for Mobile */}
            <button
              onClick={toggleDarkMode}
              className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200 px-2 py-1"
            >
              {isDark ? (
                <>
                  <SunIcon className="h-5 w-5 text-yellow-500" />
                  <span>Light Mode</span>
                </>
              ) : (
                <>
                  <MoonIcon className="h-5 w-5 text-indigo-600" />
                  <span>Dark Mode</span>
                </>
              )}
            </button>
          </nav>
        </div>
      )}

      {/* Bottom border with gradient */}
      <div className="h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50"></div>
    </header>
  );
}
