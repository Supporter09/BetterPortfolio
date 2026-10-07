import Link from 'next/link';
import type { Metric, WorkEntry } from '@/content/types';
import { MediaFrame } from '@/components/ui/media-frame';
import { PixelIcon } from '@/components/ui/pixel-icon';
import { Rich } from '@/components/ui/rich-text';
import { StatusBadge } from '@/components/ui/status-badge';
import { cn } from '@/lib/utils';
import styles from './reel.module.css';

/** Static metric (no odometer in Act II, 02b rule 5), pixel-font value; `reported` claims carry a visible tag. */
function CardMetric({ metric }: { metric: Metric }) {
  return (
    <div className="border-t border-line pt-3">
      <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <data value={metric.numeric ?? metric.value} className="font-pixel text-pixel-xl text-grade-teal tabular-nums slashed-zero">
          {metric.value}
        </data>
        <span className="text-body-sm text-ink-2">{metric.label}</span>
        {metric.claim === 'reported' ? (
          <span className="inline-flex h-6 items-center rounded-full border border-line-strong px-2.5 font-pixel text-pixel-xs text-ink-2 uppercase">
            Reported
          </span>
        ) : null}
      </p>
      <p className="mt-1.5 text-caption text-ink-3">{metric.scope}</p>
    </div>
  );
}

/** Typographic award plate fallback: used for award-only entries with placeholder media. */
function AwardPlate({ entry }: { entry: WorkEntry }) {
  const [prize, event] = (entry.award ?? '').split(' — ');
  return (
    <div className={cn(styles.plate, styles.plateAmber)} role="img" aria-label={entry.media.alt}>
      <PixelIcon name="trophy" size={24} className="text-grade-amber" />
      <p className="font-display text-heading-lg italic text-ink" aria-hidden="true">
        {prize}
      </p>
      {event ? (
        <p className="label-mono text-ink-2" aria-hidden="true">
          {event}
        </p>
      ) : null}
    </div>
  );
}

interface WorkCardProps {
  entry: WorkEntry;
  index: number;
}

/**
 * Case card (01 §5.9): title, award line, highlighted one-line summary, metric, stack chips, "Open case".
 * One link per card: the title, stretched over the whole card. Cards with a case study → `/work/<slug>`
 * (cursor label VIEW, media dithered until hover/focus/tap); award-only entries with media render
 * `MediaFrame` with dither and link to `/archive`; placeholder award-only entries fall back to `AwardPlate`.
 */
export function WorkCard({ entry, index }: WorkCardProps) {
  const titleId = `reel-${entry.slug}-title`;
  const hasCase = Boolean(entry.caseStudy);
  const showMedia = hasCase || entry.media.kind !== 'placeholder';
  const href = hasCase ? `/work/${entry.slug}` : '/archive';
  const action = hasCase ? 'Open case' : 'In the archive';

  return (
    <li className={styles.card} data-reel-card>
      <article
        aria-labelledby={titleId}
        className={cn('viewfinder', styles.article)}
        data-tone={hasCase ? 'teal' : 'amber'}
        data-cursor={showMedia ? 'media' : undefined}
        data-cursor-label={showMedia ? 'VIEW' : undefined}
      >
        <div className={styles.mediaMask} data-reel-media data-flip-id={hasCase ? `case-hero-${entry.slug}` : undefined}>
          {showMedia ? (
            <MediaFrame
              media={entry.media}
              className={styles.mediaBox}
              cursorLabel="VIEW"
              sizes="(min-width: 1024px) 40vw, 90vw"
              dither="hover"
            />
          ) : (
            <AwardPlate entry={entry} />
          )}
        </div>

        <div className={styles.body} data-reel-body>
          <div className="flex min-h-6 flex-wrap items-center justify-between gap-2">
            <span className="label-pixel text-ink-3">Reel {String(index + 1).padStart(2, '0')}</span>
            {entry.status ? <StatusBadge status={entry.status} /> : null}
          </div>

          <h3 id={titleId} className="font-display text-heading-md text-ink">
            <Link href={href} className={styles.titleLink}>
              {entry.title}
              {hasCase ? null : <span className="sr-only">, in the archive</span>}
            </Link>
          </h3>

          {entry.award ? (
            <p className="flex items-start gap-2 text-body-sm text-ink">
              <PixelIcon name="trophy" size={16} className="mt-[0.15em] text-grade-amber" />
              {entry.award}
            </p>
          ) : (
            <p className="label-mono text-ink-3">{[entry.org, entry.period].filter(Boolean).join(' · ')}</p>
          )}

          {hasCase ? (
            <p className={cn('text-body-sm text-ink-2', styles.summary)} data-hl-hover>
              <Rich text={entry.summary} />
            </p>
          ) : null}
          {hasCase && entry.metric ? <CardMetric metric={entry.metric} /> : null}

          <div className="mt-auto flex flex-wrap items-end justify-between gap-3 pt-2">
            {hasCase ? (
              <ul className="flex flex-wrap gap-1.5" aria-label="Stack">
                {entry.stack.slice(0, 4).map((tech) => (
                  <li key={tech} className={styles.techChip}>
                    {tech}
                  </li>
                ))}
              </ul>
            ) : null}
            <span className={cn(styles.action, 'ml-auto')} aria-hidden="true">
              {action}
              <PixelIcon name="arrow-right" size={16} />
            </span>
          </div>
        </div>
      </article>
    </li>
  );
}
