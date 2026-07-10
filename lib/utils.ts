import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { SITE_CONFIG } from "./constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatWhatsAppLink(message: string, customPhone?: string | number): string {
  const rawPhone = String(customPhone || SITE_CONFIG.whatsapp);
  const phone = rawPhone.replace(/\D/g, "");
  const encoded = encodeURIComponent(message);
  // whatsapp://send protocol directly launches the WhatsApp app on mobile devices
  // without navigating the browser page or opening new browser tabs
  return `whatsapp://send?phone=${phone}&text=${encoded}`;
}

export function buildWhatsAppMessage(template: string, data: Record<string, string>): string {
  let message = template;
  for (const [key, val] of Object.entries(data)) {
    // Replace all occurrences of {key} or {key_name}
    const regex = new RegExp(`{${key}}`, "g");
    message = message.replace(regex, val || "");
  }
  return message;
}

export function validateSuratCity(address: string): boolean {
  if (!address) return false;
  // Case-insensitive match for the word "surat"
  const normalized = address.toLowerCase();
  return normalized.includes("surat");
}
