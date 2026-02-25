import { card, providerGeneratedBill } from "@/lib/db/schema";

export type CardSelect = typeof card.$inferSelect;
export type ProviderBillSelect = typeof providerGeneratedBill.$inferSelect;

export const cardSafeColumn: Record<
  keyof Omit<CardSelect, "cardNumber">,
  true
> = {
  id: true,
  userId: true,
  cardBrand: true,
  network: true,
  cardNumberMasked: true,
  nickname: true,
  creditLimit: true,
  expirationDate: true,
  billingCycleDay: true,
  createdAt: true,
  updatedAt: true,
};

export const providerBillColumn: Record<keyof ProviderBillSelect, true> = {
  id: true,
  minDue: true,
  startDate: true,
  endDate: true,
  totalAmount: true,
  cardId: true,
  addedBy: true,
  verifiedMatch: true,
  createdAt: true,
  updatedAt: true,
};
