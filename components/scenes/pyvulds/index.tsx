import { SceneShell, sceneTitleId } from '@/components/scene/scene-shell';
import { Button } from '@/components/ui/button';
import { PerforationFrame } from '@/components/ui/perforation-frame';
import { PixelIcon } from '@/components/ui/pixel-icon';
import { Rich } from '@/components/ui/rich-text';
import { RollingTimecode } from '@/components/ui/rolling-timecode';
import { StatusBadge } from '@/components/ui/status-badge';
import { FEATURED_RESEARCH, RESEARCH } from '@/content/research';
import { SCENE_COPY } from '@/content/scenes';
import { SITE } from '@/content/site';
import { cn } from '@/lib/utils';
import { Evidence } from './evidence';
import { Pipeline } from './pipeline';
import { PyvuldsStage } from './pyvulds-stage';
import { ResearchIndex } from './research-index';
import styles from './pyvulds.module.css';

const SINCE = new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' });
const pad = (n: number) => String(n).padStart(2, '0');

/**
 * Scene 04 — Feature presentation (02b Scene 04, master §11.2–§11.3, round 2 §4). Anchor id stays `pyvulds`.
 * The title area is a pin-free typing beat: the h2 "Research" and the quote render complete in the DOM
 * (Tier C / no-JS = static final state); Tier A/B hide the chars and type them with a pixel caret, then
 * delete the title and type the quote as the visitor scrolls (see PyvuldsStage). Screen readers always get
 * the static sr-only strings. The featured entry of the research collection then gets the full presentation
 * (kicker, title, highlighted summary, areas, STILL ROLLING strip, pipeline, four scoped metrics, Limitations,
 * CTA) inside Pin #1; every entry is listed in the index below.
 */
