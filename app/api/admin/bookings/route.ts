import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { getBookings, updateBooking } from "@/lib/db";

async function checkAuth() {
  const user = await getAuthUser();
  return !!user;
}

export async function GET(request: Request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const area = searchParams.get("area");
    const date = searchParams.get("date");

    let bookings = await getBookings();

    // Apply filtering
    if (status) {
      bookings = bookings.filter((b) => b.status === status);
    }
    if (area) {
      bookings = bookings.filter((b) => b.area === area);
    }
    if (date) {
      bookings = bookings.filter((b) => b.preferred_date === date);
    }

    return NextResponse.json(bookings);
  } catch (error) {
    console.error("GET bookings error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, status, assigned_worker } = body;

    if (!id || !status) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await updateBooking(
      parseInt(id.toString()),
      status,
      assigned_worker || null
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PUT bookings error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
