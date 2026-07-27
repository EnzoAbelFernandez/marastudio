'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { EASINGS, DURATIONS } from '@/lib/constants';
import { MagneticButton } from '@/components/ui/MagneticButton';
import styles from './page.module.css';
import Link from 'next/link';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function HoraCaseStudy() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // We scroll to top on load for Next.js App Router transitions
    window.scrollTo(0, 0);

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
  }, []);

  // Simple stagger constant for internal use
  const STAGGER = 0.08;

  return (
    <main ref={containerRef} className={styles.main}>
      {/* ── Header Section ── */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.meta}>
            <Link href="/" className={styles.backLink}>
              <span className={styles.backArrow}>←</span> Volver
            </Link>
            <span className={styles.category}>SaaS / Aplicación Web B2B</span>
          </div>
          
          <h1 className={styles.title}>HORA</h1>
          <p className={styles.subtitle}>
            Sistema premium de gestión integral para playas de estacionamiento.
            Reemplazando sistemas obsoletos con una interfaz moderna, fluida y altamente visual.
          </p>
          
          <div className={styles.tags}>
            <span>React 19</span>
            <span>Vite</span>
            <span>Canvas 2D</span>
            <span>Local-First</span>
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
            Visitar Demo en Vivo ↗
          </MagneticButton>
        </div>
      </section>

      {/* ── Technical Breakdown ── */}
      <section className={styles.breakdown}>
        <div className={styles.grid}>
          
          <article className={styles.featureCard}>
            <h3 className={styles.featureTitle}>Dashboard Táctico</h3>
            <p className={styles.featureDesc}>
              Control de ingresos y egresos en tiempo real. Validación de patentes, cobro dinámico 
              (fraccionado u horas) y visualización de vehículos activos en tarjetas responsivas.
            </p>
          </article>

          <article className={styles.featureCard}>
            <h3 className={styles.featureTitle}>Diseñador Visual (Canvas 2D)</h3>
            <p className={styles.featureDesc}>
              Un lienzo interactivo drag-and-drop renderizado con <code>react-konva</code> donde el dueño 
              puede dibujar su playa, añadir cocheras, calles y paredes. Las plazas dibujadas se sincronizan 
              con la base de datos de cobro al instante.
            </p>
          </article>

          <article className={styles.featureCard}>
            <h3 className={styles.featureTitle}>Arquitectura Local-First</h3>
            <p className={styles.featureDesc}>
              Construida con React 19 y Javascript puro. La persistencia se maneja localmente abstrayendo 
              <code>localStorage</code> vía <code>dbService.js</code>, logrando tiempos de respuesta de 0ms 
              y resiliencia total frente a cortes de conexión.
            </p>
          </article>

          <article className={styles.featureCard}>
            <h3 className={styles.featureTitle}>Configuración Dinámica</h3>
            <p className={styles.featureDesc}>
              Motor de reglas comerciales complejas (horas pico, tolerancia en minutos, tarifas por 
              categoría de vehículo) aplicables en tiempo real, junto con gestión de abonados y alertas visuales.
            </p>
          </article>
          
        </div>
      </section>
      
    </main>
  );
}
