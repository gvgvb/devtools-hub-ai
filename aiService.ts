const AI_PROXY_URL = (import.meta.env.VITE_AI_PROXY_URL as string) || '/api/ai';

export const askAI = async (
  prompt: string,
  systemPrompt: string = 'You are a helpful senior software engineer.',
  options?: { model?: string }
) => {
  const controller = new AbortController();
  const timeoutMs = Number(import.meta.env.VITE_AI_TIMEOUT_MS) || 15000; // client-side timeout (ms)
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  let response: Response;
  try {
    response = await fetch(AI_PROXY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt, systemPrompt, model: options?.model }),
      signal: controller.signal,
    });
  } catch (e: any) {
    if (e.name === 'AbortError') throw new Error('AI request timed out (client).');
    throw e;
  } finally {
    clearTimeout(timeout);
  }

  let data: any;
  try {
    data = await response.json();
  } catch (e) {
    throw new Error('Invalid response from AI proxy');
  }

  if (!response.ok) {
    throw new Error(data?.error || 'AI proxy request failed');
  }

  if (data && data.success && typeof data.text === 'string') {
    return data.text as string;
  }

  // fallback to older response shapes
  const fallback = data?.choices?.[0]?.message?.content || data?.choices?.[0]?.text;
  if (fallback) return fallback as string;

  throw new Error(data?.error || 'AI proxy returned an unexpected response');
};