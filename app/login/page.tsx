import Link from "next/link";
import { loginAction } from "@/app/actions";
import { Brand } from "@/components/brand";
import { ActionForm } from "@/components/forms";

export default function LoginPage() {
  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <Brand />
        <h1 style={{ fontSize: 42, marginTop: 24 }}>Вхід</h1>
        <ActionForm action={loginAction}>
          <label className="field">Email<input name="email" required type="email" /></label>
          <label className="field">Пароль<input name="password" required type="password" /></label>
        </ActionForm>
        <p className="small"><Link href="/forgot-password">Забули пароль?</Link> · <Link href="/register">Створити компанію</Link></p>
      </div>
    </div>
  );
}

