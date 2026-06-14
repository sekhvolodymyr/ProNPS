import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

type EmailInput = {
  to: string;
  subject: string;
  html: string;
};

async function sendEmail(input: EmailInput) {
  const from = process.env.EMAIL_FROM ?? "ProNPS <noreply@example.com>";

  if (!resend) {
    console.info("[email:dev]", { from, ...input });
    return;
  }

  await resend.emails.send({ from, ...input });
}

export async function sendVerificationEmail(to: string, url: string) {
  await sendEmail({
    to,
    subject: "Verify your ProNPS email",
    html: `<p>Confirm your ProNPS account:</p><p><a href="${url}">Verify email</a></p>`,
  });
}

export async function sendPasswordResetEmail(to: string, url: string) {
  await sendEmail({
    to,
    subject: "Reset your ProNPS password",
    html: `<p>Reset your password:</p><p><a href="${url}">Choose a new password</a></p>`,
  });
}

export async function sendNegativeReviewAlert(to: string, companyName: string, rating: number, comment: string) {
  await sendEmail({
    to,
    subject: `New ${rating}-star feedback for ${companyName}`,
    html: `<p>${companyName} received a ${rating}-star review.</p><blockquote>${escapeHtml(comment)}</blockquote>`,
  });
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

