'use client';

import { useRef, type ReactNode } from 'react';
import { useSceneMotion } from '@/lib/motion/use-scene-motion';

const EASE_OUT = 'expo.out';
const CLIP_FULL = 'inset(0% 0% 0% 0%)';
const CLIP_FROM_BOTTOM = 'inset(100% 0% 0% 0%)';

/**
 * Motion island for Scene 05 (round 2 §5). Server markup is the final state; Tier A/B add:
 * - heading chars rise (SplitText when fonts are ready) + intro fades in;
 * - direction cards wipe up (clip-path) with a 90ms stagger, then the note line fades in.
 * The sprite hover float is CSS (transform) in next-scene.module.css — never tweened here, so the
 * transition and GSAP never fight over the same transform.
 */
export function NextSceneStage({ className, children }: { className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useSceneMotion(ref, ({ gsap, SplitText }) => {
    const root = ref.current;
    if (!root) return;
    const section = root.closest('section') ?? root;
    const below = (el: Element) => el.getBoundingClientRect().top > window.innerHeight;

    /* ---- heading + intro ---- */
    let split: { revert: () => void } | null = null;
    const heading = root.querySelector<HTMLElement>('[data-split]');
    const intro = root.querySelector<HTMLElement>('[data-ns-intro]');
    if (heading && below(heading)) {
      const tl = gsap.timeline({ defaults: { ease: EASE_OUT }, scrollTrigger: { trigger: section, start: 'top 80%', once: true } });
      if (document.fonts.status === 'loaded') {
        const chars = SplitText.create(heading, { type: 'chars', mask: 'chars' });
        split = chars;
        tl.from(chars.chars, { yPercent: 100, opacity: 0, duration: 0.6, stagger: 0.035, onComplete: () => chars.revert() }, 0);
      } else {
        tl.from(heading, { opacity: 0, y: 24, duration: 0.6 }, 0);
      }
      if (intro) tl.from(intro, { opacity: 0, duration: 0.6 }, 0.2);
    }

    /* ---- cards + note ---- */
    const grid = root.querySelector<HTMLElement>('[data-ns-cards]');
    if (grid && below(grid)) {
      const cards = Array.from(grid.querySelectorAll<HTMLElement>('[data-ns-card]'));
      const tl = gsap.timeline({ defaults: { ease: EASE_OUT }, scrollTrigger: { trigger: grid, start: 'top 80%', once: true } });
      tl.fromTo(cards, { clipPath: CLIP_FROM_BOTTOM, opacity: 0 }, { clipPath: CLIP_FULL, opacity: 1, duration: 0.6, stagger: 0.09 }, 0);
      const note = root.querySelector<HTMLElement>('[data-ns-note]');
      if (note) tl.from(note, { opacity: 0, duration: 0.5 }, 0.5);
    }

    return () => split?.revert();
  });

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
