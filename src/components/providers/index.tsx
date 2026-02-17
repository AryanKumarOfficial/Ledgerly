"use client";
import React from "react";
import { ThemeProvider } from "./theme-provider";
import ReduxProvider from "./ReduxProvider";
import ThemeAwareToaster from "./ThemeAwareToaster";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider>
      <ThemeProvider attribute={"class"} defaultTheme="system" enableSystem>
        <ThemeAwareToaster />
        {children}
      </ThemeProvider>
    </ReduxProvider>
  );
}
