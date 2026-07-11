import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;

if (!connectionString) {
  console.warn("WARNING: DATABASE_URL or POSTGRES_URL environment variables are not set. Database connections will fail!");
}

export const pool = new Pool({
  connectionString,
  ssl: connectionString ? {
    rejectUnauthorized: false
  } : false
});

export async function query(text: string, params?: any[]) {
  return pool.query(text, params);
}

// Initialize PostgreSQL database tables
export async function initDb() {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    
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
      CREATE TABLE IF NOT EXISTS site_settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL
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

    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Error initializing PostgreSQL DB tables:", err);
  } finally {
    client.release();
  }
}

// Call on startup, handle errors gracefully
if (connectionString) {
  initDb().catch(err => console.error("Database startup init failed:", err));
}

export async function getSettings() {
  try {
    const res = await query("SELECT * FROM site_settings");
    const settings: Record<string, any> = {};
    res.rows.forEach(r => {
      try {
        settings[r.key] = JSON.parse(r.value);
      } catch {
        settings[r.key] = r.value;
      }
    });
    return settings;
  } catch (err) {
    console.error("Failed to fetch settings from DB, returning empty settings:", err);
    return {};
  }
}

export async function updateSetting(key: string, value: string) {
  return query(
    "INSERT INTO site_settings (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value",
    [key, value]
  );
}

export async function updateSettings(settings: Record<string, any>) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    for (const [key, value] of Object.entries(settings)) {
      const stringValue = typeof value === "object" && value !== null ? JSON.stringify(value) : String(value);
      await client.query(
        "INSERT INTO site_settings (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value",
        [key, stringValue]
      );
    }
    await client.query("COMMIT");
    return { changes: Object.keys(settings).length };
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }
}

export async function getCategories() {
  try {
    const res = await query("SELECT * FROM categories ORDER BY display_order ASC");
    return res.rows;
  } catch (err) {
    console.error("Failed to fetch categories from DB, returning empty array:", err);
    return [];
  }
}

