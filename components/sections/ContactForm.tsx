"use client";

import { useState } from "react";
import { Send, User, Phone, MapPin, MessageSquare, AlertCircle, CheckCircle } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { buildWhatsAppMessage, formatWhatsAppLink } from "@/lib/utils";
import { SERVICE_AREAS } from "@/lib/areas";

interface Category {
  id: number;
  name: string;
  slug: string;
  type: string;
}

interface ContactFormProps {
  categories: Category[];
  settings: {
    phone: string;
    whatsapp_number: string;
    email: string;
    address: string;
    booking_message: string;
    quotation_message: string;
  };
}

export function ContactForm({ categories, settings }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    category: "",
    area: "",
    address: "",
    details: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!formData.area) {
      setError("Please select a service Area in Surat.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Find selected category type
      const selectedCat = categories.find((c) => c.name === formData.category);
      const isQuotation = selectedCat ? selectedCat.type === "quotation" : false;

      // Save inquiry to the SQLite database
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: isQuotation ? "quotation" : "instant",
          service_name: isQuotation ? undefined : "General Inquiry",
          category_name: formData.category || "General Inquiry",
          customer_name: formData.name,
          phone: formData.phone,
          address: formData.address,
          area: formData.area,
          pincode: "", // Removed PIN Code
          notes: formData.details,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save contact inquiry");
      }

      // Build message body
      const template = isQuotation ? settings.quotation_message : settings.booking_message;
      const whatsappMsg = buildWhatsAppMessage(template, {
        category_name: formData.category || "General",
        service_name: isQuotation ? "Project Estimate" : "General Inquiry",
        price: "0",
        duration: "Flexible",
        customer_name: formData.name,
        phone_number: formData.phone,
        area: formData.area,
        pincode: "Surat",
        address: formData.address,
        notes: formData.details,
        preferred_date: new Date().toISOString().split("T")[0],
        preferred_time: "Flexible Slot",
      });

      // Send to WhatsApp
      window.open(formatWhatsAppLink(whatsappMsg, settings.whatsapp_number), "_blank");
      setSuccess(true);
      setFormData({
        name: "",
        phone: "",
        category: "",
        area: "",
        address: "",
        details: "",
      });
    } catch (err) {
      console.error(err);
      setError("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Section id="contact" className="py-10 bg-white">
      <SectionHeader
        eyebrow="Get In Touch"
        title="Contact OnCar Team"
        description="Have custom requirements or need immediate assistance? Send a message to our support desk."
      />

      <div className="mx-auto max-w-5xl px-4 grid gap-8 lg:grid-cols-5">
        <div className="rounded-3xl border border-border bg-white p-5 shadow-lg lg:col-span-3">
          {success && (
            <div className="mb-4 flex items-start gap-3 rounded-2xl bg-emerald-50 p-4 text-emerald-800 border border-emerald-100 animate-in fade-in duration-200">
              <CheckCircle className="h-5 w-5 shrink-0 text-emerald-600 mt-0.5" />
              <div>
                <h4 className="font-bold text-sm">Message Saved!</h4>
                <p className="text-xs text-emerald-700/90 mt-0.5">Opening WhatsApp to confirm details with support team...</p>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-4 flex items-start gap-2.5 rounded-2xl bg-red-50 p-3.5 text-xs text-red-800 border border-red-100">
              <AlertCircle className="h-4.5 w-4.5 shrink-0 text-red-600 mt-0.5" />
              <p className="font-semibold">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="block text-[10px] font-bold text-primary mb-1 uppercase tracking-wider">Your Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
                  <input
                    id="name"
                    type="text"
                    required
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-border text-sm outline-none focus:border-secondary bg-surface focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="block text-[10px] font-bold text-primary mb-1 uppercase tracking-wider">Mobile Number</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
                  <input
                    id="phone"
                    type="tel"
                    required
                    placeholder="Mobile Number"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-border text-sm outline-none focus:border-secondary bg-surface focus:bg-white"
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="category" className="block text-[10px] font-bold text-primary mb-1 uppercase tracking-wider">Service/Project Category</label>
              <select
                id="category"
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:border-secondary appearance-none bg-white font-semibold"
              >
                <option value="">Select a category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name} ({c.type === "instant" ? "Instant Service" : "Custom Project"})
                  </option>
                ))}
              </select>
            </div>

            {/* Dropdown of Surat Areas */}
            <div>
              <label htmlFor="area" className="block text-[10px] font-bold text-primary mb-1 uppercase tracking-wider">Select Area</label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
                <select
                  id="area"
                  required
                  value={formData.area}
                  onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                  className="w-full pl-10 pr-8 py-2.5 rounded-xl border border-border text-sm font-semibold outline-none focus:border-secondary bg-surface focus:bg-white appearance-none"
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

            <div>
              <label htmlFor="address" className="block text-[10px] font-bold text-primary mb-1 uppercase tracking-wider">Complete Address</label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-3 h-4 w-4 text-muted" />
                <textarea
                  id="address"
                  required
                  rows={2}
                  placeholder="Flat No, Building Name, Street Road Name"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full rounded-xl border border-border bg-surface py-2.5 pl-10 pr-4 text-sm outline-none focus:border-secondary resize-none"
                />
              </div>
            </div>

            <div>
              <label htmlFor="details" className="block text-[10px] font-bold text-primary mb-1 uppercase tracking-wider">Additional Details</label>
              <div className="relative">
                <MessageSquare className="absolute left-3.5 top-3 h-4 w-4 text-muted" />
                <textarea
                  id="details"
                  rows={2}
                  placeholder="How can we help you?"
                  value={formData.details}
                  onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                  className="w-full rounded-xl border border-border bg-surface py-2.5 pl-10 pr-4 text-sm outline-none focus:border-secondary resize-none"
                />
              </div>
            </div>

            <Button type="submit" variant="secondary" size="lg" className="w-full" disabled={isSubmitting}>
              <Send className="h-4 w-4" />
              {isSubmitting ? "Sending..." : "Submit via WhatsApp"}
            </Button>
          </form>
        </div>

        <div className="flex flex-col justify-center rounded-3xl bg-primary p-6 text-white lg:col-span-2 md:p-8 shadow-lg">
          <h3 className="text-xl font-bold">Only in Surat City</h3>
          <ul className="mt-6 space-y-4 text-xs text-white/80">
            <li className="flex items-start gap-3">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-secondary" />
              Prompt local service confirmation
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-secondary" />
              No travel charges within Surat limits
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-secondary" />
              Direct coordination via WhatsApp
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-secondary" />
              Verified local service providers
            </li>
          </ul>
          <div className="mt-8">
            <p className="text-[10px] text-white/60 uppercase font-bold tracking-wider">Phone Support</p>
            <a
              href={`tel:${settings.phone.replace(/\s/g, "")}`}
              className="mt-1 text-base font-bold text-secondary hover:underline"
            >
              {settings.phone}
            </a>
          </div>
          <div className="mt-4">
            <p className="text-[10px] text-white/60 uppercase font-bold tracking-wider">Email Contact</p>
            <a
              href={`mailto:${settings.email}`}
              className="mt-1 text-sm font-bold text-white hover:underline"
            >
              {settings.email}
            </a>
          </div>
          <div className="mt-4">
            <p className="text-[10px] text-white/60 uppercase font-bold tracking-wider">Office Address</p>
            <p className="mt-1 text-xs text-white/80 leading-relaxed">{settings.address}</p>
          </div>
        </div>
      </div>
    </Section>
  );
}
