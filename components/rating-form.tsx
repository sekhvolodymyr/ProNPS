"use client";

import { Star } from "lucide-react";
import { useActionState, useMemo, useState } from "react";
import { submitReviewAction } from "@/app/actions";
import { copy, type Locale } from "@/lib/i18n";

export function RatingForm({ slug, locale, source }: { slug: string; locale: Locale; source?: string }) {
  const t = copy[locale];
  const [rating, setRating] = useState(0);
  const [state, formAction, pending] = useActionState(submitReviewAction.bind(null, slug), undefined);
  const question = useMemo(() => (rating >= 4 ? t.positiveQuestion : t.negativeQuestion), [rating, t]);

  return (
    <form action={formAction} className="form">
      {state?.error ? <div className="error">{state.error}</div> : null}
      <input name="rating" type="hidden" value={rating} />
      <input name="source" type="hidden" value={source ?? ""} />
      <input aria-hidden="true" autoComplete="off" name="website" style={{ display: "none" }} tabIndex={-1} />

      <div className="stars" aria-label="Rating">
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            aria-label={`${value} stars`}
            className={`star-button ${value <= rating ? "active" : ""}`}
            key={value}
            onClick={() => setRating(value)}
            type="button"
          >
            <Star fill="currentColor" size={42} strokeWidth={1.5} />
          </button>
        ))}
      </div>

      {rating ? (
        <>
          <label className="field">
            <span>{question}</span>
            <textarea maxLength={1000} minLength={30} name="comment" placeholder={t.commentPlaceholder} required />
          </label>
          <label className="field">
            <span>{t.optionalContact}</span>
            <input name="contact" placeholder="+380... / name@email.com" />
          </label>
          <p className="small">{t.consent} </p>
          <button className="button" disabled={pending} type="submit">
            {pending ? "..." : t.submit}
          </button>
        </>
      ) : null}
    </form>
  );
}

