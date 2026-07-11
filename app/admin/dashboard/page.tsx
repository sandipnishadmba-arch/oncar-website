import { getAuthUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import Database from "better-sqlite3";
import path from "path";
import Link from "next/link";
import { LayoutGrid, Wrench, FileText, ClipboardList, Clock, CheckCircle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await getAuthUser();
  if (!user) {
    redirect("/admin");
  }

  const dbPath = path.join(process.cwd(), "data", "database.db");
  const db = new Database(dbPath);

  // Fetch counts
  const categoryCount = db.prepare("SELECT count(*) as count FROM categories").get() as { count: number };
  const serviceCount = db.prepare("SELECT count(*) as count FROM services").get() as { count: number };
  
  const instantBookings = db.prepare("SELECT count(*) as count FROM bookings WHERE type = 'instant'").get() as { count: number };
  const quotationRequests = db.prepare("SELECT count(*) as count FROM bookings WHERE type = 'quotation'").get() as { count: number };

  // Fetch recent bookings
  const recentBookings = db.prepare(`
    SELECT * FROM bookings 
    ORDER BY created_at DESC 
    LIMIT 5
  `).all() as {
    id: number;
    type: string;
    service_name: string | null;
    category_name: string;
    price: number | null;
    customer_name: string;
    phone: string;
    address: string;
    preferred_date: string | null;
    preferred_time: string | null;
    notes: string | null;
    created_at: string;
  }[];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-primary">Dashboard Overview</h1>
        <p className="text-muted text-sm mt-1">Real-time statistics and bookings for OnCar Surat.</p>
      </div>

      {/* Grid of Stats Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white border border-border p-6 rounded-3xl shadow-sm flex items-center gap-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <LayoutGrid className="h-6 w-6" />
          </div>
          <div>
            <span className="block text-2xl font-bold text-primary">{categoryCount.count}</span>
            <span className="block text-xs text-muted font-medium">Total Categories</span>
          </div>
        </div>

        <div className="bg-white border border-border p-6 rounded-3xl shadow-sm flex items-center gap-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Wrench className="h-6 w-6" />
          </div>
          <div>
            <span className="block text-2xl font-bold text-primary">{serviceCount.count}</span>
            <span className="block text-xs text-muted font-medium">Active Services</span>
          </div>
        </div>

        <div className="bg-white border border-border p-6 rounded-3xl shadow-sm flex items-center gap-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#25D366]/10 text-[#20BD5A]">
            <CheckCircle className="h-6 w-6" />
          </div>
          <div>
            <span className="block text-2xl font-bold text-primary">{instantBookings.count}</span>
            <span className="block text-xs text-muted font-medium">Instant Bookings</span>
          </div>
        </div>

        <div className="bg-white border border-border p-6 rounded-3xl shadow-sm flex items-center gap-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary/15 text-secondary">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <span className="block text-2xl font-bold text-primary">{quotationRequests.count}</span>
            <span className="block text-xs text-muted font-medium">Quotation Requests</span>
          </div>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="bg-white border border-border rounded-3xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h2 className="text-xl font-bold text-primary">Recent WhatsApp Enquiries</h2>
          <Link href="/admin/bookings" className="text-sm font-semibold text-primary hover:underline">
            View All Enquiries
          </Link>
        </div>

        {recentBookings.length === 0 ? (
          <div className="p-12 text-center text-muted text-sm">
            <ClipboardList className="h-12 w-12 mx-auto text-muted/30 mb-3" />
            No enquiries received yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface text-xs font-semibold text-primary uppercase border-b border-border">
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Service/Category</th>
                  <th className="px-6 py-4">Phone / Address</th>
                  <th className="px-6 py-4">Schedule</th>
                  <th className="px-6 py-4">Enquiry Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-sm">
                {recentBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-surface/50">
                    <td className="px-6 py-4 font-semibold text-primary">{b.customer_name}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        b.type === "instant" 
                          ? "bg-green-50 text-green-700 border border-green-150" 
                          : "bg-blue-50 text-blue-700 border border-blue-150"
                      }`}>
                        {b.type === "instant" ? "Instant" : "Quotation"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-primary block">{b.service_name || "Custom project"}</span>
                      <span className="text-xs text-muted block">{b.category_name}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="block text-primary font-medium">{b.phone}</span>
                      <span className="block text-xs text-muted truncate max-w-[200px]" title={b.address}>{b.address}</span>
                    </td>
                    <td className="px-6 py-4">
                      {b.type === "instant" ? (
                        <>
                          <span className="block text-primary font-medium">{b.preferred_date}</span>
                          <span className="block text-xs text-muted">{b.preferred_time}</span>
                        </>
                      ) : (
                        <span className="text-xs text-muted">N/A (Quotation)</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-xs text-muted">
                      {new Date(b.created_at).toLocaleString("en-IN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
