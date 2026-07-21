'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useMouse } from '@/hooks/useMouse';
import { PARTICLES } from '@/lib/constants';

// Import shaders as raw strings
import vertexShader from './shaders/particle.vert';
import fragmentShader from './shaders/particle.frag';

/**
 * Interactive particle field that responds to mouse movement.
 *
 * Architecture:
 * - Uses BufferGeometry + Points for maximum GPU performance
 * - Custom shaders handle noise-based drift and mouse repulsion
 * - All position updates happen on GPU (vertex shader) — zero CPU overhead per frame
 * - Only uniform updates (time, mouse) happen per frame in JS
 */
export function ParticleField() {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const mouse = useMouse({ lerp: 0.06 });

  // ── Generate particle positions ──
  const { positions, randoms } = useMemo(() => {
    const count = PARTICLES.count;
    const pos = new Float32Array(count * 3);
    const rand = new Float32Array(count);
    const radius = PARTICLES.radius;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      // Distribute in an ellipsoid (wider than tall, thinner in Z)
      // Using rejection sampling for uniform distribution
      let x, y, z;
      do {
        x = (Math.random() - 0.5) * 2;
        y = (Math.random() - 0.5) * 2;
        z = (Math.random() - 0.5) * 2;
      } while (x * x + y * y + z * z > 1);

      pos[i3] = x * radius * 1.6;      // Wide
      pos[i3 + 1] = y * radius * 0.9;  // Shorter vertically
      pos[i3 + 2] = z * radius * 0.5;  // Shallow in depth

      rand[i] = Math.random();
    }

    return { positions: pos, randoms: rand };
  }, []);

  // ── Shader uniforms ──
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
    }),
    []
  );

  // ── Per-frame update (runs at display refresh rate) ──
  useFrame((state) => {
    if (!materialRef.current) return;

    materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    materialRef.current.uniforms.uMouse.value.set(
      mouse.current.smoothX,
      mouse.current.smoothY
    );
  });

  // ── Create buffer attributes imperatively for type safety ──
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
