// ─────────────────────────────────────────────
// Mara Studio — Design System Constants
// ─────────────────────────────────────────────

/** Named easing curves used across all animations */
export const EASINGS = {
  /** Primary easing — smooth exponential deceleration */
  outExpo: 'expo.out',
  /** Secondary easing — elegant quartic deceleration */
  outQuart: 'quart.out',
  /** Cubic in-out for symmetric transitions */
  inOutCubic: 'cubic.inOut',
  /** Elastic for magnetic button snap-back */
  outElastic: 'elastic.out(1, 0.3)',
  /** Back easing for playful overshoots */
  outBack: 'back.out(1.7)',
  /** CSS cubic-bezier equivalents for CSS transitions */
  css: {
    outExpo: 'cubic-bezier(0.16, 1, 0.3, 1)',
    outQuart: 'cubic-bezier(0.25, 1, 0.5, 1)',
  },
} as const;

/** Standard animation durations in seconds */
export const DURATIONS = {
  fast: 0.4,
  normal: 0.8,
  slow: 1.2,
  xslow: 1.8,
} as const;

/** Stagger intervals for sequenced animations */
export const STAGGER = {
  fast: 0.02,
  normal: 0.04,
  slow: 0.08,
} as const;

/** Responsive breakpoints in pixels */
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1440,
  xxl: 1920,
} as const;

/** WebGL particle field configuration */
export const PARTICLES = {
  count: 4000,
  size: 1.8,
  radius: 6,
  mouseInfluence: 2.0,
  mouseRadius: 2.5,
  noiseScale: 0.003,
  noiseSpeed: 0.12,
} as const;
