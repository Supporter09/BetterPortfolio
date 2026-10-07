import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import './globals.css';
import { fontVariables } from '@/app/fonts';
import { BOOT_SCRIPT } from '@/lib/boot/boot-script';
import { MotionProvider } from '@/lib/motion/motion-provider';
import { SITE } from '@/content/site';
import { SkipLink } from '@/components/chrome/skip-link';
import { Hud } from '@/components/chrome/hud';
import { TimecodeHUD } from '@/components/chrome/timecode-hud';
import { Grain } from '@/components/chrome/grain';
import { SceneObserver } from '@/components/chrome/scene-observer';
import { Cursor } from '@/components/chrome/cursor';
import { Footer } from '@/components/chrome/footer';

export const metadata: Metadata = {
  metadataBase: new URL('https://nhatminhportfolio.vercel.app'),
  title: {
    default: 'Mai Van Nhat Minh — Security · Reliability · Story',
    template: '%s · Mai Van Nhat Minh',
  },
  description: SITE.headline,
  applicationName: 'RUNTIME',
  authors: [{ name: SITE.name }],
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.png', type: 'image/png', sizes: '32x32' },
    ],
    apple: [{ url: '/apple-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://nhatminhportfolio.vercel.app',
    siteName: 'Mai Van Nhat Minh',
    title: 'Mai Van Nhat Minh — Security · Reliability · Story',
    description: SITE.headline,
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: 'Mai Van Nhat Minh — Security · Reliability · Story',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mai Van Nhat Minh — Security · Reliability · Story',
    description: SITE.headline,
    images: ['/og.png'],
  },
};

export const viewport: Viewport = {
  themeColor: '#0a0a0b',
  colorScheme: 'dark',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    // data-tier / data-js / data-boot / data-active-scene are rewritten on the client before/after hydration.
    <html lang="en" className={`dark ${fontVariables}`} data-active-scene="opening" suppressHydrationWarning>
      <head>
        {/* Must run before first paint: sets html[data-tier|data-js|data-boot] (03a §4.3). */}
        <script dangerouslySetInnerHTML={{ __html: BOOT_SCRIPT }} />
      </head>
      <body className="min-h-dvh bg-bg-0 text-ink">
        <SkipLink />
        <Hud />
        {children}
        <Footer />
        <TimecodeHUD />
        <Grain />
        <SceneObserver />
        <MotionProvider />
        <Cursor />
      </body>
    </html>
  );
}
