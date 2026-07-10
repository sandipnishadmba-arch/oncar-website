import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { BenefitCard } from "@/components/ui/IconCard";
import { Gallery } from "@/components/sections/Gallery";
import { FAQ } from "@/components/sections/FAQ";
import { CTASection } from "@/components/sections/CTASection";
import type { ServicePageData } from "@/types";

interface ServicePageLayoutProps {
  data: ServicePageData;
}

export function ServicePageLayout({ data }: ServicePageLayoutProps) {
  return (
    <>
      <section className="relative overflow-hidden bg-primary pt-28 pb-16 md:pt-32 md:pb-20">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <Link
              href="/#services"
              className="mb-6 inline-flex items-center gap-2 text-sm text-white/70 transition-colors hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Services
            </Link>
            <h1 className="text-4xl font-bold leading-tight text-white sm:text-5xl">
              {data.headline}
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-white/80">
              {data.subheadline}
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Button href="/#contact" variant="secondary" size="lg">
                Get Free Quote
              </Button>
              <Button
                variant="whatsapp"
                size="lg"
                whatsappMessage={`Hi! I'd like a free quote for ${data.title} services in Surat.`}
              >
                <MessageCircle className="h-5 w-5" />
                WhatsApp Now
              </Button>
            </div>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-2xl">
            <Image
              src={data.heroImage}
              alt={`${data.title} services in Surat, Gujarat`}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-widest text-secondary">
              Benefits
            </span>
            <h2 className="text-3xl font-bold text-primary sm:text-4xl">
              Why Choose Our {data.title} Service
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {data.benefits.map((benefit) => (
              <BenefitCard key={benefit.title} benefit={benefit} />
            ))}
          </div>
        </div>
      </section>

      {data.gallery.length > 0 && (
        <Gallery
          items={data.gallery}
          title={`${data.title} Gallery`}
          description={`Browse our recent ${data.title.toLowerCase()} projects in Surat.`}
        />
      )}

      <FAQ
        items={data.faq}
        title={`${data.title} FAQ`}
        description={`Common questions about our ${data.title.toLowerCase()} services in Surat.`}
      />

      <CTASection
        title={`Ready for Professional ${data.title}?`}
        whatsappMessage={`Hi! I'd like to book ${data.title} services in Surat.`}
      />
    </>
  );
}
