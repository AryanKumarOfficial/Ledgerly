"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { logoutThunk } from "@/lib/features/auth/authThunks";
import { ModeToggle } from "@/components/ui/theme-toggle";

interface PrivateSidebarProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (isOpen: boolean) => void;
}

export default function PrivateSidebar({
  isMobileMenuOpen,
  setIsMobileMenuOpen,
}: PrivateSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const handleLogout = async () => {
    await dispatch(logoutThunk());
    router.replace("/login");
  };

  const navLinks = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
          />
        </svg>
      ),
    },
    {
      name: "Profile",
      href: "/profile",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      ),
    },
  ];

  return (
    <aside
      className={`fixed md:relative z-40 w-64 h-dvh md:h-auto transition-all duration-300 ease-in-out bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-r border-white/30 dark:border-white/10 shadow-xl flex flex-col ${isMobileMenuOpen ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0 md:opacity-100"} md:translate-x-0`}
    >
      <div className="hidden md:flex h-16 items-center justify-between px-6 border-b border-white/30 dark:border-white/10 shrink-0">
        <Link
          href={"/dashboard"}
          className="text-2xl font-bold text-blue-600 dark:text-blue-400 tracking-tight"
        >
          Ledgerly
        </Link>
        <ModeToggle />
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all duration-200
              ${
                isActive
                  ? "bg-blue-600/10 text-blue-600 dark:text-blue-400"
                  : "text-slate-600 dark:text-slate-300 hover:bg-white/40 dark:hover:bg-slate-800/50 hover:translate-x-1"
              }`}
            >
              {link.icon}
              {link.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700 shrink-0">
        <div className="flex items-center gap-3 mb-4 px-2">
          <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-700 dark:text-blue-300 font-bold shrink-0 uppercase">
            {user?.name?.charAt(0) || "U"}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {user?.name || "User"}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {user?.email || "Loading..."}
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          Log Out
        </button>
      </div>
    </aside>
  );
}
