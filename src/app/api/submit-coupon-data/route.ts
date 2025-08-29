import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { name, whatsapp } = await request.json();

    if (!name || !whatsapp) {
      return NextResponse.json(
        { error: "Name and WhatsApp are required" },
        { status: 400 }
      );
    }

    // Check if WhatsApp number already exists
    const existingUser = await query(
      "SELECT id FROM coupon_users WHERE whatsapp = $1",
      [whatsapp]
    );
    if (existingUser.rows.length > 0) {
      return NextResponse.json(
        { message: "WhatsApp number already registered" },
        { status: 200 }
      );
    }

    const result = await query(
      "INSERT INTO coupon_users (name, whatsapp) VALUES ($1, $2) RETURNING id",
      [name, whatsapp]
    );

    return NextResponse.json(
      {
        message: "User data saved successfully",
        userId: result.rows[0].id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving user data:", error);
    return NextResponse.json(
      { error: "Failed to save user data" },
      { status: 500 }
    );
  }
}
