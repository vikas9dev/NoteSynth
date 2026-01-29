const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Simple global lock to prevent multiple requests from overlapping too much
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 4000; // 4 seconds between any two AI requests

async function callProvider(
  provider: 'groq' | 'gemini',
  prompt: string,
  keys: { gemini?: string; groq?: string }
): Promise<string> {
  // Respect the minimum request interval globally
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    await sleep(MIN_REQUEST_INTERVAL - timeSinceLastRequest);
  }
  lastRequestTime = Date.now();

  if (provider === 'groq') {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${keys.groq}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that converts lecture transcripts into well-structured Markdown notes.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 4096,
      })
    });

    if (response.status === 429) throw new Error('429');
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Groq error: ${response.statusText} ${JSON.stringify(errorData)}`);
    }
    const data = await response.json();
    return data.choices?.[0]?.message?.content || '';
  } else {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${keys.gemini}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.3,
            topK: 40,
            topP: 0.8,
            maxOutputTokens: 2048,
          }
        })
      }
    );

    if (response.status === 429) throw new Error('429');
    if (!response.ok) throw new Error(`Gemini error: ${response.statusText}`);
    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  }
}

export async function generateStructuredNotes(vttContent: string, lectureTitle: string): Promise<string> {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  const GROQ_API_KEY = process.env.GROQ_API_KEY;

  if (!GEMINI_API_KEY && !GROQ_API_KEY) {
    throw new Error('Neither GEMINI_API_KEY nor GROQ_API_KEY environment variable is set');
  }

  const prompt = `
Rewrite the following lecture caption as a well-structured blog note section using Markdown format. Follow these guidelines:

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
  - ⌨&H00FE; **Shortcut:**
- Include short, simple code snippets in fenced blocks, if applicable.
- Ensure proper Markdown formatting with real line breaks instead of escaped characters.
- The final output must be a clean, well-formatted Markdown document ready to be written as a \`.md\` file.
- Do not wrap the response in \`\`\`markdown or \`\`\`md.

Here is the lecture transcript:

${vttContent}
`;

  // Strategy: Try Groq first, if it fails after all retries, try Gemini as fallback
  let providersToTry: ('groq' | 'gemini')[] = [];
  if (GROQ_API_KEY) providersToTry.push('groq');
  if (GEMINI_API_KEY) providersToTry.push('gemini');

  for (const provider of providersToTry) {
    const maxRetries = 5;
    let retryCount = 0;
    let backoffMs = 8000; // Increased base backoff

    while (retryCount <= maxRetries) {
      try {
        const text = await callProvider(provider, prompt, { gemini: GEMINI_API_KEY, groq: GROQ_API_KEY });
        if (text) return text;
        throw new Error('No content generated');
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        if (errorMessage === '429' || errorMessage.includes('Too Many Requests')) {
          if (retryCount < maxRetries) {
            console.warn(`${provider.toUpperCase()} rate limited. Retrying in ${backoffMs}ms... (Attempt ${retryCount + 1}/${maxRetries})`);
            await sleep(backoffMs);
            retryCount++;
            backoffMs *= 2;
            continue;
          }
          console.error(`${provider.toUpperCase()} failed after ${maxRetries} retries. Trying next provider if available...`);
          break; // Move to next provider
        }

        console.error(`Error with ${provider}:`, error);
        break; // Non-rate-limit error, move to next provider
      }
    }
  }

  return `# ${lectureTitle}\n\n${vttContent}`;
}