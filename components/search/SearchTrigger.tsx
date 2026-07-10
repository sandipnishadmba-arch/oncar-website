"use client";

import { Search as SearchIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchTriggerProps {
  onClick: () => void;
  placeholder?: string;
  className?: string;
  /** Compact variant for category pages */
  compact?: boolean;
}

export function SearchTrigger({
  onClick,
  placeholder = "Search all services...",
  className,
  compact = false,
}: SearchTriggerProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-2 text-left transition-all duration-200",
        compact
          ? "pl-10 pr-3 py-2 rounded-xl border border-border bg-surface text-xs font-semibold text-muted hover:border-secondary hover:bg-white"
          : "pl-12 pr-4 py-3 rounded-2xl border border-border shadow-sm bg-surface text-sm text-muted hover:border-secondary hover:bg-white hover:ring-2 hover:ring-secondary/15",
        className
      )}
    >
      <SearchIcon
        className={cn(
          "absolute text-muted pointer-events-none",
          compact
            ? "left-3 h-4.5 w-4.5"
            : "left-4 h-5 w-5"
        )}
      />
      <span className="truncate">{placeholder}</span>
    </button>
  );
}
