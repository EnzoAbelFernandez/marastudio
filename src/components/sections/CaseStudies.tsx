'use client';

import { useRef, useEffect, useLayoutEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { EASINGS, DURATIONS, BREAKPOINTS } from '@/lib/constants';
import Link from 'next/link';
import { HoverImageCycler } from '@/components/ui/HoverImageCycler';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import styles from './CaseStudies.module.css';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Case Studies Section — Horizontal scroll slider
 *
 * Desktop: ScrollTrigger pin drives horizontal translation.
 * Mobile: Native horizontal scroll with scroll-snap (no pin hijacking).
 * First project is `.featured` — larger card, accent glow on border.
 */
export function CaseStudies() {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useLayoutEffect(() => {
    if (!sectionRef.current || !trackRef.current) return;

    const isDesktop = window.innerWidth >= BREAKPOINTS.md;
    setIsMobile(!isDesktop);

    const ctx = gsap.context(() => {
      const track = trackRef.current!;
      const cards = track.querySelectorAll(`.${styles.card}`);
      const images = track.querySelectorAll(`.${styles.imageInner}`);

      if (isDesktop) {
        // ── Desktop: horizontal scroll via pin ──
        const totalWidth = track.scrollWidth - window.innerWidth;
        const deadZoneScroll = window.innerHeight * 0.1;

        // Master timeline for the horizontal track movement
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: () => `+=${totalWidth + deadZoneScroll}`,
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        });

        // 1. Pause at the beginning (dead zone)
        tl.to(track, { x: 0, duration: deadZoneScroll, ease: 'none' });

        // 2. Move the track horizontally
        tl.to(track, { x: -totalWidth, ease: 'none', duration: totalWidth });

        // 3. Parallax on images, driven by each card's entry into the viewport
        images.forEach((img) => {
          const card = img.closest(`.${styles.card}`);
          if (!card) return;

          gsap.fromTo(
            img,
            { x: -20 }, // Start shifted left
            {
              x: 20,    // End shifted right
              ease: 'none',
              scrollTrigger: {
                trigger: card,
                containerAnimation: tl,
                start: 'left right', // When card enters screen from the right
                end: 'right left',   // When card leaves screen from the left
                scrub: true,
              },
            }
          );
        });

        const horizontalScroll = tl;

        // Content reveal per card — uses REVEAL curve (neutral, informational)
        cards.forEach((card) => {
          const content = card.querySelector(`.${styles.cardContent}`);
          if (!content) return;

          gsap.set(content, { opacity: 0, y: 24 });

          ScrollTrigger.create({
            trigger: card,
            containerAnimation: horizontalScroll,
            start: 'left 80%',
            onEnter: () => {
              gsap.to(content, {
                opacity: 1,
                y: 0,
                duration: DURATIONS.normal,
                ease: EASINGS.reveal,
              });
            },
            once: true,
          });
        });
      } else {
        // ── Mobile: simple scroll reveal, no pin ──
        cards.forEach((card) => {
          const content = card.querySelector(`.${styles.cardContent}`);
          if (!content) return;

          gsap.set(content, { opacity: 0, y: 20 });

          gsap.to(content, {
            opacity: 1,
            y: 0,
            duration: DURATIONS.normal,
            ease: EASINGS.reveal,
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              once: true,
            },
          });
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [t.caseStudies.projects]);

  return (
    <section ref={sectionRef} className={styles.caseStudies} id="trabajo">
      <div className={styles.header}>
        <span className={styles.label}>{t.caseStudies.label}</span>
        <h2 className={styles.heading}>
          {t.caseStudies.heading}<span className={styles.dot}>.</span>
        </h2>
      </div>

      <div ref={trackRef} className={styles.track} data-lenis-prevent={isMobile ? "true" : undefined}>
        {t.caseStudies.projects.map((project) => {
          const CardContent = (
            <article
              className={`${styles.card} ${project.featured ? styles.featured : ''} ${project.href ? styles.clickableCard : ''}`}
            >
              <div className={styles.imageWrapper}>
                <div className={styles.imageInner}>
                  {project.images && project.images.length > 0 ? (
                    <HoverImageCycler
                      images={project.images}
                      alt={project.title}
                      fallbackGradient={project.gradient}
                    />
                  ) : (
                    <div style={{ background: project.gradient, width: '100%', height: '100%' }}>
                      <span className={styles.imagePlaceholder}>{project.title}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className={styles.cardContent}>
                <div className={styles.cardMeta}>
                  <span className={styles.cardId}>{project.id}</span>
                  <span className={styles.cardCategory}>{project.category}</span>
                  <span className={styles.cardYear}>{project.year}</span>
                </div>
                <h3 className={styles.cardTitle}>{project.title}</h3>
                <p className={styles.cardDescription}>{project.description}</p>
              </div>
            </article>
          );

          return project.href ? (
            <Link 
              key={project.id} 
              href={project.href} 
              className={styles.cardLink}
              onClick={() => {
                sessionStorage.setItem('mara_home_scroll', window.scrollY.toString());
              }}
            >
              {CardContent}
            </Link>
          ) : (
            <div key={project.id} className={styles.cardLink}>
              {CardContent}
            </div>
          );
        })}

        <div className={styles.endCard}>
          <p className={styles.endText}>{t.caseStudies.endText}</p>
        </div>
      </div>
    </section>
  );
}

