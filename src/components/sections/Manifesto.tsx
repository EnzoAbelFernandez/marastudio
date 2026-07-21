'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './Manifesto.module.css';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const MANIFESTO_TEXT =
  'No construimos software genérico. Diseñamos sistemas que resuelven problemas reales con arquitecturas sólidas, código que escala y experiencias que las personas recuerdan. Cada proyecto es una pieza de ingeniería visual donde la lógica y la estética convergen.';

/**
 * Manifesto / About Section
 *
 * Large text that reveals word-by-word as the user scrolls.
 * Each word transitions from dim (opacity 0.12) to bright (opacity 1)
 * creating a "lighting up" effect synchronized to scroll position.
 */
export function Manifesto() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !textRef.current) return;

    const words = textRef.current.querySelectorAll(`.${styles.word}`);
    if (!words.length) return;

    const ctx = gsap.context(() => {
      // Set all words to dim initially
      gsap.set(words, { opacity: 0.12 });

      // Animate each word to full opacity as user scrolls through
      gsap.to(words, {
        opacity: 1,
        stagger: 0.05,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 60%',
          end: 'bottom 40%',
          scrub: 0.5,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const words = MANIFESTO_TEXT.split(' ');

  return (
    <section ref={sectionRef} className={styles.manifesto} id="nosotros">
      <div className={styles.container}>
        {/* Section label */}
        <span className={styles.label}>Nuestro enfoque</span>

        {/* The manifesto text — each word is a span */}
        <p ref={textRef} className={styles.text}>
          {words.map((word, i) => (
            <span key={i} className={styles.word}>
              {word}{' '}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
