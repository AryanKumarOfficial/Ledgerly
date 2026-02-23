import { db } from "@/lib/db";
import { card } from "@/lib/db/schema";
import { getCurrentUser } from "@/lib/middleware/auth";
import { cardSchema } from "@/lib/schema/card";
import { passwordSchema } from "@/lib/schema/register";
import {
  CardSecurity,
  detectCardNetwork,
  generateMaskedCardNumber,
  sanitizeCardNumber,
} from "@/utils/card";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import argon2 from "argon2";

const deleteSchema = z.object({
  password: passwordSchema,
  cardId: z.uuid({ error: `Invalid ID Format` }),
});

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
      billingCycleDay,
      cardBrand,
      cardNumber,
      creditLimit,
      expirationDate,
      nickname,
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
      cardNumber: CardSecurity.encryptCard(sanitizedCardNumber),
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

export const DELETE = async (req: NextRequest) => {
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
    const result = deleteSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: `${result.error.issues[0].path} : ${result.error.issues[0].message}`,
        },
        { status: 400 },
      );
    }

    const { cardId, password } = result.data;

    const isValid = await argon2.verify(currentUser.password, password);
    if (!isValid) {
      return NextResponse.json(
        {
          success: false,
          message: `Invalid Credentials`,
        },
        { status: 401 },
      );
    }

    const deletedCard = await db
      .delete(card)
      .where(and(eq(card.id, cardId), eq(card.userId, currentUser.id)))
      .returning();

    if (deletedCard.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: `Card Not Found`,
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json({
      success: true,
      message: `Card Deleted successfully`,
      data: deletedCard[0],
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
