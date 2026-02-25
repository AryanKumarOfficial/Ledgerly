import {
  pgTable,
  varchar,
  uuid,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { user } from "./user";
import { card } from "./card";

export const beneficiary = pgTable(
  "beneficiary",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade", onUpdate: "cascade" }),
    name: varchar("name", { length: 256 }).notNull(),
    providerId: uuid("provider_id")
      .notNull()
      .references(() => user.id),
    cardId: uuid("card_id")
      .notNull()
      .references(() => card.id, { onDelete: "cascade" }),
  },
  (table) => [
    index("beneficiary_user_idx").on(table.userId),
    index("benficiary_card_idx").on(table.cardId),
    index("benficiary_provider_idx").on(table.providerId),
    uniqueIndex("provider_user_card_unique").on(
      table.providerId,
      table.userId,
      table.cardId,
    ),
  ],
);