export async function getServices() {
  try {
    const res = await query("SELECT * FROM services ORDER BY display_order ASC");
    return res.rows.map(s => {
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
  } catch (err) {
    console.error("Failed to fetch services from DB, returning empty array:", err);
    return [];
  }
}

export async function getServiceById(id: number) {
  const res = await query("SELECT * FROM services WHERE id = $1", [id]);
  const s = res.rows[0];
  if (!s) return null;
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
}

export async function getCategoryById(id: number) {
  const res = await query("SELECT * FROM categories WHERE id = $1", [id]);
  return res.rows[0] || null;
}

export async function addCategory(name: string, slug: string, image: string, icon: string, type: string) {
  const maxOrderRes = await query("SELECT MAX(display_order) as maxorder FROM categories");
  const nextOrder = (maxOrderRes.rows[0]?.maxorder || 0) + 1;
  const res = await query(`
    INSERT INTO categories (name, slug, image, icon, type, display_order, is_active)
    VALUES ($1, $2, $3, $4, $5, $6, 1) RETURNING id
  `, [name, slug, image, icon, type, nextOrder]);
  return { lastInsertRowid: res.rows[0].id };
}

export async function updateCategory(id: number, name: string, slug: string, image: string, icon: string, type: string, isActive: number) {
  return query(`
    UPDATE categories 
    SET name = $1, slug = $2, image = $3, icon = $4, type = $5, is_active = $6
    WHERE id = $7
  `, [name, slug, image, icon, type, isActive, id]);
}

export async function deleteCategory(id: number) {
  return query("DELETE FROM categories WHERE id = $1", [id]);
}

export async function addService(
  categoryId: number,
  name: string,
  description: string,
  price: number,
  duration: string,
  image: string,
  arrivalTime: string,
  isRecommended: number,
  features?: string
) {
  const maxOrderRes = await query("SELECT MAX(display_order) as maxorder FROM services");
  const nextOrder = (maxOrderRes.rows[0]?.maxorder || 0) + 1;
  const res = await query(`
    INSERT INTO services (category_id, name, description, price, duration, image, display_order, is_active, is_featured, is_popular, arrival_time, is_recommended, features)
    VALUES ($1, $2, $3, $4, $5, $6, $7, 1, 0, 0, $8, $9, $10) RETURNING id
  `, [categoryId, name, description, price, duration, image, nextOrder, arrivalTime, isRecommended, features || '[]']);
  return { lastInsertRowid: res.rows[0].id };
}

export async function updateService(
  id: number,
  categoryId: number,
  name: string,
  description: string,
  price: number,
  duration: string,
  image: string,
  isActive: number,
  isFeatured: number,
  isPopular: number,
  arrivalTime: string,
  isRecommended: number,
  features?: string
) {
  return query(`
    UPDATE services 
    SET category_id = $1, name = $2, description = $3, price = $4, duration = $5, image = $6, is_active = $7, is_featured = $8, is_popular = $9, arrival_time = $10, is_recommended = $11, features = $12
    WHERE id = $13
  `, [categoryId, name, description, price, duration, image, isActive, isFeatured, isPopular, arrivalTime, isRecommended, features || '[]', id]);
}

export async function deleteService(id: number) {
  return query("DELETE FROM services WHERE id = $1", [id]);
}

export async function getBookings() {
  const res = await query("SELECT * FROM bookings ORDER BY created_at DESC");
  return res.rows;
}

export async function createBooking(data: any) {
  const res = await query(`
    INSERT INTO bookings (type, service_name, category_name, price, customer_name, phone, address, preferred_date, preferred_time, notes, status, created_at, area, pincode, service_id, original_price, offer_code, discount_amount, final_amount)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, CURRENT_TIMESTAMP, $12, $13, $14, $15, $16, $17, $18) RETURNING id
  `, [
    data.type || 'instant',
    data.service_name || null,
    data.category_name || '',
    data.price || null,
    data.customer_name,
    data.phone,
    data.address,
    data.preferred_date || null,
    data.preferred_time || null,
    data.notes || null,
    data.status || 'Pending',
    data.area || null,
    data.pincode || null,
    data.service_id || null,
    data.original_price || null,
    data.offer_code || null,
    data.discount_amount || null,
    data.final_amount || null
  ]);
  return { lastInsertRowid: res.rows[0].id };
}

export async function updateBookingStatus(id: number, status: string) {
  return query("UPDATE bookings SET status = $1 WHERE id = $2", [status, id]);
}

export async function updateBooking(id: number, status: string, assignedWorker?: string | null) {
  return query("UPDATE bookings SET status = $1, assigned_worker = $2 WHERE id = $3", [status, assignedWorker || null, id]);
}

export async function getCategoriesCount() {
  const res = await query("SELECT count(*) as count FROM categories");
  return parseInt(res.rows[0].count);
}

export async function getServicesCount() {
  const res = await query("SELECT count(*) as count FROM services");
  return parseInt(res.rows[0].count);
}

export async function getBookingsCount() {
  const res = await query("SELECT count(*) as count FROM bookings");
  return parseInt(res.rows[0].count);
}

export async function getRevenueStats() {
  const res = await query("SELECT sum(price) as total, count(*) as count FROM bookings WHERE status = 'completed'");
  return {
    total_revenue: res.rows[0].total || 0,
    completed_bookings: parseInt(res.rows[0].count || 0)
  };
}

export async function getDashboardStats() {
  const categoryCountRes = await query("SELECT count(*) as count FROM categories");
  const serviceCountRes = await query("SELECT count(*) as count FROM services WHERE is_active = 1");
  const bookingCountRes = await query("SELECT count(*) as count FROM bookings");
  const revenueSumRes = await query("SELECT sum(price) as total FROM bookings WHERE status = 'completed'");

  return {
    totalBookings: parseInt(bookingCountRes.rows[0].count || 0),
    totalRevenue: revenueSumRes.rows[0].total || 0,
    activeServices: parseInt(serviceCountRes.rows[0].count || 0),
    activeOffers: 0
  };
}

export async function getRecentBookings() {
  const res = await query("SELECT * FROM bookings ORDER BY created_at DESC LIMIT 5");
  return res.rows;
}

export async function createSession(id: string, userId: number, expiresAt: Date) {
  await query("INSERT INTO sessions (id, user_id, expires_at) VALUES ($1, $2, $3)", [id, userId, expiresAt]);
}

export async function getSession(id: string) {
  const sessionRes = await query("SELECT * FROM sessions WHERE id = $1", [id]);
  const session = sessionRes.rows[0];
  if (!session) return null;
  const userRes = await query("SELECT email FROM users WHERE id = $1", [session.user_id]);
  const user = userRes.rows[0];
  return {
    id: session.id,
    user_id: session.user_id,
    expires_at: session.expires_at,
    email: user?.email || ""
  };
}

export async function deleteSession(id: string) {
  await query("DELETE FROM sessions WHERE id = $1", [id]);
}

export async function cleanExpiredSessions() {
  await query("DELETE FROM sessions WHERE expires_at < CURRENT_TIMESTAMP");
}

export async function updateServiceOrders(orders: { id: number; display_order: number }[]) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    for (const item of orders) {
      await client.query("UPDATE services SET display_order = $1 WHERE id = $2", [item.display_order, item.id]);
    }
    await client.query("COMMIT");
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }
}

