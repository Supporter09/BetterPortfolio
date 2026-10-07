import type { MotionApi } from '@/lib/motion/use-scene-motion';

const SVG_NS = 'http://www.w3.org/2000/svg';
const DOTS = 56;
/** Fraction of the scrub during which dots are still being released from the sprite (stagger window). */
const SPREAD = 0.55;
/** Scrub progress at which the data counts as "received" by the origin portrait. */
const RECEIVED_AT = 0.9;
/** Head leads the front dot by a small progress margin. */
const HEAD_LEAD = 0.04;
/** Tail lags the last dot by a small progress margin. */
const TAIL_PAD = 0.04;
const SAMPLES = 240;
const TEAL = '#5bc8c0';
const TEAL_LIGHT = '#9fe3dd';
const AMBER = '#f2a65a';
interface Dot {
  el: SVGRectElement;
  offset: number;
  jitterX: number;
  jitterY: number;
  size: number;
}

interface StreamOptions {
  /** Opening scene section (scroll start). */
  scene: HTMLElement;
  /** The self sprite wrapper (`[data-universe-self]`): path start + fades to 0.2. */
  self: HTMLElement;
}

function seeded(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 0x100000000;
  };
}

/**
 * Digitize stream (round 2 §4, opening → origin). Builds one document-absolute <svg> on <body> (so it can span
 * two isolated scene sections) with an invisible guide path from the self sprite to the origin portrait
 * frame (`[data-flow-anchor="portrait"]`), a bounded teal guide segment that travels along it with scroll
 * and disappears behind data as it passes, and 56 small squares travelling along it, staggered. Scrubbed by
 * ScrollTrigger from the opening's bottom to the portrait's top: the sprite fades to 0.2 as the first squares leave;
 * past 90 % the origin figure gets `data-received` (its media fades in — origin.module.css). At downward completion,
 * the guide segment collapses to zero length so no trail crosses the origin copy. Fully reversible on scroll up.
 * Mobile (< 768): straight vertical path. Geometry is recomputed on every ScrollTrigger refresh (resize, fonts, images).
 * Returns the cleanup, or null when the origin anchor is missing (then the figure is received immediately).
 */
