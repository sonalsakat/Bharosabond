import type { Plugin } from 'vite';
import { isConcernAnalysis } from '../src/concernAnalysis.ts';

const responseSchema = {
  type: 'object',
  properties: {
    primary_concern: { type: 'string', enum: ['Low pay', 'Safety', 'Respect', 'Degree is better', "Girls' safety", 'Cost'] },
    secondary_concern: { type: ['string', 'null'], enum: ['Low pay', 'Safety', 'Respect', 'Degree is better', "Girls' safety", 'Cost', null] },
    trade_mentioned: { type: ['string', 'null'], enum: ['Electrician', 'Welder', 'Plumber', 'Drafting technician', null] },
    learner_gender_if_mentioned: { type: ['string', 'null'], enum: ['son', 'daughter', null] },
    sentiment: { type: 'string', enum: ['worried', 'uncertain', 'hopeful', 'neutral'] },
    key_phrases: { type: 'array', items: { type: 'string', maxLength: 80 }, maxItems: 4 },
    one_line_summary: { type: 'string', maxLength: 240 },
  },
  required: ['primary_concern', 'secondary_concern', 'trade_mentioned', 'learner_gender_if_mentioned', 'sentiment', 'key_phrases', 'one_line_summary'],
  additionalProperties: false,
} as const;

type ServerRequest = { method?: string; on: (event: string, listener: (...args: unknown[]) => void) => unknown };
type ServerResponse = { writeHead: (status: number, headers: Record<string, string>) => unknown; end: (body: string) => unknown };
let rateWindowStarted = 0;
let rateWindowCount = 0;
function allowRequest() {
  const now = Date.now();
  if (now - rateWindowStarted >= 60_000) { rateWindowStarted = now; rateWindowCount = 0; }
  rateWindowCount += 1;
  return rateWindowCount <= 20;
}
function sendJson(response: ServerResponse, status: number, value: unknown) {
  response.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' });
  response.end(JSON.stringify(value));
}
function readRequestBody(request: ServerRequest, maxBytes: number): Promise<string> {
  return new Promise((resolve, reject) => {
    let body = '';
    let size = 0;
    request.on('data', (chunk: unknown) => {
      const part = typeof chunk === 'string' ? chunk : chunk instanceof Uint8Array ? new TextDecoder().decode(chunk) : '';
      size += new TextEncoder().encode(part).length;
      if (size > maxBytes) { reject(new Error('Request is too large.')); return; }
      body += part;
    });
    request.on('end', () => resolve(body));
    request.on('error', () => reject(new Error('Request could not be read.')));
  });
}
async function callModel(text: string, language: string, withSchema: boolean): Promise<unknown | null> {
  const serverProcess = (globalThis as unknown as { process?: { env?: Record<string, string | undefined> } }).process;
  const env = serverProcess?.env ?? {};
  const baseUrl = env.BUILT_IN_FORGE_API_URL;
  const apiKey = env.BUILT_IN_FORGE_API_KEY;
  if (!baseUrl || !apiKey) throw new Error('The managed LLM service is unavailable.');
  const response = await fetch(`${baseUrl.replace(/\/$/, '')}/v1/chat/completions`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    signal: AbortSignal.timeout(16_000),
    body: JSON.stringify({
      model: 'gpt-5-mini', max_completion_tokens: 900, reasoning: { effort: 'minimal' },
      messages: [
        { role: 'system', content: 'Classify only what the speaker actually says. Understand Marathi, Hindi, English, and code-switched/transliterated speech. Map concerns to exactly one primary category: Low pay, Safety, Respect, Degree is better, Girls\' safety, Cost. If a girl/daughter is mentioned with a safety concern, choose Girls\' safety. Extract only Electrician, Welder, Plumber, Drafting technician, or null as a trade. Extract son/daughter only when explicitly mentioned, otherwise null. Do not infer sensitive personal facts. Return one short sentence in the requested language without adding claims. Keep key phrases short verbatim spans of the input.' },
        { role: 'user', content: `Selected language: ${language}. Spoken or typed words: ${text}` },
      ],
      ...(withSchema ? { response_format: { type: 'json_schema', json_schema: { name: 'concern_analysis', strict: true, schema: responseSchema } } } : {}),
    }),
  });
  const data = await response.json() as { error?: { message?: string }; choices?: Array<{ message?: { content?: unknown } }> };
  if (!response.ok || data.error) throw new Error('The concern service returned an error.');
  const content = data.choices?.[0]?.message?.content;
  if (typeof content !== 'string' || !content.trim()) return null;
  const cleaned = content.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
  try {
    const parsed: unknown = JSON.parse(cleaned);
    if (isConcernAnalysis(parsed)) return parsed;
  } catch { /* The caller may retry once without schema. */ }
  const start = cleaned.indexOf('{');
  const end = cleaned.lastIndexOf('}');
  if (start >= 0 && end > start) {
    try { const parsed: unknown = JSON.parse(cleaned.slice(start, end + 1)); if (isConcernAnalysis(parsed)) return parsed; } catch { /* Use local rules in the client. */ }
  }
  return null;
}

export function concernAnalysisPlugin(): Plugin {
  return {
    name: 'bharosa-concern-analysis-preview',
    configureServer(server) {
      server.middlewares.use('/api/concern-analysis', async (request, response) => {
        const req = request as unknown as ServerRequest;
        const res = response as unknown as ServerResponse;
        if (req.method !== 'POST') { sendJson(res, 405, { error: 'Use POST.' }); return; }
        if (!allowRequest()) { sendJson(res, 429, { error: 'Too many requests. Please try again shortly.' }); return; }
        try {
          const body = await readRequestBody(req, 5000);
          const parsed = JSON.parse(body) as { text?: unknown; language?: unknown };
          if (typeof parsed.text !== 'string' || !parsed.text.trim() || parsed.text.length > 1200) { sendJson(res, 400, { error: 'Enter a short sentence to continue.' }); return; }
          if (!['en', 'mr', 'hi'].includes(String(parsed.language))) { sendJson(res, 400, { error: 'Choose a supported language.' }); return; }
          const text = parsed.text.trim();
          let result = await callModel(text, String(parsed.language), true);
          if (!result) result = await callModel(text, String(parsed.language), false);
          if (!result) { sendJson(res, 502, { error: 'No structured result was returned.' }); return; }
          sendJson(res, 200, result);
        } catch (error) {
          const message = error instanceof Error ? error.message : 'The request could not be completed.';
          sendJson(res, message === 'Request is too large.' ? 413 : message === 'The managed LLM service is unavailable.' ? 503 : 502, { error: message });
        }
      });
    },
  };
}
