import { getCourseInfo, getLectureInfo } from '../../../utils/udemy';
import { getProviderConcurrencyLimit } from '../../../utils/llmService';
import JSZip from 'jszip';
import pLimit from 'p-limit';

export async function POST(request: Request) {
  try {
    const { courseId, lectureIds, customPrompt, outputFormat = 'file-per-chapter' } = await request.json();
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

    // Use dynamic concurrency based on provider
    const concurrencyLimit = getProviderConcurrencyLimit();
    console.log(`Processing ${lectureIds.length} lectures with concurrency limit: ${concurrencyLimit} (Output format: ${outputFormat})`);

    const limit = pLimit(concurrencyLimit);
    const lecturePromises = lectureIds.map((lectureId: string) =>
      limit(async () => {
        const lectureInfo = await getLectureInfo(courseId, lectureId, cookie, courseInfo, customPrompt);
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

    // Sort chapters and create structure
    const sortedChapters = courseInfo.chapters
      .filter(chapter => lecturesByChapter.has(chapter.title))
      .sort((a, b) => a.objectIndex - b.objectIndex);

    if (outputFormat === 'file-per-section') {
      // Create a single flat folder or no folder if user prefers, currently we keep the parent folder
      const rootFolder = zip.folder(parentFolder);

      for (const chapter of sortedChapters) {
        // Get lectures for this chapter and sort them
        const lectures = lecturesByChapter.get(chapter.title) || [];
        lectures.sort((a, b) => a.objectIndex - b.objectIndex);

        // Remove emojis from chapter title for TOC compatibility
        const cleanChapterTitle = chapter.title.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E6}-\u{1F1FF}]/gu, '').trim();

        // Generate Section Markdown
        let sectionMarkdown = `# ${cleanChapterTitle}\n\n`;

        // Generate TOC
        sectionMarkdown += `## Table of Contents\n\n`;
        for (const lecture of lectures) {
          const cleanLectureTitle = lecture.title.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E6}-\u{1F1FF}]/gu, '').trim();
          const anchor = cleanLectureTitle.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
          sectionMarkdown += `- [${cleanLectureTitle}](#${anchor})\n`;
        }
        sectionMarkdown += `\n---\n\n`;

        // Add each lecture content
        for (let i = 0; i < lectures.length; i++) {
          const lecture = lectures[i];
          // Ensure lecture title is H2 for TOC links to work correctly
          // We assume LLM output might already have H2 or similar, but we enforce it for consistency
          let content = lecture.content;

          // If content doesn't start with H2, we could prepend it, but LLM usually does ## Title
          // For safety, we can wrap/ensure headers
          sectionMarkdown += content;

          if (i < lectures.length - 1) {
            sectionMarkdown += `\n\n---\n\n`;
          }
        }

        const fileName = `${formatIndex(chapter.objectIndex)}_${sanitizeFileName(chapter.title)}_combined.md`;
        rootFolder?.file(fileName, sectionMarkdown);
      }
    } else {
      // DEFAULT: One file per chapter/lecture
      for (const chapter of sortedChapters) {
        const chapterFolder = zip.folder(`${parentFolder}/${formatIndex(chapter.objectIndex)}-${sanitizeFileName(chapter.title)}`);
        if (!chapterFolder) continue;

        const lectures = lecturesByChapter.get(chapter.title) || [];
        lectures.sort((a, b) => a.objectIndex - b.objectIndex);

        for (const lecture of lectures) {
          const fileName = `${formatIndex(lecture.objectIndex)}-${sanitizeFileName(lecture.title)}.md`;
          chapterFolder.file(fileName, lecture.content);
        }
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