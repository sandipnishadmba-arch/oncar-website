import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { getServiceDiscounts, addServiceDiscount, updateServiceDiscount, deleteServiceDiscount } from "@/lib/db";

async function checkAuth() {
  const user = await getAuthUser();
  return !!user;
}

export async function GET() {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json(await getServiceDiscounts());
}

export async function POST(request: Request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { service_id, discount_type, discount_value, start_date, end_date } = body;

    if (!service_id || !discount_type || discount_value === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const result = await addServiceDiscount(
      parseInt(service_id.toString()),
      discount_type,
      parseFloat(discount_value.toString()),
      start_date || null,
      end_date || null
    );

    return NextResponse.json({ success: true, id: result.lastInsertRowid });
  } catch (error) {
    console.error("POST discounts error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, service_id, discount_type, discount_value, start_date, end_date, is_active } = body;

    if (!id || !service_id || !discount_type || discount_value === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await updateServiceDiscount(
      parseInt(id.toString()),
      parseInt(service_id.toString()),
      discount_type,
      parseFloat(discount_value.toString()),
      start_date || null,
      end_date || null,
      is_active === undefined ? 1 : parseInt(is_active.toString())
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PUT discounts error:", error);
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
      return NextResponse.json({ error: "Discount ID required" }, { status: 400 });
    }

    await deleteServiceDiscount(parseInt(id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE discounts error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
