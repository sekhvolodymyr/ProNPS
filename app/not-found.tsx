import Link from "next/link";

export default function NotFound() {
  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <h1 style={{ fontSize: 38 }}>Сторінку не знайдено</h1>
        <p className="muted">Перевірте посилання або поверніться на головну.</p>
        <Link className="button" href="/">На головну</Link>
      </div>
    </div>
  );
}
