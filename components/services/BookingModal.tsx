"use client";

import { useState, useEffect } from "react";
import { X, Calendar, Clock, User, Phone, MapPin, FileText, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { buildWhatsAppMessage, formatWhatsAppLink } from "@/lib/utils";
import { SERVICE_AREAS } from "@/lib/areas";
import { useSearchParams, useRouter } from "next/navigation";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: {
    id: number;
    name: string;
    price: number;
    duration: string;
    category_name?: string;
    discount_type?: string | null;
    discount_value?: number | null;
  };
  settings: {
    phone: string;
    whatsapp_number: string;
    booking_message: string;
    available_time_slots: string[];
    advance_booking_days: string;
  };
}

export function BookingModal({ isOpen, onClose, service, settings }: BookingModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    area: "",
    address: "",
    date: "",
    timeSlot: settings.available_time_slots[0] || "09:00 AM - 11:00 AM",
    notes: "",
  });

  const quantity = 1;
  const [warrantyAddon, setWarrantyAddon] = useState(false);
  const [premiumAddon, setPremiumAddon] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();
  const queryOfferCode = searchParams ? searchParams.get("offerCode") : null;

  const [appliedOffer, setAppliedOffer] = useState<any>(null);
  const [offerError, setOfferError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && queryOfferCode) {
      setOfferError(null);
      fetch(`/api/offers?code=${queryOfferCode}`)
        .then((res) => {
          if (res.ok) return res.json();
          throw new Error("Invalid coupon");
        })
        .then((data) => {
          if (data.service_id && data.service_id !== service.id) {
            setOfferError(`Offer code ${queryOfferCode} is not applicable to this service.`);
            return;
          }
          setAppliedOffer(data);
        })
        .catch((err) => {
          console.error("Coupon lookup error:", err);
          setOfferError(`Offer code "${queryOfferCode}" is invalid or expired.`);
        });
    } else {
      setAppliedOffer(null);
      setOfferError(null);
    }
  }, [isOpen, queryOfferCode, service.id]);

  if (!isOpen) return null;

  // Calculate booking date range
  const today = new Date().toISOString().split("T")[0];
  const maxDate = new Date();
  const advanceDays = parseInt(settings.advance_booking_days || "7", 10);
  maxDate.setDate(maxDate.getDate() + advanceDays);
  const maxDateStr = maxDate.toISOString().split("T")[0];

  // Real-time calculations for view
  const basePrice = service.price || 0;
  const warrantyCost = warrantyAddon ? 99 : 0;
  const premiumCost = premiumAddon ? 149 : 0;
  const subtotal = basePrice * quantity;
  const addonsTotal = warrantyCost + premiumCost;
  const originalTotal = subtotal + addonsTotal;

  let discount = 0;
  let offerWarning = null;
  let discountLabel = "";

  if (appliedOffer && !offerError) {
    const minAmt = appliedOffer.min_order_amount || 0;
    if (subtotal < minAmt) {
      offerWarning = `Minimum order amount of ₹${minAmt} required for code ${appliedOffer.code}.`;
      discount = 0;
    } else {
      if (appliedOffer.discount_type === "percentage") {
        discount = Math.round(subtotal * (appliedOffer.discount_value || 0) / 100);
      } else if (appliedOffer.discount_type === "fixed") {
        discount = Math.min(subtotal, (appliedOffer.discount_value || 0) * quantity);
      }
      if (appliedOffer.max_discount && discount > appliedOffer.max_discount) {
        discount = appliedOffer.max_discount;
      }
      discountLabel = `Offer ${appliedOffer.code}: ${appliedOffer.discount_value}% OFF applied`;
    }
  } else {
    // Fallback to standard service discount
    if (service.discount_type === "percentage") {
      discount = Math.round(subtotal * (service.discount_value || 0) / 100);
    } else if (service.discount_type === "fixed") {
      discount = Math.min(subtotal, (service.discount_value || 0) * quantity);
    }
    if (discount > 0) {
      discountLabel = "Promotion Discount Applied";
    }
  }
  const finalAmount = Math.max(0, originalTotal - discount);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.area) {
      setError("Please select a service Area in Surat.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Fetch latest service data dynamically from database before opening WhatsApp
      const serviceRes = await fetch(`/api/services?id=${service.id}`);
      if (!serviceRes.ok) {
        throw new Error("Failed to fetch latest service details");
      }
      const latestService = await serviceRes.json();

      // Recalculate based on latest db prices to avoid tampering
      const lBasePrice = latestService.price || 0;
      const lSubtotal = lBasePrice * quantity;
      const lAddonsTotal = (warrantyAddon ? 99 : 0) + (premiumAddon ? 149 : 0);
      const lOriginalTotal = lSubtotal + lAddonsTotal;
      
      let lDiscount = 0;
      if (appliedOffer && !offerError) {
        const minAmt = appliedOffer.min_order_amount || 0;
        if (lSubtotal >= minAmt) {
          if (appliedOffer.discount_type === "percentage") {
            lDiscount = Math.round(lSubtotal * (appliedOffer.discount_value || 0) / 100);
          } else if (appliedOffer.discount_type === "fixed") {
            lDiscount = Math.min(lSubtotal, (appliedOffer.discount_value || 0) * quantity);
          }
          if (appliedOffer.max_discount && lDiscount > appliedOffer.max_discount) {
            lDiscount = appliedOffer.max_discount;
          }
        }
      } else {
        if (latestService.discount_type === "percentage") {
          lDiscount = Math.round(lSubtotal * (latestService.discount_value || 0) / 100);
        } else if (latestService.discount_type === "fixed") {
          lDiscount = Math.min(lSubtotal, (latestService.discount_value || 0) * quantity);
        }
      }
      const lFinalAmount = Math.max(0, lOriginalTotal - lDiscount);

      const bookingNotes = [
        `Quantity: ${quantity}`,
        warrantyAddon ? "Add-on: 30-Day Service Warranty (₹99)" : null,
        premiumAddon ? "Add-on: Premium Materials (₹149)" : null,
        formData.notes ? `Notes: ${formData.notes}` : null
      ].filter(Boolean).join(" | ");

      // Save booking to the SQLite database
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "instant",
          service_name: latestService.name,
          category_name: latestService.category_name || "Instant Service",
          price: lFinalAmount, // Store final discounted amount
          customer_name: formData.name,
          phone: formData.phone,
          address: formData.address,
          area: formData.area,
          pincode: "",
          preferred_date: formData.date,
          preferred_time: formData.timeSlot,
          notes: bookingNotes,
          service_id: latestService.id,
          original_price: lOriginalTotal,
          offer_code: (appliedOffer && !offerError) ? appliedOffer.code : null,
          discount_amount: lDiscount,
          final_amount: lFinalAmount,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save booking");
      }

      const resData = await response.json();
      if (resData.success && resData.booking) {
        try {
          const localBookingsStr = localStorage.getItem("oncar_bookings") || "[]";
          const localBookings = JSON.parse(localBookingsStr);
          localBookings.unshift(resData.booking);
          localStorage.setItem("oncar_bookings", JSON.stringify(localBookings));
          localStorage.setItem("oncar_user_phone", formData.phone);
        } catch (e) {
          console.error("Local storage error:", e);
        }
      }

      // Build premium price summary description for WhatsApp message
      const priceDetailStr = `₹${lFinalAmount} (₹${lBasePrice}${warrantyAddon ? ' + ₹99 Warranty' : ''}${premiumAddon ? ' + ₹149 Premium Spares' : ''}${lDiscount > 0 ? `, Discount: -₹${lDiscount}` : ''})`;

      // Format WhatsApp message
      const whatsappMsg = buildWhatsAppMessage(settings.booking_message, {
        category_name: latestService.category_name || "",
        service_name: latestService.name,
        price: priceDetailStr,
        duration: latestService.duration,
        preferred_date: formData.date,
        preferred_time: formData.timeSlot,
        customer_name: formData.name,
        phone_number: formData.phone,
        area: formData.area,
        pincode: "Surat",
        address: formData.address,
        notes: bookingNotes,
      });

      // Redirect to WhatsApp
      window.open(formatWhatsAppLink(whatsappMsg, settings.whatsapp_number), "_blank");
      onClose();
      router.push("/?tab=bookings");
      router.refresh();
    } catch (err) {
      console.error(err);
      setError("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-primary/45 backdrop-blur-xs transition-opacity" 
        onClick={onClose}
      />
      
      {/* Modal Content - Native App Height Centering & Compact Spacings */}
      <div className="relative w-full max-w-md transform overflow-hidden rounded-3xl bg-white p-5 shadow-2xl transition-all animate-in zoom-in-95 duration-150 max-h-[92vh] overflow-y-auto">
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1 text-muted hover:bg-surface hover:text-primary transition-colors"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-secondary">
            Instant Scheduling
          </span>
          <h3 className="text-xl font-black text-primary mt-0.5 leading-tight">
            Book {service.name}
          </h3>
          <div className="flex items-center gap-3 mt-1.5 text-xs text-muted font-medium">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-primary text-sm">₹{service.price}</span>
              {service.discount_value && (
                <span className="line-through text-[10px] text-muted/70 font-bold">
                  ₹{service.discount_type === "percentage" ? Math.round(service.price / (1 - service.discount_value / 100)) : service.price + service.discount_value}
                </span>
              )}
            </div>
            <span>•</span>
            <span>Duration: {service.duration}</span>
            {service.discount_value && (
              <span className="bg-secondary/15 text-primary text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                {service.discount_type === "percentage" ? `${service.discount_value}% OFF` : `₹${service.discount_value} OFF`}
              </span>
            )}
          </div>
        </div>

        {error && (
          <div className="mb-4 flex items-start gap-2.5 rounded-xl bg-red-50 p-3 text-xs text-red-800 border border-red-100">
            <AlertCircle className="h-4.5 w-4.5 shrink-0 text-red-600 mt-0.5" />
            <p className="font-semibold">{error}</p>
          </div>
        )}

        {offerError && (
          <div className="mb-4 flex items-start gap-2.5 rounded-xl bg-red-50 p-3 text-xs text-red-800 border border-red-100">
            <AlertCircle className="h-4.5 w-4.5 shrink-0 text-red-600 mt-0.5" />
            <p className="font-semibold">{offerError}</p>
          </div>
        )}

        {offerWarning && (
          <div className="mb-4 flex items-start gap-2.5 rounded-xl bg-amber-50 p-3 text-xs text-amber-800 border border-amber-200">
            <AlertCircle className="h-4.5 w-4.5 shrink-0 text-amber-600 mt-0.5" />
            <p className="font-semibold">{offerWarning}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Schedulers */}
          <div className="grid gap-3 grid-cols-2">
            <div>
              <label className="block text-[10px] font-bold text-primary mb-1 uppercase tracking-wider">Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted" />
                <input 
                  type="date" 
                  required
                  min={today}
                  max={maxDateStr}
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full pl-9 pr-2 py-2 rounded-xl border border-border text-xs font-semibold outline-none focus:border-secondary bg-surface focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-primary mb-1 uppercase tracking-wider">Time Slot</label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted" />
                <select
                  value={formData.timeSlot}
                  onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
                  className="w-full pl-9 pr-2 py-2 rounded-xl border border-border text-xs font-semibold outline-none focus:border-secondary bg-surface focus:bg-white appearance-none"
                >
                  {settings.available_time_slots.map((slot) => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Customer Details */}
          <div className="grid gap-3 grid-cols-2">
            <div>
              <label className="block text-[10px] font-bold text-primary mb-1 uppercase tracking-wider">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted" />
                <input 
                  type="text" 
                  required
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-9 pr-2 py-2 rounded-xl border border-border text-xs outline-none focus:border-secondary bg-surface focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-primary mb-1 uppercase tracking-wider">Mobile Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted" />
                <input 
                  type="tel" 
                  required
                  placeholder="Mobile Number"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full pl-9 pr-2 py-2 rounded-xl border border-border text-xs outline-none focus:border-secondary bg-surface focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* Area Dropdown (Surat service grid) */}
          <div>
            <label className="block text-[10px] font-bold text-primary mb-1 uppercase tracking-wider">Area (Surat City Only)</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted" />
              <select
                required
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                className="w-full pl-9 pr-8 py-2 rounded-xl border border-border text-xs font-semibold outline-none focus:border-secondary bg-surface focus:bg-white appearance-none"
              >
                <option value="">Select Area</option>
                {SERVICE_AREAS.map((item) => (
                  <option key={item.area} value={item.area}>
                    {item.area}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Address details */}
          <div>
            <label className="block text-[10px] font-bold text-primary mb-1 uppercase tracking-wider font-semibold">Full Address</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-3.5 w-3.5 text-muted" />
              <textarea 
                required
                rows={2}
                placeholder="Flat No, Building Name, Street/Road Name"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full pl-9 pr-2 py-2 rounded-xl border border-border text-xs outline-none focus:border-secondary bg-surface focus:bg-white resize-none"
              />
            </div>
          </div>

          {/* Problem description */}
          <div>
            <label className="block text-[10px] font-bold text-primary mb-1 uppercase tracking-wider font-semibold">Problem Description (Optional)</label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 h-3.5 w-3.5 text-muted" />
              <textarea 
                rows={2}
                placeholder="Describe details or issues..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full pl-9 pr-2 py-2 rounded-xl border border-border text-xs outline-none focus:border-secondary bg-surface focus:bg-white resize-none"
              />
            </div>
          </div>

          {/* Price Summary Breakdown */}
          <div className="bg-primary/[0.03] border border-primary/10 rounded-2xl p-3.5 space-y-2">
            <div className="flex justify-between items-center text-[11px] text-muted font-bold">
              <span>Base Price (₹{basePrice})</span>
              <span>₹{subtotal}</span>
            </div>
            
            {(warrantyAddon || premiumAddon) && (
              <div className="flex justify-between items-center text-[11px] text-muted font-bold">
                <span>Add-ons Total</span>
                <span>+₹{addonsTotal}</span>
              </div>
            )}

            {discount > 0 && (
              <div className="flex justify-between items-center text-[11px] text-green-700 font-extrabold">
                <span>{discountLabel || "Offer Discount Applied"}</span>
                <span>-₹{discount}</span>
              </div>
            )}

            <div className="border-t border-border/60 pt-2 flex justify-between items-center text-xs font-black text-primary">
              <span className="uppercase tracking-wider">Total Payable Amount</span>
              <span className="text-sm text-primary font-black">₹{finalAmount}</span>
            </div>
          </div>

          <Button 
            type="submit" 
            variant="whatsapp" 
            className="w-full py-3 mt-3 text-xs font-bold text-center" 
            disabled={isSubmitting}
          >
            {isSubmitting ? "Booking..." : "Book Now via WhatsApp"}
          </Button>
        </form>
      </div>
    </div>
  );
}
