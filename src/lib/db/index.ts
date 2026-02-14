import * as relations from "@/lib/db/realation";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { databaseEnv } from "@/env";
import * as schema from "@/lib/db/schema";
const { connectionString } = databaseEnv;

if (!connectionString) {
  throw new Error(`DATABSE_URL is required!`);
}

declare global {
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

export const db = drizzle(postgreSqlClient, {
  schema: { ...schema, ...relations },
});
