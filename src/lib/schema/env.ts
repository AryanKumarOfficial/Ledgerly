import { z } from "zod";

export const envSchema = z.object({
  NEXT_PUBLIC_HOST_URL: z.url(),
  NEXT_PUBLIC_APP_NAME: z.string().min(1),

  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),

  SMTP_SERVICE: z.string().min(1),
  SMTP_USER: z.email({ error: `Invalid Email` }),
  SMTP_PASS: z.string().min(1),

  CARD_ENCRYPTION_KEY: z.string().min(1),
});
