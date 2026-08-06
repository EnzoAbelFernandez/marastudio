import type { Metadata, Viewport } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { SmoothScroll } from '@/components/layout/SmoothScroll';
import { Header } from '@/components/layout/Header';
import { GrainOverlay } from '@/components/ui/GrainOverlay';
import { Preloader } from '@/components/ui/Preloader';
import { LanguageProvider } from '@/lib/i18n/LanguageContext';
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

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: 'Mara Studio — Diseñando el comportamiento. Programando la estética.',
  description:
    'Estudio de desarrollo de software especializado en arquitecturas robustas y experiences digitales de alto nivel. Ingeniería sólida, diseño memorable.',
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
        <LanguageProvider>
          <Preloader />
          <SmoothScroll>
            <Header />
            {children}
          </SmoothScroll>
          <GrainOverlay />
        </LanguageProvider>
      </body>
    </html>
  );
}
