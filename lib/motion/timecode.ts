// Pure timecode helpers (02a §5). No DOM, no gsap — unit-testable.
export const NOMINAL_RUNTIME_SECONDS = 240; // 4-minute nominal runtime
export const FPS = 24;
export const TOTAL_FRAMES = NOMINAL_RUNTIME_SECONDS * FPS; // 5760

/** Scroll progress (0–1) → frame index, clamped so the end of the page reads exactly 00:04:00:00. */
export function progressToFrame(progress: number): number {
  const p = Math.min(Math.max(progress, 0), 1);
  return Math.min(Math.floor(p * TOTAL_FRAMES), TOTAL_FRAMES);
}

/** Frame count → `HH:MM:SS:FF` at 24fps. Hours are not wrapped (days fold into hours). */
export function framesToClock(frameIndex: number): string {
  const frames = Math.max(0, Math.floor(frameIndex));
  const hours = Math.floor(frames / (FPS * 3600));
  const rem1 = frames % (FPS * 3600);
  const minutes = Math.floor(rem1 / (FPS * 60));
  const rem2 = rem1 % (FPS * 60);
  const seconds = Math.floor(rem2 / FPS);
  const ff = rem2 % FPS;
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}:${pad(ff)}`;
}

/** `SC 04 · 00:02:41:12` */
export function formatTimecode(frameIndex: number, sceneNumber: string): string {
  return `SC ${sceneNumber} · ${framesToClock(frameIndex)}`;
}

/** Frames elapsed (24fps) between an ISO date and `now`; 0 if the date is in the future/invalid. */
export function framesSince(since: string, now: number): number {
  const start = Date.parse(since);
  if (Number.isNaN(start)) return 0;
  return Math.max(0, Math.floor(((now - start) / 1000) * FPS));
}
