import Link from "next/link";
import { ArrowLeft, Phone, Mail, MapPin, MessageCircle, Clock } from "lucide-react";
import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata({
    title: "Contact OnCar | Book Personal Driving Instructor Surat",
    description: "Get in touch with OnCar Surat. Book a personal doorstep driving instructor, confirm service areas, or request automatic/manual car training timings.",
    keywords: ["Contact OnCar", "driving instructor Surat contact", "book driving class Surat", "OnCar Surat phone number"],
    path: "/contact",
  });
}

export default function ContactPage() {
  const whatsappNumber = "+919213466544";
  const email = "info@oncar.in";
  const address = "Surat City, Gujarat, India";
  
  const whatsappMessage = "Hi OnCar, I'd like to ask a question or book a driving training session in Surat.";
  const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="bg-white min-h-screen pt-32 pb-20 text-left">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-xs font-black text-primary uppercase tracking-widest hover:opacity-80 transition-opacity">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>

        {/* Page Title */}
        <div className="space-y-4 mb-12">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-wider">
            Get In Touch
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-secondary tracking-tight leading-tight">
            Contact OnCar Surat
          </h1>
          <p className="text-sm sm:text-base text-muted leading-relaxed max-w-2xl font-medium">
            Have questions about manual vs. automatic training, pricing plans, or instructor availability in your area of Surat? We are happy to help. Connect with us via WhatsApp, phone, or email.
          </p>
        </div>

        {/* Contact Page Grid */}
        <div className="grid gap-12 md:grid-cols-12 md:items-start">
          {/* Left Side: Contact Information cards */}
          <div className="md:col-span-6 space-y-6">
            <div className="p-6 rounded-2xl bg-surface border border-border/40 shadow-xs space-y-4 text-left">
              <h2 className="text-lg font-black text-secondary uppercase tracking-wider">Contact Information</h2>
              
              <div className="space-y-4 pt-2">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3.5 group"
                >
                  <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-all">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-muted uppercase block">WhatsApp Support</span>
                    <span className="text-sm font-black text-secondary group-hover:text-primary transition-colors">{whatsappNumber}</span>
                  </div>
                </a>

                <a
                  href={`mailto:${email}`}
                  className="flex items-start gap-3.5 group"
                >
                  <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-all">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-muted uppercase block">Email Address</span>
                    <span className="text-sm font-black text-secondary group-hover:text-primary transition-colors">{email}</span>
                  </div>
                </a>

                <div className="flex items-start gap-3.5">
                  <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-muted uppercase block">Service Area</span>
                    <span className="text-sm font-black text-secondary">{address}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-surface border border-border/40 shadow-xs space-y-3 flex items-start gap-3.5 text-left">
              <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-secondary">Working Hours</h3>
                <p className="text-xs text-muted font-medium mt-1 leading-relaxed">
                  Monday to Sunday: <strong>07:00 AM – 10:00 PM</strong><br />
                  Our instructors operate in flexible morning, evening, and weekend slots.
                </p>
              </div>
            </div>
          </div>

          {/* Right Side: Visual booking card */}
          <div className="md:col-span-6">
            <div className="p-8 bg-gradient-to-br from-primary/10 via-primary/5 to-surface border border-primary/10 rounded-[32px] space-y-6 text-center">
              <div className="h-12 w-12 bg-primary/15 text-primary rounded-full flex items-center justify-center mx-auto shadow-md">
                <MessageCircle className="h-6 w-6" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-black text-secondary">Book Instantly on WhatsApp</h3>
                <p className="text-xs sm:text-sm text-muted leading-relaxed font-medium">
                  Skip the emails and forms. Click the button below to text our booking assistant. Get your trial session scheduled at your preferred doorstep location in Surat.
                </p>
              </div>
              
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 rounded-full font-bold bg-[#25D366] text-white hover:bg-[#20BD5A] shadow-lg shadow-[#25D366]/25 py-4 text-sm transition-all duration-300 active:scale-[0.98]"
              >
                <MessageCircle className="h-5 w-5" />
                Book Trial Class (₹399)
              </a>
              
              <p className="text-[10px] text-muted font-semibold">
                No advance payment required. Pay your instructor directly during the visit.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
