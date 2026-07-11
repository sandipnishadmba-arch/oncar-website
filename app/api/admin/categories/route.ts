import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { getCategories, addCategory, updateCategory, deleteCategory } from "@/lib/db";

async function checkAuth() {
  const user = await getAuthUser();
  return !!user;
}

export async function GET() {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json(await getCategories());
}

export async function POST(request: Request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, slug, image, icon, type } = body;

    if (!name || !slug || !type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const result = await addCategory(name, slug, image || "", icon || "ShieldCheck", type);
    return NextResponse.json({ success: true, id: result.lastInsertRowid });
  } catch (error) {
    console.error("POST categories error:", error);
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
      const { updateCategoryOrders } = require("@/lib/db");
      await updateCategoryOrders(body.orders);
      return NextResponse.json({ success: true });
    }

    const { id, name, slug, image, icon, type, is_active } = body;

    if (!id || !name || !slug || !type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await updateCategory(
      parseInt(id.toString()), 
      name, 
      slug, 
      image || "", 
      icon || "ShieldCheck", 
      type,
      is_active === undefined ? 1 : parseInt(is_active.toString())
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PUT categories error:", error);
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
      return NextResponse.json({ error: "Category ID required" }, { status: 400 });
    }

    await deleteCategory(parseInt(id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE categories error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
