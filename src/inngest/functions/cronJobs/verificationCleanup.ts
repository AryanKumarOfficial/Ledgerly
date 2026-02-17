import { inngest } from "@/inngest/client";
import { db } from "@/lib/db";
import { verificationToken } from "@/lib/db/schema";
import { lt, inArray } from "drizzle-orm";
export const verificationCleanUp = inngest.createFunction(
  { id: `verification-cleanup-cron-job` },
  { cron: `TZ=Asia/Kolkata 30 3 * * *` },
  async ({ step }) => {
    const verificationQueryResult = await step.run(
      `get-expired-verification-records`,
      async () => {
        const verifications = await db.query.verificationToken.findMany({
          where: lt(verificationToken.expiresAt, new Date()),
          limit: 500,
        });

        if (verifications.length === 0) {
          return {
            success: true,
            verifications: [],
            message: `No expired verification tokens found!`,
          };
        }

        const verificationWithIds = verifications.map(
          (verification) => verification.id,
        );

        return {
          success: true,
          verifications: verificationWithIds,
          message: `Successfully fetched expired tokens!`,
        };
      },
    );

    await step.run(`delete-expired-records`, async () => {
      if (!verificationQueryResult.verifications)
        return { success: true, message: `No expired tokens` };
      const { verifications: orphanRecords } = verificationQueryResult;
      await db
        .delete(verificationToken)
        .where(inArray(verificationToken.id, orphanRecords));

      return { success: true, deleted: orphanRecords.length };
    });
  },
);
