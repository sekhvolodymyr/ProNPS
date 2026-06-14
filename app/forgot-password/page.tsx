import { requestPasswordResetAction } from "@/app/actions";
import { ActionForm } from "@/components/forms";
import { Brand } from "@/components/brand";

export default function ForgotPasswordPage() {
  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <Brand />
        <h1 style={{ fontSize: 38, marginTop: 24 }}>Відновлення пароля</h1>
        <ActionForm action={requestPasswordResetAction}>
          <label className="field">Email<input name="email" required type="email" /></label>
        </ActionForm>
      </div>
    </div>
  );
}

