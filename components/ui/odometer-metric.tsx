'use client';

import { useEffect, useRef, useState } from 'react';
import type { Metric } from '@/content/types';
import { useMotionTier } from '@/lib/motion/tiers';
import { cn } from '@/lib/utils';

const ROLL_MS = 900;
const STAGGER_MS = 60;

interface OdometerMetricProps {
  metric: Metric;
  className?: string;
}

type Phase = 'idle' | 'rolling' | 'settled';

/**
 * OdometerMetric (01 §5.7). The final value is always in the DOM (`<data>`), readable by screen readers.
 * Digit roll is an aria-hidden overlay, only when `metric.odometer` is true, the claim is not 'reported',
 * and tier ∈ {A,B}; Tier C / SSR / no-JS render only the settled value. 'reported' claims get a REPORTED tag.
 */
export function OdometerMetric({ metric, className }: OdometerMetricProps) {
  const tier = useMotionTier();
  const rootRef = useRef<HTMLElement>(null);
  const [phase, setPhase] = useState<Phase>('settled');

  const reported = metric.claim === 'reported';
  const canRoll = metric.odometer === true && !reported && (tier === 'A' || tier === 'B');
  const suffix = metric.suffix && metric.value.endsWith(metric.suffix) ? metric.suffix : '';
  const main = `${metric.prefix ?? ''}${suffix ? metric.value.slice(0, -suffix.length) : metric.value}`;
  const digitCount = main.replace(/\D/g, '').length;

  useEffect(() => {
    const el = rootRef.current;
    if (!canRoll || !el) {
      setPhase('settled');
      return;
    }
    // Already scrolled past (e.g. reload mid-page) → stay settled.
    if (el.getBoundingClientRect().bottom < 0) return;

    setPhase('idle');
    let settleTimer = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        io.disconnect();
        setPhase('rolling');
        settleTimer = window.setTimeout(() => setPhase('settled'), ROLL_MS + STAGGER_MS * digitCount + 50);
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      window.clearTimeout(settleTimer);
    };
  }, [canRoll, digitCount]);

  const animating = phase !== 'settled';
  let digitIndex = 0;

  return (
    <figure ref={rootRef} className={cn('min-w-0', className)}>
      <div className="relative inline-block font-pixel text-pixel-2xl whitespace-nowrap text-grade-teal tabular-nums slashed-zero">
        <data value={metric.numeric ?? metric.value} className={animating ? 'opacity-0' : undefined}>
          {main}
          {suffix ? <span className="text-[0.5em] text-ink-2">{suffix}</span> : null}
        </data>
        {animating ? (
          <span aria-hidden="true" className="absolute inset-0 flex">
            {[...main].map((char, i) => {
              if (!/\d/.test(char)) return <span key={i}>{char}</span>;
              const delay = STAGGER_MS * digitIndex++;
              const target = phase === 'rolling' ? Number(char) : 0;
              return (
                <span key={i} className="inline-block h-[1em] overflow-hidden">
                  <span
                    className="flex flex-col"
                    style={{
                      transform: `translateY(-${target}em)`,
                      transition: phase === 'rolling' ? `transform ${ROLL_MS}ms var(--ease-out) ${delay}ms` : 'none',
                    }}
                  >
                    {'0123456789'.split('').map((d) => (
                      <span key={d} className="h-[1em]">
                        {d}
                      </span>
                    ))}
                  </span>
                </span>
              );
            })}
            {suffix ? <span className="text-[0.5em] text-ink-2">{suffix}</span> : null}
          </span>
        ) : null}
      </div>
      <p className="mt-3 flex flex-wrap items-center gap-2 text-body-sm text-ink-2">
        <span>{metric.label}</span>
        {reported ? (
          <span className="inline-flex h-6 items-center rounded-full border border-line-strong px-2.5 font-pixel text-pixel-sm uppercase text-ink-2">
            Reported
          </span>
        ) : null}
      </p>
      <figcaption className="mt-2 max-w-measure text-caption text-ink-3">{metric.scope}</figcaption>
    </figure>
  );
}
