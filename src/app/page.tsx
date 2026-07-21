import { Hero } from '@/components/sections/Hero';
import { Manifesto } from '@/components/sections/Manifesto';
import { Expertise } from '@/components/sections/Expertise';
import { CaseStudies } from '@/components/sections/CaseStudies';
import { Footer } from '@/components/layout/Footer';

/**
 * Landing page — Full composition of all sections.
 *
 * Flow:
 * 1. Hero — Full viewport, particles + massive typography
 * 2. Manifesto — Word-by-word scroll reveal
 * 3. Expertise — Asymmetric bento grid
 * 4. Case Studies — Horizontal scroll slider
 * 5. Footer — Massive CTA + contact info
 */
export default function Home() {
  return (
    <main>
      <Hero />
      <Manifesto />
      <Expertise />
      <CaseStudies />
      <Footer />
    </main>
  );
}
