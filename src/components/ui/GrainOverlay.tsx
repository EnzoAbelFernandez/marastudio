'use client';

import styles from './GrainOverlay.module.css';

/**
 * Full-page SVG noise texture overlay.
 *
 * Adds analog film grain to the entire page — barely visible at
 * --noise-opacity (0.035) but creates depth and tactile quality
 * that a flat #050505 background cannot achieve on its own.
 *
 * The SVG filter generates turbulence noise at render time,
 * so no external image assets are needed.
 */
export function GrainOverlay() {
  return (
    <div className={styles.grain} aria-hidden="true">
      <svg width="0" height="0">
        <filter id="grain-filter">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.65"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
      </svg>
    </div>
  );
}
