"use client";
import { initializeAuthThunk } from "@/lib/features/auth/authThunks";
import { store } from "@/lib/store";
import React, { useEffect } from "react";
import { Provider } from "react-redux";

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
      <InitAuth />
      {children}
    </Provider>
  );
}
