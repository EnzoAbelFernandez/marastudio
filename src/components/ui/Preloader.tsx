'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { EASINGS, DURATIONS } from '@/lib/constants';
import styles from './Preloader.module.css';

/**
 * Typographic Preloader
 * 
 * Blocks interaction and scrolling while counting from 0 to 100.
 * Once loading completes, it gracefully slides out to reveal
 * the Hero section underneath.
 * 
 * The counter uses an exponential curve, starting slow and 
 * accelerating toward 100, which feels more organic than linear.
 */
export function Preloader() {
  const containerRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!containerRef.current || !counterRef.current) return;

    // Lock scrolling
    document.body.style.overflow = 'hidden';
    
    // Fallback lock for Lenis if it intercepts overflow
    document.documentElement.classList.add('lenis-stopped');

    const counterObj = { value: 0 };
    
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          setIsComplete(true);
          document.body.style.overflow = '';
          document.documentElement.classList.remove('lenis-stopped');
          
          // Unmount after animation completes
          setTimeout(() => setIsVisible(false), 1000);
        }
      });

      // ── Phase 1: Counter from 0 to 100 ──
      // Starts slow, accelerates (expo.in) to build anticipation
      tl.to(counterObj, {
        value: 100,
        duration: 1.8,
        ease: 'expo.in',
        onUpdate: () => {
          if (counterRef.current) {
            counterRef.current.textContent = Math.round(counterObj.value).toString();
          }
        },
      });

      // ── Phase 2: Exit animation ──
      // Clip path reveal upwards to uncover the Hero
      tl.to(containerRef.current, {
        yPercent: -100,
        duration: DURATIONS.slow,
        ease: EASINGS.impact,
        delay: 0.2, // Tiny pause at 100 before disappearing
      });
      
    }, containerRef);

    return () => {
      ctx.revert();
      document.body.style.overflow = '';
      document.documentElement.classList.remove('lenis-stopped');
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div ref={containerRef} className={styles.preloader} aria-hidden={isComplete}>
      <div className={styles.inner}>
        <div className={styles.brand}>MARA STUDIO</div>
        <div className={styles.counterBlock}>
          <span ref={counterRef} className={styles.counter}>0</span>
          <span className={styles.percent}>%</span>
        </div>
      </div>
      
      <div className={styles.progressTrack}>
        <div 
          className={styles.progressBar} 
          style={{ transform: isComplete ? 'scaleX(1)' : 'scaleX(0)' }}
        />
      </div>
    </div>
  );
}
