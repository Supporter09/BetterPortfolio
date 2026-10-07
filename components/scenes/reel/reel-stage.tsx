'use client';

import { useEffect, useRef, useState, type FocusEvent, type KeyboardEvent, type ReactNode } from 'react';
import { PixelIcon } from '@/components/ui/pixel-icon';
import { useMotionTier } from '@/lib/motion/tiers';
import { useSceneMotion } from '@/lib/motion/use-scene-motion';
import styles from './reel.module.css';

const EASE_OUT = 'expo.out';
const EASE_IN_OUT = 'power2.inOut';
const TRACK_ID = 'reel-track';
const CLIP_FULL = 'inset(0% 0% 0% 0%)';
const ROVING_KEYS = ['ArrowLeft', 'ArrowRight', 'Home', 'End'];

/** Whip-pan easing for Lenis (cubic in-out, matches --ease-in-out). */
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

interface PinApi {
  goTo: (index: number) => void;
  focusCard: (index: number) => void;
}

interface ReelStageProps {
  /** Slate + heading + sub-label (server-rendered). */
  header: ReactNode;
  count: number;
  /** `<li data-reel-card>` items. */
  children: ReactNode;
}

const pad = (n: number) => String(n).padStart(2, '0');

/**
 * Scene 05 controller (02b Scene 05 §5–§8): Prev/Next + counter + progress, roving arrow keys,
 * focus → card into view. Native horizontal scroll-snap by default (≥640px); Pin #2 horizontal
 * scrub only under `conditions.pinReel` and when header + cards fit the viewport.
 */
