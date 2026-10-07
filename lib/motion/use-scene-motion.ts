'use client';

import { useEffect, useEffectEvent, type RefObject } from 'react';
import type { gsap } from 'gsap';
import type { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { SplitText } from 'gsap/SplitText';
import type { Flip } from 'gsap/Flip';
import type Lenis from 'lenis';
import { MOTION_CONDITIONS } from '@/lib/motion/conditions';
import { registerSceneTeardown, useMotionRuntime } from '@/lib/motion/motion-provider';

export interface MotionApi {
  gsap: typeof gsap;
  ScrollTrigger: typeof ScrollTrigger;
  SplitText: typeof SplitText;
  Flip: typeof Flip;
  tier: 'A' | 'B';
  /** Scoped `gsap.matchMedia()` for this scene; reverted with the scene. Use `conditions.pin*` here. */
  mm: gsap.MatchMedia;
  conditions: typeof MOTION_CONDITIONS;
  lenis: Lenis | null;
}

export type SceneMotionSetup = (api: MotionApi) => void | (() => void);

/**
 * Runs `setup` inside `gsap.context(scope)` once the motion runtime is loaded and tier ∈ {A,B}.
 * Never runs in Tier C, SSR or no-JS. Auto-reverted on unmount, deps change, or tier change.
 * Rule: DOM default = final readable state; set initial states only with gsap.set/from in setup.
 */
export function useSceneMotion(
  scope: RefObject<HTMLElement | null>,
  setup: SceneMotionSetup,
  deps: unknown[] = [],
): void {
  const runtime = useMotionRuntime();
  const runSetup = useEffectEvent((api: MotionApi) => setup(api));

  useEffect(() => {
    const el = scope.current;
    if (!runtime || !el) return;

    const { gsap: g, ScrollTrigger: st, SplitText: split, Flip: flip, tier, lenis } = runtime;
    const mm = g.matchMedia(el);
    let userCleanup: void | (() => void);
    const ctx = g.context(() => {
      userCleanup = runSetup({
        gsap: g,
        ScrollTrigger: st,
        SplitText: split,
        Flip: flip,
        tier,
        mm,
        conditions: MOTION_CONDITIONS,
        lenis,
      });
    }, el);

    let done = false;
    const teardown = () => {
      if (done) return;
      done = true;
      unregister();
      if (typeof userCleanup === 'function') userCleanup();
      mm.revert();
      ctx.revert();
    };
    const unregister = registerSceneTeardown(teardown);
    return teardown;
    // `deps` is the caller's explicit re-run list (like useGSAP's dependencies).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [runtime, scope, ...deps]);
}
