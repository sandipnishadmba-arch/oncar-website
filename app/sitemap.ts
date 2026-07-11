import type { MetadataRoute } from "next";
import { getSettings } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const settings = await getSettings() as any;
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL;
  const baseUrl = envUrl || settings?.url || "https://oncar.in";

  const pages = [
    "",
    "/about",
    "/driving-classes-surat",
    "/learn-driving-in-own-car",
    "/contact",
    "/privacy-policy",
    "/terms",
    "/faq",
  ];

  return pages.map((page) => ({
    url: `${baseUrl}${page}`,
    lastModified: new Date(),
    changeFrequency: page === "" ? "weekly" as const : "monthly" as const,
    priority: page === "" ? 1.0 : 0.8,
  }));
}
