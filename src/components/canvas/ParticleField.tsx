'use client';

import { useRef, useMemo, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useMouse } from '@/hooks/useMouse';
import { PARTICLES, ACCENT } from '@/lib/constants';

import vertexShader from './shaders/particle.vert';
import fragmentShader from './shaders/particle.frag';

/**
 * Interactive particle field that responds to mouse movement.
 *
 * Architecture:
 * - BufferGeometry + Points for maximum GPU performance
 * - Custom shaders: noise drift + mouse repulsion on GPU
 * - Only uniform updates (time, mouse) happen per frame in JS
 * - Accent color tint appears on particles near cursor (subliminal)
 * - prefers-reduced-motion zeroes ambient noise drift
 */
export function ParticleField() {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const mouse = useMouse({ lerp: 0.06 });
  const [reducedMotion, setReducedMotion] = useState(false);

  // Detect prefers-reduced-motion
  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mql.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  const { positions, randoms } = useMemo(() => {
    const count = PARTICLES.count;
    const pos = new Float32Array(count * 3);
    const rand = new Float32Array(count);
    const radius = PARTICLES.radius;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      let x, y, z;
      do {
        x = (Math.random() - 0.5) * 2;
        y = (Math.random() - 0.5) * 2;
        z = (Math.random() - 0.5) * 2;
      } while (x * x + y * y + z * z > 1);

      pos[i3] = x * radius * 1.6;
      pos[i3 + 1] = y * radius * 0.9;
      pos[i3 + 2] = z * radius * 0.5;
      rand[i] = Math.random();
    }

    return { positions: pos, randoms: rand };
  }, []);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uMouseRadius: { value: PARTICLES.mouseRadius },
      uMouseStrength: { value: PARTICLES.mouseInfluence },
      uNoiseScale: { value: PARTICLES.noiseScale },
      uNoiseSpeed: { value: PARTICLES.noiseSpeed },
      uPointSize: { value: PARTICLES.size },
      uPixelRatio: { value: typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 2) : 1 },
      uReducedMotion: { value: 0.0 },
      uAccentColor: { value: new THREE.Color(...ACCENT.rgb) },
      uAccentMix: { value: ACCENT.glowMix },
    }),
    []
  );

  useFrame((state) => {
    if (!materialRef.current) return;

    materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    materialRef.current.uniforms.uMouse.value.set(
      mouse.current.smoothX,
      mouse.current.smoothY
    );
    materialRef.current.uniforms.uReducedMotion.value = reducedMotion ? 1.0 : 0.0;
  });

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('aBasePosition', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1));
    return geo;
  }, [positions, randoms]);

  return (
    <points ref={pointsRef} geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
