import { inngest } from "@/inngest/client";
import { serve } from "inngest/next";
import { sendVerificationEmail } from "@/inngest/functions/sendVerificationEmail";
import { sendWelcomeEmail } from "@/inngest/functions/sendWelcomeEmail";
import { verificationCleanUp } from "@/inngest/functions/cronJobs/verificationCleanup";
import { sessionCleanup } from "@/inngest/functions/cronJobs/sessionCleanup";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    sendVerificationEmail,
    sendWelcomeEmail,
    verificationCleanUp,
    sessionCleanup,
  ],
});
