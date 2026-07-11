import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (id) {
      const res = await query(`
        SELECT s.*, c.name as category_name, sd.discount_type, sd.discount_value
        FROM services s
        JOIN categories c ON s.category_id = c.id
        LEFT JOIN service_discounts sd ON s.id = sd.service_id AND sd.is_active = 1
          AND (sd.start_date IS NULL OR sd.start_date = '' OR sd.start_date <= TO_CHAR(CURRENT_DATE, 'YYYY-MM-DD'))
          AND (sd.end_date IS NULL OR sd.end_date = '' OR sd.end_date >= TO_CHAR(CURRENT_DATE, 'YYYY-MM-DD'))
        WHERE s.id = $1 AND s.is_active = 1
      `, [parseInt(id)]);
      
      const service = res.rows[0];

      if (!service) {
        return NextResponse.json({ error: "Service not found" }, { status: 404 });
      }

      let features = [];
      if (service.features) {
        try {
          features = JSON.parse(service.features);
        } catch {
          features = service.features.split("\n").filter(Boolean);
        }
      } else {
        features = service.description ? service.description.split("\n").filter(Boolean) : [];
      }

      return NextResponse.json({
        ...service,
        features: Array.isArray(features) ? features : [service.description]
      });
    } else {
      const res = await query(`
        SELECT s.*, c.name as category_name, sd.discount_type, sd.discount_value
        FROM services s
        JOIN categories c ON s.category_id = c.id
        LEFT JOIN service_discounts sd ON s.id = sd.service_id AND sd.is_active = 1
          AND (sd.start_date IS NULL OR sd.start_date = '' OR sd.start_date <= TO_CHAR(CURRENT_DATE, 'YYYY-MM-DD'))
          AND (sd.end_date IS NULL OR sd.end_date = '' OR sd.end_date >= TO_CHAR(CURRENT_DATE, 'YYYY-MM-DD'))
        WHERE s.is_active = 1
        ORDER BY s.display_order ASC
      `);

      const parsedServices = res.rows.map(s => {
        let features = [];
        if (s.features) {
          try {
            features = JSON.parse(s.features);
          } catch {
            features = s.features.split("\n").filter(Boolean);
          }
        } else {
          features = s.description ? s.description.split("\n").filter(Boolean) : [];
        }
        return {
          ...s,
          features: Array.isArray(features) ? features : [s.description]
        };
      });

      return NextResponse.json(parsedServices);
    }
  } catch (error) {
    console.error("GET public service error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
