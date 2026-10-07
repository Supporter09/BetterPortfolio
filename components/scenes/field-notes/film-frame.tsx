'use client';

import { useState, type ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { PixelIcon } from '@/components/ui/pixel-icon';
import { Rich } from '@/components/ui/rich-text';
import type { FilmEntry } from '@/content/types';
import { SCENE_COPY } from '@/content/scenes';
import { useMotionTier } from '@/lib/motion/tiers';
import { cn } from '@/lib/utils';
import styles from './field-notes.module.css';

/** `DAEJEON, KR` — country omitted when unknown (content/films.ts). */
export function filmLocation(film: FilmEntry): string {
  return film.country ? `${film.city}, ${film.country}` : film.city;
}

interface FilmFrameProps {
  film: FilmEntry;
  /** Server-rendered `<MediaFrame dither="always">` for the strip (dot matrix until developed). */
  media: ReactNode;
  /** Server-rendered `<MediaFrame>` for the lightbox. */
  lightboxMedia: ReactNode;
}

/**
 * One frame of the contact sheet (02b Scene 06 §8): a `<figure>` with exactly two controls —
 * `Develop` (toggle, `aria-pressed`) and `Play` (Radix Dialog lightbox). Develop = the dither reveal:
 * `data-developed` on the figure drives the `<Dither>` canvas (module CSS), the sprocket rails and the
 * state chip; the Dither's own toggle is hidden so this button is the single control. Tier A hover and
 * focus-within develop temporarily. Tier C starts developed and toggles instantly. The film link is a
 * `#` placeholder → the lightbox shows the placeholder footage and a visibly disabled "Link coming soon".
 */
export function FilmFrame({ film, media, lightboxMedia }: FilmFrameProps) {
  const tier = useMotionTier();
  const [pressed, setPressed] = useState<boolean | null>(null);
  const developed = pressed ?? tier === 'C';
  const location = filmLocation(film);
  const meta = [location, film.year, film.runtime].filter(Boolean).join(' · ');

  return (
    <figure className={styles.figure} data-film-frame data-developed={developed ? 'true' : 'false'}>
      <div className={cn(styles.mediaWrap, 'viewfinder')} data-cursor="media" data-cursor-label="DEVELOP">
        <div className={styles.media}>{media}</div>
        <span className={styles.rails} aria-hidden="true" />
        <span className={cn(styles.state, 'font-pixel text-pixel-xs uppercase')} aria-hidden="true">
          <PixelIcon name={developed ? 'cam' : 'film'} size={16} />
          {developed ? 'Developed' : 'Negative'}
        </span>
        <button
          type="button"
          className={cn(styles.develop, 'frame-develop')}
          aria-pressed={developed}
          aria-label={`Develop frame ${film.frame}, ${film.city}`}
          onClick={() => setPressed(!developed)}
        />
      </div>

      <figcaption className={styles.caption}>
        <div className="flex min-w-0 flex-col gap-1">
          <p className="label-mono text-ink">
            <span className="font-pixel text-pixel-sm">{film.frame}</span>
            <span className="text-ink-3">
              <span aria-hidden="true"> · </span>
              <span className="sr-only">, </span>
              {meta}
            </span>
          </p>
          <p className={cn(styles.title, 'text-body-sm text-ink-2')}>{film.title}</p>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <button
              type="button"
              className="frame-play inline-flex min-h-11 shrink-0 items-center gap-2 self-start rounded-sm border border-line-strong px-3 font-mono text-[0.75rem] font-medium tracking-[0.08em] text-ink uppercase transition-colors duration-(--dur-fast) hover-fine:border-ink-3 hover-fine:bg-bg-1 active:translate-y-px"
              aria-label={`Play ${film.frame}`}
              data-cursor="media"
              data-cursor-label="PLAY"
            >
              <PixelIcon name="play" size={16} />
              Play
            </button>
          </DialogTrigger>
          <DialogContent
            showClose
            closeLabel="Close lightbox"
            className={cn(
              styles.lightbox,
              'top-1/2 max-h-[90dvh] w-[min(960px,calc(100vw-32px))] -translate-y-1/2 overflow-y-auto md:top-1/2 md:max-h-[90dvh]',
            )}
          >
            <div className="flex flex-col gap-1 p-5 pr-16 md:p-6 md:pr-16">
              <DialogTitle className="label-mono font-mono text-ink">
                {film.frame}
                <span aria-hidden="true"> · </span>
                <span className="sr-only">, </span>
                {location}
                {film.year ? (
                  <span className="text-ink-3">
                    <span aria-hidden="true"> · </span>
                    <span className="sr-only">, </span>
                    {film.year}
                  </span>
                ) : null}
              </DialogTitle>
              <DialogDescription className="font-display text-heading-sm text-ink">{film.title}</DialogDescription>
            </div>

            <div className={styles.lightboxMedia}>{lightboxMedia}</div>

            <div className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between md:p-6">
              {film.note ? (
                <p className="max-w-lead text-body-sm text-ink-3">
                  <Rich text={film.note} />
                </p>
              ) : null}
              {film.placeholder ? (
                <Button href={film.url} disabled variant="ghost" icon="none" className="shrink-0 gap-2">
                  <PixelIcon name="clock" size={20} />
                  Watch the film
                  <span className="label-mono text-ink-3">· {SCENE_COPY.fieldNotes.linkPending}</span>
                </Button>
              ) : (
                <Button href={film.url} external variant="ghost" className="shrink-0">
                  Watch the film
                </Button>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </figcaption>
    </figure>
  );
}
