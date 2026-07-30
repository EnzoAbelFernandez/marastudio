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
import { usePathname } from 'next/navigation';

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();

  // Sync Lenis with Next.js scroll restoration on route change
  useEffect(() => {
    if (!lenisRef.current) return;
    
    // We wait a frame for Next.js to apply the native scroll position and GSAP to setup DOM
    requestAnimationFrame(() => {
      if (!lenisRef.current) return;
      
      // If we are on the home page, check if we have a saved scroll position
      if (pathname === '/') {
        const savedScroll = sessionStorage.getItem('mara_home_scroll');
        if (savedScroll) {
          lenisRef.current.scrollTo(parseInt(savedScroll, 10), { immediate: true });
          sessionStorage.removeItem('mara_home_scroll');
          return;
        }
      }

      // Otherwise, sync to whatever native scroll Next.js ended up on
      lenisRef.current.scrollTo(window.scrollY, { immediate: true });
    });
  }, [pathname]);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
      syncTouch: false, // Don't override native mobile scroll
    });

    lenisRef.current = lenis;
    (window as any).lenis = lenis;

    // ── Sync Lenis → GSAP ScrollTrigger ──
    lenis.on('scroll', ScrollTrigger.update);

    // ── Sync GSAP ticker → Lenis RAF ──
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    // Disable lag smoothing only on desktop — on mobile, lag smoothing
    // helps recover from frame drops caused by CPU-heavy canvas rendering
    if (!('ontouchstart' in window)) {
      gsap.ticker.lagSmoothing(0);
    }

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
