'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import type { MediaRef, Tone } from '@/content/types';
import { useMotionTier } from '@/lib/motion/tiers';
import { PixelIcon } from '@/components/ui/pixel-icon';
import { cn } from '@/lib/utils';

export type DitherReveal = 'hover' | 'always' | 'never';

interface DitherProps {
  media: MediaRef;
  /**
   * `hover`: dot matrix by default; hover (fine pointer), focus-within, or the toggle reveal the real content.
   * `always`: dot matrix, toggle only (no hover/focus reveal).
   * `never`: real content always visible, dot matrix as a faint screen overlay (hero), no toggle.
   */
  reveal?: DitherReveal;
  /** Dot pitch in CSS px (4–6 reads as a dot matrix). Defaults to 5; `never` (hero overlay) uses a calmer 6. */
  dotSize?: number;
  className?: string;
  /** The real content (image / video / placeholder footage) — sized by the caller (aspect box). */
  children: ReactNode;
}

/* Bayer 4×4 ordered-dither thresholds (0–15), row-major. */
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
const MAX_DPR = 2;
const RESIZE_DEBOUNCE_MS = 150;

interface Palette {
  bg: string;
  dot: string;
  key: string;
  fill: string;
  plateA: string;
  plateB: string;
}

function readPalette(el: Element, tone: Tone): Palette {
  const css = getComputedStyle(el);
  const v = (name: string) => css.getPropertyValue(name).trim();
  const teal = v('--grade-teal');
  const amber = v('--grade-amber');
  const neutral = v('--ink-3');
  return {
    bg: v('--bg-0'),
    dot: v('--ink-2'),
    key: tone === 'amber' ? amber : tone === 'neutral' ? neutral : teal,
    fill: tone === 'amber' ? teal : tone === 'neutral' ? v('--line-strong') : amber,
    plateA: v('--bg-2'),
    plateB: v('--bg-0'),
  };
}

/** mulberry32 — deterministic grain per label so re-draws (resize) do not shimmer. */
function seededRandom(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashString(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}

/** Procedural "footage" for placeholders: graded radial plates from the tone + seeded noise (mirrors `.footage`). */
function paintSynthetic(ctx: CanvasRenderingContext2D, cols: number, rows: number, palette: Palette, seed: number) {
  const base = ctx.createLinearGradient(0, 0, cols, rows);
  base.addColorStop(0, palette.plateA);
  base.addColorStop(0.7, palette.plateB);
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, cols, rows);

  const plate = (cx: number, cy: number, r: number, color: string, alpha: number) => {
    const g = ctx.createRadialGradient(cx * cols, cy * rows, 0, cx * cols, cy * rows, r * Math.max(cols, rows));
    g.addColorStop(0, color);
    g.addColorStop(1, 'transparent');
    ctx.globalAlpha = alpha;
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, cols, rows);
  };
  plate(0.28, 0.38, 0.55, palette.key, 0.85);
  plate(0.74, 0.66, 0.45, palette.fill, 0.5);
  plate(0.5, 1.0, 0.6, palette.key, 0.35);
  ctx.globalAlpha = 1;

  const image = ctx.getImageData(0, 0, cols, rows);
  const data = image.data;
  const rand = seededRandom(seed);
  for (let i = 0; i < data.length; i += 4) {
    const n = (rand() - 0.5) * 56;
    data[i] = Math.max(0, Math.min(255, data[i]! + n));
    data[i + 1] = Math.max(0, Math.min(255, data[i + 1]! + n));
    data[i + 2] = Math.max(0, Math.min(255, data[i + 2]! + n));
  }
  ctx.putImageData(image, 0, 0);
}

/** Cover-crop `source` into the cols×rows sample canvas. */
function paintSource(
  ctx: CanvasRenderingContext2D,
  cols: number,
  rows: number,
  source: HTMLImageElement,
) {
  const sw = source.naturalWidth;
  const sh = source.naturalHeight;
  const scale = Math.max(cols / sw, rows / sh);
  const dw = sw * scale;
  const dh = sh * scale;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(source, (cols - dw) / 2, (rows - dh) / 2, dw, dh);
}

