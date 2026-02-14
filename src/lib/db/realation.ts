import { relations } from "drizzle-orm";
import { user } from "./schema/user";
import { card } from "./schema/card";

export const userRelations = relations(user, ({ many }) => ({
  cards: many(card),
}));

export const cardRelations = relations(card, ({ one }) => ({
  user: one(user, {
    fields: [card.userId],
    references: [user.id],
  }),
}));
