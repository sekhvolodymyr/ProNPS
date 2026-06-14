import Link from "next/link";
import { ActionForm } from "@/components/forms";
import { Brand } from "@/components/brand";
import { registerAction } from "@/app/actions";
import { databaseSetupMessage, isDatabaseConfigured } from "@/lib/setup";

export default function RegisterPage() {
  const dbReady = isDatabaseConfigured();

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <Brand />
        <h1 style={{ fontSize: 42, marginTop: 24 }}>Реєстрація компанії</h1>
        <p className="muted">Створіть кабінет, отримайте посилання та QR-код для збору відгуків.</p>
        {!dbReady ? <div className="error">{databaseSetupMessage}</div> : null}
        <ActionForm action={registerAction} encType="multipart/form-data">
          <label className="field">Назва компанії<input name="companyName" required /></label>
          <label className="field">Категорія<input name="category" placeholder="Клініка, салон, ресторан..." required /></label>
          <label className="field">Сайт<input name="website" placeholder="https://example.com" /></label>
          <label className="field">Лого PNG/JPG/WEBP до 2 MB<input accept="image/png,image/jpeg,image/webp" name="logo" type="file" /></label>
          <label className="field">Email власника<input name="email" required type="email" /></label>
          <label className="field">Пароль<input minLength={8} name="password" required type="password" /></label>
        </ActionForm>
        <p className="small">Вже є акаунт? <Link href="/login">Увійти</Link></p>
      </div>
    </div>
  );
}
