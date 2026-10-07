import type Lenis from 'lenis';

/**
 * Jump to a scene (palette, menu, timecode): update the hash, scroll (Lenis in Tier A, native otherwise;
 * instant in Tier C), then move focus to the scene heading (`#<id>-title`, made focusable with tabindex=-1).
 * Call after any dialog has released its scroll lock / focus trap.
 */
export function goToScene(id: string, lenis: Lenis | null): void {
  const target = document.getElementById(id);
  if (!target) return;
  const root = document.documentElement;
  const instant = root.dataset.tier === 'C' || window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (window.location.hash !== `#${id}`) window.history.pushState(null, '', `#${id}`);

  if (lenis) {
    const offset = Number.parseFloat(getComputedStyle(root).scrollPaddingTop) || 0;
    lenis.scrollTo(target, { offset: -offset, immediate: instant });
  } else {
    target.scrollIntoView({ behavior: instant ? 'auto' : 'smooth', block: 'start' });
  }

  const heading = document.getElementById(`${id}-title`) ?? target;
  if (!heading.hasAttribute('tabindex')) heading.setAttribute('tabindex', '-1');
  heading.focus({ preventScroll: true });
}

/** Window events consumed by the HUD's eager listener (which lazy-loads the palette). */
export const OPEN_SCENE_PALETTE_EVENT = 'open-scene-palette';
/** `detail?: { group?: PaletteGroup }` */
export const OPEN_PALETTE_EVENT = 'open-command-palette';
