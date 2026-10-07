'use client';

import { useRef, type ReactNode } from 'react';
import { useSceneMotion } from '@/lib/motion/use-scene-motion';

const EASE_OUT = 'expo.out';

/**
 * Motion island for Scene 08 — Achievements (02b Scene 07 §5–§7). Server markup is the final state; Tier A/B add:
 * - B7.1 heading rises (SplitText chars in A, words in B) and the sub-label fades in.
 * - B7.2 credit rows fade up in batches, 40ms apart.
 * - B7.3 watermark "08" drifts yPercent 0 → -8 with the user's scroll (Tier A only, scrubbed).
 * No auto-scroll: content never moves on its own.
 */
export function CreditsStage({ className, children }: { className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useSceneMotion(ref, ({ gsap, ScrollTrigger, SplitText, tier }) => {
    const root = ref.current;
    if (!root) return;
    const section = root.closest('section') ?? root;
    const below = (el: Element) => el.getBoundingClientRect().top > window.innerHeight;

    /* ---- B7.1 heading ---- */
    let split: { revert: () => void } | null = null;
    const heading = root.querySelector<HTMLElement>('[data-split]');
    if (heading && below(heading)) {
      const tl = gsap.timeline({
        defaults: { ease: EASE_OUT },
        scrollTrigger: { trigger: section, start: 'top 80%', once: true },
      });
      if (document.fonts.status === 'loaded') {
        const type = tier === 'A' ? 'chars' : 'words';
        const parts = SplitText.create(heading, { type, mask: type });
        split = parts;
        tl.from(tier === 'A' ? parts.chars : parts.words, {
          yPercent: 40,
          opacity: 0,
          duration: 0.6,
          stagger: tier === 'A' ? 0.04 : 0.08,
          onComplete: () => parts.revert(),
        });
      } else {
        tl.from(heading, { opacity: 0, y: 16, duration: 0.6 });
      }
      const sub = root.querySelector<HTMLElement>('[data-credit-sub]');
      if (sub) tl.from(sub, { opacity: 0, duration: 0.6 }, 0.2);
    }

    /* ---- B7.2 rows ---- */
    const rows = Array.from(root.querySelectorAll<HTMLElement>('[data-credit-row]')).filter(below);
    if (rows.length) {
      gsap.set(rows, { opacity: 0, y: 12 });
      ScrollTrigger.batch(rows, {
        start: 'top 85%',
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            duration: 0.32,
            ease: EASE_OUT,
            stagger: 0.04,
            clearProps: 'transform',
          }),
      });
    }

    /* ---- B7.3 watermark drift (Tier A) ---- */
    const watermark = root.querySelector<HTMLElement>('[data-watermark]');
    if (watermark && tier === 'A') {
      gsap.fromTo(
        watermark,
        { yPercent: 0 },
        {
          yPercent: -8,
          ease: 'none',
          scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: true, invalidateOnRefresh: true },
        },
      );
    }

    return () => split?.revert();
  });

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
