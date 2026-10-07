'use client';

import { useRef, type ReactNode } from 'react';
import { useSceneMotion } from '@/lib/motion/use-scene-motion';

const EASE_OUT = 'expo.out';

/**
 * Motion island for Scene 09 (02b Scene 08 §5–§7, moved here in round 2). Server markup is the final state;
 * Tier A/B add:
 * - heading chars rise (SplitText when fonts are ready) + sub-label fades in;
 * - CTA settles (scale 0.98 → 1) with its amber frame;
 * - fade-to-black: the grade cover's opacity is scrubbed 0 → 1 toward the end card (Tier A only);
 * - END OF RUNTIME fades in at the end of the page; the REC dot crossfades to the stop square.
 */
export function ClosingStage({ className, children }: { className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useSceneMotion(ref, ({ gsap, SplitText, tier }) => {
    const root = ref.current;
    if (!root) return;
    const section = root.closest('section') ?? root;
    const below = (el: Element) => el.getBoundingClientRect().top > window.innerHeight;

    /* ---- heading + sub-label ---- */
    let split: { revert: () => void } | null = null;
    const heading = root.querySelector<HTMLElement>('[data-split]');
    const sub = root.querySelector<HTMLElement>('[data-cl-sub]');
    if (heading && below(heading)) {
      const tl = gsap.timeline({ defaults: { ease: EASE_OUT }, scrollTrigger: { trigger: section, start: 'top 80%', once: true } });
      if (document.fonts.status === 'loaded') {
        const chars = SplitText.create(heading, { type: 'chars', mask: 'chars' });
        split = chars;
        tl.from(chars.chars, { yPercent: 100, opacity: 0, duration: 0.6, stagger: 0.035, onComplete: () => chars.revert() }, 0);
      } else {
        tl.from(heading, { opacity: 0, y: 24, duration: 0.6 }, 0);
      }
      if (sub) tl.from(sub, { opacity: 0, duration: 0.6 }, 0.2);
    }

    /* ---- CTA ---- */
    const cta = root.querySelector<HTMLElement>('[data-cl-cta]');
    if (cta && below(cta)) {
      const tl = gsap.timeline({ defaults: { ease: EASE_OUT }, scrollTrigger: { trigger: cta, start: 'top 85%', once: true } });
      tl.from(cta, { opacity: 0, scale: 0.98, duration: 0.9, transformOrigin: '0% 50%' }, 0);
      tl.from(cta.querySelectorAll('[data-cl-cta-frame]'), { opacity: 0, scale: 1.04, duration: 0.9 }, 0.15);
    }

    /* ---- fade-to-black (Tier A scrub) ---- */
    const fade = root.querySelector<HTMLElement>('[data-cl-fade]');
    const end = root.querySelector<HTMLElement>('[data-cl-end]');
    if (fade && end && tier === 'A') {
      gsap.fromTo(
        fade,
        { opacity: 0 },
        {
          opacity: 1,
          ease: 'none',
          scrollTrigger: { trigger: end, start: 'top bottom', end: 'bottom bottom', scrub: true, invalidateOnRefresh: true },
        },
      );
    }

    /* ---- END OF RUNTIME + REC → STOP ---- */
    if (end && below(end)) {
      const rec = end.querySelector<HTMLElement>('[data-cl-rec]');
      const stop = end.querySelector<HTMLElement>('[data-cl-stop]');
      const tl = gsap.timeline({ defaults: { ease: EASE_OUT }, scrollTrigger: { trigger: end, start: 'bottom bottom', once: true } });
      tl.from(end.querySelectorAll('[data-cl-end-copy]'), { opacity: 0, duration: 0.9, stagger: 0.12 }, 0);
      if (rec && stop) {
        gsap.set(rec, { opacity: 1 });
        gsap.set(stop, { opacity: 0 });
        tl.to(rec, { opacity: 0, duration: 0.45 }, 0.6).to(stop, { opacity: 1, duration: 0.45 }, 0.6);
      }
    }

    return () => split?.revert();
  });

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
