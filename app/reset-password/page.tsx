import { resetPasswordAction } from "@/app/actions";
import { ActionForm } from "@/components/forms";
import { Brand } from "@/components/brand";

export default async function ResetPasswordPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token } = await searchParams;
  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <Brand />
        <h1 style={{ fontSize: 38, marginTop: 24 }}>Новий пароль</h1>
        <ActionForm action={resetPasswordAction}>
          <input name="token" type="hidden" value={token ?? ""} />
          <label className="field">Новий пароль<input minLength={8} name="password" required type="password" /></label>
        </ActionForm>
      </div>
    </div>
  );
}

