import type { SVGProps } from 'react';
import type { Sprite } from '@/content/types';
import { cn } from '@/lib/utils';

interface Run {
  x: number;
  y: number;
  w: number;
  color: string;
}

/** Horizontal run-length pass per frame: one <rect> per same-colour span. Unknown chars render as transparent. */
function runsOf(rows: readonly string[], palette: Sprite['palette']): Run[] {
  const runs: Run[] = [];
  rows.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      const ch = row[x];
      const color = ch === '.' ? undefined : palette[ch];
      if (!color) {
        x++;
        continue;
      }
      const start = x;
      while (x < row.length && row[x] === ch) x++;
      runs.push({ x: start, y, w: x - start, color });
    }
  });
  return runs;
}

const RUNS = new WeakMap<Sprite, Run[][]>();

function framesOf(sprite: Sprite): Run[][] {
  let runs = RUNS.get(sprite);
  if (!runs) {
    runs = sprite.frames.map((frame) => runsOf(frame, sprite.palette));
    RUNS.set(sprite, runs);
  }
  return runs;
}

export interface PixelSpriteProps extends Omit<SVGProps<SVGSVGElement>, 'width' | 'height'> {
  sprite: Sprite;
  /** CSS px per bitmap cell (default 4 → a 24×32 sprite renders 96×128). */
  scale?: number;
  /** Frame index into `sprite.frames` (clamped). */
  frame?: number;
  /** Multi-frame sprites: keep every frame mounted and crossfade opacity (600 ms) instead of swapping. */
  crossfade?: boolean;
  /** Meaningful sprite: rendered with a <title> and role="img" instead of aria-hidden. */
  title?: string;
}

/**
 * PixelSprite: a `content/sprites.ts` bitmap as crisp SVG <rect>s (`shape-rendering: crispEdges`), run-length
 * encoded per colour. The viewBox is the bitmap grid, so `scale` only changes the rendered box — no layout change
 * when `frame` moves. With `crossfade`, all frames stack in one <svg> and the active one fades in
 * (`.pixel-sprite__frame`, Tier C: instant). Decorative by default (`aria-hidden`); pass `title` for meaning.
 */
export function PixelSprite({
  sprite,
  scale = 4,
  frame = 0,
  crossfade = false,
  title,
  className,
  style,
  ...rest
}: PixelSpriteProps) {
  const frames = framesOf(sprite);
  const active = Math.min(Math.max(0, frame), frames.length - 1);
  const stack = crossfade && frames.length > 1;
  const shown = stack ? frames : [frames[active]];

  return (
    <svg
      viewBox={`0 0 ${sprite.w} ${sprite.h}`}
      width={sprite.w * scale}
      height={sprite.h * scale}
      shapeRendering="crispEdges"
      className={cn('pixel-sprite inline-block shrink-0 align-middle', className)}
      style={{ imageRendering: 'pixelated', ...style }}
      data-sprite={sprite.name}
      aria-hidden={title ? undefined : 'true'}
      role={title ? 'img' : undefined}
      focusable="false"
      {...rest}
    >
      {title ? <title>{title}</title> : null}
      {shown.map((runs, i) => (
        <g
          key={i}
          className={stack ? 'pixel-sprite__frame' : undefined}
          data-active={stack ? (i === active ? 'true' : 'false') : undefined}
        >
          {runs.map((run) => (
            <rect key={`${run.y}-${run.x}`} x={run.x} y={run.y} width={run.w} height={1} fill={run.color} />
          ))}
        </g>
      ))}
    </svg>
  );
}
