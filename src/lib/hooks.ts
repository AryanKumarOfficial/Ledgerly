import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./store";
import { cardsAdapter } from "./features/card/cardSlice";

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const {
  selectAll: selectAllCards,
  selectById: selectCardById,
  selectIds: selectCardByIds,
} = cardsAdapter.getSelectors((state: RootState) => state.card);
