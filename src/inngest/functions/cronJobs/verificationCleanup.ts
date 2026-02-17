import { inngest } from "@/inngest/client";
import { db } from "@/lib/db";
import { verificationToken } from "@/lib/db/schema";
import { lt, inArray } from "drizzle-orm";
export const verificationCleanUp = inngest.createFunction(
  { id: `verification-cleanup-cron-job` },
  { cron: `TZ=Asia/Kolkata 30 3 * * *` },
  async ({ step }) => {
    const verificationWithIds = await step.run(
      `fetch-expired-verification-tokens`,
      async () => {
        const verifications = await db.query.verificationToken.findMany({
          where: lt(verificationToken.expiresAt, new Date()),
          limit: 500,
        });

        return verifications.map((verification) => verification.id);
      },
    );

    await step.run(`delete-expired-records`, async () => {
      if (
        !Array.isArray(verificationWithIds) ||
        verificationWithIds.length === 0
      )
        return { success: true, message: `No expired tokens` };
      await db
        .delete(verificationToken)
        .where(inArray(verificationToken.id, verificationWithIds));

      return { success: true, deleted: verificationWithIds.length };
    });
  },
);
