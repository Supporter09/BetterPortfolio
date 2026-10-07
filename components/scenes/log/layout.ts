import { TIMELINE_RANGE } from '@/content/experience';
import type { Experience } from '@/content/types';

/** The 'now' marker (REC) — open-ended rows run up to here. */
export const NOW = '2026-10';

/** Lane order on the desktop ruler; awards are pins, not lanes. */
export const LANE_KINDS = ['education', 'work', 'research', 'field'] as const;
export type LaneKind = (typeof LANE_KINDS)[number];

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const SPAN = TIMELINE_RANGE.end - TIMELINE_RANGE.start;

interface YearMonth {
  year: number;
  /** 1–12; undefined for year-only dates (awards). */
  month?: number;
}

export function parseYM(value: string): YearMonth {
  const [y, m] = value.split('-');
  const year = Number(y);
  const month = m === undefined ? undefined : Number(m);
  return month === undefined || Number.isNaN(month) ? { year } : { year, month };
}

/**
 * Ruler position in [0,1]: 0 = Jan of the first year, 1 = Jan of the year after the last.
 * `edge: 'end'` reads the value as the end of that month (or of that year when month-less).
 */
export function toFrac(value: string, edge: 'start' | 'end' = 'start'): number {
  const { year, month } = parseYM(value);
  const months = month === undefined ? (edge === 'end' ? 12 : 0) : edge === 'end' ? month : month - 1;
  return Math.min(1, Math.max(0, (year + months / 12 - TIMELINE_RANGE.start) / SPAN));
}

export const NOW_FRAC = toFrac(NOW);

/** Year ticks for the ruler: `{ year, x }` from the first year to the last (inclusive, 0 → 1). */
export const YEAR_TICKS = Array.from({ length: SPAN + 1 }, (_, i) => ({
  year: TIMELINE_RANGE.start + i,
  x: i / SPAN,
}));

const fmt = ({ year, month }: YearMonth) => (month === undefined ? `${year}` : `${MONTHS[month - 1]} ${year}`);

/** `Jul 2024 – Aug 2026`, `Jun – Dec 2025`, `2026`, open-ended `Jul 2023 →`; awards show their year. */
export function formatPeriod(row: Experience): string {
  const start = parseYM(row.start);
  if (row.kind === 'award') return `${start.year}`;
  if (!row.end) return `${fmt(start)} →`;
  const end = parseYM(row.end);
  if (start.year === end.year) {
    if (start.month === undefined && end.month === undefined) return `${start.year}`;
    if (start.month !== undefined && end.month !== undefined) {
      return `${MONTHS[start.month - 1]} – ${MONTHS[end.month - 1]} ${start.year}`;
    }
  }
  return `${fmt(start)} – ${fmt(end)}`;
}

export interface Bar {
  /** Visual track index (0-based, top → bottom). */
  track: number;
  /** Start position, 0–1. */
  start: number;
  /** End position, 0–1 (NOW for open-ended rows). */
  end: number;
  /** No `end` date: bar runs to the 'now' marker with a dashed tail. */
  openEnded: boolean;
  /** Ends at or within six months of 'now': an outside label goes to the LEFT of the bar (nothing fits right). */
  late: boolean;
}

export interface Lane {
  kind: LaneKind;
  /** First track index of this lane. */
  first: number;
  /** Number of tracks (overlapping engagements of one kind stack). */
  count: number;
}

export interface Geometry {
  trackCount: number;
  lanes: Lane[];
  bars: ReadonlyMap<string, Bar>;
  /** Award pins: x position on the ruler (same-year awards spread evenly inside the year). */
  pins: ReadonlyMap<string, number>;
}

/** Six months, as a ruler fraction. */
const LATE_WINDOW = 0.5 / SPAN;

/**
 * Lays rows out on the ruler. Non-award rows become bars packed into per-kind lanes (greedy interval
 * packing, so Selfomy and FPT share the 'work' lane on two tracks); awards become pins.
 */
export function layoutTimeline(rows: readonly Experience[]): Geometry {
  const bars = new Map<string, Bar>();
  const lanes: Lane[] = [];
  let trackCount = 0;

  for (const kind of LANE_KINDS) {
    const members = rows
      .filter((row) => row.kind === kind)
      .map((row) => ({
        row,
        start: toFrac(row.start),
        end: row.end ? toFrac(row.end, 'end') : NOW_FRAC,
      }))
      .sort((a, b) => a.start - b.start);
    if (members.length === 0) continue;

    const trackEnds: number[] = [];
    for (const { row, start, end } of members) {
      let track = trackEnds.findIndex((lastEnd) => lastEnd <= start);
      if (track === -1) {
        track = trackEnds.length;
        trackEnds.push(end);
      } else {
        trackEnds[track] = end;
      }
      bars.set(row.id, {
        track: trackCount + track,
        start,
        end: Math.max(end, start),
        openEnded: !row.end,
        late: !row.end || end >= NOW_FRAC - LATE_WINDOW,
      });
    }
    lanes.push({ kind, first: trackCount, count: trackEnds.length });
    trackCount += trackEnds.length;
  }

  const pins = new Map<string, number>();
  const byYear = new Map<number, Experience[]>();
  for (const row of rows) {
    if (row.kind !== 'award') continue;
    const { year } = parseYM(row.start);
    byYear.set(year, [...(byYear.get(year) ?? []), row]);
  }
  for (const [year, group] of byYear) {
    group.forEach((row, i) => {
      pins.set(row.id, Math.min(1, (year + (i + 1) / (group.length + 1) - TIMELINE_RANGE.start) / SPAN));
    });
  }

  return { trackCount, lanes, bars, pins };
}
