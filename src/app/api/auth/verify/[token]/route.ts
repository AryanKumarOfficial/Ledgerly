import { db } from "@/lib/db";
import { user, verificationToken } from "@/lib/db/schema";
import { and, gt, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import argon2 from "argon2";
import { inngest } from "@/inngest/client";
import { baseEnv } from "@/env";
export const GET = async (
  req: NextRequest,
  ctx: RouteContext<"/api/auth/verify/[token]">,
) => {
  const success = false;
  try {
    const { token } = await ctx.params;
    const searchParams = req.nextUrl.searchParams;
    const uid = searchParams.get("uid");
    if (!token || !uid) {
      return NextResponse.json(
        {
          success,
          message: `Token and User Id are Required in the URL`,
        },
        { status: 400 },
      );
    }

    if (!/^[0-9a-fA-F-]{36}$/.test(uid)) {
      return NextResponse.json(
        {
          success,
          message: `Invalid User ID`,
        },
        { status: 400},
      );
    }

    const existingUser = await db.query.user.findFirst({
      where: eq(user.id, uid),
    });

    if (!existingUser) {
      return NextResponse.json(
        {
          success,
          message: `Invalid User ID`,
        },
        { status: 400 },
      );
    }

    if (existingUser.isVerified) {
      return NextResponse.json(
        {
          success: true,
          message: `Account aleady verified!`,
        },
        { status: 200 },
      );
    }

    const verificationTokenRow = await db.query.verificationToken.findFirst({
      where: and(
        gt(verificationToken.expiresAt, new Date()),
        eq(verificationToken.type, "EMAIL_VERIFY"),
        eq(verificationToken.userId, uid),
      ),
      with: {
        user: true,
      },
    });

    if (!verificationTokenRow) {
      return NextResponse.json(
        {
          success,
          message: `Invalid or Expired Token`,
        },
        { status: 400 },
      );
    }

    const isTokenValid = await argon2.verify(
      verificationTokenRow.tokenHash,
      token,
    );

    if (!isTokenValid) {
      await db
        .delete(verificationToken)
        .where(eq(verificationToken.id, verificationTokenRow.id));
      return NextResponse.json(
        {
          success,
          message: `Invalid or Expired Token`,
        },
        { status: 400 },
      );
    }

    const { updatedUser } = await db.transaction(async (tx) => {
      const [updatedUser] = await tx
        .update(user)
        .set({ isVerified: true })
        .where(eq(user.id, verificationTokenRow.userId))
        .returning({
          name: user.name,
          email: user.email,
        });

      await tx
        .delete(verificationToken)
        .where(eq(verificationToken.id, verificationTokenRow.id));

      return { updatedUser };
    });

    await inngest.send({
      name: "auth/welcome.send",
      data: {
        email: updatedUser.email,
        name: updatedUser.name,
        subject: `Welcome to ${baseEnv.appName}`,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    console.log(`Error while creating account: `, error);
    return NextResponse.json(
      {
        success,
        message: `Internal Server Error`,
        error:
          process.env.NODE_ENV === "development"
            ? (error as Error).message
            : undefined,
      },
      { status: 500 },
    );
  }
};
