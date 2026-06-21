import Link from "next/link";
import { notFound } from "next/navigation";
import { CompanyLogo } from "@/components/brand";
import { RatingForm } from "@/components/rating-form";
import { copy, resolveLocale } from "@/lib/i18n";
import { prisma } from "@/lib/db";
import { getDatabaseSetupError } from "@/lib/setup";

export default async function PublicReviewPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ lang?: string; source?: string }>;
}) {
  const { slug } = await params;
  const query = await searchParams;
  const locale = resolveLocale(query.lang);
  const t = copy[locale];
  const databaseError = getDatabaseSetupError();

  if (databaseError) {
    return (
      <div className="review-wrap">
        <div className="review-card">
          <h1 style={{ fontSize: 34 }}>{t.unavailable}</h1>
          <p className="muted">{databaseError}</p>
        </div>
      </div>
    );
  }

  const company = await prisma.company.findUnique({ where: { slug } });

  if (!company) notFound();

  if (company.status === "disabled") {
    return (
      <div className="review-wrap">
        <div className="review-card">
          <h1 style={{ fontSize: 34 }}>{t.unavailable}</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="review-wrap">
      <div className="review-card">
        <div className="main-header" style={{ marginBottom: 10 }}>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <CompanyLogo logoUrl={company.logoUrl} name={company.name} />
            <div>
              <strong>{company.name}</strong>
              <p className="small" style={{ margin: 0 }}>{company.category}</p>
            </div>
          </div>
          <div className="language">
            <Link className={locale === "uk" ? "active" : ""} href={`/r/${slug}?lang=uk&source=${query.source ?? ""}`}>UA</Link>
            <Link className={locale === "en" ? "active" : ""} href={`/r/${slug}?lang=en&source=${query.source ?? ""}`}>EN</Link>
          </div>
        </div>
        <h1 style={{ fontSize: 40, marginTop: 26 }}>{locale === "uk" ? "Оцініть ваш досвід" : "Rate your experience"}</h1>
        <p className="muted">{locale === "uk" ? "Оберіть від 1 до 5 зірок." : "Choose from 1 to 5 stars."}</p>
        <RatingForm locale={locale} slug={slug} source={query.source} />
        <p className="small"><Link href="/privacy">Privacy</Link></p>
      </div>
    </div>
  );
}
