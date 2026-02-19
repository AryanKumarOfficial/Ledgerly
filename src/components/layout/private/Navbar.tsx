"use client";

import React from "react";

interface PrivateNavbarProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (isOpen: boolean) => void;
}

import { ModeToggle } from "@/components/ui/theme-toggle";

export default function PrivateNavbar({
  isMobileMenuOpen,
  setIsMobileMenuOpen,
}: PrivateNavbarProps) {
  return (
    <div
      className="md:hidden fixed top-0 left-0 right-0 h-16
      bg-white/60 dark:bg-slate-900/60
      backdrop-blur-xl
      border-b border-white/30 dark:border-white/10
      z-50 flex items-center justify-between px-6 shadow-sm"
    >
      <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
        Ledgerly
      </span>

      <div className="flex items-center gap-3">
        <ModeToggle />

        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-slate-600 dark:text-slate-300"
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isMobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>
    </div>
  );
}
