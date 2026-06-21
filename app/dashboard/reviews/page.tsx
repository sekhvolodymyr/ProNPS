import Link from "next/link";
import { archiveReviewAction } from "@/app/actions";
import { requireOwnerCompany } from "@/lib/auth";
import { prisma } from "@/lib/db";

export default async function ReviewsPage({ searchParams }: { searchParams: Promise<{ filter?: string; status?: string }> }) {
  const params = await searchParams;
  const { company } = await requireOwnerCompany();
  const ratingWhere =
    params.filter === "negative"
      ? { lte: 3 }
      : params.filter === "passive"
        ? 4
        : params.filter === "positive"
          ? 5
          : undefined;

  const reviews = await prisma.review.findMany({
    where: {
      companyId: company.id,
      ...(ratingWhere ? { rating: ratingWhere } : {}),
      ...(params.status === "archived" ? { status: "archived" } : params.status === "active" ? { status: "active" } : {}),
    },
    orderBy: { createdAt: "desc" },
  });

  const filterLinks = [
    ["/dashboard/reviews", "Всі"],
    ["/dashboard/reviews?filter=negative", "1-3"],
    ["/dashboard/reviews?filter=passive", "4"],
    ["/dashboard/reviews?filter=positive", "5"],
    ["/dashboard/reviews?status=active", "Активні"],
    ["/dashboard/reviews?status=archived", "Архів"],
  ];

  return (
    <>
      <div className="main-header">
        <div>
          <h1>Відгуки</h1>
          <p className="muted">Фільтруйте, архівуйте та експортуйте приватні повідомлення клієнтів.</p>
        </div>
        <Link className="button secondary" href="/dashboard/reviews/export">CSV export</Link>
      </div>
      <div className="filters">
        {filterLinks.map(([href, label]) => <Link className="button secondary" href={href} key={href}>{label}</Link>)}
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Дата</th>
              <th>Оцінка</th>
              <th>Коментар</th>
              <th>Контакт</th>
              <th>Source</th>
              <th>Статус</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((review) => (
              <tr key={review.id}>
                <td>{review.createdAt.toLocaleString("uk-UA")}</td>
                <td>{"★".repeat(review.rating)}</td>
                <td>{review.comment}</td>
                <td>{review.contact ?? "—"}</td>
                <td>{review.source ?? "—"}</td>
                <td>{review.status}</td>
                <td>
                  {review.status === "active" ? (
                    <form action={archiveReviewAction.bind(null, review.id)}>
                      <button className="button secondary" type="submit">Архів</button>
                    </form>
                  ) : null}
                </td>
              </tr>
            ))}
            {!reviews.length ? (
              <tr><td colSpan={7}>Поки немає відгуків. Поділіться QR або посиланням із dashboard.</td></tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </>
  );
}

