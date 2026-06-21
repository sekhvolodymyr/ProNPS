export type Locale = "uk" | "en";

export function resolveLocale(input?: string | null): Locale {
  return input === "en" ? "en" : "uk";
}

export const copy = {
  uk: {
    createCompany: "Створити компанію",
    login: "Увійти",
    logout: "Вийти",
    submit: "Надіслати",
    optionalContact: "Email або телефон, якщо бажаєте відповідь",
    commentPlaceholder: "Напишіть ваш коментар...",
    consent: "Надсилаючи відгук, ви погоджуєтесь з обробкою даних згідно з Політикою приватності.",
    positiveQuestion: "Що вам сподобалося у нашій компанії, а що варто покращити?",
    negativeQuestion:
      "Що вам не сподобалося при взаємодії з нашою компанією? Що нам потрібно змінити, щоб ви оцінили нас на 5?",
    unavailable: "Ця сторінка тимчасово недоступна",
    notFound: "Сторінку не знайдено",
    thanks: "Дякуємо за ваш відгук",
  },
  en: {
    createCompany: "Create company",
    login: "Log in",
    logout: "Log out",
    submit: "Send",
    optionalContact: "Email or phone if you would like a reply",
    commentPlaceholder: "Write your comment...",
    consent: "By sending feedback, you agree to data processing under the Privacy Policy.",
    positiveQuestion: "What did you like about our company, and what should we improve?",
    negativeQuestion:
      "What did you dislike about your interaction with our company? What should we change for you to rate us 5?",
    unavailable: "This page is temporarily unavailable",
    notFound: "Page not found",
    thanks: "Thank you for your feedback",
  },
} as const;

