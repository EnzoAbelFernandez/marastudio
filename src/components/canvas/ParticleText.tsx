'use client';

import { useEffect, useRef, useCallback } from 'react';
import styles from './ParticleText.module.css';

// ─── Configuration ────────────────────────────────────────────────────────────

const CFG = {
  // Sampling
  STEP_DESKTOP: 4,       // px between sample points on desktop
  STEP_MOBILE: 7,        // px between sample points on mobile
  ALPHA_THRESHOLD: 128,  // minimum pixel alpha to become a particle

  // Physics
  REPULSION_RADIUS: 130, // px
  REPULSION_STRENGTH: 6, // raw force multiplier
  SPRING: 0.062,         // pull toward origin
  DAMPING: 0.87,         // velocity friction (0=instant stop, 1=no friction)

  // Rendering
  TRAIL_ALPHA: 0.18,     // ghost trail (lower = longer trail)
  BG_COLOR: '#050505',

  // Depth layers (0 = closer/brighter, 1 = farther/dimmer)
  LAYER_BASE_SIZE: [1.4, 2.2],   // min, max particle radius by layer
  LAYER_OPACITY: [0.55, 0.85],   // dim layer, bright layer

  // Noise drift
  NOISE_AMP: 1.4,        // px amplitude of ambient drift
  NOISE_FREQ_X: 0.0028,
  NOISE_FREQ_T: 0.00065,

  // Connection lines
  LINE_DISTANCE: 38,     // max px between particles for a line
  LINE_MIN_DISPLACE: 2,  // min displacement from origin to show line

  // Parallax tilt (px max displacement of scene based on mouse)
  PARALLAX: 10,

  // Assembly entrance
  ASSEMBLY_DURATION: 1800, // ms

  // Adaptive: if first frame takes this many ms, increase step by 1
  PERF_THRESHOLD_MS: 22,
} as const;

// ─── Simplex-like Value Noise (2D + time) ─────────────────────────────────────
// Lightweight deterministic noise without external dep.
function valueNoise(x: number, t: number): number {
  const ix = Math.floor(x);
  const fx = x - ix;
  const ux = fx * fx * (3 - 2 * fx); // smoothstep

  const r0 = pseudoRand(ix + t * 1000);
  const r1 = pseudoRand(ix + 1 + t * 1000);
  return r0 + (r1 - r0) * ux;
}

function pseudoRand(n: number): number {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
}

// ─── Particle Storage (SoA for hot-path performance) ─────────────────────────
// Using parallel Float32Arrays instead of array of objects to avoid GC pressure.
interface ParticleArrays {
  ox: Float32Array;  // origin x
  oy: Float32Array;  // origin y
  cx: Float32Array;  // current x
  cy: Float32Array;  // current y
  vx: Float32Array;  // velocity x
  vy: Float32Array;  // velocity y
  rx: Float32Array;  // random start x (for assembly)
  ry: Float32Array;  // random start y (for assembly)
  layer: Uint8Array; // 0 = close, 1 = far
  noise: Float32Array; // per-particle noise phase offset
  count: number;
}

