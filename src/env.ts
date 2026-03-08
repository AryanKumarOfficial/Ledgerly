import "dotenv/config";
import { envSchema } from "./lib/schema/env";

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Invalid environment variables:");
  console.error(
    `${parsed.error.issues[0].path} : ${parsed.error.issues[0].input} : ${parsed.error.issues[0].message}`,
    console.error(parsed.error.issues[0].input),
  );
  process.exit(1);
}

const env = parsed.data;

console.log(`ENV: `,env)

const baseEnv = {
  hostUrl: env.NEXT_PUBLIC_HOST_URL,
  appName: env.NEXT_PUBLIC_APP_NAME,
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

const systemEnv = {
  cardEncryptionKey: env.CARD_ENCRYPTION_KEY,
};

export { databaseEnv, smtpEnv, baseEnv, systemEnv };
