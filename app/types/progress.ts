export interface Progress {
  progress: number;
  status: 'processing' | 'completed' | 'error';
  message: string;
  chapter?: string;
  lecture?: string;
  error?: string;
  // New fields for granular tracking
  lectureId?: string;
  captionStatus?: 'pending' | 'fetching' | 'done' | 'error';
  llmStatus?: 'pending' | 'calling' | 'done' | 'error' | 'retrying';
  llmProvider?: string;
  // Fields for data streaming
  content?: string;
  chapterTitle?: string;
  lectureTitle?: string;
  objectIndex?: number;
}

export interface LectureProgress {
  lectureId: string;
  chapter?: string;
  lecture?: string;
  captionStatus: 'pending' | 'fetching' | 'done' | 'error';
  llmStatus: 'pending' | 'calling' | 'done' | 'error' | 'retrying';
  llmProvider?: string;
  error?: string;
}

export interface GenerationSession {
  id: string;
  timestamp: number;
  courseId: string;
  courseTitle: string;
  lectures: LectureProgress[];
  status: 'in-progress' | 'completed' | 'error';
  expanded: boolean;
  downloadedFilename?: string;  // The ZIP filename that was downloaded
}