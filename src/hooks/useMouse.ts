'use client';

import { useEffect, useRef, useCallback } from 'react';

interface MouseState {
  /** Raw pixel X */
  x: number;
  /** Raw pixel Y */
  y: number;
  /** Normalized X (-1 to 1) */
  normalizedX: number;
  /** Normalized Y (-1 to 1, positive up) */
  normalizedY: number;
  /** Smoothed normalized X */
  smoothX: number;
  /** Smoothed normalized Y */
  smoothY: number;
}

interface UseMouseOptions {
  /** Lerp smoothing factor (0–1). Lower = smoother. Default: 0.08 */
  lerp?: number;
}

function lerpValue(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/**
 * Tracks mouse position with smooth interpolation.
 * Returns a mutable ref (no re-renders) — read inside useFrame, RAF, or event handlers.
 */
export function useMouse(options: UseMouseOptions = {}) {
  const { lerp: lerpFactor = 0.08 } = options;

  const state = useRef<MouseState>({
    x: 0,
    y: 0,
    normalizedX: 0,
    normalizedY: 0,
    smoothX: 0,
    smoothY: 0,
  });

  const rafId = useRef<number>(0);

  const updateSmooth = useCallback(() => {
    state.current.smoothX = lerpValue(
      state.current.smoothX,
      state.current.normalizedX,
      lerpFactor
    );
    state.current.smoothY = lerpValue(
      state.current.smoothY,
      state.current.normalizedY,
      lerpFactor
    );
    rafId.current = requestAnimationFrame(updateSmooth);
  }, [lerpFactor]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      state.current.x = e.clientX;
      state.current.y = e.clientY;
      state.current.normalizedX = (e.clientX / window.innerWidth) * 2 - 1;
      state.current.normalizedY = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    rafId.current = requestAnimationFrame(updateSmooth);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(rafId.current);
    };
  }, [updateSmooth]);

  return state;
}
