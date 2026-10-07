// The only module allowed to read build env (03a §7.3). Values are inlined at build time by next.config.ts.
const iso = process.env.NEXT_PUBLIC_BUILD_TIME ?? '';
const sha = process.env.NEXT_PUBLIC_BUILD_SHA ?? '';

/** e.g. `2026-10-06 14:02 UTC` (empty when unknown). */
const time = iso ? `${iso.slice(0, 10)} ${iso.slice(11, 16)} UTC` : '';

export const BUILD_INFO = {
  iso,
  sha,
  time,
  /** Footer text: `build 3f2a9c1 · 2026-10-06 14:02 UTC` (SHA omitted when not built from git/CI). */
  label: ['build', sha, time ? `· ${time}` : ''].filter(Boolean).join(' '),
} as const;
