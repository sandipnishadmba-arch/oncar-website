"use client";

import { useState } from "react";
import Image from "next/image";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { GALLERY_ITEMS } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface GalleryProps {
  items?: typeof GALLERY_ITEMS;
  title?: string;
  description?: string;
}

export function Gallery({
  items = GALLERY_ITEMS,
  title = "Before & After Gallery",
  description = "See the stunning transformations we've delivered for homeowners across Surat.",
}: GalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeItem = items[activeIndex];

  return (
    <Section id="gallery" background="surface">
      <SectionHeader
        eyebrow="Our Work"
        title={title}
        description={description}
      />

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="grid grid-cols-2 gap-4">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
            <Image
              src={activeItem.before}
              alt={`Before: ${activeItem.title}`}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 50vw, 25vw"
            />
            <span className="absolute left-3 top-3 rounded-full bg-primary/90 px-3 py-1 text-xs font-semibold text-white">
              Before
            </span>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
            <Image
              src={activeItem.after}
              alt={`After: ${activeItem.title}`}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 50vw, 25vw"
            />
            <span className="absolute left-3 top-3 rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-primary">
              After
            </span>
          </div>
        </div>

        <div>
          <h3 className="text-2xl font-bold text-primary">{activeItem.title}</h3>
          <p className="mt-2 text-muted">{activeItem.category}</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {items.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={cn(
                  "relative aspect-video overflow-hidden rounded-xl border-2 transition-all duration-300",
                  activeIndex === index
                    ? "border-secondary shadow-lg"
                    : "border-transparent opacity-70 hover:opacity-100"
                )}
                aria-label={`View ${item.title}`}
                aria-pressed={activeIndex === index}
              >
                <Image
                  src={item.after}
                  alt={item.title}
                  fill
                  className="object-cover"
                  sizes="200px"
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
