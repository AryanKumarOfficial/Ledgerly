import {
  pgTable,
  varchar,
  uuid,
  timestamp,
  boolean,
} from "drizzle-orm/pg-core";

export const category = pgTable("category", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  icon: varchar("icon", { length: 256 }),
  color: varchar("color").default("#000"),
  isSystem: boolean().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});
