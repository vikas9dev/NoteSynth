import { NextResponse } from 'next/server';
import { getSubtitles } from 'youtube-captions-scraper';
import { generateStructuredNotes } from '../../../utils/gemini';

export async function POST(request: Request) {
  try {
    const { videoUrl } = await request.json();
    if (!videoUrl) {
      return NextResponse.json({ error: 'Video URL is required' }, { status: 400 });
    }

    const videoId = extractVideoId(videoUrl);
    if (!videoId) {
      return NextResponse.json({ error: 'Invalid YouTube URL' }, { status: 400 });
    }

    // Fetch transcript (auto-generated or manual)
    let transcript;
    try {
      transcript = await getSubtitles({ videoID: videoId, lang: 'en' });
    } catch (err) {
      console.error('Transcript fetch failed:', err);
      return NextResponse.json({ error: 'No transcript available for this video' }, { status: 404 });
    }

    if (!transcript || transcript.length === 0) {
      return NextResponse.json({ error: 'No transcript available for this video' }, { status: 404 });
    }

    // Convert transcript to text
    const transcriptText = transcript.map(item => item.text).join(' ').trim();

    // Generate structured notes
    const structuredNotes = await generateStructuredNotes(transcriptText, 'YouTube Video');

    return NextResponse.json({
      success: true,
      videoId,
      transcript: transcriptText,
      structuredNotes
    });

  } catch (error) {
    console.error('Error processing YouTube video:', error);
    return NextResponse.json({ error: 'Failed to process video transcript' }, { status: 500 });
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
    if (match) return match[1];
  }

  return null;
}
