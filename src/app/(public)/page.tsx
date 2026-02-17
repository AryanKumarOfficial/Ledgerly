"use client";

import { useAppSelector } from "@/lib/hooks";
import { useEffect } from "react";

export default function Home() {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  useEffect(() => {
    console.log(`user: `, user);
  }, [user, isAuthenticated]);

  return (
    <main className="flex flex-col gap-10 justify-center items-center min-h-screen">
      <h1 className="text-4xl font-bold">Welcome to the Ledgerly</h1>
      {isAuthenticated && (
        <>
          <p>
            user is {isAuthenticated ? `authenticated` : `not authenticated`}
          </p>
          <p>
            Hello! {user?.name} - {user?.email} - {user?.phone} -{" "}
            {user?.timezone} - {user?.isVerified ? `Verified` : `Not Verified`}
          </p>
        </>
      )}
    </main>
  );
}
