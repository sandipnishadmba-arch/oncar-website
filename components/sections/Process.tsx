import { Section } from "@/components/ui/Section";
import { Search, ClipboardList, MessageSquare } from "lucide-react";

export function Process() {
  const steps = [
    {
      num: "①",
      title: "Select Service",
      desc: "Tap category and service instantly.",
      icon: Search,
    },
    {
      num: "②",
      title: "Fill Details",
      desc: "Enter address, area & time slot.",
      icon: ClipboardList,
    },
    {
      num: "③",
      title: "Confirm on WhatsApp",
      desc: "Confirm details over WhatsApp chat.",
      icon: MessageSquare,
    },
  ];

  return (
    <Section id="process" className="py-10 bg-surface">
      <div className="mx-auto max-w-4xl px-4 text-center">
        <span className="mb-2 inline-block text-xs font-semibold uppercase tracking-widest text-secondary">
          How It Works
        </span>
        <h2 className="text-2xl font-bold text-primary sm:text-3xl">
          Book in 3 Simple Steps
        </h2>
        <p className="mt-2 text-xs text-muted max-w-md mx-auto">
          Our streamlined booking process takes less than 30 seconds.
        </p>

        <div className="mt-8 grid gap-4 grid-cols-1 md:grid-cols-3">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.title}
                className="relative flex items-center gap-3 bg-white p-4 rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-secondary">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="text-left overflow-hidden">
                  <h3 className="text-sm font-bold text-primary flex items-center gap-1.5">
                    <span className="text-secondary font-black">{step.num}</span> {step.title}
                  </h3>
                  <p className="mt-0.5 text-xs text-muted leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
