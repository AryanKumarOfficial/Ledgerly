import { inngest } from "@/inngest/client";
import { db } from "@/lib/db";
import { session } from "@/lib/db/schema";
import { lt, inArray, asc } from "drizzle-orm";
export const sessionCleanup = inngest.createFunction(
  { id: `session-cleanup-cron-job` },
  { cron: `TZ=Asia/Kolkata 30 3 * * *` },
  async ({ step }) => {
    const expiredIds = await step.run(`fetch-expired-sessions`, async () => {
      const sessions = await db.query.session.findMany({
        where: lt(session.expiresAt, new Date()),
        limit: 500,
        orderBy: asc(session.expiresAt),
      });
      return sessions.map((s) => s.id);
    });

    await step.run(`delete-expired-sessions`, async () => {
      if (!Array.isArray(expiredIds) || !expiredIds?.length)
        return { success: true, message: `No expired sessions` };
      await db.delete(session).where(inArray(session.id, expiredIds));

      return { success: true, deleted: expiredIds.length };
    });
  },
);
