import nodemailer from 'nodemailer';
import config from '../config';

export async function sendEmail(text: string): Promise<void> {
  if (!config.env.EMAIL_SMTP_HOST) return;
  const transporter = nodemailer.createTransport({
    host: config.env.EMAIL_SMTP_HOST,
    port: Number(config.env.EMAIL_SMTP_PORT || 587),
    auth: config.env.EMAIL_SMTP_USER
      ? { user: config.env.EMAIL_SMTP_USER, pass: config.env.EMAIL_SMTP_PASS }
      : undefined,
  });
  await transporter.sendMail({
    from: config.env.EMAIL_SMTP_USER,
    to: config.env.EMAIL_SMTP_USER,
    subject: 'Upwork job',
    text,
  });
}
