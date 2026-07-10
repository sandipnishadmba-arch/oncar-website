"use client";

import { MessageCircle } from "lucide-react";
import { formatWhatsAppLink } from "@/lib/utils";
import { SITE_CONFIG } from "@/lib/constants";

interface WhatsAppFloatProps {
  settings?: {
    whatsapp_number: string;
  };
}

export function WhatsAppFloat({ settings }: WhatsAppFloatProps) {
  const whatsappNumber = settings?.whatsapp_number || SITE_CONFIG.whatsapp;

  return (
    <a
      href={formatWhatsAppLink(
        "Hi OnCar! I want to inquire about own car driving training in Surat.",
        whatsappNumber
      )}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-[#25D366]/30 transition-all duration-300 hover:scale-110 hover:shadow-xl hover:shadow-[#25D366]/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2"
      aria-label="Chat with us on WhatsApp"
    >
      <MessageCircle className="h-7 w-7" aria-hidden="true" />
    </a>
  );
}
