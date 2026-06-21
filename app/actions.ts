"use server";

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { ReviewStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { addHours, createToken, hashToken } from "@/lib/crypto";
import { createSession, destroySession, hashPassword, requireAdmin, requireOwnerCompany, verifyPassword } from "@/lib/auth";
import { createUniqueCompanySlug } from "@/lib/slug";
import { loginSchema, passwordResetRequestSchema, registerSchema, resetPasswordSchema, reviewSchema, thankYouSettingsSchema } from "@/lib/validation";
import { rateLimit } from "@/lib/rate-limit";
import { sendNegativeReviewAlert, sendPasswordResetEmail, sendVerificationEmail } from "@/lib/email";
import { databaseUnavailableMessage, getDatabaseSetupError, logServerError } from "@/lib/setup";

function appUrl() {
  return process.env.APP_URL ?? "http://localhost:3000";
}

function formString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

async function saveLogo(file: File | null) {
  if (!file || file.size === 0) return null;

  const allowed = new Map([
    ["image/png", "png"],
    ["image/jpeg", "jpg"],
    ["image/webp", "webp"],
  ]);
  const ext = allowed.get(file.type);
  if (!ext) throw new Error("Unsupported logo format");
  if (file.size > 2 * 1024 * 1024) throw new Error("Logo is too large");

  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadDir, { recursive: true });
  const filename = `${crypto.randomUUID()}.${ext}`;
  await writeFile(path.join(uploadDir, filename), Buffer.from(await file.arrayBuffer()));
  return `/uploads/${filename}`;
}

export async function registerAction(_state: unknown, formData: FormData) {
  const databaseError = getDatabaseSetupError();
  if (databaseError) return { error: databaseError };

  const parsed = registerSchema.safeParse({
    companyName: formString(formData, "companyName"),
    category: formString(formData, "category"),
    website: formString(formData, "website"),
    email: formString(formData, "email"),
    password: formString(formData, "password"),
  });

  if (!parsed.success) return { error: "Перевірте поля реєстрації." };

  const rate = rateLimit(`register:${parsed.data.email}`, 5, 60 * 60 * 1000);
  if (!rate.ok) return { error: "Забагато спроб. Спробуйте пізніше." };

  let logoUrl: string | null = null;
  try {
    const logo = formData.get("logo");
    logoUrl = await saveLogo(logo instanceof File ? logo : null);
  } catch {
    return { error: "Лого має бути PNG, JPG або WEBP до 2 MB." };
  }

  try {
    const existing = await prisma.user.findUnique({ where: { email: parsed.data.email.toLowerCase() } });
    if (existing) return { error: "Користувач з таким email вже існує." };

    const passwordHash = await hashPassword(parsed.data.password);
    const slug = await createUniqueCompanySlug(parsed.data.companyName);

    const user = await prisma.user.create({
      data: {
        email: parsed.data.email.toLowerCase(),
        passwordHash,
        company: {
          create: {
            name: parsed.data.companyName,
            category: parsed.data.category,
            website: parsed.data.website || null,
            slug,
            logoUrl,
            thankYouSettings: {
              create: {
                title: "Дякуємо за ваш відгук",
                message: "Ми цінуємо вашу думку і використаємо її, щоб стати кращими.",
                bonusEnabled: true,
                bonusText: "Покажіть цю сторінку команді компанії, щоб отримати бонус.",
                promoCode: "THANKYOU",
                buttonLabel: "Перейти на сайт",
                buttonUrl: parsed.data.website || null,
              },
            },
          },
        },
      },
    });

    const token = createToken();
    await prisma.emailVerificationToken.create({
      data: { userId: user.id, tokenHash: hashToken(token), expiresAt: addHours(new Date(), 24) },
    });
    await sendVerificationEmail(user.email, `${appUrl()}/verify-email?token=${token}`);
    await createSession(user.id);
  } catch (error) {
    logServerError("registerAction", error);
    return { error: databaseUnavailableMessage };
  }

  redirect("/dashboard");
}

