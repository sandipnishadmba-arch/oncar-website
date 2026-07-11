import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { getOffers, addOffer, updateOffer, updateOfferOrders, updateOfferStatus, deleteOffer } from "@/lib/db";

export const runtime = "nodejs";

async function checkAuth() {
  const user = await getAuthUser();
  return !!user;
}

export async function GET() {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json(await getOffers());
}

export async function POST(request: Request) {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, subtitle, code, image, target_url, cta_text, start_date, end_date, service_id, category_id, discount_type, discount_value, max_discount, min_order_amount, status, usage_limit } = body;

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const result = await addOffer(
      title,
      subtitle || null,
      code || null,
      image || null,
      target_url || null,
      cta_text || "Book Now",
      start_date || null,
      end_date || null,
      service_id ? parseInt(service_id.toString()) : null,
      category_id ? parseInt(category_id.toString()) : null,
      discount_type || null,
      discount_value ? parseFloat(discount_value.toString()) : null,
      max_discount ? parseFloat(max_discount.toString()) : null,
      min_order_amount ? parseFloat(min_order_amount.toString()) : null,
      status || "visible",
      usage_limit ? parseInt(usage_limit.toString()) : null,
      user.email
    );

    return NextResponse.json({ 
      success: true, 
      id: result.lastInsertRowid,
      created_by: user.email,
      updated_by: user.email,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
  } catch (error) {
    console.error("POST offers error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();

    // Check if this is a bulk reordering request
    if (body.orders && Array.isArray(body.orders)) {
      await updateOfferOrders(body.orders);
      return NextResponse.json({ success: true });
    }

    const { id, title, subtitle, code, image, target_url, cta_text, start_date, end_date, is_active, service_id, category_id, discount_type, discount_value, max_discount, min_order_amount, status, usage_limit } = body;

    if (!id || !title) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await updateOffer(
      parseInt(id.toString()),
      title,
      subtitle || null,
      code || null,
      image || null,
      target_url || null,
      cta_text || "Book Now",
      start_date || null,
      end_date || null,
      is_active === undefined ? 1 : parseInt(is_active.toString()),
      service_id ? parseInt(service_id.toString()) : null,
      category_id ? parseInt(category_id.toString()) : null,
      discount_type || null,
      discount_value ? parseFloat(discount_value.toString()) : null,
      max_discount ? parseFloat(max_discount.toString()) : null,
      min_order_amount ? parseFloat(min_order_amount.toString()) : null,
      status || "visible",
      usage_limit ? parseInt(usage_limit.toString()) : null,
      user.email
    );

    return NextResponse.json({ 
      success: true,
      updated_by: user.email,
      updated_at: new Date().toISOString()
    });
  } catch (error) {
    console.error("PUT offers error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: "Missing id or status" }, { status: 400 });
    }

    if (!["visible", "hidden", "draft", "disabled"].includes(status)) {
      return NextResponse.json({ error: "Invalid status value" }, { status: 400 });
    }

    await updateOfferStatus(parseInt(id.toString()), status);

    return NextResponse.json({
      success: true,
      id,
      status,
      updated_by: user.email,
      updated_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error("PATCH offers error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Offer ID required" }, { status: 400 });
    }

    await deleteOffer(parseInt(id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE offers error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
