import { NextResponse } from "next/server";
import { getServices, getCategories } from "@/lib/db";

export const runtime = "nodejs";

// Cache the search data in memory for fast responses
let cachedData: { services: any[]; categories: any[] } | null = null;
let cacheTime = 0;
const CACHE_TTL = 60_000; // 1 minute

async function getSearchData() {
  const now = Date.now();
  if (!cachedData || now - cacheTime > CACHE_TTL) {
    const services = await getServices(); // all services with category_name
    const categories = await getCategories();
    cachedData = { services, categories };
    cacheTime = now;
  }
  return cachedData;
}

export async function GET() {
  try {
    const data = await getSearchData();
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, max-age=60, stale-while-revalidate=120",
      },
    });
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
