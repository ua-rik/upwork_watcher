import fs from 'fs';
import { OpenAI } from 'openai';
import config from '../config';

const promptTemplate = fs.readFileSync(new URL('./prompt.md', import.meta.url), 'utf-8');

const openai = new OpenAI({ apiKey: config.env.OPENAI_API_KEY });

export interface ScoreResult {
  score: number;
  flags: string[];
  why: string;
}

export function parseScoreResponse(text: string): ScoreResult {
  try {
    const obj = JSON.parse(text);
    return {
      score: Number(obj.score) || 0,
      flags: Array.isArray(obj.flags) ? obj.flags.map(String) : [],
      why: String(obj.why || ''),
    };
  } catch (err) {
    return { score: 0, flags: ['parse-error'], why: String(err) };
  }
}

export async function scoreJob(job: { title: string; description: string }): Promise<ScoreResult> {
  if (!config.env.OPENAI_API_KEY) {
    return { score: 0, flags: ['no-key'], why: 'OPENAI_API_KEY missing' };
  }
  const prompt = `${promptTemplate}\nTITLE: ${job.title}\nDESCRIPTION: ${truncate(job.description, 4000)}`;
  try {
    const res = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // TODO: adjust model
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
      max_tokens: 300,
      temperature: 0,
    });
    const text = res.choices[0].message?.content || '{}';
    return parseScoreResponse(text);
  } catch (err) {
    return { score: 0, flags: ['error'], why: String(err) };
  }
}

function truncate(text: string, max: number) {
  return text.length > max ? text.slice(0, max) : text;
}
