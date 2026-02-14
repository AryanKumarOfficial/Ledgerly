import "dotenv/config";

const baseEnv = {
  hostUrl: process.env.HOST_URL || `http://localhost:3000`,
  appName: process.env.APP_NAME || "Ledegerly",
};

const databaseEnv = {
  connectionString: process.env.DATABASE_URL,
};

const smtpEnv = {
  service: process.env.SMTP_SERVICE,
  user: process.env.SMTP_USER,
  password: process.env.SMTP_PASS,
  sender: process.env.SMTP_USER,
};

export { databaseEnv, smtpEnv, baseEnv };
