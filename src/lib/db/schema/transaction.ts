import {
  varchar,
  decimal,
  text,
  boolean,
  date,
  timestamp,
  pgTable,
  uuid,
} from "drizzle-orm/pg-core";
import { user, card, category } from "./index";

export const transaction = pgTable("transaction", {
  id: uuid("id").defaultRandom().primaryKey(),
  beneficiaryId: uuid("beneficiary_id").notNull(),
  createdByUserId: uuid("created_by_user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  cardId: uuid("card_id")
    .notNull()
    .references(() => card.id, { onDelete: "cascade" }),
  merchantName: varchar("merchant_name", { length: 256 }),
  amount: decimal(),
  cashback: decimal(),
  title: varchar("title", { length: 256 }).notNull(),
  description: text("description"),
  categoryId: uuid("category_id")
    .notNull()
    .references(() => category.id, {
      onDelete: "restrict",
      onUpdate: "cascade",
    }),
  type: varchar("type", { length: 256 }),
  isVerified: boolean().default(false),
  transactionDate: date().defaultNow(),
  receiptUrl: varchar("receipt_url"),
  receiptId: varchar("receipt_url"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});
