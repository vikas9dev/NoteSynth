/**
 * Sanitizes and truncates file/folder names to prevent Windows path length issues.
 * Windows has a 260 character MAX_PATH limit, so we need to keep paths short.
 * 
 * @param name - The original name to sanitize
 * @param maxLength - Maximum length (default: 40)
 * @returns Sanitized and truncated name
 */
export function sanitizeFileName(name: string, maxLength: number = 40): string {
  if (!name) return 'untitled';
  
  // Remove invalid characters for Windows file system
  let sanitized = name
    .replace(/[<>:"/\\|?*\x00-\x1f]/g, '') // Remove invalid chars
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/--+/g, '-') // Replace multiple hyphens with single
    .trim()
    .toLowerCase();

  // Truncate to max length
  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength).trim();
    // Remove trailing hyphen if present
    sanitized = sanitized.replace(/-+$/, '');
  }

  // Ensure we have at least something
  if (!sanitized) return 'untitled';

  return sanitized;
}

/**
 * Creates a safe folder name with timestamp, ensuring it stays under length limits.
 * Format: {courseName}-{shortTimestamp}
 * 
 * @param courseTitle - The course title
 * @param timestamp - Optional timestamp (defaults to current time)
 * @param maxCourseLength - Max length for course name (default: 35)
 * @returns Safe folder name
 */
export function createSafeFolderName(
  courseTitle: string, 
  timestamp?: string | number,
  maxCourseLength: number = 35
): string {
  const sanitized = sanitizeFileName(courseTitle, maxCourseLength);
  const ts = timestamp 
    ? (typeof timestamp === 'number' ? timestamp.toString() : timestamp)
    : Date.now().toString();
  
  // Use shorter timestamp (last 10 digits) to save space
  const shortTs = ts.slice(-10);
  
  return `${sanitized}-${shortTs}`;
}

/**
 * Creates a safe file path within a ZIP archive.
 * Ensures the total path length stays well under Windows 260 char limit.
 * 
 * @param folderName - Parent folder name
 * @param chapterName - Chapter folder name
 * @param lectureName - Lecture file name (without extension)
 * @param extension - File extension (default: '.md')
 * @returns Safe file path for ZIP
 */
export function createSafeZipPath(
  folderName: string,
  chapterName: string,
  lectureName: string,
  extension: string = '.md'
): string {
  // Limit each component to prevent path length issues
  const safeFolder = sanitizeFileName(folderName, 40);
  const safeChapter = sanitizeFileName(chapterName, 30);
  const safeLecture = sanitizeFileName(lectureName, 40);
  
  // Construct path: folder/chapter/lecture.ext
  const path = `${safeFolder}/${safeChapter}/${safeLecture}${extension}`;
  
  // Final safety check - if path is still too long, truncate further
  const MAX_PATH = 200; // Well under Windows 260 limit
  if (path.length > MAX_PATH) {
    // Calculate how much to truncate
    const excess = path.length - MAX_PATH;
    const truncatedLecture = safeLecture.substring(0, safeLecture.length - excess - 5);
    return `${safeFolder}/${safeChapter}/${truncatedLecture}${extension}`;
  }
  
  return path;
}
