// Database Helper for OnCar using SQLite
import Database from "better-sqlite3";
import path from "path";

const dbPath = path.join(process.cwd(), "data", "database.db");
const db = new Database(dbPath);

// Initialize DB and Seed OnCar data if not present
export function initDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS site_settings (
      key TEXT PRIMARY KEY,
      value TEXT
    );
  `);

  // Migrate features column if not present
  try {
    db.exec("ALTER TABLE services ADD COLUMN features TEXT");
  } catch (e) {
    // Column already exists, ignore
  }

  // Check if OnCar is already seeded
  const oncarCategory = db.prepare("SELECT * FROM categories WHERE slug = 'own-car-driving'").get();
  if (!oncarCategory) {
    console.log("Seeding database with OnCar startup data...");
    
    // Clear old tables
    db.exec("DELETE FROM services");
    db.exec("DELETE FROM categories");
    db.exec("DELETE FROM site_settings");
    db.exec("DELETE FROM bookings");

    // Insert Own Car Driving category
    db.prepare(`
      INSERT INTO categories (id, name, slug, image, icon, type, display_order, is_active)
      VALUES (1, 'Own Car Driving', 'own-car-driving', 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=500&fit=crop', 'Car', 'instant', 1, 1)
    `).run();

    // Insert OnCar plans/packages
    const plans = [
      {
        id: 1,
        name: "Trial Class",
        description: "Own car driving confidence check by certified instructor. Best for first-time trial.",
        price: 399,
        duration: "1 Hour",
        image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=500&fit=crop",
        is_active: 1,
        is_featured: 1,
        is_popular: 0,
        arrival_time: "Flexible",
        is_recommended: 0,
        features: JSON.stringify([
          "1 Hour Session",
          "Own car driving confidence check",
          "Instructor guidance",
          "Best for first-time trial"
        ])
      },
      {
        id: 2,
        name: "Starter",
        description: "Learn steering control, brake and accelerator basics, and build road confidence.",
        price: 1299,
        duration: "3 Hours",
        image: "https://images.unsplash.com/photo-1506015391300-4802dc74de2e?w=500&fit=crop",
        is_active: 1,
        is_featured: 1,
        is_popular: 0,
        arrival_time: "Flexible",
        is_recommended: 0,
        features: JSON.stringify([
          "3 Hours Session",
          "Basic steering control",
          "Brake & accelerator control",
          "Road confidence basics"
        ])
      },
      {
        id: 3,
        name: "Basic",
        description: "Learn city road practice, U-turns, parking, and build traffic confidence.",
        price: 1999,
        duration: "5 Hours",
        image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=500&fit=crop",
        is_active: 1,
        is_featured: 1,
        is_popular: 0,
        arrival_time: "Flexible",
        is_recommended: 0,
        features: JSON.stringify([
          "5 Hours Session",
          "City road practice",
          "Turns, U-turns",
          "Parking basics",
          "Traffic confidence"
        ])
      },
      {
        id: 4,
        name: "Popular",
        description: "Comprehensive package including city traffic driving, reverse practice, and flyovers.",
        price: 3999,
        duration: "10 Hours",
        image: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=500&fit=crop",
        is_active: 1,
        is_featured: 1,
        is_popular: 1,
        arrival_time: "Flexible",
        is_recommended: 1,
        features: JSON.stringify([
          "10 Hours Session",
          "City traffic driving",
          "Reverse & parking practice",
          "U-turn & flyover driving",
          "Real road confidence",
          "Personalized guidance"
        ])
      },
      {
        id: 5,
        name: "Premium",
        description: "Advanced practice including highway basics, night driving, parallel and reverse parking.",
        price: 5799,
        duration: "15 Hours",
        image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=500&fit=crop",
        is_active: 1,
        is_featured: 1,
        is_popular: 0,
        arrival_time: "Flexible",
        is_recommended: 0,
        features: JSON.stringify([
          "15 Hours Session",
          "Everything in Popular",
          "Heavy traffic practice",
          "Parallel & reverse parking",
          "Highway basics",
          "Night driving basics"
        ])
      },
      {
        id: 6,
        name: "Confidence+",
        description: "Ultimate practice sessions for daily routes and extreme traffic before driving alone.",
        price: 7499,
        duration: "20 Hours",
        image: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=500&fit=crop",
        is_active: 1,
        is_featured: 1,
        is_popular: 0,
        arrival_time: "Flexible",
        is_recommended: 0,
        features: JSON.stringify([
          "20 Hours Session",
          "Everything in Premium",
          "Extra practice on weak areas",
          "Daily route practice",
          "Advanced confidence training",
          "Ideal before driving alone"
        ])
      }
    ];

    const insertSvc = db.prepare(`
      INSERT INTO services (id, category_id, name, description, price, duration, image, is_active, is_featured, is_popular, display_order, arrival_time, is_recommended, features)
      VALUES (?, 1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    plans.forEach((p, idx) => {
      insertSvc.run(p.id, p.name, p.description, p.price, p.duration, p.image, p.is_active, p.is_featured, p.is_popular, idx + 1, p.arrival_time, p.is_recommended, p.features);
    });

    // Seed site settings for OnCar
    const settings = [
      { key: "website_name", value: "OnCar" },
      { key: "logo_text", value: "OnCar" },
      { key: "tagline", value: "Apni Car Mein Driving Seekho, Apne Time Par" },
      { key: "email", value: "info@oncar.in" },
      { key: "phone", value: "9213466544" },
      { key: "whatsapp_number", value: "9213466544" },
      { key: "address", value: "Surat City, Gujarat, India" },
      { key: "google_maps_url", value: "https://maps.google.com/?q=Surat,Gujarat" },
      { key: "serving_text", value: "Serving Only Surat City" },
      { key: "available_time_slots", value: JSON.stringify(["07:00 AM", "08:00 AM", "09:00 AM", "10:00 AM", "05:00 PM", "06:00 PM", "07:00 PM", "08:00 PM", "09:00 PM", "Custom Time"]) },
      { key: "advance_booking_days", value: "7" },
      { key: "hero_title", value: "Apni Car Mein Driving Seekho, Apne Time Par" },
      { key: "hero_subtitle", value: "Verified instructor aapke ghar/location par aakar aapki own car me confidence driving sikhayega. Surat city ke liye premium driving learning service." },
      { key: "hero_image", value: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=1200&h=630&fit=crop" },
      { key: "about_title", value: "About OnCar" },
      { key: "about_text", value: "OnCar brings professional driving classes directly to your doorstep in Surat. Why learn in a school car when you have to drive your own car?" },
      { key: "whatsapp_cta_text", value: "Book Trial" },
      { key: "plans_cta_text", value: "See Plans" },
      { key: "video_url", value: "" }, 
      { key: "video_enabled", value: "false" },
      { key: "payment_qr_url", value: "" },
      { key: "payment_upi_id", value: "9213466544@upi" },
      { key: "payment_upi_name", value: "OnCar Surat" },
      { key: "razorpay_enabled", value: "true" },
      { key: "razorpay_key_id", value: "rzp_test_L4eY8uYtF6Gq1d" },
      { key: "trust_badges", value: JSON.stringify([
        { title: "Apni Car Practice", description: "Learn in the car you actually own and will drive daily", icon: "Car" },
        { title: "Apne Time Par", description: "Schedule sessions at your convenience, no fixed timings", icon: "Clock" },
        { title: "Verified Instructors", description: "Professional, background-verified guidance at your doorstep", icon: "UserCheck" },
        { title: "Home Pick & Drop", description: "Instructor picks you up from your doorstep in Surat", icon: "MapPin" }
      ]) },
      { key: "testimonials", value: JSON.stringify([
        { id: 1, name: "Rajesh Patel", location: "Adajan, Surat", rating: 5, text: "Excellent training! The instructor was very patient. Learning in my own Creta was the best decision.", service: "10 Hours Package" },
        { id: 2, name: "Priya Shah", location: "Vesu, Surat", rating: 5, text: "I had extreme driving anxiety. OnCar's structured sessions helped me build great confidence in traffic.", service: "15 Hours Package" },
        { id: 3, name: "Amit Desai", location: "Pal, Surat", rating: 5, text: "Convenient home pickup and early morning sessions. Highly recommend OnCar for busy professionals.", service: "Trial Class" },
        { id: 4, name: "Neha Mehta", location: "City Light, Surat", rating: 5, text: "Great reverse parking and turning practice. Very reliable service in Surat.", service: "5 Hours Package" }
      ]) },
      { key: "faqs", value: JSON.stringify([
        { question: "Kya meri own car me sikhayenge?", answer: "Haan, hum sirf aapki apni (own) car me hi driving sikhate hain taaki aapko apni car chalane me real-world confidence mile." },
        { question: "Instructor ghar par aayega?", answer: "Haan, verified instructor aapke ghar ya preferred location par aakar aapko pick up karega." },
        { question: "Trial class available hai?", answer: "Haan, Trial Class sirf ₹399 me available hai jisme aap 1 hour ki driving confidence check aur instructor guidance le sakte hain." },
        { question: "Automatic car ke liye available hai?", answer: "Haan, hum Manual aur Automatic dono types ki cars ke liye driving training provide karte hain." },
        { question: "Surat me kaunse areas cover hain?", answer: "Hum Surat ke sabhi major areas cover karte hain jaise Adajan, Vesu, Pal, Piplod, Katargam, Varachha, Jahangirpura, etc." },
        { question: "Payment kaise hoga?", answer: "Aap booking confirm hone ke baad online UPI ya cash ke through instructor ko direct payment kar sakte hain." }
      ]) },
      { key: "url", value: "https://oncar.in" },
      { key: "meta_title", value: "OnCar – Apni Car Mein Driving Seekho | Surat" },
      { key: "meta_description", value: "OnCar Surat – Apni car mein driving seekho apne time par. Verified instructor aapke ghar par aakar own car me driving sikhayega. Trial Class ₹399 se start." },
      { key: "meta_keywords", value: "driving class surat,own car driving surat,driving instructor surat,learn driving surat,car driving course surat,driving lessons surat,oncar surat,driving school surat,driving training surat" },
      { key: "og_image", value: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=1200&h=630&fit=crop" },
    ];

    const insertSetting = db.prepare("REPLACE INTO site_settings (key, value) VALUES (?, ?)");
    settings.forEach(s => {
      insertSetting.run(s.key, s.value);
    });
  }

  // Ensure default/missing settings keys are always present without overwriting edits
  const insertMissingSetting = db.prepare("INSERT OR IGNORE INTO site_settings (key, value) VALUES (?, ?)");
  const defaultKeys = [
    { key: "website_name", value: "OnCar" },
    { key: "logo_text", value: "OnCar" },
    { key: "tagline", value: "Apni Car Mein Driving Seekho, Apne Time Par" },
    { key: "email", value: "info@oncar.in" },
    { key: "phone", value: "9213466544" },
    { key: "whatsapp_number", value: "9213466544" },
    { key: "address", value: "Surat City, Gujarat, India" },
    { key: "google_maps_url", value: "https://maps.google.com/?q=Surat,Gujarat" },
    { key: "serving_text", value: "Serving Only Surat City" },
    { key: "available_time_slots", value: JSON.stringify(["07:00 AM", "08:00 AM", "09:00 AM", "10:00 AM", "05:00 PM", "06:00 PM", "07:00 PM", "08:00 PM", "09:00 PM", "Custom Time"]) },
    { key: "advance_booking_days", value: "7" },
    { key: "hero_title", value: "Apni Car Mein Driving Seekho, Apne Time Par" },
    { key: "hero_subtitle", value: "Verified instructor aapke ghar/location par aakar aapki own car me confidence driving sikhayega. Surat city ke liye premium driving learning service." },
    { key: "hero_image", value: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=1200&h=630&fit=crop" },
    { key: "about_title", value: "About OnCar" },
    { key: "about_text", value: "OnCar brings professional driving classes directly to your doorstep in Surat. Why learn in a school car when you have to drive your own car?" },
    { key: "whatsapp_cta_text", value: "Book Trial" },
    { key: "plans_cta_text", value: "See Plans" },
    { key: "video_url", value: "" }, 
    { key: "video_enabled", value: "false" },
    { key: "payment_qr_url", value: "" },
    { key: "payment_upi_id", value: "9213466544@upi" },
    { key: "payment_upi_name", value: "OnCar Surat" },
    { key: "razorpay_enabled", value: "true" },
    { key: "razorpay_key_id", value: "rzp_test_L4eY8uYtF6Gq1d" },
    { key: "trust_badges", value: JSON.stringify([
      { title: "Apni Car Practice", description: "Learn in the car you actually own and will drive daily", icon: "Car" },
      { title: "Apne Time Par", description: "Schedule sessions at your convenience, no fixed timings", icon: "Clock" },
      { title: "Verified Instructors", description: "Professional, background-verified guidance at your doorstep", icon: "UserCheck" },
      { title: "Home Pick & Drop", description: "Instructor picks you up from your doorstep in Surat", icon: "MapPin" }
    ]) },
    { key: "testimonials", value: JSON.stringify([
      { id: 1, name: "Rajesh Patel", location: "Adajan, Surat", rating: 5, text: "Excellent training! The instructor was very patient. Learning in my own Creta was the best decision.", service: "10 Hours Package" },
      { id: 2, name: "Priya Shah", location: "Vesu, Surat", rating: 5, text: "I had extreme driving anxiety. OnCar's structured sessions helped me build great confidence in traffic.", service: "15 Hours Package" },
      { id: 3, name: "Amit Desai", location: "Pal, Surat", rating: 5, text: "Convenient home pickup and early morning sessions. Highly recommend OnCar for busy professionals.", service: "Trial Class" },
      { id: 4, name: "Neha Mehta", location: "City Light, Surat", rating: 5, text: "Great reverse parking and turning practice. Very reliable service in Surat.", service: "5 Hours Package" }
    ]) },
    { key: "faqs", value: JSON.stringify([
      { question: "Kya meri own car me sikhayenge?", answer: "Haan, hum sirf aapki apni (own) car me hi driving sikhate hain taaki aapko apni car chalane me real-world confidence mile." },
      { question: "Instructor ghar par aayega?", answer: "Haan, verified instructor aapke ghar ya preferred location par aakar aapko pick up karega." },
      { question: "Trial class available hai?", answer: "Haan, Trial Class sirf ₹399 me available hai jisme aap 1 hour ki driving confidence check aur instructor guidance le sakte hain." },
      { question: "Automatic car ke liye available hai?", answer: "Haan, hum Manual aur Automatic dono types ki cars ke liye driving training provide karte hain." },
      { question: "Surat me kaunse areas cover hain?", answer: "Hum Surat ke sabhi major areas cover karte hain jaise Adajan, Vesu, Pal, Piplod, Katargam, Varachha, Jahangirpura, etc." },
      { question: "Payment kaise hoga?", answer: "Aap booking confirm hone ke baad online UPI ya cash ke through instructor ko direct payment kar sakte hain." }
    ]) },
    { key: "url", value: "https://oncar.in" },
    { key: "meta_title", value: "OnCar – Apni Car Mein Driving Seekho | Surat" },
    { key: "meta_description", value: "OnCar Surat – Apni car mein driving seekho apne time par. Verified instructor aapke ghar par aakar own car me driving sikhayega. Trial Class ₹399 se start." },
    { key: "meta_keywords", value: "driving class surat,own car driving surat,driving instructor surat,learn driving surat,car driving course surat,driving lessons surat,oncar surat,driving school surat,driving training surat" },
    { key: "og_image", value: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=1200&h=630&fit=crop" },
  ];
  defaultKeys.forEach(s => {
    insertMissingSetting.run(s.key, s.value);
  });

  // Migrate offers to OnCar
  const oncarOffer = db.prepare("SELECT * FROM offers WHERE code = 'TRIAL100' OR code = 'FIRSTDRIVE'").get();
  if (!oncarOffer) {
    console.log("Migrating offers database table to OnCar...");
    db.exec("DELETE FROM offers");
    
    const insertOffer = db.prepare(`
      INSERT INTO offers (
        title, subtitle, code, image, target_url, cta_text, start_date, end_date, 
        service_id, category_id, discount_type, discount_value, max_discount, min_order_amount, 
        status, usage_limit, display_order, created_by, updated_by, created_at, updated_at
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, 
        ?, ?, ?, ?, ?, ?, 
        ?, ?, ?, 'admin@oncar.in', 'admin@oncar.in', datetime('now', 'localtime'), datetime('now', 'localtime')
      )
    `);
    
    // First Drive Discount (all packages except Trial)
    insertOffer.run(
      "First Drive Discount",
      "Flat ₹100 OFF on your first driving learning plan!",
      "FIRSTDRIVE",
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=500&fit=crop",
      "/#plans",
      "Book Now",
      null, null,
      null, 1,
      "flat", 100,
      100, 1000,
      "visible", null, 1
    );
    
    // Trial Class Special
    insertOffer.run(
      "Trial Class Special",
      "Book a 1-hour Trial Class for just ₹299 (Flat ₹100 off)!",
      "TRIAL100",
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=500&fit=crop",
      "/#plans",
      "Claim Offer",
      null, null,
      1, 1,
      "flat", 100,
      100, 399,
      "visible", null, 2
    );
  }
}

// Call on startup
initDb();

export function getSettings() {
  const rows = db.prepare("SELECT * FROM site_settings").all() as { key: string; value: string }[];
  const settings: Record<string, any> = {};
  rows.forEach(r => {
    try {
      settings[r.key] = JSON.parse(r.value);
    } catch {
      settings[r.key] = r.value;
    }
  });
  return settings;
}

export function updateSetting(key: string, value: string) {
  const stmt = db.prepare("REPLACE INTO site_settings (key, value) VALUES (?, ?)");
  return stmt.run(key, value);
}

export function updateSettings(settings: Record<string, any>) {
  const stmt = db.prepare("REPLACE INTO site_settings (key, value) VALUES (?, ?)");
  const transaction = db.transaction((data: Record<string, any>) => {
    for (const [key, value] of Object.entries(data)) {
      const stringValue = typeof value === "object" && value !== null ? JSON.stringify(value) : String(value);
      stmt.run(key, stringValue);
    }
  });
  transaction(settings);
  return { changes: Object.keys(settings).length };
}

export function getCategories() {
  return db.prepare("SELECT * FROM categories ORDER BY display_order ASC").all() as any[];
}

export function getServices() {
  const services = db.prepare("SELECT * FROM services ORDER BY display_order ASC").all() as any[];
  return services.map(s => {
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
}

export function getServiceById(id: number) {
  const s = db.prepare("SELECT * FROM services WHERE id = ?").get(id) as any;
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

export function getCategoryById(id: number) {
  return db.prepare("SELECT * FROM categories WHERE id = ?").get(id) as any;
}

export function addCategory(name: string, slug: string, image: string, icon: string, type: string) {
  const maxOrder = db.prepare("SELECT MAX(display_order) as maxOrder FROM categories").get() as { maxOrder: number | null };
  const nextOrder = (maxOrder?.maxOrder || 0) + 1;
  const stmt = db.prepare(`
    INSERT INTO categories (name, slug, image, icon, type, display_order, is_active)
    VALUES (?, ?, ?, ?, ?, ?, 1)
  `);
  const info = stmt.run(name, slug, image, icon, type, nextOrder);
  return { lastInsertRowid: info.lastInsertRowid };
}

export function updateCategory(id: number, name: string, slug: string, image: string, icon: string, type: string, isActive: number) {
  const stmt = db.prepare(`
    UPDATE categories 
    SET name = ?, slug = ?, image = ?, icon = ?, type = ?, is_active = ?
    WHERE id = ?
  `);
  return stmt.run(name, slug, image, icon, type, isActive, id);
}

export function deleteCategory(id: number) {
  return db.prepare("DELETE FROM categories WHERE id = ?").run(id);
}

export function addService(
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
  const maxOrder = db.prepare("SELECT MAX(display_order) as maxOrder FROM services").get() as { maxOrder: number | null };
  const nextOrder = (maxOrder?.maxOrder || 0) + 1;
  const stmt = db.prepare(`
    INSERT INTO services (category_id, name, description, price, duration, image, display_order, is_active, is_featured, is_popular, arrival_time, is_recommended, features)
    VALUES (?, ?, ?, ?, ?, ?, ?, 1, 0, 0, ?, ?, ?)
  `);
  const info = stmt.run(categoryId, name, description, price, duration, image, nextOrder, arrivalTime, isRecommended, features || '[]');
  return { lastInsertRowid: info.lastInsertRowid };
}

export function updateService(
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
  const stmt = db.prepare(`
    UPDATE services 
    SET category_id = ?, name = ?, description = ?, price = ?, duration = ?, image = ?, is_active = ?, is_featured = ?, is_popular = ?, arrival_time = ?, is_recommended = ?, features = ?
    WHERE id = ?
  `);
  return stmt.run(categoryId, name, description, price, duration, image, isActive, isFeatured, isPopular, arrivalTime, isRecommended, features || '[]', id);
}

export function deleteService(id: number) {
  return db.prepare("DELETE FROM services WHERE id = ?").run(id);
}

export function getBookings() {
  return db.prepare("SELECT * FROM bookings ORDER BY created_at DESC").all() as any[];
}

export function createBooking(data: any) {
  const stmt = db.prepare(`
    INSERT INTO bookings (type, service_name, category_name, price, customer_name, phone, address, preferred_date, preferred_time, notes, status, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
  `);
  const info = stmt.run(
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
    data.status || 'pending'
  );
  return { lastInsertRowid: info.lastInsertRowid };
}

export function updateBookingStatus(id: number, status: string) {
  return db.prepare("UPDATE bookings SET status = ? WHERE id = ?").run(status, id);
}

export function updateBooking(id: number, status: string, assignedWorker?: string | null) {
  const stmt = db.prepare("UPDATE bookings SET status = ?, assigned_worker = ? WHERE id = ?");
  return stmt.run(status, assignedWorker || null, id);
}

export function getCategoriesCount() {
  const row = db.prepare("SELECT count(*) as count FROM categories").get() as { count: number };
  return row.count;
}

export function getServicesCount() {
  const row = db.prepare("SELECT count(*) as count FROM services").get() as { count: number };
  return row.count;
}

export function getBookingsCount() {
  const row = db.prepare("SELECT count(*) as count FROM bookings").get() as { count: number };
  return row.count;
}

export function getRevenueStats() {
  const row = db.prepare("SELECT sum(price) as total, count(*) as count FROM bookings WHERE status = 'completed'").get() as { total: number | null, count: number };
  return {
    total_revenue: row.total || 0,
    completed_bookings: row.count
  };
}

export function getDashboardStats() {
  const categoryCount = db.prepare("SELECT count(*) as count FROM categories").get() as { count: number };
  const serviceCount = db.prepare("SELECT count(*) as count FROM services WHERE is_active = 1").get() as { count: number };
  const bookingCount = db.prepare("SELECT count(*) as count FROM bookings").get() as { count: number };
  const revenueSum = db.prepare("SELECT sum(price) as total FROM bookings WHERE status = 'completed'").get() as { total: number | null };

  return {
    totalBookings: bookingCount.count,
    totalRevenue: revenueSum.total || 0,
    activeServices: serviceCount.count,
    activeOffers: 0
  };
}

export function getRecentBookings() {
  return db.prepare("SELECT * FROM bookings ORDER BY created_at DESC LIMIT 5").all() as any[];
}

export function createSession(id: string, userId: number, expiresAt: Date) {
  db.prepare("INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)").run(id, userId, expiresAt.toISOString());
}

export function getSession(id: string) {
  const session = db.prepare("SELECT * FROM sessions WHERE id = ?").get(id) as any;
  if (!session) return null;
  const user = db.prepare("SELECT email FROM users WHERE id = ?").get(session.user_id) as any;
  return {
    id: session.id,
    user_id: session.user_id,
    expires_at: session.expires_at,
    email: user?.email || ""
  };
}

export function deleteSession(id: string) {
  db.prepare("DELETE FROM sessions WHERE id = ?").run(id);
}

export function cleanExpiredSessions() {
  db.prepare("DELETE FROM sessions WHERE expires_at < datetime('now')").run();
}

export function updateServiceOrders(orders: { id: number; display_order: number }[]) {
  const stmt = db.prepare("UPDATE services SET display_order = ? WHERE id = ?");
  const transaction = db.transaction((data: { id: number; display_order: number }[]) => {
    for (const item of data) {
      stmt.run(item.display_order, item.id);
    }
  });
  transaction(orders);
}

export function getOffers() {
  return db.prepare("SELECT * FROM offers ORDER BY display_order ASC").all() as any[];
}

export function addOffer(
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
  const maxOrder = db.prepare("SELECT MAX(display_order) as maxOrder FROM offers").get() as { maxOrder: number | null };
  const nextOrder = (maxOrder?.maxOrder || 0) + 1;
  const stmt = db.prepare(`
    INSERT INTO offers (
      title, subtitle, code, image, target_url, cta_text, start_date, end_date, 
      service_id, category_id, discount_type, discount_value, max_discount, min_order_amount, 
      status, usage_limit, display_order, created_by, updated_by, created_at, updated_at
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?, ?, 
      ?, ?, ?, ?, ?, ?, 
      ?, ?, ?, ?, ?, datetime('now', 'localtime'), datetime('now', 'localtime')
    )
  `);
  const info = stmt.run(
    title, subtitle, code, image, targetUrl, ctaText, startDate, endDate,
    serviceId, categoryId, discountType, discountValue, maxDiscount, minOrderAmount,
    status, usageLimit, nextOrder, email, email
  );
  return { lastInsertRowid: info.lastInsertRowid };
}

export function updateOffer(
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
  const stmt = db.prepare(`
    UPDATE offers SET
      title = ?, subtitle = ?, code = ?, image = ?, target_url = ?, cta_text = ?, 
      start_date = ?, end_date = ?, is_active = ?, service_id = ?, category_id = ?, 
      discount_type = ?, discount_value = ?, max_discount = ?, min_order_amount = ?, 
      status = ?, usage_limit = ?, updated_by = ?, updated_at = datetime('now', 'localtime')
    WHERE id = ?
  `);
  return stmt.run(
    title, subtitle, code, image, targetUrl, ctaText, 
    startDate, endDate, isActive, serviceId, categoryId, 
    discountType, discountValue, maxDiscount, minOrderAmount, 
    status, usageLimit, email, id
  );
}

export function deleteOffer(id: number) {
  return db.prepare("DELETE FROM offers WHERE id = ?").run(id);
}

export function getOffersCount() {
  const row = db.prepare("SELECT count(*) as count FROM offers").get() as { count: number };
  return row.count;
}

export function updateOfferStatus(id: number, status: string) {
  const isActive = status === "visible" ? 1 : 0;
  return db.prepare("UPDATE offers SET status = ?, is_active = ? WHERE id = ?").run(status, isActive, id);
}

export function updateCategoryStatus(id: number, isActive: number) {
  return db.prepare("UPDATE categories SET is_active = ? WHERE id = ?").run(isActive, id);
}

export function updateServiceStatus(id: number, isActive: number) {
  return db.prepare("UPDATE services SET is_active = ? WHERE id = ?").run(isActive, id);
}

export function getServiceDiscounts() {
  return db.prepare(`
    SELECT sd.*, s.name as service_name
    FROM service_discounts sd
    JOIN services s ON sd.service_id = s.id
  `).all() as any[];
}

export function addServiceDiscount(
  serviceId: number,
  discountType: string,
  discountValue: number,
  startDate: string | null,
  endDate: string | null
) {
  const stmt = db.prepare(`
    INSERT INTO service_discounts (service_id, discount_type, discount_value, start_date, end_date, is_active)
    VALUES (?, ?, ?, ?, ?, 1)
  `);
  const info = stmt.run(serviceId, discountType, discountValue, startDate, endDate);
  return { lastInsertRowid: info.lastInsertRowid };
}

export function updateServiceDiscount(
  id: number,
  serviceId: number,
  discountType: string,
  discountValue: number,
  startDate: string | null,
  endDate: string | null,
  isActive: number
) {
  const stmt = db.prepare(`
    UPDATE service_discounts 
    SET service_id = ?, discount_type = ?, discount_value = ?, start_date = ?, end_date = ?, is_active = ?
    WHERE id = ?
  `);
  return stmt.run(serviceId, discountType, discountValue, startDate, endDate, isActive, id);
}

export function deleteServiceDiscount(id: number) {
  return db.prepare("DELETE FROM service_discounts WHERE id = ?").run(id);
}

export function getOfferUsageCount(code: string) {
  const row = db.prepare("SELECT count(*) as count FROM bookings WHERE notes LIKE ?").get(`%${code}%`) as { count: number };
  return row.count;
}

export function updateOfferOrders(orders: { id: number; display_order: number }[]) {
  const stmt = db.prepare("UPDATE offers SET display_order = ? WHERE id = ?");
  const transaction = db.transaction((data: { id: number; display_order: number }[]) => {
    for (const item of data) {
      stmt.run(item.display_order, item.id);
    }
  });
  transaction(orders);
}

export function getUserByEmail(email: string) { return db.prepare("SELECT * FROM users WHERE email = ?").get(email); }
export function createUser(email: string, hash: string) { return db.prepare("INSERT INTO users (email, password) VALUES (?, ?)").run(email, hash); }

export const ONCAR_PLANS = [
  {
    id: 1,
    name: "Trial Class",
    description: "Own car driving confidence check by certified instructor. Best for first-time trial.",
    price: 399,
    duration: "1 Hour",
    image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=500&fit=crop",
    is_active: 1,
    is_featured: 1,
    is_popular: 0,
    arrival_time: "Flexible",
    is_recommended: 0,
    features: [
      "1 Hour Session",
      "Own car driving confidence check",
      "Instructor guidance",
      "Best for first-time trial"
    ]
  },
  {
    id: 2,
    name: "Starter",
    description: "Learn steering control, brake and accelerator basics, and build road confidence.",
    price: 1299,
    duration: "3 Hours",
    image: "https://images.unsplash.com/photo-1506015391300-4802dc74de2e?w=500&fit=crop",
    is_active: 1,
    is_featured: 1,
    is_popular: 0,
    arrival_time: "Flexible",
    is_recommended: 0,
    features: [
      "3 Hours Session",
      "Basic steering control",
      "Brake & accelerator control",
      "Road confidence basics"
    ]
  },
  {
    id: 3,
    name: "Basic",
    description: "Learn city road practice, U-turns, parking, and build traffic confidence.",
    price: 1999,
    duration: "5 Hours",
    image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=500&fit=crop",
    is_active: 1,
    is_featured: 1,
    is_popular: 0,
    arrival_time: "Flexible",
    is_recommended: 0,
    features: [
      "5 Hours Session",
      "City road practice",
      "Turns, U-turns",
      "Parking basics",
      "Traffic confidence"
    ]
  },
  {
    id: 4,
    name: "Popular",
    description: "Comprehensive package including city traffic driving, reverse practice, and flyovers.",
    price: 3999,
    duration: "10 Hours",
    image: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=500&fit=crop",
    is_active: 1,
    is_featured: 1,
    is_popular: 1,
    arrival_time: "Flexible",
    is_recommended: 1,
    features: [
      "10 Hours Session",
      "City traffic driving",
      "Reverse & parking practice",
      "U-turn & flyover driving",
      "Real road confidence",
      "Personalized guidance"
    ]
  },
  {
    id: 5,
    name: "Premium",
    description: "Advanced practice including highway basics, night driving, parallel and reverse parking.",
    price: 5799,
    duration: "15 Hours",
    image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=500&fit=crop",
    is_active: 1,
    is_featured: 1,
    is_popular: 0,
    arrival_time: "Flexible",
    is_recommended: 0,
    features: [
      "15 Hours Session",
      "Everything in Popular",
      "Heavy traffic practice",
      "Parallel & reverse parking",
      "Highway basics",
      "Night driving basics"
    ]
  },
  {
    id: 6,
    name: "Confidence+",
    description: "Ultimate practice sessions for daily routes and extreme traffic before driving alone.",
    price: 7499,
    duration: "20 Hours",
    image: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=500&fit=crop",
    is_active: 1,
    is_featured: 1,
    is_popular: 0,
    arrival_time: "Flexible",
    is_recommended: 0,
    features: [
      "20 Hours Session",
      "Everything in Premium",
      "Extra practice on weak areas",
      "Daily route practice",
      "Advanced confidence training",
      "Ideal before driving alone"
    ]
  }
];

