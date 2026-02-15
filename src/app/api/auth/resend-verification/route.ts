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
    const userExists = await db.query.user.findFirst({
      where: eq(user.email, email),
    });

    if (!userExists) {
      return NextResponse.json(
        {
          success,
          message: `If an account with this email exists, a verification link has been sent.`,
        },
        { status: 404 },
      );
    }

    if (userExists && userExists.isVerified) {
      return NextResponse.json(
        {
          success: true,
          message: `Account already verified!`,
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
      timeCost: 2,
      parallelism: 1,
    });

    const expiresAt = tokenExpiryMinutes(30);

    await db.insert(verificationToken).values({
      userId: userExists.id,
      tokenHash,
      type: "EMAIL_VERIFY",
      expiresAt,
    });

    const verificationLink = `${baseEnv.hostUrl}/auth/verify?token=${token}&uid=${userExists.id}`;

    await inngest.send({
      name: "auth/verification.send",
      data: {
        email: userExists.email,
        subject: `Complete Your Registration on ${baseEnv.appName}`,
        link: verificationLink,
        name: userExists.name,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Verification link send successfully`,
    });
  } catch (error) {
    console.log(`Error Requesting Verification: `, error);
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
