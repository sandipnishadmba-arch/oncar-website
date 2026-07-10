"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { 
  ShieldCheck, 
  Clock, 
  Award, 
  MapPin, 
  Check, 
  ArrowLeft,
  ArrowRight, 
  Car, 
  HelpCircle, 
  MessageCircle,
  Sparkles,
  Navigation,
  ThumbsUp,
  UserCheck,
  Search as SearchIcon,
  X,
  Home as HomeIcon,
  ClipboardList,
  Play,
  QrCode,
  AlertCircle,
  Star
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { formatWhatsAppLink } from "@/lib/utils";
import { useSearchOverlay } from "@/components/search/GlobalSearchProvider";
import Image from "next/image";

// Predefined Lucide Icons mapper for dynamic Trust Badges
const iconMap: Record<string, any> = {
  Car,
  Clock,
  ShieldCheck,
  Award,
  MapPin,
  Navigation,
  ThumbsUp,
  UserCheck,
  HelpCircle
};

function HomeContent() {
  const { openSearch } = useSearchOverlay();
  const searchParams = useSearchParams();
  const bookPlanParam = searchParams ? searchParams.get("bookPlan") : null;

  const [activeTab, setActiveTab] = useState<"home" | "plans" | "bookings">("home");
  const [showStickyCta, setShowStickyCta] = useState(false);

  // Dynamic states
  const [plans, setPlans] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>(null);
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Coupon states
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<any | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponSuccess, setCouponSuccess] = useState<string | null>(null);

  // Fetch dynamic plans, settings, & offers
  useEffect(() => {
    Promise.all([
      fetch("/api/services").then((r) => r.ok ? r.json() : []),
      fetch("/api/settings").then((r) => r.ok ? r.json() : null),
      fetch("/api/offers").then((r) => r.ok ? r.json() : [])
    ])
      .then(([plansData, settingsData, offersData]) => {
        setPlans(plansData || []);
        setSettings(settingsData);
        setOffers(offersData || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load dynamic content:", err);
        setLoading(false);
      });
  }, []);

  // Monitor scroll for sticky plans CTA
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 150) {
        setShowStickyCta(true);
      } else {
        setShowStickyCta(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fallback Constants if settings is missing from database
  const getSettingVal = (key: string, fallback: string) => {
    if (!settings || !settings[key]) return fallback;
    return settings[key];
  };

  const getBadges = () => {
    if (settings && Array.isArray(settings.trust_badges) && settings.trust_badges.length > 0) {
      return settings.trust_badges;
    }
    return [
      { title: "Apni Car Practice", description: "Learn in the car you actually own and will drive daily", icon: "Car" },
      { title: "Apne Time Par", description: "Schedule sessions at your convenience, no fixed timings", icon: "Clock" },
      { title: "Verified Instructors", description: "Professional, background-verified guidance at your doorstep", icon: "UserCheck" },
      { title: "Home Pick & Drop", description: "Instructor picks you up from your doorstep in Surat", icon: "MapPin" }
    ];
  };

  const getTestimonials = () => {
    if (settings && Array.isArray(settings.testimonials) && settings.testimonials.length > 0) {
      return settings.testimonials;
    }
    return [];
  };

  const getSlots = () => {
    if (settings && Array.isArray(settings.available_time_slots) && settings.available_time_slots.length > 0) {
      return settings.available_time_slots;
    }
    return ["07:00 AM", "08:00 AM", "09:00 AM", "10:00 AM", "05:00 PM", "06:00 PM", "07:00 PM", "08:00 PM", "09:00 PM", "Custom Time"];
  };

  // Uber Reserve states
  const [reserveStep, setReserveStep] = useState<1 | 2>(1);
  const [reserveDate, setReserveDate] = useState("");
  const [reserveTime, setReserveTime] = useState("");
  const [customTime, setCustomTime] = useState<string>("");
  const [selectedSlot, setSelectedSlot] = useState<string>("");
  const [customerLocation, setCustomerLocation] = useState<string>("");
  const [localBookings, setLocalBookings] = useState<any[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingStep, setBookingStep] = useState<"details" | "payment" | "animating" | "confirmed">("details");
  const [paymentAppUsed, setPaymentAppUsed] = useState<string>("");
  const [copiedText, setCopiedText] = useState<string>("");
  const [paymentTimer, setPaymentTimer] = useState<number>(300);

  useEffect(() => {
    let interval: any;
    if (bookingStep === "payment") {
      setPaymentTimer(300);
      interval = setInterval(() => {
        setPaymentTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [bookingStep]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCopyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => {
      setCopiedText("");
    }, 2000);
  };

  const isCtaActive = reserveDate !== "" && reserveTime !== "" && (reserveTime !== "Custom Time" || customTime.trim() !== "");
  const isModalBookingValid = selectedSlot !== "" && customerLocation.trim() !== "" && (selectedSlot !== "Custom Time" || customTime.trim() !== "");

  // Manage body scroll lock during modal visibility
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflowX = "hidden";
    } else {
      document.body.style.overflowX = "";
    }
    return () => {
      document.body.style.overflowX = "";
    };
  }, [isModalOpen]);

  // Load bookings from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("oncar_bookings");
    if (saved) {
      try {
        setLocalBookings(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse local bookings", e);
      }
    }
  }, []);

  // Handle URL parameters (for search clicks)
  useEffect(() => {
    if (bookPlanParam && plans.length > 0) {
      const plan = plans.find((p: any) => p.id === parseInt(bookPlanParam));
      if (plan) {
        setSelectedPlan(plan);
        setIsModalOpen(true);
      }
    }
  }, [bookPlanParam, plans]);

  const handleReserveBook = (plan: any) => {
    let finalTime = reserveTime;
    if (reserveTime === "Custom Time") {
      finalTime = customTime ? `Custom Time (${customTime})` : "Custom Time";
    }

    const message = `Hi OnCar, I want to book driving learning.
Plan: ${plan.name}
Price: ₹${plan.price.toLocaleString("en-IN")}
Date: ${reserveDate}
Time: ${finalTime}
City: Surat
Please confirm my booking.`;
    
    const newBooking = {
      planName: plan.name,
      price: plan.price.toLocaleString("en-IN"),
      duration: plan.duration,
      timeSlot: `${reserveDate} @ ${finalTime}`,
      location: "Surat",
      date: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
      time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
    };

    const updatedBookings = [newBooking, ...localBookings];
    setLocalBookings(updatedBookings);
    localStorage.setItem("oncar_bookings", JSON.stringify(updatedBookings));

    const whatsappUrl = formatWhatsAppLink(message, getSettingVal("whatsapp_number", "9213466544"));
    // Direct open WhatsApp app — no new tab/page opens on mobile
    window.location.href = whatsappUrl;
  };

  // Open booking modal
  const handleOpenBooking = (plan: any) => {
    setSelectedPlan(plan);
    setSelectedSlot("");
    setCustomTime("");
    setCustomerLocation("");
    setCouponCode("");
    setAppliedCoupon(null);
    setCouponError(null);
    setCouponSuccess(null);
    setBookingStep("details");
    setPaymentAppUsed("");
    setIsModalOpen(true);
  };

  // Close booking modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPlan(null);
    setCouponCode("");
    setAppliedCoupon(null);
    setCouponError(null);
    setCouponSuccess(null);
    setBookingStep("details");
    setPaymentAppUsed("");
  };

  // Calculate dynamic discount and final price
  const calculatePayablePrice = () => {
    if (!selectedPlan) return 0;
    if (!appliedCoupon) return selectedPlan.price;
    
    let discount = 0;
    if (appliedCoupon.discount_type === "flat") {
      discount = appliedCoupon.discount_value;
    } else if (appliedCoupon.discount_type === "percentage") {
      discount = (selectedPlan.price * appliedCoupon.discount_value) / 100;
      if (appliedCoupon.max_discount && discount > appliedCoupon.max_discount) {
        discount = appliedCoupon.max_discount;
      }
    }
    
    const finalPrice = selectedPlan.price - discount;
    return finalPrice > 0 ? finalPrice : 0;
  };

  // Apply Coupon
  const handleApplyCoupon = () => {
    if (!couponCode.trim()) return;
    setCouponError(null);
    setCouponSuccess(null);
    
    fetch(`/api/offers?code=${couponCode.trim()}`)
      .then((res) => {
        if (!res.ok) {
          return res.json().then(data => { throw new Error(data.error || "Invalid coupon code") });
        }
        return res.json();
      })
      .then((offer) => {
        // Validate minimum order amount
        if (offer.min_order_amount && selectedPlan.price < offer.min_order_amount) {
          setCouponError(`Min order amount ₹${offer.min_order_amount} required`);
          return;
        }
        
        // Validate plan applicability
        if (offer.service_id && offer.service_id !== selectedPlan.id) {
          setCouponError("Not applicable to this driving package");
          return;
        }
        
        setAppliedCoupon(offer);
        const discount = offer.discount_type === "flat" 
          ? offer.discount_value 
          : (selectedPlan.price * offer.discount_value) / 100;
        setCouponSuccess(`Coupon applied! You saved ₹${discount.toFixed(0)}`);
      })
      .catch((err) => {
        setCouponError(err.message || "Invalid coupon code");
      });
  };
  
  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponSuccess(null);
    setCouponError(null);
  };

  // Trigger booking confirmation and redirect directly to WhatsApp
  const handleConfirmBooking = () => {
    if (!isModalBookingValid) return;
    
    setBookingStep("animating");

    let timeSlotString = selectedSlot;
    if (selectedSlot === "Custom Time") {
      timeSlotString = customTime ? `Custom Time (${customTime})` : "Custom Time";
    }

    const finalPayable = calculatePayablePrice();
    const currentDate = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
    const currentTime = new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

    // Save to local storage history
    const newBooking = {
      planName: selectedPlan.name,
      price: finalPayable.toLocaleString("en-IN"),
      duration: selectedPlan.duration,
      timeSlot: timeSlotString,
      location: customerLocation || "Not specified",
      date: currentDate,
      time: currentTime,
      paymentMethod: "Pay on Visit",
      status: "Confirmed"
    };

    const updatedBookings = [newBooking, ...localBookings];
    setLocalBookings(updatedBookings);
    localStorage.setItem("oncar_bookings", JSON.stringify(updatedBookings));

    // WhatsApp Receipt Text Template specifying Pay on Visit
    const receiptMessage = `Hi OnCar, I want to book a driving learning package!

🧾 BOOKING DETAILS
--------------------------
Plan: ${selectedPlan.name}
Duration: ${selectedPlan.duration}
Preferred Slot: ${timeSlotString}
Location: ${customerLocation || "Not specified"}
Date: ${currentDate}
Time: ${currentTime}
Total Price: ₹${finalPayable.toLocaleString("en-IN")}
Payment Mode: Pay on Instructor Visit

*Note: Instructor visit ke time par payment directly pay karenge, uske baad class start hogi.*`;

    const whatsappUrl = formatWhatsAppLink(receiptMessage, getSettingVal("whatsapp_number", "9213466544"));

    // After animation: set confirmed state FIRST, then open WhatsApp app directly
    setTimeout(() => {
      setBookingStep("confirmed");
      // Small delay so confirmed UI renders before WhatsApp app opens
      setTimeout(() => {
        window.location.href = whatsappUrl;
      }, 400);
    }, 3200);
  };

  // Dynamic values
  const whatsappCtaText = getSettingVal("whatsapp_cta_text", "Book Trial Class");
  const plansCtaText = getSettingVal("plans_cta_text", "View Plans");
  const websiteName = getSettingVal("website_name", "OnCar");
  const tagline = getSettingVal("tagline", "Apni Car Mein Driving Seekho, Apne Time Par");
  const heroTitle = getSettingVal("hero_title", "Apni Car Mein Driving Seekho, Apne Time Par");
  const heroSubtitle = getSettingVal("hero_subtitle", "Verified instructor aapke ghar/location par aakar aapki own car me confidence driving sikhayega. Surat city ke liye premium driving learning service.");
  const heroImage = getSettingVal("hero_image", "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=1200&h=630&fit=crop");
  const videoEnabled = getSettingVal("video_enabled", "false") === "true";
  const videoUrl = getSettingVal("video_url", "");

  // Skeleton Loader for initial fetch
  if (loading) {
    return (
      <div className="bg-[#0B0A0F] min-h-screen text-white flex flex-col items-center justify-center p-6 space-y-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-white animate-bounce shadow-lg shadow-primary/30">
          <Car className="h-8 w-8" />
        </div>
        <div className="space-y-3 text-center max-w-sm">
          <div className="h-4 bg-white/10 rounded-full w-48 mx-auto animate-pulse" />
          <div className="h-3 bg-white/5 rounded-full w-64 mx-auto animate-pulse" />
        </div>
      </div>
    );
  }

  // Get Trial Class plan for direct CTAs
  const trialPlan = plans.find((p: any) => p.id === 1) || plans[0];

  return (
    <div className="bg-white min-h-screen text-text selection:bg-primary/20 selection:text-primary pb-20 lg:pb-0">
      
      {activeTab === "bookings" ? (
        /* MY BOOKINGS TAB VIEW */
        <div className="pt-28 pb-24 px-4 max-w-md mx-auto min-h-[80vh] flex flex-col animate-fade-in">
          <h2 className="text-2xl font-black text-secondary tracking-tight mb-6">My Bookings</h2>
          {localBookings.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 py-12">
              <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                <ClipboardList className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-base font-bold text-secondary">No Bookings Yet</h3>
                <p className="text-xs text-muted max-w-[250px] mx-auto mt-2">
                  Aapne abhi tak koi plan book nahi kiya hai. Trial ya regular plans select karke seekhna start karein!
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setActiveTab("home");
                  setTimeout(() => {
                    document.getElementById("plans")?.scrollIntoView({ behavior: "smooth" });
                  }, 100);
                }}
                className="px-6 py-2.5 rounded-full bg-primary text-white text-xs font-bold shadow-md shadow-primary/20"
              >
                {plansCtaText}
              </button>
            </div>
          ) : (
            <div className="space-y-4 overflow-y-auto">
              {localBookings.map((b: any, idx: number) => (
                <div key={idx} className="p-5 rounded-2xl border border-border bg-surface flex flex-col gap-3 shadow-xs">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-black text-primary uppercase tracking-wider">{b.duration} Plan</span>
                      <h4 className="text-base font-black text-secondary mt-0.5">{b.planName}</h4>
                    </div>
                    <span className="text-xs font-black text-emerald-600 bg-emerald-50 border border-emerald-200/50 px-3 py-1 rounded-full uppercase tracking-wider">
                      Sent
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-y-2 border-t border-border/50 pt-3 text-[11px]">
                    <div>
                      <span className="text-muted block">Price</span>
                      <span className="font-bold text-secondary">₹{b.price}</span>
                    </div>
                    <div>
                      <span className="text-muted block">Time Slot</span>
                      <span className="font-bold text-secondary">{b.timeSlot}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-muted block">Location</span>
                      <span className="font-bold text-secondary">{b.location}</span>
                    </div>
                  </div>
                  <div className="text-[10px] text-muted border-t border-border/50 pt-2 flex justify-between">
                    <span>Booked on {b.date}</span>
                    <span>{b.time}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* HERO & GENERAL SECTIONS (HOME TAB VIEW) */
        <div className="animate-fade-in">
          {/* PROMOTIONAL OFFERS BANNER AT THE TOP (BELOW FIXED NAVBAR) */}
          {offers && offers.length > 0 && (
            <section className="pt-24 lg:pt-28 pb-3 bg-primary/5 border-b border-border overflow-hidden">
              <div className="mx-auto max-w-7xl px-4 flex items-center gap-4 overflow-x-auto scrollbar-none whitespace-nowrap snap-x">
                {offers.map((offer: any) => (
                  <div key={offer.id} className="inline-flex items-center gap-3 bg-white border border-primary/20 rounded-full px-4 py-2 text-xs font-semibold text-secondary snap-center shrink-0 shadow-xs">
                    <span className="bg-primary text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full tracking-wider animate-pulse">
                      Offer
                    </span>
                    <span className="font-bold">{offer.title}</span>
                    <span className="text-muted font-normal">|</span>
                    <span className="text-primary font-black">Code: {offer.code}</span>
                    <button
                      type="button"
                      onClick={() => {
                        if (offer.service_id) {
                          const plan = plans.find(p => p.id === offer.service_id);
                          if (plan) handleOpenBooking(plan);
                        } else {
                          document.getElementById("plans")?.scrollIntoView({ behavior: "smooth" });
                        }
                      }}
                      className="text-primary hover:underline font-black ml-1 uppercase text-[10px] tracking-wider"
                    >
                      {offer.cta_text || "Apply"}
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 1. HERO SECTION */}
          <section 
            id="home" 
            className={`relative pb-20 md:pb-28 overflow-hidden bg-gradient-to-b from-surface via-white to-white ${
              offers && offers.length > 0 ? "pt-8 md:pt-12" : "pt-32 md:pt-40"
            }`}
          >
            <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 -translate-x-12 translate-y-12 w-80 h-80 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
            
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
              <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
                
                {/* Left Column: Text content */}
                <div className="lg:col-span-7 space-y-6 text-left">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-wider">
                    <Sparkles className="h-3.5 w-3.5" />
                    Surat City&apos;s Own Car Driving Service
                  </div>
                  
                  <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-secondary leading-tight tracking-tight">
                    {heroTitle.includes("Driving Seekho") ? (
                      <>
                        Apni Car Mein <span className="text-primary">Driving Seekho</span>, <br />
                        <span className="relative inline-block">
                          Apne Time Par
                          <span className="absolute bottom-1 left-0 w-full h-2 bg-primary/10 -z-10 rounded-full" />
                        </span>
                      </>
                    ) : heroTitle}
                  </h1>
                  
                  <p className="text-base sm:text-lg text-muted max-w-2xl leading-relaxed">
                    {heroSubtitle}
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 pt-2">
                    {trialPlan && (
                      <button
                        type="button"
                        onClick={() => handleOpenBooking(trialPlan)}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full font-bold px-8 py-4 text-base bg-primary text-white hover:bg-primary/95 shadow-xl shadow-primary/30 active:scale-[0.98] transition-all duration-300"
                      >
                        <MessageCircle className="h-5 w-5" />
                        {whatsappCtaText}
                      </button>
                    )}
                    <button 
                      onClick={() => {
                        document.getElementById("plans")?.scrollIntoView({ behavior: "smooth" });
                      }}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full font-bold px-8 py-4 text-base border-2 border-secondary/20 hover:border-secondary hover:bg-secondary hover:text-white transition-all duration-300 active:scale-[0.98]"
                    >
                      {plansCtaText}
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Hero Stats */}
                  <div className="grid grid-cols-3 gap-6 pt-8 border-t border-border max-w-lg">
                    <div>
                      <div className="text-2xl font-black text-secondary">100%</div>
                      <div className="text-xs text-muted font-medium">Own Car Practice</div>
                    </div>
                    <div>
                      <div className="text-2xl font-black text-secondary">500+</div>
                      <div className="text-xs text-muted font-medium">Happy Learners</div>
                    </div>
                    <div>
                      <div className="text-2xl font-black text-secondary">Surat</div>
                      <div className="text-xs text-muted font-medium">Coverage Area</div>
                    </div>
                  </div>
                </div>

                {/* Right Column: Uber Reserve Booking Box */}
                <div className="lg:col-span-5 relative flex justify-center">
                  <div className="relative w-[calc(100vw-32px)] sm:w-[420px] bg-white rounded-[32px] p-6 shadow-2xl shadow-secondary/10 border border-border/40 overflow-hidden min-h-[420px] flex flex-col justify-between">
                    
                    {reserveStep === 1 ? (
                      /* Step 1: Date & Time Picker */
                      <div className="w-full flex flex-col justify-between min-h-[380px] animate-fade-in">
                        <div className="space-y-4">
                          <div className="text-left">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-wider">
                              Uber Reserve Style
                            </span>
                            <h3 className="text-xl font-black text-secondary mt-1">Book your driving slot</h3>
                            <p className="text-xs text-muted mt-0.5">Select date and time slot to customize your plan</p>
                          </div>

                          {/* Inputs Container */}
                          <div className="space-y-3 pt-2">
                            {/* Date Picker */}
                            <div className="space-y-1.5 text-left">
                              <label className="text-[10px] font-black text-secondary uppercase tracking-wider block">Select Date</label>
                              <input 
                                type="date"
                                value={reserveDate}
                                onChange={(e) => {
                                  setReserveDate(e.target.value);
                                  e.target.blur();
                                }}
                                min={new Date().toISOString().split("T")[0]}
                                className="w-full px-4 py-3 rounded-xl border border-border text-xs font-semibold outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all cursor-pointer bg-white text-secondary"
                              />
                            </div>

                            {/* Time Picker Dropdown (dynamically loaded slots) */}
                            <div className="space-y-1.5 text-left">
                              <label className="text-[10px] font-black text-secondary uppercase tracking-wider block">Select Time Slot</label>
                              <select
                                value={reserveTime}
                                onChange={(e) => setReserveTime(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-border text-xs font-semibold outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all cursor-pointer bg-white text-secondary"
                              >
                                <option value="">-- Choose Time Slot --</option>
                                {getSlots().map((slot: string, sIdx: number) => (
                                  <option key={sIdx} value={slot}>{slot}</option>
                                ))}
                              </select>
                            </div>

                            {/* Custom Time text input for Uber Reserve */}
                            {reserveTime === "Custom Time" && (
                              <div className="space-y-1.5 text-left animate-in slide-in-from-top-1 duration-150">
                                <label className="text-[10px] font-black text-secondary uppercase tracking-wider block">Specify Your Preferred Time</label>
                                <input 
                                  type="text"
                                  value={customTime}
                                  onChange={(e) => setCustomTime(e.target.value)}
                                  placeholder="e.g. 4:00 PM - 5:00 PM, Weekends only"
                                  className="w-full px-4 py-3 rounded-xl border border-border text-xs font-semibold outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all bg-white text-secondary"
                                />
                              </div>
                            )}
                          </div>
                        </div>

                        <button
                          type="button"
                          disabled={!isCtaActive}
                          onClick={() => setReserveStep(2)}
                          className="w-full bg-secondary text-white font-extrabold text-sm py-4 rounded-xl text-center active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none transition-all mt-6 shadow-lg shadow-secondary/10"
                        >
                          See Plans
                        </button>
                      </div>
                    ) : (
                      /* Step 2: Plans listing */
                      <div className="w-full flex flex-col justify-between min-h-[380px] animate-fade-in">
                        <div className="flex flex-col h-full">
                          {/* Back Link */}
                          <button 
                            onClick={() => setReserveStep(1)} 
                            className="flex items-center gap-1.5 text-[9px] font-black text-primary uppercase tracking-widest mb-3 self-start hover:opacity-85"
                          >
                            <ArrowLeft className="h-3.5 w-3.5" />
                            Edit Date & Time
                          </button>

                          <div className="text-left mb-4">
                            <h4 className="text-base font-black text-secondary">Choose driving package</h4>
                            <p className="text-[10px] text-muted">Selected: {reserveDate} @ {reserveTime}</p>
                          </div>

                          {/* Plans List */}
                          <div className="grid grid-cols-2 gap-2.5 max-h-[260px] overflow-y-auto pr-1 scrollbar-none">
                            {plans.map((plan: any) => (
                              <div 
                                key={plan.id} 
                                className="p-3 rounded-2xl border border-border bg-surface flex flex-col justify-between text-left relative min-h-[140px]"
                              >
                                <div>
                                  <span className="text-[8px] font-black text-primary uppercase">{plan.duration}</span>
                                  <h4 className="text-xs font-black text-secondary leading-tight mt-0.5 line-clamp-1">{plan.name}</h4>
                                  <div className="text-sm font-black text-secondary mt-1.5">₹{plan.price.toLocaleString("en-IN")}</div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleReserveBook(plan)}
                                  className="w-full mt-3 bg-primary hover:bg-primary/95 text-white font-black text-[10px] py-2 rounded-lg text-center transition-all active:scale-[0.97] shadow-sm"
                                >
                                  Book
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 2. TRUST BADGES SECTION */}
          <section id="why-oncar" className="py-8 bg-white border-y border-border/40 text-left">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-3xl mx-auto space-y-1.5">
                <h2 className="text-xs font-black text-primary uppercase tracking-widest">Why Choose Us?</h2>
                <p className="text-2xl sm:text-3xl font-black text-secondary tracking-tight">
                  Aapki Car, Aapki Location, Apne Time Par!
                </p>
              </div>

              {/* Dynamic Trust Badges Slider */}
              <div className="flex overflow-x-auto lg:justify-center snap-x snap-mandatory gap-3 pt-6 pb-4 scrollbar-none">
                {getBadges().map((item: any, idx: number) => {
                  const Icon = iconMap[item.icon] || Car;
                  return (
                    <div 
                      key={idx} 
                      className="flex items-start shrink-0 w-[78vw] sm:w-[300px] h-[120px] p-4 bg-white rounded-[20px] border border-border/50 shadow-sm hover:shadow-md hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 ease-out snap-center gap-3.5 select-none text-left"
                    >
                      <div className="h-9 w-9 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-xs sm:text-sm font-black text-secondary leading-tight truncate">{item.title}</h3>
                        <p className="text-[10px] sm:text-xs text-muted font-medium mt-1 leading-snug line-clamp-3">{item.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* 3. HOW IT WORKS */}
          <section id="how-it-works" className="py-8 bg-surface">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-3xl mx-auto space-y-1.5">
                <h2 className="text-xs font-black text-primary uppercase tracking-widest">How It Works</h2>
                <p className="text-2xl sm:text-3xl font-black text-secondary tracking-tight">
                  4 Steps To Build Real Road Confidence
                </p>
              </div>

              <div className="flex overflow-x-auto lg:justify-center snap-x snap-mandatory gap-4 pt-8 pb-4 scrollbar-none">
                {[
                  { title: "Plan Choose Karo", desc: "Choose the driving plan that suits you." },
                  { title: "Book on WhatsApp", desc: "Select your preferred time slot and book instantly." },
                  { title: "Verified Instructor", desc: "Instructor reaches your location on time." },
                  { title: "Learn & Drive", desc: "Practice in your own car and build confidence." },
                ].map((step: any, idx: number) => (
                  <div 
                    key={idx} 
                    className="flex items-center shrink-0 w-[82vw] sm:w-[350px] h-[120px] p-5 bg-white rounded-[20px] border border-border/50 shadow-sm hover:shadow-md hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 ease-out snap-center gap-4 select-none"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-white font-black text-base shadow-md shadow-primary/20">
                      {idx + 1}
                    </div>
                    <div className="text-left min-w-0">
                      <h3 className="text-sm sm:text-base font-black text-secondary leading-tight truncate">{step.title}</h3>
                      <p className="text-xs text-muted font-medium mt-1 leading-snug line-clamp-2">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 4. PLANS SECTION */}
          <section id="plans" className="py-12 bg-white scroll-mt-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-3xl mx-auto space-y-2">
                <h2 className="text-xs font-black text-primary uppercase tracking-widest">Our Plans</h2>
                <p className="text-2xl sm:text-3xl font-black text-secondary tracking-tight">
                  Choose the Best Plan for Your Learning Goals
                </p>
                <p className="text-xs sm:text-sm text-muted">
                  Select one of our tailored packages. Simple booking process with zero hidden costs.
                </p>
              </div>

              {/* Grid: 2 columns on mobile, 3 columns on desktop */}
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 pt-10">
                {plans.map((plan: any) => (
                  <div 
                    key={plan.id} 
                    className={`relative flex flex-col justify-between rounded-[20px] p-3.5 sm:p-6 border transition-all duration-300 ${
                      plan.is_popular 
                        ? "border-primary shadow-lg bg-surface" 
                        : "border-border/60 shadow-sm hover:shadow-md bg-white hover:border-primary/20"
                    }`}
                  >
                    {plan.is_popular === 1 && (
                      <div className="absolute top-0 right-0 bg-primary text-white text-[8px] sm:text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-bl-lg rounded-tr-lg">
                        Popular
                      </div>
                    )}

                    <div className="text-left">
                      <span className="text-[9px] sm:text-xs font-black uppercase tracking-wider text-primary">{plan.duration}</span>
                      <h3 className="text-xs sm:text-base font-black text-secondary leading-tight mt-0.5 line-clamp-1">{plan.name}</h3>
                      
                      <div className="flex items-baseline gap-0.5 mt-2">
                        <span className="text-sm sm:text-xl font-black text-secondary">₹{plan.price.toLocaleString("en-IN")}</span>
                        <span className="text-[8px] sm:text-xs text-muted font-bold">/ Total</span>
                      </div>
                    </div>

                    {/* Plan Features */}
                    <ul className="space-y-1.5 mt-3 mb-4 flex-1 min-h-[36px] sm:min-h-[48px] text-left">
                      {Array.isArray(plan.features) ? plan.features.slice(0, 2).map((feature: string, fIdx: number) => (
                        <li key={fIdx} className="flex items-start gap-1 text-[9px] sm:text-xs text-muted font-bold leading-tight">
                          <Check className="h-3 w-3 text-primary shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{feature}</span>
                        </li>
                      )) : (
                        <li className="flex items-start gap-1 text-[9px] sm:text-xs text-muted font-bold leading-tight">
                          <Check className="h-3 w-3 text-primary shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{plan.description}</span>
                        </li>
                      )}
                    </ul>

                    <div>
                      <button
                        type="button"
                        onClick={() => handleOpenBooking(plan)}
                        className="w-full text-center rounded-full font-black py-2 text-[10px] sm:text-xs bg-primary text-white hover:bg-primary/95 shadow-md shadow-primary/10 active:scale-[0.98] transition-all"
                      >
                        Book
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 5. 10-SEC VIDEO SECTION */}
          {videoEnabled && videoUrl && (
            <section className="py-12 bg-surface border-y border-border/40">
              <div className="mx-auto max-w-3xl px-4 text-center space-y-6">
                <div className="space-y-1.5">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-wider">
                    <Sparkles className="h-3 w-3" /> See inside class
                  </span>
                  <h3 className="text-2xl font-black text-secondary">Watch How We Teach</h3>
                  <p className="text-xs text-muted">A quick 10-second confidence preview of own car practice under dual controls.</p>
                </div>

                <div className="relative aspect-video rounded-3xl overflow-hidden border border-border/80 shadow-xl bg-secondary flex items-center justify-center group">
                  {videoUrl.includes(".mp4") ? (
                    <video 
                      src={videoUrl} 
                      controls 
                      className="w-full h-full object-cover" 
                      playsInline
                    />
                  ) : (
                    <iframe 
                      src={videoUrl}
                      className="w-full h-full border-none"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  )}
                </div>
              </div>
            </section>
          )}

          {/* 6. VERIFIED INSTRUCTOR SECTION */}
          <section className="py-20 bg-white">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
                
                {/* Left Text Column */}
                <div className="lg:col-span-7 space-y-6">
                  <h2 className="text-xs font-black text-primary uppercase tracking-widest">Safety & Guidance</h2>
                  <p className="text-3xl sm:text-4xl font-black text-secondary tracking-tight leading-tight">
                    Learn Safely with Verified & Patient Instructors
                  </p>
                  <p className="text-sm text-muted leading-relaxed">
                    Driving requires patience and technical understanding. Our pool of instructors is selected after strict background verifications and driving audits. They are trained to make you learn at your own pace without panic.
                  </p>
                  
                  <ul className="grid gap-3 sm:grid-cols-2 pt-2">
                    {[
                      "100% Background Verified Profiles",
                      "Professional & Patient Demeanor",
                      "Expert in Manual & Automatic Cars",
                      "Traffic Law & Safety Experts",
                      "Surat Route Local Specialists",
                      "Dual-Control Safety Audits",
                    ].map((text, idx) => (
                      <li key={idx} className="flex items-center gap-2.5 text-xs text-muted font-bold">
                        <div className="h-5 w-5 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                          <Check className="h-3 w-3" />
                        </div>
                        <span>{text}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Right Image Column */}
                <div className="lg:col-span-5 relative flex justify-center">
                  <div className="relative w-full max-w-[450px] aspect-[4/5] rounded-[32px] overflow-hidden shadow-2xl border-4 border-white">
                    <Image 
                      src="https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800&fit=crop"
                      alt="Verified instructor safety guidance"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-6 left-6 bg-primary text-white text-[10px] font-black uppercase tracking-wider px-3.5 py-1 rounded-full shadow-lg">
                      Safety First
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 7. TESTIMONIALS SECTION */}
          {getTestimonials().length > 0 && (
            <section className="py-12 bg-surface">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto space-y-1.5 mb-10">
                  <h2 className="text-xs font-black text-primary uppercase tracking-widest">Learner Feedback</h2>
                  <p className="text-2xl sm:text-3xl font-black text-secondary tracking-tight">
                    What Our Learners Say About Us
                  </p>
                </div>

                {/* Testimonial snap slider */}
                <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 scrollbar-none">
                  {getTestimonials().map((testimonial: any, idx: number) => (
                    <div 
                      key={idx} 
                      className="flex flex-col justify-between shrink-0 w-[85vw] sm:w-[360px] p-6 bg-white rounded-2xl border border-border/80 shadow-xs snap-center text-left"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center gap-1 text-amber-500">
                          {Array.from({ length: testimonial.rating || 5 }).map((_, i) => (
                            <Star key={i} className="h-3.5 w-3.5 fill-current" />
                          ))}
                        </div>
                        <p className="text-xs sm:text-sm text-muted font-medium italic leading-relaxed">&quot;{testimonial.text}&quot;</p>
                      </div>
                      <div className="mt-5 pt-4 border-t border-border/60 flex justify-between items-center text-xs">
                        <div>
                          <span className="font-black text-secondary block">{testimonial.name}</span>
                          <span className="text-[10px] text-muted">{testimonial.location}</span>
                        </div>
                        {testimonial.service && (
                          <span className="text-[10px] bg-primary/10 text-primary border border-primary/20 rounded-full px-2 py-0.5 font-bold">
                            {testimonial.service}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* 8. WHATSAPP CTA BANNER */}
          <section className="bg-primary py-16 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary via-indigo-600 to-primary" />
            <div className="absolute -top-24 -right-24 w-80 h-80 bg-white/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-white/10 rounded-full blur-2xl pointer-events-none" />
            
            <div className="mx-auto max-w-4xl px-4 text-center relative z-10 space-y-6">
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
                Apni Car Par Control Haasil Karne Ke Liye Tayyar Hain?
              </h2>
              <p className="text-sm sm:text-base text-white/80 max-w-xl mx-auto leading-relaxed">
                WhatsApp button par click karke abhi Trial Class (₹{trialPlan?.price || 399}) book karein aur verified instructor ke guidance me safely drive karna seekhein.
              </p>
              <div className="pt-2 flex justify-center">
                {trialPlan && (
                  <button
                    type="button"
                    onClick={() => handleOpenBooking(trialPlan)}
                    className="inline-flex items-center justify-center gap-2 rounded-full font-bold bg-white text-primary hover:bg-white/95 shadow-xl transition-all duration-300 px-8 py-4 active:scale-[0.98]"
                  >
                    <MessageCircle className="h-5 w-5 text-primary" />
                    Book Trial Class Now
                  </button>
                )}
              </div>
            </div>
          </section>
        </div>
      )}

      {/* 9. BOOK NOW POPUP MODAL */}
      {isModalOpen && selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-border/40 animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            
            {bookingStep === "confirmed" ? (
              /* BOOKING CONFIRMED STATE — user sees this after WhatsApp opens */
              <div className="p-8 flex flex-col items-center justify-center text-center space-y-5 min-h-[420px] animate-in fade-in duration-300">
                {/* OnCar Logo Branding */}
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white shadow-md">
                    <Car className="h-5 w-5" />
                  </div>
                  <span className="text-lg font-black tracking-tight text-secondary">
                    On<span className="text-primary">Car</span>
                  </span>
                </div>

                {/* Confirmed Green Check */}
                <div className="relative flex items-center justify-center py-3">
                  <div className="absolute h-20 w-20 rounded-full bg-emerald-500/10 animate-pulse" />
                  <div className="h-16 w-16 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20">
                    <Check className="h-9 w-9 stroke-[3.5]" />
                  </div>
                </div>

                <div className="space-y-2 px-2">
                  <h3 className="text-lg font-black text-secondary">Booking Confirmed! ✅</h3>
                  <p className="text-xs text-amber-800 font-bold p-3 bg-amber-50 rounded-2xl border border-amber-200 leading-relaxed">
                    Instructor aapke location par visit karenge tab payment kar dena hai, uske baad driving classes start ho jayengi.
                  </p>
                </div>

                {/* Confirmed Receipt Preview */}
                <div className="w-full max-w-xs bg-surface border border-border/80 rounded-2xl p-4 text-left text-[11px] font-bold text-muted space-y-2">
                  <div className="flex justify-between border-b border-border/40 pb-1.5">
                    <span>Package:</span>
                    <span className="text-secondary">{selectedPlan.name}</span>
                  </div>
                  <div className="flex justify-between border-b border-border/40 pb-1.5">
                    <span>Payable Price:</span>
                    <span className="text-primary font-black">₹{calculatePayablePrice().toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between border-b border-border/40 pb-1.5">
                    <span>Time Slot:</span>
                    <span className="text-secondary">{selectedSlot === "Custom Time" && customTime ? customTime : selectedSlot}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payment Status:</span>
                    <span className="text-amber-600">Pay on Visit</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="w-full max-w-xs space-y-3 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      handleCloseModal();
                      setActiveTab("bookings");
                    }}
                    className="w-full flex items-center justify-center gap-2 rounded-full font-bold bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/25 py-3.5 text-sm transition-all active:scale-[0.98]"
                  >
                    <ClipboardList className="h-4 w-4" />
                    View My Bookings
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      handleCloseModal();
                    }}
                    className="w-full flex items-center justify-center gap-2 rounded-full font-bold bg-surface text-secondary border border-border hover:bg-border/30 py-3 text-xs transition-all active:scale-[0.98]"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : bookingStep === "animating" ? (
              <div className="p-8 flex flex-col items-center justify-center text-center space-y-6 min-h-[420px] animate-in fade-in duration-300">
                {/* OnCar Logo Branding */}
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white shadow-md">
                    <Car className="h-5 w-5" />
                  </div>
                  <span className="text-lg font-black tracking-tight text-secondary">
                    On<span className="text-primary">Car</span>
                  </span>
                </div>

                {/* Animated Green Check Circle */}
                <div className="relative flex items-center justify-center py-4">
                  {/* Pulse Rings */}
                  <div className="absolute h-24 w-24 rounded-full bg-emerald-500/20 animate-ping duration-1000" />
                  <div className="absolute h-20 w-20 rounded-full bg-emerald-500/10 animate-pulse" />
                  
                  {/* Main Circle */}
                  <div className="h-16 w-16 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20 animate-in zoom-in duration-500">
                    <Check className="h-9 w-9 stroke-[3.5] animate-bounce" />
                  </div>
                </div>

                <div className="space-y-2 px-2">
                  <h3 className="text-lg font-black text-secondary">Booking Request Sent!</h3>
                  <p className="text-xs text-amber-800 font-bold p-3 bg-amber-50 rounded-2xl border border-amber-200 leading-relaxed">
                    Instructor aapke location par visit karenge tab payment kar dena hai, uske baad driving classes start ho jayengi.
                  </p>
                </div>

                {/* Loading Receipt Preview */}
                <div className="w-full max-w-xs bg-surface border border-border/80 rounded-2xl p-4 text-left text-[11px] font-bold text-muted space-y-2">
                  <div className="flex justify-between border-b border-border/40 pb-1.5">
                    <span>Package:</span>
                    <span className="text-secondary">{selectedPlan.name}</span>
                  </div>
                  <div className="flex justify-between border-b border-border/40 pb-1.5">
                    <span>Payable Price:</span>
                    <span className="text-primary font-black">₹{calculatePayablePrice().toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between border-b border-border/40 pb-1.5">
                    <span>Time Slot:</span>
                    <span className="text-secondary">{selectedSlot === "Custom Time" && customTime ? customTime : selectedSlot}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payment Status:</span>
                    <span className="text-amber-600">Pay on Visit</span>
                  </div>
                </div>

                <div className="text-[10px] text-muted flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                  <span>Opening WhatsApp...</span>
                </div>
              </div>
            ) : (
              <>
                {/* Modal Header */}
                <div className="p-6 border-b border-border/50 flex justify-between items-center bg-surface shrink-0">
                  <div>
                    <span className="text-[10px] font-black text-primary uppercase tracking-widest">{selectedPlan.duration} Driving Plan</span>
                    <h3 className="text-xl font-black text-secondary leading-tight mt-0.5">{selectedPlan.name}</h3>
                  </div>
                  <button 
                    type="button" 
                    onClick={handleCloseModal}
                    className="p-2 rounded-full hover:bg-border/30 text-secondary transition-colors"
                    aria-label="Close booking details"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Modal Body */}
                <div className="max-h-[50vh] sm:max-h-[60vh] overflow-y-auto p-6 sm:p-8 space-y-6">
                  {/* Plan Pricing & Duration Summary */}
                      <div className="flex justify-between items-center p-4 bg-primary/5 rounded-2xl border border-primary/10">
                        <div>
                          <span className="text-[10px] font-bold text-muted uppercase">Duration</span>
                          <div className="text-sm font-black text-secondary mt-0.5">{selectedPlan.duration}</div>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] font-bold text-muted uppercase">Price</span>
                          <div className="flex items-baseline justify-end gap-1.5 mt-0.5">
                            {appliedCoupon ? (
                              <>
                                <span className="text-xs text-muted line-through">₹{selectedPlan.price}</span>
                                <span className="text-xl font-black text-primary">
                                  ₹{calculatePayablePrice().toLocaleString("en-IN")}
                                </span>
                              </>
                            ) : (
                              <span className="text-xl font-black text-primary">
                                  ₹{selectedPlan.price.toLocaleString("en-IN")}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Key Benefits */}
                      <div className="space-y-3 text-left">
                        <h4 className="text-xs font-black text-secondary uppercase tracking-wider">Key Benefits</h4>
                        <ul className="grid gap-2 sm:grid-cols-2">
                          {Array.isArray(selectedPlan.features) ? selectedPlan.features.map((feature: string, fIdx: number) => (
                            <li key={fIdx} className="flex items-start gap-2 text-xs text-muted font-semibold">
                              <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                              <span>{feature}</span>
                            </li>
                          )) : (
                            <li className="flex items-start gap-2 text-xs text-muted font-semibold">
                              <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                              <span>{selectedPlan.description}</span>
                            </li>
                          )}
                        </ul>
                      </div>

                      {/* Meet Your Instructor Profile Card */}
                      <div className="bg-surface border border-border p-5 rounded-2xl space-y-4 text-left">
                        <div className="flex items-center gap-3">
                          <div className="h-11 w-11 rounded-full bg-gradient-to-tr from-primary to-indigo-500 text-white flex items-center justify-center font-black text-xs shadow-md shrink-0">
                            SN
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h4 className="text-xs font-black text-secondary">Sandip Nishad</h4>
                              <span className="bg-emerald-550/10 text-emerald-600 border border-emerald-250/20 text-[8px] font-black uppercase px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                                <Check className="h-2.5 w-2.5" /> Verified
                              </span>
                            </div>
                            <p className="text-[9px] text-muted font-bold mt-0.5">OnCar Driving Coach • Serving Surat</p>
                          </div>
                        </div>

                        <p className="text-[10px] text-muted font-medium italic leading-relaxed">
                          &quot;Learn driving in your own car with personalized one-to-one guidance. Flexible timing and doorstep training to build real-road confidence.&quot;
                        </p>

                        <div className="grid grid-cols-2 gap-3 text-[10px] pt-1">
                          <div className="space-y-1">
                            <span className="text-muted block font-semibold text-[9px] uppercase">Specialization</span>
                            <div className="flex flex-wrap gap-1">
                              <span className="bg-primary/5 text-primary border border-primary/10 px-1.5 py-0.5 rounded font-bold text-[8px]">Manual & Auto</span>
                              <span className="bg-primary/5 text-primary border border-primary/10 px-1.5 py-0.5 rounded font-bold text-[8px]">Traffic Driving</span>
                            </div>
                          </div>
                          <div className="space-y-1">
                            <span className="text-muted block font-semibold text-[9px] uppercase">Languages</span>
                            <div className="flex flex-wrap gap-1">
                              <span className="bg-secondary/5 text-secondary border border-secondary/10 px-1.5 py-0.5 rounded font-bold text-[8px]">Hindi</span>
                              <span className="bg-secondary/5 text-secondary border border-secondary/10 px-1.5 py-0.5 rounded font-bold text-[8px]">Gujarati</span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white/50 border border-border/60 rounded-xl p-2 flex justify-between items-center text-[9px] font-bold text-muted">
                          <span>Students Trained: <strong className="text-secondary font-black">100+</strong></span>
                          <span>Rating: <strong className="text-amber-500 font-black">★ 4.9/5</strong></span>
                        </div>
                      </div>

                      {/* Plan Pricing & Duration Summary */}
                  <div className="flex justify-between items-center p-4 bg-primary/5 rounded-2xl border border-primary/10">
                    <div>
                      <span className="text-[10px] font-bold text-muted uppercase">Duration</span>
                      <div className="text-sm font-black text-secondary mt-0.5">{selectedPlan.duration}</div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-bold text-muted uppercase">Price</span>
                      <div className="flex items-baseline justify-end gap-1.5 mt-0.5">
                        {appliedCoupon ? (
                          <>
                            <span className="text-xs text-muted line-through">₹{selectedPlan.price}</span>
                            <span className="text-xl font-black text-primary">
                              ₹{calculatePayablePrice().toLocaleString("en-IN")}
                            </span>
                          </>
                        ) : (
                          <span className="text-xl font-black text-primary">
                            ₹{selectedPlan.price.toLocaleString("en-IN")}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="bg-amber-50/70 border border-amber-200/50 rounded-xl p-3 flex justify-between items-center text-[10px] font-black text-amber-800">
                    <span>⚡ Pay on Visit / Cash or UPI</span>
                    <span>No Advance Payment Required</span>
                  </div>

                  {/* Time Slot Selection */}
                  <div className="space-y-1.5 text-left">
                    <label className="text-[10px] font-black text-secondary uppercase tracking-wider block">Select Preferred Time Slot</label>
                    <select
                      value={selectedSlot}
                      onChange={(e) => setSelectedSlot(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-border text-xs font-semibold outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all cursor-pointer bg-white text-secondary"
                    >
                      <option value="">-- Choose Time Slot --</option>
                      {getSlots().map((slot: string, sIdx: number) => (
                        <option key={sIdx} value={slot}>{slot}</option>
                      ))}
                    </select>
                  </div>

                  {/* Promo Code Coupon Input */}
                  <div className="space-y-1.5 text-left">
                    <label className="text-[10px] font-black text-secondary uppercase tracking-wider block">Have a Coupon Code?</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => {
                          setCouponCode(e.target.value.toUpperCase());
                          setCouponError(null);
                        }}
                        placeholder="e.g. TRIAL100, FIRSTDRIVE"
                        disabled={!!appliedCoupon}
                        className="flex-1 px-4 py-3 rounded-xl border border-border text-xs font-semibold outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all uppercase disabled:bg-surface disabled:text-muted bg-white text-secondary"
                      />
                      {appliedCoupon ? (
                        <button
                          type="button"
                          onClick={handleRemoveCoupon}
                          className="px-4 rounded-xl bg-red-50 text-red-650 hover:bg-red-100 border border-red-200/50 text-xs font-bold transition-all h-11 text-red-600 shrink-0"
                        >
                          Remove
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={handleApplyCoupon}
                          className="px-5 rounded-xl bg-primary text-white hover:bg-primary/95 text-xs font-bold transition-all h-11 shrink-0"
                        >
                          Apply
                        </button>
                      )}
                    </div>
                    {couponError && (
                      <p className="text-[10px] text-red-600 font-bold flex items-center gap-1 mt-1 animate-pulse text-left">
                        <AlertCircle className="h-3.5 w-3.5 text-red-600 shrink-0" /> {couponError}
                      </p>
                    )}
                    {couponSuccess && (
                      <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-1 mt-1 text-left">
                        <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" /> {couponSuccess}
                      </p>
                    )}
                  </div>

                  {/* Custom Time Text Input */}
                  {selectedSlot === "Custom Time" && (
                    <div className="space-y-2 animate-in slide-in-from-top-1 duration-150 text-left">
                      <label className="text-[10px] font-black text-secondary uppercase tracking-wider block">Specify Your Preferred Time</label>
                      <input 
                        type="text"
                        value={customTime}
                        onChange={(e) => setCustomTime(e.target.value)}
                        placeholder="e.g. 4:00 PM - 5:00 PM, Weekends only"
                        className="w-full px-4 py-3 rounded-xl border border-border text-xs font-semibold outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all bg-white text-secondary"
                      />
                    </div>
                  )}

                  {/* Location Input */}
                  <div className="space-y-2 text-left">
                    <label className="text-[10px] font-black text-secondary uppercase tracking-wider block">Your Location in Surat</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted pointer-events-none" />
                      <input 
                        type="text"
                        value={customerLocation}
                        onChange={(e) => setCustomerLocation(e.target.value)}
                        placeholder="e.g. Vesu, Adajan, Pal, Varachha"
                        className="w-full pl-9 pr-4 py-3 rounded-xl border border-border text-xs font-semibold outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all bg-white text-secondary"
                      />
                    </div>
                  </div>
                </div>

                {/* Modal Footer Action */}
                <div className="p-6 bg-surface border-t border-border/50 shrink-0">
                  <button
                    type="button"
                    disabled={!isModalBookingValid}
                    onClick={handleConfirmBooking}
                    className="w-full flex items-center justify-center gap-2 rounded-full font-bold bg-[#25D366] text-white hover:bg-[#20BD5A] shadow-lg shadow-[#25D366]/25 py-4 text-sm transition-all active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none"
                  >
                    <MessageCircle className="h-5 w-5" />
                    Confirm Booking on WhatsApp
                  </button>
                </div>
              </>
            )}

          </div>
        </div>
      )}

      {/* 10. MOBILE BOTTOM NAVIGATION TAB BAR */}
      <nav 
        className={`lg:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-border/85 pb-safe-bottom z-40 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] transition-transform duration-300 ${
          showStickyCta && activeTab === "home" && !isModalOpen ? "translate-y-full" : "translate-y-0"
        }`}
      >
        <div className="flex justify-around py-3 px-4">
          {[
            { 
              id: "home", 
              label: "Home", 
              icon: HomeIcon, 
              action: () => { 
                setActiveTab("home"); 
                window.scrollTo({ top: 0, behavior: "smooth" }); 
              } 
            },
            { 
              id: "plans", 
              label: "Plans", 
              icon: ClipboardList, 
              action: () => { 
                setActiveTab("home"); 
                setTimeout(() => { 
                  document.getElementById("plans")?.scrollIntoView({ behavior: "smooth" }); 
                }, 100); 
              } 
            },
            { 
              id: "bookings", 
              label: "My Booking", 
              icon: ShieldCheck, 
              action: () => { 
                setActiveTab("bookings"); 
              } 
            }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={tab.action}
                className="flex flex-col items-center justify-center gap-0.5 text-center group outline-none shrink-0"
              >
                <Icon className={`h-5.5 w-5.5 transition-all ${
                  isActive ? "text-primary scale-110" : "text-gray-400 group-hover:text-primary"
                }`} />
                <span className={`text-[10px] font-black transition-colors tracking-wide ${
                  isActive ? "text-primary" : "text-gray-400 group-hover:text-primary"
                }`}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* 11. UBER-STYLE STICKY BOTTOM PLANS CTA */}
      <div 
        className={`lg:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-border/85 px-6 py-4 pb-safe-bottom z-40 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] transition-transform duration-300 ${
          showStickyCta && activeTab === "home" && !isModalOpen ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <button
          type="button"
          onClick={() => {
            document.getElementById("plans")?.scrollIntoView({ behavior: "smooth" });
          }}
          className="w-full bg-secondary text-white font-extrabold text-sm py-4 rounded-xl text-center shadow-lg active:scale-[0.98] transition-all duration-300"
        >
          {plansCtaText}
        </button>
      </div>

    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <HomeContent />
    </Suspense>
  );
}
