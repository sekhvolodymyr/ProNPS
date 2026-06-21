import { DashboardShell } from "@/components/dashboard-shell";
import { requireUser } from "@/lib/auth";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  return <DashboardShell isAdmin={user.role === "ADMIN"}>{children}</DashboardShell>;
}

