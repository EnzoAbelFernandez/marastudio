'use client';

import { useRef, useMemo, useEffect, useState, RefObject } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useMouse } from '@/hooks/useMouse';
import { PARTICLES, PARTICLES_MOBILE, ACCENT } from '@/lib/constants';
import { useTextFlowField } from '@/hooks/useTextFlowField';

import vertexShader from './shaders/particle.vert';
import fragmentShader from './shaders/particle.frag';

interface ParticleFieldProps {
  textRef?: RefObject<HTMLElement | null>;
}

// Minimal continuous organic drift using combined sine waves
function getOrganicDrift(bx: number, by: number, bz: number, time: number, phase: number) {
  // Scale coordinates to get pleasing wave frequencies
  const sx = bx * 0.3 + phase;
  const sy = by * 0.3 + phase;
  const sz = bz * 0.3 + phase;
  const t = time * 0.3; // Speed of drift

  const dx = Math.sin(sx * 1.2 + t) + Math.cos(sy * 0.8 - t) + Math.sin(sz * 1.5 + t);
  const dy = Math.cos(sx * 0.9 - t) + Math.sin(sy * 1.3 + t) + Math.sin(sz * 0.7 - t * 0.8);
  const dz = Math.sin(sx * 1.5 + t) + Math.cos(sy * 1.1 - t) + Math.sin(sz * 1.3 + t);
  
  return { dx, dy, dz };
}

export function ParticleField({ textRef }: ParticleFieldProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const mouse = useMouse({ lerp: 0.1 }); // Fast lerp for responsive repulsion
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768);
  const particleConfig = isMobile ? PARTICLES_MOBILE : PARTICLES;
  
  // Custom hook computes the collision grid from the actual DOM text
  const flowField = useTextFlowField(textRef || { current: null }, 12);

  // Detect prefers-reduced-motion
  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mql.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  // CPU Particle Storage (SoA format)
  const { positions, basePositions, randoms, velocities } = useMemo(() => {
    const count = particleConfig.count;
    const pos = new Float32Array(count * 3);
    const base = new Float32Array(count * 3);
    const rand = new Float32Array(count);
    const vel = new Float32Array(count * 3);
    const radius = particleConfig.radius;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      let x, y, z;
      do {
        x = (Math.random() - 0.5) * 2;
        y = (Math.random() - 0.5) * 2;
        z = (Math.random() - 0.5) * 2;
      } while (x * x + y * y + z * z > 1);

      // Start positions
      base[i3] = pos[i3] = x * radius * 1.6;
      base[i3 + 1] = pos[i3 + 1] = y * radius * 0.9;
      base[i3 + 2] = pos[i3 + 2] = z * radius * 0.5;
      
      rand[i] = Math.random();
    }

    return { positions: pos, basePositions: base, randoms: rand, velocities: vel };
  }, []);

  const uniforms = useMemo(
    () => ({
      uPointSize: { value: particleConfig.size },
      uPixelRatio: { value: typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 2) : 1 },
      uAccentColor: { value: new THREE.Color(...ACCENT.rgb) },
      uAccentMix: { value: ACCENT.glowMix },
    }),
    []
  );

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('aBasePosition', new THREE.BufferAttribute(basePositions, 3));
    geo.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1));
    
    // We update influence to tint particles that get perturbed
    geo.setAttribute('aInfluence', new THREE.BufferAttribute(new Float32Array(particleConfig.count), 1));
    return geo;
  }, [positions, basePositions, randoms]);

  // CPU Physics Loop
  useFrame((state) => {
    if (!geometry || reducedMotion) return;

    const pos = geometry.attributes.position.array as Float32Array;
    const infl = geometry.attributes.aInfluence.array as Float32Array;
    
    const count = particleConfig.count;
    const time = state.clock.elapsedTime;
    
    // Mouse coords in WebGL space (-5 to 5 horizontally roughly)
    const mx = mouse.current.smoothX * 5.0;
    const my = mouse.current.smoothY * 3.0;
    
    // Physics configs - tweaked for natural floating and residual momentum
    const mouseRadius = particleConfig.mouseRadius;
    const mouseStrength = particleConfig.mouseInfluence * 0.035; 
    const spring = 0.003;  // Very soft spring allows them to drift away and return slowly
    const damping = 0.93;  // Less friction preserves residual movement longer

    // Viewport to screen mapping for Flow Field
    const w = window.innerWidth;
    const h = window.innerHeight;
    const webglToScreenX = (x: number) => (x / 5.0) * (w / 2) + (w / 2);
    const webglToScreenY = (y: number) => (-y / 3.0) * (h / 2) + (h / 2);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      const bx = basePositions[i3];
      const by = basePositions[i3 + 1];
      const bz = basePositions[i3 + 2];
      
      let cx = pos[i3];
      let cy = pos[i3 + 1];
      let cz = pos[i3 + 2];
      
      let vx = velocities[i3];
      let vy = velocities[i3 + 1];
      let vz = velocities[i3 + 2];
      
      let currentInfluence = 0;

      // ── Ambient Organic Drift ──
      // Calculate a drifting target position instead of a rigid base position
      const phase = randoms[i] * Math.PI * 2;
      const drift = getOrganicDrift(bx, by, bz, time, phase);
      
      // Target wanders smoothly by up to ~0.3 WebGL units around the base
      const targetX = bx + drift.dx * 0.3;
      const targetY = by + drift.dy * 0.3;
      const targetZ = bz + drift.dz * 0.3;

      // ── Text Collision (Flow Field) ──
      if (flowField) {
        const sx = webglToScreenX(cx);
        const sy = webglToScreenY(cy);
        const force = flowField.getForce(sx, sy);
        
        if (force.dx !== 0 || force.dy !== 0) {
          // Map screen force vector back to WebGL coords
          // (dx is same sign, dy is inverted because WebGL Y goes UP)
          vx += force.dx * 0.015;
          vy -= force.dy * 0.015; 
          currentInfluence = Math.max(currentInfluence, 0.3);
        }
      }

      // ── Mouse Repulsion ──
      const dx = cx - mx;
      const dy = cy - my;
      const distSq = dx * dx + dy * dy;
      
      if (distSq < mouseRadius * mouseRadius) {
        const dist = Math.sqrt(distSq);
        const norm = 1.0 - (dist / mouseRadius);
        const force = norm * norm * mouseStrength;
        
        vx += (dx / dist) * force;
        vy += (dy / dist) * force;
        currentInfluence = Math.max(currentInfluence, norm);
      }

      // ── Spring to wandering target ──
      vx += (targetX - cx) * spring;
      vy += (targetY - cy) * spring;
      vz += (targetZ - cz) * spring;

      // ── Integrate ──
      vx *= damping;
      vy *= damping;
      vz *= damping;

      velocities[i3] = vx;
      velocities[i3 + 1] = vy;
      velocities[i3 + 2] = vz;

      pos[i3] += vx;
      pos[i3 + 1] += vy;
      pos[i3 + 2] += vz;
      
      infl[i] = currentInfluence;
    }

    geometry.attributes.position.needsUpdate = true;
    geometry.attributes.aInfluence.needsUpdate = true;
  });

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
