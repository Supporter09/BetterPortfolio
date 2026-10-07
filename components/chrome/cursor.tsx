'use client';

import { useEffect, useRef, useSyncExternalStore } from 'react';
import { useMotionTier } from '@/lib/motion/tiers';

const CURSOR_QUERY = '(min-width:1024px) and (pointer:fine) and (forced-colors:none)';

function subscribeCursorQuery(onChange: () => void): () => void {
  const list = window.matchMedia(CURSOR_QUERY);
  list.addEventListener('change', onChange);
  return () => list.removeEventListener('change', onChange);
}

/** Mounts the custom cursor only in Tier A on ≥1024px fine-pointer screens outside forced-colors. */
export function Cursor() {
  const tier = useMotionTier();
  const eligible = useSyncExternalStore(
    subscribeCursorQuery,
    () => window.matchMedia(CURSOR_QUERY).matches,
    () => false,
  );
  return tier === 'A' && eligible ? <ViewfinderCursor /> : null;
}

/**
 * Custom viewfinder cursor (01 §5.16, 02a §7). Dot (6px ink) → 40px amber brackets over
 * `[data-cursor=media]`, label from `data-cursor-label`. Never hides focus rings or the native cursor
 * on text/controls (only media regions get `cursor:none`); hides after keyboard use until the mouse moves.
 */
function ViewfinderCursor() {
  const rootRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = rootRef.current;
    const labelEl = labelRef.current;
    if (!el || !labelEl) return;
    const html = document.documentElement;
    html.dataset.cursor = 'on';

    let x = -100;
    let y = -100;
    let cx = x;
    let cy = y;
    let raf = 0;

    const step = () => {
      cx += (x - cx) * 0.35;
      cy += (y - cy) * 0.35;
      el.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      raf = Math.abs(x - cx) + Math.abs(y - cy) > 0.1 ? requestAnimationFrame(step) : 0;
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      x = event.clientX;
      y = event.clientY;
      el.dataset.visible = 'true';
      const media = (event.target as Element | null)?.closest<HTMLElement>('[data-cursor="media"]');
      el.dataset.mode = media ? 'media' : 'dot';
      const label = media?.dataset.cursorLabel ?? '';
      if (labelEl.textContent !== label) labelEl.textContent = label;
      if (!raf) raf = requestAnimationFrame(step);
    };
    const hide = () => {
      el.dataset.visible = 'false';
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Tab' || event.key.startsWith('Arrow')) hide();
    };
    const onDown = () => {
      el.dataset.pressed = 'true';
    };
    const onUp = () => {
      el.dataset.pressed = 'false';
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onDown, { passive: true });
    window.addEventListener('pointerup', onUp, { passive: true });
    window.addEventListener('keydown', onKey);
    document.documentElement.addEventListener('pointerleave', hide);
    window.addEventListener('blur', hide);

    return () => {
      cancelAnimationFrame(raf);
      delete html.dataset.cursor;
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('keydown', onKey);
      document.documentElement.removeEventListener('pointerleave', hide);
      window.removeEventListener('blur', hide);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      data-visible="false"
      data-mode="dot"
      className="group/cursor pointer-events-none fixed top-0 left-0 z-(--z-cursor) opacity-0 transition-opacity duration-(--dur-fast) data-[visible=true]:opacity-100"
    >
      <div className="relative -translate-x-1/2 -translate-y-1/2 transition-transform duration-(--dur-instant) ease-standard group-data-[pressed=true]/cursor:scale-90">
        {/* Dot */}
        <span className="block size-1.5 rounded-full bg-ink transition-opacity duration-(--dur-fast) group-data-[mode=media]/cursor:opacity-0" />
        {/* Viewfinder brackets (40×40) */}
        <span className="absolute top-1/2 left-1/2 size-10 -translate-x-1/2 -translate-y-1/2 scale-50 opacity-0 transition-[opacity,scale] duration-(--dur-fast) ease-out group-data-[mode=media]/cursor:scale-100 group-data-[mode=media]/cursor:opacity-100">
          <span className="absolute top-0 left-0 size-2.5 border-t border-l border-grade-amber" />
          <span className="absolute top-0 right-0 size-2.5 border-t border-r border-grade-amber" />
          <span className="absolute bottom-0 left-0 size-2.5 border-b border-l border-grade-amber" />
          <span className="absolute right-0 bottom-0 size-2.5 border-r border-b border-grade-amber" />
        </span>
        {/* Label */}
        <span
          ref={labelRef}
          className="absolute top-1/2 left-7 -translate-y-1/2 bg-bg-0/80 px-1.5 py-0.5 font-mono text-[0.75rem] tracking-[0.08em] text-ink uppercase empty:hidden"
        />
      </div>
    </div>
  );
}
