'use client';

import { useRef, useCallback, useEffect, type ReactNode } from 'react';
import gsap from 'gsap';
import { EASINGS } from '@/lib/constants';
import styles from './MagneticButton.module.css';

interface MagneticButtonProps {
  children: ReactNode;
  /** Pull strength (0–1). Default: 0.3 */
  strength?: number;
  /** Size variant */
  size?: 'default' | 'sm' | 'lg';
  /** Additional className */
  className?: string;
  /** Click handler */
  onClick?: () => void;
  /** Render as link */
  href?: string;
}

/**
 * Button with a magnetic cursor-follow effect.
 * The inner content subtly moves toward the cursor when the pointer
 * is over the element. On leave, snaps back with elastic easing.
 */
export function MagneticButton({
  children,
  strength = 0.3,
  size = 'default',
  className = '',
  onClick,
  href,
}: MagneticButtonProps) {
  const buttonRef = useRef<HTMLButtonElement & HTMLAnchorElement>(null);
  const innerRef = useRef<HTMLSpanElement>(null);
  const boundingRef = useRef<DOMRect | null>(null);
  const isTouchDevice = useRef(false);

  useEffect(() => {
    isTouchDevice.current = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!buttonRef.current || !innerRef.current) return;

      // Recalculate on every move — fixes stale rect during layout shifts
      const bounds = buttonRef.current.getBoundingClientRect();
      const deltaX = e.clientX - (bounds.left + bounds.width / 2);
      const deltaY = e.clientY - (bounds.top + bounds.height / 2);

      // Update CSS variables for dynamic hover glow
      buttonRef.current.style.setProperty('--mouse-x', `${e.clientX - bounds.left}px`);
      buttonRef.current.style.setProperty('--mouse-y', `${e.clientY - bounds.top}px`);

      gsap.to(innerRef.current, {
        x: deltaX * strength,
        y: deltaY * strength,
        duration: 0.4,
        ease: EASINGS.micro,
      });
    },
    [strength]
  );

  const handleMouseEnter = useCallback(() => {
    if (buttonRef.current) {
      boundingRef.current = buttonRef.current.getBoundingClientRect();
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (!innerRef.current) return;
    gsap.to(innerRef.current, {
      x: 0,
      y: 0,
      duration: 0.7,
      ease: EASINGS.elastic,
    });
  }, []);

  useEffect(() => {
    const el = buttonRef.current;
    if (!el || isTouchDevice.current) return;

    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseenter', handleMouseEnter);
    el.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseenter', handleMouseEnter);
      el.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [handleMouseMove, handleMouseEnter, handleMouseLeave]);

  const inner = (
    <span ref={innerRef} className={styles.inner}>
      {children}
    </span>
  );

  const sizeClass = size === 'lg' ? styles.lg : size === 'sm' ? styles.sm : '';
  const classes = `${styles.magnetic} ${sizeClass} ${className}`.trim();

  if (href) {
    return (
      <a
        ref={buttonRef}
        href={href}
        className={classes}
        onClick={onClick}
      >
        {inner}
      </a>
    );
  }

  return (
    <button
      ref={buttonRef}
      type="button"
      className={classes}
      onClick={onClick}
    >
      {inner}
    </button>
  );
}
