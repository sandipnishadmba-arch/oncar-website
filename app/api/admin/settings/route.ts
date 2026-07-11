import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { updateSettings } from "@/lib/db";

async function checkAuth() {
  const user = await getAuthUser();
  return !!user;
}

export async function POST(request: Request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const settings = await request.json();
    
    // Convert arrays/objects to JSON strings for SQLite storage
    const sanitizedSettings: Record<string, string> = {};
    for (const [key, value] of Object.entries(settings)) {
      if (typeof value === "object" && value !== null) {
        sanitizedSettings[key] = JSON.stringify(value);
      } else {
        sanitizedSettings[key] = String(value);
      }
    }

    await updateSettings(sanitizedSettings);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("POST settings error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
