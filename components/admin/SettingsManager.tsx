"use client";

import { useState } from "react";
import { 
  Settings, 
  Save, 
  Upload, 
  AlertCircle, 
  CheckCircle, 
  RefreshCw, 
  Trash2, 
  Plus, 
  Edit2, 
  X, 
  Star,
  PlusCircle,
  HelpCircle,
  Car
} from "lucide-react";
import { Button } from "@/components/ui/Button";

interface SettingsManagerProps {
  initialSettings: Record<string, any>;
}

export function SettingsManager({ initialSettings }: SettingsManagerProps) {
  const [settings, setSettings] = useState(initialSettings);
  const [activeTab, setActiveTab] = useState("website");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [uploadingField, setUploadingField] = useState<string | null>(null);

  // Time slot helper state
  const [newTimeSlot, setNewTimeSlot] = useState("");

  // FAQ helper state
  const [editingFaqIndex, setEditingFaqIndex] = useState<number | null>(null);
  const [faqQuestion, setFaqQuestion] = useState("");
  const [faqAnswer, setFaqAnswer] = useState("");

  // Testimonial helper state
  const [editingTestimonialIndex, setEditingTestimonialIndex] = useState<number | null>(null);
  const [tName, setTName] = useState("");
  const [tLocation, setTLocation] = useState("");
  const [tRating, setTRating] = useState(5);
  const [tText, setTText] = useState("");
  const [tService, setTService] = useState("");

  // Trust badge helper state
  const [editingBadgeIndex, setEditingBadgeIndex] = useState<number | null>(null);
  const [badgeTitle, setBadgeTitle] = useState("");
  const [badgeDesc, setBadgeDesc] = useState("");
  const [badgeIcon, setBadgeIcon] = useState("Car");

  const handleInputChange = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
    if (e.target.files && e.target.files[0]) {
      setUploadingField(key);
      const file = e.target.files[0];
      const uploadData = new FormData();
      uploadData.append("file", file);

      try {
        const response = await fetch("/api/admin/upload", {
          method: "POST",
          body: uploadData,
        });

        if (!response.ok) throw new Error("Upload failed");

        const data = await response.json();
        handleInputChange(key, data.url);
      } catch (err) {
        console.error(err);
        alert("Failed to upload image.");
      } finally {
        setUploadingField(null);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (!response.ok) throw new Error("Failed to update settings");

      setSuccess(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error(err);
      setError("Failed to save settings. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Available slots helpers
  const getSlots = (): string[] => {
    const slots = settings.available_time_slots;
    return Array.isArray(slots) ? slots : [];
  };

  const addTimeSlot = () => {
    if (!newTimeSlot.trim()) return;
    const currentSlots = getSlots();
    if (currentSlots.includes(newTimeSlot.trim())) {
      alert("Time slot already exists.");
      return;
    }
    const updated = [...currentSlots, newTimeSlot.trim()];
    handleInputChange("available_time_slots", updated);
    setNewTimeSlot("");
  };

  const deleteTimeSlot = (slotToDelete: string) => {
    const currentSlots = getSlots();
    const updated = currentSlots.filter(s => s !== slotToDelete);
    handleInputChange("available_time_slots", updated);
  };

  // FAQ helpers
  const getFaqs = (): any[] => {
    const faqs = settings.faqs;
    return Array.isArray(faqs) ? faqs : [];
  };

  const saveFaq = (e: React.FormEvent) => {
    e.preventDefault();
    if (!faqQuestion.trim() || !faqAnswer.trim()) return;

    const currentFaqs = [...getFaqs()];
    const faqItem = { question: faqQuestion.trim(), answer: faqAnswer.trim() };

    if (editingFaqIndex !== null) {
      currentFaqs[editingFaqIndex] = faqItem;
      setEditingFaqIndex(null);
    } else {
      currentFaqs.push(faqItem);
    }

    handleInputChange("faqs", currentFaqs);
    setFaqQuestion("");
    setFaqAnswer("");
  };

  const startEditFaq = (idx: number) => {
    const faqs = getFaqs();
    setEditingFaqIndex(idx);
    setFaqQuestion(faqs[idx].question);
    setFaqAnswer(faqs[idx].answer);
  };

  const deleteFaq = (idx: number) => {
    if (!confirm("Are you sure you want to delete this FAQ?")) return;
    const faqs = getFaqs();
    const updated = faqs.filter((_, i) => i !== idx);
    handleInputChange("faqs", updated);
    if (editingFaqIndex === idx) {
      setEditingFaqIndex(null);
      setFaqQuestion("");
      setFaqAnswer("");
    }
  };

  // Testimonial helpers
  const getTestimonials = (): any[] => {
    const testimonials = settings.testimonials;
    return Array.isArray(testimonials) ? testimonials : [];
  };

  const saveTestimonial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tName.trim() || !tText.trim()) return;

    const currentTestimonials = [...getTestimonials()];
    const testimonialItem = {
      id: editingTestimonialIndex !== null ? currentTestimonials[editingTestimonialIndex].id || Date.now() : Date.now(),
      name: tName.trim(),
      location: tLocation.trim(),
      rating: Number(tRating),
      text: tText.trim(),
      service: tService.trim()
    };

    if (editingTestimonialIndex !== null) {
      currentTestimonials[editingTestimonialIndex] = testimonialItem;
      setEditingTestimonialIndex(null);
    } else {
      currentTestimonials.push(testimonialItem);
    }

    handleInputChange("testimonials", currentTestimonials);
    setTName("");
    setTLocation("");
    setTRating(5);
    setTText("");
    setTService("");
  };

  const startEditTestimonial = (idx: number) => {
    const items = getTestimonials();
    setEditingTestimonialIndex(idx);
    setTName(items[idx].name);
    setTLocation(items[idx].location || "");
    setTRating(items[idx].rating || 5);
    setTText(items[idx].text);
    setTService(items[idx].service || "");
  };

  const deleteTestimonial = (idx: number) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;
    const items = getTestimonials();
    const updated = items.filter((_, i) => i !== idx);
    handleInputChange("testimonials", updated);
    if (editingTestimonialIndex === idx) {
      setEditingTestimonialIndex(null);
      setTName("");
      setTLocation("");
      setTRating(5);
      setTText("");
      setTService("");
    }
  };

  // Trust badge helpers
  const getBadges = (): any[] => {
    const badges = settings.trust_badges;
    return Array.isArray(badges) ? badges : [];
  };

  const saveBadge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!badgeTitle.trim() || !badgeDesc.trim()) return;

    const currentBadges = [...getBadges()];
    const badgeItem = {
      title: badgeTitle.trim(),
      description: badgeDesc.trim(),
      icon: badgeIcon
    };

    if (editingBadgeIndex !== null) {
      currentBadges[editingBadgeIndex] = badgeItem;
      setEditingBadgeIndex(null);
    } else {
      currentBadges.push(badgeItem);
    }

    handleInputChange("trust_badges", currentBadges);
    setBadgeTitle("");
    setBadgeDesc("");
    setBadgeIcon("Car");
  };

  const startEditBadge = (idx: number) => {
    const items = getBadges();
    setEditingBadgeIndex(idx);
    setBadgeTitle(items[idx].title);
    setBadgeDesc(items[idx].description);
    setBadgeIcon(items[idx].icon || "Car");
  };

  const deleteBadge = (idx: number) => {
    if (!confirm("Are you sure you want to delete this trust badge?")) return;
    const items = getBadges();
    const updated = items.filter((_, i) => i !== idx);
    handleInputChange("trust_badges", updated);
    if (editingBadgeIndex === idx) {
      setEditingBadgeIndex(null);
      setBadgeTitle("");
      setBadgeDesc("");
      setBadgeIcon("Car");
    }
  };

  const tabs = [
    { id: "website", label: "Branding & Contact" },
    { id: "homepage", label: "Hero & Media" },
    { id: "whatsapp", label: "WhatsApp Settings" },
    { id: "slots", label: "Booking Slots" },
    { id: "payment", label: "Payments & UPI" },
    { id: "badges", label: "Trust Badges" },
    { id: "testimonials", label: "Testimonials" },
    { id: "faqs", label: "FAQs" },
    { id: "seo", label: "SEO Settings" },
  ];

  const lucideIcons = [
    "Car", "Clock", "ShieldCheck", "Award", "MapPin", "Navigation", "ThumbsUp", "UserCheck", "HelpCircle"
  ];

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-primary">Website Settings</h1>
        <p className="text-muted text-sm mt-1">Configure your branding, contact info, payment assets, slot settings, and content lists.</p>
      </div>

      {/* Tabs list with horizontal scroll support */}
      <div className="flex border-b border-border gap-2 overflow-x-auto pb-px scrollbar-thin">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => {
              setActiveTab(tab.id);
              setSuccess(false);
              setError(null);
            }}
            className={`px-4 py-3 text-xs font-black border-b-2 whitespace-nowrap uppercase tracking-wider transition-colors ${
              activeTab === tab.id
                ? "border-primary text-primary"
                : "border-transparent text-muted hover:text-primary"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {success && (
        <div className="flex items-start gap-3 rounded-xl bg-green-50 p-4 text-sm text-green-800 border border-green-100 animate-in fade-in duration-200">
          <CheckCircle className="h-5 w-5 shrink-0 text-green-600 mt-0.5" />
          <p className="font-semibold">Settings updated successfully! Changes reflect instantly.</p>
        </div>
      )}

      {error && (
        <div className="flex items-start gap-3 rounded-xl bg-red-50 p-4 text-sm text-red-800 border border-red-100 animate-in fade-in duration-200">
          <AlertCircle className="h-5 w-5 shrink-0 text-red-600 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white border border-border rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
        
        {/* Tab 1: Website Settings */}
        {activeTab === "website" && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-primary border-b border-border pb-2 mb-4">Core Branding & Contact</h3>
            
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-primary mb-1.5">Website Name</label>
                <input
                  type="text"
                  required
                  value={settings.website_name || ""}
                  onChange={(e) => handleInputChange("website_name", e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-border text-sm outline-none focus:border-secondary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-primary mb-1.5">Logo Text</label>
                <input
                  type="text"
                  required
                  value={settings.logo_text || ""}
                  onChange={(e) => handleInputChange("logo_text", e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-border text-sm outline-none focus:border-secondary"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-primary mb-1.5">Support Email</label>
                <input
                  type="email"
                  required
                  value={settings.email || ""}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-border text-sm outline-none focus:border-secondary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-primary mb-1.5">Phone Number (Support calls)</label>
                <input
                  type="text"
                  required
                  value={settings.phone || ""}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-border text-sm outline-none focus:border-secondary"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-primary mb-1.5">Service Address (Surat Limits)</label>
              <textarea
                required
                rows={2}
                value={settings.address || ""}
                onChange={(e) => handleInputChange("address", e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-border text-sm outline-none focus:border-secondary resize-none"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-primary mb-1.5">Google Maps Location Link</label>
                <input
                  type="text"
                  value={settings.google_maps_url || ""}
                  onChange={(e) => handleInputChange("google_maps_url", e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-border text-sm outline-none focus:border-secondary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-primary mb-1.5">Serving Restriction Text</label>
                <input
                  type="text"
                  required
                  value={settings.serving_text || ""}
                  onChange={(e) => handleInputChange("serving_text", e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-border text-sm outline-none focus:border-secondary"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Homepage configurations */}
        {activeTab === "homepage" && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-primary border-b border-border pb-2 mb-4">Hero Banner & Media Sections</h3>
            
            <div>
              <label className="block text-xs font-semibold text-primary mb-1.5">Hero Headline (Title)</label>
              <input
                type="text"
                required
                value={settings.hero_title || ""}
                onChange={(e) => handleInputChange("hero_title", e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-border text-sm outline-none focus:border-secondary"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-primary mb-1.5">Hero Subtitle</label>
              <textarea
                required
                rows={2}
                value={settings.hero_subtitle || ""}
                onChange={(e) => handleInputChange("hero_subtitle", e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-border text-sm outline-none focus:border-secondary resize-none"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-primary mb-1.5">Book Trial CTA Button Text</label>
                <input
                  type="text"
                  required
                  value={settings.whatsapp_cta_text || ""}
                  onChange={(e) => handleInputChange("whatsapp_cta_text", e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-border text-sm outline-none focus:border-secondary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-primary mb-1.5">View Plans CTA Button Text</label>
                <input
                  type="text"
                  required
                  value={settings.plans_cta_text || ""}
                  onChange={(e) => handleInputChange("plans_cta_text", e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-border text-sm outline-none focus:border-secondary"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-primary mb-1.5">Hero Background Image</label>
              <div className="flex gap-4 items-center">
                <input
                  type="text"
                  required
                  value={settings.hero_image || ""}
                  onChange={(e) => handleInputChange("hero_image", e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-border text-sm outline-none focus:border-secondary"
                />
                <div className="relative shrink-0">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, "hero_image")}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full font-bold"
                  />
                  <Button type="button" variant="outline" className="flex items-center gap-2 text-sm h-10">
                    <Upload className="h-4 w-4" /> {uploadingField === "hero_image" ? "Uploading..." : "Upload"}
                  </Button>
                </div>
              </div>
            </div>

            <div className="border-t border-border pt-4 mt-4 space-y-4">
              <h4 className="text-sm font-bold text-primary">10-Second Confidence Video Section</h4>
              
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="checkbox"
                  id="video_enabled"
                  checked={settings.video_enabled === "true" || settings.video_enabled === true}
                  onChange={(e) => handleInputChange("video_enabled", e.target.checked ? "true" : "false")}
                  className="h-4.5 w-4.5 rounded border-border text-primary focus:ring-secondary cursor-pointer"
                />
                <label htmlFor="video_enabled" className="text-xs font-semibold text-primary cursor-pointer">
                  Enable Video Section on Customer Site
                </label>
              </div>

              <div>
                <label className="block text-xs font-semibold text-primary mb-1.5">Video File URL / Embed URL</label>
                <input
                  type="text"
                  placeholder="https://example.com/oncar-promo.mp4"
                  value={settings.video_url || ""}
                  onChange={(e) => handleInputChange("video_url", e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-border text-sm outline-none focus:border-secondary"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 pt-2 border-t border-border mt-4">
              <div>
                <label className="block text-xs font-semibold text-primary mb-1.5">About Section Header Title</label>
                <input
                  type="text"
                  required
                  value={settings.about_title || ""}
                  onChange={(e) => handleInputChange("about_title", e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-border text-sm outline-none focus:border-secondary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-primary mb-1.5">About Description Paragraph</label>
                <textarea
                  required
                  rows={3}
                  value={settings.about_text || ""}
                  onChange={(e) => handleInputChange("about_text", e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-border text-sm outline-none focus:border-secondary resize-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: WhatsApp & Booking Settings */}
        {activeTab === "whatsapp" && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-primary border-b border-border pb-2 mb-4">WhatsApp Integrations</h3>
            
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-primary mb-1.5">WhatsApp Booking Number</label>
                <input
                  type="text"
                  required
                  value={settings.whatsapp_number || ""}
                  onChange={(e) => handleInputChange("whatsapp_number", e.target.value)}
                  placeholder="e.g. +919213466544"
                  className="w-full px-3 py-2.5 rounded-xl border border-border text-sm outline-none focus:border-secondary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-primary mb-1.5">Advance Booking Days Limit</label>
                <input
                  type="number"
                  required
                  value={settings.advance_booking_days || "7"}
                  onChange={(e) => handleInputChange("advance_booking_days", e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-border text-sm outline-none focus:border-secondary"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-primary mb-1.5">Instant Service WhatsApp Message Template</label>
              <textarea
                required
                rows={7}
                value={settings.booking_message || ""}
                onChange={(e) => handleInputChange("booking_message", e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-border text-xs font-mono outline-none focus:border-secondary resize-none"
              />
              <span className="block text-[10px] text-muted mt-1 leading-tight">
                Placeholders supported: {"{service_name}"}, {"{price}"}, {"{preferred_date}"}, {"{preferred_time}"}, {"{customer_name}"}, {"{phone_number}"}, {"{address}"}, {"{notes}"}.
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-primary mb-1.5">Custom Quotation WhatsApp Message Template</label>
              <textarea
                required
                rows={6}
                value={settings.quotation_message || ""}
                onChange={(e) => handleInputChange("quotation_message", e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-border text-xs font-mono outline-none focus:border-secondary resize-none"
              />
              <span className="block text-[10px] text-muted mt-1 leading-tight">
                Placeholders supported: {"{category_name}"}, {"{customer_name}"}, {"{phone_number}"}, {"{address}"}, {"{project_details}"}.
              </span>
            </div>
          </div>
        )}

        {/* Tab 4: Time Slots editor */}
        {activeTab === "slots" && (
          <div className="space-y-4 animate-in fade-in">
            <h3 className="text-lg font-bold text-primary border-b border-border pb-2 mb-4">Booking Time Slots</h3>
            
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. 11:00 AM, 02:00 PM, Weekends only"
                value={newTimeSlot}
                onChange={(e) => setNewTimeSlot(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl border border-border text-sm outline-none focus:border-secondary"
              />
              <Button type="button" onClick={addTimeSlot} className="flex items-center gap-1">
                <Plus className="h-4 w-4" /> Add Slot
              </Button>
            </div>

            <div className="grid gap-2 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 pt-4">
              {getSlots().map((slot, idx) => (
                <div key={idx} className="flex justify-between items-center bg-surface p-3 rounded-xl border border-border">
                  <span className="text-xs font-bold text-secondary truncate">{slot}</span>
                  <button
                    type="button"
                    onClick={() => deleteTimeSlot(slot)}
                    className="p-1 text-red-500 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
              {getSlots().length === 0 && (
                <div className="col-span-full py-6 text-center text-xs text-muted">
                  No time slots configured. Add slot values above.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 5: Payments & UPI */}
        {activeTab === "payment" && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-primary border-b border-border pb-2 mb-4">Payment QR & UPI Settings</h3>
            
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-primary mb-1.5">UPI ID (e.g., paytm/gpay suffix)</label>
                <input
                  type="text"
                  required
                  value={settings.payment_upi_id || ""}
                  onChange={(e) => handleInputChange("payment_upi_id", e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-border text-sm outline-none focus:border-secondary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-primary mb-1.5">UPI Account Holder Name</label>
                <input
                  type="text"
                  required
                  value={settings.payment_upi_name || ""}
                  onChange={(e) => handleInputChange("payment_upi_name", e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-border text-sm outline-none focus:border-secondary"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-primary mb-1.5">Payment QR Image URL or Upload</label>
              <div className="flex gap-4 items-center">
                <input
                  type="text"
                  placeholder="https://example.com/qr-code.png"
                  value={settings.payment_qr_url || ""}
                  onChange={(e) => handleInputChange("payment_qr_url", e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-border text-sm outline-none focus:border-secondary"
                />
                <div className="relative shrink-0">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, "payment_qr_url")}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full font-bold"
                  />
                  <Button type="button" variant="outline" className="flex items-center gap-2 text-sm h-10">
                    <Upload className="h-4 w-4" /> {uploadingField === "payment_qr_url" ? "Uploading..." : "Upload"}
                  </Button>
                </div>
              </div>
              {settings.payment_qr_url && (
                <div className="mt-3 relative h-40 w-40 rounded-xl overflow-hidden border border-border bg-surface p-2 flex items-center justify-center">
                  <img src={settings.payment_qr_url} alt="UPI Payment QR code" className="object-contain h-full w-full" />
                </div>
              )}
            </div>

            {/* Razorpay Integration Sub-section */}
            <div className="border-t border-border pt-6 mt-6 space-y-4">
              <h4 className="text-sm font-bold text-primary">Razorpay Online Payment Integration</h4>
              
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="checkbox"
                  id="razorpay_enabled"
                  checked={settings.razorpay_enabled === "true" || settings.razorpay_enabled === true}
                  onChange={(e) => handleInputChange("razorpay_enabled", e.target.checked ? "true" : "false")}
                  className="h-4.5 w-4.5 rounded border-border text-primary focus:ring-secondary cursor-pointer"
                />
                <label htmlFor="razorpay_enabled" className="text-xs font-semibold text-primary cursor-pointer">
                  Enable Razorpay Payment Gateway (Hides Raw UPI details)
                </label>
              </div>

              {settings.razorpay_enabled === "true" && (
                <div className="animate-in slide-in-from-top-1 duration-150">
                  <label className="block text-xs font-semibold text-primary mb-1.5">Razorpay Key ID</label>
                  <input
                    type="text"
                    placeholder="rzp_test_..."
                    value={settings.razorpay_key_id || ""}
                    onChange={(e) => handleInputChange("razorpay_key_id", e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-border text-sm outline-none focus:border-secondary font-mono"
                  />
                  <span className="block text-[10px] text-muted mt-1 leading-normal">
                    Enter your Razorpay API Key ID. Leave default as test mode keys for client simulator.
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 6: Trust Badges Editor */}
        {activeTab === "badges" && (
          <div className="space-y-6">
            <div className="border-b border-border pb-4">
              <h3 className="text-lg font-bold text-primary">Trust Badges</h3>
              <p className="text-xs text-muted">Manage the key benefits listed below the header details.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-12">
              {/* Form Column */}
              <div className="md:col-span-5 bg-surface p-5 rounded-2xl border border-border space-y-4">
                <h4 className="text-xs font-black text-primary uppercase tracking-wider">
                  {editingBadgeIndex !== null ? "Edit Trust Badge" : "Add Trust Badge"}
                </h4>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-semibold text-primary mb-1">Badge Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Dual Control Safety"
                      value={badgeTitle}
                      onChange={(e) => setBadgeTitle(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-border text-xs outline-none focus:border-secondary bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-primary mb-1">Description</label>
                    <textarea
                      placeholder="e.g. Safety audits on routes we practice"
                      value={badgeDesc}
                      onChange={(e) => setBadgeDesc(e.target.value)}
                      rows={2}
                      className="w-full px-3 py-1.5 rounded-xl border border-border text-xs outline-none focus:border-secondary bg-white resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-primary mb-1">Lucide Icon Name</label>
                    <select
                      value={badgeIcon}
                      onChange={(e) => setBadgeIcon(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-border text-xs outline-none focus:border-secondary bg-white"
                    >
                      {lucideIcons.map((ico) => (
                        <option key={ico} value={ico}>{ico}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button type="button" size="sm" onClick={saveBadge}>
                    {editingBadgeIndex !== null ? "Update Badge" : "Add Badge"}
                  </Button>
                  {(editingBadgeIndex !== null || badgeTitle || badgeDesc) && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingBadgeIndex(null);
                        setBadgeTitle("");
                        setBadgeDesc("");
                        setBadgeIcon("Car");
                      }}
                    >
                      Reset
                    </Button>
                  )}
                </div>
              </div>

              {/* Badges List Column */}
              <div className="md:col-span-7 space-y-3">
                <h4 className="text-xs font-black text-secondary uppercase tracking-wider">Current Badges ({getBadges().length})</h4>
                <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                  {getBadges().map((badge, idx) => (
                    <div key={idx} className="flex items-start justify-between bg-white p-4 rounded-2xl border border-border/80 shadow-xs gap-3">
                      <div className="flex items-start gap-3">
                        <div className="h-8 w-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                          <Car className="h-4.5 w-4.5" />
                        </div>
                        <div>
                          <h5 className="text-xs font-black text-secondary leading-tight">{badge.title}</h5>
                          <p className="text-[10px] text-muted font-semibold mt-1 leading-snug">{badge.description}</p>
                          <span className="inline-block text-[9px] bg-surface border border-border/60 text-muted rounded-md px-1.5 py-0.5 mt-2.5">
                            Icon: {badge.icon}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={() => startEditBadge(idx)}
                          className="p-1.5 text-primary hover:bg-surface rounded-lg"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteBadge(idx)}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {getBadges().length === 0 && (
                    <div className="text-center py-8 text-xs text-muted bg-surface rounded-2xl border border-border">
                      No trust badges added yet. Configure badge properties on the left.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 7: Testimonials Editor */}
        {activeTab === "testimonials" && (
          <div className="space-y-6">
            <div className="border-b border-border pb-4">
              <h3 className="text-lg font-bold text-primary">Reviews & Testimonials</h3>
              <p className="text-xs text-muted">Manage the feedback ratings and review text displayed to learners.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-12">
              {/* Form Column */}
              <div className="md:col-span-5 bg-surface p-5 rounded-2xl border border-border space-y-4">
                <h4 className="text-xs font-black text-primary uppercase tracking-wider">
                  {editingTestimonialIndex !== null ? "Edit Testimonial" : "Add Testimonial"}
                </h4>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-semibold text-primary mb-1">Learner Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Rajesh Patel"
                      value={tName}
                      onChange={(e) => setTName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-border text-xs outline-none focus:border-secondary bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-primary mb-1">Location (Surat Limits)</label>
                    <input
                      type="text"
                      placeholder="e.g. Adajan, Surat"
                      value={tLocation}
                      onChange={(e) => setTLocation(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-border text-xs outline-none focus:border-secondary bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-semibold text-primary mb-1">Rating Star</label>
                      <select
                        value={tRating}
                        onChange={(e) => setTRating(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl border border-border text-xs outline-none focus:border-secondary bg-white"
                      >
                        <option value={5}>5 Stars</option>
                        <option value={4}>4 Stars</option>
                        <option value={3}>3 Stars</option>
                        <option value={2}>2 Stars</option>
                        <option value={1}>1 Star</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-semibold text-primary mb-1">Plan Taken</label>
                      <input
                        type="text"
                        placeholder="e.g. 10 Hours Plan"
                        value={tService}
                        onChange={(e) => setTService(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-border text-xs outline-none focus:border-secondary bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-primary mb-1">Review Description Text</label>
                    <textarea
                      placeholder="Learner feedback details..."
                      value={tText}
                      onChange={(e) => setTText(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-1.5 rounded-xl border border-border text-xs outline-none focus:border-secondary bg-white resize-none"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button type="button" size="sm" onClick={saveTestimonial}>
                    {editingTestimonialIndex !== null ? "Update Testimonial" : "Add Testimonial"}
                  </Button>
                  {(editingTestimonialIndex !== null || tName || tText) && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingTestimonialIndex(null);
                        setTName("");
                        setTLocation("");
                        setTRating(5);
                        setTText("");
                        setTService("");
                      }}
                    >
                      Reset
                    </Button>
                  )}
                </div>
              </div>

              {/* List Column */}
              <div className="md:col-span-7 space-y-3">
                <h4 className="text-xs font-black text-secondary uppercase tracking-wider">Current Reviews ({getTestimonials().length})</h4>
                <div className="space-y-2.5 max-h-[350px] overflow-y-auto pr-1">
                  {getTestimonials().map((testimonial, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-2xl border border-border/85 shadow-xs relative flex justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1">
                          <span className="text-xs font-black text-secondary">{testimonial.name}</span>
                          <span className="text-[10px] text-muted">({testimonial.location})</span>
                        </div>
                        <div className="flex items-center gap-0.5 text-amber-500 py-0.5">
                          {Array.from({ length: testimonial.rating || 5 }).map((_, i) => (
                            <Star key={i} className="h-3 w-3 fill-current" />
                          ))}
                        </div>
                        <p className="text-xs text-muted font-medium italic mt-1 leading-snug">&quot;{testimonial.text}&quot;</p>
                        <span className="inline-block text-[9px] font-bold text-primary bg-primary/5 px-2 py-0.5 rounded-full mt-2.5">
                          Package: {testimonial.service || "General"}
                        </span>
                      </div>
                      <div className="flex gap-1 items-start">
                        <button
                          type="button"
                          onClick={() => startEditTestimonial(idx)}
                          className="p-1.5 text-primary hover:bg-surface rounded-lg"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteTestimonial(idx)}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {getTestimonials().length === 0 && (
                    <div className="text-center py-10 text-xs text-muted bg-surface rounded-2xl border border-border">
                      No customer reviews configured. Fill review details on the left.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 8: FAQs Editor */}
        {activeTab === "faqs" && (
          <div className="space-y-6">
            <div className="border-b border-border pb-4">
              <h3 className="text-lg font-bold text-primary">Frequently Asked Questions</h3>
              <p className="text-xs text-muted">Configure the items displayed inside the dynamic accordions in the FAQ page.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-12">
              {/* Form Column */}
              <div className="md:col-span-5 bg-surface p-5 rounded-2xl border border-border space-y-4">
                <h4 className="text-xs font-black text-primary uppercase tracking-wider">
                  {editingFaqIndex !== null ? "Edit FAQ Item" : "Add FAQ Item"}
                </h4>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-semibold text-primary mb-1">Question</label>
                    <input
                      type="text"
                      placeholder="e.g. Kya automatic car sikhate hain?"
                      value={faqQuestion}
                      onChange={(e) => setFaqQuestion(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-border text-xs outline-none focus:border-secondary bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-primary mb-1">Answer Description</label>
                    <textarea
                      placeholder="e.g. Haan, hum manual aur automatic dono car sikhate hain..."
                      value={faqAnswer}
                      onChange={(e) => setFaqAnswer(e.target.value)}
                      rows={4}
                      className="w-full px-3 py-1.5 rounded-xl border border-border text-xs outline-none focus:border-secondary bg-white resize-none"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button type="button" size="sm" onClick={saveFaq}>
                    {editingFaqIndex !== null ? "Update FAQ" : "Add FAQ"}
                  </Button>
                  {(editingFaqIndex !== null || faqQuestion || faqAnswer) && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingFaqIndex(null);
                        setFaqQuestion("");
                        setFaqAnswer("");
                      }}
                    >
                      Reset
                    </Button>
                  )}
                </div>
              </div>

              {/* List Column */}
              <div className="md:col-span-7 space-y-3">
                <h4 className="text-xs font-black text-secondary uppercase tracking-wider">Current FAQ List ({getFaqs().length})</h4>
                <div className="space-y-2.5 max-h-[350px] overflow-y-auto pr-1">
                  {getFaqs().map((faq, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-2xl border border-border/85 shadow-xs flex justify-between gap-4">
                      <div className="space-y-1.5 text-left">
                        <h5 className="text-xs font-black text-secondary flex items-start gap-1">
                          <HelpCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                          <span>{faq.question}</span>
                        </h5>
                        <p className="text-[11px] text-muted font-semibold pl-5 leading-relaxed">{faq.answer}</p>
                      </div>
                      <div className="flex gap-1 items-start">
                        <button
                          type="button"
                          onClick={() => startEditFaq(idx)}
                          className="p-1.5 text-primary hover:bg-surface rounded-lg"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteFaq(idx)}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {getFaqs().length === 0 && (
                    <div className="text-center py-10 text-xs text-muted bg-surface rounded-2xl border border-border">
                      No FAQs configured. Write dynamic FAQ list elements on the left.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 9: SEO Settings */}
        {activeTab === "seo" && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-primary border-b border-border pb-2 mb-4">Meta Data & Open Graph Tags</h3>
            
            <div>
              <label className="block text-xs font-semibold text-primary mb-1.5">Global Browser Title (Meta Title)</label>
              <input
                type="text"
                required
                value={settings.meta_title || ""}
                onChange={(e) => handleInputChange("meta_title", e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-border text-sm outline-none focus:border-secondary"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-primary mb-1.5">Meta Description</label>
              <textarea
                required
                rows={3}
                value={settings.meta_description || ""}
                onChange={(e) => handleInputChange("meta_description", e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-border text-sm outline-none focus:border-secondary resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-primary mb-1.5">Meta Keywords (Comma separated)</label>
              <input
                type="text"
                required
                value={settings.meta_keywords || ""}
                onChange={(e) => handleInputChange("meta_keywords", e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-border text-sm outline-none focus:border-secondary"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-primary mb-1.5">Open Graph (og:image) Social Share Banner</label>
              <div className="flex gap-4 items-center">
                <input
                  type="text"
                  required
                  value={settings.og_image || ""}
                  onChange={(e) => handleInputChange("og_image", e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-border text-sm outline-none focus:border-secondary"
                />
                <div className="relative shrink-0">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, "og_image")}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full font-bold"
                  />
                  <Button type="button" variant="outline" className="flex items-center gap-2 text-sm h-10">
                    <Upload className="h-4 w-4" /> {uploadingField === "og_image" ? "Uploading..." : "Upload"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer save actions */}
        <div className="border-t border-border pt-6 flex items-center justify-end">
          <Button type="submit" disabled={isSubmitting} className="flex items-center gap-2 font-semibold">
            {isSubmitting ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Save Configuration
          </Button>
        </div>
      </form>
    </div>
  );
}
