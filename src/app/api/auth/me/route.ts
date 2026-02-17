import { getCurrentUser } from "@/lib/middleware/auth";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: `UnAuthorized`,
        },
        { status: 401 },
      );
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.log(`Failed to fetch Profile: `, error);
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
