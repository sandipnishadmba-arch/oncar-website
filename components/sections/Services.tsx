"use client";

import Link from "next/link";
import { Search as SearchIcon } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getIcon } from "@/lib/icons";
import { useSearchOverlay } from "@/components/search/GlobalSearchProvider";

interface Category {
  id: number;
  name: string;
  slug: string;
  image: string;
  icon: string;
  type: string;
}

interface Service {
  id: number;
  category_id: number;
  name: string;
  description: string;
  price: number;
  duration: string;
  image: string;
  is_active: number;
  is_featured: number;
  is_popular: number;
}

interface ServicesProps {
  categories: Category[];
  services: Service[];
  settings: {
    phone: string;
    whatsapp_number: string;
    booking_message: string;
    quotation_message: string;
    available_time_slots: string[];
    advance_booking_days: string;
  };
}

export function Services({ categories, services, settings }: ServicesProps) {
  const instantCats = categories.filter((c) => c.type === "instant");
  const { openSearch } = useSearchOverlay();

  return (
    <div>
      {/* Search & Main Categories Section */}
      <Section id="instant-services" className="pt-6 pb-12 bg-white">
        <SectionHeader
          eyebrow="KaamOn App"
          title="Select Category to Book"
          description="Instant verified local professionals at your service. Serving only Surat City."
        />

        {/* Global Search Trigger - Always Visible */}
        <div className="mx-auto max-w-xl px-4 mb-10">
          <button
            type="button"
            onClick={() => openSearch()}
            className="w-full relative flex items-center pl-12 pr-4 py-3 rounded-2xl border border-border shadow-sm bg-surface text-sm text-muted hover:border-secondary hover:bg-white hover:ring-2 hover:ring-secondary/15 transition-all duration-200 cursor-text"
          >
            <SearchIcon className="absolute left-4 h-5 w-5 text-muted" />
            <span>Search for Electrician, Plumber, AC Service...</span>
          </button>
        </div>

        {/* main categories selector grid - Native App shortcuts */}
        <div className="mx-auto max-w-4xl px-4">
          <div className="grid grid-cols-3 gap-y-6 gap-x-4 sm:flex sm:flex-wrap sm:items-center sm:justify-center sm:gap-6 justify-items-center">
            {instantCats.map((cat) => {
              const Icon = getIcon(cat.icon);
              return (
                <Link
                  key={cat.id}
                  href={`/services/${cat.slug}`}
                  prefetch={true}
                  className="flex flex-col items-center gap-1.5 group outline-none transition-all duration-200 w-20 text-center"
                >
                  <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-surface border border-border text-primary shadow-sm group-hover:border-primary group-hover:bg-white group-active:scale-95 transition-all duration-150">
                    <Icon className="h-6 w-6 sm:h-7 sm:w-7" />
                  </div>
                  <span className="text-[10px] sm:text-xs font-bold text-muted group-hover:text-primary transition-colors duration-150 line-clamp-2">
                    {cat.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </Section>
    </div>
  );
}
