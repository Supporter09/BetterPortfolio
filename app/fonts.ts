import { Geist, Geist_Mono, Geist_Pixel } from 'next/font/google';

// English-only site (master §11.1) → latin subset only.
// No serif (round 2 §1): display = Geist 500–600, accents = Geist Pixel, data = Geist Mono.

/** Body + display: Geist (variable weight). Hero name is LCP text → preload. */
export const geist = Geist({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-geist-sans',
  preload: true,
});

/** Pixel accent: Geist Pixel (variable ELSH axis) for slate/scene/metric numbers, badges, highlights. */
export const geistPixel = Geist_Pixel({
  subsets: ['latin'],
  axes: ['ELSH'],
  display: 'swap',
  variable: '--font-geist-pixel',
  preload: false, // accents only; metric-adjusted fallback until swap
});

export const geistMono = Geist_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-geist-mono',
  preload: false, // HUD/timecode accept a metric-adjusted fallback swap
});

export const fontVariables = [geist.variable, geistPixel.variable, geistMono.variable].join(' ');
