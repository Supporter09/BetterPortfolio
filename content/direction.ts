import type { DirectionCard } from './types';

/**
 * Scene 05 — Next Scene (round 2 §5). Planned directions only: every card is PRE-PRODUCTION and must
 * never read as completed, published, or accepted work (mai-van-nhat-minh.md §9, §13).
 * `summary` is a ≤ 4-word tag (copy diet); `sprite` is a 16×16 key of `SPRITES` (content/sprites.ts).
 * Cards are the whole scene: no goal block, no badge, no CTA — the `note` line keeps the claim honest.
 */
// source: mai-van-nhat-minh.md §9 "Planned Research Direction" (four candidate themes).
export const DIRECTION: DirectionCard[] = [
  {
    title: 'Safe agentic network defense',
    summary: 'Reviewable autonomous defense',
    status: 'pre-production',
    sprite: 'dir-shield-net',
  },
  {
    title: 'Protocol fuzzing',
    summary: 'Faults in protocol implementations',
    status: 'pre-production',
    sprite: 'dir-fuzz',
  },
  {
    title: 'Adversarial robustness of security agents',
    summary: 'Agents under adversarial input',
    status: 'pre-production',
    sprite: 'dir-agent',
  },
  {
    title: 'Verification of automated remediation',
    summary: 'Check fixes before trust',
    status: 'pre-production',
    sprite: 'dir-verify',
  },
];

export const DIRECTION_COPY = {
  /** Scene sub-label (round 2 §5). */
  intro: 'Questions I want to spend the next years on.',
  /** Single small line under the card grid. */
  note: 'Planning, not publications.',
} as const;
