import dotenv from 'dotenv';
import { z } from 'zod';
import defaults from '../../config/default';

dotenv.config();

const envSchema = z.object({
  DATABASE_URL: z.string().default('file:./prisma/dev.db'),
  OPENAI_API_KEY: z.string().optional(),
  UPWORK_CLIENT_ID: z.string().optional(),
  UPWORK_CLIENT_SECRET: z.string().optional(),
  UPWORK_ACCESS_TOKEN: z.string().optional(),
  UPWORK_API_URL: z.string().url().default('https://api.upwork.com/graphql'),
  TELEGRAM_BOT_TOKEN: z.string().optional(),
  TELEGRAM_CHAT_ID: z.string().optional(),
  EMAIL_SMTP_HOST: z.string().optional(),
  EMAIL_SMTP_PORT: z.string().optional(),
  EMAIL_SMTP_USER: z.string().optional(),
  EMAIL_SMTP_PASS: z.string().optional(),
  NOTIFY_ENABLED: z.string().optional(),
  MIN_BUDGET: z.string().optional(),
  MIN_HOURLY_RATE: z.string().optional(),
  REQUIRED_SKILLS: z.string().optional(),
  SAFETY_BUFFER_MINUTES: z.string().optional(),
  DEFAULT_LOOKBACK_MINUTES: z.string().optional(),
  MIN_CLIENT_SPEND: z.string().optional(),
  PAYMENT_VERIFIED: z.string().optional(),
  CONTRACT_TYPES: z.string().optional(),
  ALLOWED_COUNTRIES: z.string().optional(),
});

const env = envSchema.parse(process.env);

const config = {
  ...defaults,
  filters: {
    ...defaults.filters,
    minBudget: env.MIN_BUDGET ? Number(env.MIN_BUDGET) : defaults.filters.minBudget,
    minHourlyRate: env.MIN_HOURLY_RATE ? Number(env.MIN_HOURLY_RATE) : defaults.filters.minHourlyRate,
    requiredSkills: env.REQUIRED_SKILLS
      ? env.REQUIRED_SKILLS.split(',').map((s) => s.trim())
      : defaults.filters.requiredSkills,
    minClientSpend: env.MIN_CLIENT_SPEND ? Number(env.MIN_CLIENT_SPEND) : defaults.filters.minClientSpend,
    paymentVerified: env.PAYMENT_VERIFIED
      ? env.PAYMENT_VERIFIED === 'true'
      : defaults.filters.paymentVerified,
    contractTypes: env.CONTRACT_TYPES
      ? env.CONTRACT_TYPES.split(',').map((s) => s.trim())
      : defaults.filters.contractTypes,
    allowedCountries: env.ALLOWED_COUNTRIES
      ? env.ALLOWED_COUNTRIES.split(',').map((s) => s.trim())
      : defaults.filters.allowedCountries,
  },
  safetyBufferMinutes: env.SAFETY_BUFFER_MINUTES
    ? Number(env.SAFETY_BUFFER_MINUTES)
    : defaults.safetyBufferMinutes,
  defaultLookbackMinutes: env.DEFAULT_LOOKBACK_MINUTES
    ? Number(env.DEFAULT_LOOKBACK_MINUTES)
    : defaults.defaultLookbackMinutes,
  env,
};

export default config;
export type AppConfig = typeof config;
