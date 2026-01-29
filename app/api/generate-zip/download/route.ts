import { getCourseInfo, getLectureInfo } from '../../../utils/udemy';
import JSZip from 'jszip';
import pLimit from 'p-limit';

export async function POST(request: Request) {
  try {
    const { courseId, lectureIds } = await request.json();
    const cookie = request.headers.get('X-Udemy-Cookie');

    if (!courseId || !lectureIds?.length || !cookie) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Get course info for proper naming
    const courseInfo = await getCourseInfo(courseId, cookie);
    if (!courseInfo) {
      throw new Error('Failed to fetch course info');
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const sanitizedCourseTitle = courseInfo.title.replace(/[^a-zA-Z0-9]/g, '-');
    const parentFolder = `${sanitizedCourseTitle}-${timestamp}`;

    // Create ZIP file
    const zip = new JSZip();

    // Process lectures and organize by chapter
    const lecturesByChapter = new Map<string, Array<{
      id: string;
      title: string;
      content: string;
      objectIndex: number;
    }>>();

    // Process lectures in parallel with a limit to avoid hitting Gemini rate limits too hard
    const limit = pLimit(5);
    const lecturePromises = lectureIds.map((lectureId: string) =>
      limit(async () => {
        const lectureInfo = await getLectureInfo(courseId, lectureId, cookie, courseInfo);
        if (lectureInfo) {
          const { chapterTitle, lectureTitle, content, objectIndex } = lectureInfo;
          return { chapterTitle, lectureTitle, content, objectIndex, id: lectureId };
        }
        return null;
      })
    );

    const processedLectures = await Promise.all(lecturePromises);

    for (const lecture of processedLectures) {
      if (!lecture) continue;

      const { chapterTitle, lectureTitle, content, objectIndex, id } = lecture;

      if (!lecturesByChapter.has(chapterTitle)) {
        lecturesByChapter.set(chapterTitle, []);
      }

      lecturesByChapter.get(chapterTitle)?.push({
        id,
        title: lectureTitle,
        content,
        objectIndex
      });
    }

    // Sort chapters and create folder structure
    const sortedChapters = courseInfo.chapters
      .filter(chapter => lecturesByChapter.has(chapter.title))
      .sort((a, b) => a.objectIndex - b.objectIndex);

    for (const chapter of sortedChapters) {
      const chapterFolder = zip.folder(`${parentFolder}/${formatIndex(chapter.objectIndex)}-${sanitizeFileName(chapter.title)}`);
      if (!chapterFolder) continue;

      // Get lectures for this chapter and sort them
      const lectures = lecturesByChapter.get(chapter.title) || [];
      lectures.sort((a, b) => a.objectIndex - b.objectIndex);

      // Add lecture files to the chapter folder
      for (const lecture of lectures) {
        const fileName = `${formatIndex(lecture.objectIndex)}-${sanitizeFileName(lecture.title)}.md`;
        chapterFolder.file(fileName, lecture.content);
      }
    }

    // Generate ZIP blob
    const zipBlob = await zip.generateAsync({ type: 'blob' });

    // Return the ZIP file
    return new Response(zipBlob, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${sanitizedCourseTitle}-${timestamp}.zip"`,
      },
    });
  } catch (error) {
    console.error('Error generating ZIP file:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to generate ZIP file' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

function sanitizeFileName(name: string): string {
  return name
    .replace(/[<>:"/\\|?*]/g, '') // Remove invalid characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .toLowerCase()
    .trim();
}

function formatIndex(index: number): string {
  return index.toString().padStart(2, '0');
} 