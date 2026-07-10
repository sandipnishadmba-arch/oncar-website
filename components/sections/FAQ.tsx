import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Accordion } from "@/components/ui/Accordion";
import { FAQ_ITEMS } from "@/lib/constants";
import type { FAQItem } from "@/types";

interface FAQProps {
  items?: FAQItem[];
  title?: string;
  description?: string;
  showAllLink?: boolean;
}

export function FAQ({
  items = FAQ_ITEMS,
  title = "Frequently Asked Questions",
  description = "Got questions? We've got answers. Here are the most common queries from our customers.",
  showAllLink = false,
}: FAQProps) {
  return (
    <Section id="faq" background="surface">
      <SectionHeader
        eyebrow="FAQ"
        title={title}
        description={description}
      />
      <div className="mx-auto max-w-3xl space-y-6">
        <Accordion items={items} />
        {showAllLink && (
          <div className="text-center mt-6">
            <Link 
              href="/faq"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-secondary hover:text-secondary/80 bg-primary px-4 py-2 rounded-xl transition-colors shadow-sm"
            >
              View All FAQs
            </Link>
          </div>
        )}
      </div>
    </Section>
  );
}
