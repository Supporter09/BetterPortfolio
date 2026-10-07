'use client';

import { useRef, type ReactNode } from 'react';
import { useSceneMotion } from '@/lib/motion/use-scene-motion';

// GSAP equivalent of the CSS token --ease-out (expo-out).
const EASE_OUT = 'expo.out';
const CLIP_FULL = 'inset(0% 0% 0% 0%)';
const CLIP_FROM_LEFT = 'inset(0% 100% 0% 0%)';
const CLIP_FROM_BOTTOM = 'inset(0% 0% 100% 0%)';

/**
 * Motion island for the sub-pages (`/work/[slug]`, `/archive`, `/films`, 404). Server-rendered
 * children are the final state; this only adds initial states inside `useSceneMotion` (Tier A/B).
 *
 * Enter (02a §6): 500–800ms expo-out on the header — `[data-slate]` wipe, `[data-back]`,
 * `[data-split]` title (SplitText chars in Tier A once fonts are loaded), `[data-intro]` blocks,
 * `[data-media]` clip reveal with a slow push-in on `[data-media-plate]`, `[data-index-item]` stagger.
 * Scroll: `[data-chapter]` groups (heading + `[data-rule]` + inner `[data-reveal]`) and loose
 * `[data-reveal]` elements get a one-shot reveal, only when still below the viewport (no flash-back).
 */
export function PageStage({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useSceneMotion(ref, ({ gsap, SplitText, tier }) => {
    const root = ref.current;
    if (!root) return;

    const $ = <T extends HTMLElement = HTMLElement>(selector: string, scope: ParentNode = root) =>
      scope.querySelector<T>(selector);
    const $$ = <T extends HTMLElement = HTMLElement>(selector: string, scope: ParentNode = root) =>
      Array.from(scope.querySelectorAll<T>(selector));
    const below = (el: Element) => el.getBoundingClientRect().top > window.innerHeight;
    const quick = tier === 'B';
    const dur = quick ? 0.45 : 0.6;

    /* ---- Enter: header plays once on mount ---- */
    const enter = gsap.timeline({ defaults: { ease: EASE_OUT } });
    const slate = $('[data-slate]');
    if (slate) enter.fromTo(slate, { clipPath: CLIP_FROM_LEFT }, { clipPath: CLIP_FULL, duration: dur }, 0);
    const back = $('[data-back]');
    if (back) enter.from(back, { opacity: 0, x: -8, duration: dur }, 0);

    let split: { revert: () => void } | null = null;
    const title = $('[data-split]');
    if (title) {
      if (!quick && document.fonts.status === 'loaded') {
        // aria: 'auto' keeps the full title readable; masks revert once played (no clipped descenders).
        const chars = SplitText.create(title, { type: 'chars', mask: 'chars' });
        split = chars;
        enter.from(
          chars.chars,
          { yPercent: 100, opacity: 0, duration: 0.7, stagger: 0.025, onComplete: () => chars.revert() },
          0.05,
        );
      } else {
        enter.from(title, { opacity: 0, y: 24, duration: dur }, 0.05);
      }
    }

    const intros = $$('[data-intro]');
    if (intros.length) enter.from(intros, { opacity: 0, y: 16, duration: dur, stagger: 0.08 }, 0.15);

    const media = $('[data-media]');
    if (media) {
      enter.fromTo(media, { clipPath: CLIP_FROM_BOTTOM }, { clipPath: CLIP_FULL, duration: 0.8 }, 0.1);
      const plate = $('[data-media-plate]', media);
      if (plate) enter.from(plate, { scale: 1.06, duration: 1.1 }, 0.1);
    }

    const indexItems = $$('[data-index-item]');
    if (indexItems.length) enter.from(indexItems, { opacity: 0, x: -8, duration: dur, stagger: 0.05 }, 0.35);

    /* ---- Scroll: one-shot reveals for content still below the fold ---- */
    $$('[data-chapter]').forEach((chapter) => {
      if (!below(chapter)) return;
      const tl = gsap.timeline({
        defaults: { ease: EASE_OUT },
        scrollTrigger: { trigger: chapter, start: 'top 85%', once: true },
      });
      const head = $('[data-chapter-head]', chapter);
      if (head) tl.from(head, { opacity: 0, y: 16, duration: dur }, 0);
      const rule = $('[data-rule]', chapter);
      if (rule) tl.fromTo(rule, { scaleX: 0 }, { scaleX: 1, duration: dur }, 0.1);
      const items = $$('[data-reveal]', chapter);
      if (items.length) tl.from(items, { opacity: 0, y: 14, duration: dur, stagger: quick ? 0.04 : 0.06 }, 0.12);
    });

    $$('[data-reveal]').forEach((el) => {
      if (el.closest('[data-chapter]') || !below(el)) return;
      gsap.from(el, {
        opacity: 0,
        y: 16,
        duration: dur,
        ease: EASE_OUT,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      });
    });

    return () => split?.revert();
  });

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
