import React from "react";
import AuthNavbar from "@/components/layout/auth-navbar";

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <section className="min-h-screen w-full flex flex-col bg-background relative overflow-hidden">
      <AuthNavbar />
      {children}
    </section>
  );
}