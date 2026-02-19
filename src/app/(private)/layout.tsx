"use client";

import React, { useState } from "react";
import PrivateNavbar from "@/components/layout/private/Navbar";
import PrivateSidebar from "@/components/layout/private/Sidebar";
import PrivateFooter from "@/components/layout/private/Footer";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="h-dvh flex bg-linear-to-br from-slate-50 via-slate-100 to-slate-200 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 overflow-hidden">
      <PrivateSidebar
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      <div className="flex flex-col flex-1 relative">
        <PrivateNavbar
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
        />

        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 md:hidden transition-opacity duration-300"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        <div className="relative flex flex-col flex-1 overflow-y-auto pt-16 md:pt-0">
          <div className="flex-1 px-6 md:px-10 py-10 max-w-7xl mx-auto w-full animate-in fade-in duration-300">
            {children}
          </div>


          <PrivateFooter />
        </div>
      </div>
    </div>
  );
}
