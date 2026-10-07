'use client';

import { useRef, type ReactNode } from 'react';
import { useSceneMotion } from '@/lib/motion/use-scene-motion';
import { mountDigitizeStream } from './digitize-stream';

interface OpeningStageProps {
  className?: string;
  children: ReactNode;
}

/**
 * Motion island for Scene 01. Server markup is the final state; in Tier A/B this adds:
 * - intro: copy rises in (staggered), universe settles from 0.94 → 1. Waits for the cold open to end
 *   (`html[data-boot]` removed); plays at once when there is no boot.
 * - scroll-out: universe scales to 0.9 and fades, copy drifts up (scrubbed over the hero's own height).
 * - digitize stream to the origin portrait (`./digitize-stream.ts`).
 */
export function OpeningStage({ className, children }: OpeningStageProps) {
  const ref = useRef<HTMLDivElement>(null);

  useSceneMotion(ref, ({ gsap, ScrollTrigger }) => {
    const stage = ref.current;
    const scene = stage?.closest<HTMLElement>('[data-scene="opening"]');
    const universe = stage?.querySelector<HTMLElement>('[data-universe]');
    const self = stage?.querySelector<HTMLElement>('[data-universe-self]');
    const copy = stage?.querySelector<HTMLElement>('[data-hero-copy]');
    if (!stage || !scene || !universe || !self || !copy) return;

    /* ---- scroll-out + stream ----------------------------------------- */
    const scrub = { trigger: scene, start: 'top top', end: 'bottom top', scrub: true, invalidateOnRefresh: true };
    gsap.to(universe, { scale: 0.9, opacity: 0.55, ease: 'none', scrollTrigger: { ...scrub } });
    gsap.to(copy, { y: -32, opacity: 0.4, ease: 'none', scrollTrigger: { ...scrub } });
    const unmountStream = mountDigitizeStream({ gsap, ScrollTrigger }, { scene, self });

    /* ---- intro --------------------------------------------------------- */
    const reveals = gsap.utils.toArray<HTMLElement>('[data-hero-reveal]', stage);
    // Already revealed (tier switch re-run) or the CSS failsafe already showed the copy → no intro.
    if (stage.dataset.intro === 'done' || (reveals[0] && Number(getComputedStyle(reveals[0]).opacity) > 0.5)) {
      stage.dataset.intro = 'done';
      return unmountStream ?? undefined;
    }

    gsap.set(reveals, { opacity: 0 });
    gsap.set(universe, { opacity: 0 });
    stage.dataset.intro = 'armed';

    const root = document.documentElement;
    const introCtx = gsap.context(() => {}, stage);
    let cancelled = false;

    const play = () =>
      introCtx.add(() => {
        gsap
          .timeline({ onComplete: () => (stage.dataset.intro = 'done') })
          .fromTo(universe, { opacity: 0, scale: 0.94 }, { opacity: 1, scale: 1, duration: 0.9, ease: 'expo.out' }, 0)
          .fromTo(
            reveals,
            { opacity: 0, y: 18 },
            { opacity: 1, y: 0, duration: 0.55, ease: 'expo.out', stagger: 0.09 },
            0.15,
          );
      });

    let observer: MutationObserver | null = null;
    if (root.dataset.boot === 'play') {
      observer = new MutationObserver(() => {
        if (root.dataset.boot === 'play') return;
        observer?.disconnect();
        if (!cancelled) play();
      });
      observer.observe(root, { attributes: true, attributeFilter: ['data-boot'] });
    } else {
      play();
    }

    return () => {
      cancelled = true;
      observer?.disconnect();
      introCtx.revert();
      unmountStream?.();
      // Never re-hide the copy on a re-run (tier switch) — the scene context reverts to the final state.
      stage.dataset.intro = 'done';
    };
  });

  return (
    <div ref={ref} data-hero-stage className={className}>
      {children}
    </div>
  );
}
