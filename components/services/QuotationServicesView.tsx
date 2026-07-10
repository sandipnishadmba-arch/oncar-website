"use client";

import Link from "next/link";
import { ArrowLeft, ShieldCheck, Star, Clock, Search as SearchIcon } from "lucide-react";
import { QuotationForm } from "./QuotationForm";
import { useSearchOverlay } from "@/components/search/GlobalSearchProvider";

interface QuotationServicesViewProps {
  category: {
    id: number;
    name: string;
    slug: string;
    image: string;
  };
  settings: {
    whatsapp_number: string;
    quotation_message: string;
  };
}

export function QuotationServicesView({ category, settings }: QuotationServicesViewProps) {
  const { openSearch } = useSearchOverlay();

  return (
    <div className="bg-surface min-h-screen pb-16">
      {/* Compact Header Bar - Native App Style */}
      <div className="bg-primary text-white pt-24 pb-4 px-4 sm:px-6 lg:px-8 border-b border-white/10">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-white/80 hover:text-white font-bold transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Home
          </Link>
          <h1 className="text-base font-black tracking-tight">{category.name} Projects</h1>
          <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full font-bold">
            Estimate
          </span>
        </div>
      </div>

      {/* Sticky Global Search Trigger */}
      <div className="sticky top-[72px] z-30 bg-white py-2.5 border-b border-border shadow-xs px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <button
            type="button"
            onClick={() => openSearch()}
            className="w-full relative flex items-center pl-10 pr-3 py-2 rounded-xl border border-border bg-surface text-xs font-semibold text-muted hover:border-secondary hover:bg-white transition-all cursor-text"
          >
            <SearchIcon className="absolute left-3 h-4.5 w-4.5 text-muted" />
            <span>Search all services...</span>
          </button>
        </div>
      </div>

      {/* Quotation Form Section */}
      <section className="py-6 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="mb-6 text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-secondary">
              Free Site Survey
            </span>
            <h2 className="text-2xl font-black text-primary mt-1">
              Request a Custom Quote
            </h2>
            <p className="mt-1 text-xs text-muted max-w-md mx-auto">
              Our supervisor will inspect the parameters and deliver a detailed digital quote.
            </p>
          </div>
          <QuotationForm category={category} settings={settings} />
        </div>
      </section>

      {/* Safety Info (Compact) */}
      <section className="py-8 border-t border-border bg-white px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl grid gap-4 grid-cols-3 text-center">
          <div className="flex flex-col items-center">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-secondary/15 text-secondary mb-1">
              <ShieldCheck className="h-4.5 w-4.5" />
            </div>
            <h4 className="text-[10px] font-bold text-primary">Inspected</h4>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-secondary/15 text-secondary mb-1">
              <Star className="h-4.5 w-4.5" />
            </div>
            <h4 className="text-[10px] font-bold text-primary">Expert Team</h4>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-secondary/15 text-secondary mb-1">
              <Clock className="h-4.5 w-4.5" />
            </div>
            <h4 className="text-[10px] font-bold text-primary">5Y Warranty</h4>
          </div>
        </div>
      </section>
    </div>
  );
}
