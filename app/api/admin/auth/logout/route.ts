import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { deleteSession } from "@/lib/db";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session");

    if (sessionCookie) {
      await deleteSession(sessionCookie.value);
      cookieStore.delete("session");
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Logout API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
