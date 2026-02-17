import React from "react";
// Ensure you have renamed 'auth-navba.tsx' to 'auth-navbar.tsx' in your components folder
import AuthNavbar from "@/components/layout/auth-navbar";

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <section className="min-h-screen w-full flex flex-col bg-background relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.08),transparent_50%)]" />

      {/* Navbar Wrapper with horizontal padding */}
      <div className="w-full px-4 md:px-8 pt-4">
        <AuthNavbar />
      </div>

      {children}
    </section>
  );
}