export function PyvuldsScene() {
  const entry = FEATURED_RESEARCH;
  const rolling = entry.status === 'in-production';
  const started = Date.parse(entry.startedAt);
  const featureTitleId = `${entry.slug}-feature-title`;

  return (
    <SceneShell id="pyvulds" take={entry.takes}>
      <PyvuldsStage>
        <div className="frame">
          <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-4" data-heading>
            {/* Plain template strings: twMerge treats `text-display-*`/`text-heading-*` as colors and would drop them next to `text-ink*`. */}
            <div className={styles.beat} data-beat>
              <h2 id={sceneTitleId('pyvulds')} className={`${styles.beatLine} text-display-xl text-ink`}>
                <span className="sr-only">{SCENE_COPY.pyvulds.heading}</span>
                <span className="split-safe" aria-hidden="true" data-type="title">
                  {SCENE_COPY.pyvulds.heading}
                </span>
              </h2>
              <p className={`${styles.beatLine} text-display-md text-ink`}>
                <span className="sr-only">
                  {SCENE_COPY.pyvulds.quote} {SCENE_COPY.pyvulds.quoteTail}
                </span>
                <span className="split-safe" aria-hidden="true" data-type="quote">
                  {SCENE_COPY.pyvulds.quote}
                </span>
              </p>
              <p className={`${styles.beatTail} text-heading-md text-ink-2`} aria-hidden="true">
                <span className="split-safe" data-type="tail">
                  {SCENE_COPY.pyvulds.quoteTail}
                </span>
                <span className={styles.caret} data-caret />
              </p>
            </div>
            <p className="label-mono text-ink-3">
              Collection · <span className="font-pixel text-pixel-sm text-ink-2">{pad(RESEARCH.length)}</span>{' '}
              {RESEARCH.length === 1 ? 'project' : 'projects'}
            </p>
          </div>
        </div>

        <article aria-labelledby={featureTitleId} className="mt-14 md:mt-20">
          {/* Title card (not pinned) */}
          <div className="frame pb-10 md:pb-14">
            <div className="grid-frame items-end gap-y-8">
              <div className="col-span-4 md:col-span-8 lg:col-span-8">
                <p className="label-mono text-grade-teal" data-intro>
                  {entry.kicker}
                </p>
                <div className="mt-4">
                  <h3
                    id={featureTitleId}
                    className="split-safe font-display text-display-xl leading-[1.05] text-ink"
                    data-split
                  >
                    {entry.title}
                  </h3>
                </div>
                <p className="mt-3 text-heading-md italic text-ink-2" data-intro>
                  {entry.subtitle}
                </p>
                <p className="mt-6 max-w-measure text-body-lg text-ink-2" data-intro>
                  <Rich text={entry.summary} />
                </p>
              </div>
              <div className="col-span-4 md:col-span-8 lg:col-span-4" data-intro>
                <p className="label-mono text-ink-3" id={`${entry.slug}-areas`}>
                  Research areas
                </p>
                <ul aria-labelledby={`${entry.slug}-areas`} className="mt-3 flex flex-wrap gap-2">
                  {entry.areas.map((area) => (
                    <li key={area} className={styles.areaChip}>
                      {area}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Pin #1 frame */}
          <div className={styles.pinFrame} data-pin-frame>
            <span className={styles.letterbox} data-lb="top" aria-hidden="true" />
            <div className={cn('frame', styles.pinInner)} data-pin-inner>
              <PerforationFrame active={rolling} className={styles.panel}>
                <div className={styles.panelBody}>
                  {/* STILL ROLLING camera report */}
                  <div className={styles.strip} data-rolling={rolling || undefined} data-reveal>
                    <div className="flex flex-wrap items-center gap-3">
                      <StatusBadge status={entry.status} />
                      <span className={styles.takeBox}>Take {pad(entry.takes)}</span>
                      <span className="label-mono text-ink-3" aria-hidden="true">
                        {entry.title}
                      </span>
                    </div>
                    {rolling ? (
                      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                        {Number.isNaN(started) ? null : (
                          <span className="label-mono inline-flex items-center gap-1.5 text-ink-3" aria-hidden="true">
                            <PixelIcon name="rec" size={16} className="text-rec" />
                            Since {SINCE.format(started)}
                          </span>
                        )}
                        <span className="inline-flex items-baseline gap-2">
                          <span className="label-mono text-ink-3" aria-hidden="true">
                            TC
                          </span>
                          <RollingTimecode since={entry.startedAt} className={styles.timecode} />
                        </span>
                      </div>
                    ) : null}
                  </div>

                  <div data-reveal>
                    <h4 className="mb-4 label-mono text-ink-3 lg:mb-3">
                      Pipeline · <span className="font-pixel text-pixel-sm text-ink-2">{pad(entry.pipeline.length)}</span>{' '}
                      stages
                    </h4>
                    <Pipeline title={entry.title} stages={entry.pipeline} />
                  </div>

                  <div data-reveal>
                    <h4 className="mb-4 label-mono text-ink-3 lg:mb-3">
                      Results · <span className="font-pixel text-pixel-sm text-ink-2">{pad(entry.metrics.length)}</span>{' '}
                      scoped
                    </h4>
                    <Evidence entry={entry} />
                  </div>

                  <div className="grid gap-5 lg:grid-cols-12 lg:items-end">
                    <div className={cn(styles.limits, 'lg:col-span-9')}>
                      <span className={styles.limitsAccent} aria-hidden="true" data-limits-accent />
                      <h4 className="flex items-center gap-2 label-mono text-grade-amber">
                        <PixelIcon name="flag" size={16} />
                        {SCENE_COPY.pyvulds.limitationsHeading}
                      </h4>
                      <ul className="mt-3 grid gap-x-8 gap-y-1.5 text-body-sm text-ink-2 md:grid-cols-2">
                        {entry.limitations.map((item) => (
                          <li key={item} className={styles.limitItem}>
                            <Rich text={item} />
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="lg:col-span-3 lg:justify-self-end" data-cta data-reveal>
                      <Button
                        href={`/work/${entry.slug}`}
                        size="lg"
                        className="w-full lg:w-auto"
                        aria-label={`${SITE.ctas.pyvulds.label}: ${entry.title}`}
                      >
                        {SITE.ctas.pyvulds.label}
                      </Button>
                    </div>
                  </div>
                </div>
              </PerforationFrame>
            </div>
            <span className={styles.letterbox} data-lb="bottom" aria-hidden="true" />
          </div>
        </article>

        <div className="frame">
          <ResearchIndex entries={RESEARCH} featuredSlug={entry.slug} />
        </div>
      </PyvuldsStage>
    </SceneShell>
  );
}
