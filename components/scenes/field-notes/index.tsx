import { SceneShell, sceneTitleId } from '@/components/scene/scene-shell';
import { Button } from '@/components/ui/button';
import { MediaFrame } from '@/components/ui/media-frame';
import { Rich } from '@/components/ui/rich-text';
import { FILMS, KAIST_BEAT, KAIST_FRAME_IDS } from '@/content/films';
import { SCENE_COPY } from '@/content/scenes';
import { SITE } from '@/content/site';
import type { FilmEntry } from '@/content/types';
import { cn } from '@/lib/utils';
import { FieldNotesStage } from './field-notes-stage';
import { FilmFrame, filmLocation } from './film-frame';
import { FilmStrip } from './film-strip';
import styles from './field-notes.module.css';

const STRIP_SIZES = '(min-width: 1440px) 480px, (min-width: 768px) 30vw, 50vw';
const LIGHTBOX_SIZES = '(min-width: 1024px) 960px, 100vw';

function Frames({ films }: { films: FilmEntry[] }) {
  return films.map((film) => (
    <li key={film.id} className={styles.item} data-strip-item>
      <FilmFrame
        film={film}
        media={<MediaFrame media={film.media} sizes={STRIP_SIZES} dither="always" />}
        lightboxMedia={<MediaFrame media={film.media} sizes={LIGHTBOX_SIZES} />}
      />
    </li>
  ));
}

/**
 * Scene 07 — Behind the lens (02b Scene 06; round 2 order). Two film strips: the field notes (every
 * non-KAIST frame) and the KAIST SoC Global Preview Week 2026 beat (Daejeon → Seoul → Hanoi) that looks back
 * to the research scenes. Each frame ships dithered (`dither="always"`); Develop reveals the footage,
 * Play opens the lightbox. CTA → /films.
 */
export function FieldNotesScene() {
  const kaist = FILMS.filter((film) => KAIST_FRAME_IDS.includes(film.id));
  const notes = FILMS.filter((film) => !KAIST_FRAME_IDS.includes(film.id));
  const copy = SCENE_COPY.fieldNotes;
  const cta = SITE.ctas.fieldNotes;

  return (
    <SceneShell id="field-notes" className={cn(styles.root, 'overflow-clip')}>
      <FieldNotesStage>
        <div className={cn('light-leak tier-c:hidden', styles.leak)} data-leak aria-hidden="true" />

        <div className="frame relative" data-fn-head>
          <h2 id={sceneTitleId('field-notes')} className="text-display-lg leading-[1.2] text-ink" data-split>
            {copy.heading}
          </h2>
          <p className="mt-3 max-w-lead text-body-lg text-ink-2" data-hl-hover>
            <Rich text={copy.subLabel} />
          </p>
          <p className="label-mono mt-3 text-ink-3 lg:hidden" aria-hidden="true">
            {copy.touchHint}
          </p>
        </div>

        <FilmStrip
          id="field-notes-strip"
          label={`Field notes, ${notes.length} frames`}
          codes={notes.map((film) => film.frame)}
          className="relative mt-10 md:mt-14"
        >
          <Frames films={notes} />
        </FilmStrip>

        <section aria-labelledby="field-notes-kaist" className="relative mt-16 md:mt-24">
          <FilmStrip
            id="field-notes-kaist-strip"
            label={`KAIST Global Preview Week 2026, ${kaist.length} frames`}
            codes={kaist.map((film) => film.frame)}
            heading={
              <h3 id="field-notes-kaist" className="label-mono flex flex-wrap items-center gap-x-3 text-ink">
                <span className="rec-dot bg-grade-amber" aria-hidden="true" />
                {KAIST_BEAT.label}
              </h3>
            }
          >
            <Frames films={kaist} />
          </FilmStrip>

          <div className="frame mt-8 grid gap-x-(--spacing-gutter) gap-y-6 lg:grid-cols-12">
            <div className="flex flex-col gap-4 lg:col-span-7 lg:col-start-6" data-kaist-copy>
              <p className="max-w-measure text-body-lg text-ink" data-hl-hover>
                <Rich text={KAIST_BEAT.caption} />
              </p>
              <p className="max-w-measure font-display text-heading-md italic text-grade-amber" data-hl-hover>
                <Rich text={KAIST_BEAT.bridge} />
              </p>
            </div>
          </div>
        </section>

        <div className="frame relative mt-14 md:mt-20" data-fn-cta>
          <Button href={cta.href} size="lg">
            {cta.label}
          </Button>
        </div>
      </FieldNotesStage>
    </SceneShell>
  );
}
