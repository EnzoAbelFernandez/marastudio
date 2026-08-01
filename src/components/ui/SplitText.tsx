'use client';

import { createElement, forwardRef, useMemo, useImperativeHandle, useRef } from 'react';
import styles from './SplitText.module.css';

interface SplitTextProps {
  children: string;
  /** 'chars' | 'words' | 'both' — how to split the text */
  mode?: 'chars' | 'words' | 'both';
  /** HTML element tag */
  as?: 'div' | 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'h4';
  /** Additional CSS class */
  className?: string;
}

export interface SplitTextRef {
  words: HTMLSpanElement[];
  chars: HTMLSpanElement[];
  root: HTMLElement | null;
}

/**
 * Splits text content into individually animatable <span> elements.
 * Access the `.words` and `.chars` arrays via ref for GSAP animations.
 *
 * Each character is wrapped in a clip container (overflow: hidden)
 * with an inner span that can be translated for reveal effects.
 */
export const SplitText = forwardRef<SplitTextRef, SplitTextProps>(
  function SplitText({ children, mode = 'both', as: tag = 'div', className = '' }, ref) {
    const rootRef = useRef<HTMLElement>(null);
    const wordRefs = useRef<HTMLSpanElement[]>([]);
    const charRefs = useRef<HTMLSpanElement[]>([]);

    // Reset ref arrays each render cycle
    wordRefs.current = [];
    charRefs.current = [];

    useImperativeHandle(ref, () => ({
      get words() { return wordRefs.current; },
      get chars() { return charRefs.current; },
      get root() { return rootRef.current; },
    }));

    const content = useMemo(() => {
      const words = children.split(' ');

      return words.map((word, wi) => {
        const isLast = wi === words.length - 1;

        if (mode === 'words') {
          return (
            <span
              key={wi}
              className={styles.word}
              ref={(el) => { if (el) wordRefs.current.push(el); }}
            >
              <span className={styles.wordInner}>{word}</span>
              {!isLast && '\u00A0'}
            </span>
          );
        }

        // 'chars' or 'both'
        const chars = word.split('').map((char, ci) => (
          <span
            key={`${wi}-${ci}`}
            className={styles.char}
            ref={(el) => { if (el) charRefs.current.push(el); }}
          >
            <span className={styles.charInner}>{char}</span>
          </span>
        ));

        return (
          <span
            key={wi}
            className={styles.word}
            ref={(el) => { if (el) wordRefs.current.push(el); }}
          >
            {chars}
            {!isLast && <span className={styles.char}>{'\u00A0'}</span>}
          </span>
        );
      });
    }, [children, mode]);

    // Use createElement to avoid JSX type inference issues with dynamic tags in React 19
    return createElement(
      tag,
      {
        ref: rootRef,
        className: `${styles.splitText} ${className}`,
      },
      <span key="sr" className="sr-only">{children}</span>,
      <span key="content" aria-hidden="true" style={{ display: 'contents' }}>{content}</span>
    );
  }
);
