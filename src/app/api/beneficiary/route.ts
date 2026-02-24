import { db } from "@/lib/db";
import { beneficiary, user } from "@/lib/db/schema";
import { getCurrentUser } from "@/lib/middleware/auth";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json(
        {
          success: false,
          message: `Unauthorized`,
        },
        { status: 401 },
      );
    }

    const { userId } = await req.json();
    if (
      !userId ||
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
        userId,
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message: `Invalid User ID Format`,
        },
        { status: 400 },
      );
    }

    const userExists = await db.query.user.findFirst({
      where: eq(user.id, userId),
    });

    if (!userExists) {
      return NextResponse.json(
        {
          success: false,
          message: `User Not Found`,
        },
        { status: 404 },
      );
    }

    const alreadyExists = await db.query.beneficiary.findFirst({
      where: and(
        eq(beneficiary.providerId, currentUser.id),
        eq(beneficiary.userId, userExists.id),
      ),
    });

    if (alreadyExists) {
      return NextResponse.json(
        {
          success: false,
          message: "Beneficiary already added",
        },
        { status: 409 },
      );
    }

    const insertBeneficiary: typeof beneficiary.$inferInsert = {
      name: userExists.name,
      providerId: currentUser.id,
      userId: userExists.id,
    };

    const data = await db
      .insert(beneficiary)
      .values(insertBeneficiary)
      .returning({
        name: beneficiary.name,
        userId: beneficiary.userId,
        providerId: beneficiary.providerId,
      });

    return NextResponse.json({
      success: true,
      message: `Beneficiary Added Successfully`,
      data,
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
