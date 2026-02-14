import "dotenv/config";
import { envSchema } from "./lib/schema/env";
import z from "zod";

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Invalid environment variables:");
  console.error(z.treeifyError(parsed.error));
  process.exit(1);
}

const env = parsed.data;

const baseEnv = {
  hostUrl: env.HOST_URL,
  appName: env.APP_NAME,
};

const databaseEnv = {
  connectionString: env.DATABASE_URL,
};

const smtpEnv = {
  service: env.SMTP_SERVICE,
  user: env.SMTP_USER,
  password: env.SMTP_PASS,
  sender: env.SMTP_USER,
};

export { databaseEnv, smtpEnv, baseEnv };
