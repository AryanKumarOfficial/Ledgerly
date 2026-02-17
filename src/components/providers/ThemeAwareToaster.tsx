"use client";

import { Toaster, ToasterProps } from "sonner";
import { useTheme } from "next-themes";

export default function ThemeAwareToaster() {
  const { resolvedTheme } = useTheme();

  return (
    <Toaster
      position="top-right"
      closeButton
      duration={3000}
      theme={resolvedTheme as ToasterProps["theme"]}
    />
  );
}
