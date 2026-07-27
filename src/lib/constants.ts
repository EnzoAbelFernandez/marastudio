// ─────────────────────────────────────────────
// Mara Studio — Design System Constants
// ─────────────────────────────────────────────

/**
 * Named easing curves — differentiated by movement type.
 *
 * The goal is that no two structurally different animations
 * feel the same. Each category has a distinct character.
 */
export const EASINGS = {
  /** Impact: overshoot for weight. Hero char-reveal, headings landing. */
  impact: 'back.out(1.4)',
  /** Reveal: neutral, informational. Expertise cards, content fade-in. */
  reveal: 'quart.out',
  /** Micro: dry, no drama. Hover states, small UI changes. */
  micro: 'power2.out',
  /** Scrub: linear, scroll-driven. Never add easing to scrubbed anims. */
  scrub: 'none',
  /** Elastic: preserved from MagneticButton — the site's motion signature. */
  elastic: 'elastic.out(1, 0.3)',
  /** Overlay: symmetric in-out for curtain/overlay transitions. */
  overlay: 'power2.inOut',
} as const;

/** Standard animation durations in seconds */
export const DURATIONS = {
  fast: 0.35,
  normal: 0.7,
  slow: 1.0,
  xslow: 1.6,
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

/** Accent color — desaturated warm amber / bronze */
export const ACCENT = {
  hex: '#b8956a',
  rgb: [0.722, 0.584, 0.416] as const,
  glowMix: 0.1,
} as const;
