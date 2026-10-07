'use client';

import { useRef, type ReactNode } from 'react';
import { useSceneMotion } from '@/lib/motion/use-scene-motion';

const EASE_OUT = 'expo.out';
const CLIP_FULL = 'inset(0% 0% 0% 0%)';
const CLIP_FROM_LEFT = 'inset(0% 100% 0% 0%)';

/**
 * Motion island for Scene 06 (02b Scene 06 §5–§6). Server markup is the final state; Tier A/B add:
 * - B6.2 light leak: scrubbed drift + 0 → 0.35 → 0 (Tier A only; Tier B keeps a fixed opacity via CSS).
 * - B6.3 header reveal (SplitText words on the heading when fonts are ready).
 * - B6.4 each strip wipes in from the left; frames fade up with a 60ms stagger.
 * - B6.7 KAIST copy + CTA fade up once.
 * Develop/hover/lightbox are CSS + React state (film-frame.tsx), never GSAP.
 */
export function FieldNotesStage({ className, children }: { className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useSceneMotion(ref, ({ gsap, SplitText, tier }) => {
    const root = ref.current;
    if (!root) return;
    const section = root.closest('section') ?? root;
    // 02b rule 3: only elements still fully below the viewport get an initial state (no flash-back).
    const below = (el: Element) => el.getBoundingClientRect().top > window.innerHeight;

    /* ---- B6.2 light leak (Tier A scrub) ---- */
    const leak = root.querySelector<HTMLElement>('[data-leak]');
    if (leak && tier === 'A') {
      gsap
        .timeline({
          defaults: { ease: 'none' },
          scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: true, invalidateOnRefresh: true },
        })
        .fromTo(leak, { xPercent: -10 }, { xPercent: 10, duration: 1 }, 0)
        .fromTo(leak, { opacity: 0 }, { opacity: 0.35, duration: 0.5 }, 0)
        .to(leak, { opacity: 0, duration: 0.5 }, 0.5);
    }

    /* ---- B6.3 header ---- */
    let split: { revert: () => void } | null = null;
    const head = root.querySelector<HTMLElement>('[data-fn-head]');
    if (head && below(head)) {
      const tl = gsap.timeline({
        defaults: { ease: EASE_OUT },
        scrollTrigger: { trigger: head, start: 'top 80%', once: true },
      });
      tl.from(Array.from(head.children), { opacity: 0, y: 16, duration: 0.6, stagger: 0.08 });
      const heading = head.querySelector<HTMLElement>('[data-split]');
      if (heading && document.fonts.status === 'loaded') {
        const words = SplitText.create(heading, { type: 'words', mask: 'words' });
        split = words;
        tl.from(words.words, { yPercent: 100, duration: 0.6, stagger: 0.08, onComplete: () => words.revert() }, 0.08);
      }
    }

    /* ---- B6.4 strips ---- */
    root.querySelectorAll<HTMLElement>('[data-strip]').forEach((strip) => {
      if (!below(strip)) return;
      const track = strip.querySelector<HTMLElement>('[data-strip-track]');
      const frames = Array.from(strip.querySelectorAll<HTMLElement>('[data-film-frame]'));
      const tl = gsap.timeline({
        defaults: { ease: EASE_OUT },
        scrollTrigger: { trigger: strip, start: 'top 75%', once: true },
      });
      tl.from(strip.querySelector('[data-strip-bar]'), { opacity: 0, y: 12, duration: 0.5 }, 0);
      if (track) tl.fromTo(track, { clipPath: CLIP_FROM_LEFT }, { clipPath: CLIP_FULL, duration: 0.5 }, 0);
      tl.from(frames, { opacity: 0, y: 12, duration: 0.5, stagger: 0.06 }, 0.1);
    });

    /* ---- B6.7 KAIST copy, CTA ---- */
    const copy = root.querySelector<HTMLElement>('[data-kaist-copy]');
    if (copy && below(copy)) {
      gsap.from(Array.from(copy.children), {
        opacity: 0,
        y: 12,
        duration: 0.45,
        ease: EASE_OUT,
        stagger: 0.1,
        scrollTrigger: { trigger: copy, start: 'top 70%', once: true },
      });
    }
    const cta = root.querySelector<HTMLElement>('[data-fn-cta]');
    if (cta && below(cta)) {
      gsap.from(cta, {
        opacity: 0,
        y: 12,
        duration: 0.45,
        ease: EASE_OUT,
        scrollTrigger: { trigger: cta, start: 'top 90%', once: true },
      });
    }

    return () => split?.revert();
  });

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
