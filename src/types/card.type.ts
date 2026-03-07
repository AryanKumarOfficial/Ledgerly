import { card } from "@/lib/db/schema";

export type Card = typeof card.$inferSelect;
export type SafeCard = Omit<Card, "cardNumber">;

export type InsertCard = Omit<typeof card.$inferInsert, "network">;

export type RevealCard = {
  cardId: string;
  password: string;
};
export type DeleteCard = {
  cardId: string;
  password: string;
};
