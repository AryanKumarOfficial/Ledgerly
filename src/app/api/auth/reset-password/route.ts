import { db } from "@/lib/db";
import { session, user, verificationToken } from "@/lib/db/schema";
import { passwordSchema } from "@/lib/schema/register";
import { and, eq, gt } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import argon2 from "argon2";
const bodySchema = z.object({
  token: z.string().min(1, { error: `token is required` }),
  uid: z.uuid({ error: `Invalid UID` }),
  newPassword: passwordSchema,
});

export const POST = async (req: NextRequest) => {
  const success = false;
  try {
    const body = await req.json();
    const result = bodySchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        {
          success,
          message: result.error.issues[0]?.message || `Invalid Input`,
        },
        { status: 400 },
      );
    }

    const { newPassword, token, uid } = result.data;

    const [existingUser, validToken] = await Promise.all([
      db.query.user.findFirst({
        where: eq(user.id, uid),
      }),
      db.query.verificationToken.findFirst({
        where: and(
          eq(verificationToken.type, "PASSWORD_RESET"),
          gt(verificationToken.expiresAt, new Date()),
          eq(verificationToken.userId, uid),
        ),
      }),
    ]);

    if (!existingUser || !validToken) {
      return NextResponse.json(
        {
          success,
          message: `Link Expired`,
        },
        { status: 400 },
      );
    }

    const isValidToken = await argon2.verify(validToken.tokenHash, token);

    if (!isValidToken) {
      return NextResponse.json(
        {
          success,
          message: `Link Expired`,
        },
        { status: 400 },
      );
    }

    const isSame = await argon2.verify(existingUser.password, newPassword);
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
        .where(eq(user.id, uid));

      await tx
        .delete(verificationToken)
        .where(eq(verificationToken.id, validToken.id));

      await tx.delete(session).where(eq(session.userId, uid));
    });

    return NextResponse.json({
      success: true,
      message: `Password updated successfully!`,
    });
  } catch (error) {
    console.error(`Error reseting password: `, error);
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
