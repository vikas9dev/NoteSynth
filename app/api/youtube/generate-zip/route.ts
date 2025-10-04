import { NextResponse } from 'next/server';
import JSZip from 'jszip';
import { YoutubeTranscript } from 'youtube-transcript';
import { generateStructuredNotes } from '../../../utils/gemini';

export async function POST(request: Request) {
  try {
    const { videoUrl, videoTitle } = await request.json();

    if (!videoUrl) {
      return NextResponse.json(
        { error: 'Video URL is required' },
        { status: 400 }
      );
    }

    // Extract video ID from URL
    const videoId = extractVideoId(videoUrl);
    if (!videoId) {
      return NextResponse.json(
        { error: 'Invalid YouTube URL' },
        { status: 400 }
      );
    }

    // Get video transcript
    const transcript = await YoutubeTranscript.fetchTranscript(videoId);
    
    if (!transcript || transcript.length === 0) {
      return NextResponse.json(
        { error: 'No transcript available for this video' },
        { status: 404 }
      );
    }

    // Convert transcript to text
    const transcriptText = transcript
      .map(item => item.text)
      .join(' ')
      .trim();

    // Generate structured notes using Gemini
    const structuredNotes = await generateStructuredNotes(transcriptText, videoTitle || 'YouTube Video');

    // Create ZIP file
    const zip = new JSZip();
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const sanitizedTitle = (videoTitle || 'YouTube-Video').replace(/[^a-zA-Z0-9]/g, '-');
    const fileName = `${sanitizedTitle}-${timestamp}.md`;

    // Add the structured notes to ZIP
    zip.file(fileName, structuredNotes);

    // Generate ZIP blob
    const zipBlob = await zip.generateAsync({ type: 'blob' });

    // Return the ZIP file
    return new Response(zipBlob, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${sanitizedTitle}-notes.zip"`,
      },
    });

  } catch (error) {
    console.error('Error generating YouTube notes ZIP:', error);
    return NextResponse.json(
      { error: 'Failed to generate notes' },
      { status: 500 }
    );
  }
}

function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/v\/([^&\n?#]+)/,
    /youtube\.com\/watch\?.*v=([^&\n?#]+)/
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return match[1];
    }
  }

  return null;
}
