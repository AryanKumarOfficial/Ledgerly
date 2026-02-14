import { db } from "@/lib/db";
import { registerSchema } from "@/lib/schema/register";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";
import argon2 from "argon2";
import { user } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

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

    const hash = await argon2.hash(password);

    const newUser: typeof user.$inferInsert = {
      ...userData,
      email: normalizedEmail,
      password: hash,
    };

    await db.insert(user).values(newUser);

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
