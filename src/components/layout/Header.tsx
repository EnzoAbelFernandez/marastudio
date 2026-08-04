'use client';

import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import styles from './Header.module.css';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Sticky header that hides on scroll-down and shows on scroll-up.
 * Uses a backdrop blur for glassmorphism effect.
 * Entrance animation syncs with the Hero timeline.
 */
export function Header() {
  const { locale, setLocale, t } = useLanguage();
  const headerRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const lastScrollY = useRef(0);

  const navItems = [
    { label: t.header.nav.about, href: '/#nosotros' },
    { label: t.header.nav.expertise, href: '/#expertise' },
    { label: t.header.nav.work, href: '/#trabajo' },
    { label: t.header.nav.contact, href: '/#contacto' },
  ];

  // ── Show/hide on scroll direction ──
  useEffect(() => {
    if (!headerRef.current) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        start: 'top -100',
        onUpdate: (self) => {
          const direction = self.direction;
          if (direction === 1 && self.scroll() > 200) {
            // Scrolling down — hide
            setIsVisible(false);
          } else {
            // Scrolling up — show
            setIsVisible(true);
          }
        },
      });
    });

    return () => ctx.revert();
  }, []);

  // ── Entrance animation ──
  useEffect(() => {
    if (!headerRef.current) return;

    gsap.set(headerRef.current, { yPercent: -100, opacity: 0 });
    gsap.to(headerRef.current, {
      yPercent: 0,
      opacity: 1,
      duration: 1,
      delay: 1.8,
      ease: 'expo.out',
    });
  }, []);

  return (
    <>
      <header
        ref={headerRef}
        className={`${styles.header} ${isVisible ? styles.visible : styles.hidden}`}
      >
        <div className={styles.inner}>
          {/* Logo */}
          <a href="/#hero" className={styles.logo}>
            MARA<span className={styles.logoAccent}>.</span>
          </a>

          {/* Navigation */}
          <nav className={styles.nav}>
            {navItems.map((item) => (
              <a key={item.href} href={item.href} className={styles.navLink}>
                {item.label}
              </a>
            ))}
          </nav>

          {/* Controls (Lang Switcher + CTA + Menu Button) */}
          <div className={styles.rightControls}>
            <div className={styles.langSwitch} role="group" aria-label="Language selection">
              <button
                type="button"
                onClick={() => setLocale('es')}
                className={`${styles.langBtn} ${locale === 'es' ? styles.activeLang : ''}`}
                aria-pressed={locale === 'es'}
              >
                ES
              </button>
              <span className={styles.langSeparator}>·</span>
              <button
                type="button"
                onClick={() => setLocale('en')}
                className={`${styles.langBtn} ${locale === 'en' ? styles.activeLang : ''}`}
                aria-pressed={locale === 'en'}
              >
                EN
              </button>
            </div>

            <div className={styles.headerCta}>
              <MagneticButton href="/#contacto" strength={0.2} size="sm">
                {t.header.cta}
              </MagneticButton>
            </div>

            <button
              className={`${styles.menuButton} ${menuOpen ? styles.menuOpen : ''}`}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menu"
            >
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Overlay */}
      <nav
        className={`${styles.mobileNav} ${menuOpen ? styles.mobileNavOpen : ''}`}
      >
        {navItems.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className={styles.mobileNavLink}
            onClick={() => setMenuOpen(false)}
          >
            {item.label}
          </a>
        ))}

        <div className={styles.mobileLangSwitch}>
          <button
            type="button"
            onClick={() => setLocale('es')}
            className={`${styles.langBtn} ${locale === 'es' ? styles.activeLang : ''}`}
          >
            ES
          </button>
          <span className={styles.langSeparator}>·</span>
          <button
            type="button"
            onClick={() => setLocale('en')}
            className={`${styles.langBtn} ${locale === 'en' ? styles.activeLang : ''}`}
          >
            EN
          </button>
        </div>
      </nav>
    </>
  );
}

