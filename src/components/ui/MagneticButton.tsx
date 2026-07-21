'use client';

import { useRef, useCallback, useEffect, type ReactNode } from 'react';
import gsap from 'gsap';
import styles from './MagneticButton.module.css';

interface MagneticButtonProps {
  children: ReactNode;
  /** Pull strength (0–1). Default: 0.3 */
  strength?: number;
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
  className = '',
  onClick,
  href,
}: MagneticButtonProps) {
  const buttonRef = useRef<HTMLButtonElement & HTMLAnchorElement>(null);
  const innerRef = useRef<HTMLSpanElement>(null);
  const boundingRef = useRef<DOMRect | null>(null);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!buttonRef.current || !innerRef.current || !boundingRef.current) return;

      const { left, top, width, height } = boundingRef.current;
      const deltaX = e.clientX - (left + width / 2);
      const deltaY = e.clientY - (top + height / 2);

      gsap.to(innerRef.current, {
        x: deltaX * strength,
        y: deltaY * strength,
        duration: 0.4,
        ease: 'power2.out',
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
      ease: 'elastic.out(1, 0.3)',
    });
  }, []);

  useEffect(() => {
    const el = buttonRef.current;
    if (!el) return;

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

  if (href) {
    return (
      <a
        ref={buttonRef}
        href={href}
        className={`${styles.magnetic} ${className}`}
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
      className={`${styles.magnetic} ${className}`}
      onClick={onClick}
    >
      {inner}
    </button>
  );
}
