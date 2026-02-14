import "dotenv/config";

const databaseEnv = {
  connectionString: process.env.DATABASE_URL,
};

export { databaseEnv };
