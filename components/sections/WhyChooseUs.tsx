import { Section } from "@/components/ui/Section";
import { CheckCircle2 } from "lucide-react";

interface WhyChooseUsProps {
  settings: {
    website_name: string;
    about_text: string;
  };
}

export function WhyChooseUs({ settings }: WhyChooseUsProps) {
  const highlights = [
    { title: "Verified Professionals", desc: "Background-checked local workers" },
    { title: "Transparent Pricing", desc: "Upfront quotes with no hidden fees" },
    { title: "WhatsApp Booking", desc: "Instantly schedule & confirm" },
    { title: "Fast Response", desc: "Doorstep service in under 2 hours" },
    { title: "Trusted Workers", desc: "5-star rated Surat experts" },
  ];

  return (
    <Section id="about" className="py-10 bg-white">
      <div className="mx-auto max-w-5xl px-4 text-center">
        <span className="mb-2 inline-block text-xs font-semibold uppercase tracking-widest text-secondary">
          KaamOn Trust
        </span>
        <h2 className="text-2xl font-bold text-primary sm:text-3xl">
          Why Surat Trusts KaamOn
        </h2>
        <p className="mt-2 text-xs text-muted max-w-xl mx-auto">
          {settings.about_text || "We bring professional, background-verified home service workers directly to your doorstep in Surat."}
        </p>

        <div className="mt-8 grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-5 text-left">
          {highlights.map((item) => (
            <div
              key={item.title}
              className="flex items-start gap-2 bg-surface p-3 rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500 shrink-0 mt-0.5" />
              <div className="overflow-hidden">
                <h4 className="text-[11px] font-bold text-primary leading-tight truncate">{item.title}</h4>
                <p className="text-[9px] text-muted mt-0.5 leading-snug truncate">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
