import {
  date,
  pgTable,
  varchar,
  integer,
  decimal,
  uuid,
  index,
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
    providerId: varchar("provider_id").notNull(),
    billingCycleDay: integer("billing_cycle_day").notNull(),
    creditLimit: decimal("credit_limit").notNull(),
    cardNumberMasked: varchar("credit_number_masked", { length: 4 })
      .notNull()
      .unique(),
    cardBrand: varchar("card_brand", { length: 256 }),
  },
  (table) => [
    index("user_id").on(table.userId),
    index("card_number_masked").on(table.cardNumberMasked),
  ],
);
