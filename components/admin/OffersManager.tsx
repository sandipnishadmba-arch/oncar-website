"use client";

import { useState, useRef, useCallback } from "react";
import { Percent, Edit2, Trash2, Plus, X, Upload, Calendar, ArrowUp, ArrowDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

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
  service_id: number | null;
  category_id: number | null;
  discount_type: string | null;
  discount_value: number | null;
  max_discount: number | null;
  min_order_amount: number | null;
  status?: string;
  usage_limit?: number | null;
  created_by?: string | null;
  updated_by?: string | null;
  created_at?: string;
  updated_at?: string;
}

interface Category {
  id: number;
  name: string;
  slug: string;
  type: string;
}

interface ServiceDiscount {
  id: number;
  service_id: number;
  service_name?: string;
  discount_type: string; // 'percentage' or 'fixed'
  discount_value: number;
  start_date: string | null;
  end_date: string | null;
  is_active: number;
}

interface ServiceItem {
  id: number;
  name: string;
  category_name?: string;
}

interface OffersManagerProps {
  initialOffers: Offer[];
  categories: Category[];
  initialDiscounts: ServiceDiscount[];
  services: ServiceItem[];
}

export function OffersManager({ initialOffers, categories, initialDiscounts, services }: OffersManagerProps) {
  const [activeSubTab, setActiveSubTab] = useState<"banners" | "discounts">("banners");
  
  // Banners state
  const [offers, setOffers] = useState<Offer[]>(initialOffers);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // New UI enhancements states
  const [highlightEditForm, setHighlightEditForm] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const showToast = useCallback((message: string) => {
    setToastMessage(message);
    const timer = setTimeout(() => {
      setToastMessage(null);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // Banner Form states
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [code, setCode] = useState("");
  const [image, setImage] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isActive, setIsActive] = useState(1);
  const [targetUrl, setTargetUrl] = useState("");
  const [ctaText, setCtaText] = useState("Book Now");
  const [linkedServiceId, setLinkedServiceId] = useState("");
  const [linkedCategoryId, setLinkedCategoryId] = useState("");
  const [bannerDiscountType, setBannerDiscountType] = useState("percentage");
  const [bannerDiscountValue, setBannerDiscountValue] = useState("");
  const [maxDiscount, setMaxDiscount] = useState("");
  const [minOrderAmount, setMinOrderAmount] = useState("");
  
  // Visibility and limits
  const [status, setStatus] = useState("visible");
  const [usageLimit, setUsageLimit] = useState("");

  // Discounts state
  const [discounts, setDiscounts] = useState<ServiceDiscount[]>(initialDiscounts || []);
  const [editingDiscount, setEditingDiscount] = useState<ServiceDiscount | null>(null);
  const [showAddDiscountForm, setShowAddDiscountForm] = useState(false);

  // Discount Form states
  const [discServiceId, setDiscServiceId] = useState("");
  const [discType, setDiscType] = useState("percentage");
  const [discValue, setDiscValue] = useState("");
  const [discStartDate, setDiscStartDate] = useState("");
  const [discEndDate, setDiscEndDate] = useState("");
  const [discIsActive, setDiscIsActive] = useState(1);

  const resetForm = () => {
    setTitle("");
    setSubtitle("");
    setCode("");
    setImage("");
    setStartDate("");
    setEndDate("");
    setIsActive(1);
    setTargetUrl("");
    setCtaText("Book Now");
    setLinkedServiceId("");
    setLinkedCategoryId("");
    setBannerDiscountType("percentage");
    setBannerDiscountValue("");
    setMaxDiscount("");
    setMinOrderAmount("");
    setStatus("visible");
    setUsageLimit("");
    setEditingOffer(null);
    setShowAddForm(false);
  };

  const resetDiscountForm = () => {
    setDiscServiceId("");
    setDiscType("percentage");
    setDiscValue("");
    setDiscStartDate("");
    setDiscEndDate("");
    setDiscIsActive(1);
    setEditingDiscount(null);
    setShowAddDiscountForm(false);
  };

  const startEdit = (o: Offer) => {
    setEditingOffer(o);
    setTitle(o.title);
    setSubtitle(o.subtitle || "");
    setCode(o.code || "");
    setImage(o.image || "");
    setStartDate(o.start_date || "");
    setEndDate(o.end_date || "");
    setIsActive(o.is_active);
    setTargetUrl(o.target_url || "");
    setCtaText(o.cta_text || "Book Now");
    setLinkedServiceId(o.service_id ? o.service_id.toString() : "");
    setLinkedCategoryId(o.category_id ? o.category_id.toString() : "");
    setBannerDiscountType(o.discount_type || "percentage");
    setBannerDiscountValue(o.discount_value ? o.discount_value.toString() : "");
    setMaxDiscount(o.max_discount ? o.max_discount.toString() : "");
    setMinOrderAmount(o.min_order_amount ? o.min_order_amount.toString() : "");
    setStatus(o.status || "visible");
    setUsageLimit(o.usage_limit ? o.usage_limit.toString() : "");
    setShowAddForm(true);

    // Smooth scroll and focus highlight
    setTimeout(() => {
      if (formRef.current) {
        formRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
        setHighlightEditForm(true);
        setTimeout(() => {
          setHighlightEditForm(false);
        }, 2500);
      }
    }, 50);
  };

  const startEditDiscount = (d: ServiceDiscount) => {
    setEditingDiscount(d);
    setDiscServiceId(d.service_id.toString());
    setDiscType(d.discount_type);
    setDiscValue(d.discount_value.toString());
    setDiscStartDate(d.start_date || "");
    setDiscEndDate(d.end_date || "");
    setDiscIsActive(d.is_active);
    setShowAddDiscountForm(false);
  };

  const toggleVisibility = async (o: Offer) => {
    const nextStatus = (o.status || "visible") === "visible" ? "hidden" : "visible";
    
    // Optimistic update
    setOffers(prev => prev.map(item =>
      item.id === o.id ? { ...item, status: nextStatus } : item
    ));
    
    try {
      const response = await fetch("/api/admin/offers", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ id: o.id, status: nextStatus }),
      });

      if (response.status === 401) {
        // Session expired — redirect to login
        window.location.href = "/admin";
        return;
      }

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData?.error || "Failed to update visibility");
      }

      showToast("Banner updated successfully.");
    } catch (err) {
      console.error("Toggle visibility error:", err);
      // Revert optimistic update on failure
      setOffers(prev => prev.map(item =>
        item.id === o.id ? { ...item, status: o.status } : item
      ));
      alert("Failed to update banner visibility. Please refresh and try again.");
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIsUploading(true);
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
        setImage(data.url);
      } catch (err) {
        console.error(err);
        alert("Failed to upload image.");
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleAddOffer = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/admin/offers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          title,
          subtitle: subtitle || null,
          code: code || null,
          image: image || null,
          target_url: targetUrl || null,
          cta_text: ctaText || "Book Now",
          start_date: startDate || null,
          end_date: endDate || null,
          service_id: linkedServiceId ? parseInt(linkedServiceId) : null,
          category_id: linkedCategoryId ? parseInt(linkedCategoryId) : null,
          discount_type: bannerDiscountType || null,
          discount_value: bannerDiscountValue ? parseFloat(bannerDiscountValue) : null,
          max_discount: maxDiscount ? parseFloat(maxDiscount) : null,
          min_order_amount: minOrderAmount ? parseFloat(minOrderAmount) : null,
          status,
          usage_limit: usageLimit ? parseInt(usageLimit) : null,
        }),
      });

      if (!response.ok) throw new Error("Failed to create offer");

      const result = await response.json();
      const newOffer: Offer = {
        id: result.id,
        title,
        subtitle: subtitle || null,
        code: code || null,
        image: image || null,
        target_url: targetUrl || null,
        cta_text: ctaText || "Book Now",
        start_date: startDate || null,
        end_date: endDate || null,
        is_active: 1,
        display_order: offers.length + 1,
        service_id: linkedServiceId ? parseInt(linkedServiceId) : null,
        category_id: linkedCategoryId ? parseInt(linkedCategoryId) : null,
        discount_type: bannerDiscountType || null,
        discount_value: bannerDiscountValue ? parseFloat(bannerDiscountValue) : null,
        max_discount: maxDiscount ? parseFloat(maxDiscount) : null,
        min_order_amount: minOrderAmount ? parseFloat(minOrderAmount) : null,
        status,
        usage_limit: usageLimit ? parseInt(usageLimit) : null,
        created_by: result.created_by,
        updated_by: result.updated_by,
        created_at: result.created_at,
        updated_at: result.updated_at,
      };

      setOffers([...offers, newOffer]);
      resetForm();
      showToast("Banner created successfully.");
    } catch (err) {
      console.error(err);
      alert("Failed to create offer");
    }
  };

  const handleEditOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOffer) return;

    try {
      const response = await fetch("/api/admin/offers", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          id: editingOffer.id,
          title,
          subtitle: subtitle || null,
          code: code || null,
          image: image || null,
          target_url: targetUrl || null,
          cta_text: ctaText || "Book Now",
          start_date: startDate || null,
          end_date: endDate || null,
          is_active: isActive,
          service_id: linkedServiceId ? parseInt(linkedServiceId) : null,
          category_id: linkedCategoryId ? parseInt(linkedCategoryId) : null,
          discount_type: bannerDiscountType || null,
          discount_value: bannerDiscountValue ? parseFloat(bannerDiscountValue) : null,
          max_discount: maxDiscount ? parseFloat(maxDiscount) : null,
          min_order_amount: minOrderAmount ? parseFloat(minOrderAmount) : null,
          status,
          usage_limit: usageLimit ? parseInt(usageLimit) : null,
        }),
      });

      if (!response.ok) throw new Error("Failed to update offer");

      const result = await response.json();
      const updated = offers.map((o) =>
        o.id === editingOffer.id
          ? {
              ...o,
              title,
              subtitle: subtitle || null,
              code: code || null,
              image: image || null,
              target_url: targetUrl || null,
              cta_text: ctaText || "Book Now",
              start_date: startDate || null,
              end_date: endDate || null,
              is_active: isActive,
              service_id: linkedServiceId ? parseInt(linkedServiceId) : null,
              category_id: linkedCategoryId ? parseInt(linkedCategoryId) : null,
              discount_type: bannerDiscountType || null,
              discount_value: bannerDiscountValue ? parseFloat(bannerDiscountValue) : null,
              max_discount: maxDiscount ? parseFloat(maxDiscount) : null,
              min_order_amount: minOrderAmount ? parseFloat(minOrderAmount) : null,
              status,
              usage_limit: usageLimit ? parseInt(usageLimit) : null,
              updated_by: result.updated_by,
              updated_at: result.updated_at,
            }
          : o
      );

      setOffers(updated);
      resetForm();
      showToast("Banner updated successfully.");
    } catch (err) {
      console.error(err);
      alert("Failed to update offer");
    }
  };

  const handleDeleteOffer = async (id: number) => {
    if (!confirm("Are you sure you want to delete this offer/banner?")) return;

    try {
      const response = await fetch(`/api/admin/offers?id=${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) throw new Error("Failed to delete offer");

      setOffers(offers.filter((o) => o.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete offer");
    }
  };

  const handleAddDiscount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!discServiceId || !discType || !discValue) return;

    try {
      const response = await fetch("/api/admin/discounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service_id: parseInt(discServiceId),
          discount_type: discType,
          discount_value: parseFloat(discValue),
          start_date: discStartDate || null,
          end_date: discEndDate || null,
        }),
      });

      if (!response.ok) throw new Error("Failed to create discount");

      const result = await response.json();
      const serviceName = services.find((s) => s.id === parseInt(discServiceId))?.name || "Service";

      const newDiscount: ServiceDiscount = {
        id: result.id,
        service_id: parseInt(discServiceId),
        service_name: serviceName,
        discount_type: discType,
        discount_value: parseFloat(discValue),
        start_date: discStartDate || null,
        end_date: discEndDate || null,
        is_active: 1,
      };

      setDiscounts([newDiscount, ...discounts]);
      resetDiscountForm();
    } catch (err) {
      console.error(err);
      alert("Failed to create discount offer");
    }
  };

  const handleEditDiscount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDiscount || !discServiceId || !discType || !discValue) return;

    try {
      const response = await fetch("/api/admin/discounts", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingDiscount.id,
          service_id: parseInt(discServiceId),
          discount_type: discType,
          discount_value: parseFloat(discValue),
          start_date: discStartDate || null,
          end_date: discEndDate || null,
          is_active: discIsActive,
        }),
      });

      if (!response.ok) throw new Error("Failed to update discount");

      const serviceName = services.find((s) => s.id === parseInt(discServiceId))?.name || "Service";

      const updated = discounts.map((d) =>
        d.id === editingDiscount.id
          ? {
              ...d,
              service_id: parseInt(discServiceId),
              service_name: serviceName,
              discount_type: discType,
              discount_value: parseFloat(discValue),
              start_date: discStartDate || null,
              end_date: discEndDate || null,
              is_active: discIsActive,
            }
          : d
      );

      setDiscounts(updated);
      resetDiscountForm();
    } catch (err) {
      console.error(err);
      alert("Failed to update discount offer");
    }
  };

  const handleDeleteDiscount = async (id: number) => {
    if (!confirm("Are you sure you want to delete this discount offer?")) return;

    try {
      const response = await fetch(`/api/admin/discounts?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete discount");

      setDiscounts(discounts.filter((d) => d.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete discount offer");
    }
  };

  const moveOffer = async (index: number, direction: "up" | "down") => {
    const newOffers = [...offers];
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newOffers.length) return;

    // Swap
    const temp = newOffers[index];
    newOffers[index] = newOffers[targetIdx];
    newOffers[targetIdx] = temp;

    // Recalculate order
    const updatedOrders = newOffers.map((o, idx) => ({
      id: o.id,
      display_order: idx + 1,
    }));

    const savedOffers = newOffers.map((o, idx) => ({
      ...o,
      display_order: idx + 1,
    }));
    setOffers(savedOffers);

    try {
      await fetch("/api/admin/offers", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ orders: updatedOrders }),
      });
    } catch (err) {
      console.error(err);
      alert("Failed to save display order.");
    }
  };

  return (
    <div className="space-y-8">
      {/* Title Header */}
      <div>
        <h2 className="text-2xl font-bold text-primary">Promotions & Offers</h2>
        <p className="text-sm text-muted mt-1">Manage home screen slider campaigns, coupon codes, and service-specific discount offers.</p>
      </div>

      {/* Sub-Tabs Bar */}
      <div className="flex border-b border-border gap-6">
        <button
          type="button"
          onClick={() => { setActiveSubTab("banners"); resetForm(); resetDiscountForm(); }}
          className={`pb-3 text-sm font-bold border-b-2 transition-all ${
            activeSubTab === "banners" ? "border-primary text-primary" : "border-transparent text-muted hover:text-primary"
          }`}
        >
          Slider Banners & Campaigns
        </button>
        <button
          type="button"
          onClick={() => { setActiveSubTab("discounts"); resetForm(); resetDiscountForm(); }}
          className={`pb-3 text-sm font-bold border-b-2 transition-all ${
            activeSubTab === "discounts" ? "border-primary text-primary" : "border-transparent text-muted hover:text-primary"
          }`}
        >
          Service Discount Offers
        </button>
      </div>

      {/* TAB 1: SLIDER BANNERS */}
      {activeSubTab === "banners" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-extrabold text-primary">Homepage Slider Banners</h3>
            {!showAddForm && !editingOffer && (
              <Button onClick={() => setShowAddForm(true)} className="flex items-center gap-2">
                <Plus className="h-4 w-4" /> Add Offer Banner
              </Button>
            )}
          </div>

          {(showAddForm || editingOffer) && (
            <div 
              ref={formRef}
              className={`bg-white border p-6 sm:p-8 max-w-2xl shadow-sm rounded-3xl transition-all duration-500 ${
                highlightEditForm 
                  ? "border-primary ring-4 ring-primary/20 scale-[1.01] bg-primary/5" 
                  : "border-border"
              }`}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-primary">
                  {editingOffer ? `Edit Banner: ${editingOffer.title}` : "Create New Promotional Offer"}
                </h3>
                <button onClick={resetForm} className="text-muted hover:text-primary">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={editingOffer ? handleEditOffer : handleAddOffer} className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-primary mb-1.5">Offer Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. AC Service Fest"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-border text-sm outline-none focus:border-secondary"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-primary mb-1.5">Subtitle / Promo Text</label>
                    <input
                      type="text"
                      placeholder="e.g. Flat 15% OFF on Deep Jet Cleaning"
                      value={subtitle}
                      onChange={(e) => setSubtitle(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-border text-sm outline-none focus:border-secondary"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-primary mb-1.5">Coupon Code (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. ACFEST15"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-border text-sm outline-none focus:border-secondary"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-primary mb-1.5">Usage Limit (Optional Max Redemptions)</label>
                    <input
                      type="number"
                      placeholder="e.g. 100 (Leave blank for unlimited)"
                      value={usageLimit}
                      onChange={(e) => setUsageLimit(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-border text-sm outline-none focus:border-secondary"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-1">
                  <div>
                    <label className="block text-xs font-semibold text-primary mb-1.5">Visibility Status</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-border text-sm outline-none focus:border-secondary bg-white"
                    >
                      <option value="visible">Visible (Active in Carousel & Links)</option>
                      <option value="hidden">Hidden (Never show in Carousel, Links Blocked)</option>
                      <option value="disabled">Disabled (Fully Deactivated)</option>
                      <option value="draft">Draft (In Progress)</option>
                    </select>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-primary mb-1.5">Target Destination Page</label>
                    <select
                      value={targetUrl}
                      onChange={(e) => setTargetUrl(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-border text-sm outline-none focus:border-secondary bg-white"
                    >
                      <option value="">No link target (Static display)</option>
                      {categories.map((c) => (
                        <option key={c.id} value={`/services/${c.slug}`}>
                          Link to Category: {c.name}
                        </option>
                      ))}
                      <option value="/reviews">Link to Reviews Page</option>
                      <option value="/faq">Link to FAQ Page</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-primary mb-1.5">CTA Button Text</label>
                    <input
                      type="text"
                      placeholder="e.g. Book Now, Get Free Quote"
                      value={ctaText}
                      onChange={(e) => setCtaText(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-border text-sm outline-none focus:border-secondary"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-primary mb-1.5">Start Schedule Date (Optional)</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-border text-sm outline-none focus:border-secondary"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-primary mb-1.5">End Expiration Date (Optional)</label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-border text-sm outline-none focus:border-secondary"
                    />
                  </div>
                </div>

                <div className="bg-surface/50 p-4 rounded-2xl border border-border/80 space-y-4">
                  <h4 className="text-xs font-bold text-primary uppercase tracking-wider">Coupon Campaign Settings (Optional)</h4>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-semibold text-primary mb-1.5">Discount Type</label>
                      <select
                        value={bannerDiscountType}
                        onChange={(e) => setBannerDiscountType(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-border text-sm outline-none focus:border-secondary bg-white"
                      >
                        <option value="percentage">Percentage OFF (%)</option>
                        <option value="fixed">Fixed Flat OFF (₹)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-primary mb-1.5">Discount Value</label>
                      <input
                        type="number"
                        placeholder="e.g. 10 or 150"
                        value={bannerDiscountValue}
                        onChange={(e) => setBannerDiscountValue(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-border text-sm outline-none focus:border-secondary"
                      />
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-semibold text-primary mb-1.5">Max Discount Limit (₹) (Optional)</label>
                      <input
                        type="number"
                        placeholder="e.g. 500"
                        value={maxDiscount}
                        onChange={(e) => setMaxDiscount(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-border text-sm outline-none focus:border-secondary"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-primary mb-1.5">Min Order Amount Required (₹) (Optional)</label>
                      <input
                        type="number"
                        placeholder="e.g. 499"
                        value={minOrderAmount}
                        onChange={(e) => setMinOrderAmount(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-border text-sm outline-none focus:border-secondary"
                      />
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-semibold text-primary mb-1.5">Linked Category Page (Optional)</label>
                      <select
                        value={linkedCategoryId}
                        onChange={(e) => setLinkedCategoryId(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-border text-sm outline-none focus:border-secondary bg-white"
                      >
                        <option value="">No category link</option>
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-primary mb-1.5">Linked Specific Service (Optional)</label>
                      <select
                        value={linkedServiceId}
                        onChange={(e) => setLinkedServiceId(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-border text-sm outline-none focus:border-secondary bg-white"
                      >
                        <option value="">No service link</option>
                        {services.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name} ({s.category_name})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-primary mb-1.5">Banner Background Image URL or Upload</label>
                  <div className="flex gap-4 items-center">
                    <input
                      type="text"
                      placeholder="Leave empty for solid brand purple gradient background"
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-border text-sm outline-none focus:border-secondary"
                    />
                    <div className="relative shrink-0">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      />
                      <Button type="button" variant="outline" className="flex items-center gap-2 whitespace-nowrap text-sm h-10">
                        <Upload className="h-4 w-4" /> {isUploading ? "Uploading..." : "Upload"}
                      </Button>
                  </div>
                </div>
              </div>

              {/* Real-time Banner Preview Card */}
                <div className="bg-surface/50 p-4 rounded-2xl border border-border/85 space-y-2">
                  <h4 className="text-xs font-bold text-primary uppercase tracking-wider">Live Customer App Preview</h4>
                  <div className="relative h-28 w-full max-w-sm rounded-[20px] overflow-hidden shadow-md bg-gradient-to-r from-purple-600 to-indigo-650 flex flex-col justify-between p-4 text-white">
                    {image && (
                      <div className="absolute inset-0 z-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={image} alt="Preview Banner background" className="w-full h-full object-cover opacity-60" />
                      </div>
                    )}
                    <div className="relative z-10">
                      <span className="inline-flex items-center gap-1 bg-white/25 text-[9px] font-black tracking-widest uppercase text-white px-2 py-0.5 rounded-full">
                        <Percent className="h-3 w-3 animate-pulse" /> Offer Code: {code || "SURAT10"}
                      </span>
                      <h3 className="text-xs font-black text-white mt-1.5 leading-tight">{title || "AC Service Fest"}</h3>
                      <p className="text-[9px] text-white/80 font-medium leading-normal">{subtitle || "Flat 10% OFF on Deep Jet Cleaning"}</p>
                    </div>
                    <div className="relative z-10 flex justify-between items-center text-[9px] text-white/95 font-bold border-t border-white/15 pt-1.5 mt-1">
                      <span className="tracking-wide">Exclusively in Surat</span>
                      {(linkedServiceId || linkedCategoryId || targetUrl) && (
                        <span className="underline decoration-white/30 underline-offset-2 flex items-center gap-0.5 cursor-pointer">
                          {ctaText || "Book Now"}
                          <ChevronRight className="h-3 w-3" />
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-2">
                  <Button type="submit">
                    {editingOffer ? "Save Changes" : "Publish Offer"}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* Grid of Offers */}
          <div className="grid gap-6 md:grid-cols-2">
            {offers.map((o, idx) => {
              const isExpired = o.end_date && new Date(o.end_date) < new Date();
              const isFuture = o.start_date && new Date(o.start_date) > new Date();

              return (
                <div
                  key={o.id}
                  className={`bg-white border border-border rounded-3xl overflow-hidden flex flex-col justify-between shadow-xs ${
                    o.is_active !== 1 || isExpired ? "opacity-75" : ""
                  }`}
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <span className="inline-flex items-center gap-1 bg-primary/10 text-primary text-[10px] font-black tracking-widest uppercase px-2 py-0.5 rounded-full">
                          <Percent className="h-3.5 w-3.5 text-primary" /> Code: {o.code || "None"}
                        </span>
                        <h3 className="text-lg font-black text-primary mt-3 leading-snug">{o.title}</h3>
                        <p className="text-xs text-muted font-medium mt-1">{o.subtitle || "Exclusive campaign promotion"}</p>
                        <div className="mt-3 text-[11px] font-semibold text-muted/80 space-y-1 bg-surface p-2.5 rounded-xl border border-border/50">
                          <div>Destination: <span className="text-primary font-black">{o.target_url || "None (Static Banner)"}</span></div>
                          <div>Button CTA: <span className="text-primary font-black">{o.cta_text || "Book Now"}</span></div>
                          {o.discount_value && (
                            <div>
                              Discount: <span className="text-green-700 font-extrabold">{o.discount_type === "percentage" ? `${o.discount_value}% OFF` : `₹${o.discount_value} OFF`}</span>
                              {o.max_discount ? ` (Max: ₹${o.max_discount})` : ""}
                              {o.min_order_amount ? ` on orders >= ₹${o.min_order_amount}` : ""}
                            </div>
                          )}
                          {o.service_id && (
                            <div>Linked Service ID: <span className="text-primary font-black">{o.service_id}</span></div>
                          )}
                          {o.category_id && (
                            <div>Linked Category ID: <span className="text-primary font-black">{o.category_id}</span></div>
                          )}
                          {/* Visibility and limits */}
                          <div>Visibility Status: <span className="text-primary font-black capitalize">{o.status || "visible"}</span></div>
                          <div>Usage Limit: <span className="text-primary font-black">{o.usage_limit !== null && o.usage_limit !== undefined ? `${o.usage_limit} redemptions` : "Unlimited"}</span></div>
                          
                          {/* Audit logs */}
                          <div className="border-t border-border/40 pt-1 mt-1 text-[10px] text-muted space-y-0.5">
                            <div>Created By: <span className="font-semibold text-muted-foreground">{o.created_by || "admin@oncar.in"}</span></div>
                            <div>Updated By: <span className="font-semibold text-muted-foreground">{o.updated_by || "admin@oncar.in"}</span></div>
                            {o.created_at && <div>Created At: <span className="font-semibold text-muted-foreground">{new Date(o.created_at).toLocaleString()}</span></div>}
                            {o.updated_at && <div>Updated At: <span className="font-semibold text-muted-foreground">{new Date(o.updated_at).toLocaleString()}</span></div>}
                          </div>
                        </div>
                        {!o.service_id && !o.category_id && (
                          <div className="mt-3.5 bg-amber-50 border border-amber-200 text-[10px] text-amber-800 font-extrabold px-3 py-2 rounded-xl flex items-start gap-1.5">
                            <span>⚠️ Warning: Banner has no Service ID or Category ID. The &apos;Book Now&apos; CTA link will be hidden.</span>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col gap-3 items-end shrink-0 select-none">
                        {/* Toggle Switch */}
                        <div className="flex items-center gap-2 bg-surface p-1.5 rounded-xl border border-border/80 shadow-3xs">
                          <span className="text-[9px] font-black uppercase text-muted tracking-wider">
                            {o.status === "visible" ? "Show" : "Hide"}
                          </span>
                          <button
                            type="button"
                            onClick={() => toggleVisibility(o)}
                            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                              o.status === "visible" ? "bg-primary" : "bg-gray-200"
                            }`}
                          >
                            <span
                              className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                                o.status === "visible" ? "translate-x-4" : "translate-x-0"
                              }`}
                            />
                          </button>
                        </div>

                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          o.status === "disabled"
                            ? "bg-red-100 text-red-800"
                            : o.status === "draft"
                            ? "bg-gray-100 text-gray-700 border border-gray-300"
                            : o.status === "hidden"
                            ? "bg-amber-100 text-amber-805"
                            : isExpired
                            ? "bg-red-100 text-red-800"
                            : isFuture
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-100 text-green-800"
                        }`}>
                          {o.status === "disabled"
                            ? "Disabled"
                            : o.status === "draft"
                            ? "Draft"
                            : o.status === "hidden"
                            ? "Hidden (Coupon Active)"
                            : isExpired
                            ? "Expired"
                            : isFuture
                            ? "Scheduled"
                            : "Live & Visible"}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-border/60 grid grid-cols-2 gap-4 text-xs font-semibold text-muted">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 opacity-60" />
                        <span>Start: {o.start_date || "Immediate"}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 opacity-60" />
                        <span>Ends: {o.end_date || "Never"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 pt-0 border-t border-border flex flex-col gap-3 mt-auto bg-surface/10">
                    <div className="flex gap-2 w-full pt-3">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => moveOffer(idx, "up")}
                        className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-xs font-bold border border-border hover:bg-surface disabled:opacity-40 transition-colors"
                      >
                        <ArrowUp className="h-3.5 w-3.5" /> Move Up
                      </button>
                      <button
                        type="button"
                        disabled={idx === offers.length - 1}
                        onClick={() => moveOffer(idx, "down")}
                        className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-xs font-bold border border-border hover:bg-surface disabled:opacity-40 transition-colors"
                      >
                        <ArrowDown className="h-3.5 w-3.5" /> Move Down
                      </button>
                    </div>
                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={() => startEdit(o)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-semibold border border-border text-primary hover:bg-surface transition-colors"
                      >
                        <Edit2 className="h-4 w-4" /> Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteOffer(o.id)}
                        className="flex items-center justify-center py-2 px-3 rounded-xl border border-red-250 text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: SERVICE DISCOUNTS */}
      {activeSubTab === "discounts" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-extrabold text-primary">Service Discount Offers & Price Adjustments</h3>
            {!showAddDiscountForm && !editingDiscount && (
              <Button onClick={() => setShowAddDiscountForm(true)} className="flex items-center gap-2">
                <Plus className="h-4 w-4" /> Link Discount to Service
              </Button>
            )}
          </div>

          {(showAddDiscountForm || editingDiscount) && (
            <div className="bg-white border border-border rounded-3xl p-6 sm:p-8 max-w-2xl shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-primary">
                  {editingDiscount ? "Edit Service Discount Offer" : "Link New Discount to Service"}
                </h3>
                <button type="button" onClick={resetDiscountForm} className="text-muted hover:text-primary">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={editingDiscount ? handleEditDiscount : handleAddDiscount} className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-primary mb-1.5">Link to Service</label>
                    <select
                      required
                      value={discServiceId}
                      onChange={(e) => setDiscServiceId(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-border text-sm outline-none focus:border-secondary bg-white"
                    >
                      <option value="">Select Service</option>
                      {services.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} ({s.category_name || "Instant"})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-primary mb-1.5">Discount Type</label>
                    <select
                      required
                      value={discType}
                      onChange={(e) => setDiscType(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-border text-sm outline-none focus:border-secondary bg-white"
                    >
                      <option value="percentage">Percentage Discount (%)</option>
                      <option value="fixed">Fixed Discount Amount (₹)</option>
                    </select>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-primary mb-1.5">Discount Value</label>
                    <input
                      type="number"
                      required
                      min={0}
                      placeholder={discType === "percentage" ? "e.g. 10 (for 10% off)" : "e.g. 100 (for ₹100 off)"}
                      value={discValue}
                      onChange={(e) => setDiscValue(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-border text-sm outline-none focus:border-secondary"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-primary mb-1.5">Status Visibility</label>
                    <select
                      value={discIsActive}
                      onChange={(e) => setDiscIsActive(parseInt(e.target.value))}
                      className="w-full px-3 py-2.5 rounded-xl border border-border text-sm outline-none focus:border-secondary bg-white"
                    >
                      <option value={1}>Active & Scheduled</option>
                      <option value={0}>Disabled / Draft</option>
                    </select>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-primary mb-1.5">Start Validity Date (Optional)</label>
                    <input
                      type="date"
                      value={discStartDate}
                      onChange={(e) => setDiscStartDate(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-border text-sm outline-none focus:border-secondary"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-primary mb-1.5">End Validity Date (Optional)</label>
                    <input
                      type="date"
                      value={discEndDate}
                      onChange={(e) => setDiscEndDate(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-border text-sm outline-none focus:border-secondary"
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-2">
                  <Button type="submit">
                    {editingDiscount ? "Save Changes" : "Link Offer"}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetDiscountForm}>
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* Grid of Discounts */}
          <div className="grid gap-6 md:grid-cols-2">
            {discounts.map((d) => {
              const isExpired = d.end_date && new Date(d.end_date) < new Date();
              const isFuture = d.start_date && new Date(d.start_date) > new Date();

              return (
                <div
                  key={d.id}
                  className={`bg-white border border-border rounded-3xl overflow-hidden flex flex-col justify-between shadow-xs ${
                    d.is_active !== 1 || isExpired ? "opacity-75" : ""
                  }`}
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <span className="inline-flex items-center gap-1 bg-secondary/15 text-primary text-[10px] font-black tracking-widest uppercase px-2 py-0.5 rounded-full">
                          Offer: {d.discount_type === "percentage" ? `${d.discount_value}% OFF` : `₹${d.discount_value} OFF`}
                        </span>
                        <h3 className="text-lg font-black text-primary mt-3 leading-snug">{d.service_name || "Linked Service"}</h3>
                        <p className="text-xs text-muted font-medium mt-1">
                          Value: {d.discount_type === "percentage" ? `${d.discount_value}% off service price` : `Flat ₹${d.discount_value} off`}
                        </p>
                      </div>
                      <div className="flex flex-col gap-1.5 items-end">
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          d.is_active === 1 && !isExpired && !isFuture
                            ? "bg-green-100 text-green-800"
                            : d.is_active === 1 && isFuture
                            ? "bg-blue-100 text-blue-800"
                            : "bg-red-100 text-red-800"
                        }`}>
                          {d.is_active !== 1 ? "Draft" : isExpired ? "Expired" : isFuture ? "Scheduled" : "Live"}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-border/60 grid grid-cols-2 gap-4 text-xs font-semibold text-muted">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 opacity-60" />
                        <span>Start: {d.start_date || "Immediate"}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 opacity-60" />
                        <span>Ends: {d.end_date || "Never"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 pt-0 border-t border-border flex gap-4 mt-auto bg-surface/10 pt-3">
                    <button
                      type="button"
                      onClick={() => startEditDiscount(d)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-semibold border border-border text-primary hover:bg-surface transition-colors"
                    >
                      <Edit2 className="h-4 w-4" /> Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteDiscount(d.id)}
                      className="flex items-center justify-center py-2 px-3 rounded-xl border border-red-250 text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-300">
          <div className="bg-primary text-white text-xs font-black px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 border border-white/10">
            <div className="h-2 w-2 rounded-full bg-green-400 animate-ping" />
            {toastMessage}
          </div>
        </div>
      )}
    </div>
  );
}
