'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { EASINGS, DURATIONS, BREAKPOINTS } from '@/lib/constants';
import Link from 'next/link';
import { HoverImageCycler } from '@/components/ui/HoverImageCycler';
import styles from './CaseStudies.module.css';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  year: string;
  gradient: string;
  featured?: boolean;
  href?: string;
  images?: string[];
}

const PROJECTS: Project[] = [
  {
    id: '01',
    title: 'HORA',
    category: 'SaaS / Aplicación Web',
    description:
      'Sistema premium de gestión para playas de estacionamiento. Arquitectura Local-First, editor Canvas 2D.',
    year: '2026',
    gradient: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
    featured: true,
    href: '/work/hora',
    images: ['/images/hora_dashboard.png', '/images/hora_map.png', '/images/hora_mobile.png'],
  },
  {
    id: '02',
    title: 'Sistema de Gestión Retail',
    category: 'ERP / Punto de Venta',
    description:
      'Control de stock, ventas, facturación y reportes en tiempo real. Diseñado para la complejidad real del retail.',
    year: '2024',
    gradient: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)',
  },
  {
    id: '03',
    title: 'Tercer Proyecto',
    category: 'Aplicación Web',
    description:
      'Interfaz interactiva con lógica de negocio compleja. Backend escalable, frontend memorable.',
    year: '2024',
    gradient: 'linear-gradient(135deg, #0d0d0d 0%, #1f1f2e 50%, #0d0d1a 100%)',
  },
];

/**
 * Case Studies Section — Horizontal scroll slider
 *
 * Desktop: ScrollTrigger pin drives horizontal translation.
 * Mobile: Native horizontal scroll with scroll-snap (no pin hijacking).
 * First project is `.featured` — larger card, accent glow on border.
 */
export function CaseStudies() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !trackRef.current) return;

    const isDesktop = window.innerWidth >= BREAKPOINTS.md;

    const ctx = gsap.context(() => {
      const track = trackRef.current!;
      const cards = track.querySelectorAll(`.${styles.card}`);
      const images = track.querySelectorAll(`.${styles.imageInner}`);

      if (isDesktop) {
        // ── Desktop: horizontal scroll via pin ──
        const totalWidth = track.scrollWidth - window.innerWidth;

        const horizontalScroll = gsap.to(track, {
          x: -totalWidth,
          ease: EASINGS.scrub,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: () => `+=${totalWidth}`,
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        });

        // Parallax on images
        images.forEach((img) => {
          gsap.to(img, {
            x: -80,
            ease: EASINGS.scrub,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top top',
              end: () => `+=${totalWidth}`,
              scrub: 0.5,
            },
          });
        });

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
  }, []);

  return (
    <section ref={sectionRef} className={styles.caseStudies} id="trabajo">
      <div className={styles.header}>
        <span className={styles.label}>Casos de estudio</span>
        <h2 className={styles.heading}>
          El trabajo<span className={styles.dot}>.</span>
        </h2>
      </div>

      <div ref={trackRef} className={styles.track}>
        {PROJECTS.map((project) => {
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
            <Link key={project.id} href={project.href} className={styles.cardLink}>
              {CardContent}
            </Link>
          ) : (
            <div key={project.id} className={styles.cardLink}>
              {CardContent}
            </div>
          );
        })}

        <div className={styles.endCard}>
          <p className={styles.endText}>Más proyectos próximamente</p>
        </div>
      </div>
    </section>
  );
}
