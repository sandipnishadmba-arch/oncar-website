"use client";

import Link from "next/link";
import { Car, Search as SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { NAV_LINKS, SITE_CONFIG } from "@/lib/constants";
import { cn, formatWhatsAppLink } from "@/lib/utils";
import { useScrolled } from "@/hooks/useScrollSpy";
import { useSearchOverlay } from "@/components/search/GlobalSearchProvider";

interface NavbarProps {
  settings?: {
    website_name: string;
    tagline: string;
  };
}

export function Navbar({ settings }: NavbarProps) {
  const scrolled = useScrolled(20);
  const { openSearch } = useSearchOverlay();

  const websiteName = settings?.website_name || SITE_CONFIG.name;
  const tagline = settings?.tagline || SITE_CONFIG.tagline;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-white/95 shadow-md backdrop-blur-md border-b border-border/40"
          : "bg-white/80 backdrop-blur-sm"
      )}
    >
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8"
        aria-label="Main navigation"
      >
        <Link
          href="/"
          className="flex items-center gap-2.5 transition-all hover:opacity-90"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-md shadow-primary/20">
            <Car className="h-5 w-5" aria-hidden="true" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black leading-tight text-secondary tracking-tight">
              On<span className="text-primary">Car</span>
            </span>
            <span className="hidden text-[10px] text-muted font-bold tracking-wide sm:block">
              {tagline}
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-bold text-muted transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden items-center gap-4 lg:flex">
          <button
            type="button"
            onClick={() => openSearch()}
            className="inline-flex items-center justify-center rounded-xl p-2 text-muted hover:text-primary hover:bg-surface transition-colors shrink-0"
            aria-label="Search driving plans"
          >
            <SearchIcon className="h-5 w-5" />
          </button>
          <Button href="/?bookPlan=1#plans" variant="primary" size="sm">
            Book Trial
          </Button>
        </div>

        {/* Mobile Header CTA */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            type="button"
            onClick={() => openSearch()}
            className="inline-flex items-center justify-center rounded-xl p-2 text-primary hover:bg-surface transition-colors shrink-0"
            aria-label="Search driving plans"
          >
            <SearchIcon className="h-5 w-5" />
          </button>
          <Button href="/?bookPlan=1#plans" variant="primary" size="sm" className="px-4 py-1.5 text-xs">
            Book Trial
          </Button>
        </div>
      </nav>
    </header>
  );
}
