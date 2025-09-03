import { describe, it, expect, beforeEach } from 'vitest';
import prisma from '../src/db/client';
import { upsertJob } from '../src/db/jobs';
import { setLastSeenPostedAt, getLastSeenPostedAt } from '../src/db/meta';

describe('job upsert and watermark', () => {
  beforeEach(async () => {
    await prisma.job.deleteMany();
  });

  it('deduplicates by upworkJobId', async () => {
    await upsertJob({
      upworkJobId: '1',
      title: 'a',
      descriptionHash: 'x',
      budget: 10,
      type: 'hourly',
      paymentVerified: true,
      postedAt: new Date(),
    });
    await upsertJob({
      upworkJobId: '1',
      title: 'b',
      descriptionHash: 'y',
      budget: 20,
      type: 'hourly',
      paymentVerified: true,
      postedAt: new Date(),
    });
    const count = await prisma.job.count();
    expect(count).toBe(1);
    const job = await prisma.job.findUnique({ where: { upworkJobId: '1' } });
    expect(job?.title).toBe('b');
  });

  it('stores last seen posted at', async () => {
    const d = new Date();
    await setLastSeenPostedAt(d);
    const got = await getLastSeenPostedAt();
    expect(got?.toISOString()).toBe(d.toISOString());
  });
});
