"use client";

import Link from "next/link";
import { ModeToggle } from "@/components/ui/theme-toggle";
import { Button } from "@/components/ui/button";

export default function PublicNavbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur">
      <nav className="container mx-auto flex h-16 items-center justify-between px-4">
        
        {/* Logo / Brand */}
        <Link href="/" className="text-xl font-bold">
          Ledgerly
        </Link>

        {/* Center Links */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="#features" className="hover:text-primary">
            Features
          </Link>
          <Link href="#pricing" className="hover:text-primary">
            Pricing
          </Link>
          <Link href="#about" className="hover:text-primary">
            About
          </Link>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <ModeToggle />

          <Link href="/login">
            <Button variant="ghost">Login</Button>
          </Link>

          <Link href="/register">
            <Button>Sign Up</Button>
          </Link>
        </div>

      </nav>
    </header>
  );
}
