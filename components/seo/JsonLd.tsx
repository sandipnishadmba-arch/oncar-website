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
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL;
  const url = envUrl || settings?.url || SITE_CONFIG.url;
  const phone = settings?.phone || SITE_CONFIG.phone;
  const email = settings?.email || SITE_CONFIG.email;
  const addressStr = settings?.address || SITE_CONFIG.address;
  const ogImage = settings?.og_image || SITE_CONFIG.ogImage;

  // 1. LocalBusiness Schema
  const localBusiness = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": websiteName,
    "description": description,
    "url": url,
    "telephone": phone.startsWith("+91") ? phone : `+91${phone}`,
    "email": email,
    "image": ogImage,
    "priceRange": "₹₹",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": addressStr,
      "addressLocality": "Surat",
      "addressRegion": "Gujarat",
      "addressCountry": "IN",
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 21.1702,
      "longitude": 72.8311,
    },
    "areaServed": [
      {
        "@type": "City",
        "name": "Surat",
        "sameAs": "https://en.wikipedia.org/wiki/Surat"
      },
      {
        "@type": "State",
        "name": "Gujarat",
        "sameAs": "https://en.wikipedia.org/wiki/Gujarat"
      }
    ],
    "sameAs": []
  };

  // 2. Service Schemas for 5 tailored driving plans
  const servicesList = [
    {
      name: "Trial Driving Session",
      price: 399,
      description: "Own car driving confidence check by certified instructor. Best for first-time trial.",
      duration: "1 Hour"
    },
    {
      name: "Starter Driving Plan",
      price: 1299,
      description: "Learn steering control, brake and accelerator basics, and build road confidence.",
      duration: "3 Hours"
    },
    {
      name: "Popular Driving Plan",
      price: 3999,
      description: "Comprehensive package including city traffic driving, reverse practice, and flyovers.",
      duration: "10 Hours"
    },
    {
      name: "Premium Driving Plan",
      price: 5799,
      description: "Advanced practice including highway basics, night driving, parallel and reverse parking.",
      duration: "15 Hours"
    },
    {
      name: "Confidence+ Driving Plan",
      price: 7499,
      description: "Ultimate practice sessions for daily routes and extreme traffic before driving alone.",
      duration: "20 Hours"
    }
  ];

  const serviceSchemas = servicesList.map((svc) => ({
    "@context": "https://schema.org",
    "@type": "Service",
    "name": svc.name,
    "description": svc.description,
    "serviceType": "Driving Training in Customer’s Own Car",
    "provider": {
      "@type": "LocalBusiness",
      "name": websiteName,
      "telephone": phone,
      "url": url
    },
    "areaServed": [
      {
        "@type": "City",
        "name": "Surat"
      },
      {
        "@type": "State",
        "name": "Gujarat"
      }
    ],
    "offers": {
      "@type": "Offer",
      "price": svc.price.toString(),
      "priceCurrency": "INR",
      "priceSpecification": {
        "@type": "UnitPriceSpecification",
        "price": svc.price.toString(),
        "priceCurrency": "INR",
        "referenceQuantity": {
          "@type": "QuantitativeValue",
          "value": svc.duration.split(" ")[0],
          "unitText": svc.duration.split(" ")[1] || "hour"
        }
      }
    }
  }));

  const compiledSchemas = [localBusiness, ...serviceSchemas];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(compiledSchemas) }}
    />
  );
}

