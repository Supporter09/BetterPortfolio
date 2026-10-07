'use client';

import { useEffect, useRef, useSyncExternalStore } from 'react';
import { useRouter } from 'next/navigation';
import { Command } from 'cmdk';
import { PixelIcon } from '@/components/ui/pixel-icon';
import { SCENES } from '@/content/scenes';
import { RESEARCH } from '@/content/research';
import { WORK } from '@/content/work';
import { SITE } from '@/content/site';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { goToScene } from '@/components/chrome/navigate';
import { useMotionRuntime } from '@/lib/motion/motion-provider';
import { getMotionOptOut, setMotionEnabled, useMotionTier } from '@/lib/motion/tiers';

export type PaletteGroup = 'Scenes' | 'Work' | 'Links' | 'Actions';

/* ------------------------------------------------------------------
   Open/close store. HUD lazy-imports this module on ⌘K / button /
   `open-scene-palette`, renders <CommandPalette/>, then calls open.
------------------------------------------------------------------- */
interface PaletteState {
  open: boolean;
  group: PaletteGroup | null;
}
let paletteState: PaletteState = { open: false, group: null };
const paletteListeners = new Set<() => void>();

function setPaletteState(next: PaletteState) {
  paletteState = next;
  paletteListeners.forEach((listener) => listener());
}

function subscribePalette(onChange: () => void): () => void {
  paletteListeners.add(onChange);
  return () => {
    paletteListeners.delete(onChange);
  };
}

export function openCommandPalette({ group }: { group?: PaletteGroup } = {}): void {
  setPaletteState({ open: true, group: group ?? null });
}

const SCENE_ITEMS = SCENES.filter((scene) => scene.id !== 'cold-open');
const WORK_ITEMS = [
  ...RESEARCH.map((entry) => ({ slug: entry.slug, title: entry.title, meta: entry.kicker })),
  ...WORK.map((entry) => ({ slug: entry.slug, title: entry.title, meta: entry.org })),
];

const ITEM_CLASS =
  'flex min-h-11 cursor-pointer items-center gap-3 border-l-2 border-transparent px-4 text-body-sm text-ink-2 outline-none select-none max-md:min-h-12 data-[disabled=true]:cursor-not-allowed data-[disabled=true]:text-ink-3 data-[selected=true]:border-grade-amber data-[selected=true]:bg-bg-2 data-[selected=true]:text-ink';
const GROUP_CLASS =
  'py-2 [&_[cmdk-group-heading]]:label-mono [&_[cmdk-group-heading]]:px-4 [&_[cmdk-group-heading]]:pt-2 [&_[cmdk-group-heading]]:pb-1 [&_[cmdk-group-heading]]:text-[0.75rem] [&_[cmdk-group-heading]]:text-ink-3';

