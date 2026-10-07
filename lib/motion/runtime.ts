// Motion runtime chunk. Loaded ONLY via dynamic import() from lib/motion/motion-provider.tsx
// after first paint, and only for Tier A/B. Never import this module statically.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { Flip } from 'gsap/Flip';
import type Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger, SplitText, Flip);

export interface MotionRuntime {
  tier: 'A' | 'B';
  gsap: typeof gsap;
  ScrollTrigger: typeof ScrollTrigger;
  SplitText: typeof SplitText;
  Flip: typeof Flip;
  lenis: Lenis | null;
  /** Tears down Lenis, listeners and any remaining triggers. Scene contexts revert themselves. */
  stop: () => void;
}

export async function startMotion(tier: 'A' | 'B'): Promise<MotionRuntime> {
  ScrollTrigger.config({ ignoreMobileResize: true });

  let stopLenis = () => {};
  let lenis: Lenis | null = null;
  if (tier === 'A') {
    // Dynamic on purpose: Lenis must stay out of the Tier B bundle path (02a §2, master §9.8).
    const { initSmoothScroll, getLenis } = await import('./lenis');
    stopLenis = initSmoothScroll();
    lenis = getLenis();
  }

  // Refresh policy (02a §2.3): fonts, window load, width-only debounced resize.
  let stopped = false;
  const refresh = () => {
    if (!stopped) ScrollTrigger.refresh();
  };
  document.fonts?.ready.then(refresh);
  if (document.readyState !== 'complete') window.addEventListener('load', refresh, { once: true });

  // Deep links (/#reel): the browser's initial hash scroll happens before pin spacers exist.
  // Pins are registered by scene contexts after this runtime resolves, so for the first ~4 s
  // keep re-anchoring to the hash target whenever layout moved it (user scroll cancels this).
  const hashTargetId = decodeURIComponent(window.location.hash.slice(1));
  const hashTarget = hashTargetId && hashTargetId !== 'opening' ? document.getElementById(hashTargetId) : null;
  if (hashTarget) {
    const deadline = performance.now() + 4000;
    let expected = window.scrollY;
    let raf = 0;
    const cancel = () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener('wheel', cancel);
      window.removeEventListener('touchstart', cancel);
      window.removeEventListener('keydown', cancel);
    };
    const tick = () => {
      if (stopped || performance.now() > deadline) return cancel();
      const top = Math.round(hashTarget.getBoundingClientRect().top + window.scrollY);
      if (Math.abs(top - window.scrollY) >= 2) {
        lenis ? lenis.scrollTo(top, { immediate: true, force: true }) : window.scrollTo(0, top);
        expected = top;
        ScrollTrigger.update();
      } else if (Math.abs(window.scrollY - expected) >= 2) {
        return cancel(); // user moved
      }
      raf = window.requestAnimationFrame(tick);
    };
    window.addEventListener('wheel', cancel, { passive: true });
    window.addEventListener('touchstart', cancel, { passive: true });
    window.addEventListener('keydown', cancel);
    raf = window.requestAnimationFrame(tick);
  }

  let lastWidth = window.innerWidth;
  let resizeTimer = 0;
  const onResize = () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      if (window.innerWidth === lastWidth) return; // ignore iOS URL-bar height jitter
      lastWidth = window.innerWidth;
      refresh();
    }, 200);
  };
  window.addEventListener('resize', onResize, { passive: true });

  document.documentElement.dataset.motion = 'ready';

  return {
    tier,
    gsap,
    ScrollTrigger,
    SplitText,
    Flip,
    lenis,
    stop: () => {
      stopped = true;
      window.removeEventListener('load', refresh);
      window.removeEventListener('resize', onResize);
      window.clearTimeout(resizeTimer);
      stopLenis();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill(true));
      delete document.documentElement.dataset.motion;
    },
  };
}
