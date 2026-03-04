import { db } from "@/lib/db";
import { user } from "@/lib/db/schema";
import { getCurrentUser } from "@/lib/middleware/auth";
import { profileSchema } from "@/lib/schema/profile";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export const PATCH = async (req: NextRequest) => {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json(
        {
          success: false,
          message: `Unauthorized`,
        },
        {
          status: 401,
        },
      );
    }

    const body = await req.json();
    const result = profileSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: result.error.issues[0].message,
        },
        { status: 400 },
      );
    }
    const { fullName, phone, timezone } = result.data;

    const updatedUser = await db
      .update(user)
      .set({
        name: fullName,
        phone,
        timezone,
      })
      .where(eq(user.id, currentUser.id))
      .returning({
        name: user.name,
        email: user.email,
        phone: user.phone,
        timezone: user.timezone,
      });
    return NextResponse.json({
      success: true,
      message: `Profile Updated Successfully`,
      user: updatedUser[0],
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
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
