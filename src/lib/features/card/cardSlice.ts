import { SafeCard } from "@/types/card.type";
import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import {
  addCardThunk,
  initializeCardThunk,
  deleteCardThunk,
} from "./cardThunk";

interface CardState {
  loading: boolean;
  isInitializing: boolean;
  error: string | null;
}

export const cardsAdapter = createEntityAdapter<SafeCard>({
  sortComparer: (a, b) => a.nickname.localeCompare(b.nickname),
});
const initialState = cardsAdapter.getInitialState<CardState>({
  loading: false,
  isInitializing: true,
  error: null,
});

const cardSlice = createSlice({
  name: "card",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initializeCardThunk.pending, (state) => {
        state.isInitializing = true;
        state.error = null;
      })
      .addCase(initializeCardThunk.fulfilled, (state, action) => {
        state.isInitializing = false;
        cardsAdapter.setAll(state, action.payload ?? []);
      })
      .addCase(initializeCardThunk.rejected, (state) => {
        state.isInitializing = false;
        cardsAdapter.removeAll(state);
      })
      .addCase(addCardThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addCardThunk.fulfilled, (state, action) => {
        state.loading = false;
        cardsAdapter.addOne(state, action.payload);
      })
      .addCase(addCardThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteCardThunk.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(deleteCardThunk.fulfilled, (state, action) => {
        state.loading = false;
        cardsAdapter.removeOne(state, action.payload);
      })
      .addCase(deleteCardThunk.rejected, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.error = action.payload as string;
        }
      });
  },
});

export const { clearError } = cardSlice.actions;
export default cardSlice.reducer;