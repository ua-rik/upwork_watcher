import prisma from '../src/db/client';
import { hash } from '../src/lib/hash';

async function main() {
  await prisma.job.upsert({
    where: { upworkJobId: 'seed-1' },
    create: {
      upworkJobId: 'seed-1',
      title: 'Sample Job',
      descriptionHash: hash('Sample description'),
      budget: 1000,
      type: 'fixed',
      clientCountry: 'US',
      clientSpend: 5000,
      paymentVerified: true,
      postedAt: new Date(),
      score: 80,
      reason: 'seed',
    },
    update: {},
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
