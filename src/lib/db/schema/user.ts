import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  index,
  boolean,
} from "drizzle-orm/pg-core";

export const user = pgTable(
  "user",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 256 }).notNull(),
    email: varchar("email").unique().notNull(),
    password: varchar("password").notNull(),
    isVerified: boolean("is_verified").default(false).notNull(),
    phone: varchar("phone", { length: 15 }).unique().notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
    timezone: varchar("timezone", { length: 64 }).notNull().default("UTC"),
  },
  (table) => [
    index("email_idx").on(table.email),
    index("phone_idx").on(table.phone),
  ],
);
