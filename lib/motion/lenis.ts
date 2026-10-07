// Loaded ONLY via dynamic import() from lib/motion/runtime.ts (Tier A), after first paint.
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

let lenisInstance: Lenis | null = null;

/** Window-scroll Lenis driven by gsap.ticker (02a §2.1–2.2). Returns a stop function. */
export function initSmoothScroll(): () => void {
  if (typeof window === 'undefined') return () => {};
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {};

  const lenis = new Lenis({
    lerp: 0.09,
    wheelMultiplier: 1,
    touchMultiplier: 1,
    syncTouch: false, // never emulate touch scrolling — keep native iOS/Android momentum
    autoResize: true,
    autoRaf: false,
    anchors: true,
  });
  lenisInstance = lenis;

  lenis.on('scroll', ScrollTrigger.update);

  const tick = (time: number) => {
    lenis.raf(time * 1000);
  };
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);

  return () => {
    gsap.ticker.remove(tick);
    gsap.ticker.lagSmoothing(500, 33);
    lenis.destroy();
    if (lenisInstance === lenis) lenisInstance = null;
  };
}

export function getLenis(): Lenis | null {
  return lenisInstance;
}