export function ReelStage({ header, count, children }: ReelStageProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLOListElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const pinApi = useRef<PinApi | null>(null);
  const [index, setIndex] = useState(0);
  const tier = useMotionTier();

  const cards = () => Array.from(trackRef.current?.querySelectorAll<HTMLElement>(':scope > [data-reel-card]') ?? []);

  /** Active card (viewfinder brackets) + progress bar; `null` index clears (stacked layout). */
  const activeRef = useRef<number | null | undefined>(undefined);
  const paint = (active: number | null, progress: number) => {
    const base = 1 / Math.max(1, count);
    if (barRef.current) barRef.current.style.transform = `scaleX(${base + Math.min(1, Math.max(0, progress)) * (1 - base)})`;
    if (activeRef.current === active) return;
    activeRef.current = active;
    cards().forEach((card, k) => {
      if (active === null) delete card.dataset.active;
      else card.dataset.active = String(k === active);
    });
    setIndex(active ?? 0);
  };

  /* Native row: index + progress from the scroller (passive, rAF-throttled). Pin mode owns them otherwise. */
  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    let raf = 0;
    const sync = () => {
      raf = 0;
      if (pinApi.current) return;
      const list = Array.from(viewport.querySelectorAll<HTMLElement>('[data-reel-card]'));
      const max = viewport.scrollWidth - viewport.clientWidth;
      if (!list.length || max <= 1) {
        paint(null, 0);
        return;
      }
      const left = viewport.scrollLeft;
      const origin = list[0].offsetLeft;
      const nearest = list.reduce(
        (best, card, k) => (Math.abs(card.offsetLeft - origin - left) < Math.abs(list[best].offsetLeft - origin - left) ? k : best),
        0,
      );
      paint(left >= max - 2 ? list.length - 1 : nearest, left / max);
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(sync);
    };
    viewport.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    schedule();
    return () => {
      cancelAnimationFrame(raf);
      viewport.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
    // `paint` only touches refs + a stable state setter.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const goTo = (target: number) => {
    const next = Math.max(0, Math.min(count - 1, target));
    if (pinApi.current) {
      pinApi.current.goTo(next);
      return;
    }
    const viewport = viewportRef.current;
    const list = cards();
    const card = list[next];
    if (!viewport || !card) return;
    const max = viewport.scrollWidth - viewport.clientWidth;
    viewport.scrollTo({
      left: Math.min(max, card.offsetLeft - list[0].offsetLeft),
      behavior: tier === 'A' || tier === 'B' ? 'smooth' : 'auto',
    });
  };

  /* Roving focus between cards' links (only while focus is inside a card). */
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!ROVING_KEYS.includes(event.key)) return;
    const list = cards();
    const current = list.findIndex((card) => card.contains(document.activeElement));
    if (current < 0) return;
    const next =
      event.key === 'Home' ? 0 : event.key === 'End' ? list.length - 1 : current + (event.key === 'ArrowRight' ? 1 : -1);
    const link = list[next]?.querySelector<HTMLElement>('a[href], button:not([disabled])');
    if (!link) return;
    event.preventDefault();
    link.focus({ preventScroll: pinApi.current !== null });
  };

  /* Keyboard focus on a card → bring that card into the frame. */
  const onFocus = (event: FocusEvent<HTMLOListElement>) => {
    const target = event.target;
    if (!(target instanceof HTMLElement) || !target.matches(':focus-visible')) return;
    const i = cards().findIndex((card) => card.contains(target));
    if (i < 0) return;
    if (pinApi.current) {
      pinApi.current.focusCard(i);
      return;
    }
    const viewport = viewportRef.current;
    if (viewport && viewport.scrollWidth > viewport.clientWidth + 1) goTo(i);
  };

  useSceneMotion(rootRef, ({ gsap, SplitText, mm, conditions, lenis }) => {
    const root = rootRef.current;
    const viewport = viewportRef.current;
    const track = trackRef.current;
    const frame = root?.querySelector<HTMLElement>('[data-pin-frame]');
    if (!root || !viewport || !track || !frame) return;
    const below = (el: Element) => el.getBoundingClientRect().top > window.innerHeight;

    /* B5.1: header reveal (+ SplitText words on the heading) before the pin. */
    let split: { revert: () => void } | null = null;
    const head = root.querySelector<HTMLElement>('[data-reel-head]');
    if (head && below(head)) {
      const tl = gsap.timeline({ defaults: { ease: EASE_OUT }, scrollTrigger: { trigger: head, start: 'top 85%', once: true } });
      tl.from([...Array.from(head.children), ...root.querySelectorAll('[data-reel-controls]')], {
        opacity: 0,
        y: 16,
        duration: 0.6,
        stagger: 0.08,
      });
      const heading = head.querySelector<HTMLElement>('[data-split]');
      if (heading && document.fonts.status === 'loaded') {
        const words = SplitText.create(heading, { type: 'words', mask: 'words' });
        split = words;
        tl.from(words.words, { yPercent: 100, duration: 0.6, stagger: 0.08, onComplete: () => words.revert() }, 0.08);
      }
    }

    /* Pin #2: horizontal scrub with card snap. Returns cleanup, or undefined when it does not fit. */
    const pin = (): (() => void) | undefined => {
      root.dataset.mode = 'pin';
      const list = cards();
      // Fit check: the pin layout sizes cards to the 100svh frame (media shrinks first); if a card body
      // (content height, never shrunk) still runs past its article, stay native.
      const bodies = list.map((card) => card.querySelector<HTMLElement>('[data-reel-body]'));
      if (bodies.some((body) => !body || body.offsetTop + body.offsetHeight > (body.offsetParent?.clientHeight ?? 0) + 1)) {
        delete root.dataset.mode;
        return undefined;
      }

      const maxX = () => Math.max(0, track.scrollWidth - viewport.clientWidth);
      let stops = list.map(() => 0);
      const measure = () => {
        const max = maxX();
        const origin = list[0]?.offsetLeft ?? 0;
        stops = list.map((card) => (max > 0 ? Math.min(1, Math.max(0, (card.offsetLeft - origin) / max)) : 0));
      };
      const nearest = (progress: number) =>
        stops.reduce((best, stop, k) => (Math.abs(stop - progress) < Math.abs(stops[best] - progress) ? k : best), 0);
      measure();

      const bars = Array.from(frame.querySelectorAll<HTMLElement>('[data-lb]'));
      gsap.set(bars, { scaleY: 0 });

      let current = -1;
      const update = (progress: number) => {
        current = nearest(progress);
        paint(current, progress);
      };

      const tween = gsap.to(track, {
        x: () => -maxX(),
        ease: 'none',
        scrollTrigger: {
          id: 'reel',
          trigger: frame,
          start: 'top top',
          end: () => `+=${maxX()}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          snap: {
            snapTo: (value: number) => stops[nearest(value)] ?? value,
            duration: { min: 0.2, max: 0.5 },
            delay: 0.08,
            ease: EASE_IN_OUT,
          },
          onRefresh: (self) => {
            measure();
            update(self.progress);
          },
          onUpdate: (self) => update(self.progress),
          onToggle: (self) => {
            gsap.to(bars, {
              scaleY: self.isActive ? 1 : 0,
              duration: self.isActive ? 0.32 : 0.21,
              ease: self.isActive ? EASE_OUT : EASE_IN_OUT,
              overwrite: true,
            });
            frame.style.willChange = self.isActive ? 'transform' : '';
          },
        },
      });
      update(0);

      // B5.3: inner media smoothly settles (scale 1.05 -> 1, opacity 0.7 -> 1) inside the masked window as each card enters.
      list.forEach((card) => {
        const media = card.querySelector<HTMLElement>('[data-reel-media]');
        if (!media) return;
        const inner = media.querySelector<HTMLElement>('[class*="mediaBox"], [class*="plate"]') ?? media;
        gsap.fromTo(
          inner,
          { opacity: 0.7, scale: 1.05 },
          {
            opacity: 1,
            scale: 1,
            ease: 'none',
            scrollTrigger: { trigger: card, containerAnimation: tween, start: 'left 95%', end: 'left 65%', scrub: true },
          },
        );
      });

      // B5.6: Prev/Next/focus → whip-pan the window scroll to the card's snap point.
      const scrollToCard = (i: number) => {
        const st = tween.scrollTrigger;
        if (!st) return;
        const y = st.start + (stops[i] ?? 0) * (st.end - st.start);
        if (lenis) lenis.scrollTo(y, { duration: 0.32, easing: easeInOutCubic });
        else window.scrollTo({ top: y, behavior: 'smooth' });
      };
      pinApi.current = {
        goTo: scrollToCard,
        focusCard: (i) => {
          // The browser may scroll the overflow:hidden scrollport to the focused link; undo it.
          viewport.scrollLeft = 0;
          frame.scrollLeft = 0;
          if (i !== current || !tween.scrollTrigger?.isActive) scrollToCard(i);
        },
      };

      return () => {
        pinApi.current = null;
        frame.style.willChange = '';
        delete root.dataset.mode;
        viewport.dispatchEvent(new Event('scroll')); // hand index/progress back to the native row
      };
    };

    /* Native row / Tier B: cards reveal once (02b Scene 05 §6). */
    const reveals = () => {
      if (!below(track)) return;
      gsap.from(cards(), {
        opacity: 0,
        y: 12,
        duration: 0.32,
        ease: EASE_OUT,
        stagger: 0.06,
        scrollTrigger: { trigger: track, start: 'top 85%', once: true },
      });
    };

    mm.add({ pin: conditions.pinReel, flow: `not all and ${conditions.pinReel}` }, (context) => {
      if (context.conditions?.pin) {
        const cleanup = pin();
        if (cleanup) return cleanup;
      }
      reveals();
      return undefined;
    });

    return () => split?.revert();
  });

  const controlClass =
    'inline-flex min-h-11 items-center justify-center gap-2 rounded-sm border border-line-strong px-3 text-body-sm font-medium text-ink transition-colors duration-(--dur-fast) hover-fine:border-ink-3 hover-fine:bg-bg-1 disabled:cursor-not-allowed disabled:border-line disabled:text-ink-3';

  return (
    <div ref={rootRef} className={styles.root}>
      <div className={styles.frame} data-pin-frame>
        <span className={styles.letterbox} data-lb="top" aria-hidden="true" />
        <div className="frame mb-8 flex flex-wrap items-end justify-between gap-x-8 gap-y-6 md:mb-10" data-reel-bar>
          <div className="min-w-0" data-reel-head>
            {header}
          </div>
          <div className="hidden items-center gap-5 min-[40rem]:flex tier-c:hidden" data-reel-controls>
            <div className="flex items-center gap-3" aria-hidden="true">
              <span className="font-pixel text-pixel-sm text-ink">
                {pad(index + 1)} <span className="text-ink-3">/ {pad(count)}</span>
              </span>
              <span className="relative block h-px w-20 overflow-hidden bg-line-strong md:w-28">
                <span
                  ref={barRef}
                  className="absolute inset-0 origin-left bg-grade-teal"
                  style={{ transform: `scaleX(${1 / Math.max(1, count)})` }}
                />
              </span>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                className={controlClass}
                aria-label="Previous project"
                aria-controls={TRACK_ID}
                disabled={index === 0}
                onClick={() => goTo(index - 1)}
              >
                <PixelIcon name="arrow-left" size={20} />
                <span className="hidden md:inline">Previous</span>
              </button>
              <button
                type="button"
                className={controlClass}
                aria-label="Next project"
                aria-controls={TRACK_ID}
                disabled={index >= count - 1}
                onClick={() => goTo(index + 1)}
              >
                <span className="hidden md:inline">Next</span>
                <PixelIcon name="arrow-right" size={20} />
              </button>
            </div>
          </div>
        </div>
        <div
          ref={viewportRef}
          role="region"
          aria-label={`Selected work, ${count} items`}
          className={styles.viewport}
          onKeyDown={onKeyDown}
        >
          <ol ref={trackRef} id={TRACK_ID} className={styles.track} onFocus={onFocus}>
            {children}
          </ol>
        </div>
        <span className={styles.letterbox} data-lb="bottom" aria-hidden="true" />
      </div>
    </div>
  );
}
