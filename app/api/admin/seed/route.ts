import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export const runtime = "nodejs";

// Protected seed endpoint â€” requires SEED_SECRET env var match
export async function POST(request: Request) {
  const url = new URL(request.url);
  const secret = request.headers.get("x-seed-secret") || url.searchParams.get("secret");
  const expectedSecret = (process.env.SEED_SECRET || "oncar-seed-2024").trim();

  if (secret !== expectedSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const client = await pool.connect();
  try {
    // Ensure tables exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
      );
    `);
    await client.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        image TEXT,
        icon TEXT,
        type TEXT NOT NULL,
        display_order INTEGER DEFAULT 0,
        is_active INTEGER DEFAULT 1
      );
    `);
    await client.query(`
      CREATE TABLE IF NOT EXISTS services (
        id SERIAL PRIMARY KEY,
        category_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        description TEXT,
        price REAL NOT NULL,
        duration TEXT NOT NULL,
        image TEXT,
        is_active INTEGER DEFAULT 1,
        is_featured INTEGER DEFAULT 0,
        is_popular INTEGER DEFAULT 0,
        display_order INTEGER DEFAULT 0,
        arrival_time TEXT DEFAULT '30-45 mins',
        is_recommended INTEGER DEFAULT 0,
        features TEXT
      );
    `);
    await client.query(`
      CREATE TABLE IF NOT EXISTS site_settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL
      );
    `);
    await client.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY,
        type TEXT NOT NULL,
        service_name TEXT,
        category_name TEXT NOT NULL,
        price REAL,
        customer_name TEXT NOT NULL,
        phone TEXT NOT NULL,
        address TEXT NOT NULL,
        preferred_date TEXT,
        preferred_time TEXT,
        notes TEXT,
        images TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        area TEXT,
        pincode TEXT,
        status TEXT DEFAULT 'Pending',
        assigned_worker TEXT,
        service_id INTEGER,
        original_price REAL,
        offer_code TEXT,
        discount_amount REAL,
        final_amount REAL
      );
    `);
    await client.query(`
      CREATE TABLE IF NOT EXISTS sessions (
        id TEXT PRIMARY KEY,
        user_id INTEGER NOT NULL,
        expires_at TIMESTAMP NOT NULL
      );
    `);
    await client.query(`
      CREATE TABLE IF NOT EXISTS offers (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        subtitle TEXT,
        code TEXT,
        image TEXT,
        start_date TEXT,
        end_date TEXT,
        is_active INTEGER DEFAULT 1,
        display_order INTEGER DEFAULT 0,
        target_url TEXT,
        cta_text TEXT DEFAULT 'Book Now',
        service_id INTEGER,
        category_id INTEGER,
        discount_type TEXT,
        discount_value REAL,
        max_discount REAL,
        min_order_amount REAL,
        status TEXT DEFAULT 'visible',
        usage_limit INTEGER,
        created_by TEXT,
        updated_by TEXT,
        created_at TEXT,
        updated_at TEXT
      );
    `);
    await client.query(`
      CREATE TABLE IF NOT EXISTS service_discounts (
        id SERIAL PRIMARY KEY,
        service_id INTEGER NOT NULL,
        discount_type TEXT NOT NULL,
        discount_value REAL NOT NULL,
        start_date TEXT,
        end_date TEXT,
        is_active INTEGER DEFAULT 1
      );
    `);

    // Seed admin user
    await client.query(
      "INSERT INTO users (id, email, password) VALUES ($1, $2, $3) ON CONFLICT (email) DO NOTHING",
      [1, "admin@kaamon.in", "$2b$10$mqqAvHcs6XTCtkC8MtCLdOO91Ein98b3JSuOmQrnciRc3PmcV1ocW"]
    );

    // Seed category
    await client.query(
      "INSERT INTO categories (id, name, slug, image, icon, type, display_order, is_active) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) ON CONFLICT (id) DO NOTHING",
      [1, "Own Car Driving", "own-car-driving", "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=500&fit=crop", "Car", "instant", 1, 1]
    );

    // Seed the 6 OnCar plans
    const services = [
      {
        id: 1, name: "Trial Class", description: "Own car driving confidence check by certified instructor. Best for first-time trial.",
        price: 399, duration: "1 Hour", display_order: 1, is_popular: 0, is_recommended: 0, is_featured: 1,
        image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=500&fit=crop",
        features: JSON.stringify(["1 Hour Session", "Own car driving confidence check", "Instructor guidance", "Best for first-time trial"])
      },
      {
        id: 2, name: "Starter", description: "Learn steering control, brake and accelerator basics, and build road confidence.",
        price: 1299, duration: "3 Hours", display_order: 2, is_popular: 0, is_recommended: 0, is_featured: 1,
        image: "https://images.unsplash.com/photo-1506015391300-4802dc74de2e?w=500&fit=crop",
        features: JSON.stringify(["3 Hours Session", "Basic steering control", "Brake & accelerator control", "Road confidence basics"])
      },
      {
        id: 3, name: "Basic", description: "Learn city road practice, U-turns, parking, and build traffic confidence.",
        price: 1999, duration: "5 Hours", display_order: 3, is_popular: 0, is_recommended: 0, is_featured: 1,
        image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=500&fit=crop",
        features: JSON.stringify(["5 Hours Session", "City road practice", "Turns, U-turns", "Parking basics", "Traffic confidence"])
      },
      {
        id: 4, name: "Popular", description: "Comprehensive package including city traffic driving, reverse practice, and flyovers.",
        price: 3999, duration: "10 Hours", display_order: 4, is_popular: 1, is_recommended: 1, is_featured: 1,
        image: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=500&fit=crop",
        features: JSON.stringify(["10 Hours Session", "City traffic driving", "Reverse & parking practice", "U-turn & flyover driving", "Real road confidence", "Personalized guidance"])
      },
      {
        id: 5, name: "Premium", description: "Advanced practice including highway basics, night driving, parallel and reverse parking.",
        price: 5799, duration: "15 Hours", display_order: 5, is_popular: 0, is_recommended: 0, is_featured: 1,
        image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=500&fit=crop",
        features: JSON.stringify(["15 Hours Session", "Everything in Popular", "Heavy traffic practice", "Parallel & reverse parking", "Highway basics", "Night driving basics"])
      },
      {
        id: 6, name: "Confidence+", description: "Ultimate practice sessions for daily routes and extreme traffic before driving alone.",
        price: 7499, duration: "20 Hours", display_order: 6, is_popular: 0, is_recommended: 0, is_featured: 1,
        image: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=500&fit=crop",
        features: JSON.stringify(["20 Hours Session", "Everything in Premium", "Extra practice on weak areas", "Daily route practice", "Advanced confidence training", "Ideal before driving alone"])
      }
    ];

    for (const s of services) {
      await client.query(
        `INSERT INTO services (id, category_id, name, description, price, duration, image, is_active, is_featured, is_popular, display_order, arrival_time, is_recommended, features)
         VALUES ($1, $2, $3, $4, $5, $6, $7, 1, $8, $9, $10, 'Flexible', $11, $12)
         ON CONFLICT (id) DO UPDATE SET
           name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price,
           duration = EXCLUDED.duration, is_active = 1, is_featured = EXCLUDED.is_featured,
           is_popular = EXCLUDED.is_popular, display_order = EXCLUDED.display_order,
           is_recommended = EXCLUDED.is_recommended, features = EXCLUDED.features`,
        [s.id, 1, s.name, s.description, s.price, s.duration, s.image, s.is_featured, s.is_popular, s.display_order, s.is_recommended, s.features]
      );
    }

    // Seed core site settings
    const settings = [
      ["website_name", "OnCar"],
      ["logo_text", "OnCar"],
      ["tagline", "Your Car. Your Time. OnCar."],
      ["email", "info@oncar.in"],
      ["phone", "+919213466544"],
      ["whatsapp_number", "+919213466544"],
      ["address", "Surat City, Gujarat, India"],
      ["hero_title", "Learn Driving in Your Own Car in Surat"],
      ["hero_subtitle", "Verified instructor aapke ghar/location par aakar aapki own car me confidence driving sikhayega."],
    ];
    for (const [key, value] of settings) {
      await client.query(
        "INSERT INTO site_settings (key, value) VALUES ($1, $2) ON CONFLICT (key) DO NOTHING",
        [key, value]
      );
    }

    // Reset sequences to avoid PK conflicts on future inserts
    await client.query(`SELECT setval('services_id_seq', (SELECT MAX(id) FROM services) + 1, false)`);
    await client.query(`SELECT setval('categories_id_seq', (SELECT MAX(id) FROM categories) + 1, false)`);
    await client.query(`SELECT setval('users_id_seq', (SELECT MAX(id) FROM users) + 1, false)`);

    // Return what was seeded
    const verifyRes = await client.query("SELECT id, name, is_active, display_order FROM services ORDER BY display_order ASC");
    const countRes = await client.query("SELECT COUNT(*) as count FROM services");

    return NextResponse.json({
      success: true,
      message: "Database seeded successfully",
      services_count: parseInt(countRes.rows[0].count),
      services: verifyRes.rows
    });

  } catch (err: any) {
    console.error("Seed error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  } finally {
    client.release();
  }
}
