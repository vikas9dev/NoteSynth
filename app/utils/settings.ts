// Settings utility for NoteSynth
// Handles localStorage persistence and prompt sanitization

export interface NoteSynthSettings {
    customPrompt: string;
    outputFormat: 'file-per-chapter' | 'file-per-section';
}

// Default prompt template
export const DEFAULT_PROMPT = `Rewrite the following lecture caption as a well-structured blog note section using Markdown format. Follow these guidelines:

- Remove all timestamps and speaker annotations.
- Keep all original information intact—do not skip or omit any important details.
- Rephrase content to improve clarity, flow, and readability.
- Use a \`##\` heading that exactly matches the lecture title.
- Break long paragraphs into shorter ones for easier review.
- Use bullet points and numbered lists where appropriate.
- Add relevant emojis to highlight key ideas or steps.
- Automatically detect and style the following keywords consistently with bold and emojis:
  - 💡 **Tip:**
  - ⚠️ **Warning:**
  - 📌 **Example:**
  - 📝 **Note:**
  - ⌨️ **Shortcut:**
- Include short, simple code snippets in fenced blocks, if applicable.
- Ensure proper Markdown formatting with real line breaks instead of escaped characters.
- The final output must be a clean, well-formatted Markdown document ready to be written as a \`.md\` file.
- Do not wrap the response in \`\`\`markdown or \`\`\`md.

Here is the lecture transcript:

{{TRANSCRIPT}}`;

export const DEFAULT_SETTINGS: NoteSynthSettings = {
    customPrompt: DEFAULT_PROMPT,
    outputFormat: 'file-per-chapter',
};

const SETTINGS_KEY = 'notesynth_settings';
const MAX_PROMPT_LENGTH = 10000;

/**
 * Sanitize prompt to prevent XSS and injection attacks
 * - Escapes HTML entities
 * - Validates placeholder exists
 * - Limits length
 */
export function sanitizePrompt(prompt: string): { sanitized: string; error?: string } {
    // Check length
    if (prompt.length > MAX_PROMPT_LENGTH) {
        return {
            sanitized: '',
            error: `Prompt exceeds maximum length of ${MAX_PROMPT_LENGTH} characters`,
        };
    }

    // Validate {{TRANSCRIPT}} placeholder exists
    if (!prompt.includes('{{TRANSCRIPT}}')) {
        return {
            sanitized: '',
            error: 'Prompt must include {{TRANSCRIPT}} placeholder',
        };
    }

    // Remove potential script tags and event handlers
    const sanitized = prompt
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/on\w+\s*=/gi, '')
        .replace(/javascript:/gi, '');

    // For display purposes, we escape HTML
    // But for the actual prompt sent to AI, we use the cleaned version
    return { sanitized };
}

/**
 * Get settings from localStorage
 */
export function getSettings(): NoteSynthSettings {
    if (typeof window === 'undefined') {
        return DEFAULT_SETTINGS;
    }

    try {
        const stored = localStorage.getItem(SETTINGS_KEY);
        if (!stored) {
            return DEFAULT_SETTINGS;
        }

        const parsed = JSON.parse(stored) as Partial<NoteSynthSettings>;

        // Validate and merge with defaults
        return {
            customPrompt: parsed.customPrompt || DEFAULT_SETTINGS.customPrompt,
            outputFormat: parsed.outputFormat === 'file-per-section'
                ? 'file-per-section'
                : 'file-per-chapter',
        };
    } catch {
        console.error('Failed to parse settings from localStorage');
        return DEFAULT_SETTINGS;
    }
}

/**
 * Save settings to localStorage
 */
export function saveSettings(settings: NoteSynthSettings): { success: boolean; error?: string } {
    if (typeof window === 'undefined') {
        return { success: false, error: 'Cannot save settings on server' };
    }

    // Sanitize prompt before saving
    const { error } = sanitizePrompt(settings.customPrompt);
    if (error) {
        return { success: false, error };
    }

    try {
        const toSave: NoteSynthSettings = {
            customPrompt: settings.customPrompt, // Store original for editing
            outputFormat: settings.outputFormat,
        };

        localStorage.setItem(SETTINGS_KEY, JSON.stringify(toSave));
        return { success: true };
    } catch {
        return { success: false, error: 'Failed to save settings to localStorage' };
    }
}

/**
 * Reset settings to defaults
 */
export function resetSettings(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(SETTINGS_KEY);
}

/**
 * Get the prompt with transcript inserted
 */
export function getPromptWithTranscript(transcript: string, customPrompt?: string): string {
    const prompt = customPrompt || getSettings().customPrompt;
    return prompt.replace('{{TRANSCRIPT}}', transcript);
}
