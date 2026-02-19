"use client";
import { initializeAuthThunk } from "@/lib/features/auth/authThunks";
import { persistor, store } from "@/lib/store";
import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/lib/integration/react";

function InitAuth() {
  useEffect(() => {
    store.dispatch(initializeAuthThunk());
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
