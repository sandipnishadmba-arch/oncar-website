"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";

export interface SearchCategory {
  id: number;
  name: string;
  slug: string;
  image: string;
  icon: string;
  type: string;
}

export interface SearchService {
  id: number;
  category_id: number;
  category_name: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  image: string;
  is_active: number;
  is_featured: number;
  is_popular: number;
  discount_type?: string | null;
  discount_value?: number | null;
}

export interface GroupedResult {
  category: SearchCategory;
  services: SearchService[];
}

interface SearchData {
  services: SearchService[];
  categories: SearchCategory[];
}

function getEditDistance(a: string, b: string): number {
  const matrix: number[][] = [];
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

function isPrefixMatchWithTypos(qw: string, tw: string): boolean {
  if (tw.startsWith(qw)) return true;
  if (qw.length <= 2) return false; // Too short for typos

  // Check edit distance against the prefix of tw of the same length as qw
  const prefixOfTw = tw.substring(0, qw.length);
  const distance = getEditDistance(qw, prefixOfTw);
  const allowedTypos = qw.length <= 4 ? 1 : 2;
  return distance <= allowedTypos;
}

/**
 * Fuzzy-ish matching: checks if every word in the query matches or is
 * typo-tolerantly close to a prefix of any word in the target string.
 */
function fuzzyMatch(query: string, target: string): boolean {
  const q = query.toLowerCase().trim();
  const t = target.toLowerCase().trim();
  if (!q) return false;

  // First try simple includes (handles most cases fastest)
  if (t.includes(q)) return true;

  // Try matching each word of the query as a prefix of any word in target
  const queryWords = q.split(/\s+/).filter(Boolean);
  const targetWords = t.split(/[\s,&-/]+/); // split by spaces or common punctuation
  
  return queryWords.every((qw) =>
    targetWords.some((tw) => isPrefixMatchWithTypos(qw, tw))
  );
}

/**
 * Calculates a relevance score for ranking results.
 * Higher score = better match.
 */
function relevanceScore(query: string, service: SearchService): number {
  const q = query.toLowerCase();
  const name = service.name.toLowerCase();
  const desc = service.description.toLowerCase();
  const cat = service.category_name.toLowerCase();

  let score = 0;

  // Exact name match
  if (name === q) score += 100;
  // Name starts with query
  else if (name.startsWith(q)) score += 80;
  // Name contains query
  else if (name.includes(q)) score += 60;
  // Category name matches
  if (cat.includes(q)) score += 40;
  // Description contains query
  if (desc.includes(q)) score += 20;
  // Word prefix matching
  const queryWords = q.split(/\s+/).filter(Boolean);
  const nameWords = name.split(/\s+/);
  const prefixMatches = queryWords.filter((qw) =>
    nameWords.some((nw) => nw.startsWith(qw))
  ).length;
  score += prefixMatches * 15;

  // Boost popular/featured services
  if (service.is_popular) score += 5;
  if (service.is_featured) score += 3;

  return score;
}

export function useGlobalSearch() {
  const [data, setData] = useState<SearchData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState("");
  const fetchedRef = useRef(false);

  // Fetch all search data on first use (cached by browser + API)
  const loadData = useCallback(async () => {
    if (fetchedRef.current || data) return;
    fetchedRef.current = true;
    setIsLoading(true);
    try {
      const res = await fetch("/api/search");
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error("Failed to load search data:", err);
      fetchedRef.current = false; // allow retry
    } finally {
      setIsLoading(false);
    }
  }, [data]);

  // Compute results based on query
  const results = useMemo<{
    grouped: GroupedResult[];
    totalCount: number;
    matchingCategories: SearchCategory[];
  }>(() => {
    if (!data || !query.trim()) {
      return { grouped: [], totalCount: 0, matchingCategories: [] };
    }

    const q = query.trim();

    // Filter active services that match the query
    const matchedServices = data.services
      .filter((s) => {
        if (s.is_active !== 1) return false;
        return (
          fuzzyMatch(q, s.name) ||
          fuzzyMatch(q, s.description) ||
          fuzzyMatch(q, s.category_name)
        );
      })
      .sort((a, b) => relevanceScore(q, b) - relevanceScore(q, a));

    // Group by category
    const groupMap = new Map<number, SearchService[]>();
    for (const s of matchedServices) {
      const existing = groupMap.get(s.category_id) || [];
      existing.push(s);
      groupMap.set(s.category_id, existing);
    }

    const grouped: GroupedResult[] = [];
    for (const [catId, services] of groupMap) {
      const category = data.categories.find((c) => c.id === catId);
      if (category) {
        grouped.push({ category, services });
      }
    }

    // Sort groups: groups with higher max relevance first
    grouped.sort((a, b) => {
      const aMax = Math.max(...a.services.map((s) => relevanceScore(q, s)));
      const bMax = Math.max(...b.services.map((s) => relevanceScore(q, s)));
      return bMax - aMax;
    });

    // Matching categories
    const matchingCategories = data.categories.filter((c) =>
      fuzzyMatch(q, c.name)
    );

    return {
      grouped,
      totalCount: matchedServices.length,
      matchingCategories,
    };
  }, [data, query]);

  // Get recommended/popular services when no results found
  const recommendations = useMemo<SearchService[]>(() => {
    if (!data || results.totalCount > 0 || !query.trim()) return [];
    return data.services
      .filter((s) => s.is_active === 1 && (s.is_popular === 1 || s.is_featured === 1))
      .slice(0, 6);
  }, [data, results.totalCount, query]);

  return {
    query,
    setQuery,
    results,
    recommendations,
    isLoading,
    loadData,
    hasData: !!data,
    categories: data?.categories || [],
  };
}
