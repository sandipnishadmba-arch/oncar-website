"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { GlobalSearch } from "@/components/search/GlobalSearch";

interface SearchContextValue {
  openSearch: (initialQuery?: string) => void;
  closeSearch: () => void;
  isSearchOpen: boolean;
}

const SearchContext = createContext<SearchContextValue>({
  openSearch: () => {},
  closeSearch: () => {},
  isSearchOpen: false,
});

export function useSearchOverlay() {
  return useContext(SearchContext);
}

interface GlobalSearchProviderProps {
  children: ReactNode;
  settings: {
    phone: string;
    whatsapp_number: string;
    booking_message: string;
    available_time_slots: string[];
    advance_booking_days: string;
  };
}

export function GlobalSearchProvider({ children, settings }: GlobalSearchProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [initialQuery, setInitialQuery] = useState<string | undefined>();

  const openSearch = useCallback((query?: string) => {
    setInitialQuery(query);
    setIsOpen(true);
  }, []);

  const closeSearch = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <SearchContext.Provider value={{ openSearch, closeSearch, isSearchOpen: isOpen }}>
      {children}
      <GlobalSearch
        isOpen={isOpen}
        onClose={closeSearch}
        initialQuery={initialQuery}
        settings={settings}
      />
    </SearchContext.Provider>
  );
}
