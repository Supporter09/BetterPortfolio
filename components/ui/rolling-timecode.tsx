'use client';

import { useEffect, useRef } from 'react';
import { useMotionTier } from '@/lib/motion/tiers';
import { FPS, framesSince, framesToClock } from '@/lib/motion/timecode';
import { cn } from '@/lib/utils';

interface RollingTimecodeProps {
  /** ISO date the take started (e.g. research `startedAt`). */
  since: string;
  className?: string;
}

const MONTH_YEAR = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' });

/**
 * STILL ROLLING timecode (master §11.3): live 24fps `HH:MM:SS:FF` since `since` (days folded into hours).
 * Visual is aria-hidden; screen readers get "In progress since <Month YYYY>". Tier C / SSR: static.
 * Ticks only while on screen and the tab is visible; writes textContent directly (no React re-render).
 */
export function RollingTimecode({ since, className }: RollingTimecodeProps) {
  const tier = useMotionTier();
  const ref = useRef<HTMLSpanElement>(null);
  const live = tier === 'A' || tier === 'B';
  const sinceDate = Date.parse(since);
  const srLabel = Number.isNaN(sinceDate) ? 'In progress' : `In progress since ${MONTH_YEAR.format(sinceDate)}`;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let lastFrame = -1;
    const paint = () => {
      const frame = framesSince(since, Date.now());
      if (frame === lastFrame) return;
      lastFrame = frame;
      el.textContent = framesToClock(frame);
    };
    paint();
    if (!live) return;

    let timer = 0;
    let visible = false;
    const start = () => {
      if (timer || !visible || document.hidden) return;
      timer = window.setInterval(paint, 1000 / FPS);
    };
    const stop = () => {
      window.clearInterval(timer);
      timer = 0;
    };
    const io = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? false;
      if (visible) start();
      else stop();
    });
    const onVisibility = () => (document.hidden ? stop() : start());
    io.observe(el);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      stop();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [since, live]);

  return (
    <span className={cn('font-pixel tabular-nums slashed-zero', className)}>
      {/* Deterministic SSR placeholder; the effect paints the real value on hydrate. */}
      <span ref={ref} aria-hidden="true">
        --:--:--:--
      </span>
      <span className="sr-only">{srLabel}</span>
    </span>
  );
}
