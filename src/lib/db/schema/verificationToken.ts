import {
  pgTable,
  uuid,
  timestamp,
  varchar,
  pgEnum,
  index,
} from "drizzle-orm/pg-core";
import { user } from "./user";

export const VerificationTypeEnum = pgEnum("verification_type", [
  "EMAIL_VERIFY",
  "PASSEORD_RESET",
  "MAGIL_LINK",
]);

export const verificationToken = pgTable(
  "verification_token",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    tokenHash: varchar("token_hash", { length: 255 }).notNull(),
    type: VerificationTypeEnum("type").notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("verification_user_idx").on(table.userId),
    index("verification_expiry_idx").on(table.expiresAt),
  ],
);
