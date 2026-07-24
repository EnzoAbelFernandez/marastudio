'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
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
  /** Gradient placeholder for project image — will be replaced with real images */
  gradient: string;
}

const PROJECTS: Project[] = [
  {
    id: '01',
    title: 'Proyecto Estrella',
    category: 'Plataforma Web',
    description:
      'Sistema integral de gestión con interfaz de alto nivel. Arquitectura robusta, experiencia de usuario excepcional.',
    year: '2025',
    gradient: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
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
 * Vertical scroll is "hijacked" via GSAP ScrollTrigger pin to drive
 * horizontal translation of the project cards. Each card has a parallax
 * effect on its image and reveals its content as it enters the viewport.
 */
export function CaseStudies() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !trackRef.current) return;

    const ctx = gsap.context(() => {
      const track = trackRef.current!;
      const cards = track.querySelectorAll(`.${styles.card}`);
      const images = track.querySelectorAll(`.${styles.imageInner}`);

      // Calculate total scroll distance
      const totalWidth = track.scrollWidth - window.innerWidth;

      // ── Horizontal scroll driven by vertical scroll ──
      const horizontalScroll = gsap.to(track, {
        x: -totalWidth,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: () => `+=${totalWidth}`,
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      });

      // ── Parallax on images (they move slower than cards) ──
      images.forEach((img) => {
        gsap.to(img, {
          x: -80,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: () => `+=${totalWidth}`,
            scrub: 0.5,
          },
        });
      });

      // ── Card content reveal ──
      cards.forEach((card) => {
        const content = card.querySelector(`.${styles.cardContent}`);
        if (!content) return;

        gsap.set(content, { opacity: 0, y: 30 });

        ScrollTrigger.create({
          trigger: card,
          containerAnimation: horizontalScroll,
          start: 'left 80%',
          onEnter: () => {
            gsap.to(content, {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: 'expo.out',
            });
          },
          once: true,
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className={styles.caseStudies} id="trabajo">
      {/* Section header — visible at start */}
      <div className={styles.header}>
        <span className={styles.label}>Casos de estudio</span>
        <h2 className={styles.heading}>
          El trabajo<span className={styles.dot}>.</span>
        </h2>
      </div>

      {/* Horizontal track */}
      <div ref={trackRef} className={styles.track}>
        {PROJECTS.map((project) => (
          <article key={project.id} className={styles.card}>
            {/* Image area */}
            <div className={styles.imageWrapper}>
              <div
                className={styles.imageInner}
                style={{ background: project.gradient }}
              >
                <span className={styles.imagePlaceholder}>
                  {project.title}
                </span>
              </div>
            </div>

            {/* Info */}
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
        ))}

        {/* Final spacer card — "Ver más" */}
        <div className={styles.endCard}>
          <p className={styles.endText}>Más proyectos próximamente</p>
        </div>
      </div>
    </section>
  );
}
