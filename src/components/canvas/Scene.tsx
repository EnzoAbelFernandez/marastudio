'use client';

import { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { ParticleField } from './ParticleField';
import styles from './Scene.module.css';

interface SceneProps {
  textRef?: React.RefObject<HTMLElement | null>;
}

/**
 * R3F Canvas wrapper with optimized performance settings.
 *
 * - dpr capped at 1.5 on desktop, 1 on mobile to save GPU
 * - Antialias disabled (particles don't benefit, saves GPU)
 * - Alpha enabled for transparent background (composites over CSS bg)
 * - Camera positioned for optimal particle field viewing
 */
export function Scene({ textRef }: SceneProps) {
  const [isMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768);
  
  return (
    <div className={styles.container} aria-hidden="true">
      <Canvas
        dpr={isMobile ? 1 : [1, 1.5]}
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
          <ParticleField textRef={textRef} />
        </Suspense>
      </Canvas>
    </div>
  );
}
