/**
 * Inline boot script (03a §4.3). Runs synchronously in <head> before first paint:
 * - `localStorage.runtime_motion === 'off'` → Tier C (checked before media queries)
 * - `prefers-reduced-motion: reduce` → Tier C
 * - `(min-width:1024px) and (pointer:fine)` → Tier A, otherwise Tier B
 * - sets `data-tier`, `data-js`, and `data-boot="play"` only when tier ≠ C, on `/`,
 *   without `#hash`, and the cold open has not been seen this session.
 * Media queries MUST stay 1:1 with `MOTION_CONDITIONS` in `lib/motion/conditions.ts`.
 * The string is a constant so a CSP `sha256-…` hash can be computed before build.
 */
export const BOOT_SCRIPT = `(function(){try{var d=document.documentElement,m=function(q){return matchMedia(q).matches},o=null;try{o=localStorage.getItem('runtime_motion')}catch(e){}var t=o==='off'?'C':(m('(min-width:1024px) and (pointer:fine)')?'A':'B');d.dataset.tier=t;d.dataset.js='';if(t!=='C'&&location.pathname==='/'&&!location.hash&&!sessionStorage.getItem('runtime_boot_seen'))d.dataset.boot='play';}catch(e){}})();`;
