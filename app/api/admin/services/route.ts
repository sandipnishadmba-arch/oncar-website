import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { getServices, addService, updateService, deleteService } from "@/lib/db";

// Middleware-like check
async function checkAuth() {
  const user = await getAuthUser();
  return !!user;
}

export async function GET() {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json(await getServices());
}

export async function POST(request: Request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { categoryId, name, description, price, duration, image, arrival_time, is_recommended, features } = body;

    if (!categoryId || !name || price === undefined || !duration) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const result = await addService(
      parseInt(categoryId.toString()),
      name,
      description || "",
      parseFloat(price.toString()),
      duration,
      image || "",
      arrival_time || "30-45 mins",
      is_recommended ? 1 : 0,
      features
    );

    return NextResponse.json({ success: true, id: result.lastInsertRowid });
  } catch (error) {
    console.error("POST services error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();

    // Check if this is a bulk reordering request
    if (body.orders && Array.isArray(body.orders)) {
      const { updateServiceOrders } = require("@/lib/db");
      await updateServiceOrders(body.orders);
      return NextResponse.json({ success: true });
    }

    const {
      id,
      categoryId,
      name,
      description,
      price,
      duration,
      image,
      is_active,
      is_featured,
      is_popular,
      arrival_time,
      is_recommended,
      features,
    } = body;

    if (!id || !categoryId || !name || price === undefined || !duration) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await updateService(
      parseInt(id.toString()),
      parseInt(categoryId.toString()),
      name,
      description || "",
      parseFloat(price.toString()),
      duration,
      image || "",
      parseInt(is_active.toString()),
      parseInt(is_featured.toString()),
      parseInt(is_popular.toString()),
      arrival_time || "30-45 mins",
      is_recommended ? 1 : 0,
      features
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PUT services error:", error);
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
      return NextResponse.json({ error: "Service ID required" }, { status: 400 });
    }

    await deleteService(parseInt(id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE services error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