function drawDither(
  canvas: HTMLCanvasElement,
  sample: HTMLCanvasElement,
  source: HTMLImageElement | null,
  media: MediaRef,
  dotSize: number,
) {
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;
  if (!w || !h) return;
  const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
  const cols = Math.ceil(w / dotSize);
  const rows = Math.ceil(h / dotSize);
  const palette = readPalette(canvas, media.tone);

  sample.width = cols;
  sample.height = rows;
  const sctx = sample.getContext('2d', { willReadFrequently: true });
  const ctx = canvas.getContext('2d');
  if (!sctx || !ctx) return;

  if (source && source.naturalWidth > 0) paintSource(sctx, cols, rows, source);
  else paintSynthetic(sctx, cols, rows, palette, hashString(media.label));

  const data = sctx.getImageData(0, 0, cols, rows).data;

  canvas.width = Math.round(w * dpr);
  canvas.height = Math.round(h * dpr);
  ctx.fillStyle = palette.bg;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const cell = dotSize * dpr;
  const gap = Math.max(1, Math.round(dpr));
  const dot = cell - gap;
  ctx.beginPath();
  for (let y = 0; y < rows; y++) {
    const bayerRow = (y & 3) * 4;
    for (let x = 0; x < cols; x++) {
      const i = (y * cols + x) * 4;
      // Rec. 709 luma, then a mild contrast stretch so dark footage still produces structure.
      const luma = (0.2126 * data[i]! + 0.7152 * data[i + 1]! + 0.0722 * data[i + 2]!) / 255;
      const value = (luma - 0.08) / 0.78;
      const threshold = (BAYER[bayerRow + (x & 3)]! + 0.5) / 16;
      if (value > threshold) ctx.rect(x * cell, y * cell, dot, dot);
    }
  }
  ctx.globalAlpha = 0.9;
  ctx.fillStyle = palette.dot;
  ctx.fill();
  ctx.globalAlpha = 1;
}

/** The rendered `<img>` (next/image) inside the real content, or a poster image for videos; null → synthetic plate. */
function resolveSource(root: HTMLElement, media: MediaRef, onReady: (img: HTMLImageElement | null) => void): () => void {
  if (media.kind === 'image') {
    const img = root.querySelector('img');
    if (!img) {
      onReady(null);
      return () => {};
    }
    if (img.complete && img.naturalWidth > 0) {
      onReady(img);
      return () => {};
    }
    const onLoad = () => onReady(img);
    const onError = () => onReady(null);
    img.addEventListener('load', onLoad, { once: true });
    img.addEventListener('error', onError, { once: true });
    return () => {
      img.removeEventListener('load', onLoad);
      img.removeEventListener('error', onError);
    };
  }
  if (media.kind === 'video' && media.poster) {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.decoding = 'async';
    img.onload = () => onReady(img);
    img.onerror = () => onReady(null);
    img.src = media.poster;
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }
  onReady(null);
  return () => {};
}

/**
 * Dither: Bayer 4×4 ordered-dithered dot matrix (light dots on bg-0) of the media, drawn once to a canvas
 * (CSS px × DPR ≤ 2, redrawn on resize, debounced) above the real content. Reveal = opacity crossfade
 * (`--dur-base`, `--ease-standard`). Hover/focus reveal is CSS (`.dither-reveal` in globals.css); the 44px
 * toggle (`aria-pressed`) covers touch and keyboard. Tier C: real content by default, toggle shows the dither.
 * No JS: the canvas is hidden (html:not([data-js])).
 */
export function Dither({ media, reveal = 'hover', dotSize = reveal === 'never' ? 6 : 5, className, children }: DitherProps) {
  const tier = useMotionTier();
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [toggled, setToggled] = useState<boolean | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    if (!root || !canvas) return;
    const sample = document.createElement('canvas');
    let source: HTMLImageElement | null = null;
    let ready = false;
    let timer = 0;
    let lastW = 0;
    let lastH = 0;

    const paint = () => {
      if (!ready) return;
      lastW = canvas.clientWidth;
      lastH = canvas.clientHeight;
      drawDither(canvas, sample, source, media, dotSize);
    };
    const release = resolveSource(root, media, (img) => {
      source = img;
      ready = true;
      paint();
    });
    const ro = new ResizeObserver(() => {
      if (canvas.clientWidth === lastW && canvas.clientHeight === lastH) return;
      window.clearTimeout(timer);
      timer = window.setTimeout(paint, RESIZE_DEBOUNCE_MS);
    });
    ro.observe(root);
    return () => {
      release();
      ro.disconnect();
      window.clearTimeout(timer);
    };
  }, [media, dotSize]);

  const revealed = toggled ?? tier === 'C';

  return (
    <div
      ref={rootRef}
      className={cn('dither-reveal', className)}
      data-reveal={reveal}
      data-revealed={toggled === null ? 'auto' : toggled ? 'true' : 'false'}
    >
      {children}
      <canvas ref={canvasRef} className="dither-reveal__canvas" aria-hidden="true" />
      {reveal !== 'never' ? (
        <button
          type="button"
          className="dither-reveal__toggle"
          aria-pressed={revealed}
          aria-label={revealed ? 'Show dither' : 'Reveal image'}
          onClick={() => setToggled(!revealed)}
        >
          <PixelIcon name="cam" size={20} />
        </button>
      ) : null}
    </div>
  );
}
