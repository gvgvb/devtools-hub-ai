import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

dotenv.config();

const app = express();
// When running behind a reverse proxy (Netlify, Vercel, load balancer),
// enable trusting the proxy so `req.ip` and related helpers return the
// client's real IP instead of the proxy's IP.
app.set('trust proxy', true);
const port = process.env.PORT || 3000;
const apiKey = process.env.GROQ_API_KEY;
const AI_TIMEOUT_MS = Number.parseInt(process.env.AI_TIMEOUT_MS || '15000', 10); // 15s default
const DEFAULT_MODEL = process.env.GROQ_MODEL || 'llama-3.1-8b-instant';
const GROQ_API_BASE = process.env.GROQ_API_BASE || 'https://api.groq.com/openai/v1';
const ALLOWED_MODELS = ['llama-3.1-8b-instant', 'llama-3.1-70b-versatile', 'llama-3.3-70b-versatile'];

if (!apiKey) {
  console.warn('⚠️ Warning: Missing GROQ_API_KEY in environment. Local Express AI proxy will not work.');
}

app.use(helmet());
app.use(express.json({ limit: '256kb' }));
// Rate limiter: make values configurable via env for production tuning.
app.use(
  rateLimit({
    windowMs: Number.parseInt(process.env.RATE_LIMIT_WINDOW_MS || String(1 * 60 * 1000), 10),
    max: Number.parseInt(process.env.RATE_LIMIT_MAX || '30', 10),
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests. Please try again later.' },
  })
);

// Simple in-memory quota tracking per client IP.
const quotaMap = new Map(); // key -> { count, windowStart }
const QUOTA_WINDOW_MS = Number.parseInt(process.env.QUOTA_WINDOW_MS || String(60 * 60 * 1000), 10); // 1 hour by default
const QUOTA_MAX = Number.parseInt(process.env.AI_QUOTA_MAX || '100', 10);

// Periodic cleanup to avoid unbounded memory growth of `quotaMap`.
setInterval(() => {
  const now = Date.now();
  for (const [k, entry] of quotaMap.entries()) {
    // remove entries whose windowStart is far in the past (2x window)
    if (now - entry.windowStart > QUOTA_WINDOW_MS * 2) {
      quotaMap.delete(k);
    }
  }
}, Number.parseInt(process.env.QUOTA_CLEANUP_INTERVAL_MS || String(15 * 60 * 1000), 10));

function checkAndConsumeQuota(key) {
  const now = Date.now();
  const entry = quotaMap.get(key) || { count: 0, windowStart: now };
  if (now - entry.windowStart > QUOTA_WINDOW_MS) {
    entry.count = 0;
    entry.windowStart = now;
  }
  if (entry.count >= QUOTA_MAX) return false;
  entry.count += 1;
  quotaMap.set(key, entry);
  return true;
}

app.post('/api/ai', async (req, res) => {
  const { prompt, systemPrompt } = req.body;
  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Invalid request body. `prompt` is required.' });
  }
  const key = req.ip;
  if (!apiKey) {
    // Explicit 503 when service is not configured; helpful for alerts and CI.
    return res.status(503).json({ error: 'AI service is not configured (missing GROQ_API_KEY).' });
  }
  if (!checkAndConsumeQuota(key)) {
    return res.status(429).json({ error: 'Quota exceeded. Try again later.' });
  }

  try {
    const model = (req.body.model && ALLOWED_MODELS.includes(req.body.model)) ? req.body.model : DEFAULT_MODEL;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), AI_TIMEOUT_MS);

    const response = await fetch(`${GROQ_API_BASE}/chat/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemPrompt || 'You are a helpful senior software engineer.' },
          { role: 'user', content: prompt },
        ],
        temperature: 0.3,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    // Try to parse JSON safely
    let data;
    try {
      data = await response.json();
    } catch (e) {
      const text = await response.text().catch(() => null);
      console.error('AI proxy invalid JSON response; status:', response.status, 'text-snippet:', text ? text.slice(0, 200) : null);
      return res.status(502).json({ error: 'Invalid response from AI provider.' });
    }

    if (!response.ok) {
      console.error('AI provider error status:', response.status, 'message:', data?.error?.message || data?.error || 'unknown');
      return res.status(502).json({ error: data?.error?.message || 'AI provider returned an error.' });
    }

    // Normalize returned text
    const content = data?.choices?.[0]?.message?.content || data?.choices?.[0]?.text || data?.output?.text;
    if (!content) {
      console.error('AI provider returned empty content; status ok but no text');
      return res.status(502).json({ error: 'AI provider returned an unexpected response.' });
    }

    return res.status(200).json({ success: true, text: content });
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error('AI proxy timeout');
      return res.status(504).json({ error: 'AI request timed out.' });
    }
    console.error('AI proxy error:', error);
    return res.status(500).json({ error: 'AI service proxy failed.' });
  }
});

app.listen(port, () => {
  console.log(`AI proxy server listening on port ${port}`);
});
