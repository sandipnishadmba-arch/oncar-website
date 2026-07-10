import { SITE_CONFIG } from "@/lib/constants";

interface Category {
  id: number;
  name: string;
  slug: string;
  type: string;
}

interface JsonLdProps {
  settings?: {
    website_name: string;
    meta_description: string;
    url: string;
    phone: string;
    email: string;
    address: string;
    og_image: string;
  };
  categories?: Category[];
}

export function JsonLd({ settings, categories = [] }: JsonLdProps) {
  const websiteName = settings?.website_name || SITE_CONFIG.name;
  const description = settings?.meta_description || SITE_CONFIG.description;
  const url = settings?.url || SITE_CONFIG.url;
  const phone = settings?.phone || SITE_CONFIG.phone;
  const email = settings?.email || SITE_CONFIG.email;
  const addressStr = settings?.address || SITE_CONFIG.address;
  const ogImage = settings?.og_image || SITE_CONFIG.ogImage;

  const localBusiness = {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    name: websiteName,
    description: description,
    url: url,
    telephone: phone,
    email: email,
    address: {
      "@type": "PostalAddress",
      streetAddress: addressStr,
      addressLocality: "Surat",
      addressRegion: "Gujarat",
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 21.1702,
      longitude: 72.8311,
    },
    areaServed: {
      "@type": "City",
      name: "Surat",
    },
    priceRange: "₹₹",
    image: ogImage,
    sameAs: [],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Worker On Demand Services",
      itemListElement: categories.map((cat) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: cat.name,
          description: `Book professional ${cat.name.toLowerCase()} services in Surat.`,
          url: `${url}/services/${cat.slug}`,
        },
      })),
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusiness) }}
    />
  );
}
