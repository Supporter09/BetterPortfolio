'use client';

import { useEffect, useRef } from 'react';
import { PixelIcon } from '@/components/ui/pixel-icon';
import { useMotionRuntime } from '@/lib/motion/motion-provider';
import { useMotionTier } from '@/lib/motion/tiers';

/** Cubic in-out, matches --ease-in-out. */
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

/** Where keyboard focus lands after the scroll (02b B8.7): header home link → skip link → main. */
function focusTop() {
  const target =
    document.querySelector<HTMLElement>('header a[href="#opening"]') ??
    document.querySelector<HTMLElement>('a[href="#main"]') ??
    document.getElementById('main');
  target?.focus({ preventScroll: true });
}

/**
 * `Back to top` (closing scene, 02b Scene 08 §8): Lenis 1.2s whip in Tier A, native smooth scroll in Tier B,
 * instant jump in Tier C — then focus moves to the top so keyboard users are never stranded at the end.
 */
export function BackToTop({ label }: { label: string }) {
  const runtime = useMotionRuntime();
  const tier = useMotionTier();
  const timer = useRef(0);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const onClick = () => {
    window.clearTimeout(timer.current);
    if (runtime?.lenis) {
      runtime.lenis.scrollTo(0, { duration: 1.2, easing: easeInOutCubic, onComplete: focusTop });
      return;
    }
    if (tier === 'C') {
      window.scrollTo({ top: 0, behavior: 'auto' });
      focusTop();
      return;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // `scrollend` is not universal yet; the timeout is the fallback.
    const done = () => {
      window.clearTimeout(timer.current);
      window.removeEventListener('scrollend', done);
      focusTop();
    };
    window.addEventListener('scrollend', done, { once: true });
    timer.current = window.setTimeout(done, 1200);
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-sm border border-line-strong px-5 text-body-sm font-medium text-ink transition-colors duration-(--dur-fast) hover-fine:border-ink-3 hover-fine:bg-bg-1 active:translate-y-px"
    >
      <PixelIcon name="arrow-up" size={20} />
      {label}
    </button>
  );
}
