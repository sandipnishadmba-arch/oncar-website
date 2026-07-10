import { NextResponse } from "next/server";
import { getOffers, getOfferUsageCount } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");

    const offers = getOffers();
    
    // Validate offer status, date bounds, and usage limit
    const validateOffer = (o: any) => {
      // is_active toggle must be active (1)
      if (o.is_active !== 1) return false;
      
      // Status must be visible
      if (o.status !== "visible") return false;
      
      // Check scheduling start/end dates
      const now = new Date();
      if (o.start_date) {
        const start = new Date(o.start_date);
        if (now < start) return false;
      }
      if (o.end_date) {
        const end = new Date(o.end_date);
        if (now > end) return false;
      }
      
      // Check coupon usage limit count
      if (o.usage_limit !== null && o.code) {
        const usageCount = getOfferUsageCount(o.code);
        if (usageCount >= o.usage_limit) return false;
      }
      
      return true;
    };

    if (code) {
      // Find the specific coupon code (case-insensitive check)
      const match = offers.find(
        (o) => o.code && o.code.toUpperCase() === code.toUpperCase()
      );
      
      // Safety: direct links/checkouts fail if the banner offer is invalid, disabled, hidden, or expired
      if (match && validateOffer(match)) {
        return NextResponse.json(match);
      }
      return NextResponse.json({ error: "Offer code invalid or expired" }, { status: 404 });
    }

    const activeOffers = offers.filter(validateOffer);
    return NextResponse.json(activeOffers);
  } catch (error) {
    console.error("GET public offers error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
