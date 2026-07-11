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
  const websiteName = "OnCar";
  const description = settings?.meta_description || SITE_CONFIG.description;
  const url = "https://oncar.in";
  const phone = "+919213466544";
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
    "telephone": phone,
    "email": email,
    "image": ogImage,
    "priceRange": "₹399–₹7,499",
    "serviceType": "Personal Driving Instructor",
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
    "areaServed": {
      "@type": "AdministrativeArea",
      "name": "Surat, Gujarat, India"
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday"
         ],
        "opens": "07:00",
        "closes": "22:00"
      }
    ]
  };

  // 2. Service Schemas for 6 required services
  const servicesList = [
    {
      name: "Personal Driving Instructor",
      description: "Get a professional, background-verified personal driving instructor in Surat for customized one-to-one lessons."
    },
    {
      name: "Own Car Driving Training",
      description: "Learn driving confidently in the comfort and familiarity of your own hatchback, sedan, or SUV."
    },
    {
      name: "Automatic Car Driving Training",
      description: "Master automatic transmission controls, creeping, gear selection, and smooth highway driving in Surat."
    },
    {
      name: "Manual Car Driving Training",
      description: "Learn clutch control, smooth gear shifts, hill starts, and engine braking for manual cars in Surat."
    },
    {
      name: "City Traffic Driving Practice",
      description: "Build confidence in heavy Surat traffic, narrow market streets, flyovers, and busy roundabouts."
    },
    {
      name: "Parking and Reverse Driving Practice",
      description: "Learn parallel parking, reverse parking, angular parking, tight U-turns, and steering estimation."
    }
  ];

  const serviceSchemas = servicesList.map((svc) => ({
    "@context": "https://schema.org",
    "@type": "Service",
    "name": svc.name,
    "description": svc.description,
    "serviceType": svc.name,
    "provider": {
      "@type": "LocalBusiness",
      "name": websiteName,
      "telephone": phone,
      "url": url
    },
    "areaServed": {
      "@type": "AdministrativeArea",
      "name": "Surat, Gujarat, India"
    },
    "offers": {
      "@type": "AggregateOffer",
      "lowPrice": "399",
      "highPrice": "7499",
      "priceCurrency": "INR"
    }
  }));

  // 3. FAQ Schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Can I learn driving in my own car?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. OnCar instructors train you in your own manual or automatic car."
        }
      },
      {
        "@type": "Question",
        "name": "Is OnCar available across Surat?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "OnCar currently provides service in selected areas of Surat. Customers can confirm location availability during booking."
        }
      },
      {
        "@type": "Question",
        "name": "What is the trial session price?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The trial driving session starts from ₹399."
        }
      },
      {
        "@type": "Question",
        "name": "Does the instructor come to my location?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. The instructor comes to the confirmed customer location and time slot."
        }
      },
      {
        "@type": "Question",
        "name": "Can beginners book OnCar?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. OnCar training is suitable for beginners and drivers who want to improve their road confidence."
        }
      }
    ]
  };

  const compiledSchemas = [localBusiness, ...serviceSchemas, faqSchema];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(compiledSchemas) }}
    />
  );
}

