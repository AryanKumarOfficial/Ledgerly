import { db } from "@/lib/db";
import { card, cardRevealLog, user } from "@/lib/db/schema";
import { getCurrentUser } from "@/lib/middleware/auth";
import { CardSecurity } from "@/utils/card";
import argon2 from "argon2";
import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextRequest, NextResponse, userAgent } from "next/server";
import z from "zod";

const revealSchema = z.object({
  cardId: z.string().uuid(),
  password: z.string().min(1),
});
export const POST = async (req: NextRequest) => {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser)
      return NextResponse.json(
        {
          success: false,
          message: `Unauthorized`,
        },
        { status: 401 },
      );

    const body = await req.json();
    const parsed = revealSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: "Invalid request" },
        { status: 400 },
      );
    }

    const { cardId, password } = parsed.data;

    const dbUser = await db.query.user.findFirst({
      where: eq(user.id, currentUser.id),
    });

    if (!dbUser) {
      return NextResponse.json(
        {
          success: false,
          message: `Invalid session`,
        },
        { status: 401 },
      );
    }

    const isValid = await argon2.verify(dbUser?.password, password);

    if (!isValid) {
      return NextResponse.json(
        {
          success: false,
          message: `Authentication failed`,
        },
        { status: 401 },
      );
    }

    const cardData = await db.query.card.findFirst({
      where: and(eq(card.id, cardId), eq(card.userId, dbUser.id)),
    });

    if (!cardData) {
      return NextResponse.json(
        {
          success: true,
          message: `Invalid Card ID`,
        },
        { status: 404 },
      );
    }

    const number = CardSecurity.decryptCard(cardData?.cardNumber);
    const headersList = await headers();
    const { ua } = userAgent(req);
    const forwarded = headersList.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(/, /)[0] : null;

    const logReveal: typeof cardRevealLog.$inferInsert = {
      cardId: cardData.id,
      userId: dbUser.id,
      ipAddress: ip,
      userAgent: ua,
    };

    await db.insert(cardRevealLog).values(logReveal);

    return NextResponse.json({
      success: false,
      cardNumber: number,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: `Internal Server Error`,
      error:
        process.env.NODE_ENV !== "production"
          ? (error as Error).message
          : undefined,
    });
  }
};
