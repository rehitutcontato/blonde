import type { Metadata, Viewport } from 'next';
import {
  Barlow_Condensed,
  Instrument_Serif,
  JetBrains_Mono,
  Plus_Jakarta_Sans,
} from 'next/font/google';
import './globals.css';
import { LocaleProvider } from '@/lib/i18n/dictionary';
import { AudioProvider } from '@/lib/audio/StudioSoundEngine';
import { PersistentLiquidCanvas } from '@/components/stage/PersistentLiquidCanvas';
import { GreyCrowdField } from '@/components/stage/GreyCrowdField';
import { BroadsheetGridOverlay } from '@/components/editorial/BroadsheetGridOverlay';
import { LenisScrollStage } from '@/components/stage/LenisScrollStage';
import { ViewfinderReticle } from '@/components/interactions/ViewfinderReticle';

const barlowCondensed = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['700', '800'],
  variable: '--font-barlow-condensed',
  display: 'swap',
});

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: ['400'],
  style: ['italic'],
  variable: '--font-instrument-serif',
  display: 'swap',
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-plus-jakarta',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['500', '700'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://blonde.ai';

export const viewport: Viewport = {
  themeColor: '#090B0A',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'blonde AI — Stand Out in the Crowd | Autonomous Creative Engine (AaaS)',
  description:
    'Not another editing dashboard that makes you work. Bring your creative vision and raw footage or phone photos—blonde AI delivers finished, studio-grade ad campaigns ready to run. Brazil Genesis Access · Beta v0.5 opens April 27, 2027.',
  icons: {
    icon: '/assets/brand/blonde-ai-mark-volt.svg',
    shortcut: '/assets/brand/blonde-ai-mark-volt.svg',
    apple: '/assets/brand/blonde-ai-mark-volt.svg',
  },
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/?lang=en',
      'pt-BR': '/?lang=pt',
      'de-DE': '/?lang=de',
      'fr-FR': '/?lang=fr',
      'es-419': '/?lang=es',
      'it-IT': '/?lang=it',
    },
  },
  openGraph: {
    title: 'blonde AI — Stand Out in the Crowd (Genesis Waitlist)',
    description:
      'Bring your creative vision and real assets. We deliver the finished studio commercial. Beta v0.5 opens April 27, 2027 · Official Launch May 2027.',
    url: siteUrl,
    siteName: 'blonde AI',
    images: [
      {
        url: '/assets/images/hero-liquid-lens-studio.jpg',
        width: 1200,
        height: 630,
        alt: 'blonde AI — Anamorphic Liquid Metal Lens & 30° Blonde Volt Beam',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'blonde AI — Stand Out in the Crowd',
    description:
      'Autonomous Agency-as-a-Service (AaaS). Direct founder access inside the private WhatsApp Genesis Circle.',
    images: ['/assets/images/hero-liquid-lens-studio.jpg'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en-US"
      data-lang="en"
      className={`${barlowCondensed.variable} ${instrumentSerif.variable} ${plusJakarta.variable} ${jetbrainsMono.variable}`}
    >
      <body className="bg-[#090B0A] text-[#EAE2D3] font-sans antialiased selection:bg-[#CCFF29] selection:text-[#090B0A]">
        <LocaleProvider>
          <AudioProvider>
            <LenisScrollStage>
              {/* Z-2: Deep Grey Crowd Dissolving Plane */}
              <GreyCrowdField />
              {/* Z-1: Persistent Full-Site WebGL Liquid Metal Canvas + Video Fallback */}
              <PersistentLiquidCanvas />
              {/* Z-0: Capillary Newspaper Grid & 35mm Film Grain */}
              <BroadsheetGridOverlay />
              {/* Z+2: Optical Viewfinder Cursor Reticle (Desktop Pointer Fine) */}
              <ViewfinderReticle />
              {/* Z-0 / Z+1: Living Broadsheet Acts */}
              {children}
            </LenisScrollStage>
          </AudioProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
