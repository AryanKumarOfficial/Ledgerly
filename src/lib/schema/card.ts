import { z } from "zod";

export const cardSchema = z.object({
  nickname: z.string().min(1, { error: `NickName is required` }),
  cardNumber: z.string().min(1, { error: `Card Number is required` }),
  expirationDate: z.coerce.date({ error: `Invalid Date` }),
  billingCycleDay: z.coerce.number({ error: `Invalid Number` }),
  creditLimit: z.coerce.number({ error: `Invalid Number` }),
  cardBrand: z.string(),
});

export type Card = z.infer<typeof cardSchema>;
