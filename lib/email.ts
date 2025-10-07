import nodemailer from "nodemailer";

export type MailOptions = {
  to: string;
  subject: string;
  html: string;
};

export async function sendMail({ to, subject, html }: MailOptions) {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM || user || "no-reply@example.com";

  if (!host || !user || !pass) {
    console.warn("[email] SMTP not configured; email not sent.");
    return { sent: false, error: "smtp_not_configured" } as const;
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });
    await transporter.sendMail({ from, to, subject, html });
    return { sent: true } as const;
  } catch (e: any) {
    console.error("[email] sendMail failed", e?.message || e);
    return { sent: false, error: e?.message || String(e) } as const;
  }
}
