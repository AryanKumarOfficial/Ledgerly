import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { databaseEnv } from "@/env";

const { connectionString } = databaseEnv;

if (!connectionString) {
  throw new Error(`DATABSE_URL is required!`);
}

declare global {
  // eslint-disable-next-line no-var
  var postgreSqlClient: ReturnType<typeof postgres> | undefined;
}

let postgreSqlClient;

if (process.env.NODE_ENV !== "production") {
  if (!global.postgreSqlClient) {
    global.postgreSqlClient = postgres(connectionString);
  }
  postgreSqlClient = global.postgreSqlClient;
} else {
  postgreSqlClient = postgres(connectionString);
}

export const db = drizzle(postgreSqlClient);
