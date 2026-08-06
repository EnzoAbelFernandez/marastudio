'use client';

import { useState, useRef, useImperativeHandle, forwardRef } from 'react';
import gsap from 'gsap';
import { type Locale } from '@/lib/i18n/dictionaries';
import styles from './LanguageTransition.module.css';

export interface LanguageTransitionRef {
  trigger: (targetLocale: Locale, onMidpoint: () => void) => void;
}

/**
 * Premium Diagonal Language Wipe Transition
 * 
 * Creates an Awwwards-grade layered diagonal sweep across the viewport
 * when toggling languages. Masks the instantaneous DOM text transformation
 * beneath a deep obsidian curtain led by an amber/bronze glowing blade.
 */
export const LanguageTransition = forwardRef<LanguageTransitionRef, {}>((_, ref) => {
  const [displayLocale, setDisplayLocale] = useState<Locale>('es');
  const containerRef = useRef<HTMLDivElement>(null);
  const leadingRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);
  const trailingRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({
    trigger: (targetLocale: Locale, onMidpoint: () => void) => {
      if (!containerRef.current || !leadingRef.current || !mainRef.current || !trailingRef.current || !textRef.current) {
        onMidpoint();
        return;
      }

      setDisplayLocale(targetLocale);

      const ctx = gsap.context(() => {
        const tl = gsap.timeline({
          onStart: () => {
            gsap.set(containerRef.current, { visibility: 'visible', pointerEvents: 'auto' });
          },
          onComplete: () => {
            gsap.set(containerRef.current, { visibility: 'hidden', pointerEvents: 'none' });
            gsap.set([leadingRef.current, mainRef.current, trailingRef.current], { xPercent: -150 });
          },
        });

        // ── Reset Positions (off-screen left) ──
        gsap.set([leadingRef.current, mainRef.current, trailingRef.current], { xPercent: -150 });
        gsap.set(textRef.current, { opacity: 0, scale: 0.92, y: 15 });

        // ── Phase 1: Sweep IN toward center (xPercent: 0) ──
        // Leading glowing ribbon enters first
        tl.to(leadingRef.current, {
          xPercent: 0,
          duration: 0.6,
          ease: 'power3.inOut',
        }, 0);

        // Main obsidian backdrop follows closely behind
        tl.to(mainRef.current, {
          xPercent: 0,
          duration: 0.6,
          ease: 'power3.inOut',
        }, 0.08);

        // Trailing ribbon follows with main backdrop
        tl.to(trailingRef.current, {
          xPercent: 0,
          duration: 0.6,
          ease: 'power3.inOut',
        }, 0.08);

        // Text reveal as the dark screen covers the viewport
        tl.to(textRef.current, {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.35,
          ease: 'power2.out',
        }, 0.4);

        // ── MIDPOINT TRIGGER ── 
        // Execute React state change at t = 0.65s when screen is 100% masked
        tl.add(() => {
          onMidpoint();
        }, 0.65);

        // Brief dramatic holding pause (0.15s)
        
        // ── Phase 2: Sweep OUT toward right (xPercent: 150) ──
        // Text gracefully dissolves
        tl.to(textRef.current, {
          opacity: 0,
          scale: 1.05,
          y: -10,
          duration: 0.25,
          ease: 'power2.in',
        }, 0.85);

        // Leading edge moves out first
        tl.to(leadingRef.current, {
          xPercent: 150,
          duration: 0.6,
          ease: 'power3.inOut',
        }, 0.9);

        // Main obsidian screen slides away to reveal translated page
        tl.to(mainRef.current, {
          xPercent: 150,
          duration: 0.6,
          ease: 'power3.inOut',
        }, 0.95);

        // Trailing glow blade lags behind slightly for laser reveal effect
        tl.to(trailingRef.current, {
          xPercent: 150,
          duration: 0.6,
          ease: 'power3.inOut',
        }, 1.02);

      }, containerRef);

      return () => ctx.revert();
    }
  }));

  const labelText = displayLocale === 'es' ? 'CAMBIANDO IDIOMA' : 'SWITCHING LANGUAGE';
  const titleText = displayLocale === 'es' ? 'ESPAÑOL' : 'ENGLISH';

  return (
    <div ref={containerRef} className={styles.container} aria-hidden="true">
      <div ref={leadingRef} className={styles.sliceLeading} />
      <div ref={mainRef} className={styles.sliceMain} />
      <div ref={trailingRef} className={styles.sliceTrailing} />

      <div ref={textRef} className={styles.textWrapper}>
        <span className={styles.label}>{labelText}</span>
        <div className={styles.title}>
          {titleText}<span className={styles.dot}>.</span>
        </div>
      </div>
    </div>
  );
});

LanguageTransition.displayName = 'LanguageTransition';