export async function loginAction(_state: unknown, formData: FormData) {
  const databaseError = getDatabaseSetupError();
  if (databaseError) return { error: databaseError };

  const parsed = loginSchema.safeParse({
    email: formString(formData, "email"),
    password: formString(formData, "password"),
  });
  if (!parsed.success) return { error: "Невірний email або пароль." };

  const rate = rateLimit(`login:${parsed.data.email}`, 10, 15 * 60 * 1000);
  if (!rate.ok) return { error: "Забагато спроб входу. Спробуйте пізніше." };

  let userRole: "OWNER" | "ADMIN" = "OWNER";
  try {
    const user = await prisma.user.findUnique({ where: { email: parsed.data.email.toLowerCase() } });
    if (!user || !(await verifyPassword(parsed.data.password, user.passwordHash))) {
      return { error: "Невірний email або пароль." };
    }

    await createSession(user.id);
    userRole = user.role;
  } catch (error) {
    logServerError("loginAction", error);
    return { error: databaseUnavailableMessage };
  }

  redirect(userRole === "ADMIN" ? "/admin" : "/dashboard");
}

export async function logoutAction() {
  await destroySession();
  redirect("/");
}

export async function resendVerificationAction() {
  if (getDatabaseSetupError()) return;

  const { user } = await requireOwnerCompany();
  if (user.emailVerifiedAt) return;
  const token = createToken();
  await prisma.emailVerificationToken.create({
    data: { userId: user.id, tokenHash: hashToken(token), expiresAt: addHours(new Date(), 24) },
  });
  await sendVerificationEmail(user.email, `${appUrl()}/verify-email?token=${token}`);
  revalidatePath("/dashboard");
}

export async function submitReviewAction(slug: string, _state: unknown, formData: FormData) {
  const databaseError = getDatabaseSetupError();
  if (databaseError) return { error: databaseError };

  const parsed = reviewSchema.safeParse({
    rating: formString(formData, "rating"),
    comment: formString(formData, "comment"),
    contact: formString(formData, "contact"),
    source: formString(formData, "source"),
    website: formString(formData, "website"),
  });

  if (!parsed.success) return { error: "Оберіть оцінку та напишіть коментар від 30 до 1000 символів." };
  if (parsed.data.website) return { error: "Спробуйте ще раз." };

  const headerStore = await headers();
  const ip = headerStore.get("x-forwarded-for")?.split(",")[0] ?? "local";
  const rate = rateLimit(`review:${slug}:${ip}`, 3, 10 * 60 * 1000);
  if (!rate.ok) return { error: "Забагато відгуків. Спробуйте пізніше." };

  try {
    const company = await prisma.company.findUnique({
      where: { slug },
      include: { owner: true },
    });
    if (!company || company.status === "disabled") return { error: "Сторінка недоступна." };

    const review = await prisma.review.create({
      data: {
        companyId: company.id,
        rating: parsed.data.rating,
        comment: parsed.data.comment,
        contact: parsed.data.contact || null,
        source: parsed.data.source || null,
        metadata: {
          ipHash: hashToken(ip),
          userAgent: headerStore.get("user-agent"),
          locale: headerStore.get("accept-language"),
        },
      },
    });

    if (review.rating <= 3 && company.negativeAlertEnabled && company.owner.emailVerifiedAt) {
      await sendNegativeReviewAlert(company.owner.email, company.name, review.rating, review.comment);
    }
  } catch (error) {
    logServerError("submitReviewAction", error);
    return { error: databaseUnavailableMessage };
  }

  redirect(`/r/${slug}/thanks`);
}

