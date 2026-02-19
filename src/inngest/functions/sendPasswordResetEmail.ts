import { inngest } from "@/inngest/client";
import { sendEmail } from "@/lib/mailer";
import ForgotPasswordEmail from "@/emails/ForgotPasswordEmail";
import { baseEnv } from "@/env";

export const sendPasswordResetEmail = inngest.createFunction(
  {
    id: "send-password-reset-email",
    retries: 5,
    rateLimit: {
      limit: 30,
      period: "1h",
    },
    onFailure: async ({ error, event }) => {
      console.error("❌ Password reset email failed:", {
        error,
        email: event?.data?.event?.data?.email,
      });
    },
  },
  { event: "auth/password-reset.send" },
  async ({ event, step }) => {
    const { email, resetLink, name } = event.data;

    await step.run("send-password-reset-email-step", async () => {
      await sendEmail({
        to: email,
        subject: `Reset your ${baseEnv.appName} password`,
        template: ForgotPasswordEmail({
          resetUrl: resetLink,
          appName: baseEnv.appName,
          name: name ?? "there",
        }),
      });
    });

    return {
      success: true,
      sendTo: email,
    };
  },
);
