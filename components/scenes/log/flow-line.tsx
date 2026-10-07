import { cn } from '@/lib/utils';
import styles from './flow-line.module.css';

/** The flow needs the sticky portrait column (origin ≥ 1024); below that the portrait sits far above the ruler. */
export const FLOW_MQ = '(min-width: 64rem)';
/** Normalised path length (`pathLength` attr) shared by every stroke, so dash values never depend on geometry. */
export const FLOW_LENGTH = 1000;
/** Side of the square 'plug' pixel at the ruler end. */
const PLUG = 6;
const GLOW_ID = 'flow-glow';
const MASK_ID = 'flow-mask';

interface FlowLineProps {
  className?: string;
}

/**
 * Teal energy line from under the origin portrait to the top-left of the timeline ruler. Pure markup: the
 * `d` attribute is empty until `applyFlow` runs (so nothing renders before the motion runtime is up), and the
 * owning <Timeline> scrubs `[data-flow-draw]` (line + mask: stroke-dashoffset 1000 → 0), `[data-flow-packets]`
 * (dashoffset drifts with scroll) and pops `[data-flow-plug]`. Tier/width gating lives in the module CSS.
 */
export function FlowLine({ className }: FlowLineProps) {
  return (
    <svg data-flow aria-hidden="true" focusable="false" className={cn(styles.flow, className)}>
      <defs>
        <filter id={GLOW_ID} x="-30%" y="-30%" width="160%" height="160%" colorInterpolationFilters="sRGB">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <mask id={MASK_ID} maskUnits="userSpaceOnUse" x="-4000" y="-4000" width="8000" height="8000">
          <path data-flow-d data-flow-draw pathLength={FLOW_LENGTH} className={styles.maskPath} />
        </mask>
      </defs>
      <g className={styles.glow}>
        <path data-flow-d data-flow-draw pathLength={FLOW_LENGTH} className={styles.line} />
      </g>
      <path data-flow-d data-flow-packets pathLength={FLOW_LENGTH} mask={`url(#${MASK_ID})`} className={styles.packets} />
      <rect data-flow-plug width={PLUG} height={PLUG} className={styles.plug} />
    </svg>
  );
}

interface Point {
  x: number;
  y: number;
}

export interface FlowGeometry {
  d: string;
  end: Point;
}

const px = (n: number) => n.toFixed(1);

/**
 * Curve in `host` coordinates (the `.tl` wrapper the SVG covers): leaves just below the anchor's bottom-left,
 * bows gently outward to clear the section header text, and curves smoothly down into the EDUCATION label.
 */
export function measureFlow(host: Element, anchor: Element | null, target: Element): FlowGeometry {
  const h = host.getBoundingClientRect();
  const t = target.getBoundingClientRect();
  const end = { x: t.left - h.left - 4, y: t.top - h.top };
  let start: Point;
  if (anchor) {
    const a = anchor.getBoundingClientRect();
    start = { x: a.left - h.left + 16, y: a.bottom - h.top + 12 };
  } else {
    const s = (host.closest('section') ?? host).getBoundingClientRect();
    start = { x: s.left - h.left, y: s.top - h.top };
  }

  const dy = end.y - start.y;
  // Gentle outward bow to the left: clears x=0 (header text) by ~22px
  const bowX = -22;
  const c1x = start.x - 14;
  const c1y = start.y + dy * 0.42;
  const c2x = bowX - 8;
  const c2y = end.y - dy * 0.22;

  const d = `M${px(start.x)} ${px(start.y)} C${px(c1x)} ${px(c1y)}, ${px(c2x)} ${px(c2y)}, ${px(end.x)} ${px(end.y)}`;

  return { d, end };
}

/** Writes the geometry into the SVG; a no-op when the path has not changed (safe to call every scroll tick). */
export function applyFlow(svg: SVGSVGElement, geometry: FlowGeometry): void {
  const paths = svg.querySelectorAll<SVGPathElement>('[data-flow-d]');
  if (paths[0]?.getAttribute('d') === geometry.d) return;
  paths.forEach((p) => p.setAttribute('d', geometry.d));
  const plug = svg.querySelector<SVGRectElement>('[data-flow-plug]');
  if (plug) {
    plug.setAttribute('x', px(geometry.end.x - PLUG / 2));
    plug.setAttribute('y', px(geometry.end.y - PLUG / 2));
  }
}
