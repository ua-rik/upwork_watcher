import crypto from 'crypto';

export function normalize(text: string): string {
  return text
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

export function hash(text: string): string {
  return crypto.createHash('sha256').update(normalize(text)).digest('hex');
}
