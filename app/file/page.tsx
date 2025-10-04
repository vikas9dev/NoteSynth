'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeftIcon, DocumentArrowUpIcon, CloudArrowUpIcon } from '@heroicons/react/24/outline';

export default function FilePage() {
  const router = useRouter();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;
    
    const fileArray = Array.from(files);
    const validFiles = fileArray.filter(file => {
      const validTypes = [
        'video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/flv',
        'audio/mp3', 'audio/wav', 'audio/m4a', 'audio/aac', 'audio/ogg'
      ];
      return validTypes.includes(file.type);
    });

    if (validFiles.length !== fileArray.length) {
      setError('Some files were skipped. Only audio and video files are supported.');
    }

    setSelectedFiles(prev => [...prev, ...validFiles]);
    setError(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFiles.length === 0) {
      setError('Please select at least one file');
      return;
    }
    
    // TODO: Implement file processing
    setError('File upload integration coming soon!');
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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
          File Upload Notes
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Upload your own audio or video files to generate structured notes
        </p>
      </div>

      {/* Coming Soon Banner */}
      <div className="bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-lg p-6 mb-8">
        <div className="flex items-center">
          <DocumentArrowUpIcon className="h-8 w-8 text-green-600 dark:text-green-400 mr-4" />
          <div>
            <h3 className="text-lg font-semibold text-green-900 dark:text-green-100">
              File Upload Integration Coming Soon!
            </h3>
            <p className="text-green-700 dark:text-green-300 mt-1">
              We're developing support for uploading your own audio and video files. 
              This will support various formats including MP4, MP3, WAV, and more.
            </p>
          </div>
        </div>
      </div>

      {/* File Upload Form */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Upload Your Files
          </h2>
          
          {/* Drag and Drop Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive 
                ? 'border-blue-400 bg-blue-50 dark:bg-blue-900' 
                : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <CloudArrowUpIcon className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-2">
              Drag and drop your files here, or
            </p>
            <label className="cursor-pointer">
              <span className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
                browse to select files
              </span>
              <input
                type="file"
                multiple
                accept="video/*,audio/*"
                onChange={(e) => handleFileSelect(e.target.files)}
                className="hidden"
                disabled
              />
            </label>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Supports MP4, AVI, MOV, MP3, WAV, M4A, and more
            </p>
          </div>

          {/* Selected Files */}
          {selectedFiles.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Selected Files ({selectedFiles.length})
              </h3>
              <div className="space-y-2">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                    <div className="flex items-center">
                      <DocumentArrowUpIcon className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {file.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {formatFileSize(file.size)} • {file.type}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFile(index)}
                      className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 text-red-600 dark:text-red-300 p-3 rounded-md mt-4">
              {error}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled
            className="w-full bg-gray-400 text-white py-3 px-4 rounded-md cursor-not-allowed flex items-center justify-center mt-6"
          >
            <DocumentArrowUpIcon className="h-5 w-5 mr-2" />
            Generate Notes (Coming Soon)
          </button>
        </div>

        {/* Features Preview */}
        <div className="mt-12">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Planned Features
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 dark:bg-blue-900 rounded-full p-3 mr-4">
                  <DocumentArrowUpIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Multiple Formats
                </h4>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                Support for various audio and video formats including MP4, MP3, WAV, AVI, and more.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <div className="flex items-center mb-4">
                <div className="bg-green-100 dark:bg-green-900 rounded-full p-3 mr-4">
                  <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Fast Processing
                </h4>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                Quick processing of uploaded files with real-time progress tracking.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <div className="flex items-center mb-4">
                <div className="bg-purple-100 dark:bg-purple-900 rounded-full p-3 mr-4">
                  <svg className="h-6 w-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Batch Processing
                </h4>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                Upload and process multiple files simultaneously for maximum efficiency.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <div className="flex items-center mb-4">
                <div className="bg-indigo-100 dark:bg-indigo-900 rounded-full p-3 mr-4">
                  <svg className="h-6 w-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Quality Detection
                </h4>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                Automatic quality assessment and optimization for best note generation results.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <div className="flex items-center mb-4">
                <div className="bg-yellow-100 dark:bg-yellow-900 rounded-full p-3 mr-4">
                  <svg className="h-6 w-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Secure Upload
                </h4>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                Secure file handling with automatic cleanup after processing.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <div className="flex items-center mb-4">
                <div className="bg-red-100 dark:bg-red-900 rounded-full p-3 mr-4">
                  <svg className="h-6 w-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Large File Support
                </h4>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                Handle large audio and video files with optimized processing algorithms.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
