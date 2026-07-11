import Link from "next/link";
import { ArrowLeft, Scale, ShieldAlert, Award } from "lucide-react";
import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata({
    title: "Terms and Conditions | OnCar Surat",
    description: "Read the Terms of Service of OnCar Surat. Key requirements regarding vehicle ownership, valid learning license, insurance, and doorstep training rules.",
    keywords: ["OnCar terms and conditions", "own car driving terms", "Surat driving instructor rules"],
    path: "/terms",
  });
}

export default function TermsPage() {
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
            Terms of Service
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-secondary tracking-tight leading-tight">
            Terms &amp; Conditions
          </h1>
          <p className="text-xs text-muted font-bold uppercase tracking-wider">
            Last Updated: July 11, 2026
          </p>
        </div>

        {/* Terms Content */}
        <div className="space-y-8 text-sm text-muted leading-relaxed font-medium">
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-secondary">
              <Award className="h-5 w-5 text-primary shrink-0" />
              <h2 className="text-base font-black uppercase tracking-wider">1. Licensing &amp; Legal Compliance</h2>
            </div>
            <p>
              To book a session with OnCar, the student must possess a <strong>valid Learner&apos;s License</strong> or a <strong>permanent Driving License</strong> issued by the Indian Ministry of Road Transport and Highways. The physical copy of the license must be available with the student during all practice hours.
            </p>
          </section>

          <section className="space-y-3">
            <div className="flex items-center gap-2 text-secondary">
              <Scale className="h-5 w-5 text-primary shrink-0" />
              <h2 className="text-base font-black uppercase tracking-wider">2. Vehicle Ownership &amp; Condition</h2>
            </div>
            <p>
              OnCar operates exclusively under an <strong>own-car training model</strong>. The student is responsible for providing a roadworthy, legally registered, and fully insured manual or automatic car. The vehicle must have sufficient fuel for the scheduled practice time.
            </p>
          </section>

          <section className="space-y-3">
            <div className="flex items-center gap-2 text-secondary">
              <ShieldAlert className="h-5 w-5 text-primary shrink-0" />
              <h2 className="text-base font-black uppercase tracking-wider">3. Insurance &amp; Liability</h2>
            </div>
            <p>
              Since lessons are conducted in the customer&apos;s own vehicle, all vehicle physical damage and third-party liabilities fall under the customer&apos;s comprehensive car insurance policy. OnCar and its instructors do not assume liability for collision damages, wear-and-tear, or civil/criminal penalties incurred during lessons.
            </p>
          </section>

          <section className="space-y-3 border-t border-border/60 pt-6">
            <h2 className="text-sm font-black text-secondary uppercase tracking-wider">4. Cancellations &amp; Rescheduling</h2>
            <p>
              We request customers to inform their personal driving instructor at least <strong>4 hours in advance</strong> if they wish to cancel or reschedule a confirmed time slot. Slots cancelled inside 4 hours may be counted against the package hours at the discretion of the service manager.
            </p>
          </section>
        </div>

      </div>
    </div>
  );
}
