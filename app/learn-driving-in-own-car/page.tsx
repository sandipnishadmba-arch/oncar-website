import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Check, Car, UserCheck, ShieldCheck } from "lucide-react";
import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata({
    title: "Learn Driving in Your Own Car | OnCar Surat",
    description: "Learn driving in your own manual or automatic car in Surat. Avoid dual control school cars and build real-world confidence on your own vehicle.",
    keywords: ["learn driving in own car", "own car driving training Surat", "personal driving instructor Surat", "car driving training Surat"],
    path: "/learn-driving-in-own-car",
  });
}

export default function LearnDrivingInOwnCarPage() {
  const benefits = [
    {
      title: "Clutch & Gear Bites",
      desc: "Every car has a different clutch release point and gear friction. Practicing on your own vehicle prepares you perfectly.",
      icon: Car
    },
    {
      title: "Dimension Familiarity",
      desc: "Bonnet length and side-mirror alignment vary. Familiarity with your own car helps make accurate lane judgments.",
      icon: ShieldCheck
    },
    {
      title: "Zero Transition Anxiety",
      desc: "Avoid the post-school anxiety of transition from a dual-controlled school hatchback to your daily vehicle.",
      icon: UserCheck
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
            Own Car Training
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-secondary tracking-tight leading-tight">
            Why You Should Learn Driving in Your Own Car
          </h1>
          <p className="text-sm sm:text-base text-muted leading-relaxed max-w-2xl font-medium">
            Traditional driving schools train you on dual-controlled cars, where the instructor holds the master pedals. At OnCar, we do things differently. We provide premium door-step coaching in your own car to ensure 100% real-world road confidence.
          </p>
        </div>

        {/* Core Layout Grid */}
        <div className="grid gap-12 md:grid-cols-12 md:items-start mb-16">
          <div className="md:col-span-7 space-y-6">
            <h2 className="text-xl font-black text-secondary uppercase tracking-wider">
              The Dual-Control Illusion
            </h2>
            <p className="text-sm text-muted leading-relaxed">
              When you practice in a school car, the instructor handles critical brakes. This creates a false sense of security. The moment you sit in your own vehicle without dual controls, driving anxiety returns. By training directly in your own manual or automatic car from day one, you develop true steering control and spatial awareness.
            </p>
            <p className="text-sm text-muted leading-relaxed">
              Your personal driving coach sits right beside you, guiding you on mirrors, side clearance, throttle modulation, and bumper-to-bumper traffic judgment on the exact routes you will travel daily in Surat.
            </p>

            <div className="space-y-3 pt-2">
              {benefits.map((b, idx) => {
                const Icon = b.icon;
                return (
                  <div key={idx} className="flex gap-4 p-5 bg-surface rounded-2xl border border-border/40 shadow-xs">
                    <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-black text-secondary">{b.title}</h3>
                      <p className="text-xs text-muted font-medium mt-1 leading-relaxed">{b.desc}</p>
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
                src="https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600&fit=crop"
                alt="Learn driving in own car in Surat with doorstep instructor guidance"
                fill
                sizes="(max-width: 768px) 100vw, 320px"
                className="object-cover"
              />
            </div>

            <div className="p-6 bg-gradient-to-br from-primary/10 via-primary/5 to-surface border border-primary/10 rounded-3xl space-y-4">
              <h3 className="text-base font-black text-secondary">Apni Car. Apna Confidence.</h3>
              <p className="text-xs text-muted font-medium leading-relaxed">
                Book a Trial Class today for only <strong>₹399</strong>. See how learning in your own car doubles the efficiency of your training.
              </p>
              <Link 
                href="/#plans" 
                className="block text-center w-full bg-primary hover:bg-primary/95 text-white font-bold text-xs py-3.5 rounded-full transition-all shadow-md shadow-primary/15"
              >
                Book Trial Class
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
