'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { EASINGS, DURATIONS } from '@/lib/constants';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import styles from './Footer.module.css';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Footer / Contact Section
 *
 * Massive CTA button with magnetic effect, minimal contact info.
 * The "Iniciemos un proyecto" text reveals on scroll.
 */
export function Footer() {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      const heading = sectionRef.current!.querySelector(`.${styles.ctaHeading}`);
      const button = sectionRef.current!.querySelector(`.${styles.ctaButton}`);
      const info = sectionRef.current!.querySelector(`.${styles.info}`);

      if (heading) {
        gsap.set(heading, { opacity: 0, y: 60 });
        gsap.to(heading, {
          opacity: 1,
          y: 0,
          duration: DURATIONS.slow,
          ease: EASINGS.impact,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            once: true,
          },
        });
      }

      if (button) {
        gsap.set(button, { opacity: 0, y: 30 });
        gsap.to(button, {
          opacity: 1,
          y: 0,
          duration: DURATIONS.slow,
          delay: 0.2,
          ease: EASINGS.micro,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            once: true,
          },
        });
      }

      if (info) {
        gsap.set(info, { opacity: 0 });
        gsap.to(info, {
          opacity: 1,
          duration: DURATIONS.normal,
          delay: 0.5,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            once: true,
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer ref={sectionRef} className={styles.footer} id="contacto">
      <div className={styles.container}>
        {/* Massive CTA */}
        <div className={styles.ctaSection}>
          <h2 className={styles.ctaHeading}>
            {t.footer.ctaHeadingLine1}
            <br />
            {t.footer.ctaHeadingLine2}
          </h2>

          <div className={styles.ctaButton}>
            <MagneticButton
              href="mailto:hola@marastudio.dev"
              strength={0.35}
              size="lg"
            >
              <span className={styles.buttonText}>{t.footer.ctaButton}</span>
              <span className={styles.buttonArrow}>↗</span>
            </MagneticButton>
          </div>
        </div>

        {/* Info bar */}
        <div className={styles.info}>
          <div className={styles.infoBlock}>
            <span className={styles.infoLabel}>{t.footer.labelEmail}</span>
            <a href="mailto:hola@marastudio.dev" className={styles.infoValue}>
              hola@marastudio.dev
            </a>
          </div>

          <div className={styles.infoBlock}>
            <span className={styles.infoLabel}>{t.footer.labelLocation}</span>
            <span className={styles.infoValue}>{t.footer.valueLocation}</span>
          </div>

          <div className={styles.infoBlock}>
            <span className={styles.infoLabel}>{t.footer.labelSocials}</span>
            <div className={styles.socials}>
              <a href="#" className={styles.socialLink}>GitHub</a>
              <a href="#" className={styles.socialLink}>LinkedIn</a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className={styles.bottom}>
          <span className={styles.copyright}>
            © {new Date().getFullYear()} Mara Studio
          </span>
          <span className={styles.credit}>
            {t.footer.credit}
          </span>
        </div>
      </div>
    </footer>
  );
}

