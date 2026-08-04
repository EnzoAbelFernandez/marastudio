'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { EASINGS, DURATIONS } from '@/lib/constants';
import styles from './Expertise.module.css';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface ExpertiseItem {
  title: string;
  description: string;
  tags: string[];
  area: string;
  featured?: boolean;
  /** Row index for stagger grouping — cards on the same row enter together */
  row: number;
}

const EXPERTISE_DATA: ExpertiseItem[] = [
  {
    title: 'Arquitectura Backend',
    description:
      'Sistemas robustos y escalables. APIs REST y GraphQL, microservicios, colas de mensajes, y bases de datos optimizadas para cargas de trabajo reales.',
    tags: ['Node.js', 'Express', 'MongoDB', 'PostgreSQL', 'Redis'],
    area: 'backend',
    featured: true,
    row: 0,
  },
  {
    title: 'Frontend Interactivo',
    description:
      'Interfaces que trascienden lo convencional. Animaciones fluidas, WebGL, canvas, y experiencias que los usuarios recuerdan.',
    tags: ['React', 'Next.js', 'Three.js', 'GSAP', 'WebGL'],
    area: 'frontend',
    featured: true,
    row: 0,
  },
  {
    title: 'Sistemas de Gestión',
    description:
      'ERPs, control de stock, facturación, punto de venta. Software que maneja la complejidad real del negocio.',
    tags: ['ERP', 'POS', 'Inventario', 'Facturación'],
    area: 'erp',
    row: 1,
  },
  {
    title: 'Infraestructura',
    description:
      'Deploy automatizado, CI/CD, monitoreo. Infraestructura que no deja de funcionar.',
    tags: ['Docker', 'AWS', 'CI/CD', 'Linux'],
    area: 'infra',
    row: 1,
  },
  {
    title: 'Diseño de Producto',
    description:
      'Desde la investigación de usuario hasta el pixel final. Diseño que resuelve, no que decora.',
    tags: ['UI/UX', 'Figma', 'Design Systems', 'Prototipado'],
    area: 'design',
    row: 1,
  },
];

/**
 * Expertise / Stack Técnico Section
 *
 * Asymmetric bento grid. Featured cards (row 0) enter with
 * a slower, more deliberate reveal. Secondary cards (row 1)
 * enter as a batch with faster timing — they're catalogue,
 * not showcase.
 */
export function Expertise() {
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
  }, []);

  return (
    <section ref={sectionRef} className={styles.expertise} id="expertise">
      <div className={styles.container}>
        <span className={styles.label}>Lo que hacemos</span>
        <h2 className={styles.heading}>
          Expertise<span className={styles.dot}>.</span>
        </h2>

        <div className={styles.grid}>
          {EXPERTISE_DATA.map((item) => (
            <article
              key={item.area}
              className={`${styles.card} ${item.featured ? styles.featured : ''}`}
              style={{ gridArea: item.area }}
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
                e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
              }}
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
