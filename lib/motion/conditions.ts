/**
 * Single source of motion media queries. `tierA`/`reduce` match the inline boot script
 * (lib/boot/boot-script.ts) 1:1; pin guards follow master §5.3 (height guards).
 * Plain strings only — safe to import from any client/server module (no gsap).
 */
export const MOTION_CONDITIONS = {
  tierA: '(min-width:1024px) and (pointer:fine) and (prefers-reduced-motion:no-preference)',
  tierB: '(prefers-reduced-motion:no-preference) and (not ((min-width:1024px) and (pointer:fine)))',
  reduce: '(prefers-reduced-motion: reduce)',
  pinPyvulds: '(min-width:1024px) and (min-height:720px) and (pointer:fine) and (prefers-reduced-motion:no-preference)',
  pinReel: '(min-width:1024px) and (min-height:600px) and (pointer:fine) and (prefers-reduced-motion:no-preference)',
} as const;

/** Desktop + fine pointer, exactly the boot script's Tier A check (without the reduce clause). */
export const DESKTOP_FINE_QUERY = '(min-width:1024px) and (pointer:fine)';

export type MotionConditionKey = keyof typeof MOTION_CONDITIONS;

/** localStorage key written by the palette/menu "Motion: on/off" action. 'off' → Tier C. */
export const MOTION_PREF_KEY = 'runtime_motion';
