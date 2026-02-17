"use client";
import React from "react";
import { ThemeProvider } from "./theme-provider";
import { Toaster } from "sonner";
import ReduxProvider from "./ReduxProvider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider>
      <ThemeProvider attribute={"class"} defaultTheme="system" enableSystem>
        <Toaster position="top-right" />
        {children}
      </ThemeProvider>
    </ReduxProvider>
  );
}
