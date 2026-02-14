import {
  date,
  pgTable,
  varchar,
  integer,
  decimal,
  uuid,
  index,
  timestamp,
} from "drizzle-orm/pg-core";
import { user } from "./user";

export const card = pgTable(
  "card",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade", onUpdate: "cascade" }),
    nickname: varchar("nick_name", { length: 256 }).notNull(),
    expirationDate: date("expiration_date").notNull(),
    billingCycleDay: integer("billing_cycle_day").notNull(),
    creditLimit: decimal("credit_limit").notNull(),
    cardNumberMasked: varchar("credit_number_masked", { length: 4 })
      .notNull()
      .unique(),
    cardBrand: varchar("card_brand", { length: 256 }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("card_user_idx").on(table.userId),
    index("card_mask_idx").on(table.cardNumberMasked),
  ],
);
