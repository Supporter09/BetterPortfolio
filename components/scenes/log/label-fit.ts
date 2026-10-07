/**
 * Label placement for desktop timeline bars (bryangarage rule). A bar's label is `chip + role` (+ org when it fits).
 * It sits INSIDE the bar when it fits between the bar's start and the earlier of its end / the NOW line, minus the
 * dashed tail of open-ended bars. Otherwise it goes OUTSIDE: right of the bar's end for early bars, left of the
 * bar's start for bars that end near NOW — never over a neighbouring bar on the same track, the NOW line or the
 * ruler's edges. All lengths are px relative to the timeline root.
 */

export type LabelSide = 'in' | 'right' | 'left';

export interface Placement {
  side: LabelSide;
  /** Show the org piece (it fits next to chip + role). */
  org: boolean;
}

export interface FitBar {
  start: number;
  end: number;
  openEnded: boolean;
  late: boolean;
  /** Natural label width with `chip + role` (+ badge) only, padding included. */
  base: number;
  /** Extra width the org piece adds (its width + gap). */
  org: number;
  /** Same-track neighbours; undefined when none. */
  prevEnd?: number;
  nextStart?: number;
}

export interface FitBounds {
  /** Track start (right edge of the lane-label column). */
  left: number;
  /** Root's right edge. */
  right: number;
  /** NOW line. */
  now: number;
  /** Dashed tail length of open-ended bars. */
  tail: number;
  /** Connector tick between a bar and its outside label. */
  tick: number;
}

export function fitLabel(bar: FitBar, bounds: FitBounds): Placement {
  const inner = Math.min(bar.end, bounds.now) - bar.start - (bar.openEnded ? bounds.tail : 0);
  if (bar.base + bar.org <= inner) return { side: 'in', org: true };
  if (bar.base <= inner) return { side: 'in', org: false };

  const rightStop = Math.min(bar.nextStart ?? Infinity, bounds.right, bar.end < bounds.now ? bounds.now : Infinity);
  const room: Record<Exclude<LabelSide, 'in'>, number> = {
    right: rightStop - bar.end - bounds.tick,
    left: bar.start - Math.max(bar.prevEnd ?? -Infinity, bounds.left) - bounds.tick,
  };
  const order: Array<Exclude<LabelSide, 'in'>> = bar.late ? ['left', 'right'] : ['right', 'left'];
  for (const side of order) {
    if (bar.base + bar.org <= room[side]) return { side, org: true };
    if (bar.base <= room[side]) return { side, org: false };
  }
  return { side: room.right >= room.left ? 'right' : 'left', org: false };
}

export function samePlacements(a: ReadonlyMap<string, Placement>, b: ReadonlyMap<string, Placement>): boolean {
  if (a.size !== b.size) return false;
  for (const [id, p] of a) {
    const q = b.get(id);
    if (!q || q.side !== p.side || q.org !== p.org) return false;
  }
  return true;
}
