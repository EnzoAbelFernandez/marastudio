'use client';

import { useEffect, useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { EASINGS, DURATIONS } from '@/lib/constants';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import styles from './page.module.css';
import Link from 'next/link';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function HoraCaseStudy() {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Ensure we start at the top for this specific page
  useLayoutEffect(() => {
    if (typeof window !== 'undefined' && (window as any).lenis) {
      (window as any).lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      const headerElements = containerRef.current!.querySelectorAll(`.${styles.headerContent} > *`);
      const features = containerRef.current!.querySelectorAll(`.${styles.featureCard}`);
      
      // Initial header reveal
      gsap.set(headerElements, { opacity: 0, y: 40 });
      gsap.to(headerElements, {
        opacity: 1,
        y: 0,
        duration: DURATIONS.slow,
        stagger: STAGGER,
        ease: EASINGS.impact,
        delay: 0.2, // Wait for route transition / preloader
      });

      // Feature cards scroll reveal
      features.forEach((feature) => {
        gsap.set(feature, { opacity: 0, y: 30 });
        gsap.to(feature, {
          opacity: 1,
          y: 0,
          duration: DURATIONS.normal,
          ease: EASINGS.reveal,
          scrollTrigger: {
            trigger: feature,
            start: 'top 85%',
            once: true,
          }
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, [t]);

  // Simple stagger constant for internal use
  const STAGGER = 0.08;

  return (
    <main ref={containerRef} className={styles.main}>
      {/* ── Header Section ── */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.meta}>
            <Link href="/" className={styles.backLink}>
              <span className={styles.backArrow}>←</span> {t.hora.back}
            </Link>
            <span className={styles.category}>{t.hora.category}</span>
          </div>
          
          <h1 className={styles.title}>HORA</h1>
          <p className={styles.subtitle}>
            {t.hora.subtitle}
          </p>
          
          <div className={styles.tags}>
            {t.hora.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        </div>
      </header>

      {/* ── Iframe Embed Demo ── */}
      <section className={styles.demoSection}>
        <div className={styles.mockupContainer}>
          <div className={styles.mockupHeader}>
            <div className={styles.dots}>
              <span className={styles.dot} style={{ background: '#ff5f56' }} />
              <span className={styles.dot} style={{ background: '#ffbd2e' }} />
              <span className={styles.dot} style={{ background: '#27c93f' }} />
            </div>
            <div className={styles.mockupTitle}>hora.marastudio.com.ar</div>
          </div>
          <div className={styles.iframeWrapper}>
            <iframe 
              src="https://hora.marastudio.com.ar" 
              title="HORA App Demo"
              className={styles.iframe}
              loading="lazy"
            />
          </div>
        </div>
        
        <div className={styles.demoCta}>
          <MagneticButton href="https://hora.marastudio.com.ar" size="lg">
            {t.hora.demoCta}
          </MagneticButton>
        </div>
      </section>

      {/* ── Technical Breakdown ── */}
      <section className={styles.breakdown}>
        <div className={styles.grid}>
          
          <article className={styles.featureCard}>
            <h3 className={styles.featureTitle}>{t.hora.cards.dashboard.title}</h3>
            <p className={styles.featureDesc}>
              {t.hora.cards.dashboard.desc}
            </p>
          </article>

          <article className={styles.featureCard}>
            <h3 className={styles.featureTitle}>{t.hora.cards.canvas.title}</h3>
            <p className={styles.featureDesc}>
              {t.hora.cards.canvas.part1}<code>{t.hora.cards.canvas.code}</code>{t.hora.cards.canvas.part2}
            </p>
          </article>

          <article className={styles.featureCard}>
            <h3 className={styles.featureTitle}>{t.hora.cards.localFirst.title}</h3>
            <p className={styles.featureDesc}>
              {t.hora.cards.localFirst.part1}<code>{t.hora.cards.localFirst.code1}</code>{t.hora.cards.localFirst.part2}<code>{t.hora.cards.localFirst.code2}</code>{t.hora.cards.localFirst.part3}
            </p>
          </article>

          <article className={styles.featureCard}>
            <h3 className={styles.featureTitle}>{t.hora.cards.config.title}</h3>
            <p className={styles.featureDesc}>
              {t.hora.cards.config.desc}
            </p>
          </article>
          
        </div>
      </section>
      
    </main>
  );
}

