import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { whatsapp, coupon } = await request.json();

    if (!whatsapp || !coupon) {
      return NextResponse.json(
        { error: "WhatsApp and coupon are required" },
        { status: 400 }
      );
    }

    const result = await query(
      "UPDATE coupon_users SET coupon_won = $1 WHERE whatsapp = $2 RETURNING id",
      [coupon, whatsapp]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "User not found or coupon already set" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Coupon updated successfully",
        userId: result.rows[0].id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating coupon won:", error);
    return NextResponse.json(
      { error: "Failed to update coupon won" },
      { status: 500 }
    );
  }
}
