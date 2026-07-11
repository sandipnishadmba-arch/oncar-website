import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, CheckCircle, Shield, Compass, Navigation } from "lucide-react";
import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata({
    title: "Car Driving Classes in Surat | Personal Driving Instructor",
    description: "Get structured personal car driving classes in Surat. Master steering control, reverse parking, and city traffic driving in your own manual or automatic car.",
    keywords: ["car driving classes Surat", "driving instructor in Surat", "doorstep driving classes Surat", "female driving instructor Surat", "learn car driving Surat"],
    path: "/driving-classes-surat",
  });
}

export default function DrivingClassesSuratPage() {
  const highlights = [
    {
      title: "Surat City Coverage",
      desc: "Our instructors serve Adajan, Vesu, Pal, Piplod, City Light, VIP Road, and selected areas across Surat.",
      icon: Compass
    },
    {
      title: "Steering & Lane Judgment",
      desc: "Get hands-on training to accurately judge lane gaps, manage turns, and steer comfortably in heavy traffic.",
      icon: Navigation
    },
    {
      title: "Safety First Guidance",
      desc: "Practice with custom safety metrics and side clearance drills to drive safely without any anxiety.",
      icon: Shield
    }
  ];

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
            Premium Training in Surat
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-secondary tracking-tight leading-tight">
            Professional Car Driving Classes in Surat
          </h1>
          <p className="text-sm sm:text-base text-muted leading-relaxed max-w-2xl font-medium">
            Learn driving with confidence on Surat&apos;s busiest routes. OnCar connects you with experienced, background-verified personal driving instructors who provide one-on-one doorstep training directly in your own vehicle.
          </p>
        </div>

        {/* Core Layout Grid */}
        <div className="grid gap-12 md:grid-cols-12 md:items-start mb-16">
          <div className="md:col-span-7 space-y-6">
            <h2 className="text-xl font-black text-secondary uppercase tracking-wider">
              Tailored Lessons for Surat Traffic
            </h2>
            <p className="text-sm text-muted leading-relaxed">
              Navigating Surat&apos;s local lanes can be intimidating for beginners. Our car driving training classes are designed to build your skills progressively. Unlike standard driving schools that use dual-control hatchbacks, we train you in your own manual or automatic car. This ensures you master the exact clutch sensitivity, gear placement, and dimensions of the vehicle you will actually drive.
            </p>
            <p className="text-sm text-muted leading-relaxed">
              We focus heavily on the areas where learners struggle most: tight reverse parking, flyover transitions, U-turns, parallel parking, and bumper-to-bumper city traffic. Whether you prefer a male or female driving instructor in Surat, we align classes with your schedule, offering morning, evening, and weekend slots.
            </p>

            <div className="space-y-3 pt-2">
              {highlights.map((h, idx) => {
                const Icon = h.icon;
                return (
                  <div key={idx} className="flex gap-4 p-5 bg-surface rounded-2xl border border-border/40 shadow-xs">
                    <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-black text-secondary">{h.title}</h3>
                      <p className="text-xs text-muted font-medium mt-1 leading-relaxed">{h.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sidebar visual card */}
          <div className="md:col-span-5 space-y-6">
            <div className="relative aspect-[4/3] rounded-[32px] overflow-hidden shadow-2xl border-4 border-white bg-surface">
              <Image 
                src="https://images.unsplash.com/photo-1506015391300-4802dc74de2e?w=600&fit=crop"
                alt="Car driving classes in Surat by OnCar certified instructor"
                fill
                sizes="(max-width: 768px) 100vw, 320px"
                className="object-cover"
              />
            </div>

            <div className="p-6 bg-gradient-to-br from-primary/10 via-primary/5 to-surface border border-primary/10 rounded-3xl space-y-4">
              <h3 className="text-base font-black text-secondary">Ready to start?</h3>
              <p className="text-xs text-muted font-medium leading-relaxed">
                Book a 1-Hour Trial Class starting from only <strong>₹399</strong>. Practice in your own car with a certified driving coach.
              </p>
              <Link 
                href="/#plans" 
                className="block text-center w-full bg-primary hover:bg-primary/95 text-white font-bold text-xs py-3.5 rounded-full transition-all shadow-md shadow-primary/15"
              >
                View Plans & Book
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
