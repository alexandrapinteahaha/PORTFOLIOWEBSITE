import { z } from "zod";

export const newsletterSchema = z.object({
  email: z.string().email(),
  consent: z.literal("on")
});

export const commissionSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  phone: z.string().max(80).optional(),
  commissionType: z.string().min(2).max(120),
  budgetRange: z.string().min(2).max(80),
  timeframe: z.string().min(2).max(80),
  message: z.string().min(20).max(3000),
  website: z.string().max(0).optional()
});

export const checkoutSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().min(1).max(10).default(1)
});
