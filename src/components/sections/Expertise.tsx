'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { EASINGS, DURATIONS } from '@/lib/constants';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import styles from './Expertise.module.css';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Expertise / Stack Técnico Section
 *
 * Asymmetric bento grid. Featured cards (row 0) enter with
 * a slower, more deliberate reveal. Secondary cards (row 1)
 * enter as a batch with faster timing — they're catalogue,
 * not showcase.
 */
export function Expertise() {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      const featuredCards = sectionRef.current!.querySelectorAll(`.${styles.featured}`);
      const regularCards = sectionRef.current!.querySelectorAll(`.${styles.card}:not(.${styles.featured})`);

      // ── Featured row: slower, deliberate, uses reveal curve ──
      if (featuredCards.length) {
        gsap.set(featuredCards, { opacity: 0, y: 50, scale: 0.98 });

        ScrollTrigger.batch(featuredCards, {
          onEnter: (batch) => {
            gsap.to(batch, {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: DURATIONS.slow,
              ease: EASINGS.reveal,
              stagger: 0.15,
            });
          },
          start: 'top 85%',
          once: true,
        });
      }

      // ── Secondary row: faster batch, less fanfare ──
      if (regularCards.length) {
        gsap.set(regularCards, { opacity: 0, y: 30 });

        ScrollTrigger.batch(regularCards, {
          onEnter: (batch) => {
            gsap.to(batch, {
              opacity: 1,
              y: 0,
              duration: DURATIONS.normal,
              ease: EASINGS.micro,
              stagger: 0.06,
            });
          },
          start: 'top 85%',
          once: true,
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [t.expertise.items]);

  return (
    <section ref={sectionRef} className={styles.expertise} id="expertise">
      <div className={styles.container}>
        <span className={styles.label}>{t.expertise.label}</span>
        <h2 className={styles.heading}>
          {t.expertise.heading}<span className={styles.dot}>.</span>
        </h2>

        <div className={styles.grid}>
          {t.expertise.items.map((item) => (
            <article
              key={item.area}
              className={`${styles.card} ${item.featured ? styles.featured : ''}`}
              style={{ gridArea: item.area }}
            >
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>{item.title}</h3>
                <p className={styles.cardDescription}>{item.description}</p>
                <div className={styles.tags}>
                  {item.tags.map((tag) => (
                    <span key={tag} className={styles.tag}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className={styles.cardGlow} />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

