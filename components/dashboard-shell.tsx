import Link from "next/link";
import { BarChart3, Inbox, LogOut, Settings, Shield } from "lucide-react";
import { logoutAction } from "@/app/actions";
import { Brand } from "@/components/brand";

export function DashboardShell({ children, isAdmin = false }: { children: React.ReactNode; isAdmin?: boolean }) {
  return (
    <div className="dashboard">
      <aside className="sidebar">
        <Brand />
        <nav>
          <Link href="/dashboard">
            <BarChart3 size={17} /> Dashboard
          </Link>
          <Link href="/dashboard/reviews">
            <Inbox size={17} /> Відгуки
          </Link>
          <Link href="/dashboard/settings">
            <Settings size={17} /> Налаштування
          </Link>
          {isAdmin ? (
            <Link href="/admin">
              <Shield size={17} /> Admin
            </Link>
          ) : null}
          <form action={logoutAction}>
            <button type="submit">
              <LogOut size={17} /> Вийти
            </button>
          </form>
        </nav>
      </aside>
      <main className="main">{children}</main>
    </div>
  );
}
