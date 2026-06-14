import Link from "next/link";
import { Star } from "lucide-react";
import { Brand } from "@/components/brand";

export default function HomePage() {
  return (
    <div className="shell">
      <header className="topbar">
        <Brand />
        <div className="nav-actions">
          <div className="language">
            <a className="active" href="?lang=uk">UA</a>
            <a href="?lang=en">EN</a>
          </div>
          <Link className="button secondary" href="/login">Увійти</Link>
          <Link className="button" href="/register">Створити компанію</Link>
        </div>
      </header>
      <main className="page entry">
        <section>
          <h1>Збирайте фідбек, який справді допомагає рости</h1>
          <p>
            ProNPS допомагає сервісним компаніям отримувати приватні оцінки, бачити індекс лояльності
            та швидко реагувати на негативний досвід.
          </p>
          <div className="nav-actions">
            <Link className="button" href="/register">Створити компанію</Link>
            <Link className="button secondary" href="/login">Увійти</Link>
          </div>
        </section>
        <section className="panel preview-panel" aria-label="Product preview">
          <div className="stars">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star color="var(--gold)" fill="var(--gold)" key={star} size={34} strokeWidth={1.6} />
            ))}
          </div>
          <h2 style={{ fontSize: 34, marginBottom: 8 }}>Як вам сервіс?</h2>
          <p className="muted">Що вам сподобалося у нашій компанії, а що варто покращити?</p>
          <div className="mini-metrics">
            <div className="metric-tile"><span className="muted">Середня</span><strong>4.7</strong></div>
            <div className="metric-tile"><span className="muted">Loyalty</span><strong>68</strong></div>
            <div className="metric-tile"><span className="muted">Відгуки</span><strong>124</strong></div>
          </div>
        </section>
      </main>
    </div>
  );
}