export async function getOffers() {
  const res = await query("SELECT * FROM offers ORDER BY display_order ASC");
  return res.rows;
}

export async function addOffer(
  title: string,
  subtitle: string | null,
  code: string | null,
  image: string | null,
  targetUrl: string | null,
  ctaText: string,
  startDate: string | null,
  endDate: string | null,
  serviceId: number | null,
  categoryId: number | null,
  discountType: string | null,
  discountValue: number | null,
  maxDiscount: number | null,
  minOrderAmount: number | null,
  status: string,
  usageLimit: number | null,
  email: string
) {
  const maxOrderRes = await query("SELECT MAX(display_order) as maxorder FROM offers");
  const nextOrder = (maxOrderRes.rows[0]?.maxorder || 0) + 1;
  const res = await query(`
    INSERT INTO offers (
      title, subtitle, code, image, target_url, cta_text, start_date, end_date, 
      service_id, category_id, discount_type, discount_value, max_discount, min_order_amount, 
      status, usage_limit, display_order, created_by, updated_by, created_at, updated_at
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, 
      $9, $10, $11, $12, $13, $14, 
      $15, $16, $17, $18, $19, TO_CHAR(CURRENT_TIMESTAMP, 'YYYY-MM-DD HH24:MI:SS'), TO_CHAR(CURRENT_TIMESTAMP, 'YYYY-MM-DD HH24:MI:SS')
    ) RETURNING id
  `, [
    title, subtitle, code, image, targetUrl, ctaText, startDate, endDate,
    serviceId, categoryId, discountType, discountValue, maxDiscount, minOrderAmount,
    status, usageLimit, nextOrder, email, email
  ]);
  return { lastInsertRowid: res.rows[0].id };
}

