import { relations } from "drizzle-orm";
import {
  user,
  card,
  transaction,
  category,
  bill,
  notification,
  providerGeneratedBill,
  beneficiary,
  verificationToken,
  session,
  cardRevealLog,
} from "@/lib/db/schema";

export const userRelations = relations(user, ({ many }) => ({
  cards: many(card),
  transactions: many(transaction),
  notifications: many(notification),
  beneficiaries: many(beneficiary),
  sessions: many(session),
  cardRevealLogs: many(cardRevealLog),
  beneficiariesOwned: many(beneficiary, {
    relationName: "owner",
  }),
  beneficiariesProvided: many(beneficiary, {
    relationName: "provider",
  }),
  providersBillAdded: many(providerGeneratedBill, {
    relationName: "providerBillAddedBy",
  }),
}));

export const cardRelations = relations(card, ({ one, many }) => ({
  user: one(user, {
    fields: [card.userId],
    references: [user.id],
  }),
  transactions: many(transaction),
  bills: many(bill),
  providerBills: many(providerGeneratedBill),
  revealLogs: many(cardRevealLog),
}));

export const transactionRelations = relations(transaction, ({ one }) => ({
  category: one(category, {
    fields: [transaction.categoryId],
    references: [category.id],
  }),
  beneficiary: one(beneficiary, {
    fields: [transaction.beneficiaryId],
    references: [beneficiary.id],
  }),
  card: one(card, {
    fields: [transaction.cardId],
    references: [card.id],
  }),
  user: one(user, {
    fields: [transaction.createdByUserId],
    references: [user.id],
  }),
}));

export const categoryRelations = relations(category, ({ many }) => ({
  transactions: many(transaction),
}));

export const billRelations = relations(bill, ({ one }) => ({
  card: one(card, {
    fields: [bill.cardId],
    references: [card.id],
  }),
}));

export const providerBillRelations = relations(
  providerGeneratedBill,
  ({ one }) => ({
    card: one(card, {
      fields: [providerGeneratedBill.cardId],
      references: [card.id],
    }),
    addedByUser: one(user, {
      fields: [providerGeneratedBill.addedBy],
      references: [user.id],
      relationName: "providerBillAddedBy",
    }),
  }),
);

export const notificationRelations = relations(notification, ({ one }) => ({
  user: one(user, {
    fields: [notification.userId],
    references: [user.id],
  }),
}));

export const beneficiaryRelations = relations(beneficiary, ({ one, many }) => ({
  owner: one(user, {
    fields: [beneficiary.userId],
    references: [user.id],
    relationName: "owner",
  }),
  provider: one(user, {
    fields: [beneficiary.providerId],
    references: [user.id],
    relationName: "provider",
  }),
  transactions: many(transaction),
}));

export const verificationRelations = relations(
  verificationToken,
  ({ one }) => ({
    user: one(user, {
      fields: [verificationToken.userId],
      references: [user.id],
    }),
  }),
);

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const cardRevealLogRelations = relations(cardRevealLog, ({ one }) => ({
  user: one(user, {
    fields: [cardRevealLog.userId],
    references: [user.id],
  }),
  card: one(card, {
    fields: [cardRevealLog.cardId],
    references: [card.id],
  }),
}));
