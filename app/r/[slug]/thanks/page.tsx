import Link from "next/link";
import { notFound } from "next/navigation";
import { CompanyLogo } from "@/components/brand";
import { copy, resolveLocale } from "@/lib/i18n";
import { prisma } from "@/lib/db";

export default async function ThanksPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ lang?: string }>;
}) {
  const { slug } = await params;
  const { lang } = await searchParams;
  const locale = resolveLocale(lang);
  const company = await prisma.company.findUnique({
    where: { slug },
    include: { thankYouSettings: true },
  });
  if (!company) notFound();

  const settings = company.thankYouSettings;

  return (
    <div className="review-wrap">
      <div className="review-card">
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <CompanyLogo logoUrl={company.logoUrl} name={company.name} />
          <strong>{company.name}</strong>
        </div>
        <h1 style={{ fontSize: 42, marginTop: 26 }}>{settings?.title ?? copy[locale].thanks}</h1>
        <p className="lead">{settings?.message ?? "Thank you."}</p>
        {settings?.bonusEnabled ? (
          <div className="metric-tile" style={{ margin: "22px 0" }}>
            <span className="muted">Bonus</span>
            <strong style={{ fontSize: 22 }}>{settings.bonusText}</strong>
            {settings.promoCode ? <p><code>{settings.promoCode}</code></p> : null}
          </div>
        ) : null}
        {settings?.buttonUrl && settings.buttonLabel ? (
          <Link className="button" href={settings.buttonUrl}>{settings.buttonLabel}</Link>
        ) : (
          <Link className="button secondary" href={`/r/${slug}`}>{locale === "uk" ? "Готово" : "Done"}</Link>
        )}
      </div>
    </div>
  );
}

