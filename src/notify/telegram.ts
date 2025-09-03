import config from '../config';

export async function sendTelegram(text: string): Promise<void> {
  if (!config.env.TELEGRAM_BOT_TOKEN || !config.env.TELEGRAM_CHAT_ID) return;
  const url = `https://api.telegram.org/bot${config.env.TELEGRAM_BOT_TOKEN}/sendMessage`;
  await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: config.env.TELEGRAM_CHAT_ID, text }),
  });
}
