import prisma from './client';

export interface JobInput {
  upworkJobId: string;
  title: string;
  descriptionHash: string;
  budget?: number | null;
  type: string;
  clientCountry?: string | null;
  clientSpend?: number | null;
  paymentVerified: boolean;
  postedAt: Date;
  score?: number | null;
  reason?: string | null;
  notifiedAt?: Date | null;
}

export async function upsertJob(data: JobInput) {
  return prisma.job.upsert({
    where: { upworkJobId: data.upworkJobId },
    create: data,
    update: data,
  });
}
