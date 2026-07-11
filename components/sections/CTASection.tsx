import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { formatWhatsAppLink } from "@/lib/utils";

interface CTASectionProps {
  title?: string;
  description?: string;
  whatsappMessage?: string;
  whatsappNumber?: string;
}

export function CTASection({
  title = "Ready to get started?",
  description = "Get instant service confirmation or a free site visit from Surat's trusted professionals. Book easily on WhatsApp with upfront pricing.",
  whatsappMessage = "Hi OnCar! I'd like to book a service.",
  whatsappNumber,
}: CTASectionProps) {
  const whatsappLink = formatWhatsAppLink(whatsappMessage, whatsappNumber);

  return (
    <Section background="primary" className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 opacity-10"
        aria-hidden="true"
      >
        <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-secondary blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-secondary blur-3xl" />
      </div>

      <div className="relative">
        <SectionHeader
          title={title}
          description={description}
          light
        />
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button href="/#contact" variant="secondary" size="lg">
            Get Free Quote
          </Button>
          <Button
            variant="whatsapp"
            size="lg"
            href={whatsappLink}
          >
            <MessageCircle className="h-5 w-5" aria-hidden="true" />
            WhatsApp Now
          </Button>
        </div>
      </div>
    </Section>
  );
}
