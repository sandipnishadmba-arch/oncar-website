import type { Metadata } from "next";
import { SITE_CONFIG } from "./constants";

interface PageSEO {
  title: string;
  description: string;
  keywords: string[];
  path: string;
  ogImage?: string;
  siteName?: string;
  siteUrl?: string;
}

export function generatePageMetadata({
  title,
  description,
  keywords,
  path,
  ogImage = SITE_CONFIG.ogImage,
  siteName = SITE_CONFIG.name,
  siteUrl = SITE_CONFIG.url,
}: PageSEO): Metadata {
  const resolvedSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || siteUrl;
  const fullTitle =
    path === "/" && title
      ? title
      : path === "/"
      ? `${siteName} | ${SITE_CONFIG.tagline}`
      : `${title} | ${siteName}`;

  const url = `${resolvedSiteUrl}${path}`;

  return {
    title: fullTitle,
    description,
    keywords: keywords.join(", "),
    authors: [{ name: siteName }],
    creator: siteName,
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "website",
      locale: "en_IN",
      url,
      siteName: siteName,
      title: fullTitle,
      description,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${siteName} - Apni Car Mein Driving Seekho | Surat`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [ogImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export function generateServiceMetadata(
  serviceName: string,
  description: string,
  slug: string,
  keywords: string[],
  siteName = SITE_CONFIG.name,
  siteUrl = SITE_CONFIG.url
): Metadata {
  return generatePageMetadata({
    title: `${serviceName} Services in Surat`,
    description,
    keywords: [
      ...keywords,
      `${serviceName} Surat`,
      `${serviceName} services Gujarat`,
      "own car driving classes Surat",
      siteName,
    ],
    path: `/services/${slug}`,
    siteName,
    siteUrl,
  });
}
