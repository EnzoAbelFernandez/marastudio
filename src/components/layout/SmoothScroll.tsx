'use client';

import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import gsap from 'gsap';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Global smooth scrolling component.
 *
 * How it works:
 * 1. Lenis creates a virtual scroll layer that intercepts native scrolling
 * 2. On each frame, Lenis smoothly interpolates toward the target scroll position
 * 3. After each Lenis update, we call ScrollTrigger.update() to sync all
 *    GSAP scroll-driven animations with the virtual scroll position
 *
 * This creates the "native app" feel — buttery smooth scrolling where
 * scroll-triggered animations are perfectly in sync with scroll position.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
      syncTouch: false, // Don't override native mobile scroll
    });

    lenisRef.current = lenis;

    // ── Sync Lenis → GSAP ScrollTrigger ──
    lenis.on('scroll', ScrollTrigger.update);

    // ── Sync GSAP ticker → Lenis RAF ──
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // ── Smooth Anchor Navigation Handler ──
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      if (!href) return;

      const hashIndex = href.indexOf('#');
      if (hashIndex !== -1) {
        const hash = href.slice(hashIndex);
        const path = href.slice(0, hashIndex);

        // Match current page or root/hash link
        const isCurrentPage =
          path === '' ||
          path === '/' ||
          path === window.location.pathname;

        if (isCurrentPage && hash.length > 1) {
          const targetElement = document.querySelector(hash);
          if (targetElement) {
            e.preventDefault();
            lenis.scrollTo(targetElement as HTMLElement, {
              duration: 1.4,
              offset: 0,
            });
          }
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);

    return () => {
      document.removeEventListener('click', handleAnchorClick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return <>{children}</>;
}
