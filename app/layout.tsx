import type { Metadata } from "next";
import { Suspense } from "react";
import { Inter } from "next/font/google";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { JsonLd } from "@/components/seo/JsonLd";
import { GlobalSearchProvider } from "@/components/search/GlobalSearchProvider";
import { getSettings, getCategories } from "@/lib/db";
import { generatePageMetadata } from "@/lib/seo";
import { headers } from "next/headers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export async function generateMetadata() {
  const settings = getSettings() as any;
  return generatePageMetadata({
    title: settings.meta_title,
    description: settings.meta_description,
    keywords: settings.meta_keywords ? settings.meta_keywords.split(",") : [],
    path: "/",
    ogImage: settings.og_image,
    siteName: settings.website_name,
    siteUrl: settings.url,
  });
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = getSettings() as any;
  const categories = getCategories();

  // Retrieve current path from middleware header
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "/";

  // Check if this is an admin route
  const isAdminRoute = pathname.startsWith("/admin");

  if (isAdminRoute) {
    return (
      <html lang="en" className={inter.variable}>
        <body className="font-sans bg-surface">
          <main>{children}</main>
        </body>
      </html>
    );
  }

  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="font-sans pb-16 lg:pb-0">
        <GlobalSearchProvider settings={settings}>
          <JsonLd settings={settings} categories={categories} />
          <Navbar settings={settings} />
          <main>{children}</main>
          <Footer settings={settings} />

          <Suspense fallback={null}>
            <MobileBottomNav />
          </Suspense>
        </GlobalSearchProvider>
      </body>
    </html>
  );
}
