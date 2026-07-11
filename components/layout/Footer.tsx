import Link from "next/link";
import { Car, Mail, MapPin, Phone } from "lucide-react";
import {
  FOOTER_QUICK_LINKS,
  SITE_CONFIG,
} from "@/lib/constants";
import { Button } from "@/components/ui/Button";
import { formatWhatsAppLink } from "@/lib/utils";

interface FooterProps {
  settings?: {
    website_name: string;
    tagline: string;
    phone: string;
    whatsapp_number: string;
    email: string;
    address: string;
    google_maps_url: string;
  };
}

export function Footer({ settings }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const websiteName = settings?.website_name || SITE_CONFIG.name;
  const tagline = settings?.tagline || SITE_CONFIG.tagline;
  const phone = settings?.phone || SITE_CONFIG.phone;
  const whatsappNumber = settings?.whatsapp_number || SITE_CONFIG.whatsapp;
  const email = settings?.email || SITE_CONFIG.email;
  const address = settings?.address || SITE_CONFIG.address;
  const googleMapsUrl = settings?.google_maps_url || SITE_CONFIG.googleMapsUrl;

  const defaultMessage = "Hi OnCar, I'd like to ask a question or book a driving training session in Surat.";
  const whatsappLink = formatWhatsAppLink(defaultMessage, whatsappNumber);

  return (
    <footer id="contact" className="bg-[#0B0A0F] text-white border-t border-white/5">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-4 text-left">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-md shadow-primary/20">
                <Car className="h-5 w-5" aria-hidden="true" />
              </div>
              <span className="text-xl font-black tracking-tight">
                On<span className="text-primary">Car</span>
              </span>
            </Link>
            <div>
              <h4 className="text-xs font-black text-gray-300">OnCar – Personal Driving Instructor in Surat</h4>
              <p className="text-xs leading-relaxed text-gray-400 mt-1">
                Learn driving in your own car with flexible timings and doorstep instructor support.
              </p>
            </div>
            <div className="mt-2">
              <Button
                variant="whatsapp"
                size="sm"
                href={whatsappLink}
              >
                Book on WhatsApp
              </Button>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-xs font-black uppercase tracking-wider text-primary">
              Our Core Plans
            </h3>
            <ul className="space-y-3 text-left">
              <li>
                <Link href="/#plans" className="text-sm text-gray-400 transition-colors hover:text-white">
                  Trial Class (₹399)
                </Link>
              </li>
              <li>
                <Link href="/#plans" className="text-sm text-gray-400 transition-colors hover:text-white">
                  Starter Plan (₹1,299)
                </Link>
              </li>
              <li>
                <Link href="/#plans" className="text-sm text-gray-400 transition-colors hover:text-white">
                  Basic Plan (₹1,999)
                </Link>
              </li>
              <li>
                <Link href="/#plans" className="text-sm text-gray-400 transition-colors hover:text-white">
                  Popular Plan (₹3,999)
                </Link>
              </li>
              <li>
                <Link href="/#plans" className="text-sm text-gray-400 transition-colors hover:text-white">
                  Confidence+ (₹7,499)
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-xs font-black uppercase tracking-wider text-primary">
              Quick Links
            </h3>
            <ul className="space-y-3 text-left">
              {FOOTER_QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-xs font-black uppercase tracking-wider text-primary">
              Contact Us
            </h3>
            <ul className="space-y-4 text-left">
              <li>
                <a
                  href={formatWhatsAppLink("Hi OnCar, I want to book a driving session.", whatsappNumber)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 text-sm text-gray-400 transition-colors hover:text-white"
                >
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>WhatsApp: +91 9213466544</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${email}`}
                  className="flex items-start gap-3 text-sm text-gray-400 transition-colors hover:text-white"
                >
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>{email}</span>
                </a>
              </li>
              <li>
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 text-sm text-gray-400 transition-colors hover:text-white"
                >
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>Surat, Gujarat</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 md:flex-row">
          <div className="flex flex-col items-center md:items-start gap-2">
            <p className="text-xs text-gray-500">
              &copy; {currentYear} {websiteName}. All rights reserved.
            </p>
            <div className="flex gap-4">
              <Link href="/privacy-policy" className="text-xs text-gray-500 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-xs text-gray-500 hover:text-white transition-colors">
                Terms and Conditions
              </Link>
            </div>
          </div>
          <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">
            Surat City Special Driving Service
          </p>
        </div>
      </div>
    </footer>
  );
}
