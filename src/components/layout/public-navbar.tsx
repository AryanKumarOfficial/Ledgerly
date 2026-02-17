"use client";

import Link from "next/link";
import { ModeToggle } from "@/components/ui/theme-toggle";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { logoutThunk } from "@/lib/features/auth/authThunks";
import { useEffect } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

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

          <AuthAction />
        </div>
      </nav>
    </header>
  );
}

function AuthAction() {
  const { isAuthenticated, loading, error } = useAppSelector(
    (state) => state.auth,
  );
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (error) {
      toast.error(error || `Failed to Logout`);
    }
  }, [error, dispatch]);
  return (
    <>
      {isAuthenticated ? (
        <>
          <Link href="/dashboard">
            <Button variant="ghost" className="cursor-pointer">
              Dashboard
            </Button>
          </Link>

          <Button
            variant={"destructive"}
            className="cursor-pointer"
            size={"lg"}
            onClick={() => dispatch(logoutThunk())}
          >
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              `Logout`
            )}
          </Button>
        </>
      ) : (
        <>
          <Link href="/login">
            <Button variant="ghost">Login</Button>
          </Link>

          <Link href="/register">
            <Button>Sign Up</Button>
          </Link>
        </>
      )}
    </>
  );
}
