import { pgTable, varchar, uuid, index } from "drizzle-orm/pg-core";
import { user } from "./user";

export const beneficiary = pgTable(
  "beneficiary",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade", onUpdate: "cascade" }),
    name: varchar("name", { length: 256 }).notNull(),
  },
  (table) => [index("beneficiary_user_idx").on(table.userId)],
);
