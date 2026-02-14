import { relations } from "drizzle-orm";
import { user } from "./schema/user";
import { card } from "./schema/card";
import { transaction } from "./schema/transaction";

export const userRelations = relations(user, ({ many }) => ({
  cards: many(card),
  transactions: many(transaction),
}));

export const cardRelations = relations(card, ({ one, many }) => ({
  user: one(user, {
    fields: [card.userId],
    references: [user.id],
  }),
  transactions: many(transaction),
}));
