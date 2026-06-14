import { Brand } from "@/components/brand";

export default function PrivacyPage() {
  return (
    <div className="shell">
      <header className="topbar"><Brand /></header>
      <main className="page" style={{ padding: "40px 0 80px", maxWidth: 820 }}>
        <h1>Політика приватності</h1>
        <p className="lead">ProNPS обробляє дані для збору та передачі відгуків компанії, якій вони адресовані.</p>
        <h2>Які дані збираються</h2>
        <p>Оцінка, коментар, необовʼязковий email або телефон, технічні антиспам-метадані.</p>
        <h2>Для чого</h2>
        <p>Щоб компанія могла аналізувати якість сервісу, бачити метрики лояльності та реагувати на негативні відгуки.</p>
        <h2>Контроль</h2>
        <p>Контакт клієнта не є обовʼязковим. Компанія бачить тільки відгуки, залишені на її сторінці.</p>
      </main>
    </div>
  );
}
