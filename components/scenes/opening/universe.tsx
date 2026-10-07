'use client';

import Image from 'next/image';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { PixelIcon } from '@/components/ui/pixel-icon';
import { PixelSprite } from '@/components/ui/pixel-sprite';
import { SELF_POSES, SPRITES } from '@/content/sprites';
import type { Sprite } from '@/content/types';
import { useMotionTier } from '@/lib/motion/tiers';
import { cn } from '@/lib/utils';
import styles from './opening.module.css';

/** Pose shown without JS / in Tier C, and the first pose of the cycle. */
const STATIC_POSE = SELF_POSES.indexOf('work');
const POSE_MS = 4000;
const PARALLAX_MAX = 12;

/** One orbit per companion: base radius in px (× `--k`), period, start angle. Slowest ring outermost. */
const ORBITS = [
  { id: 'gao', r: 150, period: 45, phase: 210 },
  { id: 'youtube', r: 190, period: 60, phase: 20 },
  { id: 'macbook', r: 230, period: 75, phase: 120 },
  { id: 'osmo', r: 270, period: 90, phase: 300 },
] as const;

/** Seeded LCG so the star field is identical on the server and the client. */
function seeded(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 0x100000000;
  };
}

interface Star {
  x: number;
  y: number;
  frame: 0 | 1;
  duration: number;
  delay: number;
}

/** 14 stars, kept out of the centre where the sprite sits. */
const STARS: Star[] = (() => {
  const rand = seeded(1807);
  const stars: Star[] = [];
  while (stars.length < 14) {
    const x = 4 + rand() * 92;
    const y = 4 + rand() * 92;
    const dx = (x - 50) / 24;
    const dy = (y - 50) / 34;
    if (dx * dx + dy * dy < 1) continue;
    stars.push({
      x,
      y,
      frame: rand() > 0.5 ? 1 : 0,
      duration: 2.4 + rand() * 2.6,
      delay: -rand() * 5,
    });
  }
  return stars;
})();

function spriteVars(sprite: Sprite): CSSProperties {
  return { '--sw': sprite.w, '--sh': sprite.h } as CSSProperties;
}

function Orbiter({ id }: { id: (typeof ORBITS)[number]['id'] }) {
  if (id === 'youtube') {
    return (
      <span className={styles.planet}>
        {/* 290×290 pixel-art source: served as-is so `image-rendering: pixelated` does the (nearest) downscale. */}
        <Image
          src="/media/avatar.png"
          width={32}
          height={32}
          alt="YouTube channel avatar"
          className={styles.planetImg}
          unoptimized
        />
      </span>
    );
  }
  const sprite = SPRITES[id];
  return <PixelSprite sprite={sprite} scale={3} style={spriteVars(sprite)} />;
}

interface UniverseProps {
  className?: string;
}

/**
 * Hero universe (round 2 §3). Server markup is the final state: self sprite in the `work` pose at the centre,
 * Gạo / YouTube planet / MacBook / Osmo on four tilted CSS orbits (45–90 s), twinkling stars. With JS in
 * Tier A/B the sprite cycles its six poses every 4 s (crossfade); Tier A adds a ≤ 12 px pointer parallax.
 * "Pause orbit" sets `data-paused` → every CSS loop freezes and the pose timer stops (WCAG 2.2.2).
 * Hooks for OpeningStage: `[data-universe]` (scroll-out), `[data-universe-self]` (digitize stream).
 */
