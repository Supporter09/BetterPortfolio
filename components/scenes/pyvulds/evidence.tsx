import type { Metric, ResearchEntry } from '@/content/types';
import { SCENE_COPY } from '@/content/scenes';
import { cn } from '@/lib/utils';
import { metricVisual, type MetricVisual } from './metric-visual';
import styles from './pyvulds.module.css';

/** `38 → 2` with the arrow dimmed; still one plain text run for copy/paste and screen readers. */
function MetricValue({ metric }: { metric: Metric }) {
  return (
    <data value={metric.numeric ?? metric.value} className="whitespace-nowrap">
      {metric.prefix ? <span className="text-[0.6em] text-ink-2">{metric.prefix}</span> : null}
      {metric.value.split(/(→)/).map((part, i) =>
        part === '→' ? (
          <span key={i} className="text-ink-3">
            →
          </span>
        ) : (
          part
        ),
      )}
    </data>
  );
}

function Visual({ visual }: { visual: MetricVisual }) {
  switch (visual.kind) {
    case 'rack': {
      const cells = Array.from({ length: visual.before }, (_, i) => i);
      const kept = new Set(visual.kept);
      // Three identical grids stacked: everything sharp → (soft, baked blur) + (kept, sharp).
      return (
        <div className={styles.rack} style={{ ['--cols' as string]: Math.ceil(visual.before / 3) }} aria-hidden="true">
          <div className={cn(styles.rackLayer, styles.rackSoft)} data-rack-soft>
            {cells.map((i) => (
              <span key={i} className={styles.chip} data-empty={kept.has(i) || undefined} />
            ))}
          </div>
          <div className={cn(styles.rackLayer, styles.rackSharp)} data-rack-sharp>
            {cells.map((i) => (
              <span key={i} className={styles.chip} />
            ))}
          </div>
          <div className={styles.rackLayer} data-rack-kept>
            {cells.map((i) => (
              <span key={i} className={styles.chip} data-empty={!kept.has(i) || undefined}>
                {kept.has(i) ? <i className={styles.chipFocus} data-rack-focus /> : null}
              </span>
            ))}
          </div>
        </div>
      );
    }
    case 'ratio':
      return (
        <div className="grid gap-2" aria-hidden="true">
          <div className={styles.barRow}>
            <span className={styles.vizLabel}>Before</span>
            <span className={styles.barTrack}>
              <span className={cn(styles.barFill, styles.barFillMuted)} style={{ transform: `scaleX(${visual.from})` }} />
            </span>
          </div>
          <div className={styles.barRow}>
            <span className={styles.vizLabel}>After</span>
            <span className={styles.barTrack}>
              <span
                className={styles.barFill}
                style={{ transform: `scaleX(${visual.to})` }}
                data-bar-fill
                data-from={visual.from}
                data-to={visual.to}
              />
            </span>
          </div>
        </div>
      );
    case 'cells':
      return (
        <div className="grid gap-2" aria-hidden="true">
          {(['before', 'after'] as const).map((row) => (
            <div key={row} className={styles.barRow}>
              <span className={styles.vizLabel}>{row === 'before' ? 'Before' : 'After'}</span>
              <span className={styles.cells} style={{ ['--cells' as string]: visual.total }}>
                {Array.from({ length: visual.total }, (_, i) => (
                  <span
                    key={i}
                    className={styles.cell}
                    data-on={i < visual[row] || undefined}
                    data-cell={row === 'after' && i < visual.after ? '' : undefined}
                  />
                ))}
              </span>
            </div>
          ))}
        </div>
      );
    case 'band': {
      const span = visual.max - visual.min;
      const left = ((visual.lo - visual.min) / span) * 100;
      const width = ((visual.hi - visual.lo) / span) * 100;
      return (
        <div aria-hidden="true">
          <div className={styles.axis}>
            <span className={styles.band} style={{ left: `${left}%`, width: `${width}%` }} data-band />
          </div>
          <div className="mt-1.5 flex justify-between font-mono text-[0.6875rem] text-ink-3 tabular-nums">
            <span>{visual.min.toFixed(2)}</span>
            <span>{visual.max.toFixed(2)}</span>
          </div>
        </div>
      );
    }
    default:
      return null;
  }
}

/**
 * Scoped results. Tier A/B (and no-JS): tiles with a decorative visual each; Tier C: a real
 * `<table>`. Both are server-rendered; CSS keeps exactly one in the accessibility tree (02b §7).
 * Every value is static text rendered together with its scope sentence (no odometer).
 */
export function Evidence({ entry }: { entry: ResearchEntry }) {
  return (
    <>
      <ul className={styles.tiles} data-evidence>
        {entry.metrics.map((metric, i) => {
          const visual = metricVisual(metric, entry.findings);
          return (
            <li key={metric.label} className={styles.tile} data-tile={i} data-visual={visual.kind}>
              <figure className="flex h-full flex-col gap-3" data-tile-body>
                <p className="flex items-center justify-between gap-3 label-mono text-ink-3">
                  <span className="font-pixel text-pixel-sm">
                    E{i + 1}
                    <span className="sr-only">:</span>
                  </span>
                  {metric.claim === 'reported' ? (
                    <span className="rounded-full border border-line-strong px-2 font-pixel text-pixel-xs text-ink-2 uppercase">
                      Reported
                    </span>
                  ) : null}
                </p>
                <p className="font-pixel text-[clamp(1.5rem,0.9rem+1.1vw,2.25rem)] leading-none tracking-[0.02em] text-grade-teal tabular-nums slashed-zero">
                  <MetricValue metric={metric} />
                </p>
                <p className="text-body-sm text-ink-2">{metric.label}</p>
                <div className="mt-auto pt-1">
                  <Visual visual={visual} />
                </div>
                <figcaption className="text-caption text-ink-3">{metric.scope}</figcaption>
              </figure>
            </li>
          );
        })}
      </ul>

      <div className="hidden overflow-x-auto tier-c:block">
        <table className="w-full min-w-[36rem] border-collapse text-left text-body-sm">
          <caption className="mb-3 text-left label-mono text-ink-3">{SCENE_COPY.pyvulds.resultsCaption}</caption>
          <thead>
            <tr className="border-b border-line-strong label-mono text-ink-3">
              <th scope="col" className="py-2 pr-4 font-medium">
                Result
              </th>
              <th scope="col" className="py-2 pr-4 font-medium">
                Value
              </th>
              <th scope="col" className="py-2 font-medium">
                Scope
              </th>
            </tr>
          </thead>
          <tbody>
            {entry.metrics.map((metric) => (
              <tr key={metric.label} className="border-b border-line align-top">
                <th scope="row" className="py-3 pr-4 font-normal text-ink">
                  {metric.label}
                  {metric.claim === 'reported' ? <span className="ml-2 label-mono text-ink-2">(Reported)</span> : null}
                </th>
                <td className="py-3 pr-4 font-pixel text-pixel-md text-grade-teal tabular-nums">
                  <MetricValue metric={metric} />
                </td>
                <td className="py-3 text-ink-2">{metric.scope}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
