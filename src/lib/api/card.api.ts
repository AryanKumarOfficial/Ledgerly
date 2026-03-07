import { DeleteCard, InsertCard, RevealCard } from "@/types/card.type";
import { api } from "./axios";

export const addCard = async (data: InsertCard) => {
  try {
    const res = await api.post("/card", data);
    return res.data;
  } catch (error: any) {
    throw (
      error.response?.data || {
        success: false,
        message: `Something Went wrong`,
      }
    );
  }
};

export const revealCard = async (data: RevealCard) => {
  try {
    const res = await api.post("/card/reveal", data);
    return res.data;
  } catch (error: any) {
    throw (
      error.response?.data || {
        success: false,
        message: `Something Went wrong`,
      }
    );
  }
};

export const getCards = async () => {
  try {
    const res = await api.get("/card");
    return res.data;
  } catch (error: any) {
    throw (
      error.response?.data || {
        success: false,
        message: `Something Went wrong`,
      }
    );
  }
};

export const deleteCard = async (data: DeleteCard) => {
  try {
    const res = await api.delete("/card", { data });
    return res.data;
  } catch (error: any) {
    throw (
      error.response?.data || {
        success: false,
        message: `Something Went wrong`,
      }
    );
  }
};
