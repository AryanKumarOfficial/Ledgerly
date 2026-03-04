import { user } from "@/lib/db/schema";

export interface UpdateProfile {
  fullName?: string;
  phone?: string;
  timezone?: string;
}

export type User = typeof user.$inferSelect;
