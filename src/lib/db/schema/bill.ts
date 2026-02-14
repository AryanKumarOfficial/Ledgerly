import {
  pgTable,
  uuid,
  date,
  decimal,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";
import { card } from "./card";

export const billStatusEnum = pgEnum("bill_status", [
  "PENDING",
  `PAID`,
  `PARTIALLY_PAID`,
]);

export const bill = pgTable("bill", {
  id: uuid("id").defaultRandom().primaryKey(),
  cardId: uuid("card_id")
    .notNull()
    .references(() => card.id, { onUpdate: "cascade" }),
  periodStart: date("period_start").notNull(),
  periodEnd: date("period_end").notNull(),
  totalAmount: decimal("total_amount", { precision: 12, scale: 2 }).notNull(),
  minDue: decimal("min_due", { precision: 12, scale: 2 }),
  dueDate: date("due_date").notNull(),
  status: billStatusEnum("status").notNull(),
  paidAmount: decimal("paid_amount", { precision: 12, scale: 2 }).default(
    "0.0",
  ),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date()),
});
