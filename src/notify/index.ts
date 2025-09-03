import config from '../config';
import { sendTelegram } from './telegram';
import { sendEmail } from './email';

export async function notify(text: string): Promise<void> {
  if (config.env.NOTIFY_ENABLED !== 'true') return;
  await Promise.all([sendTelegram(text), sendEmail(text)]);
}
