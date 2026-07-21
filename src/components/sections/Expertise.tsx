'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './Expertise.module.css';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface ExpertiseItem {
  title: string;
  description: string;
  tags: string[];
  /** Grid area name for CSS grid placement */
  area: string;
  /** Optional accent — 'featured' makes it visually larger */
  featured?: boolean;
}

const EXPERTISE_DATA: ExpertiseItem[] = [
  {
    title: 'Arquitectura Backend',
    description:
      'Sistemas robustos y escalables. APIs REST y GraphQL, microservicios, colas de mensajes, y bases de datos optimizadas para cargas de trabajo reales.',
    tags: ['Node.js', 'Express', 'MongoDB', 'PostgreSQL', 'Redis'],
    area: 'backend',
    featured: true,
  },
  {
    title: 'Frontend Interactivo',
    description:
      'Interfaces que trascienden lo convencional. Animaciones fluidas, WebGL, canvas, y experiencias que los usuarios recuerdan.',
    tags: ['React', 'Next.js', 'Three.js', 'GSAP', 'WebGL'],
    area: 'frontend',
    featured: true,
  },
  {
    title: 'Sistemas de Gestión',
    description:
      'ERPs, control de stock, facturación, punto de venta. Software que maneja la complejidad real del negocio.',
    tags: ['ERP', 'POS', 'Inventario', 'Facturación'],
    area: 'erp',
  },
  {
    title: 'Infraestructura',
    description:
      'Deploy automatizado, CI/CD, monitoreo. Infraestructura que no deja de funcionar.',
    tags: ['Docker', 'AWS', 'CI/CD', 'Linux'],
    area: 'infra',
  },
  {
    title: 'Diseño de Producto',
    description:
      'Desde la investigación de usuario hasta el pixel final. Diseño que resuelve, no que decora.',
    tags: ['UI/UX', 'Figma', 'Design Systems', 'Prototipado'],
    area: 'design',
  },
];

/**
 * Expertise / Stack Técnico Section
 *
 * Asymmetric bento grid showcasing capabilities.
 * Each card has a subtle scale + glow animation on scroll-in.
 * Highlights the duality: heavy backend ↔ interactive frontend.
 */
export function Expertise() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      const cards = sectionRef.current!.querySelectorAll(`.${styles.card}`);

      gsap.set(cards, { opacity: 0, y: 40 });

      ScrollTrigger.batch(cards, {
        onEnter: (batch) => {
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: 'expo.out',
            stagger: 0.1,
          });
        },
        start: 'top 85%',
        once: true,
      });
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
