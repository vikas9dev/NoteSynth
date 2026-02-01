import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from './components/Header';
import Footer from './components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'NoteSynth - Transform Courses into Beautiful Notes',
  description: 'Generate AI-powered markdown notes from Udemy courses. Transform lecture transcripts into structured, readable notes with Google Gemini and Groq.',
  keywords: ['Udemy', 'notes', 'AI', 'markdown', 'course notes', 'learning'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full dark">
      <body className={`${inter.className} min-h-full flex flex-col font-sans`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 min-h-full flex flex-col">
          <Header />
          <main className="flex-1">{children}</main>
        </div>
        <Footer />
      </body>
    </html>
  );
} 