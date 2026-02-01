import pLimit from 'p-limit';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Per-provider rate limiters for better parallelism
// Groq: 30 RPM free tier - increased interval to avoid rate limiting
// Gemini: 60 RPM free tier, so ~1 second between requests
const providerState = {
  groq: {
    lastRequestTime: 0,
    minInterval: 4000,  // 4 seconds between Groq requests (conservative for free tier)
    concurrencyLimit: pLimit(2), // Reduced to 2 concurrent Groq requests
  },
  gemini: {
    lastRequestTime: 0,
    minInterval: 1000,  // 1 second between Gemini requests
    concurrencyLimit: pLimit(5), // Allow 5 concurrent Gemini requests
  }
};

// Mutex-like lock for coordinating request timing per provider
const providerLocks: { [key: string]: Promise<void> } = {
  groq: Promise.resolve(),
  gemini: Promise.resolve(),
};

async function waitForProviderSlot(provider: 'groq' | 'gemini'): Promise<void> {
  const state = providerState[provider];

  // Chain onto the existing lock to ensure sequential timing checks
  const currentLock = providerLocks[provider];
  let releaseLock: () => void;

  providerLocks[provider] = new Promise((resolve) => {
    releaseLock = resolve;
  });

  await currentLock;

  const now = Date.now();
  const timeSinceLastRequest = now - state.lastRequestTime;

  if (timeSinceLastRequest < state.minInterval) {
    await sleep(state.minInterval - timeSinceLastRequest);
  }

  state.lastRequestTime = Date.now();
  releaseLock!();
}

async function callProviderWithRateLimit(
  provider: 'groq' | 'gemini',
  prompt: string,
  keys: { gemini?: string; groq?: string }
): Promise<string> {
  const state = providerState[provider];

  // Use concurrency limiter to control parallel requests
  return state.concurrencyLimit(async () => {
    // Wait for rate limit slot
    await waitForProviderSlot(provider);

    return callProviderInternal(provider, prompt, keys);
  });
}

async function callProviderInternal(
  provider: 'groq' | 'gemini',
  prompt: string,
  keys: { gemini?: string; groq?: string }
): Promise<string> {
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

export interface GenerateNotesResult {
  content: string;
  llmSuccess: boolean;
  provider?: string;
}

export async function generateStructuredNotes(
  vttContent: string,
  lectureTitle: string,
  customPrompt?: string
): Promise<GenerateNotesResult> {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  const GROQ_API_KEY = process.env.GROQ_API_KEY;

  if (!GEMINI_API_KEY && !GROQ_API_KEY) {
    throw new Error('Neither GEMINI_API_KEY nor GROQ_API_KEY environment variable is set');
  }

  let prompt: string;
  if (customPrompt) {
    prompt = customPrompt.replace('{{TRANSCRIPT}}', vttContent);
  } else {
    // Load default prompt template from external file
    const fs = await import('fs/promises');
    const path = await import('path');
    const promptPath = path.join(process.cwd(), 'app/prompts/noteGeneration.txt');
    const promptTemplate = await fs.readFile(promptPath, 'utf-8');
    prompt = promptTemplate.replace('{{TRANSCRIPT}}', vttContent);
  }

  // Strategy: Try Groq first (faster), fall back to Gemini
  const providersToTry: ('groq' | 'gemini')[] = [];
  if (GROQ_API_KEY) providersToTry.push('groq');
  if (GEMINI_API_KEY) providersToTry.push('gemini');

  for (const provider of providersToTry) {
    const maxRetries = 3; // Reduced retries since we have better rate limiting
    let retryCount = 0;
    let backoffMs = 4000; // Reduced base backoff

    while (retryCount <= maxRetries) {
      try {
        const text = await callProviderWithRateLimit(provider, prompt, { gemini: GEMINI_API_KEY, groq: GROQ_API_KEY });
        if (text) {
          console.log(`✓ Generated notes using ${provider.toUpperCase()}`);
          return { content: text, llmSuccess: true, provider };
        }
        throw new Error('No content generated');
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        if (errorMessage === '429' || errorMessage.includes('Too Many Requests')) {
          if (retryCount < maxRetries) {
            console.warn(`${provider.toUpperCase()} rate limited. Retrying in ${backoffMs}ms... (Attempt ${retryCount + 1}/${maxRetries})`);
            await sleep(backoffMs);
            retryCount++;
            backoffMs *= 1.5; // Gentler backoff
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
  // All providers failed - return raw transcript as fallback but mark as failure
  console.warn('All LLM providers failed. Returning raw transcript as fallback.');
  return { content: `# ${lectureTitle}\n\n${vttContent}`, llmSuccess: false };
}

// Export concurrency limit for use in download route
export function getProviderConcurrencyLimit(): number {
  const GROQ_API_KEY = process.env.GROQ_API_KEY;
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

  // Return the concurrency limit of the primary provider
  if (GROQ_API_KEY) return 3;
  if (GEMINI_API_KEY) return 5;
  return 1;
}