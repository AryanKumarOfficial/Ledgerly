import React from "react";
import AuthNavbar from "@/components/layout/auth-navbar";

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <section className="min-h-screen w-full flex flex-col bg-background relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.08),transparent_50%)]" />

      <div className="w-full px-4 md:px-8 pt-4">
        <AuthNavbar />
      </div>

      <div className="flex flex-1 items-center justify-center p-4">
        <div className="w-fit    max-w-md">{children}</div>
      </div>
    </section>
  );
}
