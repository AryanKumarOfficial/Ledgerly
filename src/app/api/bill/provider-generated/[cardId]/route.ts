import { db } from "@/lib/db";
import { beneficiary, card, providerGeneratedBill } from "@/lib/db/schema";
import { getCurrentUser } from "@/lib/middleware/auth";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  _req: NextRequest,
  ctx: RouteContext<"/api/bill/provider-generated/[cardId]">,
) => {
  try {
    const { cardId } = await ctx.params;
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

    const cardData = await db.query.card.findFirst({
      where: eq(card.id, card),
      with: {
        beneficiaries: {
          where: eq(beneficiary.userId, currentUser.id),
          columns: {
            id: true,
          },
        },
      },
      columns: {
        id: true,
        userId: true,
      },
    });

    if (!cardData) {
      return NextResponse.json(
        { success: false, message: "Card not found" },
        { status: 404 },
      );
    }

    const isOwner = cardData.userId === currentUser.id;
    const isBeneficiary = cardData.beneficiaries.length > 0;

    if (!isOwner && !isBeneficiary) {
      return NextResponse.json(
        {
          success: false,
          message: `Forbidden`,
        },
        { status: 403 },
      );
    }

    const bills = await db.query.providerGeneratedBill.findMany({
      where: eq(providerGeneratedBill.cardId, cardId),
      with: {
        addedByUser: {
          columns: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: (bill, { desc }) => [desc(bill.createdAt)],
    });
    return NextResponse.json({
      success: true,
      bills,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: `Internal Server Error`,
      error:
        process.env.NODE_ENV !== "production"
          ? (error as Error)?.message
          : undefined,
    });
  }
};
