import React from "react";
import AuthNavbar from "@/components/layout/auth-navba";

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <section className="relative flex min-h-screen items-center justify-center flex-col w-full">
      <AuthNavbar />
      {children}
    </section>
  );
}
