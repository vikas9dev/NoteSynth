import { GenerationSession, LectureProgress } from '../types/progress';

const HISTORY_KEY = 'notesynth_generation_history';
const MAX_HISTORY_ITEMS = 20;

export function getHistory(): GenerationSession[] {
    if (typeof window === 'undefined') return [];
    try {
        const stored = localStorage.getItem(HISTORY_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
}

export function saveSession(session: GenerationSession): void {
    if (typeof window === 'undefined') return;
    try {
        const history = getHistory();
        // Add to beginning (newest first)
        history.unshift(session);
        // Limit history size
        if (history.length > MAX_HISTORY_ITEMS) {
            history.pop();
        }
        localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    } catch (e) {
        console.error('Failed to save session to history:', e);
    }
}

export function updateSession(sessionId: string, updates: Partial<GenerationSession>): void {
    if (typeof window === 'undefined') return;
    try {
        const history = getHistory();
        const index = history.findIndex(s => s.id === sessionId);
        if (index !== -1) {
            history[index] = { ...history[index], ...updates };
            localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
        }
    } catch (e) {
        console.error('Failed to update session:', e);
    }
}

export function updateLectureInSession(
    sessionId: string,
    lectureId: string,
    updates: Partial<LectureProgress>
): void {
    if (typeof window === 'undefined') return;
    try {
        const history = getHistory();
        const sessionIndex = history.findIndex(s => s.id === sessionId);
        if (sessionIndex !== -1) {
            const session = history[sessionIndex];
            const lectureIndex = session.lectures.findIndex(l => l.lectureId === lectureId);
            if (lectureIndex !== -1) {
                session.lectures[lectureIndex] = { ...session.lectures[lectureIndex], ...updates };
                localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
            }
        }
    } catch (e) {
        console.error('Failed to update lecture in session:', e);
    }
}

export function toggleSessionExpanded(sessionId: string): void {
    if (typeof window === 'undefined') return;
    try {
        const history = getHistory();
        const index = history.findIndex(s => s.id === sessionId);
        if (index !== -1) {
            history[index].expanded = !history[index].expanded;
            localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
        }
    } catch (e) {
        console.error('Failed to toggle session expanded:', e);
    }
}

export function clearHistory(): void {
    if (typeof window === 'undefined') return;
    try {
        localStorage.removeItem(HISTORY_KEY);
    } catch (e) {
        console.error('Failed to clear history:', e);
    }
}

export function createNewSession(
    courseId: string,
    courseTitle: string,
    lectureIds: string[]
): GenerationSession {
    return {
        id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: Date.now(),
        courseId,
        courseTitle,
        lectures: lectureIds.map(id => ({
            lectureId: id,
            captionStatus: 'pending',
            llmStatus: 'pending',
        })),
        status: 'in-progress',
        expanded: false,  // Hidden by default
    };
}
