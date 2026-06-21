import { z } from "zod";

export const registerSchema = z.object({
  companyName: z.string().trim().min(2).max(80),
  category: z.string().trim().min(2).max(80),
  website: z.string().trim().url().optional().or(z.literal("")),
  email: z.string().trim().email().max(120),
  password: z.string().min(8).max(100),
});

export const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
});

export const reviewSchema = z.object({
  rating: z.coerce.number().int().min(1).max(5),
  comment: z.string().trim().min(30).max(1000),
  contact: z.string().trim().max(120).optional(),
  source: z.string().trim().max(40).optional(),
  website: z.string().max(0).optional(),
});

export const thankYouSettingsSchema = z.object({
  title: z.string().trim().min(2).max(120),
  message: z.string().trim().min(2).max(500),
  bonusEnabled: z.coerce.boolean().default(false),
  bonusText: z.string().trim().max(500).optional(),
  promoCode: z.string().trim().max(80).optional(),
  buttonLabel: z.string().trim().max(80).optional(),
  buttonUrl: z.string().trim().url().optional().or(z.literal("")),
  negativeAlertEnabled: z.coerce.boolean().default(false),
});

export const passwordResetRequestSchema = z.object({
  email: z.string().trim().email(),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(20),
  password: z.string().min(8).max(100),
});

