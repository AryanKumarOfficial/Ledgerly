import {
  pgTable,
  uuid,
  timestamp,
  date,
  decimal,
  boolean,
  index,
} from "drizzle-orm/pg-core";
import { card } from "./card";

export const providerGeneratedBill = pgTable(
  "provider_generated_bill",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    cardId: uuid("card_id")
      .notNull()
      .references(() => card.id, { onUpdate: "cascade", onDelete: "cascade" }),
    startDate: date("start_date").notNull(),
    endDate: date(`end_date`).notNull(),
    totalAmount: decimal("total_amount", { precision: 12, scale: 2 }).notNull(),
    minDue: decimal("min_due", { precision: 12, scale: 2 }),
    verifiedMatch: boolean("verified_match").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [index("provider_bill_card_idx").on(table.cardId)],
);
