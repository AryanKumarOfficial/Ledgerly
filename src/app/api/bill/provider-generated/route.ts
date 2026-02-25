import { db } from "@/lib/db";
import { card, providerGeneratedBill } from "@/lib/db/schema";
import { getCurrentUser } from "@/lib/middleware/auth";
import { cardSafeColumn, providerBillColumn } from "@/types/db";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

const providerGeneratedBillSchema = z.object({
  cardId: z.uuid({
    error: (issue) =>
      issue.input === undefined ? "Card ID is required" : "Invalid Card ID",
  }),
  startDate: z.coerce.date({
    error: (issue) =>
      issue.input === undefined ? "Start Date is Required" : "Invalid Date",
  }),
  endDate: z.coerce.date({
    error: (issue) =>
      issue.input === undefined ? "End Date is Required" : "Invalid Date",
  }),
  totalAmount: z.coerce
    .bigint({
      error: (issue) =>
        issue.input === undefined
          ? "Total Amount is Required"
          : "Invalid Amount",
      coerce: true,
    })
    .min(0n, {
      error: `Total Amount must be greater than or Equal to 0`,
    }),
  minDue: z.coerce.bigint(),
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

    const result = providerGeneratedBillSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: `${result.error.issues[0]?.path} : ${result.error.issues[0]?.message}`,
        },
        { status: 400 },
      );
    }

    const { cardId, endDate, startDate, totalAmount, minDue } = result.data;

    const cardExists = await db.query.card.findFirst({
      where: and(eq(card.id, cardId), eq(card.userId, currentUser.id)),
    });

    if (!cardExists) {
      return NextResponse.json(
        {
          success: true,
          message: `Card Not Found`,
        },
        { status: 404 },
      );
    }

    if (cardExists.userId !== currentUser.id) {
      return NextResponse.json(
        {
          success: false,
          message: `Action Not Allowed: Contact your card owner for this action`,
        },
        { status: 403 },
      );
    }

    const insertProviderBIll: typeof providerGeneratedBill.$inferInsert = {
      cardId,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      totalAmount: totalAmount.toString(),
      minDue: minDue ? minDue.toString() : ``,
      addedBy: currentUser.id,
    };

    const [savedBill] = await db
      .insert(providerGeneratedBill)
      .values(insertProviderBIll)
      .returning();

    const generatedBillWithCard =
      await db.query.providerGeneratedBill.findFirst({
        where: (bill, { eq }) => eq(bill.id, savedBill.id),
        columns: providerBillColumn,
        with: {
          card: {
            columns: cardSafeColumn,
          },
        },
      });

    return NextResponse.json({
      success: true,
      generatedBill: generatedBillWithCard,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: true,
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
