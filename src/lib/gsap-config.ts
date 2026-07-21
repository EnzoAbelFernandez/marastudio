'use client';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// ─────────────────────────────────────────────
// GSAP Plugin Registration
// ─────────────────────────────────────────────
// Register once at module level — safe for SSR since
// we gate on `typeof window` in the component that imports this.

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/** GSAP defaults for consistent animation feel */
gsap.defaults({
  ease: 'expo.out',
  duration: 0.8,
});

/** ScrollTrigger defaults */
ScrollTrigger.defaults({
  markers: false,
});

export { gsap, ScrollTrigger };
