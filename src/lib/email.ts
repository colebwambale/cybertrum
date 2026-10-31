import { Resend } from "resend";

export async function sendEmail(to: string, subject: string, html: string) {
  if (!process.env.RESEND_API_KEY) return; // skip silently in local dev
  const resend = new Resend(process.env.RESEND_API_KEY);
  await resend.emails.send({ from: process.env.EMAIL_FROM!, to, subject, html });
}
