import prisma from './client';

export async function getMeta(key: string): Promise<string | null> {
  const row = await prisma.meta.findUnique({ where: { key } });
  return row?.value ?? null;
}

export async function setMeta(key: string, value: string): Promise<void> {
  await prisma.meta.upsert({
    where: { key },
    create: { key, value },
    update: { value },
  });
}

export async function getLastSeenPostedAt(): Promise<Date | null> {
  const val = await getMeta('last_seen_posted_at');
  return val ? new Date(val) : null;
}

export async function setLastSeenPostedAt(date: Date): Promise<void> {
  await setMeta('last_seen_posted_at', date.toISOString());
}
