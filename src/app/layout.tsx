import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import { SmoothScroll } from '@/components/layout/SmoothScroll';
import { Header } from '@/components/layout/Header';
import { GrainOverlay } from '@/components/ui/GrainOverlay';
import { Preloader } from '@/components/ui/Preloader';
import './globals.css';

// ── Typography ──
const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-inter',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-space-grotesk',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Mara Studio — Diseñando el comportamiento. Programando la estética.',
  description:
    'Estudio de desarrollo de software especializado en arquitecturas robustas y experiencias digitales de alto nivel. Ingeniería sólida, diseño memorable.',
  keywords: [
    'desarrollo de software',
    'software studio',
    'frontend',
    'backend',
    'diseño web',
    'experiencias digitales',
  ],
  openGraph: {
    title: 'Mara Studio',
    description: 'Diseñando el comportamiento. Programando la estética.',
    type: 'website',
    locale: 'es_AR',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body>
        <Preloader />
        <SmoothScroll>
          <Header />
          {children}
        </SmoothScroll>
        <GrainOverlay />
      </body>
    </html>
  );
}