export function Universe({ className }: UniverseProps) {
  const tier = useMotionTier();
  const rootRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(true);
  const [pose, setPose] = useState(STATIC_POSE);
  const motion = tier === 'A' || tier === 'B';
  const cycling = motion && !paused && visible;

  // Pose cycle.
  useEffect(() => {
    if (!cycling) return;
    const id = window.setInterval(() => setPose((p) => (p + 1) % SELF_POSES.length), POSE_MS);
    return () => window.clearInterval(id);
  }, [cycling]);

  // Offscreen → freeze the loops (battery) without touching the visitor's pause choice.
  useEffect(() => {
    const root = rootRef.current;
    if (!root || !motion) return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0 });
    io.observe(root);
    return () => io.disconnect();
  }, [motion]);

  // Pointer parallax (Tier A only): rAF-smoothed, ±12 px, eased back to centre when the pointer leaves.
  useEffect(() => {
    const root = rootRef.current;
    if (!root || tier !== 'A' || !window.matchMedia('(pointer: fine)').matches) return;
    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;
    let raf = 0;
    const tick = () => {
      cx += (tx - cx) * 0.12;
      cy += (ty - cy) * 0.12;
      root.style.setProperty('--px', `${cx.toFixed(2)}px`);
      root.style.setProperty('--py', `${cy.toFixed(2)}px`);
      raf = Math.abs(tx - cx) + Math.abs(ty - cy) > 0.05 ? requestAnimationFrame(tick) : 0;
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const onMove = (event: PointerEvent) => {
      const r = root.getBoundingClientRect();
      const nx = ((event.clientX - (r.left + r.width / 2)) / window.innerWidth) * 2;
      const ny = ((event.clientY - (r.top + r.height / 2)) / window.innerHeight) * 2;
      tx = Math.max(-1, Math.min(1, nx)) * PARALLAX_MAX;
      ty = Math.max(-1, Math.min(1, ny)) * PARALLAX_MAX;
      schedule();
    };
    const onLeave = () => {
      tx = 0;
      ty = 0;
      schedule();
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    return () => {
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      if (raf) cancelAnimationFrame(raf);
      root.style.removeProperty('--px');
      root.style.removeProperty('--py');
    };
  }, [tier]);

  const self = SPRITES.self;
  const star = SPRITES.star;

  return (
    <div className={cn(styles.universeCol, className)}>
      <div
        ref={rootRef}
        data-universe
        className={styles.universe}
        data-paused={paused ? '' : undefined}
        data-offscreen={motion && !visible ? '' : undefined}
      >
        <div aria-hidden="true" className={styles.sky}>
          {STARS.map((s, i) => (
            <span
              key={i}
              className={styles.star}
              style={
                {
                  left: `${s.x}%`,
                  top: `${s.y}%`,
                  '--d': `${s.duration.toFixed(2)}s`,
                  '--delay': `${s.delay.toFixed(2)}s`,
                } as CSSProperties
              }
            >
              <PixelSprite sprite={star} scale={2} frame={s.frame} style={spriteVars(star)} />
            </span>
          ))}
        </div>

        <div className={styles.plane}>
          <div aria-hidden="true" className={styles.ground} />

          {ORBITS.map((orbit) => (
            <div
              key={orbit.id}
              className={styles.orbit}
              style={
                {
                  '--r': orbit.r,
                  '--period': `${orbit.period}s`,
                  '--phase': `${orbit.phase}deg`,
                  '--phase-t': `${(-(orbit.phase / 360) * orbit.period).toFixed(2)}s`,
                } as CSSProperties
              }
            >
              <div className={styles.orbiter}>
                <span className={styles.body}>
                  <Orbiter id={orbit.id} />
                </span>
              </div>
            </div>
          ))}

          <div data-universe-self className={styles.self}>
            <PixelSprite
              sprite={self}
              scale={6}
              frame={motion ? pose : STATIC_POSE}
              crossfade
              title={`Pixel-art Minh, ${SELF_POSES[motion ? pose : STATIC_POSE].replace('-', ' ')}`}
              style={spriteVars(self)}
            />
          </div>
        </div>

        {motion ? (
          <button
            type="button"
            aria-pressed={paused}
            onClick={() => setPaused((value) => !value)}
            className={cn(
              styles.pause,
              'label-mono inline-flex min-h-11 items-center gap-2.5 rounded-sm border border-line bg-bg-0/70 px-3 text-ink-2 transition-colors duration-(--dur-fast) ease-standard hover-fine:border-line-strong hover-fine:text-ink',
            )}
          >
            <PixelIcon name={paused ? 'play' : 'pause'} size={16} />
            {paused ? 'Resume orbit' : 'Pause orbit'}
          </button>
        ) : null}
      </div>
    </div>
  );
}
