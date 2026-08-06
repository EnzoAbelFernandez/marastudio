'use client';

import { useRef, useEffect, useState } from 'react';
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
 * Re-designed Premium Footer / Contact Section
 *
 * Combines a massive magnetic project inquiry CTA with a personalized
 * Studio Principal / Founder signature card and direct communication channels.
 */
export function Footer() {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      const heading = sectionRef.current!.querySelector(`.${styles.ctaHeading}`);
      const button = sectionRef.current!.querySelector(`.${styles.ctaButton}`);
      const founderCard = sectionRef.current!.querySelector(`.${styles.founderCard}`);
      const contactLinks = sectionRef.current!.querySelectorAll(`.${styles.contactCard}`);

      if (heading) {
        gsap.set(heading, { opacity: 0, y: 50 });
        gsap.to(heading, {
          opacity: 1,
          y: 0,
          duration: DURATIONS.slow,
          ease: EASINGS.impact,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            once: true,
          },
        });
      }

      if (button) {
        gsap.set(button, { opacity: 0, scale: 0.95 });
        gsap.to(button, {
          opacity: 1,
          scale: 1,
          duration: DURATIONS.normal,
          delay: 0.15,
          ease: EASINGS.micro,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            once: true,
          },
        });
      }

      if (founderCard) {
        gsap.set(founderCard, { opacity: 0, x: -30 });
        gsap.to(founderCard, {
          opacity: 1,
          x: 0,
          duration: DURATIONS.normal,
          delay: 0.3,
          ease: EASINGS.reveal,
          scrollTrigger: {
            trigger: founderCard,
            start: 'top 85%',
            once: true,
          },
        });
      }

      if (contactLinks.length > 0) {
        gsap.set(contactLinks, { opacity: 0, y: 20 });
        gsap.to(contactLinks, {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          delay: 0.4,
          ease: EASINGS.micro,
          scrollTrigger: {
            trigger: founderCard,
            start: 'top 85%',
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
        {/* ── Massive Inquiry CTA ── */}
        <div className={styles.ctaSection}>
          <h2 className={styles.ctaHeading}>
            {t.footer.ctaHeadingLine1}
            <br />
            {t.footer.ctaHeadingLine2}
          </h2>

          <div className={styles.ctaButton}>
            <MagneticButton
              href="mailto:enzo@marastudio.com.ar"
              strength={0.35}
              size="lg"
            >
              <span className={styles.buttonText}>{t.footer.ctaButton}</span>
              <span className={styles.buttonArrow}>↗</span>
            </MagneticButton>
          </div>
        </div>

        {/* ── Founder Profile & Direct Channels Grid ── */}
        <div className={styles.grid}>
          {/* Founder Identity & Authority Card */}
          <div className={styles.founderCard}>
            <div className={styles.avatarWrapper}>
              {!imgError ? (
                <img
                  src="/images/enzo_profile.jpg"
                  alt={t.footer.founderName}
                  className={styles.avatarImg}
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className={styles.avatarMonogram} title={t.footer.founderName}>
                  EF
                </div>
              )}
            </div>

            <div className={styles.founderContent}>
              <span className={styles.founderName}>{t.footer.founderName}</span>
              <h3 className={styles.founderRole}>{t.footer.founderRole}</h3>
              <p className={styles.founderBio}>{t.footer.founderBio}</p>
            </div>
          </div>

          {/* Interactive Contact Channels */}
          <div className={styles.contactList}>
            <a
              href="mailto:enzo@marastudio.com.ar"
              className={styles.contactCard}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className={styles.contactMeta}>
                <span className={styles.contactLabel}>{t.footer.labelEmail}</span>
                <span className={styles.contactValue}>enzo@marastudio.com.ar</span>
              </div>
              <span className={styles.actionIcon}>↗</span>
            </a>

            <a
              href="https://wa.me/543814766606"
              className={styles.contactCard}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className={styles.contactMeta}>
                <span className={styles.contactLabel}>{t.footer.labelPhone}</span>
                <span className={styles.contactValue}>+54 381 476 6606</span>
              </div>
              <span className={styles.actionIcon}>↗</span>
            </a>

            <a
              href="https://github.com/enzoabelfernandez"
              className={styles.contactCard}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className={styles.contactMeta}>
                <span className={styles.contactLabel}>{t.footer.labelSocials}</span>
                <span className={styles.contactValue}>GitHub</span>
              </div>
              <span className={styles.actionIcon}>↗</span>
            </a>
          </div>
        </div>

        {/* ── Bottom Bar ── */}
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
