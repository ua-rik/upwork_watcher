import fs from 'fs';
import path from 'path';
import { fetchJobs } from './adapters/upwork';
import { hardFilter } from './filters/hardFilters';
import { scoreJob } from './scoring/llmScorer';
import { hash } from './lib/hash';
import { getLastSeenPostedAt, setLastSeenPostedAt } from './db/meta';
import { upsertJob } from './db/jobs';
import config from './config';
import logger from './lib/log';
import { addMinutes } from './lib/time';
import { notify } from './notify';

export interface RunOptions {
  since?: string;
  lookbackMin?: number;
  dryRun?: boolean;
}

export default async function run(options: RunOptions = {}) {
  const lastSeen = options.since
    ? new Date(options.since)
    : await getLastSeenPostedAt();
  const since = lastSeen
    ? addMinutes(lastSeen, -config.safetyBufferMinutes)
    : addMinutes(new Date(), -((options.lookbackMin ?? config.defaultLookbackMinutes)));
  logger.info({ since: since.toISOString() }, 'fetching jobs');

  const jobs = await fetchJobs({ postedFrom: since.toISOString() });
  const outPath = path.join('out', 'results.jsonl');
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  const out = fs.createWriteStream(outPath, { flags: 'a' });

  let maxPostedAt = lastSeen ?? new Date(0);
  for (const job of jobs) {
    const filterRes = hardFilter(job);
    if (!filterRes.pass) continue;

    const score = await scoreJob({ title: job.title, description: job.description });
    const line = {
      title: job.title,
      budget: job.budget,
      type: job.jobType,
      country: job.client.country,
      paymentVerified: job.client.paymentVerificationStatus,
      why: score.why,
      score: score.score,
      url: job.url,
    };

    logger.info(line, 'job');
    out.write(JSON.stringify(line) + '\n');

    const data = {
      upworkJobId: job.id,
      title: job.title,
      descriptionHash: hash(job.description),
      budget: job.budget ?? null,
      type: job.jobType,
      clientCountry: job.client.country ?? null,
      clientSpend: job.client.totalSpend ?? null,
      paymentVerified: job.client.paymentVerificationStatus === 'VERIFIED',
      postedAt: new Date(job.createdAt),
      score: score.score,
      reason: score.why,
      notifiedAt: null,
    };
    await upsertJob(data);
    if (config.env.NOTIFY_ENABLED === 'true' && !options.dryRun) {
      await notify(`${job.title}\n${job.url}\nscore: ${score.score}`);
    }
    const postedAt = new Date(job.createdAt);
    if (postedAt > maxPostedAt) maxPostedAt = postedAt;
  }

  out.end();
  await setLastSeenPostedAt(maxPostedAt);
}
