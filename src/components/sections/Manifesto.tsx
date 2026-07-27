'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './Manifesto.module.css';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const MANIFESTO_TEXT =
  'No construimos software genérico. Diseñamos sistemas que resuelven problemas reales con arquitecturas sólidas, código que escala y experiencias que las personas recuerdan.';

/**
 * Manifesto / About Section
 *
 * Large text that reveals word-by-word as the user scrolls.
 * Enhanced: combines opacity with blur and a subtle y-offset
 * for a "focusing" effect rather than just a brightness ramp.
 * Key structural words get slightly longer timing.
 */
export function Manifesto() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !textRef.current) return;

    const words = textRef.current.querySelectorAll<HTMLSpanElement>(`.${styles.word}`);
    if (!words.length) return;

    const ctx = gsap.context(() => {
      // Set initial state: dim + blurred + slightly displaced
      words.forEach((word, i) => {
        // Y-offset decreases as we go deeper into the text
        // First words drift more, last words barely move
        const yOffset = Math.max(0, 8 - (i / words.length) * 8);
        gsap.set(word, {
          opacity: 0.08,
          filter: 'blur(3px)',
          y: yOffset,
        });
      });

      // Animate each word: opacity + blur-clear + settle
      gsap.to(words, {
        opacity: 1,
        filter: 'blur(0px)',
        y: 0,
        stagger: 0.05,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',  // Empieza a aclarar un poco antes al entrar en pantalla
          end: 'bottom 60%', // Termina justo antes de pasar el centro (asegura lectura óptima)
          scrub: 0.6,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const words = MANIFESTO_TEXT.split(' ');

  return (
    <section ref={sectionRef} className={styles.manifesto} id="nosotros">
      <div className={styles.container}>
        <span className={styles.label}>Nuestro enfoque</span>

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
