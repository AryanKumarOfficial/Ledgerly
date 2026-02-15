import { db } from "@/lib/db";
import { registerSchema } from "@/lib/schema/register";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";
import argon2 from "argon2";
import { user, verificationToken } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { inngest } from "@/inngest/client";
import crypto from "crypto";
import { baseEnv } from "@/env";

export const POST = async (req: NextRequest) => {
  const success = false;
  try {
    const body = await req.json();
    // validates request body
    const result = registerSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        {
          success,
          message: `All feilds are required!`,
          errors: z.treeifyError(result.error),
        },
        { status: 400 },
      );
    }

    const { password, email, ...userData } = result.data;
    const normalizedEmail = email.toLowerCase().trim();
    const userExists = await db.query.user.findFirst({
      where: eq(user.email, normalizedEmail),
    });

    if (userExists) {
      return NextResponse.json(
        {
          success,
          message: `An account with this email already exists`,
        },
        { status: 409 },
      );
    }

    // hash the password

    const hashedPass = await argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 19456, 
      timeCost: 2,
      parallelism: 1,
    });

    // prepare data
    const newUserPayload: typeof user.$inferInsert = {
      ...userData,
      email: normalizedEmail,
      password: hashedPass,
    };

    // save to db

    const { newUser, rowToken } = await db.transaction(async (tx) => {
      const [newUser] = await tx.insert(user).values(newUserPayload).returning({
        id: user.id,
        name: user.name,
        email: user.email,
      });

      // generate token

      const rowToken = crypto.randomBytes(32).toString("hex");
      const tokenHash = await argon2.hash(rowToken);

      // save token to db
      await tx.insert(verificationToken).values({
        userId: newUser.id,
        tokenHash,
        type: "EMAIL_VERIFY",
        expiresAt: new Date(Date.now() + 1000 * 60 * 30), // 30 Min
      });
      return { newUser, rowToken };
    });

    // prepare link
    const verificationLink = `${baseEnv.hostUrl}/auth/verify?token=${rowToken}`;

    // send email

    await inngest.send({
      name: "auth/verification.send",
      data: {
        email: newUser.email,
        subject: `Complete Your Registration on ${baseEnv.appName}`,
        link: verificationLink,
        name: newUser.name,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: `Account created successfully!`,
      },
      { status: 201 },
    );
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
