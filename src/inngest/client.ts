import { Inngest } from "inngest";

export const inngest = new Inngest({
  id: `Ledgerly`,
  isDev: process.env.NODE_ENV !== "production",
});
