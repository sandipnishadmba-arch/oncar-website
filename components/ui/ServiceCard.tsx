import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { getIcon } from "@/lib/icons";
import { getServiceImage } from "@/lib/serviceImages";
import type { Service } from "@/types";

interface ServiceCardProps {
  service: Service;
}

export function ServiceCard({ service }: ServiceCardProps) {
  const Icon = getIcon(service.icon);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={getServiceImage(service.title, service.image)}
          alt={`${service.title} services in Surat`}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent" />
        <div className="absolute bottom-4 left-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/95 shadow-lg">
          <Icon className="h-6 w-6 text-primary" aria-hidden="true" />
        </div>
      </div>
      <div className="flex flex-1 flex-col p-6 md:p-8">
        <h3 className="text-xl font-bold text-primary">{service.title}</h3>
        <p className="mt-3 flex-1 text-muted leading-relaxed">{service.description}</p>
        <Link
          href={service.href}
          className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-secondary"
        >
          Learn More
          <ArrowRight
            className="h-4 w-4 transition-transform group-hover:translate-x-1"
            aria-hidden="true"
          />
        </Link>
      </div>
    </article>
  );
}
