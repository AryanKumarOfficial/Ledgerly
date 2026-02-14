import { inngest } from "@/inngest/client";
import { sendEmail } from "@/lib/mailer";
import verifyAccountEmail from "@/emails/verifyAccountEmail";
import { baseEnv } from "@/env";
export const sendVerificationEmail = inngest.createFunction(
  {
    id: "send-account-verification",
    retries: 5,
    onFailure: async ({ error }) => {
      console.error("❌ Notification failed:", error);
    },
  },
  { event: `auth/verification.send` },
  async ({ event, step }) => {
    const { email, subject, link, name } = event.data;

    await step.run("send-verification-email", async () => {
      await sendEmail({
        to: email,
        subject,
        template: verifyAccountEmail({
          verifyUrl: link,
          appName: baseEnv.appName,
          name: name,
        }),
      });
    });
    return { success: true, name, sendTo: email, link };
  },
);
