'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { SITE } from '@/content/site';
import { HudClock } from '@/components/chrome/hud-clock';
import { Menu, SceneLink } from '@/components/chrome/menu';
import { OPEN_PALETTE_EVENT, OPEN_SCENE_PALETTE_EVENT } from '@/components/chrome/navigate';
import type { PaletteGroup } from '@/components/chrome/command-palette';

// Lazy: cmdk + palette code load on first ⌘K / button / timecode click only.
const CommandPalette = dynamic(
  () => import('@/components/chrome/command-palette').then((mod) => mod.CommandPalette),
  { ssr: false },
);

function subscribeNothing(): () => void {
  return () => {};
}

function isEditable(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName);
}

/**
 * HUD bar (01 §5.1). Left: YouTube avatar → #opening (`/#opening` from sub-pages). Centre (≥1024): `VIETNAM · HH:MM ICT · ● REC`.
 * Right: ⌘K (≥1024) + Menu. Owns the eager listeners for ⌘K / Ctrl K and `open-scene-palette`.
 */
export function Hud() {
  const [paletteRequested, setPaletteRequested] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isMac = useSyncExternalStore(
    subscribeNothing,
    () => /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent),
    () => true,
  );

  useEffect(() => {
    const open = (group?: PaletteGroup) => {
      setPaletteRequested(true);
      // Dynamic on purpose: same lazy chunk as <CommandPalette/>; keeps cmdk out of the initial JS.
      import('@/components/chrome/command-palette').then(({ openCommandPalette }) => openCommandPalette({ group }));
    };
    const onScenePalette = () => open('Scenes');
    const onPalette = (event: Event) => open((event as CustomEvent<{ group?: PaletteGroup }>).detail?.group);
    const onKey = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() !== 'k' || !(event.metaKey || event.ctrlKey)) return;
      if (isEditable(event.target) && !(event.target as HTMLElement).hasAttribute('cmdk-input')) return;
      event.preventDefault();
      open();
    };
    window.addEventListener(OPEN_SCENE_PALETTE_EVENT, onScenePalette);
    window.addEventListener(OPEN_PALETTE_EVENT, onPalette);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener(OPEN_SCENE_PALETTE_EVENT, onScenePalette);
      window.removeEventListener(OPEN_PALETTE_EVENT, onPalette);
      window.removeEventListener('keydown', onKey);
    };
  }, []);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      setScrolled(window.scrollY > 24);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <header
        className="fixed inset-x-0 top-0 z-(--z-hud) h-(--spacing-hud) border-b border-transparent transition-colors duration-(--dur-fast) ease-standard data-[scrolled=true]:border-line data-[scrolled=true]:bg-bg-1/92"
        data-scrolled={scrolled ? 'true' : undefined}
      >
        <div className="frame flex h-full items-center justify-between gap-4">
          <SceneLink
            scene="opening"
            className="inline-flex min-h-11 min-w-11 items-center justify-center"
          >
            <Image
              src="/media/avatar.png"
              width={28}
              height={28}
              alt={`${SITE.name} — home`}
              style={{ imageRendering: 'pixelated' }}
              className="drop-shadow-sm"
            />
          </SceneLink>

          <div
            role="group"
            aria-label="Local time in Vietnam (ICT)"
            className="label-mono hidden items-center gap-2 text-ink-2 lg:flex"
          >
            <span>{SITE.location}</span>
            <span aria-hidden="true">·</span>
            <span>
              <HudClock className="font-pixel text-pixel-sm text-ink" /> ICT
            </span>
            <span aria-hidden="true">·</span>
            <span aria-hidden="true" className="inline-flex items-center gap-1.5">
              <span className="rec-dot" data-pulse="true" />
              REC
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent(OPEN_PALETTE_EVENT, { detail: {} }))}
              aria-keyshortcuts="Meta+K Control+K"
              aria-label="Open command palette"
              className="hidden min-h-11 items-center rounded-sm px-3 text-ink-2 transition-colors hover-fine:text-ink active:translate-y-px lg:inline-flex"
            >
              <kbd className="label-mono rounded-xs border border-line-strong px-1.5 py-0.5 font-mono" suppressHydrationWarning>
                {isMac ? '⌘K' : 'Ctrl K'}
              </kbd>
            </button>
            <Menu />
          </div>
        </div>
      </header>
      {paletteRequested ? <CommandPalette /> : null}
    </>
  );
}
