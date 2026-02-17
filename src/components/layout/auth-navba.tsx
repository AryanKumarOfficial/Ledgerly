"use client";

import Link from "next/link";
import { ModeToggle } from "@/components/ui/theme-toggle";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";

export default function AuthNavbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur">
      <nav className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo / Brand */}
        <Link href="/" className="text-xl font-bold">
          Ledgerly
        </Link>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <ModeToggle />
          <AuthAction />
        </div>
      </nav>
    </header>
  );
}

function AuthAction() {
  const pathname = usePathname();

  return (
    <>
      {pathname.includes("register") ? (
        <Link href="/login">
          <Button variant="ghost">Login</Button>
        </Link>
      ) : (
        <Link href="/register">
          <Button>Sign Up</Button>
        </Link>
      )}
    </>
  );
}
