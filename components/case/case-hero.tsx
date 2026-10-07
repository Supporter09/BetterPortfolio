import { Slate } from '@/components/scene/slate';
import { Button } from '@/components/ui/button';
import { MediaFrame } from '@/components/ui/media-frame';
import { PerforationFrame } from '@/components/ui/perforation-frame';
import { PixelIcon } from '@/components/ui/pixel-icon';
import { Rich } from '@/components/ui/rich-text';
import { RollingTimecode } from '@/components/ui/rolling-timecode';
import { StatusBadge } from '@/components/ui/status-badge';
import { getScene } from '@/content/scenes';
import { cn } from '@/lib/utils';
import type { CaseRecord } from './cases';
import styles from './case.module.css';

const SINCE = new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' });

/** Id of the page <h1>; the article points `aria-labelledby` at it. */
export const CASE_TITLE_ID = 'case-title';

/**
 * Case hero: slate `SCENE 04 · TAKE 03 · CASE FILE · PYVULDS`, back link, title, kicker, status,
 * and the hero media (`data-flip-id="case-hero-<slug>"`, the Flip target of the reel card, 02a §6).
 * `in-production` entries get the STILL ROLLING treatment: perforation frame around the media with a
 * camera-report strip (TAKE, rolling since, live 24fps timecode). Everything is static in Tier C.
 */
export function CaseHero({ record }: { record: CaseRecord }) {
  const scene = getScene(record.kind === 'research' ? 'pyvulds' : 'reel');
  const rolling = record.status === 'in-production' && record.startedAt !== undefined;
  const started = record.startedAt ? Date.parse(record.startedAt) : Number.NaN;
  const chips = record.research?.areas ?? record.work?.stack ?? [];
  const chipsLabel = record.research ? 'Research areas' : 'Stack';
  const chipsId = `${record.slug}-chips`;

  return (
    <header className={styles.hero}>
      <div className="frame">
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
          <div data-slate>
            <Slate number={scene.number} take={record.takes} label={`CASE FILE · ${record.slug.toUpperCase()}`} />
          </div>
          <div data-back>
            <Button href={record.backHref} variant="link" icon="none" className="text-ink-2 hover-fine:text-ink">
              <PixelIcon name="arrow-left" size={20} />
              {record.backLabel}
            </Button>
          </div>
        </div>

        <div className={cn('mt-10 md:mt-14', styles.heroGrid)}>
          <div className="min-w-0">
            <p className="label-mono text-grade-teal" data-intro>
              {record.kicker}
            </p>
            <h1 id={CASE_TITLE_ID} className={cn('split-safe font-display mt-4', styles.title)} data-split>
              {record.title}
            </h1>
            {record.subtitle ? (
              <p className="mt-3 text-heading-md italic text-ink-2" data-intro data-hl-hover>
                <Rich text={record.subtitle} />
              </p>
            ) : null}
            <p className="mt-6 max-w-measure text-body-lg text-ink-2" data-intro>
              <Rich text={record.summary} />
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4" data-intro>
              {record.status ? <StatusBadge status={record.status} /> : null}
              {chips.length ? (
                <div>
                  <span id={chipsId} className="sr-only">
                    {chipsLabel}
                  </span>
                  <ul aria-labelledby={chipsId} className="flex flex-wrap gap-2">
                    {chips.map((chip) => (
                      <li key={chip} className={styles.chip}>
                        {chip}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          </div>

          <div className={styles.media} data-media data-flip-id={`case-hero-${record.slug}`}>
            {rolling ? (
              <PerforationFrame active className={styles.perf}>
                <div className={styles.report} data-rolling>
                  <div className="flex flex-wrap items-center gap-3">
                    {record.takes !== undefined ? (
                      <span className={styles.takeBox}>Take {String(record.takes).padStart(2, '0')}</span>
                    ) : null}
                    {Number.isNaN(started) ? null : (
                      <span className="label-mono text-ink-3" aria-hidden="true">
                        Rolling since {SINCE.format(started)}
                      </span>
                    )}
                  </div>
                  <span className="inline-flex items-baseline gap-2">
                    <span className="label-mono text-ink-3" aria-hidden="true">
                      TC
                    </span>
                    <RollingTimecode since={record.startedAt ?? ''} className={styles.timecode} />
                  </span>
                </div>
                <div className="overflow-hidden" data-media-plate>
                  <MediaFrame media={record.media} priority dither="hover" sizes="(min-width: 1024px) 40vw, 100vw" />
                </div>
              </PerforationFrame>
            ) : (
              <div data-media-plate>
                <MediaFrame media={record.media} priority viewfinder dither="hover" sizes="(min-width: 1024px) 40vw, 100vw" />
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
