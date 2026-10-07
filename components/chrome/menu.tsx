'use client';

import { useRef, useState, type ComponentProps, type MouseEvent } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PixelIcon } from '@/components/ui/pixel-icon';
import { SCENES } from '@/content/scenes';
import { SITE } from '@/content/site';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { HudClock } from '@/components/chrome/hud-clock';
import { OPEN_PALETTE_EVENT, goToScene } from '@/components/chrome/navigate';
import { useMotionRuntime } from '@/lib/motion/motion-provider';
import { getMotionOptOut, setMotionEnabled, useMotionTier } from '@/lib/motion/tiers';
import { cn } from '@/lib/utils';

const SCENE_ITEMS = SCENES.filter((scene) => scene.id !== 'cold-open');

interface SceneLinkProps extends Omit<ComponentProps<'a'>, 'href' | 'onClick'> {
  /** Scene id (`opening`, `reel`, …). */
  scene: string;
  /** Home only: the in-page click (Lenis / native anchor, or a custom scroll). Elsewhere the link is a route change. */
  onSceneClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
  /** Every route: fired before navigation (e.g. to close an overlay). */
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
}

/**
 * Anchor to a scene: `#<id>` on `/` (in-page, smooth via Lenis anchors / `scroll-behavior`), a real
 * `/#<id>` navigation from any sub-page (/work/*, /archive, /films, 404) where the scene does not exist.
 */
export function SceneLink({ scene, onSceneClick, onClick, ...props }: SceneLinkProps) {
  const home = usePathname() === '/';
  if (!home) return <Link href={`/#${scene}`} onClick={onClick} {...props} />;
  return (
    <a
      href={`#${scene}`}
      onClick={(event) => {
        onClick?.(event);
        onSceneClick?.(event);
      }}
      {...props}
    />
  );
}

/**
 * Menu overlay (01 §5.13): full-screen Radix Dialog (z-50). Left: scene list; right: links, search,
 * motion toggle, compact telemetry. Choosing a scene closes the menu, scrolls, and focuses the scene heading.
 */
export function Menu() {
  const [open, setOpen] = useState(false);
  const [activeScene, setActiveScene] = useState<string | undefined>(undefined);
  const pending = useRef<(() => void) | null>(null);
  const currentRef = useRef<HTMLAnchorElement>(null);
  const runtime = useMotionRuntime();
  const tier = useMotionTier();

  const closeThen = (action: () => void) => {
    pending.current = action;
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (next) setActiveScene(document.documentElement.dataset.activeScene);
        setOpen(next);
      }}
    >
      <DialogTrigger className="inline-flex min-h-11 items-center gap-2 rounded-sm px-3 text-body-sm font-medium text-ink-2 transition-colors hover-fine:text-ink active:translate-y-px">
        <PixelIcon name="list" size={20} />
        Menu
      </DialogTrigger>
      <DialogContent
        variant="fullscreen"
        showClose
        closeLabel="Close menu"
        data-lenis-prevent
        onOpenAutoFocus={(event) => {
          if (!currentRef.current) return;
          event.preventDefault();
          currentRef.current.focus();
        }}
        onCloseAutoFocus={(event) => {
          const action = pending.current;
          if (!action) return;
          pending.current = null;
          event.preventDefault();
          action();
        }}
      >
        <DialogTitle className="sr-only">Site menu</DialogTitle>
        <DialogDescription className="sr-only">Scene list, links, and site settings.</DialogDescription>

        <div className="frame flex min-h-full flex-col pt-[calc(var(--spacing-hud)+1rem)] pb-12">
          <div className="grid flex-1 gap-12 lg:grid-cols-12 lg:gap-(--spacing-gutter)">
            <nav aria-label="Scenes" className="lg:col-span-7">
              <ol className="flex flex-col">
                {SCENE_ITEMS.map((scene) => {
                  const current = scene.id === activeScene;
                  return (
                    <li key={scene.id}>
                      <SceneLink
                        ref={current ? currentRef : undefined}
                        scene={scene.id}
                        aria-current={current ? 'location' : undefined}
                        onClick={() => setOpen(false)}
                        onSceneClick={(event) => {
                          event.preventDefault();
                          closeThen(() => goToScene(scene.id, runtime?.lenis ?? null));
                        }}
                        className={cn(
                          'group flex min-h-14 items-baseline gap-4 border-l-2 py-2 pl-4 transition-colors md:gap-6',
                          current ? 'border-grade-amber text-ink' : 'border-transparent text-ink-2 hover-fine:text-ink',
                        )}
                      >
                        <span className="font-pixel text-pixel-sm w-8 shrink-0 text-ink-3">{scene.number}</span>
                        <span className="font-display text-heading-lg decoration-1 underline-offset-[0.2em] group-hover:underline md:text-display-md">
                          {scene.title}
                        </span>
                      </SceneLink>
                    </li>
                  );
                })}
              </ol>
            </nav>

            <div className="flex flex-col gap-10 lg:col-span-5">
              <section aria-labelledby="menu-links-title">
                <h2 id="menu-links-title" className="label-mono mb-3 font-mono text-ink-3">
                  Links
                </h2>
                <ul className="flex flex-col">
                  {SITE.links.map((link) => (
                    <li key={link.label}>
                      {link.placeholder ? (
                        <span
                          className="flex min-h-11 items-center gap-3 text-body text-ink-3"
                          aria-disabled="true"
                        >
                          {link.label}
                          <span className="label-mono">Link coming soon</span>
                        </span>
                      ) : (
                        <a
                          href={link.href}
                          target={link.external ? '_blank' : undefined}
                          rel={link.external ? 'noopener noreferrer' : undefined}
                          className="inline-flex min-h-11 items-center gap-2 text-body text-ink-2 decoration-1 underline-offset-[0.2em] transition-colors hover-fine:text-ink hover-fine:underline"
                        >
                          {link.label}
                          {link.external ? (
                            <>
                              <PixelIcon name="arrow-up-right" size={16} />
                              <span className="sr-only">(opens in a new tab)</span>
                            </>
                          ) : null}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </section>

              <section aria-labelledby="menu-settings-title" className="flex flex-col gap-2">
                <h2 id="menu-settings-title" className="label-mono mb-1 font-mono text-ink-3">
                  Settings
                </h2>
                <button
                  type="button"
                  onClick={() =>
                    closeThen(() => window.dispatchEvent(new CustomEvent(OPEN_PALETTE_EVENT, { detail: {} })))
                  }
                  className="inline-flex min-h-11 items-center gap-2 self-start text-body text-ink-2 transition-colors hover-fine:text-ink"
                >
                  <PixelIcon name="search" size={20} />
                  Search and commands
                </button>
                <button
                  type="button"
                  aria-pressed={tier !== 'C'}
                  onClick={() => setMotionEnabled(tier === 'C')}
                  className="inline-flex min-h-11 items-center gap-3 self-start text-body text-ink-2 transition-colors hover-fine:text-ink"
                >
                  Animations / Motion
                  <span className="label-mono text-ink-3">{tier === 'C' ? 'Off' : 'On'}</span>
                </button>
              </section>

              <p className="label-mono mt-auto flex items-center gap-2 text-ink-3">
                <span>{SITE.location}</span>
                <span aria-hidden="true">·</span>
                <span>
                  <HudClock className="font-pixel text-pixel-sm" /> ICT
                </span>
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
