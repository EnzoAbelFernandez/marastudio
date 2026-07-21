'use client';

import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap-config';

type GSAPCallback = (ctx: gsap.Context) => void | (() => void);

/**
 * Creates a scoped GSAP context tied to a container ref.
 * All GSAP animations created inside the callback are automatically
 * reverted on component unmount — preventing memory leaks.
 *
 * @param callback - Receives GSAP context. Return a cleanup function if needed.
 * @param deps - Dependency array, same semantics as useEffect.
 * @returns Ref to attach to the container element.
 */
export function useGSAP(
  callback: GSAPCallback,
  deps: React.DependencyList = []
) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cleanup = callback(ctx);
      if (cleanup && typeof cleanup === 'function') {
        ctx.add(cleanup);
      }
    }, containerRef);

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach((t) => {
        if (containerRef.current?.contains(t.trigger as Element)) {
          t.kill();
        }
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return containerRef;
}
