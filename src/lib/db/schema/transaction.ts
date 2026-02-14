import {
  varchar,
  decimal,
  text,
  boolean,
  date,
  timestamp,
  pgTable,
  uuid,
  index,
} from "drizzle-orm/pg-core";
import { user, card, category } from "./index";
import { beneficiary } from "./beneficiary";

export const transaction = pgTable(
  "transaction",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    beneficiaryId: uuid("beneficiary_id")
      .notNull()
      .references(() => beneficiary.id),
    createdByUserId: uuid("created_by_user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    cardId: uuid("card_id")
      .notNull()
      .references(() => card.id, { onDelete: "cascade" }),
    merchantName: varchar("merchant_name", { length: 256 }),
    amount: decimal("amount", { precision: 12, scale: 2 }),
    cashback: decimal("cashback", { precision: 12, scale: 2 }),
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
    transactionDate: timestamp("transaction_date").defaultNow(),
    receiptUrl: varchar("receipt_url"),
    receiptId: varchar("receipt_id"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("txn_user_idx").on(table.createdByUserId),
    index("txn_card_idx").on(table.cardId),
    index("txn_category_idx").on(table.categoryId),
    index("txn_date_idx").on(table.transactionDate),
  ],
);
