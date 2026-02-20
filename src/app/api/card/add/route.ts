import { db } from "@/lib/db";
import { card } from "@/lib/db/schema";
import { getCurrentUser } from "@/lib/middleware/auth";
import { cardSchema } from "@/lib/schema/card";
import {
  detectCardNetwork,
  generateMaskedCardNumber,
  sanitizeCardNumber,
} from "@/utils/card";
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

    const body = await req.json();
    const result = cardSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({
        success: false,
        message: result.error.issues[0].message,
      });
    }

    const {
      cardNumber,
      billingCycleDay,
      creditLimit,
      expirationDate,
      nickname,
      cardBrand,
    } = result.data;

    const sanitizedCardNumber = sanitizeCardNumber(cardNumber);
    const cardExists = await db.query.card.findFirst({
      where: and(
        eq(card.cardNumber, sanitizedCardNumber),
        eq(card.userId, currentUser.id),
      ),
    });

    if (cardExists) {
      return NextResponse.json(
        {
          success: false,
          message: `Card Already added`,
        },
        { status: 409 },
      );
    }

    const insertData: typeof card.$inferInsert = {
      userId: currentUser.id,
      nickname,
      billingCycleDay,
      cardNumber: sanitizedCardNumber,
      cardNumberMasked: generateMaskedCardNumber(sanitizedCardNumber),
      network: detectCardNetwork(sanitizedCardNumber),
      expirationDate,
      creditLimit,
      cardBrand,
    };

    const returnData = {
      id: card.id,
      userId: card.userId,
      nickname: card.nickname,
      billingCycleDay: card.billingCycleDay,
      cardNumberMasked: card.cardNumberMasked,
      network: card.network,
      expirationDate: card.expirationDate,
      creditLimit: card.creditLimit,
      cardBrand: card.cardBrand,
      createdAt: card.createdAt,
      updatedAt: card.updatedAt,
    };

    const saved = await db
      .insert(card)
      .values(insertData)
      .returning(returnData);
    return NextResponse.json({
      success: true,
      message: `Card Added successfully`,
      card: saved,
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
