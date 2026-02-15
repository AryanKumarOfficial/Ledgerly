import { db } from "@/lib/db";
import { session } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const POST = async () => {
  const success = false;

  try {
    const cookieStore = await cookies();

    const token = cookieStore.get("session")?.value;
    if (token) {
      await db.delete(session).where(eq(session.token, token));
    }

    cookieStore.delete("session");

    return NextResponse.json(null, { status: 204 });
  } catch (error) {
    console.log(`Error logout: `, error);
    return NextResponse.json({
      success,
      message: `Internal Server Error`,
      error:
        process.env.NODE_ENV !== "production"
          ? (error as Error)?.message
          : undefined,
    });
  }
};
