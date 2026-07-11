import Link from "next/link";
import { ArrowLeft, HelpCircle } from "lucide-react";
import { FAQ_ITEMS } from "@/lib/constants";
import { getSettings } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function FAQPage() {
  const settings = await getSettings() as any;
  const faqs = Array.isArray(settings?.faqs) && settings.faqs.length > 0 ? settings.faqs : FAQ_ITEMS;

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq: any) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <div className="bg-white min-h-screen pt-32 pb-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb / Back Button */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-xs font-black text-primary uppercase tracking-widest hover:opacity-80 transition-opacity">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>

        {/* Page Header */}
        <div className="space-y-4 mb-12">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-wider">
            FAQ Guide
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-secondary tracking-tight leading-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-sm text-muted leading-relaxed">
            Got questions about OnCar package bookings, verified driving instructors, coverage areas, or training models in Surat? Read below for full details.
          </p>
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {faqs.map((faq: any, idx: number) => (
            <div key={idx} className="p-6 rounded-2xl bg-surface border border-border/40 shadow-xs">
              <div className="flex gap-3 items-start">
                <div className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                  <HelpCircle className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-secondary">{faq.question}</h3>
                  <p className="text-xs sm:text-sm text-muted font-semibold mt-2.5 leading-relaxed">{faq.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </div>
  );
}