export function mountDigitizeStream(
  { gsap, ScrollTrigger }: Pick<MotionApi, 'gsap' | 'ScrollTrigger'>,
  { scene, self }: StreamOptions,
): (() => void) | null {
  const portrait = document.querySelector<HTMLElement>('[data-flow-anchor="portrait"]');
  const figure = document.querySelector<HTMLElement>('[data-origin-figure]');
  const column = document.querySelector<HTMLElement>('[data-origin-column]');
  const sticky = document.querySelector<HTMLElement>('[data-origin-sticky]');
  if (!portrait || !figure || !column || !sticky) {
    figure?.setAttribute('data-received', '');
    return null;
  }

  /* ---- DOM ------------------------------------------------------------- */
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('data-digitize-stream', '');
  Object.assign(svg.style, {
    position: 'absolute',
    zIndex: '2',
    pointerEvents: 'none',
    overflow: 'visible',
  } as Partial<CSSStyleDeclaration>);

  // Guide trail: geometry source (getTotalLength / getPointAtLength) and bounded moving-window stroke.
  const guide = document.createElementNS(SVG_NS, 'path');
  guide.setAttribute('fill', 'none');
  guide.setAttribute('stroke', TEAL);
  guide.setAttribute('stroke-width', '1');
  guide.setAttribute('opacity', '0.22');
  svg.appendChild(guide);

  const rand = seeded(2026);
  const dots: Dot[] = Array.from({ length: DOTS }, (_, i) => {
    const el = document.createElementNS(SVG_NS, 'rect');
    const size = 3 + Math.round(rand() * 2);
    const tone = rand();
    el.setAttribute('width', String(size));
    el.setAttribute('height', String(size));
    el.setAttribute('fill', tone < 0.6 ? TEAL : tone < 0.85 ? TEAL_LIGHT : AMBER);
    el.setAttribute('opacity', '0');
    svg.appendChild(el);
    return {
      el,
      // Shuffle the release order a little so the stream doesn't read as a perfectly even queue.
      offset: ((i + rand() * 0.8) / DOTS) * SPREAD,
      jitterX: (rand() - 0.5) * 28,
      jitterY: (rand() - 0.5) * 10,
      size,
    };
  });
  document.body.appendChild(svg);

  /* ---- Geometry -------------------------------------------------------- */
  let points: { x: number; y: number }[] = [];
  let length = 0;
  const mobile = window.matchMedia('(width < 48rem)');

  const layout = () => {
    const sy = window.scrollY;
    const s = self.getBoundingClientRect();
    const start = { x: s.left + s.width / 2, y: s.top + s.height * 0.5 + sy };
    // The portrait lives in a sticky column: take its natural (un-stuck) top from the non-sticky cell.
    const cell = column.getBoundingClientRect();
    const inner = sticky.getBoundingClientRect();
    const p = portrait.getBoundingClientRect();
    const naturalTop = cell.top + (p.top - inner.top) + sy;
    const end = { x: p.left + p.width / 2, y: naturalTop + Math.min(28, p.height * 0.08) };
    const dy = end.y - start.y;
    const d = mobile.matches
      ? `M ${start.x} ${start.y} L ${end.x} ${end.y}`
      : `M ${start.x} ${start.y} C ${start.x} ${start.y + dy * 0.55}, ${end.x} ${end.y - dy * 0.45}, ${end.x} ${end.y}`;
    guide.setAttribute('d', d);

    const minX = Math.min(start.x, end.x) - 40;
    const maxX = Math.max(start.x, end.x) + 40;
    const minY = Math.min(start.y, end.y) - 40;
    const maxY = Math.max(start.y, end.y) + 40;
    svg.style.left = `${minX}px`;
    svg.style.top = `${minY}px`;
    svg.style.width = `${maxX - minX}px`;
    svg.style.height = `${maxY - minY}px`;
    svg.setAttribute('viewBox', `${minX} ${minY} ${maxX - minX} ${maxY - minY}`);

    length = guide.getTotalLength();
    points = Array.from({ length: SAMPLES + 1 }, (_, i) => {
      const pt = guide.getPointAtLength((i / SAMPLES) * length);
      return { x: pt.x, y: pt.y };
    });
  };

  const at = (u: number) => {
    const f = Math.max(0, Math.min(1, u)) * SAMPLES;
    const i = Math.min(SAMPLES - 1, Math.floor(f));
    const t = f - i;
    const a = points[i];
    const b = points[i + 1];
    return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
  };

  /* ---- Render ---------------------------------------------------------- */
  const setSelfOpacity = gsap.quickSetter(self, 'opacity');
  const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

  const render = (progress: number) => {
    if (!points.length) return;
    // Bounded guide segment derived from progress: head leads the front dot, tail follows
    // behind the last dot and erases the traversed path so it never overlaps Origin copy.
    const uHead = clamp01(progress * (1 + SPREAD) + HEAD_LEAD);
    const uTail = clamp01(progress * (1 + SPREAD + TAIL_PAD) - (SPREAD + TAIL_PAD));
    const head = uHead * length;
    const tail = uTail * length;
    const segLen = Math.max(0, head - tail);

    guide.setAttribute('stroke-dasharray', `${segLen.toFixed(1)} ${(length + 8).toFixed(1)}`);
    guide.setAttribute('stroke-dashoffset', (-tail || 0).toFixed(1));
    for (const dot of dots) {
      const u = clamp01(progress * (1 + SPREAD) - dot.offset);
      const { x, y } = at(u);
      // Fade in while leaving the sprite, fade out as the square is absorbed by the frame.
      const alpha = u <= 0 || u >= 0.985 ? 0 : Math.min(1, u / 0.06, (0.985 - u) / 0.06);
      const spread = Math.sin(u * Math.PI); // widest mid-path, tight at both ends
      dot.el.setAttribute(
        'transform',
        `translate(${(x + dot.jitterX * spread - dot.size / 2).toFixed(1)} ${(y + dot.jitterY * spread - dot.size / 2).toFixed(1)})`,
      );
      dot.el.setAttribute('opacity', alpha.toFixed(3));
    }

    setSelfOpacity(1 - 0.8 * clamp01(progress / 0.35));
    figure.toggleAttribute('data-received', progress >= RECEIVED_AT);
  };

  /* ---- Scroll ---------------------------------------------------------- */
  figure.setAttribute('data-stream', 'armed');
  layout();
  ScrollTrigger.addEventListener('refreshInit', layout);

  const trigger = ScrollTrigger.create({
    trigger: scene,
    start: 'bottom 85%',
    endTrigger: column,
    end: 'top 55%',
    scrub: 0.3,
    invalidateOnRefresh: true,
    onUpdate: (st) => render(st.progress),
    onRefresh: (st) => render(st.progress),
  });
  render(trigger.progress);

  return () => {
    ScrollTrigger.removeEventListener('refreshInit', layout);
    trigger.kill();
    svg.remove();
    // quickSetter writes are not tracked by gsap.context → restore the sprite by hand.
    self.style.opacity = '';
    figure.removeAttribute('data-stream');
    figure.removeAttribute('data-received');
  };
}
