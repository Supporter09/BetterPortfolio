import type { Metric, ResearchEntry } from '@/content/types';

/**
 * Decorative visual for an evidence tile, derived from the metric's own value string so any
 * research entry gets a matching visual without extra schema. The numbers themselves are always
 * rendered as real text next to the visual; the visual is aria-hidden and never the only source.
 */
export type MetricVisual =
  | { kind: 'rack'; before: number; after: number; kept: number[] }
  | { kind: 'ratio'; from: number; to: number }
  | { kind: 'cells'; total: number; before: number; after: number }
  | { kind: 'band'; lo: number; hi: number; min: number; max: number }
  | { kind: 'none' };

const RACK_MAX = 60;
const CELLS_MAX = 24;

const unit = (n: number) => n >= 0 && n <= 1;
/** Round to 6 decimals before floor/ceil so float noise (0.85 * 20 = 16.999…) does not shift ticks. */
const clean = (n: number) => Number(n.toFixed(6));

/** Evenly spread `after` kept chips across `before` cells (deterministic, SSR-stable). */
function spread(before: number, after: number): number[] {
  return Array.from({ length: after }, (_, k) => Math.min(before - 1, Math.floor(((k + 0.5) * before) / after)));
}

export function metricVisual(metric: Metric, findings?: ResearchEntry['findings']): MetricVisual {
  const value = metric.value.replace(/\s+/g, ' ').trim();
  let m: RegExpMatchArray | null;

  // `38 → 2` that matches the entry's findings → rack focus (many soft chips, few sharp ones).
  if (findings && (m = value.match(/^(\d+) ?→ ?(\d+)$/))) {
    const before = Number(m[1]);
    const after = Number(m[2]);
    if (before === findings.before && after === findings.after && after > 0 && after < before && before <= RACK_MAX) {
      return { kind: 'rack', before, after, kept: spread(before, after) };
    }
  }

  // `0/9 → 9/9` → two rows of cells.
  if ((m = value.match(/^(\d+)\/(\d+) ?→ ?(\d+)\/(\d+)$/))) {
    const total = Number(m[2]);
    if (total === Number(m[4]) && total > 0 && total <= CELLS_MAX) {
      return { kind: 'cells', total, before: Number(m[1]), after: Number(m[3]) };
    }
  }

  // `0.105 → 1.000` (unit interval) → before/after bars.
  if ((m = value.match(/^(\d*\.\d+) ?→ ?(\d*\.\d+)$/))) {
    const from = Number(m[1]);
    const to = Number(m[2]);
    if (unit(from) && unit(to)) return { kind: 'ratio', from, to };
  }

  // `0.900–0.972` (unit interval) → band on a 0.05-stepped axis.
  if ((m = value.match(/^(\d*\.\d+) ?[–-] ?(\d*\.\d+)$/))) {
    const lo = Number(m[1]);
    const hi = Number(m[2]);
    if (unit(lo) && unit(hi) && lo < hi) {
      const min = Math.max(0, Math.floor(clean((lo - 0.05) * 20)) / 20);
      const max = Math.min(1, Math.ceil(clean((hi + 0.01) * 20)) / 20);
      return { kind: 'band', lo, hi, min, max };
    }
  }

  return { kind: 'none' };
}
