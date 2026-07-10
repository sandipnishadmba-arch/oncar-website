"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Clock, ShieldCheck, Star, Search as SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { BookingModal } from "./BookingModal";
import { useSearchOverlay } from "@/components/search/GlobalSearchProvider";
import { getServiceImage } from "@/lib/serviceImages";

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
  discount_type?: string | null;
  discount_value?: number | null;
}

interface InstantServicesViewProps {
  category: {
    id: number;
    name: string;
    slug: string;
    image: string;
  };
  services: Service[];
  settings: {
    phone: string;
    whatsapp_number: string;
    booking_message: string;
    available_time_slots: string[];
    advance_booking_days: string;
  };
}

export function InstantServicesView({ category, services, settings }: InstantServicesViewProps) {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const { openSearch } = useSearchOverlay();
  const searchParams = useSearchParams();
  const bookId = searchParams ? searchParams.get("book") : null;

  useEffect(() => {
    if (bookId) {
      const id = parseInt(bookId, 10);
      const svc = services.find((s) => s.id === id);
      if (svc) {
        setSelectedService(svc);
      }
    }
  }, [bookId, services]);

  const handleCloseModal = () => {
    setSelectedService(null);
    // Remove the ?book= query parameter from URL without reloading
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      params.delete("book");
      const newRelativePathQuery = window.location.pathname + (params.toString() ? "?" + params.toString() : "");
      window.history.replaceState(null, "", newRelativePathQuery);
    }
  };

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
          <h1 className="text-base font-black tracking-tight">{category.name} Catalog</h1>
          <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full font-bold">
            {services.length} items
          </span>
        </div>
      </div>

      {/* Sticky Global Search Trigger - Right below navbar */}
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

      {/* Services Grid (Compact cards: 2 columns on mobile) */}
      <section className="py-6 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {services.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-3xl border border-border shadow-sm">
              <p className="text-muted text-xs font-semibold">No services available in this category.</p>
            </div>
          ) : (
            <div className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {services.map((service) => (
                <article
                  key={service.id}
                  onClick={() => setSelectedService(service)}
                  className="group flex flex-col justify-between h-full overflow-hidden rounded-2xl border border-border bg-white shadow-xs transition-all duration-200 hover:-translate-y-1 hover:shadow-md cursor-pointer"
                >
                  <div className="flex flex-col">
                    {/* Compact Image */}
                    <div className="relative aspect-[4/3] overflow-hidden bg-surface">
                      <Image
                        src={getServiceImage(service.name, category.image, service.image)}
                        alt={service.name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-103"
                        sizes="(max-width: 768px) 50vw, 25vw"
                        loading="lazy"
                      />
                      {service.is_popular === 1 && (
                        <span className="absolute top-2 left-2 inline-flex items-center rounded-full bg-secondary px-2 py-0.5 text-[8px] font-bold text-primary shadow-sm uppercase tracking-wider">
                          Popular
                        </span>
                      )}
                      {service.discount_value && (
                        <span className="absolute top-2 right-2 inline-flex items-center rounded-full bg-green-500 px-2 py-0.5 text-[8px] font-black text-white shadow-sm uppercase tracking-wider">
                          {service.discount_type === "percentage" ? `${service.discount_value}% OFF` : `₹${service.discount_value} OFF`}
                        </span>
                      )}
                    </div>

                    {/* Compact Info Block */}
                    <div className="flex flex-col p-3">
                      <h3 className="text-xs font-black text-primary leading-tight line-clamp-1">
                        {service.name}
                      </h3>
                      
                      <p className="text-[10px] text-muted font-medium mt-1 line-clamp-2 leading-relaxed h-7">
                        {service.description || "Trusted doorstep service across Surat with verified professionals."}
                      </p>
                      
                      {/* Rating & Duration Row */}
                      <div className="flex items-center gap-1.5 mt-2 text-[9px] text-muted font-bold">
                        <span className="flex items-center gap-0.5 text-secondary">
                          <Star className="h-3 w-3 fill-secondary text-secondary" />
                          4.8
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-0.5">
                          <Clock className="h-3 w-3" />
                          {service.duration}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Price and Action Button */}
                  <div className="p-3 pt-0 flex flex-col gap-2">
                    <div className="leading-none pt-2 border-t border-border/40">
                      <span className="block text-[8px] text-muted uppercase font-bold tracking-wider">Starting Price</span>
                      <div className="flex items-baseline gap-1 mt-0.5">
                        <span className="text-sm font-black text-primary">₹{
                          service.discount_value
                            ? service.discount_type === "percentage"
                              ? service.price - Math.round(service.price * service.discount_value / 100)
                              : service.price - service.discount_value
                            : service.price
                        }</span>
                        {service.discount_value && (
                          <span className="line-through text-[10px] text-muted/70 font-bold">
                            ₹{service.price}
                          </span>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="whatsapp"
                      className="w-full py-1.5 text-[10px] font-black uppercase tracking-wider bg-emerald-500 hover:bg-emerald-600 border-none shadow-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedService(service);
                      }}
                    >
                      Book Now
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Safety Info (Compact) */}
      <section className="py-8 border-t border-border bg-white px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl grid gap-4 grid-cols-3 text-center">
          <div className="flex flex-col items-center">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-secondary/15 text-secondary mb-1">
              <ShieldCheck className="h-4.5 w-4.5" />
            </div>
            <h4 className="text-[10px] font-bold text-primary">Verified</h4>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-secondary/15 text-secondary mb-1">
              <Star className="h-4.5 w-4.5" />
            </div>
            <h4 className="text-[10px] font-bold text-primary">Top Rated</h4>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-secondary/15 text-secondary mb-1">
              <Clock className="h-4.5 w-4.5" />
            </div>
            <h4 className="text-[10px] font-bold text-primary">On Time</h4>
          </div>
        </div>
      </section>

      {selectedService && (
        <BookingModal
          isOpen={true}
          onClose={handleCloseModal}
          service={{
            id: selectedService.id,
            name: selectedService.name,
            price: selectedService.price,
            duration: selectedService.duration,
            category_name: category.name,
            discount_type: selectedService.discount_type || null,
            discount_value: selectedService.discount_value || null,
          }}
          settings={settings}
        />
      )}
    </div>
  );
}
