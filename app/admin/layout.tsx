import { getAuthUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Wrench, FolderKanban, CalendarRange, Settings, LogOut, ShieldAlert } from "lucide-react";
import { headers } from "next/headers";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getAuthUser();
  
  // Detect current path from header
  const headersList = await headers();
  const fullUrl = headersList.get("referer") || "";
  const isLoginPage = fullUrl.endsWith("/admin") || !fullUrl; // Fallback helper

  // Note: We'll do exact path checks in pages for tighter route-level redirects.
  // Here we just provide a premium admin layout wrapping.
  if (!user) {
    // If not authenticated, we just render children (which will be the login form)
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-3xl border border-border shadow-xl">
          {children}
        </div>
      </div>
    );
  }

  // Sidebar Layout for logged-in admin
  return (
    <div className="min-h-screen bg-surface flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-primary text-white shrink-0 flex flex-col justify-between border-r border-white/10">
        <div>
          <div className="p-6 border-b border-white/10 flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-primary font-bold">
              O
            </div>
            <div>
              <span className="text-lg font-bold block leading-tight">OnCar</span>
              <span className="text-[10px] text-white/50 block">Management Panel</span>
            </div>
          </div>

          <nav className="p-4 space-y-1">
            <Link 
              href="/admin/dashboard" 
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 text-sm font-medium text-white/90 hover:text-white transition-colors"
            >
              <LayoutDashboard className="h-4.5 w-4.5 text-secondary" />
              Dashboard
            </Link>
            <Link 
              href="/admin/services" 
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 text-sm font-medium text-white/90 hover:text-white transition-colors"
            >
              <Wrench className="h-4.5 w-4.5 text-secondary" />
              Services
            </Link>
            <Link 
              href="/admin/categories" 
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 text-sm font-medium text-white/90 hover:text-white transition-colors"
            >
              <FolderKanban className="h-4.5 w-4.5 text-secondary" />
              Categories
            </Link>
            <Link 
              href="/admin/bookings" 
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 text-sm font-medium text-white/90 hover:text-white transition-colors"
            >
              <CalendarRange className="h-4.5 w-4.5 text-secondary" />
              Bookings & Quotes
            </Link>
            <Link 
              href="/admin/offers" 
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 text-sm font-medium text-white/90 hover:text-white transition-colors"
            >
              <span className="text-secondary font-bold text-[13px] px-0.5">%</span>
              Promotions & Banners
            </Link>
            <Link 
              href="/admin/settings" 
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 text-sm font-medium text-white/90 hover:text-white transition-colors"
            >
              <Settings className="h-4.5 w-4.5 text-secondary" />
              Settings
            </Link>
          </nav>
        </div>

        <div className="p-4 border-t border-white/10">
          <div className="px-4 py-3 text-xs text-white/40 truncate">
            Logged in as:<br/>
            <span className="font-semibold text-white/70">{user.email}</span>
          </div>
          <Link 
            href="/admin/logout"
            className="flex items-center gap-3 px-4 py-3 mt-2 rounded-xl bg-red-900/20 hover:bg-red-950/40 text-sm font-medium text-red-300 hover:text-red-200 transition-colors"
          >
            <LogOut className="h-4.5 w-4.5" />
            Logout
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto max-h-screen">
        {children}
      </main>
    </div>
  );
}
