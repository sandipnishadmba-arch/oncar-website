import Link from "next/link";
import { ArrowLeft, Shield, Eye, Lock } from "lucide-react";
import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata({
    title: "Privacy Policy | OnCar Surat",
    description: "Read the Privacy Policy of OnCar. Learn how we handle customer names, location addresses, phone numbers, and booking details for driving lessons in Surat.",
    keywords: ["OnCar privacy policy", "driving classes privacy", "Surat driving instructor privacy"],
    path: "/privacy-policy",
  });
}

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-white min-h-screen pt-32 pb-20 text-left">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-xs font-black text-primary uppercase tracking-widest hover:opacity-80 transition-opacity">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>

        {/* Page Title */}
        <div className="space-y-4 mb-10 border-b border-border pb-8">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-wider">
            Privacy Policy
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-secondary tracking-tight leading-tight">
            Privacy Policy
          </h1>
          <p className="text-xs text-muted font-bold uppercase tracking-wider">
            Last Updated: July 11, 2026
          </p>
        </div>

        {/* Policy Content */}
        <div className="space-y-8 text-sm text-muted leading-relaxed font-medium">
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-secondary">
              <Shield className="h-5 w-5 text-primary shrink-0" />
              <h2 className="text-base font-black uppercase tracking-wider">1. Information We Collect</h2>
            </div>
            <p>
              OnCar collects basic user details required to arrange your doorstep driving sessions in Surat. When you request a booking, we collect your <strong>full name</strong>, <strong>mobile number</strong>, and <strong>doorstep pick-up location/address</strong> in Surat. We do not gather any payment card data, nor do we run background tracking on your usage.
            </p>
          </section>

          <section className="space-y-3">
            <div className="flex items-center gap-2 text-secondary">
              <Eye className="h-5 w-5 text-primary shrink-0" />
              <h2 className="text-base font-black uppercase tracking-wider">2. How We Use Your Data</h2>
            </div>
            <p>
              Your contact information and location address are strictly used to coordinate your driving lessons. Your details are shared only with your assigned background-verified personal driving instructor. We do not sell, rent, or distribute your name, phone number, or address to any third-party marketing companies.
            </p>
          </section>

          <section className="space-y-3">
            <div className="flex items-center gap-2 text-secondary">
              <Lock className="h-5 w-5 text-primary shrink-0" />
              <h2 className="text-base font-black uppercase tracking-wider">3. Data Security & Retention</h2>
            </div>
            <p>
              We maintain booking logs securely on protected databases. If you wish to delete your booking history, customer record, or personal information from our active registers, you can submit a written deletion request to our support email at <strong>info@oncar.in</strong>.
            </p>
          </section>

          <section className="space-y-3 border-t border-border/60 pt-6">
            <h2 className="text-sm font-black text-secondary uppercase tracking-wider">4. Third-Party Integrations</h2>
            <p>
              Our website uses direct WhatsApp redirection links to initiate text-based booking confirmations. Please consult the WhatsApp Privacy Policy to learn more about how they secure your mobile messages and chat parameters.
            </p>
          </section>
        </div>

      </div>
    </div>
  );
}
