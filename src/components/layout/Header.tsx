'use client';

import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MagneticButton } from '@/components/ui/MagneticButton';
import styles from './Header.module.css';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const NAV_ITEMS = [
  { label: 'Nosotros', href: '/#nosotros' },
  { label: 'Expertise', href: '/#expertise' },
  { label: 'Trabajo', href: '/#trabajo' },
  { label: 'Contacto', href: '/#contacto' },
];

/**
 * Sticky header that hides on scroll-down and shows on scroll-up.
 * Uses a backdrop blur for glassmorphism effect.
 * Entrance animation syncs with the Hero timeline.
 */
export function Header() {
  const headerRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const lastScrollY = useRef(0);

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
            {NAV_ITEMS.map((item) => (
              <a key={item.href} href={item.href} className={styles.navLink}>
                {item.label}
              </a>
            ))}
          </nav>

          {/* CTA */}
          <div className={styles.headerCta}>
            <MagneticButton href="/#contacto" strength={0.2} size="sm">
              Hablemos
            </MagneticButton>
          </div>

          {/* Mobile Menu Button */}
          <button
            className={`${styles.menuButton} ${menuOpen ? styles.menuOpen : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            <span />
            <span />
          </button>
        </div>
      </header>

      {/* Mobile Navigation Overlay */}
      <nav
        className={`${styles.mobileNav} ${menuOpen ? styles.mobileNavOpen : ''}`}
      >
        {NAV_ITEMS.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className={styles.mobileNavLink}
            onClick={() => setMenuOpen(false)}
          >
            {item.label}
          </a>
        ))}
      </nav>
    </>
  );
}
