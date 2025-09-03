import { describe, it, expect } from 'vitest';
import { normalize, hash } from '../src/lib/hash';

describe('hash utilities', () => {
  it('normalizes text', () => {
    const text = '<p>Hello  World</p>';
    expect(normalize(text)).toBe('hello world');
  });

  it('hashes consistently', () => {
    expect(hash('Test')).toBe(hash('test'));
  });
});
