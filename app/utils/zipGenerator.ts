import JSZip from 'jszip';
import { getCourseInfo, getLectureInfo } from './udemy';
import { createSafeFolderName, createSafeZipPath } from './pathUtils';

export async function generateZipFile(
  courseId: string,
  lectureIds: string[],
  courseTitle: string,
  cookie: string
): Promise<Blob> {
  const zip = new JSZip();
  const timestamp = Date.now().toString().slice(-10); // Short timestamp
  const parentFolder = createSafeFolderName(courseTitle, timestamp, 35);

  try {
    // Get course structure first
    const courseInfo = await getCourseInfo(courseId, cookie);
    if (!courseInfo) {
      throw new Error('Failed to fetch course structure');
    }

    // Create a map to organize lectures by chapter
    const lecturesByChapter = new Map<string, Array<{
      id: string;
      title: string;
      content: string;
      objectIndex: number;
    }>>();

    // Process each lecture
    for (const lectureId of lectureIds) {
      const lectureInfo = await getLectureInfo(courseId, lectureId, cookie, courseInfo);
      if (!lectureInfo) continue;

      const { chapterTitle, lectureTitle, content, objectIndex } = lectureInfo;

      if (!lecturesByChapter.has(chapterTitle)) {
        lecturesByChapter.set(chapterTitle, []);
      }

      lecturesByChapter.get(chapterTitle)?.push({
        id: lectureId,
        title: lectureTitle,
        content,
        objectIndex
      });
    }

    // Sort chapters by their order in the course structure
    const sortedChapters = courseInfo.chapters
      .filter(chapter => lecturesByChapter.has(chapter.title))
      .sort((a, b) => a.objectIndex - b.objectIndex);

    // Create folders and files in the ZIP
    for (const chapter of sortedChapters) {
      const chapterPath = `${parentFolder}/${formatIndex(chapter.objectIndex)}-${sanitizeFileName(chapter.title, 30)}`;
      const chapterFolder = zip.folder(chapterPath);
      if (!chapterFolder) continue;

      // Get lectures for this chapter and sort them
      const lectures = lecturesByChapter.get(chapter.title) || [];
      lectures.sort((a, b) => a.objectIndex - b.objectIndex);

      for (const lecture of lectures) {
        const fileName = `${formatIndex(lecture.objectIndex)}-${sanitizeFileName(lecture.title, 40)}.md`;
        chapterFolder.file(fileName, lecture.content);
      }
    }

    return zip.generateAsync({ type: 'blob' });
  } catch (error) {
    console.error('Error generating ZIP:', error);
    throw error;
  }
}

function sanitizeFileName(name: string, maxLength: number = 30): string {
  let sanitized = name
    .replace(/[<>:"/\\|?*]/g, '') // Remove invalid characters
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .trim();

  // Truncate to prevent Windows path length issues (260 char limit)
  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength).trim();
    // Remove trailing incomplete words if possible
    const lastSpace = sanitized.lastIndexOf(' ');
    if (lastSpace > maxLength * 0.7) {
      sanitized = sanitized.substring(0, lastSpace);
    }
  }

  return sanitized;
}

function formatIndex(index: number): string {
  return index.toString().padStart(2, '0');
} 