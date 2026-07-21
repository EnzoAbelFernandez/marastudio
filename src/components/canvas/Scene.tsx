'use client';

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { ParticleField } from './ParticleField';
import styles from './Scene.module.css';

/**
 * R3F Canvas wrapper with optimized performance settings.
 *
 * - dpr capped at 1.5 to prevent GPU strain on high-DPI displays
 * - Antialias disabled (particles don't benefit, saves GPU)
 * - Alpha enabled for transparent background (composites over CSS bg)
 * - Camera positioned for optimal particle field viewing
 */
export function Scene() {
  return (
    <div className={styles.container} aria-hidden="true">
      <Canvas
        dpr={[1, 1.5]}
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        camera={{
          fov: 45,
          near: 0.1,
          far: 100,
          position: [0, 0, 12],
        }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <ParticleField />
        </Suspense>
      </Canvas>
    </div>
  );
}
