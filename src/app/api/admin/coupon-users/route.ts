import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await query(
      "SELECT id, name, whatsapp, coupon_won, created_at FROM coupon_users ORDER BY created_at DESC"
    );
    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    console.error("Error fetching coupon users:", error);
    return NextResponse.json(
      { error: "Failed to fetch coupon users" },
      { status: 500 }
    );
  }
}
