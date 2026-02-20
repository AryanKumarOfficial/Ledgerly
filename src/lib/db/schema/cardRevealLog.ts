import { pgTable, timestamp, uuid, index, varchar } from "drizzle-orm/pg-core";
import { user } from "./user";
import { card } from "./card";

export const cardRevealLog = pgTable(
  "card_reveal_log",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    cardId: uuid("card_id")
      .notNull()
      .references(() => card.id, { onDelete: "cascade" }),
    ipAddress: varchar("ip_address", { length: 45 }),
    userAgent: varchar("user_agent", { length: 512 }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("reveal_user_idx").on(table.userId),
    index("reveal_card_idx").on(table.cardId),
    index("reveal_time_idx").on(table.createdAt),
  ],
);
