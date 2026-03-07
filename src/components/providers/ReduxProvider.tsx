"use client";
import { initializeAuthThunk } from "@/lib/features/auth/authThunks";
import { initializeCardThunk } from "@/lib/features/card/cardThunk";
import { persistor, store } from "@/lib/store";
import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/lib/integration/react";

function InitAuth() {
  useEffect(() => {
    const init = async () => {
      const result = await store.dispatch(initializeAuthThunk());

      if (initializeAuthThunk.fulfilled.match(result)) {
        store.dispatch(initializeCardThunk());
      }
    };
    init();
  }, []);
  return null;
}

export default function ReduxProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <InitAuth />
        {children}
      </PersistGate>
    </Provider>
  );
}
