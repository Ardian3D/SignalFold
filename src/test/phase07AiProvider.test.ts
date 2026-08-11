import { describe, expect, it, vi } from 'vitest';
import { callDeepSeekTriage, validateAnalysisResult } from '../../base44/functions/_shared/ai-workflow';

const okBody = (content = JSON.stringify({ summary: 'S', severitySuggestion: 'SEV1', category: 'payments', impact: 'I', confidence: 0.8, riskFlags: [], clarifyingQuestions: [], recommendedTasks: [], immediateNextAction: 'A' })) => new Response(JSON.stringify({
  choices: [{ message: { content } }],
  usage: { prompt_tokens: 10, completion_tokens: 20 },
}), { status: 200, headers: { 'Content-Type': 'application/json' } });

const makeFetch = (impl: (url: string, init: RequestInit) => Promise<Response>) => {
  const fetchMock = vi.fn(impl as unknown as typeof fetch);
  return fetchMock;
};

describe('Phase 07 DeepSeek provider adapter', () => {
  it('returns parsed content and token counts on success', async () => {
    const fetchMock = makeFetch(async () => okBody());
    const result = await callDeepSeekTriage({ apiKey: 'k', model: 'deepseek-v4-flash', systemPrompt: 's', userPrompt: 'u', fetchImpl: fetchMock as unknown as typeof fetch });
    expect(result.content).toContain('SEV1');
    expect(result.inputTokens).toBe(10);
    expect(result.outputTokens).toBe(20);
    const body = JSON.parse(fetchMock.mock.calls[0]![1]!.body as string) as Record<string, unknown>;
    expect(body.thinking).toEqual({ type: 'disabled' });
    expect(body.response_format).toEqual({ type: 'json_object' });
    expect(body.stream).toBe(false);
    expect(body.max_tokens).toBe(1500);
    expect(body.tools).toBeUndefined();
    expect((fetchMock.mock.calls[0]![1]!.headers as Record<string, string>)['Authorization']).toBe('Bearer k');
  });

  it('accepts valid JSON content for structured analysis', async () => {
    const fetchMock = makeFetch(async () => okBody());
    const result = await callDeepSeekTriage({ apiKey: 'k', model: 'm', systemPrompt: 's', userPrompt: 'u', fetchImpl: fetchMock as unknown as typeof fetch });
    expect(validateAnalysisResult(JSON.parse(result.content)).ok).toBe(true);
  });

  it('rejects empty content as invalid response', async () => {
    const fetchMock = makeFetch(async () => new Response(JSON.stringify({ choices: [{ message: { content: '' } }] }), { status: 200 }));
    await expect(callDeepSeekTriage({ apiKey: 'k', model: 'm', systemPrompt: 's', userPrompt: 'u', fetchImpl: fetchMock as unknown as typeof fetch })).rejects.toMatchObject({ code: 'AI_INVALID_RESPONSE' });
  });

  it('throws timeout on abort', async () => {
    const fetchMock = makeFetch(async () => { throw { name: 'AbortError' }; });
    await expect(callDeepSeekTriage({ apiKey: 'k', model: 'm', systemPrompt: 's', userPrompt: 'u', timeoutMs: 1000, fetchImpl: fetchMock as unknown as typeof fetch })).rejects.toMatchObject({ code: 'AI_TIMEOUT', status: 504 });
  });

  it('throws provider unavailable on network failure', async () => {
    const fetchMock = makeFetch(async () => { throw new Error('ECONNREFUSED'); });
    await expect(callDeepSeekTriage({ apiKey: 'k', model: 'm', systemPrompt: 's', userPrompt: 'u', fetchImpl: fetchMock as unknown as typeof fetch })).rejects.toMatchObject({ code: 'AI_PROVIDER_UNAVAILABLE', status: 502 });
  });

  it('normalizes rate limit', async () => {
    const fetchMock = makeFetch(async () => new Response('rate limited', { status: 429 }));
    await expect(callDeepSeekTriage({ apiKey: 'k', model: 'm', systemPrompt: 's', userPrompt: 'u', fetchImpl: fetchMock as unknown as typeof fetch })).rejects.toMatchObject({ code: 'AI_RATE_LIMITED', status: 429 });
  });

  it('normalizes provider 5xx', async () => {
    const fetchMock = makeFetch(async () => new Response('boom', { status: 503 }));
    await expect(callDeepSeekTriage({ apiKey: 'k', model: 'm', systemPrompt: 's', userPrompt: 'u', fetchImpl: fetchMock as unknown as typeof fetch })).rejects.toMatchObject({ code: 'AI_PROVIDER_UNAVAILABLE', status: 502 });
  });

  it('normalizes missing/invalid key', async () => {
    const fetchMock = makeFetch(async () => new Response('unauthorized', { status: 401 }));
    await expect(callDeepSeekTriage({ apiKey: 'k', model: 'm', systemPrompt: 's', userPrompt: 'u', fetchImpl: fetchMock as unknown as typeof fetch })).rejects.toMatchObject({ code: 'AI_NOT_CONFIGURED', status: 503 });
  });

  it('never exposes the raw provider body in errors', async () => {
    const fetchMock = makeFetch(async () => new Response(JSON.stringify({ internal: 'secret', error: { message: 'insufficient balance' } }), { status: 500 }));
    try {
      await callDeepSeekTriage({ apiKey: 'k', model: 'm', systemPrompt: 's', userPrompt: 'u', fetchImpl: fetchMock as unknown as typeof fetch });
      expect.unreachable('should throw');
    } catch (error) {
      const value = error as Record<string, unknown>;
      expect(JSON.stringify(value)).not.toContain('insufficient balance');
      expect(JSON.stringify(value)).not.toContain('Bearer');
    }
  });

  it('does not configure tool calls or chain-of-thought output', async () => {
    const fetchMock = makeFetch(async () => okBody());
    await callDeepSeekTriage({ apiKey: 'k', model: 'm', systemPrompt: 's', userPrompt: 'u', fetchImpl: fetchMock as unknown as typeof fetch });
    const body = JSON.parse(fetchMock.mock.calls[0]![1]!.body as string) as Record<string, unknown>;
    expect(body.tools).toBeUndefined();
    expect(body.tool_choice).toBeUndefined();
    expect(body.thinking).toEqual({ type: 'disabled' });
  });

  it('uses a bounded max output', async () => {
    const fetchMock = makeFetch(async () => okBody());
    await callDeepSeekTriage({ apiKey: 'k', model: 'm', systemPrompt: 's', userPrompt: 'u', fetchImpl: fetchMock as unknown as typeof fetch });
    const body = JSON.parse(fetchMock.mock.calls[0]![1]!.body as string) as Record<string, unknown>;
    expect(Number(body.max_tokens)).toBeLessThanOrEqual(1500);
  });
});