export async function updateOffer(
  id: number,
  title: string,
  subtitle: string | null,
  code: string | null,
  image: string | null,
  targetUrl: string | null,
  ctaText: string,
  startDate: string | null,
  endDate: string | null,
  isActive: number,
  serviceId: number | null,
  categoryId: number | null,
  discountType: string | null,
  discountValue: number | null,
  maxDiscount: number | null,
  minOrderAmount: number | null,
  status: string,
  usageLimit: number | null,
  email: string
) {
  return query(`
    UPDATE offers SET
      title = $1, subtitle = $2, code = $3, image = $4, target_url = $5, cta_text = $6, 
      start_date = $7, end_date = $8, is_active = $9, service_id = $10, category_id = $11, 
      discount_type = $12, discount_value = $13, max_discount = $14, min_order_amount = $15, 
      status = $16, usage_limit = $17, updated_by = $18, updated_at = TO_CHAR(CURRENT_TIMESTAMP, 'YYYY-MM-DD HH24:MI:SS')
    WHERE id = $19
  `, [
    title, subtitle, code, image, targetUrl, ctaText, 
    startDate, endDate, isActive, serviceId, categoryId, 
    discountType, discountValue, maxDiscount, minOrderAmount, 
    status, usageLimit, email, id
  ]);
}

export async function deleteOffer(id: number) {
  return query("DELETE FROM offers WHERE id = $1", [id]);
}

export async function getOffersCount() {
  const res = await query("SELECT count(*) as count FROM offers");
  return parseInt(res.rows[0].count);
}

export async function updateOfferStatus(id: number, status: string) {
  const isActive = status === "visible" ? 1 : 0;
  return query("UPDATE offers SET status = $1, is_active = $2 WHERE id = $3", [status, isActive, id]);
}

export async function updateCategoryStatus(id: number, isActive: number) {
  return query("UPDATE categories SET is_active = $1 WHERE id = $2", [isActive, id]);
}

export async function updateServiceStatus(id: number, isActive: number) {
  return query("UPDATE services SET is_active = $1 WHERE id = $2", [isActive, id]);
}

export async function getServiceDiscounts() {
  const res = await query(`
    SELECT sd.*, s.name as service_name
    FROM service_discounts sd
    JOIN services s ON sd.service_id = s.id
  `);
  return res.rows;
}

export async function addServiceDiscount(
  serviceId: number,
  discountType: string,
  discountValue: number,
  startDate: string | null,
  endDate: string | null
) {
  const res = await query(`
    INSERT INTO service_discounts (service_id, discount_type, discount_value, start_date, end_date, is_active)
    VALUES ($1, $2, $3, $4, $5, 1) RETURNING id
  `, [serviceId, discountType, discountValue, startDate, endDate]);
  return { lastInsertRowid: res.rows[0].id };
}

export async function updateServiceDiscount(
  id: number,
  serviceId: number,
  discountType: string,
  discountValue: number,
  startDate: string | null,
  endDate: string | null,
  isActive: number
) {
  return query(`
    UPDATE service_discounts 
    SET service_id = $1, discount_type = $2, discount_value = $3, start_date = $4, end_date = $5, is_active = $6
    WHERE id = $7
  `, [serviceId, discountType, discountValue, startDate, endDate, isActive, id]);
}

export async function deleteServiceDiscount(id: number) {
  return query("DELETE FROM service_discounts WHERE id = $1", [id]);
}

export async function getOfferUsageCount(code: string) {
  const res = await query("SELECT count(*) as count FROM bookings WHERE notes LIKE $1", [`%${code}%`]);
  return parseInt(res.rows[0].count);
}

export async function updateOfferOrders(orders: { id: number; display_order: number }[]) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    for (const item of orders) {
      await client.query("UPDATE offers SET display_order = $1 WHERE id = $2", [item.display_order, item.id]);
    }
    await client.query("COMMIT");
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }
}

export async function getUserByEmail(email: string) {
  const res = await query("SELECT * FROM users WHERE email = $1", [email]);
  return res.rows[0] || null;
}

export async function createUser(email: string, hash: string) {
  return query("INSERT INTO users (email, password) VALUES ($1, $2)", [email, hash]);
}

export async function updateCategoryOrders(orders: { id: number; display_order: number }[]) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    for (const item of orders) {
      await client.query("UPDATE categories SET display_order = $1 WHERE id = $2", [item.display_order, item.id]);
    }
    await client.query("COMMIT");
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }
}

