import { db } from "@/lib/db";
import { session, user } from "@/lib/db/schema";
import { generateSessionToken, sessionExpiry } from "@/lib/helpers/session";
import { loginSchema } from "@/lib/schema/login";
import argon2 from "argon2";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

export const POST = async (req: NextRequest) => {
  const success = false;
  try {
    const body = await req.json();
    const result = loginSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        {
          success,
          message: z.treeifyError(result.error).properties,
        },
        { status: 400 },
      );
    }

    const data = result.data;

    const userExists = await db.query.user.findFirst({
      where: eq(user.email, data.email),
    });

    if (!userExists) {
      return NextResponse.json(
        {
          success,
          message: `Invalid Credentials`,
        },
        { status: 400 },
      );
    }

    if (userExists && !userExists.isVerified) {
      return NextResponse.json(
        {
          success,
          message: `Verify your Account to login`,
        },
        { status: 403 },
      );
    }

    const isValid = await argon2.verify(userExists.password, data.password);
    if (!isValid) {
      return NextResponse.json(
        {
          success,
          message: `Invalid Credentials`,
        },
        { status: 400 },
      );
    }

    const token = generateSessionToken();
    const expiresAt = sessionExpiry(3);

    await db.insert(session).values({
      userId: userExists.id,
      token,
      expiresAt,
    });

    (await cookies()).set("session", token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      expires: expiresAt,
    });

    return NextResponse.json({
      success: true,
      sessionToken: token,
      message: `logged in successfully`,
    });
  } catch (error) {
    console.error(`Error logging in: `, error);
    return NextResponse.json(
      {
        success,
        message: `Internal Server Error`,
        error:
          process.env.NODE_ENV !== "production"
            ? (error as Error)?.message
            : undefined,
      },
      { status: 500 },
    );
  }
};
