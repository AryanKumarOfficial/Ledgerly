import { z } from "zod";

export const cardSchema = z.object({
  nickname: z.string().min(1, { error: `NickName is required` }),
  cardNumber: z.string().min(1, { error: `Card Number is required` }),
  expirationDate: z
    .string()
    .regex(/^\d{2}\s*\/\s*\d{2}$/, "Invalid expiration date format (MM/YY)")
    .transform((val) => val.replace(/\s/g, "")),
  billingCycleDay: z.number().int().min(1).max(31),
  creditLimit: z.number().min(1000000),
  cardBrand: z.string(),
});

export type CardFormData = z.infer<typeof cardSchema>;
export type CardInput = z.input<typeof cardSchema>;
