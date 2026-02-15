import { z } from "zod";

export const envSchema = z.object({
  HOST_URL: z.url(),
  APP_NAME: z.string().min(1),

  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),

  SMTP_SERVICE: z.string().min(1),
  SMTP_USER: z.email({ error: `Invalid Email` }),
  SMTP_PASS: z.string().min(1),
});
