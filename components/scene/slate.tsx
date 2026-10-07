import { cn } from '@/lib/utils';

interface SlateProps {
  /** Two-digit scene number, e.g. '04'. */
  number: string;
  /** Take number (default 1) → `TAKE 01`. */
  take?: number;
  /** Slate label only, e.g. 'FEATURE PRESENTATION'. */
  label: string;
  className?: string;
}

/**
 * Inline slate (01 §5.3): `SCENE 04 · TAKE 01 · FEATURE PRESENTATION`, label mono ink-3,
 * scene/take numbers in Geist Pixel (scene number ink). Sits above the scene <h2>; never replaces it.
 * <768: `SC 04 · TAKE 01` + label wraps.
 */
export function Slate({ number, take = 1, label, className }: SlateProps) {
  const takeLabel = String(take).padStart(2, '0');
  return (
    <p className={cn('slate label-mono flex flex-wrap gap-x-[0.6em] text-ink-3', className)}>
      <span className="whitespace-nowrap">
        <span className="md:hidden">SC</span>
        <span className="hidden md:inline">SCENE</span>{' '}
        <span className="font-pixel text-pixel-md text-ink">{number}</span> · TAKE{' '}
        <span className="font-pixel text-pixel-md">{takeLabel}</span>
      </span>
      <span className="whitespace-nowrap">
        <span aria-hidden="true">· </span>
        {label}
      </span>
    </p>
  );
}
