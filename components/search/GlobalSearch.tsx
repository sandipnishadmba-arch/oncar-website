"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search as SearchIcon, X, ArrowRight, Sparkles, TrendingUp } from "lucide-react";
import { useGlobalSearch, type SearchService, type SearchCategory, type GroupedResult } from "@/hooks/useGlobalSearch";
import { getIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { getServiceImage } from "@/lib/serviceImages";

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
  settings: {
    phone: string;
    whatsapp_number: string;
    booking_message: string;
    available_time_slots: string[];
    advance_booking_days: string;
  };
}

/** Highlights matching text in a string */
function HighlightText({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <>{text}</>;

  const q = query.trim().toLowerCase();
  const words = q.split(/\s+/).filter(Boolean);
  
  // Build a regex that matches any of the query words
  const escaped = words.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const regex = new RegExp(`(${escaped.join("|")})`, "gi");
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark key={i} className="bg-secondary/25 text-primary rounded-sm px-0.5 font-bold">
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

export function GlobalSearch({ isOpen, onClose, initialQuery, settings }: GlobalSearchProps) {
  const { query, setQuery, results, recommendations, isLoading, loadData, hasData, categories } = useGlobalSearch();
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Load data when search opens
  useEffect(() => {
    if (isOpen) {
      loadData();
      // Focus the input after a short delay for animation
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, loadData]);

  // Set initial query when provided
  useEffect(() => {
    if (isOpen && initialQuery) {
      setQuery(initialQuery);
    }
  }, [isOpen, initialQuery, setQuery]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKey);
    }
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  const handleClose = useCallback(() => {
    onClose();
    // Don't clear query so it persists when re-opening (req #14)
  }, [onClose]);

  const handleServiceClick = (service: SearchService) => {
    router.push(`/?bookPlan=${service.id}#plans`);
    onClose();
  };

  const handleClearQuery = () => {
    setQuery("");
    inputRef.current?.focus();
  };

  if (!isOpen) return null;

  const hasQuery = query.trim().length > 0;
  const hasResults = results.totalCount > 0 || results.matchingCategories.length > 0;

  return (
    <>
      {/* Full-screen overlay */}
      <div className="fixed inset-0 z-[90] flex flex-col bg-white animate-in fade-in duration-150">
        {/* Sticky search header */}
        <div className="sticky top-0 z-10 bg-white border-b border-border shadow-sm safe-top">
          <div className="mx-auto max-w-3xl px-4 py-3">
            <div className="relative flex items-center gap-3">
              <div className="relative flex-1">
                <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted pointer-events-none" />
                <input
                  ref={inputRef}
                  type="text"
                  inputMode="search"
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck={false}
                  placeholder="Search driving plans... (e.g. Trial, Starter, Manual, Automatic)"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full pl-12 pr-10 py-3.5 rounded-2xl border border-border bg-surface text-sm font-medium outline-none focus:border-secondary focus:bg-white focus:ring-2 focus:ring-secondary/15 transition-all duration-200"
                />
                {hasQuery && (
                  <button
                    type="button"
                    onClick={handleClearQuery}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-muted hover:text-primary hover:bg-surface transition-colors"
                    aria-label="Clear search"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="shrink-0 px-3 py-2 text-xs font-bold text-muted hover:text-primary transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>

        {/* Scrollable results area */}
        <div
          ref={resultsRef}
          className="flex-1 overflow-y-auto overscroll-contain pb-safe-bottom"
        >
          <div className="mx-auto max-w-3xl px-4 py-4">
            {/* Loading state */}
            {isLoading && (
              <div className="flex items-center justify-center py-16">
                <div className="h-6 w-6 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
              </div>
            )}

            {/* Empty state - before typing */}
            {!isLoading && !hasQuery && (
              <div className="py-8">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="h-4 w-4 text-secondary" />
                  <span className="text-xs font-bold text-muted uppercase tracking-wider">Popular Searches</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {["Trial Class", "Starter", "Basic", "Popular", "Premium", "Confidence+", "Manual", "Automatic"].map(
                    (term) => (
                      <button
                        key={term}
                        type="button"
                        onClick={() => setQuery(term)}
                        className="px-3 py-1.5 rounded-full bg-surface border border-border text-xs font-bold text-primary hover:border-primary hover:bg-primary/5 transition-all duration-150"
                      >
                        {term}
                      </button>
                    )
                  )}
                </div>
              </div>
            )}

            {/* Results */}
            {!isLoading && hasQuery && hasResults && (
              <div className="space-y-6">
                {/* Matching categories */}
                {results.matchingCategories.length > 0 && (
                  <div>
                    <h3 className="text-[10px] font-bold text-muted uppercase tracking-wider mb-2.5">
                      Categories
                    </h3>
                    <div className="space-y-1">
                      {results.matchingCategories.map((cat) => {
                        const Icon = getIcon(cat.icon);
                        return (
                          <Link
                            key={`cat-${cat.id}`}
                            href="/#plans"
                            onClick={handleClose}
                            className="flex items-center justify-between px-3 py-2.5 rounded-2xl hover:bg-surface transition-colors group"
                          >
                            <div className="flex items-center gap-3">
                              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/5 text-primary group-hover:bg-primary/10 transition-colors">
                                <Icon className="h-4.5 w-4.5" />
                              </div>
                              <div>
                                <span className="text-sm font-bold text-primary leading-tight">
                                  <HighlightText text={cat.name} query={query} />
                                </span>
                                <span className="block text-[10px] text-muted font-medium">
                                  {cat.type === "instant" ? "Instant Booking" : "Get Quotation"} • View All Services
                                </span>
                              </div>
                            </div>
                            <ArrowRight className="h-4 w-4 text-muted group-hover:text-primary transition-colors" />
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Grouped service results */}
                {results.grouped.map((group) => (
                  <div key={`group-${group.category.id}`}>
                    <div className="flex items-center justify-between mb-2.5">
                      <h3 className="text-[10px] font-bold text-muted uppercase tracking-wider">
                        {group.category.name}
                      </h3>
                      <Link
                        href="/#plans"
                        onClick={handleClose}
                        className="text-[10px] font-bold text-secondary hover:text-primary transition-colors"
                      >
                        View All →
                      </Link>
                    </div>
                    <div className="space-y-1">
                      {group.services.map((service) => (
                        <button
                          key={`svc-${service.id}`}
                          type="button"
                          onClick={() => handleServiceClick(service)}
                          className="w-full flex items-center justify-between px-3 py-2.5 rounded-2xl hover:bg-surface text-left transition-colors group"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="relative h-10 w-10 rounded-xl overflow-hidden shrink-0 bg-surface border border-border">
                              <Image
                                src={getServiceImage(service.name)}
                                alt={service.name}
                                fill
                                className="object-cover"
                                sizes="40px"
                              />
                            </div>
                            <div className="min-w-0">
                              <span className="text-xs font-bold text-primary leading-tight block truncate">
                                <HighlightText text={service.name} query={query} />
                              </span>
                              <span className="text-[10px] text-muted line-clamp-1">
                                <HighlightText text={service.description} query={query} />
                              </span>
                            </div>
                          </div>
                          <div className="text-right shrink-0 ml-2 flex flex-col items-end">
                            <div className="flex items-baseline gap-1">
                              <span className="block text-xs font-extrabold text-primary">₹{
                                service.discount_value
                                  ? service.discount_type === "percentage"
                                    ? service.price - Math.round(service.price * service.discount_value / 100)
                                    : service.price - service.discount_value
                                  : service.price
                              }</span>
                              {service.discount_value && (
                                <span className="line-through text-[9px] text-muted/70 font-bold">
                                  ₹{service.price}
                                </span>
                              )}
                            </div>
                            <span className="text-[9px] text-secondary font-bold leading-none mt-0.5">
                              {service.duration}
                            </span>
                            {service.discount_value && (
                              <span className="bg-green-500 text-white font-black text-[7px] px-1 py-0.5 rounded-sm uppercase tracking-wider leading-none mt-1">
                                {service.discount_type === "percentage" ? `${service.discount_value}% OFF` : `₹${service.discount_value} OFF`}
                              </span>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Result count */}
                <p className="text-center text-[10px] text-muted py-2">
                  {results.totalCount} service{results.totalCount !== 1 ? "s" : ""} found
                </p>
              </div>
            )}

            {/* No results - show recommendations */}
            {!isLoading && hasQuery && !hasResults && (
              <div className="py-8">
                <div className="text-center mb-6">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-surface border border-border mb-3">
                    <SearchIcon className="h-5 w-5 text-muted" />
                  </div>
                  <p className="text-sm font-bold text-primary">No services found for &ldquo;{query}&rdquo;</p>
                  <p className="text-xs text-muted mt-1">Try a different search term or browse our popular services below.</p>
                </div>

                {recommendations.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles className="h-4 w-4 text-secondary" />
                      <span className="text-xs font-bold text-muted uppercase tracking-wider">
                        Recommended Services
                      </span>
                    </div>
                    <div className="space-y-1">
                      {recommendations.map((service) => (
                        <button
                          key={`rec-${service.id}`}
                          type="button"
                          onClick={() => handleServiceClick(service)}
                          className="w-full flex items-center justify-between px-3 py-2.5 rounded-2xl hover:bg-surface text-left transition-colors"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="relative h-10 w-10 rounded-xl overflow-hidden shrink-0 bg-surface border border-border">
                              <Image
                                src={getServiceImage(service.name)}
                                alt={service.name}
                                fill
                                className="object-cover"
                                sizes="40px"
                              />
                            </div>
                            <div className="min-w-0">
                              <span className="text-xs font-bold text-primary leading-tight block truncate">
                                {service.name}
                              </span>
                              <span className="text-[10px] text-muted">{service.category_name}</span>
                            </div>
                          </div>
                          <div className="text-right shrink-0 ml-2 flex flex-col items-end">
                            <div className="flex items-baseline gap-1">
                              <span className="block text-xs font-extrabold text-primary">₹{
                                service.discount_value
                                  ? service.discount_type === "percentage"
                                    ? service.price - Math.round(service.price * service.discount_value / 100)
                                    : service.price - service.discount_value
                                  : service.price
                              }</span>
                              {service.discount_value && (
                                <span className="line-through text-[9px] text-muted/70 font-bold">
                                  ₹{service.price}
                                </span>
                              )}
                            </div>
                            <span className="text-[9px] text-secondary font-bold leading-none mt-0.5">{service.duration}</span>
                            {service.discount_value && (
                              <span className="bg-green-500 text-white font-black text-[7px] px-1 py-0.5 rounded-sm uppercase tracking-wider leading-none mt-1">
                                {service.discount_type === "percentage" ? `${service.discount_value}% OFF` : `₹${service.discount_value} OFF`}
                              </span>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
