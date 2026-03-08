import { addCard, getCards, deleteCard } from "@/lib/api/card.api";
import { CardFormData } from "@/lib/schema/card";
import { DeleteCard, InsertCard } from "@/types/card.type";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const initializeCardThunk = createAsyncThunk(
  "card/init",
  async (_, { rejectWithValue }) => {
    try {
      const data = await getCards();
      if (!data) return null;
      return data.cards;
    } catch {
      return rejectWithValue(`Initialization failed`);
    }
  },
);

export const addCardThunk = createAsyncThunk(
  "card/add",
  async (data: CardFormData, { rejectWithValue }) => {
    try {
      const apiData: InsertCard = {
        ...data,
        expirationDate: parseExpirationDate(data.expirationDate),
      };
      const res = await addCard(apiData);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data.message || `Failed to Add Card`,
      );
    }
  },
);

export const deleteCardThunk = createAsyncThunk(
  `card/delete`,
  async (data: DeleteCard, { rejectWithValue }) => {
    try {
      await deleteCard(data);
      return data.cardId;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || `Failed to Delete Card`,
      );
    }
  },
);

export function parseExpirationDate(expiry: string): Date {
  const [month, year] = expiry.split("/");
  const fullYear = 2000 + parseInt(year);
  return new Date(fullYear, parseInt(month) - 1);
}
