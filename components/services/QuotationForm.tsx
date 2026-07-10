"use client";

import { useState } from "react";
import { Send, User, Phone, MapPin, FileText, Image as ImageIcon, AlertCircle, CheckCircle, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { buildWhatsAppMessage, formatWhatsAppLink } from "@/lib/utils";
import { SERVICE_AREAS } from "@/lib/areas";

interface QuotationFormProps {
  category: {
    id: number;
    name: string;
    slug: string;
  };
  settings: {
    whatsapp_number: string;
    quotation_message: string;
  };
}

export function QuotationForm({ category, settings }: QuotationFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    area: "",
    address: "",
    details: "",
  });

  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...selectedFiles].slice(0, 5)); // limit to 5 images
    }
  };

  const handleRemoveFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

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
      // Save quotation inquiry to the SQLite database
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "quotation",
          category_name: category.name,
          service_name: "Project Estimation",
          customer_name: formData.name,
          phone: formData.phone,
          address: formData.address,
          area: formData.area,
          pincode: "", // Removed PIN Code
          notes: formData.details,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save quotation inquiry");
      }

      // Format WhatsApp message without PIN or GPS links
      const whatsappMsg = buildWhatsAppMessage(settings.quotation_message, {
        category_name: category.name,
        customer_name: formData.name,
        phone_number: formData.phone,
        area: formData.area,
        pincode: "Surat", // Fallback replacing pincode placeholder
        address: formData.address,
        details: formData.details,
      });

      // Redirect to WhatsApp
      window.open(formatWhatsAppLink(whatsappMsg, settings.whatsapp_number), "_blank");
      setSuccess(true);
      setFormData({
        name: "",
        phone: "",
        area: "",
        address: "",
        details: "",
      });
      setFiles([]);
    } catch (err) {
      console.error(err);
      setError("An error occurred while submitting. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-3xl border border-border bg-white p-5 shadow-lg max-w-xl mx-auto">
      {success && (
        <div className="mb-4 flex items-start gap-3 rounded-2xl bg-emerald-50 p-4 text-emerald-800 border border-emerald-100">
          <CheckCircle className="h-5 w-5 shrink-0 text-emerald-600 mt-0.5" />
          <div>
            <h4 className="font-bold text-sm">Quote Request Saved!</h4>
            <p className="text-xs text-emerald-700/90 mt-0.5">Your estimate details have been synced. Sending you to WhatsApp for confirmation...</p>
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
            <label className="block text-[10px] font-bold text-primary mb-1 uppercase tracking-wider">Your Name</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
              <input
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
            <label className="block text-[10px] font-bold text-primary mb-1 uppercase tracking-wider">Mobile Number</label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
              <input
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

        {/* Dropdown of Surat Areas */}
        <div>
          <label className="block text-[10px] font-bold text-primary mb-1 uppercase tracking-wider">Select Area</label>
          <div className="relative">
            <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
            <select
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
          <label className="block text-[10px] font-bold text-primary mb-1 uppercase tracking-wider">Full Address</label>
          <div className="relative">
            <MapPin className="absolute left-3.5 top-3 h-4 w-4 text-muted" />
            <textarea
              required
              rows={2}
              placeholder="Flat/House No, Building, Society, Street/Road"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-border text-sm outline-none focus:border-secondary bg-surface focus:bg-white resize-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-primary mb-1 uppercase tracking-wider">Project Details (Optional)</label>
          <div className="relative">
            <FileText className="absolute left-3.5 top-3 h-4 w-4 text-muted" />
            <textarea
              rows={2}
              placeholder="Describe requirements or custom options..."
              value={formData.details}
              onChange={(e) => setFormData({ ...formData, details: e.target.value })}
              className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-border text-sm outline-none focus:border-secondary bg-surface focus:bg-white resize-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-primary mb-1 uppercase tracking-wider">Upload Reference Images (Optional, Max 5)</label>
          <div className="flex flex-wrap gap-2 items-center">
            <label className="flex h-16 w-16 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-border hover:bg-surface hover:border-secondary/50 transition-colors">
              <ImageIcon className="h-5 w-5 text-muted" />
              <span className="text-[9px] text-muted font-bold mt-1">Add Image</span>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
            {files.map((file, idx) => (
              <div key={idx} className="relative h-16 w-16 rounded-xl border border-border overflow-hidden bg-surface flex items-center justify-center p-1">
                <span className="text-[9px] font-semibold text-muted text-center truncate w-full px-1">{file.name}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveFile(idx)}
                  className="absolute right-0.5 top-0.5 rounded-full bg-primary/80 p-0.5 text-white hover:bg-primary"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <Button
          type="submit"
          variant="whatsapp"
          className="w-full py-3 text-sm font-bold text-center flex items-center justify-center gap-1.5"
          disabled={isSubmitting}
        >
          <Send className="h-4 w-4" />
          {isSubmitting ? "Submitting..." : "Send Request over WhatsApp"}
        </Button>
      </form>
    </div>
  );
}
