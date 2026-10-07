'use client';

import { useEffect, useRef } from 'react';

/** sessionStorage flag read by the inline boot script (lib/boot/boot-script.ts). */
const BOOT_SEEN_KEY = 'runtime_boot_seen';
/** Fired once the overlay is gone (played out or skipped). Scene 01 also watches `html[data-boot]`. */
export const BOOT_END_EVENT = 'runtime:boot-end';
/** Safety net if the CSS `boot-out` animation can't be observed (it ends at ≤ 2.3 s after first paint). */
const FALLBACK_MS = 3200;
const SKIP_FADE_MS = 100;

/**
 * Cold-open controller (02a Scene 00 §8). The overlay itself is pure CSS keyframes gated by
 * `html[data-boot=play]`; this island only:
 * - renders the "Skip intro" button and makes it the first Tab stop while the overlay plays,
 * - skips on Escape / button (≤ 100 ms cut to Scene 01),
 * - on finish: removes `data-boot`, sets `sessionStorage.runtime_boot_seen`, dispatches `runtime:boot-end`.
 * Never blocks the content beneath: the overlay ends with `visibility: hidden` even if this never hydrates.
 */
export function ColdOpenController() {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const skipRef = useRef<() => void>(() => {});

  useEffect(() => {
    const root = document.documentElement;
    const button = buttonRef.current;
    const overlay = button?.closest<HTMLElement>('.cold-open');
    if (!button || !overlay || root.dataset.boot !== 'play') return;

    let finished = false;
    let fade: Animation | null = null;

    const finish = () => {
      if (finished) return;
      finished = true;
      teardown();
      try {
        sessionStorage.setItem(BOOT_SEEN_KEY, 'true');
      } catch {
        // storage blocked: the intro simply plays again next load
      }
      if (root.dataset.boot === 'play') delete root.dataset.boot;
      fade?.cancel();
      window.dispatchEvent(new CustomEvent(BOOT_END_EVENT));
    };

    const skip = () => {
      if (finished || fade) return;
      if (overlay.contains(document.activeElement)) {
        // Hand keyboard users straight to the content instead of dropping focus on <body>.
        document.getElementById('main')?.focus({ preventScroll: true });
      }
      const from = getComputedStyle(overlay).opacity;
      fade = overlay.animate([{ opacity: from }, { opacity: 0 }], {
        duration: SKIP_FADE_MS,
        easing: 'cubic-bezier(0.2, 0, 0, 1)',
        fill: 'forwards',
      });
      fade.finished.then(finish, finish);
    };
    skipRef.current = skip;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        skip();
        return;
      }
      // "Skip intro" is the first focus stop while the overlay is visible (02a Scene 00 §8).
      if (event.key === 'Tab' && !event.shiftKey) {
        const active = document.activeElement;
        if (!active || active === document.body || active === root || active.id === 'main') {
          event.preventDefault();
          button.focus();
        }
      }
    };

    // Natural end: the CSS `boot-out` animation on the overlay.
    const bootOut = overlay
      .getAnimations()
      .find((animation) => (animation as CSSAnimation).animationName === 'boot-out');
    bootOut?.finished.then(finish, finish);
    const fallback = window.setTimeout(finish, FALLBACK_MS);

    // Someone else ended the boot (e.g. "Motion: off" in the palette) → just record it.
    const observer = new MutationObserver(() => {
      if (root.dataset.boot !== 'play') finish();
    });
    observer.observe(root, { attributes: true, attributeFilter: ['data-boot'] });

    window.addEventListener('keydown', onKeyDown, true);

    function teardown() {
      window.removeEventListener('keydown', onKeyDown, true);
      window.clearTimeout(fallback);
      observer.disconnect();
    }

    return () => {
      teardown();
      skipRef.current = () => {};
    };
  }, []);

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={() => skipRef.current()}
      aria-keyshortcuts="Escape"
      className="label-mono absolute top-4 right-4 inline-flex min-h-11 items-center gap-3 rounded-sm border border-line-strong bg-bg-0/80 px-4 text-ink-2 transition-colors duration-(--dur-fast) ease-standard hover-fine:border-ink-3 hover-fine:text-ink md:top-6 md:right-6"
    >
      Skip intro
      <kbd aria-hidden="true" className="rounded-xs border border-line px-1.5 py-0.5 font-mono text-ink-3">
        Esc
      </kbd>
    </button>
  );
}
