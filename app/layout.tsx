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
  title: 'Mai Van Nhat Minh — Security · Reliability · Story',
  description: SITE.headline,
  applicationName: 'RUNTIME',
  authors: [{ name: SITE.name }],
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
