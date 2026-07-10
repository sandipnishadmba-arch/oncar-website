"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  Home, 
  ClipboardList, 
  HelpCircle, 
  User, 
  Search as SearchIcon, 
  MapPin, 
  Bell, 
  Star, 
  Clock, 
  Zap, 
  ChevronRight, 
  Percent, 
  ShieldCheck, 
  Sparkles, 
  Phone,
  MessageCircle,
  TrendingUp,
  Share2,
  Lock
} from "lucide-react";
import { getIcon } from "@/lib/icons";
import { useSearchOverlay } from "@/components/search/GlobalSearchProvider";
import { BookingModal } from "@/components/services/BookingModal";
import { getServiceImage } from "@/lib/serviceImages";
import { SERVICE_AREAS } from "@/lib/areas";
import { formatWhatsAppLink } from "@/lib/utils";

interface Category {
  id: number;
  name: string;
  slug: string;
  image: string;
  icon: string;
  type: string;
  display_order: number;
  is_active: number;
}

interface Service {
  id: number;
  category_id: number;
  category_name?: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  image: string;
  is_active: number;
  is_featured: number;
  is_popular: number;
  arrival_time: string;
  is_recommended: number;
  discount_type?: string | null;
  discount_value?: number | null;
}

interface Offer {
  id: number;
  title: string;
  subtitle: string | null;
  code: string | null;
  image: string | null;
  target_url: string | null;
  cta_text: string | null;
  start_date: string | null;
  end_date: string | null;
  is_active: number;
  display_order: number;
  service_id?: number | null;
  category_id?: number | null;
  discount_type?: string | null;
  discount_value?: number | null;
  max_discount?: number | null;
  min_order_amount?: number | null;
  status?: string;
  usage_limit?: number | null;
  created_by?: string | null;
  updated_by?: string | null;
  created_at?: string;
  updated_at?: string;
}

interface RedesignedHomeProps {
  categories: Category[];
  services: Service[];
  settings: {
    phone: string;
    whatsapp_number: string;
    booking_message: string;
    available_time_slots: string[];
    advance_booking_days: string;
    website_name: string;
    tagline: string;
  };
  offers: Offer[];
}

