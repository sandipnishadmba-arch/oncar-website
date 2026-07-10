import { NextResponse } from "next/server";
import { createBooking } from "@/lib/db";
import Database from "better-sqlite3";
import path from "path";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      type,
      service_name,
      category_name,
      price,
      customer_name,
      phone,
      address,
      area,
      pincode,
      preferred_date,
      preferred_time,
      notes,
      images,
      service_id,
      original_price,
      offer_code,
      discount_amount,
      final_amount,
    } = body;

    // Validate required fields
    if (!type || !category_name || !customer_name || !phone || !address) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Save to SQLite
    const result = createBooking({
      type,
      service_name,
      category_name,
      price: price ? parseFloat(price.toString()) : undefined,
      customer_name,
      phone,
      address,
      area,
      pincode,
      preferred_date,
      preferred_time,
      notes,
      images: images ? JSON.stringify(images) : undefined,
      service_id: service_id ? parseInt(service_id.toString()) : null,
      original_price: original_price ? parseFloat(original_price.toString()) : null,
      offer_code: offer_code || null,
      discount_amount: discount_amount ? parseFloat(discount_amount.toString()) : null,
      final_amount: final_amount ? parseFloat(final_amount.toString()) : null,
    });

    const savedBooking = {
      id: result.lastInsertRowid,
      type,
      service_name,
      category_name,
      price: final_amount || price,
      customer_name,
      phone,
      address,
      area,
      preferred_date,
      preferred_time,
      status: "Pending",
      notes
    };

    // console.log("Booking created successfully");
    // console.log("Saved booking object:", JSON.stringify(savedBooking));

    return NextResponse.json(
      { success: true, bookingId: result.lastInsertRowid, booking: savedBooking },
      { status: 200 }
    );
  } catch (error) {
    console.error("Booking API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const phone = searchParams.get("phone");

    if (!phone) {
      return NextResponse.json({ error: "Phone number required" }, { status: 400 });
    }

    // Connect to SQLite directly
    const dbPath = path.join(process.cwd(), "data", "database.db");
    const db = new Database(dbPath);
    const bookings = db.prepare("SELECT * FROM bookings WHERE phone = ? ORDER BY created_at DESC").all(phone);
    db.close();

    // console.log(`My Bookings fetched booking list: ${bookings.length} bookings for phone ${phone}`);

    return NextResponse.json(bookings, { status: 200 });
  } catch (error) {
    console.error("Booking API GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
