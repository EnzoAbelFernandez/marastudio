'use client';

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './HoverImageCycler.module.css';

interface HoverImageCyclerProps {
  images: string[];
  alt?: string;
  fallbackGradient?: string;
}

/**
 * A highly interactive image thumbnail cycler.
 * It tracks the mouse X position when hovering and maps it to the array of images,
 * creating a "scrubbing" effect through project screenshots.
 */
export function HoverImageCycler({ 
  images, 
  alt = 'Project screenshot', 
  fallbackGradient = 'linear-gradient(45deg, #050505, #111)' 
}: HoverImageCyclerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // If no images provided, show fallback
  if (!images || images.length === 0) {
    return (
      <div 
        className={styles.container} 
        style={{ background: fallbackGradient }}
      />
    );
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    
    // Calculate relative mouse position (0 to 1)
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const progress = Math.max(0, Math.min(1, x / rect.width));
    
    // Map progress to array index
    const index = Math.min(
      Math.floor(progress * images.length), 
      images.length - 1
    );
    
    setActiveIndex(index);
  };

  const handleMouseLeave = () => {
    // Reset to the first image when leaving
    setActiveIndex(0);
  };

  useEffect(() => {
    // Auto-cycle images on mobile to avoid touchmove conflicts with horizontal scroll
    if (typeof window !== 'undefined' && window.innerWidth < 768 && images.length > 1) {
      const interval = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % images.length);
      }, 2500);
      return () => clearInterval(interval);
    }
  }, [images.length]);

  return (
    <div 
      ref={containerRef}
      className={styles.container}
      style={{ background: fallbackGradient }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {images.map((src, i) => (
        <div 
          key={src} 
          className={`${styles.imageWrapper} ${i === activeIndex ? styles.active : ''}`}
        >
          <Image
            src={src}
            alt={`${alt} - View ${i + 1}`}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className={styles.image}
            priority={i === 0} // Only preload the first one
            unoptimized={true} // Bypasses slow dev server optimization
          />
        </div>
      ))}
      
      {/* Interactive indicators (dots) */}
      {images.length > 1 && (
        <div className={styles.indicators}>
          {images.map((_, i) => (
            <div 
              key={i} 
              className={`${styles.dot} ${i === activeIndex ? styles.dotActive : ''}`} 
            />
          ))}
        </div>
      )}
    </div>
  );
}
