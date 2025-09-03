import config from '../config';
import { UpworkJob } from '../adapters/upwork';

export interface FilterResult {
  pass: boolean;
  reason?: string;
}

export function hardFilter(job: UpworkJob): FilterResult {
  const f = config.filters;
  if (f.minBudget && (job.budget ?? 0) < f.minBudget) {
    return { pass: false, reason: 'low-budget' };
  }
  if (!f.contractTypes.includes(job.jobType)) {
    return { pass: false, reason: 'contract-type' };
  }
  if (f.paymentVerified && job.client.paymentVerificationStatus !== 'VERIFIED') {
    return { pass: false, reason: 'payment-not-verified' };
  }
  if (f.minClientSpend && (job.client.totalSpend ?? 0) < f.minClientSpend) {
    return { pass: false, reason: 'low-client-spend' };
  }
  if (f.allowedCountries.length && job.client.country && !f.allowedCountries.includes(job.client.country)) {
    return { pass: false, reason: 'country' };
  }
  const skillsStr = `${job.title} ${job.description}`.toLowerCase();
  if (f.requiredSkills.some((s) => !skillsStr.includes(s.toLowerCase()))) {
    return { pass: false, reason: 'missing-skills' };
  }
  return { pass: true };
}
