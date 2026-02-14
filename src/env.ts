import "dotenv/config";

const databaseEnv = {
  connectionString: process.env.DATABASE_URL,
};

const smtpEnv = {
  service: process.env.SMTP_SERVICE,
  user: process.env.SMTP_USER,
  password: process.env.SMTP_PASS,
  sender: process.env.SMTP_USER,
};

export { databaseEnv, smtpEnv };