export function RedesignedHome({ categories, services, settings, offers }: RedesignedHomeProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams ? searchParams.get("tab") : null;
  const [activeTab, setActiveTab] = useState<"home" | "bookings" | "help" | "profile">("home");

  useEffect(() => {
    if (tabParam === "bookings" || tabParam === "help" || tabParam === "profile") {
      setActiveTab(tabParam as any);
    } else {
      setActiveTab("home");
    }
  }, [tabParam]);

  const [selectedLocation, setSelectedLocation] = useState("Vesu, Surat");
  const [showLocationSelector, setShowLocationSelector] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const [bookingsList, setBookingsList] = useState<any[]>([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(false);

  const fetchUserBookings = useCallback(async () => {
    try {
      const phone = localStorage.getItem("kaamon_user_phone");
      const localBookingsStr = localStorage.getItem("kaamon_bookings") || "[]";
      const localBookings = JSON.parse(localBookingsStr);

      if (phone) {
        setIsLoadingBookings(true);
        const res = await fetch(`/api/bookings?phone=${encodeURIComponent(phone)}`);
        if (res.ok) {
          const apiBookings = await res.json();
          const merged: Record<string, any> = {};
          
          // Place API ones first
          apiBookings.forEach((b: any) => {
            merged[b.id] = b;
          });
          // Overlay local ones
          localBookings.forEach((b: any) => {
            if (b.id && !merged[b.id]) {
              merged[b.id] = b;
            }
          });

          const list = Object.values(merged).sort((a: any, b: any) => b.id - a.id);
          setBookingsList(list);
          // console.log("My Bookings fetched booking list:", JSON.stringify(list));
        } else {
          setBookingsList(localBookings);
        }
      } else {
        setBookingsList(localBookings);
      }
    } catch (e) {
      console.error("Failed to fetch bookings:", e);
    } finally {
      setIsLoadingBookings(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === "bookings") {
      fetchUserBookings();
    }
  }, [activeTab, fetchUserBookings]);
  const [currentOfferIndex, setCurrentOfferIndex] = useState(0);
  const [isInteracting, setIsInteracting] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Live offers state — fetched from API so admin visibility changes reflect instantly
  const [liveOffers, setLiveOffers] = useState<Offer[]>(offers || []);

  // Fetch live offers from public API on mount + every 30s for real-time admin sync
  useEffect(() => {
    const fetchLiveOffers = async () => {
      try {
        const res = await fetch("/api/offers", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setLiveOffers(data);
          }
        }
      } catch (e) {
        // Silently fall back to SSR prop data
      }
    };
    fetchLiveOffers();
    const interval = setInterval(fetchLiveOffers, 30000); // refresh every 30s
    return () => clearInterval(interval);
  }, []);
  const { openSearch } = useSearchOverlay();

  const getCategoryFallbackImage = (categoryId: number): string => {
    const cat = categories.find((c) => c.id === categoryId);
    return cat?.image || "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500&fit=crop";
  };

  // Location selector ref
  const locationSelectorRef = useRef<HTMLDivElement>(null);

  // Auto-slide active & visible offers — uses liveOffers for real-time admin sync
  const activeOffers = useMemo(() => {
    const list = (liveOffers || []).filter((o) => {
      if (o.is_active !== 1) return false;

      // Hide banners that admin marked as hidden
      if (o.status && o.status !== "visible") return false;

      // Date checks
      const now = new Date();
      if (o.start_date) {
        const start = new Date(o.start_date);
        if (now < start) return false;
      }
      if (o.end_date) {
        const end = new Date(o.end_date);
        if (now > end) return false;
      }
      return true;
    });

    if (list.length === 0) {
      // Empty fallback list
      return [{
        id: 0,
        title: "KaamOn Services",
        subtitle: "Best home care in Surat",
        code: "WELCOME",
        target_url: null,
        cta_text: "Book Now",
        color: "from-purple-600 to-indigo-650",
        image: null,
        start_date: null,
        end_date: null,
        is_active: 1,
        display_order: 1
      }];
    }

    return list.map((o, idx) => {
      const colors = [
        "from-purple-600 to-indigo-600",
        "from-blue-600 to-cyan-650",
        "from-pink-650 to-rose-600",
        "from-emerald-600 to-teal-650"
      ];
      return {
        ...o,
        color: colors[idx % colors.length]
      };
    });
  }, [liveOffers]);

  // Touch Swipe Handlers for mobile navigation
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
    setIsInteracting(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      setCurrentOfferIndex((prev) => (prev + 1) % activeOffers.length);
    } else if (isRightSwipe) {
      setCurrentOfferIndex((prev) => (prev - 1 + activeOffers.length) % activeOffers.length);
    }
    setTouchStart(null);
    setTouchEnd(null);
    
    // Resume auto-slide after interaction finishes
    setTimeout(() => setIsInteracting(false), 5000);
  };

  useEffect(() => {
    if (activeOffers.length <= 1 || isInteracting) return;
    const interval = setInterval(() => {
      setCurrentOfferIndex((prev) => (prev + 1) % activeOffers.length);
    }, 5000); // 5 seconds slide time
    return () => clearInterval(interval);
  }, [activeOffers.length, isInteracting]);

  // Click outside listener for location selector
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (locationSelectorRef.current && !locationSelectorRef.current.contains(event.target as Node)) {
        setShowLocationSelector(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter services for specific sections
  const trendingServices = useMemo(() => {
    const list = services.filter((s) => s.is_active === 1 && s.is_popular === 1);
    return list.length > 0 ? list.slice(0, 6) : services.filter((s) => s.is_active === 1).slice(0, 6);
  }, [services]);

  const mostBookedServices = useMemo(() => {
    const list = services.filter((s) => s.is_active === 1 && s.is_featured === 1);
    return list.length > 0 ? list.slice(0, 6) : services.filter((s) => s.is_active === 1).slice(3, 9);
  }, [services]);

  const instantServices = useMemo(() => {
    // Services that have arrival times and are under instant categories
    return services.filter((s) => {
      const cat = categories.find((c) => c.id === s.category_id);
      return s.is_active === 1 && cat?.type === "instant";
    }).slice(0, 6);
  }, [services, categories]);

  const projectServices = useMemo(() => {
    // Return custom project categories
    return categories.filter((c) => c.type === "quotation" && c.is_active === 1);
  }, [categories]);

  const recommendedServices = useMemo(() => {
    // Manual pins
    const list = services.filter((s) => s.is_active === 1 && s.is_recommended === 1);
    // Auto-sort fallback by bookings/featured
    return list.length > 0 ? list.slice(0, 6) : services.filter((s) => s.is_active === 1 && s.is_featured === 1).slice(0, 6);
  }, [services]);

  // Helper to map category names for modal
  const getCategoryName = (catId: number) => {
    return categories.find((c) => c.id === catId)?.name || "Service";
  };

  const handleBannerClick = (offer: Offer) => {
    console.log("Offer banner clicked", offer.code, offer.service_id, offer.category_id);
    if (offer.service_id) {
      router.push(`/booking?serviceId=${offer.service_id}&offerCode=${offer.code || ""}`);
    } else if (offer.category_id) {
      router.push(`/category/${offer.category_id}?offerCode=${offer.code || ""}`);
    } else if (offer.target_url) {
      let url = offer.target_url;
      if (offer.code) {
        const separator = url.includes("?") ? "&" : "?";
        url = `${url}${separator}offerCode=${offer.code}`;
      }
      router.push(url);
    }
  };

  return (
    <div className="bg-white min-h-screen pb-24 text-text flex flex-col font-sans select-none antialiased">
      
      {/* Sticky Header with location and notification */}
      <header className="sticky top-0 z-40 bg-white border-b border-border/60 safe-top shadow-xs">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
          <div 
            onClick={() => setShowLocationSelector(!showLocationSelector)}
            className="flex items-center gap-1.5 cursor-pointer hover:opacity-85 transition-opacity py-1"
          >
            <MapPin className="h-4.5 w-4.5 text-primary" />
            <div className="flex flex-col text-left">
              <span className="text-[10px] text-muted font-bold uppercase tracking-wider leading-none">Your Location</span>
              <span className="text-xs font-black text-primary flex items-center gap-0.5 mt-0.5">
                {selectedLocation}
                <ChevronRight className="h-3 w-3 rotate-90 text-primary" />
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              type="button" 
              className="relative p-2 rounded-full hover:bg-surface text-primary transition-colors"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full ring-2 ring-white" />
            </button>
          </div>
        </div>

        {/* Location Dropdown Dialog */}
        {showLocationSelector && (
          <div className="absolute top-full left-0 right-0 bg-white border-b border-border shadow-xl z-50 animate-in slide-in-from-top-2 duration-150">
            <div ref={locationSelectorRef} className="max-w-md mx-auto p-4">
              <h4 className="text-xs font-black text-primary uppercase tracking-wider mb-2.5">Select Service Area</h4>
              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                {SERVICE_AREAS.map((area) => (
                  <button
                    key={area.area}
                    type="button"
                    onClick={() => {
                      setSelectedLocation(`${area.area}, Surat`);
                      setShowLocationSelector(false);
                    }}
                    className={`text-left px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
                      selectedLocation.startsWith(area.area)
                        ? "bg-primary/5 text-primary border-primary"
                        : "bg-surface text-muted border-border hover:border-muted"
                    }`}
                  >
                    {area.area}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area based on Tab Selection */}
      <main className="flex-1 max-w-md mx-auto w-full">
        {activeTab === "home" && (
          <div className="animate-in fade-in duration-200">
            
            {/* Sticky Search Trigger Section */}
            <div className="px-4 pt-4 pb-2">
              <button
                type="button"
                onClick={() => openSearch()}
                className="w-full relative flex items-center pl-11 pr-4 py-3 rounded-2xl border border-border bg-surface text-xs font-bold text-muted hover:border-primary hover:bg-white hover:ring-4 hover:ring-primary/5 transition-all duration-200 cursor-text shadow-sm"
              >
                <SearchIcon className="absolute left-4 h-4.5 w-4.5 text-muted" />
                <span>Search for AC Repair, Plumber, Painter...</span>
              </button>
            </div>

            {/* Offers Slider / Banner Section */}
            <div 
              className="px-4 py-3"
              onMouseEnter={() => setIsInteracting(true)}
              onMouseLeave={() => setIsInteracting(false)}
            >
              <div 
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                className="relative h-28 w-full rounded-[20px] overflow-hidden shadow-md bg-primary select-none"
              >
                {activeOffers.map((offer, idx) => {
                  const CardContent = (
                    <div className="h-full flex flex-col justify-between p-4 select-text">
                      <div>
                        <span 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleBannerClick(offer);
                          }}
                          className="inline-flex items-center gap-1 bg-white/20 text-[9px] font-black tracking-widest uppercase text-white px-2 py-0.5 rounded-full cursor-pointer hover:bg-white/30 transition-colors pointer-events-auto"
                        >
                          <Percent className="h-3 w-3" /> Offer Code: {offer.code || "SURAT10"}
                        </span>
                        <h3 className="text-sm font-black text-white mt-2 leading-tight">{offer.title}</h3>
                        <p className="text-[10px] text-white/80 font-semibold leading-normal">{offer.subtitle}</p>
                      </div>
                      <div className="flex justify-between items-center text-[10px] text-white/90 font-bold border-t border-white/15 pt-1.5 mt-1">
                        <span className="tracking-wide">Exclusively in Surat</span>
                        {(offer.service_id || offer.category_id || offer.target_url) && (
                          <span 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleBannerClick(offer);
                            }}
                            className="underline decoration-white/30 underline-offset-2 flex items-center gap-0.5 cursor-pointer hover:text-white transition-colors pointer-events-auto"
                          >
                            {offer.cta_text || "Book Now"}
                            <ChevronRight className="h-3 w-3" />
                          </span>
                        )}
                      </div>
                    </div>
                  );

                  const cardClasses = `absolute inset-0 bg-gradient-to-r ${offer.color || 'from-purple-600 to-indigo-650'} transition-all duration-500 ease-in-out transform-gpu ${
                    idx === currentOfferIndex 
                      ? "opacity-100 translate-x-0 scale-100 pointer-events-auto z-20" 
                      : "opacity-0 translate-x-6 scale-95 pointer-events-none z-0"
                  }`;

                  return (
                    <div
                      key={offer.id || idx}
                      role="button"
                      tabIndex={0}
                      onClick={() => handleBannerClick(offer)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handleBannerClick(offer);
                        }
                      }}
                      className={`${cardClasses} block cursor-pointer transition-all duration-150 transform-gpu active:scale-[0.97] hover:scale-[1.01] hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-secondary/50`}
                      aria-label={`Promotional Banner: ${offer.title}. ${offer.subtitle || ""}. Offer Code: ${offer.code || ""}. Tap to open.`}
                    >
                      {CardContent}
                    </div>
                  );
                })}

                {/* Smooth page indicator dots */}
                {activeOffers.length > 1 && (
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-30 pointer-events-none">
                    {activeOffers.map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          setCurrentOfferIndex(i);
                        }}
                        className={`h-1.5 rounded-full transition-all duration-300 pointer-events-auto ${
                          i === currentOfferIndex ? "w-4 bg-white" : "w-1.5 bg-white/40 hover:bg-white/60"
                        }`}
                        aria-label={`Go to offer banner slide ${i + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Popular Categories Grid */}
            <section className="py-4">
              <div className="px-4 mb-3 flex items-center justify-between">
                <h2 className="text-xs font-black text-primary uppercase tracking-wider">Popular Categories</h2>
              </div>
              <div className="px-4 grid grid-cols-4 gap-y-4 gap-x-2">
                {categories.filter((c) => c.is_active === 1).map((cat) => {
                  const Icon = getIcon(cat.icon);
                  return (
                    <Link
                      key={cat.id}
                      href={`/services/${cat.slug}`}
                      className="flex flex-col items-center text-center group outline-none"
                    >
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-surface border border-border text-primary group-hover:border-primary group-hover:bg-white group-active:scale-95 transition-all duration-150 shadow-2xs">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <span className="text-[10px] font-black text-muted group-hover:text-primary transition-colors mt-1.5 line-clamp-1">
                        {cat.name}
                      </span>
                    </Link>
                  );
                })}

                {/* All Services button */}
                <button
                  type="button"
                  onClick={() => openSearch()}
                  className="flex flex-col items-center text-center group outline-none"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white group-active:scale-95 transition-all duration-150 shadow-sm">
                    <span className="text-[10px] font-black uppercase tracking-wider">All</span>
                  </div>
                  <span className="text-[10px] font-black text-muted group-hover:text-primary transition-colors mt-1.5">
                    View All
                  </span>
                </button>
              </div>
            </section>

            {/* Trending Services Carousel */}
            <section className="py-4">
              <div className="px-4 mb-3 flex items-center justify-between">
                <h2 className="text-xs font-black text-primary uppercase tracking-wider">Trending Services</h2>
                <span className="text-[9px] font-bold text-primary uppercase bg-primary/5 px-2 py-0.5 rounded-full">Top Rated</span>
              </div>
              <div className="flex overflow-x-auto gap-3.5 px-4 scrollbar-none pb-2 overscroll-x-contain">
                {trendingServices.map((service) => (
                  <article 
                    key={service.id}
                    onClick={() => setSelectedService(service)}
                    className="shrink-0 w-44 rounded-2xl border border-border bg-white shadow-2xs overflow-hidden flex flex-col justify-between hover:shadow-xs cursor-pointer transition-shadow"
                  >
                    <div className="relative h-28 w-full bg-surface">
                       <Image 
                        src={getServiceImage(service.name, getCategoryFallbackImage(service.category_id))}
                        alt={service.name}
                        fill
                        className="object-cover"
                        loading="lazy"
                        sizes="176px"
                      />
                      <span className="absolute top-2 left-2 bg-secondary text-primary text-[8px] font-black px-1.5 py-0.5 rounded-full flex items-center gap-0.5 shadow-sm">
                        <Star className="h-2.5 w-2.5 fill-primary text-primary" /> 4.9
                      </span>
                      {service.discount_value && (
                        <span className="absolute top-2 right-2 bg-green-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full shadow-sm uppercase tracking-wider">
                          {service.discount_type === "percentage" ? `${service.discount_value}% OFF` : `₹${service.discount_value} OFF`}
                        </span>
                      )}
                    </div>
                    <div className="p-3 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-xs font-black text-primary leading-tight line-clamp-1">{service.name}</h3>
                        <p className="text-[10px] text-muted font-medium mt-0.5 line-clamp-2 h-7">{service.description}</p>
                      </div>
                      <div className="mt-2.5 pt-2 border-t border-border/60 flex items-center justify-between">
                        <div>
                          <span className="block text-[8px] text-muted uppercase font-bold">Starts at</span>
                          <div className="flex items-baseline gap-1 mt-0.5">
                            <span className="text-xs font-black text-primary">₹{
                              service.discount_value
                                ? service.discount_type === "percentage"
                                  ? service.price - Math.round(service.price * service.discount_value / 100)
                                  : service.price - service.discount_value
                                : service.price
                            }</span>
                            {service.discount_value && (
                              <span className="line-through text-[9px] text-muted/70 font-bold">
                                ₹{service.price}
                              </span>
                            )}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedService(service);
                          }}
                          className="px-2.5 py-1 text-[9px] font-black uppercase bg-primary text-white rounded-lg hover:opacity-90 active:scale-95 transition-all"
                        >
                          Book
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            {/* Most Booked Services Section */}
            <section className="py-4 bg-surface/50 border-y border-border/30">
              <div className="px-4 mb-3 flex items-center justify-between">
                <h2 className="text-xs font-black text-primary uppercase tracking-wider">Most Booked</h2>
                <span className="text-[9px] font-bold text-muted uppercase tracking-widest">Surat Favorites</span>
              </div>
              <div className="flex overflow-x-auto gap-3.5 px-4 scrollbar-none pb-2 overscroll-x-contain">
                {mostBookedServices.map((service) => (
                  <article
                    key={service.id}
                    onClick={() => setSelectedService(service)}
                    className="shrink-0 w-52 rounded-2xl border border-border bg-white shadow-2xs overflow-hidden flex flex-col justify-between hover:shadow-xs cursor-pointer transition-shadow"
                  >
                    <div className="relative h-28 w-full bg-surface">
                      <Image 
                        src={getServiceImage(service.name, getCategoryFallbackImage(service.category_id))}
                        alt={service.name}
                        fill
                        className="object-cover"
                        loading="lazy"
                        sizes="208px"
                      />
                      <span className="absolute top-2 left-2 bg-white/90 backdrop-blur-xs text-primary text-[8px] font-black px-1.5 py-0.5 rounded-full flex items-center gap-0.5 shadow-sm">
                        <Clock className="h-2.5 w-2.5 text-primary" /> {service.duration}
                      </span>
                      {service.discount_value && (
                        <span className="absolute top-2 right-2 bg-green-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full shadow-sm uppercase tracking-wider">
                          {service.discount_type === "percentage" ? `${service.discount_value}% OFF` : `₹${service.discount_value} OFF`}
                        </span>
                      )}
                    </div>
                    <div className="p-3 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-xs font-black text-primary leading-tight line-clamp-1">{service.name}</h3>
                        <p className="text-[9px] text-muted mt-0.5 line-clamp-2 h-6 leading-tight">
                          {service.description || "Trusted doorstep service across Surat with verified professionals."}
                        </p>
                        <div className="flex items-center gap-1 mt-1.5 text-[9px] text-secondary font-bold">
                          <span className="flex items-center gap-0.5">
                            <Star className="h-2.5 w-2.5 fill-secondary text-secondary" /> 4.8
                          </span>
                          <span className="text-muted/65">•</span>
                          <span className="text-muted">100+ bookings</span>
                        </div>
                      </div>
                      <div className="mt-2.5 pt-2 border-t border-border/60 flex items-center justify-between">
                        <div>
                          <span className="block text-[8px] text-muted uppercase font-bold">Starts at</span>
                          <div className="flex items-baseline gap-1 mt-0.5">
                            <span className="text-xs font-black text-primary">₹{
                              service.discount_value
                                ? service.discount_type === "percentage"
                                  ? service.price - Math.round(service.price * service.discount_value / 100)
                                  : service.price - service.discount_value
                                : service.price
                            }</span>
                            {service.discount_value && (
                              <span className="line-through text-[9px] text-muted/70 font-bold">
                                ₹{service.price}
                              </span>
                            )}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedService(service);
                          }}
                          className="px-3 py-1 text-[9px] font-black uppercase bg-primary text-white rounded-lg hover:opacity-90 active:scale-95 transition-all"
                        >
                          Book Now
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            {/* Instant Booking Section (30-60 mins arrival) */}
            <section className="py-4">
              <div className="px-4 mb-3 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <h2 className="text-xs font-black text-primary uppercase tracking-wider">Instant Booking</h2>
                  <span className="bg-red-500 text-white font-black text-[8px] uppercase tracking-wider px-1.5 py-0.5 rounded-sm animate-pulse">30-60 Min</span>
                </div>
              </div>
              <div className="flex overflow-x-auto gap-3.5 px-4 scrollbar-none pb-2 overscroll-x-contain">
                {instantServices.map((service) => (
                  <article
                    key={service.id}
                    onClick={() => setSelectedService(service)}
                    className="shrink-0 w-44 rounded-2xl border border-border bg-white shadow-2xs overflow-hidden flex flex-col justify-between hover:shadow-xs cursor-pointer transition-shadow"
                  >
                    <div className="relative h-28 w-full bg-surface">
                      <Image 
                        src={getServiceImage(service.name, getCategoryFallbackImage(service.category_id))}
                        alt={service.name}
                        fill
                        className="object-cover"
                        loading="lazy"
                        sizes="176px"
                      />
                      <span className="absolute top-2 left-2 bg-primary text-white text-[8px] font-black px-1.5 py-0.5 rounded-full shadow-sm uppercase tracking-wider">
                        Instant
                      </span>
                      {service.discount_value && (
                        <span className="absolute top-2 right-2 bg-green-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full shadow-sm uppercase tracking-wider">
                          {service.discount_type === "percentage" ? `${service.discount_value}% OFF` : `₹${service.discount_value} OFF`}
                        </span>
                      )}
                    </div>
                    <div className="p-3 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-xs font-black text-primary leading-tight line-clamp-1">{service.name}</h3>
                        <p className="text-[9px] text-muted mt-0.5 line-clamp-2 h-6 leading-tight">
                          {service.description || "Trusted doorstep service across Surat with verified professionals."}
                        </p>
                        <p className="text-[8px] text-muted/70 mt-1 font-bold">{getCategoryName(service.category_id)} • {service.arrival_time || "30 mins"}</p>
                      </div>
                      <div className="mt-2.5 pt-2 border-t border-border/60 flex items-center justify-between">
                        <div>
                          <span className="block text-[8px] text-muted uppercase font-bold">Starts at</span>
                          <div className="flex items-baseline gap-1 mt-0.5">
                            <span className="text-xs font-black text-primary">₹{
                              service.discount_value
                                ? service.discount_type === "percentage"
                                  ? service.price - Math.round(service.price * service.discount_value / 100)
                                  : service.price - service.discount_value
                                : service.price
                            }</span>
                            {service.discount_value && (
                              <span className="line-through text-[9px] text-muted/70 font-bold">
                                ₹{service.price}
                              </span>
                            )}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedService(service);
                          }}
                          className="px-2.5 py-1 text-[9px] font-black uppercase bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 active:scale-95 transition-all border-none"
                        >
                          Book
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            {/* Project Services (Quotations) Section */}
            <section className="py-4 bg-surface/35 border-y border-border/30">
              <div className="px-4 mb-3 flex items-center justify-between">
                <h2 className="text-xs font-black text-primary uppercase tracking-wider">Project Services</h2>
                <span className="text-[9px] font-bold text-primary uppercase tracking-wide">Free Survey</span>
              </div>
              <div className="flex overflow-x-auto gap-3.5 px-4 scrollbar-none pb-2 overscroll-x-contain">
                {projectServices.map((cat) => {
                  return (
                    <Link
                      key={cat.id}
                      href={`/services/${cat.slug}`}
                      className="shrink-0 w-52 rounded-2xl border border-border bg-white shadow-2xs overflow-hidden flex flex-col justify-between hover:shadow-xs transition-shadow"
                    >
                      <div className="relative h-28 w-full bg-surface">
                        <Image 
                          src={cat.image || "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=350&fit=crop"}
                          alt={cat.name}
                          fill
                          className="object-cover"
                          loading="lazy"
                          sizes="208px"
                        />
                        <span className="absolute top-2 right-2 bg-secondary text-primary text-[8px] font-black px-1.5 py-0.5 rounded-full shadow-sm uppercase tracking-wider">
                          Quote
                        </span>
                      </div>
                      <div className="p-3">
                        <h3 className="text-xs font-black text-primary leading-tight">{cat.name}</h3>
                        <p className="text-[10px] text-muted font-medium mt-0.5">Site inspection & digital estimate</p>
                        <div className="mt-3 flex items-center justify-between text-[10px] font-bold text-primary border-t border-border/40 pt-2">
                          <span>Get Free Estimate</span>
                          <ChevronRight className="h-3 w-3" />
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>

            {/* Recommended Near You Section */}
            <section className="py-4">
              <div className="px-4 mb-3 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <h2 className="text-xs font-black text-primary uppercase tracking-wider">Recommended Near You</h2>
                  <span className="text-[8px] font-bold text-muted uppercase bg-surface border border-border px-1.5 py-0.5 rounded-md">{selectedLocation.split(",")[0]}</span>
                </div>
              </div>
              <div className="flex overflow-x-auto gap-3.5 px-4 scrollbar-none pb-2 overscroll-x-contain">
                {recommendedServices.map((service) => (
                  <article
                    key={service.id}
                    onClick={() => setSelectedService(service)}
                    className="shrink-0 w-44 rounded-2xl border border-border bg-white shadow-2xs overflow-hidden flex flex-col justify-between hover:shadow-xs cursor-pointer transition-shadow"
                  >
                    <div className="relative h-28 w-full bg-surface">
                      <Image 
                        src={getServiceImage(service.name, getCategoryFallbackImage(service.category_id))}
                        alt={service.name}
                        fill
                        className="object-cover"
                        loading="lazy"
                        sizes="176px"
                      />
                      <span className="absolute bottom-2 left-2 bg-white/95 backdrop-blur-xs text-primary text-[8px] font-black px-1.5 py-0.5 rounded-full flex items-center gap-0.5 shadow-sm">
                        <Star className="h-2.5 w-2.5 fill-primary text-primary" /> 4.8
                      </span>
                      {service.discount_value && (
                        <span className="absolute top-2 right-2 bg-green-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full shadow-sm uppercase tracking-wider">
                          {service.discount_type === "percentage" ? `${service.discount_value}% OFF` : `₹${service.discount_value} OFF`}
                        </span>
                      )}
                    </div>
                    <div className="p-3 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-xs font-black text-primary leading-tight line-clamp-1">{service.name}</h3>
                        <p className="text-[10px] text-muted mt-0.5 line-clamp-1 font-medium">{getCategoryName(service.category_id)}</p>
                      </div>
                      <div className="mt-2.5 pt-2 border-t border-border/60 flex items-center justify-between">
                        <div>
                          <span className="block text-[8px] text-muted uppercase font-bold">Price</span>
                          <div className="flex items-baseline gap-1 mt-0.5">
                            <span className="text-xs font-black text-primary">₹{
                              service.discount_value
                                ? service.discount_type === "percentage"
                                  ? service.price - Math.round(service.price * service.discount_value / 100)
                                  : service.price - service.discount_value
                                : service.price
                            }</span>
                            {service.discount_value && (
                              <span className="line-through text-[9px] text-muted/70 font-bold">
                                ₹{service.price}
                              </span>
                            )}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedService(service);
                          }}
                          className="px-2.5 py-1 text-[9px] font-black uppercase bg-primary text-white rounded-lg hover:opacity-90 active:scale-95 transition-all"
                        >
                          Book
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            {/* Recently Booked Section */}
            <section className="py-4 bg-surface/30 border-y border-border/30">
              <div className="px-4 mb-3 flex items-center justify-between">
                <h2 className="text-xs font-black text-primary uppercase tracking-wider">Recently Booked</h2>
              </div>
              <div className="flex overflow-x-auto gap-3.5 px-4 scrollbar-none pb-2 overscroll-x-contain">
                {[
                  { name: "Fan Installation", category: "Electrician", price: 299, image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=300&fit=crop", id: 1 },
                  { name: "Tap Leakage Fix", category: "Plumber", price: 129, image: "https://images.unsplash.com/photo-1607472586893-a8838146759d?w=300&fit=crop", id: 13 },
                  { name: "AC Deep Cleaning", category: "AC Service", price: 599, image: "https://images.unsplash.com/photo-1585771724684-38269d663861?w=300&fit=crop", id: 25 },
                ].map((recent, idx) => {
                  const svcMatch = services.find((s) => s.name.toLowerCase().includes(recent.name.toLowerCase())) || services[0];
                  return (
                    <article
                      key={idx}
                      onClick={() => setSelectedService(svcMatch)}
                      className="shrink-0 w-64 p-3 rounded-2xl border border-border bg-white shadow-2xs flex gap-3 items-center hover:shadow-xs cursor-pointer transition-shadow"
                    >
                      <div className="relative h-14 w-14 rounded-xl overflow-hidden shrink-0 bg-surface">
                        <Image 
                          src={recent.image}
                          alt={recent.name}
                          fill
                          className="object-cover"
                          loading="lazy"
                          sizes="56px"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="block text-[8px] font-black uppercase text-secondary tracking-wide">{recent.category}</span>
                        <h3 className="text-xs font-black text-primary truncate mt-0.5">{recent.name}</h3>
                        <span className="text-[10px] font-extrabold text-primary block mt-0.5">₹{recent.price}</span>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedService(svcMatch);
                        }}
                        className="px-2.5 py-1.5 text-[9px] font-black uppercase bg-primary/5 text-primary rounded-lg hover:bg-primary/10 active:scale-95 transition-all shrink-0"
                      >
                        Re-book
                      </button>
                    </article>
                  );
                })}
              </div>
            </section>

            {/* Quality & Trust Badges Section */}
            <section className="py-8 bg-white text-center px-4">
              <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto">
                <div className="flex flex-col items-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/5 text-primary mb-2 shadow-2xs">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <h4 className="text-[10px] font-black text-primary leading-tight">Verified Professionals</h4>
                  <p className="text-[8px] text-muted mt-0.5">100% Background Checked</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/5 text-primary mb-2 shadow-2xs">
                    <Star className="h-5 w-5" />
                  </div>
                  <h4 className="text-[10px] font-black text-primary leading-tight">High Quality Work</h4>
                  <p className="text-[8px] text-muted mt-0.5">Average Rating 4.8</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/5 text-primary mb-2 shadow-2xs">
                    <Clock className="h-5 w-5" />
                  </div>
                  <h4 className="text-[10px] font-black text-primary leading-tight">On-Time Services</h4>
                  <p className="text-[8px] text-muted mt-0.5">Punctual & Guaranteed</p>
                </div>
              </div>
            </section>

          </div>
        )}

        {activeTab === "bookings" && (
          <div className="px-4 py-6 animate-in fade-in duration-200 min-h-[70vh] pb-24">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-black text-primary uppercase tracking-wider">Your Bookings</h2>
              {bookingsList.length > 0 && (
                <button
                  type="button"
                  onClick={fetchUserBookings}
                  className="text-[10px] font-black text-primary uppercase tracking-wider bg-surface px-2.5 py-1 rounded-md border border-border"
                >
                  {isLoadingBookings ? "Refreshing..." : "Refresh"}
                </button>
              )}
            </div>

            {bookingsList.length === 0 ? (
              <div className="text-center py-12 px-6 rounded-3xl border border-border bg-surface shadow-2xs">
                <ClipboardList className="h-10 w-10 text-muted mx-auto mb-3" />
                <p className="text-xs font-black text-primary">No active bookings found</p>
                <p className="text-[10px] text-muted mt-1 leading-relaxed">Book a service from the home page. Your active schedules will appear here dynamically.</p>
                <button 
                  type="button"
                  onClick={() => setActiveTab("home")}
                  className="mt-4 px-4 py-2 text-xs font-black uppercase bg-primary text-white rounded-xl shadow-xs active:scale-95 transition-transform"
                >
                  Browse Services
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {bookingsList.map((booking) => {
                  const statusColors: Record<string, string> = {
                    Pending: "bg-amber-100 text-amber-800 border-amber-200",
                    Confirmed: "bg-blue-100 text-blue-800 border-blue-200",
                    Accepted: "bg-indigo-100 text-indigo-800 border-indigo-200",
                    Completed: "bg-green-100 text-green-800 border-green-200",
                    Cancelled: "bg-red-100 text-red-800 border-red-200",
                  };
                  const statusColor = statusColors[booking.status] || "bg-surface text-muted border-border";

                  return (
                    <article
                      key={booking.id}
                      className="p-4 rounded-2xl border border-border bg-white shadow-2xs space-y-3"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[10px] font-bold text-muted">Booking ID: #{booking.id}</span>
                          <h3 className="text-sm font-black text-primary mt-0.5">{booking.service_name || booking.category_name}</h3>
                        </div>
                        <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${statusColor}`}>
                          {booking.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[10px] text-muted font-semibold pt-1 border-t border-border/40">
                        <div>
                          <span className="block text-[8px] text-muted/60 uppercase font-black tracking-wider">Date & Time</span>
                          <span className="text-primary font-bold mt-0.5 block">{booking.preferred_date || "Today"} • {booking.preferred_time || "Instant"}</span>
                        </div>
                        <div className="text-right">
                          <span className="block text-[8px] text-muted/60 uppercase font-black tracking-wider">Total Amount</span>
                          <span className="text-primary font-black mt-0.5 block">₹{booking.final_amount || booking.price}</span>
                        </div>
                      </div>

                      {booking.notes && (
                        <div className="p-2 rounded-lg bg-surface/50 text-[10px] text-muted border border-border/30">
                          <span className="font-bold text-primary block mb-0.5">Booking Details:</span>
                          <p className="leading-relaxed">{booking.notes}</p>
                        </div>
                      )}

                      {booking.status === "Pending" && (
                        <div className="flex gap-2 justify-end pt-1">
                          <a
                            href={`https://wa.me/${settings.whatsapp_number}?text=${encodeURIComponent(
                              `Hello, I would like to query status of my booking #${booking.id} (${booking.service_name || booking.category_name}).`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 text-[9px] font-black uppercase bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 active:scale-95 transition-all text-center"
                          >
                            Chat via WhatsApp
                          </a>
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === "help" && (
          <div className="px-4 py-6 animate-in fade-in duration-200 min-h-[70vh] space-y-5">
            <div>
              <h2 className="text-base font-black text-primary uppercase tracking-wider mb-1">Help & Support</h2>
              <p className="text-[10px] text-muted">Exclusively serving residents of Surat City.</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <a
                href={`tel:${settings.phone}`}
                className="flex items-center gap-3 p-3.5 rounded-2xl border border-border bg-white shadow-2xs hover:border-primary transition-colors text-left"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/5 text-primary shrink-0">
                  <Phone className="h-4.5 w-4.5" />
                </div>
                <div>
                  <span className="block text-[8px] text-muted uppercase font-bold leading-none">Call Support</span>
                  <span className="text-[11px] font-black text-primary mt-1 block">{settings.phone}</span>
                </div>
              </a>

              <a
                href={formatWhatsAppLink("Hi! I need help with my KaamOn booking in Surat.", settings.whatsapp_number)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3.5 rounded-2xl border border-border bg-white shadow-2xs hover:border-primary transition-colors text-left"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-white shrink-0">
                  <MessageCircle className="h-4.5 w-4.5" />
                </div>
                <div>
                  <span className="block text-[8px] text-muted uppercase font-bold leading-none">WhatsApp Us</span>
                  <span className="text-[11px] font-black text-primary mt-1 block">Live Chat</span>
                </div>
              </a>
            </div>

            <div>
              <h3 className="text-xs font-black text-primary uppercase tracking-wider mb-2.5">Frequently Asked Questions</h3>
              <div className="space-y-2">
                {[
                  { q: "How quickly can a service professional arrive?", a: "For instant bookings, a professional will arrive at your address in Surat within 30 to 60 minutes. You can also schedule a convenient 2-hour slot." },
                  { q: "Are the prices listed on KaamOn fixed?", a: "Yes, all prices under Instant Services are fully fixed. For larger projects like Modular Kitchen or Renovation, we provide a free site inspection and customized digital quotes." },
                  { q: "How do I pay for completed jobs?", a: "You can pay the professional directly via Cash or any UPI app (GPay, PhonePe, Paytm) after the service is successfully finished." },
                  { q: "What if I need to cancel my booking?", a: "You can cancel or reschedule easily by calling our support line or replying to the WhatsApp confirmation link." }
                ].map((item, idx) => (
                  <details key={idx} className="group p-3 rounded-2xl border border-border bg-white shadow-2xs [&_summary::-webkit-details-marker]:hidden">
                    <summary className="flex items-center justify-between text-xs font-black text-primary cursor-pointer select-none">
                      <span>{item.q}</span>
                      <span className="text-muted group-open:rotate-180 transition-transform"><ChevronRight className="h-3.5 w-3.5 rotate-90" /></span>
                    </summary>
                    <p className="mt-2.5 text-[10px] leading-relaxed text-muted font-medium border-t border-border/40 pt-2">{item.a}</p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "profile" && (
          <div className="px-4 py-6 animate-in fade-in duration-200 min-h-[70vh] space-y-4">
            <div className="flex items-center gap-4 p-4 rounded-3xl border border-border bg-white shadow-2xs">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/5 text-primary text-base font-black">
                KO
              </div>
              <div>
                <h3 className="text-xs font-black text-primary">KaamOn Customer</h3>
                <p className="text-[10px] text-muted mt-0.5">Surat City, Gujarat</p>
              </div>
            </div>

            <div className="rounded-3xl border border-border bg-white shadow-2xs overflow-hidden">
              <div className="p-3 bg-surface border-b border-border/60">
                <span className="text-[9px] font-black text-muted uppercase tracking-wider">Account Settings</span>
              </div>
              <div className="divide-y divide-border/65">
                {[
                  { label: "Saved Addresses", detail: "Vesu, Adajan, Pal, Piplod", icon: MapPin },
                  { label: "Notification Preferences", detail: "WhatsApp & SMS notifications active", icon: Bell },
                  { label: "KaamOn Support Hotline", detail: "+91 9213466544", icon: Phone },
                ].map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div key={idx} className="p-3.5 flex items-center justify-between hover:bg-surface transition-colors cursor-pointer">
                      <div className="flex items-center gap-3">
                        <Icon className="h-4.5 w-4.5 text-primary shrink-0" />
                        <div className="text-left">
                          <span className="block text-xs font-black text-primary">{item.label}</span>
                          <span className="block text-[9px] text-muted mt-0.5 font-medium">{item.detail}</span>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted" />
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-4 rounded-3xl border border-border/40 bg-surface/50 text-center">
              <p className="text-[9px] text-muted font-bold uppercase tracking-widest">&copy; {new Date().getFullYear()} {settings.website_name} App</p>
              <p className="text-[8px] text-muted/80 mt-1">Premium Home Improvement & Service Platform in Surat</p>
            </div>
          </div>
        )}
      </main>

      {/* Booking Modal Trigger from Trending/Recommended service cards */}
      {selectedService && (
        <BookingModal
          isOpen={true}
          onClose={() => setSelectedService(null)}
          service={{
            id: selectedService.id,
            name: selectedService.name,
            price: servicePrice(selectedService),
            duration: selectedService.duration,
            category_name: getCategoryName(selectedService.category_id),
            discount_type: selectedService.discount_type || null,
            discount_value: selectedService.discount_value || null,
          }}
          settings={settings}
        />
      )}
    </div>
  );
}

// Fallback pricing resolver helper
function servicePrice(service: Service): number {
  return service.price || 199;
}
