import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  index,
  pgEnum,
  jsonb,
} from "drizzle-orm/pg-core";
import { user } from "./user";

export const notificationStatusEnum = pgEnum("notification_status", [
  "PENDING",
  "SENT",
  "FAILED",
  "READ",
]);

export const notificationTypeEnum = pgEnum("notification_type", [
  "SYSTEM",
  "BILL_REMINDER",
  "PAYMENT",
  "ALERT",
]);

export const notification = pgTable(
  "notification",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => user.id, { onUpdate: "cascade", onDelete: "cascade" }),
    event: varchar("event", { length: 512 }).notNull(),
    status: notificationStatusEnum("status").notNull(),
    type: notificationTypeEnum("type").notNull(),
    payload: jsonb("payload"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [index("notification_user_idx").on(table.userId)],
);
