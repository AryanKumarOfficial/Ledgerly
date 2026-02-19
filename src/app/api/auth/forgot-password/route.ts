import { baseEnv } from "@/env";
import { inngest } from "@/inngest/client";
import { db } from "@/lib/db";
import { user, verificationToken } from "@/lib/db/schema";
import { generateToken, tokenExpiryMinutes } from "@/lib/helpers/session";
import argon2 from "argon2";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const success = false;
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        {
          success,
          meesage: `Email ID is required`,
        },
        { status: 400 },
      );
    }

    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      return NextResponse.json(
        {
          success,
          meesage: `Invalid Email ID`,
        },
        { status: 400 },
      );
    }

    const userExists = await db.query.user.findFirst({
      where: eq(user.email, email),
    });

    if (!userExists) {
      return NextResponse.json(
        {
          success,
          meesage: `If an account with this email exists, a password reset link has been sent.`,
        },
        { status: 200 },
      );
    }

    await db
      .delete(verificationToken)
      .where(eq(verificationToken.userId, userExists.id));

    const token = generateToken();
    const tokenHash = await argon2.hash(token, {
      type: argon2.argon2id,
      memoryCost: 19456,
      parallelism: 1,
      timeCost: 2,
    });
    await db.insert(verificationToken).values({
      type: "PASSWORD_RESET",
      expiresAt: tokenExpiryMinutes(15),
      tokenHash,
      userId: userExists.id,
    });

    const resetLink = `${baseEnv.hostUrl}/auth/reset-password?token=${token}&uid=${userExists.id}`;

    await inngest.send({
      name: "auth/password-reset.send",
      data: {
        email: userExists.email,
        resetLink,
        name: userExists.name,
      },
    });

    return NextResponse.json({
      success: true,
      message: `If an account with this email exists, a password reset link has been sent.`,
    });
  } catch (error) {
    console.error(`Error Forgetting Password: `, error);
    return NextResponse.json({
      success,
      message: `Internal Server Error`,
      error:
        process.env.NODE_ENV !== "production"
          ? (error as Error).message
          : undefined,
    });
  }
};
