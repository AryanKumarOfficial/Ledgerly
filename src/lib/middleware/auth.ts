import { cookies } from "next/headers";
import { db } from "../db";
import { and, eq, gt } from "drizzle-orm";
import { session, user } from "../db/schema";

export const getCurrentUser = async () => {
  const token = (await cookies()).get("session")?.value;
  if (!token) return null;
  const dbSession = await db.query.session.findFirst({
    where: and(eq(session?.token, token), gt(session.expiresAt, new Date())),
  });
  if (!dbSession) return null;

  const dbUser = await db.query.user.findFirst({
    where: eq(user?.id, dbSession.userId),
    columns: {
      password: false,
    },
  });

  return dbUser || null;
};
