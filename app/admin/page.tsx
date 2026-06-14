import { disableCompanyAction, enableCompanyAction } from "@/app/actions";
import { DashboardShell } from "@/components/dashboard-shell";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";

export default async function AdminPage() {
  await requireAdmin();
  const companies = await prisma.company.findMany({
    include: { owner: true, _count: { select: { reviews: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <DashboardShell isAdmin>
      <div className="main-header">
        <div>
          <h1>Admin</h1>
          <p className="muted">Компанії, статуси email та контроль деактивації.</p>
        </div>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Компанія</th>
              <th>Email</th>
              <th>Відгуків</th>
              <th>Дата</th>
              <th>Email status</th>
              <th>Company status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {companies.map((company) => (
              <tr key={company.id}>
                <td>{company.name}</td>
                <td>{company.owner.email}</td>
                <td>{company._count.reviews}</td>
                <td>{company.createdAt.toLocaleDateString("uk-UA")}</td>
                <td>{company.owner.emailVerifiedAt ? "verified" : "unverified"}</td>
                <td>{company.status}</td>
                <td>
                  {company.status === "active" ? (
                    <form action={disableCompanyAction.bind(null, company.id)}>
                      <button className="button danger" type="submit">Disable</button>
                    </form>
                  ) : (
                    <form action={enableCompanyAction.bind(null, company.id)}>
                      <button className="button secondary" type="submit">Enable</button>
                    </form>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardShell>
  );
}

