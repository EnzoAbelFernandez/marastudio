'use client';

import { useRef, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import gsap from 'gsap';
import { EASINGS } from '@/lib/constants';
import { SplitText, type SplitTextRef } from '@/components/ui/SplitText';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import styles from './Hero.module.css';

const Scene = dynamic(
  () => import('@/components/canvas/Scene').then((mod) => ({ default: mod.Scene })),
  { ssr: false }
);

function getInnerElements(chars: HTMLSpanElement[]): HTMLElement[] {
  return chars
    .map((c) => c.firstElementChild as HTMLElement)
    .filter(Boolean);
}

export function Hero() {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const titleBlockRef = useRef<HTMLDivElement>(null);
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
      const tl = gsap.timeline({ delay: 0.2 });

      // ── Phase 1: Overlay — symmetric in/out, not dramatic ──
      if (overlayRef.current) {
        tl.to(overlayRef.current, {
          opacity: 0,
          duration: 1.2,
          ease: EASINGS.overlay,
        }, 0);
      }

      // ── Phase 2: "MARA" — IMPACT curve: overshoot, weight ──
      // This is the most important moment. The letters should feel
      // like they land with mass, not just slide in.
      if (titleRef.current?.chars.length) {
        const innerEls = getInnerElements(titleRef.current.chars);
        gsap.set(innerEls, { yPercent: 130, rotateX: 50 });
        tl.to(innerEls, {
          yPercent: 0,
          rotateX: 0,
          duration: 1.5,
          stagger: 0.04,
          ease: EASINGS.impact,
        }, 0.3);
      }

      // ── Phase 3: "STUDIO" — slightly softer than MARA ──
      if (subtitleRef.current?.chars.length) {
        const innerEls = getInnerElements(subtitleRef.current.chars);
        gsap.set(innerEls, { yPercent: 120 });
        tl.to(innerEls, {
          yPercent: 0,
          duration: 1.3,
          stagger: 0.025,
          ease: EASINGS.impact,
        }, 0.5);
      }

      // ── Phase 4: Tagline — REVEAL curve: neutral, no drama ──
      if (taglineRef.current) {
        gsap.set(taglineRef.current, { opacity: 0, y: 20 });
        tl.to(taglineRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: EASINGS.reveal,
        }, 0.9);
      }

      // ── Phase 5: CTA + Scroll — MICRO curve: dry, quick ──
      if (ctaRef.current) {
        gsap.set(ctaRef.current, { opacity: 0, y: 12 });
        tl.to(ctaRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: EASINGS.micro,
        }, 1.1);
      }

      if (scrollRef.current) {
        gsap.set(scrollRef.current, { opacity: 0 });
        tl.to(scrollRef.current, {
          opacity: 1,
          duration: 0.6,
          ease: EASINGS.micro,
        }, 1.3);
      }
    }, containerRef);

    return () => ctx.revert();
  }, [isReady]);

  return (
    <section ref={containerRef} className={styles.hero} id="hero">
      <Scene textRef={titleBlockRef} />
      <div ref={overlayRef} className={styles.overlay} />

      <div className={styles.content}>
        <div className={styles.titleBlock} ref={titleBlockRef}>
          <SplitText ref={titleRef} as="h1" mode="chars" className={styles.title}>
            MARA
          </SplitText>
          <SplitText ref={subtitleRef} as="h2" mode="chars" className={styles.subtitle}>
            STUDIO
          </SplitText>
        </div>

        <p ref={taglineRef} className={styles.tagline}>
          {t.hero.tagline}
        </p>

        <div ref={ctaRef} className={styles.cta}>
          <MagneticButton href="#contacto" strength={0.25}>
            {t.hero.cta}
          </MagneticButton>
        </div>
      </div>

      <div ref={scrollRef} className={styles.scrollIndicator}>
        <div className={styles.scrollLine} />
        <span className={styles.scrollLabel}>{t.hero.scroll}</span>
      </div>
    </section>
  );
}

