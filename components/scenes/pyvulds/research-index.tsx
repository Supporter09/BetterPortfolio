import Link from 'next/link';
import type { ResearchEntry } from '@/content/types';
import { PerforationFrame } from '@/components/ui/perforation-frame';
import { PixelIcon } from '@/components/ui/pixel-icon';
import { RollingTimecode } from '@/components/ui/rolling-timecode';
import { StatusBadge } from '@/components/ui/status-badge';
import { cn } from '@/lib/utils';

interface ResearchIndexProps {
  entries: ResearchEntry[];
  featuredSlug: string;
}

const pad = (n: number) => String(n).padStart(2, '0');

/**
 * Research index (master §11.2): every entry of the collection as a compact row linking to
 * `/work/<slug>`. The featured entry is flagged "Now showing" (its STILL ROLLING showcase is above);
 * any other `in-production` entry gets the full STILL ROLLING treatment in its own row.
 */
export function ResearchIndex({ entries, featuredSlug }: ResearchIndexProps) {
  return (
    <section aria-labelledby="research-index-title" className="mt-16 md:mt-24" data-reveal>
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-b border-line pb-3">
        <h3 id="research-index-title" className="label-mono text-ink">
          Research index
        </h3>
        <p className="label-mono text-ink-3">
          <span className="font-pixel text-pixel-sm text-ink-2">{pad(entries.length)}</span>{' '}
          {entries.length === 1 ? 'entry' : 'entries'}
        </p>
      </div>
      <ol className="divide-y divide-line">
        {entries.map((entry, i) => {
          const featured = entry.slug === featuredSlug;
          const rolling = entry.status === 'in-production' && !featured;
          const row = (
            <div className="relative grid grid-cols-[3rem_1fr] items-start gap-x-4 gap-y-3 py-5 transition-colors duration-(--dur-fast) hover-fine:bg-bg-1/60 md:grid-cols-[4rem_minmax(0,1fr)_auto] md:items-center md:gap-x-6">
              <span className="pt-1 font-pixel text-pixel-sm text-ink-3 md:pt-0" aria-hidden="true">
                R{pad(i + 1)}
              </span>
              <div className="min-w-0">
                <h4 className="font-display text-heading-sm text-ink">
                  <Link
                    href={`/work/${entry.slug}`}
                    className="decoration-1 underline-offset-[0.2em] after:absolute after:inset-0 hover-fine:underline"
                  >
                    {entry.title}
                  </Link>
                </h4>
                <p className="mt-1 text-body-sm text-ink-2">{entry.subtitle}</p>
                <p className="mt-2 label-mono text-ink-3">{entry.kicker}</p>
              </div>
              <div className="col-start-2 flex flex-wrap items-center gap-x-3 gap-y-2 md:col-start-auto md:justify-end">
                {featured ? (
                  <span className="inline-flex h-6 items-center rounded-full border border-grade-teal/50 px-2.5 font-pixel text-pixel-sm text-grade-teal uppercase">
                    Now showing
                  </span>
                ) : null}
                <StatusBadge status={entry.status} />
                {entry.status === 'in-production' ? (
                  <span className="label-mono text-ink-3" aria-hidden="true">
                    Take <span className="font-pixel text-pixel-sm">{pad(entry.takes)}</span>
                  </span>
                ) : null}
                {rolling ? <RollingTimecode since={entry.startedAt} className="text-label text-ink-2" /> : null}
                <PixelIcon name="arrow-right" size={20} className="hidden text-ink-3 md:block" />
              </div>
            </div>
          );
          return (
            <li key={entry.slug} className={cn(rolling && 'py-3')}>
              {rolling ? (
                <PerforationFrame active className="px-4">
                  {row}
                </PerforationFrame>
              ) : (
                row
              )}
            </li>
          );
        })}
      </ol>
    </section>
  );
}
