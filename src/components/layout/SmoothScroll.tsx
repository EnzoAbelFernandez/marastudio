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

    return () => {
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return <>{children}</>;
}