/** Command palette (01 §5.12): cmdk inside a Radix Dialog. Groups: Scenes, Work, Links, Actions. */
export function CommandPalette() {
  const { open, group } = useSyncExternalStore(
    subscribePalette,
    () => paletteState,
    () => paletteState,
  );
  const router = useRouter();
  const runtime = useMotionRuntime();
  const tier = useMotionTier();
  const pending = useRef<(() => void) | null>(null);

  useEffect(() => {
    const root = document.documentElement;
    if (open) root.dataset.paletteOpen = '';
    else delete root.dataset.paletteOpen;
  }, [open]);

  // Run navigation after the dialog has released focus trap + scroll lock.
  const runAfterClose = (action: () => void) => {
    pending.current = action;
    setPaletteState({ ...paletteState, open: false });
  };

  const show = (name: PaletteGroup) => group === null || group === name;
  const motionOptOut = tier !== null && getMotionOptOut();
  const systemReduced = tier === 'C' && !motionOptOut;

  return (
    <Dialog open={open} onOpenChange={(next) => setPaletteState({ ...paletteState, open: next })}>
      <DialogContent
        aria-describedby="command-palette-hint"
        data-lenis-prevent
        onCloseAutoFocus={(event) => {
          const action = pending.current;
          if (!action) return;
          pending.current = null;
          event.preventDefault();
          action();
        }}
      >
        <DialogTitle className="sr-only">Command palette</DialogTitle>
        <DialogDescription id="command-palette-hint" className="sr-only">
          Jump to a scene, case study, link, or action. Use arrow keys to navigate, Enter to open, Escape to close.
        </DialogDescription>
        <Command label="Command palette" loop className="flex max-h-[inherit] flex-col">
          <div className="flex h-14 shrink-0 items-center gap-3 border-b border-input px-4">
            <PixelIcon name="search" size={20} className="text-ink-3" />
            <Command.Input
              autoFocus
              placeholder="Jump to a scene, case study, or action…"
              className="h-full min-w-0 flex-1 bg-transparent text-body text-ink outline-none placeholder:text-ink-3"
            />
            {group ? (
              <button
                type="button"
                onClick={() => setPaletteState({ ...paletteState, group: null })}
                className="label-mono inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-xs px-2 text-ink-2 hover-fine:text-ink"
                aria-label={`Showing ${group} only. Show all groups`}
              >
                {group}
                <PixelIcon name="close" size={16} />
              </button>
            ) : null}
          </div>

          <Command.List className="min-h-0 flex-1 overflow-y-auto overscroll-contain" data-lenis-prevent>
            <Command.Empty className="px-4 py-6 text-body-sm text-ink-3">No results.</Command.Empty>

            {show('Scenes') ? (
              <Command.Group heading="Scenes" className={GROUP_CLASS}>
                {SCENE_ITEMS.map((scene) => (
                  <Command.Item
                    key={scene.id}
                    value={`scene ${scene.number} ${scene.title}`}
                    keywords={[scene.slate, scene.id]}
                    onSelect={() => runAfterClose(() => goToScene(scene.id, runtime?.lenis ?? null))}
                    className={ITEM_CLASS}
                  >
                    <span className="label-mono w-12 shrink-0 text-ink-3">
                      SC <span className="font-pixel text-pixel-sm">{scene.number}</span>
                    </span>
                    <span className="min-w-0 flex-1 truncate">{scene.title}</span>
                  </Command.Item>
                ))}
              </Command.Group>
            ) : null}

            {show('Work') ? (
              <Command.Group heading="Work" className={GROUP_CLASS}>
                {WORK_ITEMS.map((item) => (
                  <Command.Item
                    key={item.slug}
                    value={`work ${item.title}`}
                    keywords={[item.meta, item.slug]}
                    onSelect={() => runAfterClose(() => router.push(`/work/${item.slug}`))}
                    className={ITEM_CLASS}
                  >
                    <span className="min-w-0 flex-1 truncate">
                      {item.title}
                      <span className="text-ink-3"> · {item.meta}</span>
                    </span>
                    <PixelIcon name="arrow-right" size={16} className="text-ink-3" />
                  </Command.Item>
                ))}
              </Command.Group>
            ) : null}

            {show('Links') ? (
              <Command.Group heading="Links" className={GROUP_CLASS}>
                {SITE.links.map((link) => (
                  <Command.Item
                    key={link.label}
                    value={`link ${link.label}`}
                    keywords={[link.kind]}
                    disabled={link.placeholder === true}
                    onSelect={() => {
                      if (link.placeholder) return;
                      if (link.external) window.open(link.href, '_blank', 'noopener,noreferrer');
                      else runAfterClose(() => router.push(link.href));
                    }}
                    className={ITEM_CLASS}
                  >
                    <span className="min-w-0 flex-1 truncate">{link.label}</span>
                    {link.placeholder ? (
                      <span className="label-mono shrink-0 text-ink-3">Link coming soon</span>
                    ) : link.external ? (
                      <>
                        <PixelIcon name="arrow-up-right" size={16} className="text-ink-3" />
                        <span className="sr-only">(opens in a new tab)</span>
                      </>
                    ) : null}
                  </Command.Item>
                ))}
              </Command.Group>
            ) : null}

            {show('Actions') ? (
              <Command.Group heading="Actions" className={GROUP_CLASS}>
                <Command.Item
                  value={`motion ${motionOptOut ? 'off' : 'on'} reduce animation toggle`}
                  onSelect={() => setMotionEnabled(motionOptOut)}
                  className={ITEM_CLASS}
                >
                  <span className="min-w-0 flex-1 truncate">Motion: {motionOptOut ? 'off' : 'on'}</span>
                  <span className="label-mono shrink-0 text-ink-3">
                    {systemReduced ? 'System reduced motion' : motionOptOut ? 'Turn on' : 'Turn off'}
                  </span>
                </Command.Item>
              </Command.Group>
            ) : null}
          </Command.List>

          <p className="label-mono shrink-0 border-t border-line px-4 py-3 text-[0.75rem] text-ink-3 max-md:hidden" aria-hidden="true">
            ↑↓ navigate · ↵ open · esc close
          </p>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
