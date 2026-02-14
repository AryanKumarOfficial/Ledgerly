import { relations } from "drizzle-orm";
import { card, category, transaction, user } from "@/lib/db/schema";
import { beneficiary } from "./schema/beneficiary";

export const userRelations = relations(user, ({ many, one }) => ({
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

export const transactionRelations = relations(transaction, ({ many, one }) => ({
  category: one(category, {
    fields: [transaction.categoryId],
    references: [category.id],
  }),
  beneficiary: one(beneficiary, {
    fields: [transaction.beneficiaryId],
    references: [beneficiary.id],
  }),
}));

export const categoryRelations = relations(category, ({ many }) => ({
  transactions: many(category),
}));
