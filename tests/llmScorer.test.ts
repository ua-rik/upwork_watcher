import { describe, it, expect } from 'vitest';
import { parseScoreResponse } from '../src/scoring/llmScorer';

describe('parseScoreResponse', () => {
  it('parses valid JSON', () => {
    const res = parseScoreResponse('{"score":80,"flags":["ok"],"why":"good"}');
    expect(res.score).toBe(80);
    expect(res.flags).toEqual(['ok']);
  });

  it('handles invalid JSON', () => {
    const res = parseScoreResponse('oops');
    expect(res.score).toBe(0);
    expect(res.flags).toContain('parse-error');
  });
});
