'use client';

import { useRef, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import gsap from 'gsap';
import { SplitText, type SplitTextRef } from '@/components/ui/SplitText';
import { MagneticButton } from '@/components/ui/MagneticButton';
import styles from './Hero.module.css';

// Dynamic import for the WebGL scene — no SSR (Canvas requires DOM)
const Scene = dynamic(
  () => import('@/components/canvas/Scene').then((mod) => ({ default: mod.Scene })),
  { ssr: false }
);

/**
 * Extracts the inner animatable span from a SplitText char element.
 * Each char is structured as: <span.char><span.charInner>X</span></span>
 * We animate the inner span (translate Y from below the overflow clip).
 */
function getInnerElements(chars: HTMLSpanElement[]): HTMLElement[] {
  return chars
    .map((c) => c.firstElementChild as HTMLElement)
    .filter(Boolean);
}

/**
 * Hero Section — Full viewport opening with:
 * 1. Interactive WebGL particle field (background)
 * 2. Massive typography with character-level reveal animation
 * 3. Staggered entrance timeline orchestrating all elements
 * 4. Scroll indicator at bottom
 */
export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<SplitTextRef>(null);
  const subtitleRef = useRef<SplitTextRef>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isReady || !containerRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: 'expo.out' },
        delay: 0.2,
      });

      // ── Phase 1: Overlay fade ──
      if (overlayRef.current) {
        tl.to(overlayRef.current, {
          opacity: 0,
          duration: 1.2,
          ease: 'power2.inOut',
        }, 0);
      }

      // ── Phase 2: "MARA" characters clip-reveal from below ──
      if (titleRef.current?.chars.length) {
        const innerEls = getInnerElements(titleRef.current.chars);
        gsap.set(innerEls, { yPercent: 120, rotateX: 45 });
        tl.to(innerEls, {
          yPercent: 0,
          rotateX: 0,
          duration: 1.4,
          stagger: 0.035,
        }, 0.3);
      }

      // ── Phase 3: "STUDIO" characters clip-reveal ──
      if (subtitleRef.current?.chars.length) {
        const innerEls = getInnerElements(subtitleRef.current.chars);
        gsap.set(innerEls, { yPercent: 120 });
        tl.to(innerEls, {
          yPercent: 0,
          duration: 1.2,
          stagger: 0.025,
        }, 0.5);
      }

      // ── Phase 4: Tagline ──
      if (taglineRef.current) {
        gsap.set(taglineRef.current, { opacity: 0, y: 20 });
        tl.to(taglineRef.current, {
          opacity: 1,
          y: 0,
          duration: 1.0,
        }, 0.9);
      }

      // ── Phase 5: CTA + Scroll indicator ──
      if (ctaRef.current) {
        gsap.set(ctaRef.current, { opacity: 0, y: 15 });
        tl.to(ctaRef.current, { opacity: 1, y: 0, duration: 0.8 }, 1.1);
      }

      if (scrollRef.current) {
        gsap.set(scrollRef.current, { opacity: 0 });
        tl.to(scrollRef.current, { opacity: 1, duration: 0.8 }, 1.3);
      }
    }, containerRef);

    return () => ctx.revert();
  }, [isReady]);

  return (
    <section ref={containerRef} className={styles.hero} id="hero">
      <Scene />
      <div ref={overlayRef} className={styles.overlay} />

      <div className={styles.content}>
        <div className={styles.titleBlock}>
          <SplitText ref={titleRef} as="h1" mode="chars" className={styles.title}>
            MARA
          </SplitText>
          <SplitText ref={subtitleRef} as="h2" mode="chars" className={styles.subtitle}>
            STUDIO
          </SplitText>
        </div>

        <p ref={taglineRef} className={styles.tagline}>
          Diseñando el comportamiento. Programando la estética.
        </p>

        <div ref={ctaRef} className={styles.cta}>
          <MagneticButton href="#contacto" strength={0.25}>
            Iniciemos un proyecto
          </MagneticButton>
        </div>
      </div>

      <div ref={scrollRef} className={styles.scrollIndicator} aria-hidden="true">
        <div className={styles.scrollLine} />
        <span className={styles.scrollLabel}>Scroll</span>
      </div>
    </section>
  );
}
