'use client';

import { useEffect, useSyncExternalStore } from 'react';
import type { MotionRuntime } from '@/lib/motion/runtime';
import { useMotionTier } from '@/lib/motion/tiers';

/* ------------------------------------------------------------------
   Runtime store. Holds the dynamically imported gsap/lenis runtime
   (Tier A/B only). Type-only import above → no gsap in this chunk.
------------------------------------------------------------------- */
let currentRuntime: MotionRuntime | null = null;
const runtimeListeners = new Set<() => void>();
const sceneTeardowns = new Set<() => void>();

function publish(runtime: MotionRuntime | null) {
  currentRuntime = runtime;
  runtimeListeners.forEach((listener) => listener());
}

function subscribeRuntime(onChange: () => void): () => void {
  runtimeListeners.add(onChange);
  return () => {
    runtimeListeners.delete(onChange);
  };
}

/** The live motion runtime, or null (SSR, Tier C, not loaded yet, or tier switching). */
export function useMotionRuntime(): MotionRuntime | null {
  return useSyncExternalStore(
    subscribeRuntime,
    () => currentRuntime,
    () => null,
  );
}

/**
 * Scene motion contexts register their teardown so the provider can revert them
 * BEFORE killing Lenis/ScrollTrigger on tier change (motion toggle, resize across 1024px).
 */
export function registerSceneTeardown(teardown: () => void): () => void {
  sceneTeardowns.add(teardown);
  return () => {
    sceneTeardowns.delete(teardown);
  };
}

/** requestIdleCallback (timeout 1200ms) with a double-rAF fallback (03a §4.2). */
function afterFirstPaintIdle(run: () => void): () => void {
  if ('requestIdleCallback' in window) {
    const id = window.requestIdleCallback(run, { timeout: 1200 });
    return () => window.cancelIdleCallback(id);
  }
  let timer = 0;
  let raf = requestAnimationFrame(() => {
    raf = requestAnimationFrame(() => {
      timer = window.setTimeout(run, 1);
    });
  });
  return () => {
    cancelAnimationFrame(raf);
    window.clearTimeout(timer);
  };
}

/**
 * Loads the motion runtime after first paint + idle when tier ∈ {A,B}.
 * Tier C / SSR / no-JS: nothing is loaded; SSR markup is already the final state.
 */
export function MotionProvider() {
  const tier = useMotionTier();

  useEffect(() => {
    const root = document.documentElement;
    if (tier !== 'A' && tier !== 'B') {
      if (tier === 'C') root.dataset.motion = 'off';
      return;
    }

    let cancelled = false;
    let runtime: MotionRuntime | null = null;

    const cancelIdle = afterFirstPaintIdle(() => {
      // Dynamic on purpose: gsap + Lenis must never be part of the initial JS (03a §4.2, master §9.8).
      import('@/lib/motion/runtime')
        .then(({ startMotion }) => startMotion(tier))
        .then((started) => {
          if (cancelled) {
            started.stop();
            return;
          }
          runtime = started;
          publish(started);
        })
        .catch(() => {
          // Runtime failed to load: content stays in its SSR final state.
        });
    });

    return () => {
      cancelled = true;
      cancelIdle();
      if (!runtime) return;
      [...sceneTeardowns].forEach((teardown) => teardown());
      publish(null);
      runtime.stop();
      runtime = null;
    };
  }, [tier]);

  return null;
}
