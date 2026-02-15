import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/middleware/auth";
import { db } from "@/lib/db";
import { and, eq } from "drizzle-orm";
import { session, user } from "@/lib/db/schema";
import { passwordSchema } from "@/lib/schema/register";
import z from "zod";
import argon2 from "argon2";

const bodySchema = z.object({
  currentPassword: passwordSchema,
  newPassword: passwordSchema,
});

export const PUT = async (req: NextRequest) => {
  const success = false;
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        {
          success,
          message: `Unauthorized`,
        },
        { status: 401 },
      );
    }

    const dbUser = await db.query.user.findFirst({
      where: and(
        eq(user.id, currentUser.id),
        eq(user.email, currentUser.email),
        eq(user.isVerified, true),
      ),
    });
    if (!dbUser) {
      return NextResponse.json(
        {
          success,
          message: `Session invalid`,
        },
        { status: 401 },
      );
    }

    const body = await req.json();
    const result = bodySchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        {
          success,
          message: z.treeifyError(result.error),
        },
        { status: 400 },
      );
    }

    const { newPassword, currentPassword } = result.data;

    const isCurrentPasswordCorrect = await argon2.verify(
      dbUser.password,
      currentPassword,
    );
    if (!isCurrentPasswordCorrect) {
      return NextResponse.json(
        {
          success,
          message: `Current password is incorrect`,
        },
        { status: 403 },
      );
    }

    const isSame = await argon2.verify(dbUser.password, newPassword);
    if (isSame) {
      return NextResponse.json(
        { success, message: "New password must be different" },
        { status: 400 },
      );
    }

    const password = await argon2.hash(newPassword, {
      type: argon2.argon2id,
      memoryCost: 19456,
      timeCost: 2,
      parallelism: 1,
    });

    await db.transaction(async (tx) => {
      await tx
        .update(user)
        .set({
          password,
        })
        .where(eq(user.id, dbUser.id));

      await tx.delete(session).where(eq(session.userId, dbUser.id));
    });

    return NextResponse.json(
      {
        success: true,
        message: `password changed`,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(`Failed to change passsword: `, error);
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
