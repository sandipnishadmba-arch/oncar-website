import Image from "next/image";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { formatWhatsAppLink } from "@/lib/utils";

interface HeroProps {
  settings: {
    tagline: string;
    hero_title: string;
    hero_subtitle: string;
    hero_image: string;
    whatsapp_number: string;
    booking_message: string;
    phone: string;
  };
}

export function Hero({ settings }: HeroProps) {
  const whatsappMsg = "Hi OnCar! I would like to book a service.";
  const whatsappLink = formatWhatsAppLink(whatsappMsg, settings.whatsapp_number);

  const shortcuts = [
    { name: "Electrician", href: "/#instant-services" },
    { name: "Plumber", href: "/#instant-services" },
    { name: "AC Service", href: "/#instant-services" },
    { name: "Carpenter", href: "/#instant-services" },
    { name: "Beauty", href: "/#instant-services" },
  ];

  return (
    <section
      id="home"
      className="relative min-h-[50vh] flex items-center bg-primary pt-24 pb-10"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:gap-12 lg:px-8">
        <div className="animate-slide-up">
          <span className="mb-2.5 inline-block rounded-full bg-secondary/15 px-3 py-1 text-[11px] font-bold text-secondary">
            Serving Only Surat City
          </span>
          <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
            {settings.hero_title}
          </h1>
          <p className="mt-3.5 max-w-lg text-sm leading-relaxed text-white/70">
            {settings.hero_subtitle}
          </p>
          
          {/* Category Shortcuts */}
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <span className="text-xs text-white/50 mr-1">Shortcuts:</span>
            {shortcuts.map((sc) => (
              <a
                key={sc.name}
                href={sc.href}
                className="text-[11px] bg-white/10 hover:bg-white/20 text-white font-semibold px-2.5 py-1 rounded-full transition-all duration-200"
              >
                {sc.name}
              </a>
            ))}
          </div>

          <div className="mt-7 flex flex-wrap gap-3">
            <Button href="/#instant-services" variant="secondary" size="md">
              Book Instant Services
            </Button>
            <Button 
              variant="whatsapp" 
              size="md"
              href={whatsappLink}
            >
              <MessageCircle className="h-4.5 w-4.5" aria-hidden="true" />
              WhatsApp Now
            </Button>
          </div>
        </div>

        <div className="relative animate-fade-in hidden lg:block">
          <div className="relative aspect-[16/10] overflow-hidden rounded-2xl shadow-xl">
            <Image
              src={settings.hero_image || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&h=700&fit=crop"}
              alt="OnCar worker on demand in Surat"
              fill
              priority
              className="object-cover"
              sizes="50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}
