'use client';

import { useRef, type ReactNode } from 'react';
import { useSceneMotion } from '@/lib/motion/use-scene-motion';

interface OriginStageProps {
  className?: string;
  children: ReactNode;
}

/**
 * Motion island for Scene 02 (02a Scene 02 §5). One-shot reveals only (Tier A/B):
 * B2.2 viewfinder corners settle, B2.3 bio block, B2.4 pull quote. The portrait itself is revealed by the
 * opening's digitize stream (`data-received`, see origin.module.css), so it has no entrance tween here.
 * No pin: the portrait column is CSS `position: sticky`.
 */
export function OriginStage({ className, children }: OriginStageProps) {
  const ref = useRef<HTMLDivElement>(null);

  useSceneMotion(ref, ({ gsap }) => {
    const root = ref.current;
    const portrait = root?.querySelector('[data-origin-portrait]');
    const corners = root?.querySelector('[data-origin-corners]');
    const bio = root?.querySelector('[data-origin-bio]');
    const quote = root?.querySelector('[data-origin-quote]');
    if (!portrait || !corners || !bio || !quote) return;
    const once = (trigger: Element, start: string) => ({ trigger, start, once: true });

    gsap.from(corners, {
      opacity: 0,
      scale: 1.08,
      duration: 0.4,
      ease: 'power3.out',
      scrollTrigger: once(portrait, 'top 75%'),
    });
    gsap.from(bio, {
      opacity: 0,
      y: 16,
      duration: 0.45,
      ease: 'expo.out',
      scrollTrigger: once(bio, 'top 70%'),
    });
    gsap.from(quote, {
      opacity: 0,
      y: 20,
      duration: 0.5,
      ease: 'expo.out',
      scrollTrigger: once(quote, 'top 65%'),
    });
  });

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
