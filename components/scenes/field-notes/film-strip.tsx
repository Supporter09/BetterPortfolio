'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { PixelIcon } from '@/components/ui/pixel-icon';
import { useMotionTier } from '@/lib/motion/tiers';
import { cn } from '@/lib/utils';
import styles from './field-notes.module.css';

interface FilmStripProps {
  id: string;
  /** Region label, e.g. 'Field notes, 4 frames'. */
  label: string;
  /** Frame codes in track order (counter `02A / 05A`). */
  codes: string[];
  /** Optional heading placed left of the controls (KAIST beat label). */
  heading?: ReactNode;
  className?: string;
  /** `<li>` frames. */
  children: ReactNode;
}

const CONTROL =
  'inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-sm border border-line-strong px-3 text-body-sm font-medium text-ink transition-colors duration-(--dur-fast) hover-fine:border-ink-3 hover-fine:bg-bg-1 disabled:cursor-not-allowed disabled:border-line disabled:text-ink-3';

/**
 * One film strip (02b Scene 06 §6): native horizontal scroll-snap ≥768px with Prev/Next + `code / last`
 * counter; a 2-column contact sheet below 768px. Controls only appear when the strip actually overflows.
 * Never auto-advances; Tier C scrolls without smoothing (user-driven scrolling is not motion).
 */
export function FilmStrip({ id, label, codes, heading, className, children }: FilmStripProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [overflow, setOverflow] = useState(false);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);
  const tier = useMotionTier();
  const count = codes.length;

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    let raf = 0;
    const sync = () => {
      raf = 0;
      const list = Array.from(scroller.querySelectorAll<HTMLElement>('[data-strip-item]'));
      const max = scroller.scrollWidth - scroller.clientWidth;
      if (!list.length || max <= 1) {
        setOverflow(false);
        setIndex(0);
        setCanPrev(false);
        setCanNext(false);
        return;
      }
      setOverflow(true);
      const left = scroller.scrollLeft;
      const origin = list[0]?.offsetLeft ?? 0;
      const nearest = list.reduce(
        (best, item, k) =>
          Math.abs(item.offsetLeft - origin - left) < Math.abs(list[best].offsetLeft - origin - left) ? k : best,
        0,
      );
      setIndex(left >= max - 5 ? list.length - 1 : nearest);
      setCanPrev(left > 5);
      setCanNext(left < max - 5);
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(sync);
    };

    // Horizontal mousewheel scroll when hovering over the strip (bryangarage style).
    // Intercepts vertical wheel events and scrolls horizontally until boundaries are reached.
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      const max = scroller.scrollWidth - scroller.clientWidth;
      if (max <= 1) return;
      const canScrollLeft = e.deltaY < 0 && scroller.scrollLeft > 2;
      const canScrollRight = e.deltaY > 0 && scroller.scrollLeft < max - 2;
      if (canScrollLeft || canScrollRight) {
        e.preventDefault();
        scroller.scrollLeft += e.deltaY;
      }
    };

    scroller.addEventListener('scroll', schedule, { passive: true });
    scroller.addEventListener('wheel', onWheel, { passive: false });
    const ro = new ResizeObserver(schedule);
    ro.observe(scroller);
    schedule();
    return () => {
      cancelAnimationFrame(raf);
      scroller.removeEventListener('scroll', schedule);
      scroller.removeEventListener('wheel', onWheel);
      ro.disconnect();
    };
  }, []);

  const goTo = (target: number) => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const list = Array.from(scroller.querySelectorAll<HTMLElement>('[data-strip-item]'));
    if (!list.length) return;
    const max = scroller.scrollWidth - scroller.clientWidth;
    const origin = list[0]?.offsetLeft ?? 0;
    const currentLeft = scroller.scrollLeft;

    let targetLeft = currentLeft;
    if (target < index) {
      // Going backward: find the item whose offsetLeft is strictly to the left of currentLeft - 10
      const prevItems = list.filter((item) => item.offsetLeft - origin < currentLeft - 10);
      const targetItem = prevItems[prevItems.length - 1] ?? list[0];
      targetLeft = Math.max(0, targetItem.offsetLeft - origin);
    } else {
      // Going forward: find the item whose offsetLeft is strictly to the right of currentLeft + 10
      const nextItems = list.filter((item) => item.offsetLeft - origin > currentLeft + 10);
      const targetItem = nextItems[0] ?? list[list.length - 1];
      targetLeft = Math.min(max, targetItem.offsetLeft - origin);
    }

    scroller.scrollTo({
      left: targetLeft,
      behavior: tier === 'C' ? 'auto' : 'smooth',
    });
  };

  return (
    <div className={cn(styles.strip, className)} data-strip>
      <div className="frame mb-4 flex min-h-11 flex-wrap items-end justify-between gap-x-6 gap-y-3" data-strip-bar>
        <div className="min-w-0">{heading}</div>
        <div className={cn('ml-auto flex items-center gap-4', !overflow && 'hidden')} data-strip-controls>
          <span className="font-pixel text-pixel-sm text-ink" aria-hidden="true">
            {codes[index]} <span className="text-ink-3">/ {codes[count - 1]}</span>
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              className={CONTROL}
              aria-label="Previous frame"
              aria-controls={id}
              disabled={!canPrev}
              onClick={() => goTo(index - 1)}
            >
              <PixelIcon name="arrow-left" size={20} />
            </button>
            <button
              type="button"
              className={CONTROL}
              aria-label="Next frame"
              aria-controls={id}
              disabled={!canNext}
              onClick={() => goTo(index + 1)}
            >
              <PixelIcon name="arrow-right" size={20} />
            </button>
          </div>
        </div>
      </div>
      <div ref={scrollerRef} role="region" aria-label={label} className={styles.scroller}>
        <ol id={id} className={styles.track} data-strip-track>
          {children}
        </ol>
      </div>
    </div>
  );
}
