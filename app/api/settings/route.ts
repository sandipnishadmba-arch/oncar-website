import { NextResponse } from "next/server";
import { getSettings } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const settings = await getSettings();
    return NextResponse.json(settings);
  } catch (error) {
    console.error("GET public settings error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
