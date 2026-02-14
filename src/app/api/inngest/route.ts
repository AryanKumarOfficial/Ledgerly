import { inngest } from "@/inngest/client";
import { serve } from "inngest/next";
import { sendVerificationEmail } from "./functions/sendVerificationEmail";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [sendVerificationEmail],
});
