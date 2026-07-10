import { NextResponse } from "next/server";
import Database from "better-sqlite3";
import path from "path";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    const dbPath = path.join(process.cwd(), "data", "database.db");
    const db = new Database(dbPath);

    if (id) {
      const service = db.prepare(`
        SELECT s.*, c.name as category_name, sd.discount_type, sd.discount_value
        FROM services s
        JOIN categories c ON s.category_id = c.id
        LEFT JOIN service_discounts sd ON s.id = sd.service_id AND sd.is_active = 1
          AND (sd.start_date IS NULL OR sd.start_date = '' OR date(sd.start_date) <= date('now', 'localtime'))
          AND (sd.end_date IS NULL OR sd.end_date = '' OR date(sd.end_date) >= date('now', 'localtime'))
        WHERE s.id = ? AND s.is_active = 1
      `).get(parseInt(id)) as any;

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
      const services = db.prepare(`
        SELECT s.*, c.name as category_name, sd.discount_type, sd.discount_value
        FROM services s
        JOIN categories c ON s.category_id = c.id
        LEFT JOIN service_discounts sd ON s.id = sd.service_id AND sd.is_active = 1
          AND (sd.start_date IS NULL OR sd.start_date = '' OR date(sd.start_date) <= date('now', 'localtime'))
          AND (sd.end_date IS NULL OR sd.end_date = '' OR date(sd.end_date) >= date('now', 'localtime'))
        WHERE s.is_active = 1
        ORDER BY s.display_order ASC
      `).all() as any[];

      const parsedServices = services.map(s => {
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
