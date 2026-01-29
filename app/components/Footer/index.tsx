import { HeartIcon } from '@heroicons/react/24/solid';
import { CodeBracketIcon } from '@heroicons/react/24/outline';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="w-full mt-auto bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800">
      {/* Gradient border top */}
      <div className="h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Branding */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <h3 className="text-lg font-bold gradient-text">NoteSynth</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center md:text-left">
              Transform your courses into beautiful notes
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <a
              href="https://github.com/vikas9dev/NoteSynth"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200 group"
            >
              <CodeBracketIcon className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
              <span>GitHub</span>
            </a>
            <a
              href="#"
              className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200"
            >
              Privacy
            </a>
            <a
              href="#"
              className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200"
            >
              Terms
            </a>
            <a
              href="#"
              className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200"
            >
              Docs
            </a>
          </div>

          {/* Copyright */}
          <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
            <span>&copy; {year} Made with</span>
            <HeartIcon className="h-4 w-4 text-red-500 animate-pulse" />
            <span>by vikas9dev</span>
          </div>
        </div>
      </div>
    </footer>
  );
} 