'use client';

import { useState, useEffect } from 'react';

/**
 * SSR-safe hook that returns whether a CSS media query matches.
 * Returns false on the server to avoid hydration mismatches.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(query);
    // Use requestAnimationFrame to avoid synchronous setState inside effect
    const initialSync = requestAnimationFrame(() => setMatches(mql.matches));

    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mql.addEventListener('change', handler);
    return () => {
      cancelAnimationFrame(initialSync);
      mql.removeEventListener('change', handler);
    };
  }, [query]);

  return matches;
}
