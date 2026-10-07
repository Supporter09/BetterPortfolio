import type { Metadata } from 'next';
import { PageStage } from '@/components/case/page-stage';
import { SubPageHeader } from '@/components/case/sub-page';
import { Button } from '@/components/ui/button';
import { MediaFrame } from '@/components/ui/media-frame';
import { Rich, stripRich } from '@/components/ui/rich-text';
import { FILMS } from '@/content/films';
import { SCENE_COPY, getScene } from '@/content/scenes';
import { SITE } from '@/content/site';
import styles from '@/components/case/sub-page.module.css';

const LEDE = 'Every frame from the field notes — [[city]], [[year]]. Hover to develop. *Film links coming soon.*';

export const metadata: Metadata = {
  title: `Films · ${SITE.name}`,
  description: stripRich(LEDE),
};

/** `/films` — every frame from Scene 06 as a dithered contact-sheet grid (hover/toggle reveals); placeholder footage until A2/A3 land. */
export default function FilmsPage() {
  const fieldNotes = getScene('field-notes');
  return (
    <main id="main" tabIndex={-1} className="outline-none">
      <PageStage>
        <div className={styles.page} data-grade="amber">
          <SubPageHeader
            number={fieldNotes.number}
            label={`${fieldNotes.slate} · ALL FILMS`}
            titleId="films-title"
            title="Films"
            lede={LEDE}
            back={{ href: '/#field-notes', label: 'Back to the field notes' }}
          />

          <section aria-labelledby="films-grid-title" className={styles.section}>
            <div className="frame">
              <h2 id="films-grid-title" className="label-mono mb-6 text-ink-3">
                Contact sheet · <span className="font-pixel text-pixel-sm text-ink-2">{String(FILMS.length).padStart(2, '0')}</span>{' '}
                frames
              </h2>
              <ul className={styles.filmGrid}>
                {FILMS.map((film) => {
                  const titleId = `film-${film.id}-title`;
                  const where = film.country ? `${film.city}, ${film.country}` : film.city;
                  return (
                    <li key={film.id} data-reveal>
                      <article aria-labelledby={titleId} className={styles.filmCard}>
                        <MediaFrame
                          media={film.media}
                          viewfinder
                          dither="hover"
                          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                        />
                        <div className={styles.filmMeta}>
                          <p className="label-mono text-ink-3">
                            <span className="font-pixel text-pixel-sm text-ink-2">{film.frame}</span> · {where}
                          </p>
                          <p className="font-pixel text-pixel-sm text-ink-3">{film.year}</p>
                        </div>
                        <h3 id={titleId} className="font-display text-heading-sm text-ink">
                          {film.title}
                        </h3>
                        {film.note ? (
                          <p className="text-caption text-ink-3">
                            <Rich text={film.note} />
                          </p>
                        ) : null}
                        <div className="mt-1">
                          {film.placeholder ? (
                            <Button
                              href={film.url}
                              variant="ghost"
                              size="sm"
                              disabled
                              aria-label={`${film.title} — ${SCENE_COPY.fieldNotes.linkPending}`}
                            >
                              {SCENE_COPY.fieldNotes.linkPending}
                            </Button>
                          ) : (
                            <Button href={film.url} variant="ghost" size="sm" external>
                              Watch the film
                            </Button>
                          )}
                        </div>
                      </article>
                    </li>
                  );
                })}
              </ul>
            </div>
          </section>
        </div>
      </PageStage>
    </main>
  );
}
