import { Button } from '@/components/ui/button';
import { MediaFrame } from '@/components/ui/media-frame';
import { OdometerMetric } from '@/components/ui/odometer-metric';
import { Rich } from '@/components/ui/rich-text';
import { RollingTimecode } from '@/components/ui/rolling-timecode';
import { StatusBadge } from '@/components/ui/status-badge';
import type { Experience } from '@/content/types';
import { formatPeriod } from './layout';

/** Contributions shown in the panel; the case page carries the rest. */
const MAX_CONTRIBUTIONS = 4;

interface DetailPanelProps {
  row: Experience;
}

/**
 * Detail for the selected timeline row (refine contract §3): role/org header (with the live STILL ROLLING
 * timecode for in-production rows — the bar label keeps only the badge), summary, up to four contributions,
 * stack chips, metric, the first contribution's media (dither → real on hover) and the case link.
 * Static markup; the parent toggles `hidden` and animates `[data-panel-inner]`.
 */
export function DetailPanel({ row }: DetailPanelProps) {
  const media = row.contributions.find((c) => c.media)?.media;
  const external = row.href?.startsWith('http') ?? false;
  const aside = media || row.metric;

  return (
    <div data-panel-inner className={aside ? 'grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] md:gap-12' : undefined}>
      <div className="min-w-0">
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
          <h3 className="text-heading-lg text-ink">{row.role}</h3>
          {row.status ? <StatusBadge status={row.status} className="self-center" /> : null}
          {row.status === 'in-production' ? (
            <RollingTimecode since={`${row.start}-01`} className="self-center text-pixel-sm text-ink-3" />
          ) : null}
        </div>
        <p className="label-mono mt-2 text-ink-3">
          {row.org} · {row.location} · {formatPeriod(row)}
        </p>

        <p data-hl-hover className="mt-5 max-w-measure text-body-lg text-ink-2">
          <Rich text={row.summary} />
        </p>

        <ul className="mt-5 max-w-measure space-y-2 text-body text-ink-2">
          {row.contributions.slice(0, MAX_CONTRIBUTIONS).map((c) => (
            <li key={c.text} data-hl-hover className="flex gap-3">
              <span aria-hidden="true" className="mt-[0.7em] size-1.5 shrink-0 bg-ink-3" />
              <span>
                <Rich text={c.text} />
              </span>
            </li>
          ))}
        </ul>

        {row.stack?.length ? (
          <ul aria-label="Stack" className="mt-5 flex flex-wrap gap-1.5">
            {row.stack.map((item) => (
              <li key={item} className="label-pixel inline-flex h-6 items-center border border-line-strong px-2 text-ink-2">
                {item}
              </li>
            ))}
          </ul>
        ) : null}

        {row.href ? (
          <Button variant="link" href={row.href} external={external} className="mt-6">
            {external ? 'Open project' : 'Open case'}
          </Button>
        ) : null}
      </div>

      {aside ? (
        <div className="flex min-w-0 flex-col gap-6">
          {row.metric ? <OdometerMetric metric={row.metric} /> : null}
          {media ? <MediaFrame media={media} dither="hover" sizes="(min-width: 768px) 22rem, 100vw" /> : null}
        </div>
      ) : null}
    </div>
  );
}
