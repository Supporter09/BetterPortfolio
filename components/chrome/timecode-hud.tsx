'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { PixelIcon } from '@/components/ui/pixel-icon';
import { getScene } from '@/content/scenes';
import { useMotionTier } from '@/lib/motion/tiers';
import { framesToClock, progressToFrame } from '@/lib/motion/timecode';
import { SCENE_CHANGE_EVENT, type SceneChangeDetail } from '@/components/chrome/scene-observer';
import { OPEN_SCENE_PALETTE_EVENT } from '@/components/chrome/navigate';

const INITIAL = getScene('opening');

/**
 * `[data-timecode-clear]` elements hide the chip while they cross the viewport band it occupies
 * (`bottom-6` + `h-11` + 24px clearance), so right-aligned controls are never covered by it.
 */
const CLEAR_SELECTOR = '[data-timecode-clear]';
const CLEAR_BAND = 24 + 44 + 24;

/**
 * Timecode HUD (02a §5, 01 §5.2): one 44px button, `SC 04 · HH:MM:SS:FF` from window.scrollY over a
 * 4-minute nominal runtime at 24fps. rAF-throttled scroll listener, DOM writes only on change.
 * Tier C / SSR: frozen per scene (no scroll listener). Hidden <768px wide or ≤500px tall, and on every
 * route but `/` (sub-pages have no scenes to count).
 */
export function TimecodeHUD() {
  const home = usePathname() === '/';
  const tier = useMotionTier();
  const clockRef = useRef<HTMLSpanElement>(null);
  const lastFrameRef = useRef(-1);
  const [scene, setScene] = useState({ number: INITIAL.number, title: INITIAL.title });
  const [clear, setClear] = useState(false);
  const live = tier === 'A' || tier === 'B';

  useEffect(() => {
    if (!home) return;
    lastFrameRef.current = -1;
    let rafId = 0;
    const render = () => {
      rafId = 0;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const frame = progressToFrame(maxScroll > 0 ? window.scrollY / maxScroll : 0);
      if (frame === lastFrameRef.current) return;
      lastFrameRef.current = frame;
      if (clockRef.current) clockRef.current.textContent = framesToClock(frame);
    };
    const schedule = () => {
      if (!rafId) rafId = requestAnimationFrame(render);
    };
    const onSceneChange = (event: Event) => {
      const { number, title } = (event as CustomEvent<SceneChangeDetail>).detail;
      setScene({ number, title });
      schedule();
    };

    if (live) window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener(SCENE_CHANGE_EVENT, onSceneChange);
    schedule();

    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener(SCENE_CHANGE_EVENT, onSceneChange);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [home, live]);

  useEffect(() => {
    if (!home) return;
    const targets = document.querySelectorAll(CLEAR_SELECTOR);
    if (targets.length === 0) return;
    const inBand = new Set<Element>();
    let observer: IntersectionObserver | null = null;
    let raf = 0;
    // The band is a px rootMargin, so the observer is rebuilt when the viewport height changes.
    const observe = () => {
      raf = 0;
      observer?.disconnect();
      inBand.clear();
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) inBand.add(entry.target);
            else inBand.delete(entry.target);
          }
          setClear(inBand.size > 0);
        },
        { rootMargin: `${CLEAR_BAND - window.innerHeight}px 0px 0px 0px` },
      );
      targets.forEach((el) => observer?.observe(el));
    };
    const onResize = () => {
      if (!raf) raf = requestAnimationFrame(observe);
    };
    observe();
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      if (raf) cancelAnimationFrame(raf);
      observer?.disconnect();
    };
  }, [home]);

  if (!home) return null;

  return (
    <button
      type="button"
      aria-label={`Scene list. Current scene ${scene.number}, ${scene.title}`}
      onClick={() => window.dispatchEvent(new CustomEvent(OPEN_SCENE_PALETTE_EVENT))}
      data-clear={clear ? 'true' : undefined}
      className="timecode-hud fixed right-(--spacing-frame) bottom-6 z-(--z-hud) hidden h-11 items-center gap-3 rounded-sm border border-line bg-bg-1/92 px-3 transition-[border-color,background-color,opacity,visibility] duration-(--dur-fast) ease-standard hover-fine:border-line-strong active:bg-bg-2 data-[clear=true]:pointer-events-none data-[clear=true]:invisible data-[clear=true]:opacity-0 [@media(min-width:768px)_and_(min-height:501px)]:flex"
    >
      <span className="rec-dot bg-grade-teal" data-pulse="true" aria-hidden="true" />
      <span aria-hidden="true" className="label-mono text-ink-3">
        SC <span className="font-pixel text-pixel-sm text-ink">{scene.number}</span> ·{' '}
        <span ref={clockRef} className="font-pixel text-pixel-sm tabular-nums">
          00:00:00:00
        </span>
      </span>
      <PixelIcon name="list" size={16} className="text-ink-3" />
    </button>
  );
}
