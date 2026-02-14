import { inngest } from "@/inngest/client";
import { sendEmail } from "@/lib/mailer";
import SendWelcomeEmail from "@/emails/SendWelcomeEmail";
import { baseEnv } from "@/env";
export const sendWelcomeEmail = inngest.createFunction(
  {
    id: "send-welcome-email",
    retries: 5,
    onFailure: async ({ error }) => {
      console.error("❌ Notification failed:", error);
    },
  },
  { event: `auth/welcome.send` },
  async ({ event, step }) => {
    const { email, subject, name } = event.data;

    await step.run("send-welcome-email", async () => {
      await sendEmail({
        to: email,
        subject,
        template: SendWelcomeEmail({
          appName: baseEnv.appName,
          name: name,
          dashboardUrl: `${baseEnv.hostUrl}/dashboard`,
        }),
      });
    });
    return { success: true, name, sendTo: email };
  },
);
