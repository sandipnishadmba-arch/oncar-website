import Link from "next/link";
import Image from "next/image";
import { Check, ArrowLeft } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="bg-white min-h-screen pt-32 pb-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb / Back Button */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-xs font-black text-primary uppercase tracking-widest hover:opacity-80 transition-opacity">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>

        {/* Page Header */}
        <div className="space-y-4 mb-12">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-wider">
            Own Car Advantage
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-secondary tracking-tight leading-tight">
            Why Learning in Your Own Car is 2x More Effective?
          </h1>
          <p className="text-sm text-muted leading-relaxed">
            Driving schools usually teach you on a customized manual hatchback that has dual controls (brake and clutch with the instructor). When you transition to your own vehicle, it feels completely different. Here is why practicing in your own car with us builds unbeatable confidence:
          </p>
        </div>

        {/* Content Section */}
        <div className="grid gap-8 md:grid-cols-12 md:items-center">
          
          {/* Left: Text Points */}
          <div className="md:col-span-7 space-y-6">
            {[
              {
                title: "Familiarity with Dimensions & Judgement",
                desc: "Har car ka size aur bonnet structure alag hota hai. Apni car chalane se aapko andaza milega side clearances aur lanes ka.",
              },
              {
                title: "Pedal Sensitivity & Gear Friction",
                desc: "Clutch release point, accelerator punch aur brake bite points vary widely across brands. Apni car par command aana sabse zyada important hai.",
              },
              {
                title: "Zero Transition Anxiety",
                desc: "School car par seekhne ke baad logo ko apni car me pehli baar akele baithne me darr lagta hai. Hamare saath direct own car me seekhein taaki darr 100% khatam ho jaye.",
              },
            ].map((item, idx) => (
              <div key={idx} className="flex gap-4 p-5 bg-surface rounded-2xl border border-border/40 shadow-xs">
                <div className="h-8 w-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-base font-black text-secondary">{item.title}</h4>
                  <p className="text-xs text-muted font-medium mt-1 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Right: Premium Image */}
          <div className="md:col-span-5 relative flex justify-center">
            <div className="relative w-full aspect-square max-w-[320px] rounded-[32px] overflow-hidden shadow-2xl border-4 border-white">
              <Image 
                src="https://images.unsplash.com/photo-1506015391300-4802dc74de2e?w=800&fit=crop"
                alt="Personal driving instructor teaching a learner in their own car in Surat"
                fill
                sizes="(max-width: 768px) 100vw, 320px"
                className="object-cover"
              />
            </div>
          </div>

        </div>

        {/* Brand Story Section */}
        <div className="mt-16 p-8 bg-gradient-to-br from-primary/10 via-primary/5 to-surface rounded-[32px] border border-primary/10 text-center space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest">
            Brand Story
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-secondary tracking-tight">
            Your Car. Your Time. OnCar.
          </h2>
          <p className="max-w-xl mx-auto text-xs sm:text-sm text-muted leading-relaxed font-medium">
            At OnCar, we believe that true driving confidence comes from familiarity and comfort. That is why we broke away from conventional driving schools that teach you on dummy control cars. We meet you at your doorstep, train you in <strong>your own car</strong>, on <strong>your own schedule</strong>. That is the OnCar promise.
          </p>
        </div>

      </div>
    </div>
  );
}