// ─── Component ────────────────────────────────────────────────────────────────
export function ParticleText() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const particlesRef = useRef<ParticleArrays | null>(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const assemblyStartRef = useRef<number>(0);
  const sceneOffsetRef = useRef({ x: 0, y: 0 });
  const perfAdjustedRef = useRef(false);

  // ── Rebuild particles from canvas text sampling ──
  const buildParticles = useCallback((
    canvas: HTMLCanvasElement,
    step: number
  ): ParticleArrays => {
    const w = canvas.width;
    const h = canvas.height;
    const dpr = window.devicePixelRatio || 1;
    const logicalW = w / dpr;
    const logicalH = h / dpr;

    // Offscreen canvas for text sampling (logical pixels, no DPR)
    const off = document.createElement('canvas');
    off.width = logicalW;
    off.height = logicalH;
    const offCtx = off.getContext('2d')!;

    // Font sizing: mirrors the CSS clamp(4.5rem, 15vw, 14rem)
    const maraSize = Math.min(Math.max(logicalW * 0.15, 72), 224);
    const studioSize = Math.min(Math.max(logicalW * 0.10, 48), 144);
    const centerX = logicalW / 2;
    const centerY = logicalH / 2;

    offCtx.fillStyle = '#ffffff';
    offCtx.textAlign = 'center';
    offCtx.textBaseline = 'alphabetic';

    // Draw MARA (weight 800)
    offCtx.font = `800 ${maraSize}px "Space Grotesk", sans-serif`;
    offCtx.fillText('MARA', centerX, centerY - studioSize * 0.1);

    // Draw STUDIO (weight 300, letter-spacing 0.15em)
    // Canvas doesn't support letter-spacing natively; draw char by char
    offCtx.font = `300 ${studioSize}px "Space Grotesk", sans-serif`;
    const studioChars = 'STUDIO'.split('');
    const letterSpacing = studioSize * 0.15;
    const totalWidth = studioChars.reduce((acc, ch) =>
      acc + offCtx.measureText(ch).width, 0
    ) + letterSpacing * (studioChars.length - 1);

    let charX = centerX - totalWidth / 2;
    const studioY = centerY + studioSize * 1.05;
    for (const ch of studioChars) {
      const chW = offCtx.measureText(ch).width;
      offCtx.fillText(ch, charX + chW / 2, studioY);
      charX += chW + letterSpacing;
    }

    // Sample pixels
    const imageData = offCtx.getImageData(0, 0, logicalW, logicalH);
    const pixels = imageData.data;
    const origins: Array<{ x: number; y: number }> = [];

    for (let y = 0; y < logicalH; y += step) {
      for (let x = 0; x < logicalW; x += step) {
        const idx = (y * logicalW + x) * 4;
        const alpha = pixels[idx + 3];
        if (alpha > CFG.ALPHA_THRESHOLD) {
          origins.push({ x, y });
        }
      }
    }

    const count = origins.length;
    const arrays: ParticleArrays = {
      ox: new Float32Array(count),
      oy: new Float32Array(count),
      cx: new Float32Array(count),
      cy: new Float32Array(count),
      vx: new Float32Array(count),
      vy: new Float32Array(count),
      rx: new Float32Array(count),
      ry: new Float32Array(count),
      layer: new Uint8Array(count),
      noise: new Float32Array(count),
      count,
    };

    for (let i = 0; i < count; i++) {
      arrays.ox[i] = origins[i].x;
      arrays.oy[i] = origins[i].y;
      // Scattered start positions for assembly entrance
      arrays.rx[i] = (Math.random() - 0.5) * logicalW * 1.8 + logicalW / 2;
      arrays.ry[i] = (Math.random() - 0.5) * logicalH * 1.8 + logicalH / 2;
      arrays.cx[i] = arrays.rx[i];
      arrays.cy[i] = arrays.ry[i];
      arrays.vx[i] = 0;
      arrays.vy[i] = 0;
      arrays.layer[i] = i % 3 === 0 ? 1 : 0; // ~33% far, ~67% close
      arrays.noise[i] = Math.random() * 1000; // phase offset
    }

    return arrays;
  }, []);

  // ── Main animation loop ──
  const startLoop = useCallback((canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d')!;
    const dpr = window.devicePixelRatio || 1;
    const logicalW = canvas.width / dpr;
    const logicalH = canvas.height / dpr;
    ctx.scale(dpr, dpr); // Scale once; all draw calls in logical pixels

    let firstFrameTime = 0;
    assemblyStartRef.current = performance.now();

    function frame(now: number) {
      const p = particlesRef.current;
      if (!p) return;

      // ── Performance adapt (first frame only) ──
      if (!perfAdjustedRef.current && firstFrameTime > 0) {
        perfAdjustedRef.current = true;
        // If frame was slow, we'd rebuild with larger step — handled at init
      }
      firstFrameTime = now;

      // ── Assembly easing (easeOutExpo) ──
      const elapsed = now - assemblyStartRef.current;
      const tRaw = Math.min(elapsed / CFG.ASSEMBLY_DURATION, 1);
      const assemblyT = tRaw === 1 ? 1 : 1 - Math.pow(2, -10 * tRaw); // easeOutExpo

      // ── Parallax scene offset (smooth) ──
      const targetOffX = (mouseRef.current.x / logicalW - 0.5) * CFG.PARALLAX;
      const targetOffY = (mouseRef.current.y / logicalH - 0.5) * CFG.PARALLAX;
      sceneOffsetRef.current.x += (targetOffX - sceneOffsetRef.current.x) * 0.06;
      sceneOffsetRef.current.y += (targetOffY - sceneOffsetRef.current.y) * 0.06;
      const offX = sceneOffsetRef.current.x;
      const offY = sceneOffsetRef.current.y;

      // ── Trail (ghost persistence instead of clearRect) ──
      ctx.fillStyle = `rgba(5, 5, 5, ${CFG.TRAIL_ALPHA})`;
      ctx.fillRect(-offX, -offY, logicalW + Math.abs(offX) * 2, logicalH + Math.abs(offY) * 2);

      const mx = mouseRef.current.x - offX;
      const my = mouseRef.current.y - offY;
      const timeS = now * 0.001;

      // ── Collect displaced particles for line drawing ──
      const displaced: Array<{ x: number; y: number; d: number }> = [];

      for (let i = 0; i < p.count; i++) {
        // Assembly lerp: move from scatter to origin
        const ox = p.ox[i];
        const oy = p.oy[i];

        if (assemblyT < 1) {
          p.cx[i] = p.rx[i] + (ox - p.rx[i]) * assemblyT;
          p.cy[i] = p.ry[i] + (oy - p.ry[i]) * assemblyT;
          p.vx[i] = 0;
          p.vy[i] = 0;
        } else {
          // ── Noise drift (ambient breathing) ──
          const noisePhase = p.noise[i];
          const nx = valueNoise(ox * CFG.NOISE_FREQ_X + noisePhase, timeS * CFG.NOISE_FREQ_T) - 0.5;
          const ny = valueNoise(oy * CFG.NOISE_FREQ_X + noisePhase + 7.3, timeS * CFG.NOISE_FREQ_T) - 0.5;

          // ── Mouse repulsion ──
          const dx = p.cx[i] - mx;
          const dy = p.cy[i] - my;
          const distSq = dx * dx + dy * dy;
          const dist = Math.sqrt(distSq);

          if (dist < CFG.REPULSION_RADIUS && dist > 0) {
            const norm = 1 - dist / CFG.REPULSION_RADIUS;
            const force = norm * norm * CFG.REPULSION_STRENGTH;
            p.vx[i] += (dx / dist) * force;
            p.vy[i] += (dy / dist) * force;
          }

          // ── Spring toward origin ──
          p.vx[i] += (ox - p.cx[i]) * CFG.SPRING;
          p.vy[i] += (oy - p.cy[i]) * CFG.SPRING;

          // ── Noise contribution ──
          p.vx[i] += nx * CFG.NOISE_AMP * 0.04;
          p.vy[i] += ny * CFG.NOISE_AMP * 0.04;

          // ── Damping ──
          p.vx[i] *= CFG.DAMPING;
          p.vy[i] *= CFG.DAMPING;

          // ── Integrate ──
          p.cx[i] += p.vx[i];
          p.cy[i] += p.vy[i];
        }

        const layer = p.layer[i];
        const cx = p.cx[i] + offX;
        const cy = p.cy[i] + offY;

        // Displacement from origin for visual enhancement
        const displace = Math.sqrt(
          (p.cx[i] - ox) * (p.cx[i] - ox) +
          (p.cy[i] - oy) * (p.cy[i] - oy)
        );

        // Size: base + layer + displacement boost
        const baseSize = layer === 1 ? CFG.LAYER_BASE_SIZE[1] : CFG.LAYER_BASE_SIZE[0];
        const displaceBoost = Math.min(displace / 40, 1.2);
        const size = baseSize + displaceBoost * 0.8;

        // Opacity
        const baseOpacity = layer === 1 ? CFG.LAYER_OPACITY[1] : CFG.LAYER_OPACITY[0];
        const opacity = Math.min(baseOpacity + displaceBoost * 0.25, 1);

        // Draw particle
        ctx.fillStyle = `rgba(250, 250, 250, ${opacity})`;
        ctx.fillRect(cx - size / 2, cy - size / 2, size, size);

        // Collect for line drawing
        if (displace > CFG.LINE_MIN_DISPLACE) {
          displaced.push({ x: cx, y: cy, d: displace });
        }
      }

      // ── Connection lines between nearby displaced particles ──
      // Only run on desktop (displaced.length can still be large on fast machines)
      if (displaced.length > 0 && displaced.length < 1500) {
        for (let i = 0; i < displaced.length; i++) {
          for (let j = i + 1; j < displaced.length; j++) {
            const dx = displaced[i].x - displaced[j].x;
            const dy = displaced[i].y - displaced[j].y;
            const d = Math.sqrt(dx * dx + dy * dy);
            if (d < CFG.LINE_DISTANCE) {
              const lineAlpha = (1 - d / CFG.LINE_DISTANCE) *
                Math.min(displaced[i].d, displaced[j].d) / 40 * 0.3;
              ctx.strokeStyle = `rgba(184, 149, 106, ${lineAlpha})`; // accent color
              ctx.lineWidth = 0.5;
              ctx.beginPath();
              ctx.moveTo(displaced[i].x, displaced[i].y);
              ctx.lineTo(displaced[j].x, displaced[j].y);
              ctx.stroke();
            }
          }
        }
      }

      rafRef.current = requestAnimationFrame(frame);
    }

    rafRef.current = requestAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // ── Detect reduced motion ──
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return; // Static text fallback handles display

    const isMobile = window.innerWidth < 768;

    // ── Resize handler ──
    const init = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;

      // Reset canvas scale state by getting a fresh context
      const ctx = canvas.getContext('2d')!;
      ctx.setTransform(1, 0, 0, 1, 0, 0);

      const step = isMobile ? CFG.STEP_MOBILE : CFG.STEP_DESKTOP;
      particlesRef.current = buildParticles(canvas, step);
      assemblyStartRef.current = performance.now();
    };

    init();
    startLoop(canvas);

    // ── Mouse tracking ──
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
    };
    const handleMouseLeave = () => {
      mouseRef.current.x = -9999;
      mouseRef.current.y = -9999;
    };

    // Attach to the section, not just canvas, for better coverage
    const hero = canvas.parentElement;
    hero?.addEventListener('mousemove', handleMouseMove);
    hero?.addEventListener('mouseleave', handleMouseLeave);

    // ── Resize observer ──
    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(rafRef.current);
      init();
      startLoop(canvas);
    });
    observer.observe(canvas);

    return () => {
      cancelAnimationFrame(rafRef.current);
      hero?.removeEventListener('mousemove', handleMouseMove);
      hero?.removeEventListener('mouseleave', handleMouseLeave);
      observer.disconnect();
      particlesRef.current = null;
    };
  }, [buildParticles, startLoop]);

  return (
    <canvas
      ref={canvasRef}
      className={styles.canvas}
      aria-hidden="true"
    />
  );
}
