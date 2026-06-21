import { AlertTriangle } from "lucide-react";
import { resendVerificationAction } from "@/app/actions";
import { QrCard } from "@/components/qr-card";
import { requireOwnerCompany } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { buildDailySeries, calculateMetrics } from "@/lib/metrics";

function appUrl() {
  return process.env.APP_URL ?? "http://localhost:3000";
}

export default async function DashboardPage() {
  const { user, company } = await requireOwnerCompany();
  const reviews = await prisma.review.findMany({
    where: { companyId: company.id },
    orderBy: { createdAt: "asc" },
    select: { rating: true, createdAt: true },
  });
  const metrics = calculateMetrics(reviews);
  const series = buildDailySeries(reviews);
  const maxCount = Math.max(1, ...series.map((item) => item.count));
  const reviewUrl = `${appUrl()}/r/${company.slug}?source=link`;

  return (
    <>
      <div className="main-header">
        <div>
          <h1>{company.name}</h1>
          <p className="muted">Приватний фідбек, індекс лояльності та QR для збору відгуків.</p>
        </div>
      </div>

      {!user.emailVerifiedAt ? (
        <form action={resendVerificationAction} className="error" style={{ marginBottom: 16 }}>
          <AlertTriangle size={16} /> Email не підтверджено. Сповіщення про негативні відгуки не надсилаються.{" "}
          <button className="button secondary" type="submit">Надіслати підтвердження</button>
        </form>
      ) : null}

      <section className="stats">
        <div className="stat"><span className="muted">Середня оцінка</span><strong>{metrics.average.toFixed(1)}</strong></div>
        <div className="stat"><span className="muted">Відгуків</span><strong>{metrics.total}</strong></div>
        <div className="stat"><span className="muted">Позитивні 5</span><strong>{metrics.positivePercent}%</strong></div>
        <div className="stat"><span className="muted">Ризикові 1-3</span><strong>{metrics.negativePercent}%</strong></div>
        <div className="stat"><span className="muted">Loyalty Score</span><strong>{metrics.loyaltyScore}</strong></div>
      </section>

      <div className="grid-two">
        <section className="panel">
          <div style={{ padding: 18, borderBottom: "1px solid var(--line)" }}>
            <strong>Останні 30 днів</strong>
            <p className="small">Кількість відгуків за день. Негативних за 7 днів: {metrics.negativeLast7Days}</p>
          </div>
          <div className="chart">
            {series.map((item) => (
              <div className="bar" key={item.label} style={{ height: `${Math.max(6, (item.count / maxCount) * 100)}%` }} title={`${item.label}: ${item.count}`} />
            ))}
          </div>
        </section>
        <QrCard url={reviewUrl} />
      </div>
    </>
  );
}

