import Link from "next/link";
import { prisma } from "@/lib/db";
import { hashToken } from "@/lib/crypto";
import { getDatabaseSetupError } from "@/lib/setup";

export default async function VerifyEmailPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token } = await searchParams;
  const databaseError = getDatabaseSetupError();
  let ok = false;

  if (!databaseError && token) {
    const record = await prisma.emailVerificationToken.findUnique({ where: { tokenHash: hashToken(token) } });
    if (record && !record.usedAt && record.expiresAt > new Date()) {
      await prisma.$transaction([
        prisma.user.update({ where: { id: record.userId }, data: { emailVerifiedAt: new Date() } }),
        prisma.emailVerificationToken.update({ where: { id: record.id }, data: { usedAt: new Date() } }),
      ]);
      ok = true;
    }
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <h1 style={{ fontSize: 38 }}>{databaseError ? "База даних недоступна" : ok ? "Email підтверджено" : "Посилання недійсне"}</h1>
        <p className="muted">{databaseError ?? (ok ? "Сповіщення про негативні відгуки тепер можуть працювати." : "Спробуйте надіслати підтвердження ще раз із кабінету.")}</p>
        <Link className="button" href="/dashboard">До кабінету</Link>
      </div>
    </div>
  );
}
