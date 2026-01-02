# JavaScript/TypeScript YouTube Transcript Libraries

This document lists JavaScript/TypeScript alternatives to the Python `youtube-transcript-api` library for use in React/Next.js applications.

## Popular JavaScript/TypeScript YouTube Transcript Libraries

### 1. **youtube-transcript-ts** (Most Similar to Python Version)
This is the TypeScript equivalent and has a similar API structure to the Python `youtube-transcript-api`:

**Installation:**
```bash
npm install youtube-transcript-ts
```

**Usage:**
```typescript
import { YouTubeTranscriptApi } from 'youtube-transcript-ts';

const api = new YouTubeTranscriptApi();
const response = await api.fetchTranscript('VIDEO_ID');
console.log(response.transcript.snippets);
```

**Features:**
- TypeScript-first
- Similar API to Python version
- Good TypeScript support
- Works well in Next.js API routes and server components

**Links:**
- [npm package](https://www.npmjs.com/package/youtube-transcript-ts)

---

### 2. **t-youtube-transcript-fetcher**
TypeScript library with good TypeScript support and multiple language options:

**Installation:**
```bash
npm install t-youtube-transcript-fetcher
```

**Usage:**
```typescript
import { YoutubeTranscript } from 't-youtube-transcript-fetcher';

// With URL or ID
const transcript = await YoutubeTranscript.fetchTranscript('https://www.youtube.com/watch?v=VIDEO_ID');

// With specific language
const spanishTranscript = await YoutubeTranscript.fetchTranscript('VIDEO_ID', { lang: 'es' });
```

**Features:**
- Supports multiple languages
- Proxy configurations
- Comprehensive error handling
- Works with both URLs and video IDs

**Links:**
- [GitHub repository](https://github.com/thanhphuchuynh/youtube-transcript-fetcher)
- [npm package](https://www.npmjs.com/package/t-youtube-transcript-fetcher)

---

### 3. **youtube-transcript**
Simple JavaScript package for basic transcript fetching:

**Installation:**
```bash
npm install youtube-transcript
```

**Usage:**
```javascript
import { YoutubeTranscript } from 'youtube-transcript';

YoutubeTranscript.fetchTranscript('VIDEO_ID').then(console.log);
```

**Links:**
- [npm package](https://www.npmjs.com/package/youtube-transcript)

---

## Integration with Next.js

Since Next.js has server-side capabilities, you can use these libraries in:

### Option 1: API Routes (Recommended)

**Pages Router:**
```typescript
// pages/api/transcript.ts
import { YouTubeTranscriptApi } from 'youtube-transcript-ts';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { videoId } = req.query;

  if (!videoId || typeof videoId !== 'string') {
    return res.status(400).json({ error: 'Video ID is required' });
  }

  try {
    const api = new YouTubeTranscriptApi();
    const transcript = await api.fetchTranscript(videoId);
    return res.status(200).json(transcript);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch transcript' });
  }
}
```

**App Router:**
```typescript
// app/api/transcript/route.ts
import { YouTubeTranscriptApi } from 'youtube-transcript-ts';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const videoId = searchParams.get('videoId');

  if (!videoId) {
    return NextResponse.json(
      { error: 'Video ID is required' },
      { status: 400 }
    );
  }

  try {
    const api = new YouTubeTranscriptApi();
    const transcript = await api.fetchTranscript(videoId);
    return NextResponse.json(transcript);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch transcript' },
      { status: 500 }
    );
  }
}
```

### Option 2: Server Components (App Router)

```typescript
// app/transcript/[videoId]/page.tsx
import { YouTubeTranscriptApi } from 'youtube-transcript-ts';

interface TranscriptPageProps {
  params: {
    videoId: string;
  };
}

export default async function TranscriptPage({ params }: TranscriptPageProps) {
  try {
    const api = new YouTubeTranscriptApi();
    const transcript = await api.fetchTranscript(params.videoId);
    
    return (
      <div>
        <h1>Transcript for Video: {params.videoId}</h1>
        <div>
          {transcript.transcript.snippets.map((snippet, index) => (
            <p key={index}>
              <span>[{snippet.start}s]</span> {snippet.text}
            </p>
          ))}
        </div>
      </div>
    );
  } catch (error) {
    return <div>Error fetching transcript</div>;
  }
}
```

### Option 3: Client-Side Usage (with API Route)

**Client Component:**
```typescript
// components/TranscriptFetcher.tsx
'use client';

import { useState } from 'react';

export default function TranscriptFetcher() {
  const [videoId, setVideoId] = useState('');
  const [transcript, setTranscript] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchTranscript = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/transcript?videoId=${videoId}`);
      const data = await response.json();
      setTranscript(data);
    } catch (error) {
      console.error('Error fetching transcript:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={videoId}
        onChange={(e) => setVideoId(e.target.value)}
        placeholder="Enter YouTube Video ID"
      />
      <button onClick={fetchTranscript} disabled={loading}>
        {loading ? 'Loading...' : 'Fetch Transcript'}
      </button>
      {transcript && (
        <div>
          {transcript.transcript.snippets.map((snippet, index) => (
            <p key={index}>{snippet.text}</p>
          ))}
        </div>
      )}
    </div>
  );
}
```

---

## Important Considerations

### CORS and Security
- **Always use server-side fetching** (API routes or Server Components) to avoid CORS issues
- Client-side fetching directly from YouTube may be blocked by CORS policies
- Server-side fetching also keeps your implementation details private

### Error Handling
Similar to the Python version, these libraries handle:
- Videos without transcripts
- Unavailable videos
- Rate limiting/IP blocking
- Invalid video IDs

### Rate Limiting
If you encounter rate limiting:
- Implement request throttling
- Use caching for frequently requested videos
- Consider using proxy services (some libraries support this)

---

## Recommendation

For Next.js projects, I recommend **`youtube-transcript-ts`** because:
- ✅ TypeScript-first with excellent type support
- ✅ Similar API structure to the Python `youtube-transcript-api`
- ✅ Works seamlessly in Next.js API routes and Server Components
- ✅ Good documentation and community support

---

## Example Projects

- [YouTube Transcripts Machine](https://github.com/zaidmukaddam/youtube-transcripts-machine) - A Next.js application that extracts timestamps and transcripts from YouTube videos

---

## References

- [youtube-transcript-ts npm](https://www.npmjs.com/package/youtube-transcript-ts)
- [t-youtube-transcript-fetcher GitHub](https://github.com/thanhphuchuynh/youtube-transcript-fetcher)
- [youtube-transcript npm](https://www.npmjs.com/package/youtube-transcript)
- [Next.js API Routes Documentation](https://nextjs.org/docs/api-routes/introduction)
- [Next.js Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