export async function updateSettingsAction(_state: unknown, formData: FormData) {
  const databaseError = getDatabaseSetupError();
  if (databaseError) return { error: databaseError };

  const { company } = await requireOwnerCompany();
  const parsed = thankYouSettingsSchema.safeParse({
    title: formString(formData, "title"),
    message: formString(formData, "message"),
    bonusEnabled: formData.get("bonusEnabled") === "on",
    bonusText: formString(formData, "bonusText"),
    promoCode: formString(formData, "promoCode"),
    buttonLabel: formString(formData, "buttonLabel"),
    buttonUrl: formString(formData, "buttonUrl"),
    negativeAlertEnabled: formData.get("negativeAlertEnabled") === "on",
  });
  if (!parsed.success) return { error: "Перевірте налаштування." };

  await prisma.company.update({
    where: { id: company.id },
    data: { negativeAlertEnabled: parsed.data.negativeAlertEnabled },
  });

  await prisma.thankYouSettings.upsert({
    where: { companyId: company.id },
    update: {
      title: parsed.data.title,
      message: parsed.data.message,
      bonusEnabled: parsed.data.bonusEnabled,
      bonusText: parsed.data.bonusText || null,
      promoCode: parsed.data.promoCode || null,
      buttonLabel: parsed.data.buttonLabel || null,
      buttonUrl: parsed.data.buttonUrl || null,
    },
    create: {
      companyId: company.id,
      title: parsed.data.title,
      message: parsed.data.message,
      bonusEnabled: parsed.data.bonusEnabled,
      bonusText: parsed.data.bonusText || null,
      promoCode: parsed.data.promoCode || null,
      buttonLabel: parsed.data.buttonLabel || null,
      buttonUrl: parsed.data.buttonUrl || null,
    },
  });

  revalidatePath("/dashboard/settings");
  revalidatePath(`/r/${company.slug}/thanks`);
  return { success: "Налаштування збережено." };
}

export async function archiveReviewAction(reviewId: string) {
  if (getDatabaseSetupError()) return;

  const { company } = await requireOwnerCompany();
  await prisma.review.updateMany({
    where: { id: reviewId, companyId: company.id },
    data: { status: ReviewStatus.archived },
  });
  revalidatePath("/dashboard/reviews");
}

export async function requestPasswordResetAction(_state: unknown, formData: FormData) {
  const databaseError = getDatabaseSetupError();
  if (databaseError) return { error: databaseError };

  const parsed = passwordResetRequestSchema.safeParse({ email: formString(formData, "email") });
  if (!parsed.success) return { error: "Вкажіть коректний email." };
  const user = await prisma.user.findUnique({ where: { email: parsed.data.email.toLowerCase() } });
  if (user) {
    const token = createToken();
    await prisma.passwordResetToken.create({
      data: { userId: user.id, tokenHash: hashToken(token), expiresAt: addHours(new Date(), 2) },
    });
    await sendPasswordResetEmail(user.email, `${appUrl()}/reset-password?token=${token}`);
  }
  return { success: "Якщо email існує, ми надіслали посилання для відновлення." };
}

export async function resetPasswordAction(_state: unknown, formData: FormData) {
  const databaseError = getDatabaseSetupError();
  if (databaseError) return { error: databaseError };

  const parsed = resetPasswordSchema.safeParse({
    token: formString(formData, "token"),
    password: formString(formData, "password"),
  });
  if (!parsed.success) return { error: "Посилання недійсне або пароль закороткий." };

  const token = await prisma.passwordResetToken.findUnique({
    where: { tokenHash: hashToken(parsed.data.token) },
  });
  if (!token || token.usedAt || token.expiresAt < new Date()) return { error: "Посилання недійсне або прострочене." };

  await prisma.$transaction([
    prisma.user.update({ where: { id: token.userId }, data: { passwordHash: await hashPassword(parsed.data.password) } }),
    prisma.passwordResetToken.update({ where: { id: token.id }, data: { usedAt: new Date() } }),
    prisma.session.deleteMany({ where: { userId: token.userId } }),
  ]);

  redirect("/login");
}

export async function disableCompanyAction(companyId: string) {
  if (getDatabaseSetupError()) return;

  await requireAdmin();
  await prisma.company.update({ where: { id: companyId }, data: { status: "disabled" } });
  revalidatePath("/admin");
}

export async function enableCompanyAction(companyId: string) {
  if (getDatabaseSetupError()) return;

  await requireAdmin();
  await prisma.company.update({ where: { id: companyId }, data: { status: "active" } });
  revalidatePath("/admin");
}
