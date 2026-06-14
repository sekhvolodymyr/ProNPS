"use client";

import { useActionState } from "react";

type ActionState = { error?: string; success?: string } | undefined;

export function ActionForm({
  action,
  children,
  className = "form",
  encType,
}: {
  action: (state: ActionState, formData: FormData) => Promise<ActionState> | ActionState;
  children: React.ReactNode;
  className?: string;
  encType?: string;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);

  return (
    <form action={formAction} className={className} encType={encType}>
      {state?.error ? <div className="error">{state.error}</div> : null}
      {state?.success ? <div className="success">{state.success}</div> : null}
      {children}
      <SubmitButton pending={pending} />
    </form>
  );
}

export function SubmitButton({ pending, label = "Зберегти" }: { pending?: boolean; label?: string }) {
  return (
    <button className="button" disabled={pending} type="submit">
      {pending ? "Зачекайте..." : label}
    </button>
  );
}

