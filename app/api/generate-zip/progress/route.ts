import { Progress } from '../../../types/progress';
import { getCourseInfo, getLectureInfo } from '../../../utils/udemy';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const courseId = searchParams.get('courseId');
  const lectureIds = searchParams.get('lectureIds')?.split(',');

  // Get cookie and custom prompt from headers
  const headerCookie = request.headers.get('X-Udemy-Cookie');
  // Custom prompt is Base64 encoded to handle Unicode characters in headers
  const encodedPrompt = request.headers.get('X-Custom-Prompt-Encoded');
  let customPrompt: string | undefined;
  if (encodedPrompt) {
    try {
      customPrompt = decodeURIComponent(escape(atob(encodedPrompt)));
    } catch (e) {
      console.error('Failed to decode custom prompt:', e);
    }
  }

  // Get download content type - 'captions-only' skips AI processing
  const downloadContentType = request.headers.get('X-Download-Content-Type');
  const skipAI = downloadContentType === 'captions-only';

  if (skipAI) {
    console.log('Captions-only mode enabled - skipping AI processing');
  }

  if (!courseId || !lectureIds?.length || !headerCookie) {
    return new Response('Missing required parameters', { status: 400 });
  }

  // Create SSE response headers
  const headers = {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
  };

  // Create a transform stream for SSE
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();

  // Function to send progress updates
  const sendProgress = async (progress: Progress) => {
    try {
      await writer.write(
        new TextEncoder().encode(`data: ${JSON.stringify(progress)}\n\n`)
      );
    } catch (error) {
      console.error('Error sending progress:', error);
    }
  };

  // Start processing in the background
  (async () => {
    try {
      // Get course info for proper naming
      const courseInfo = await getCourseInfo(courseId, headerCookie);
      if (!courseInfo) {
        throw new Error('Failed to fetch course info');
      }

      await sendProgress({
        progress: 0,
        status: 'processing',
        message: 'Starting to process lectures...'
      });

      // Process each lecture
      for (let i = 0; i < lectureIds.length; i++) {
        const lectureId = lectureIds[i];
        try {
          // Send caption fetching status
          await sendProgress({
            progress: Math.round((i / lectureIds.length) * 100),
            status: 'processing',
            message: skipAI
              ? `Fetching captions for lecture ${i + 1} of ${lectureIds.length}`
              : `Processing lecture ${i + 1} of ${lectureIds.length}`,
            lectureId,
            captionStatus: 'fetching',
            llmStatus: skipAI ? 'skipped' : 'pending'
          });

          // Get lecture info (this fetches captions and optionally calls LLM)
          const lectureInfo = await getLectureInfo(courseId, lectureId, headerCookie, courseInfo, customPrompt, skipAI);
          if (!lectureInfo) {
            throw new Error(`Failed to process lecture ${lectureId}`);
          }

          // Send completion status for this lecture
          // Send completion status for this lecture with CONTENT
          await sendProgress({
            progress: Math.round(((i + 1) / lectureIds.length) * 100),
            status: 'processing',
            message: `Completed lecture ${i + 1} of ${lectureIds.length}`,
            lectureId,
            chapter: lectureInfo.chapterTitle,
            lecture: lectureInfo.lectureTitle,
            captionStatus: 'done',
            llmStatus: lectureInfo.llmSuccess ? 'done' : 'error',
            llmProvider: lectureInfo.llmProvider,
            // Stream the data back to client
            content: lectureInfo.content,
            chapterTitle: lectureInfo.chapterTitle,
            lectureTitle: lectureInfo.lectureTitle,
            objectIndex: lectureInfo.objectIndex
          });

        } catch (error) {
          console.error(`Error processing lecture ${lectureId}:`, error);
          await sendProgress({
            progress: Math.round(((i + 1) / lectureIds.length) * 100),
            status: 'processing',
            message: `Failed to process lecture ${lectureId}`,
            lectureId,
            captionStatus: 'error',
            llmStatus: 'error',
            error: error instanceof Error ? error.message : 'Unknown error'
          });
        }
      }

      // Send completion status
      await sendProgress({
        progress: 100,
        status: 'completed',
        message: 'All lectures have been processed successfully!'
      });

    } catch (error) {
      console.error('Error in background processing:', error);
      await sendProgress({
        progress: 0,
        status: 'error',
        message: 'Failed to process lectures',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      await writer.close();
    }
  })();

  return new Response(stream.readable, { headers });
} 