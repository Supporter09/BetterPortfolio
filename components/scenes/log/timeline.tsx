'use client';

import { useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react';
import { PixelIcon } from '@/components/ui/pixel-icon';
import { StatusBadge } from '@/components/ui/status-badge';
import { ORG_MARKS } from '@/content/experience';
import type { Experience } from '@/content/types';
import { useSceneMotion } from '@/lib/motion/use-scene-motion';
import { cn } from '@/lib/utils';
import { DetailPanel } from './detail-panel';
import { FLOW_LENGTH, FLOW_MQ, FlowLine, applyFlow, measureFlow } from './flow-line';
import { fitLabel, samePlacements, type Placement } from './label-fit';
import { NOW_FRAC, YEAR_TICKS, formatPeriod, layoutTimeline, type LaneKind } from './layout';
import styles from './timeline.module.css';

const LANE_LABEL: Record<LaneKind, string> = {
  education: 'Education',
  work: 'Work',
  research: 'Research',
  field: 'Field',
};

const EASE_OUT = 'expo.out';
/** Bars show `orgShort` instead of a long official name (the panel header always shows the full org). */
const LONG_ORG = 28;
const DESKTOP = '(min-width: 48rem)';
/** Mirrors `gap` on `.text` in the module CSS. */
const TEXT_GAP_REM = 0.5;
/** Scrub timeline (arbitrary seconds; ScrollTrigger maps the whole duration onto the scroll range). */
const DRAW_SECS = 0.5;
/** Smallest scroll range (px) the scrub may span, so a short viewport never squashes the sequence. */
const MIN_RANGE = 320;

/** `6.5rem` / `40px` → px. */
function cssPx(value: string, rem: number): number {
  const n = parseFloat(value);
  if (Number.isNaN(n)) return 0;
  return value.trim().endsWith('rem') ? n * rem : n;
}

interface TimelineProps {
  rows: readonly Experience[];
  className?: string;
}

/**
 * Scene 03 — Timeline (refine contract §3). One `<ol>` of rows in content order (newest first); every row is a
 * `<button aria-expanded aria-controls>` and one detail panel is open at a time (the first by default, so the
 * content is reachable without JS). Desktop ≥768: year ruler + per-kind lanes with bars positioned by date,
 * awards as trophy pins on the ruler, panel below the lanes. Bar labels are `chip + role (+ org)`; labels wider
 * than their bar move outside it (see `label-fit.ts`), measured after layout and on resize. Mobile: vertical
 * list, panel inline under its row. Keyboard: ↑/↓/←/→ + Home/End move between rows, Enter/Space toggle (native),
 * Esc closes. Motion (Tier A/B): one scrubbed, reversible ScrollTrigger — the origin → timeline energy line
 * (`flow-line.tsx`, ≥1024) draws, the ruler powers on, bars/pins reveal top-to-bottom; Tier C/no-JS: static.
 */
export function Timeline({ rows, className }: TimelineProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState<string | null>(rows[0]?.id ?? null);
  const [placements, setPlacements] = useState<ReadonlyMap<string, Placement>>(() => new Map());
  const firstMotionRun = useRef(true);
  /** Natural org-piece widths (px, incl. gap), cached while visible so hidden pieces can still be sized. */
  const orgWidths = useRef(new Map<string, number>());
  const geometry = useMemo(() => layoutTimeline(rows), [rows]);

  // Desktop label fit: bar edges come from the geometry (transform-safe), label widths from the DOM.
  useLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;
    const mq = window.matchMedia(DESKTOP);

    const measure = () => {
      if (!mq.matches) {
        setPlacements((prev) => (prev.size ? new Map() : prev));
        return;
      }
      const cs = getComputedStyle(root);
      const rem = parseFloat(cs.fontSize) || 16;
      const trackLeft = cssPx(cs.getPropertyValue('--tl-label'), rem);
      const track = root.clientWidth - trackLeft - cssPx(cs.getPropertyValue('--tl-right'), rem);
      const pinSize = cssPx(cs.getPropertyValue('--tl-pin'), rem);
      const bounds = {
        left: trackLeft,
        right: root.clientWidth,
        now: trackLeft + track * NOW_FRAC,
        tail: cssPx(cs.getPropertyValue('--tl-tail'), rem),
        tick: cssPx(cs.getPropertyValue('--tl-tick'), rem),
      };
      const x = (frac: number) => trackLeft + track * frac;

      const widths = new Map<string, { base: number; org: number }>();
      root.querySelectorAll<HTMLElement>('[data-tl-row]').forEach((rowEl) => {
        const id = rowEl.dataset.tlRow ?? '';
        const text = rowEl.querySelector<HTMLElement>('[data-tl-text]');
        if (!text) return;
        const orgEl = text.querySelector<HTMLElement>('[data-tl-org]');
        const orgShown = orgEl !== null && !orgEl.hasAttribute('data-off');
        let org = orgWidths.current.get(id) ?? 0;
        if (orgEl && orgShown) {
          org = orgEl.offsetWidth + TEXT_GAP_REM * rem;
          orgWidths.current.set(id, org);
        }
        const full = text.offsetWidth;
        widths.set(id, { base: orgShown ? full - org : full, org: orgEl ? org : 0 });
      });

      const next = new Map<string, Placement>();
      const byTrack = new Map<number, Array<{ id: string; start: number; end: number }>>();
      for (const [id, bar] of geometry.bars) {
        const list = byTrack.get(bar.track) ?? [];
        list.push({ id, start: x(bar.start), end: x(bar.end) });
        byTrack.set(bar.track, list);
      }
      for (const list of byTrack.values()) {
        list.sort((a, b) => a.start - b.start);
        list.forEach((item, i) => {
          const bar = geometry.bars.get(item.id);
          const w = widths.get(item.id);
          if (!bar || !w) return;
          next.set(
            item.id,
            fitLabel(
              {
                start: item.start,
                end: item.end,
                openEnded: bar.openEnded,
                late: bar.late,
                base: w.base,
                org: w.org,
                prevEnd: list[i - 1]?.end,
                nextStart: list[i + 1]?.start,
              },
              bounds,
            ),
          );
        });
      }
      // Award pins: the label sits above the pin, flush with its left edge; org shows when it fits before the
      // NOW line (which spans the ruler) and the root's edge.
      for (const [id, pin] of geometry.pins) {
        const w = widths.get(id);
        if (w) next.set(id, { side: 'in', org: w.base + w.org <= Math.min(bounds.right, bounds.now) - (x(pin) - pinSize / 2) });
      }
      setPlacements((prev) => (samePlacements(prev, next) ? prev : next));
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(root);
    mq.addEventListener('change', measure);
    return () => {
      ro.disconnect();
      mq.removeEventListener('change', measure);
    };
  }, [geometry]);

  const onKeyDown = (event: KeyboardEvent<HTMLOListElement>) => {
    const list = event.currentTarget;
    const target = event.target as HTMLElement;
    if (event.key === 'Escape') {
      if (open === null) return;
      event.preventDefault();
      const owner = list.querySelector<HTMLButtonElement>(`[aria-controls="${panelId(open)}"]`);
      setOpen(null);
      owner?.focus();
      return;
    }
    if (!target.matches('[data-tl-row]')) return;
    const buttons = Array.from(list.querySelectorAll<HTMLButtonElement>('[data-tl-row]'));
    const index = buttons.indexOf(target as HTMLButtonElement);
    let next = -1;
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') next = Math.min(buttons.length - 1, index + 1);
    else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') next = Math.max(0, index - 1);
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = buttons.length - 1;
    if (next === -1) return;
    event.preventDefault();
    buttons[next]?.focus();
  };

  // Round 2 §4 — scrubbed, reversible story flow (desktop ≥768). The origin → timeline energy line (≥1024, see
  // flow-line.tsx) draws from (origin bottom − 40% viewport) until the ruler is on screen, then the ruler powers
  // on (hairlines/year labels), pins pop, bars grow top-to-bottom; scrolling up reverses. Mobile rows fade up.
  useSceneMotion(ref, ({ gsap, ScrollTrigger, mm, tier }) => {
    const root = ref.current;
    if (!root || root.getBoundingClientRect().top <= window.innerHeight) return;

    mm.add({ wide: DESKTOP, flow: FLOW_MQ, narrow: '(max-width: 47.9375rem)' }, (ctx) => {
      if (ctx.conditions?.wide) {
        const origin = document.querySelector('[data-scene="origin"]');
        const decor = root.querySelector('[data-tl-decor]');
        const flowSvg = root.querySelector<SVGSVGElement>('[data-flow]');
        const flowTarget = root.querySelector('[data-flow-target]');
        const anchor = document.querySelector('[data-flow-anchor="portrait"]');
        const flow = ctx.conditions?.flow && flowSvg && flowTarget ? { svg: flowSvg, target: flowTarget } : null;
        const measure = flow ? () => applyFlow(flow.svg, measureFlow(root, anchor, flow.target)) : undefined;
        // Start earlier while scrolling through origin.
        // Complete 100% when Section 03 header ("The story so far") arrives under the HUD at the top.
        const startAt = () => {
          const section = root.closest('section') ?? root;
          const sectionTop = section.getBoundingClientRect().top + window.scrollY;
          return Math.max(0, sectionTop - window.innerHeight * 0.95);
        };

        const endAt = () => {
          const section = root.closest('section') ?? root;
          const sectionTop = section.getBoundingClientRect().top + window.scrollY;
          const target = sectionTop - 90;
          return Math.max(startAt() + MIN_RANGE, target);
        };

        const master = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: root,
            start: startAt,
            end: endAt,
            scrub: tier === 'A' ? 0.4 : true,
            onRefresh: measure,
            onUpdate: measure,
          },
        });

        let t = 0;
        if (flow) {
          measure?.();
          master.from(flow.svg.querySelectorAll('[data-flow-draw]'), { strokeDashoffset: FLOW_LENGTH, duration: DRAW_SECS }, 0);
          // Opacity only: the plug's x/y follow the measured geometry, so no cached SVG transform origin.
          master.from(flow.svg.querySelector('[data-flow-plug]'), { opacity: 0, duration: 0.08 }, DRAW_SECS - 0.06);
          t = DRAW_SECS;
        }

        // Ruler powers on: hairlines grow down, year/lane labels + baseline fade, pins pop, NOW lights last.
        const ticks = root.querySelectorAll('[data-tl-tick]');
        const rulerEls = root.querySelectorAll('[data-tl-ruler]');
        const pins = [...geometry.pins]
          .sort(([, a], [, b]) => a - b)
          .map(([id]) => root.querySelector(`[data-tl-row="${id}"]`))
          .filter((el) => el !== null);
        const nows = root.querySelectorAll('[data-tl-now]');
        if (ticks.length) master.from(ticks, { scaleY: 0, opacity: 0, transformOrigin: 'top center', duration: 0.25, stagger: 0.02 }, t);
        if (rulerEls.length) master.from(rulerEls, { opacity: 0, duration: 0.2, stagger: 0.02 }, t + 0.02);
        if (pins.length) master.from(pins, { scale: 0, opacity: 0, duration: 0.2, ease: 'back.out(2)', stagger: 0.04 }, t + 0.15);
        if (nows.length) master.from(nows, { opacity: 0, duration: 0.15 }, t + 0.2);
        t += 0.35;

        // Bars grow top-to-bottom (track, then start), labels follow each bar.
        const barRows = [...geometry.bars]
          .sort(([, a], [, b]) => a.track - b.track || a.start - b.start)
          .map(([id]) => root.querySelector(`[data-tl-row="${id}"]`))
          .filter((el) => el !== null);
        const fills = barRows.map((row) => row.querySelector('[data-tl-fill]')).filter((el) => el !== null);
        const texts = barRows.map((row) => row.querySelector('[data-tl-text]')).filter((el) => el !== null);
        if (fills.length) master.from(fills, { scaleX: 0, transformOrigin: 'left center', duration: 0.3, ease: 'power2.out', stagger: 0.05 }, t);
        if (texts.length) master.from(texts, { opacity: 0, duration: 0.2, stagger: 0.05 }, t + 0.08);

        // Energy packets drift forward along the drawn line for the whole scrub (negative offset = downstream).
        if (flow) {
          master.fromTo(
            flow.svg.querySelector('[data-flow-packets]'),
            { strokeDashoffset: 0 },
            { strokeDashoffset: -FLOW_LENGTH * 0.4, duration: master.duration() },
            0,
          );
        }
        return;
      }
      const items = root.querySelectorAll('[data-tl-item]');
      if (!items.length) return;
      gsap.set(items, { opacity: 0, y: 12 });
      ScrollTrigger.batch(items, {
        start: 'top 88%',
        once: true,
        onEnter: (batch) => gsap.to(batch, { opacity: 1, y: 0, duration: 0.32, ease: EASE_OUT, stagger: 0.05 }),
      });
    });
  });

  // B3.2 — panel content fades/rises on each change; the panel itself reveals instantly (no height animation).
  useSceneMotion(
    ref,
    ({ gsap, ScrollTrigger }) => {
      if (firstMotionRun.current) {
        firstMotionRun.current = false;
        return;
      }
      const inner = ref.current?.querySelector('[data-panel-inner]');
      if (inner) gsap.from(inner, { opacity: 0, y: 8, duration: 0.32, ease: EASE_OUT });
      // The open panel changes the document height → recompute every trigger below this scene.
      const raf = requestAnimationFrame(() => ScrollTrigger.refresh());
      return () => cancelAnimationFrame(raf);
    },
    [open],
  );

  return (
    <div ref={ref} className={cn(styles.tl, className)} style={{ '--tl-tracks': geometry.trackCount } as CSSProperties}>
      <FlowLine />
      <div aria-hidden="true" data-tl-decor className={styles.decor}>
        <span data-flow-target className={styles.flowTarget} />
        {YEAR_TICKS.map((tick) => (
          <span key={tick.year} style={{ '--f': tick.x } as CSSProperties}>
            <span data-tl-tick className={styles.tick} />
            <span data-tl-ruler className={cn(styles.tickLabel, 'label-pixel text-ink-3')}>
              {tick.year}
            </span>
          </span>
        ))}
        <span data-tl-ruler className={styles.baseline} />
        {geometry.lanes.map((lane) => (
          <span key={lane.kind} style={{ '--t': lane.first } as CSSProperties}>
            {lane.first > 0 ? <span data-tl-ruler className={styles.laneSep} /> : null}
            <span data-tl-ruler className={cn(styles.laneLabel, 'label-pixel text-ink-3')}>
              {LANE_LABEL[lane.kind]}
            </span>
          </span>
        ))}
        <span style={{ '--f': NOW_FRAC } as CSSProperties}>
          <span data-tl-now className={styles.now} />
          <span data-tl-now className={cn(styles.nowLabel, 'label-pixel text-grade-amber')}>
            <span className="rec-dot" data-pulse="true" />
            Now
          </span>
        </span>
      </div>

      <ol aria-label="Experience timeline" className={styles.list} onKeyDown={onKeyDown}>
        {rows.map((row) => {
          const expanded = open === row.id;
          const bar = geometry.bars.get(row.id);
          const pin = geometry.pins.get(row.id);
          const award = row.kind === 'award';
          const placement = placements.get(row.id) ?? { side: 'in', org: true };
          const style = bar
            ? ({ '--f': bar.start, '--w': bar.end - bar.start, '--t': bar.track } as CSSProperties)
            : ({ '--f': pin ?? 0 } as CSSProperties);
          const buttonId = `tl-row-${row.id}`;
          const chip = ORG_MARKS[row.orgShort] ?? row.orgShort;
          // Awards name the competition in full (the chip alone is cryptic); bars shorten long official names.
          const orgLabel = award || row.org.length <= LONG_ORG ? row.org : row.orgShort;

          return (
            <li key={row.id} data-tl-item className={styles.item}>
              <button
                type="button"
                id={buttonId}
                data-tl-row={row.id}
                data-tl-bar={bar ? '' : undefined}
                data-tl-pin={pin !== undefined ? '' : undefined}
                data-award={award ? '' : undefined}
                data-label={placement.side}
                aria-expanded={expanded}
                aria-controls={panelId(row.id)}
                className={styles.row}
                style={style}
                onClick={() => setOpen(expanded ? null : row.id)}
              >
                <span aria-hidden="true" data-tl-fill className={styles.fill} data-open-ended={bar?.openEnded ? '' : undefined} />
                <span data-tl-text className={styles.text}>
                  {award ? <PixelIcon name="trophy" size={16} className="shrink-0 text-grade-amber" /> : null}
                  <span
                    className={cn(
                      'label-pixel inline-flex h-5 shrink-0 items-center border px-1.5',
                      award ? 'border-grade-amber/60 text-grade-amber' : 'border-line-strong text-ink',
                    )}
                  >
                    {chip}
                  </span>
                  <span className="shrink-0 text-body-sm font-medium text-ink">{row.role}</span>
                  {/* Desktop org piece — dropped (data-off) when the label would not fit; the chip already names it otherwise. */}
                  {orgLabel !== chip ? (
                    <span
                      data-tl-org
                      data-off={placement.org ? undefined : ''}
                      className={cn(styles.org, 'shrink-0 font-mono text-caption text-ink-3')}
                    >
                      {orgLabel}
                    </span>
                  ) : null}
                  {/* Mobile meta line (org · location · period); the desktop panel header carries these. */}
                  <span className={cn(styles.meta, 'font-mono text-caption text-ink-3')}>
                    {award ? row.org : `${orgLabel} · ${row.location} · ${formatPeriod(row)}`}
                  </span>
                  {row.status === 'in-production' ? <StatusBadge status="in-production" /> : null}
                </span>
              </button>
              <div id={panelId(row.id)} role="region" aria-labelledby={buttonId} hidden={!expanded} className={styles.panel}>
                {expanded ? <DetailPanel row={row} /> : null}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function panelId(id: string): string {
  return `tl-panel-${id}`;
}
