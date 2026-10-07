import type { SceneId, SceneMeta } from './types';

// source: master §4.2 (scene contract); order, titles and sub-labels from refinement round 2 §5.
// Voice: friendly, lightly humorous, storytelling — facts stay honest (mai-van-nhat-minh.md).

export const SCENES: SceneMeta[] = [
  { id: 'cold-open', number: '00', slate: 'COLD OPEN', title: 'Boot', grade: 'neutral' },
  { id: 'opening', number: '01', slate: 'OPENING SHOT', title: "Hi, I'm Minh.", grade: 'mixed' },
  { id: 'origin', number: '02', slate: 'ORIGIN', title: 'A bit about me', grade: 'amber' },
  { id: 'log', number: '03', slate: 'TIMELINE', title: 'The story so far', grade: 'teal' },
  { id: 'pyvulds', number: '04', slate: 'FEATURE PRESENTATION', title: 'Research', grade: 'teal' },
  { id: 'next-scene', number: '05', slate: 'NEXT SCENE', title: "What I'm chasing next", grade: 'mixed' },
  { id: 'reel', number: '06', slate: 'THE REEL', title: "Things I've shipped", grade: 'mixed' },
  { id: 'field-notes', number: '07', slate: 'BEHIND THE LENS', title: "When I'm not at a terminal", grade: 'amber' },
  { id: 'credits', number: '08', slate: 'ACHIEVEMENTS', title: 'Achievements', grade: 'neutral' },
  { id: 'closing', number: '09', slate: 'END OF RUNTIME', title: 'Roll credits? Not yet.', grade: 'mixed' },
];

export function getScene(id: SceneId): SceneMeta {
  const scene = SCENES.find((s) => s.id === id);
  if (!scene) throw new Error(`Unknown scene: ${id}`);
  return scene;
}

/** Cold-open boot log (02a Scene 00). Only true statements about the site, or obvious jokes — no fake metrics. */
export const BOOT_LOG: { status: 'OK' | '..'; text: string }[] = [
  { status: 'OK', text: 'coffee.sys: found' },
  { status: 'OK', text: 'cat.gao: asleep' },
  { status: 'OK', text: 'camera.osmo: charged' },
  { status: 'OK', text: 'letterbox: 2.39:1' },
  { status: '..', text: `scenes: ${SCENES.length} loaded` },
  { status: 'OK', text: 'slate.clap: SCENE 01 LOADED' },
];

/**
 * Per-scene sub-labels and fixed UI copy (round 2 §5 table, verbatim). Scene titles live in `SCENES`;
 * `heading` mirrors them so scenes can keep using `SCENE_COPY.<scene>.heading`.
 */
export const SCENE_COPY = {
  origin: {
    heading: 'A bit about me',
    subLabel: 'Breaking systems to make them resilient, explaining bug reports to my cat, and filming the good parts.',
  },
  log: {
    heading: 'The story so far',
    subLabel: "Where I've been, one bar at a time. Open a row.",
  },
  pyvulds: {
    heading: 'Research',
    /** Typed in after the heading deletes itself (round 2 §4). */
    quote: 'Every system has a hole.',
    quoteTail: "I'd rather be the one who finds it.",
    subLabel: "Every system has a hole. I'd rather be the one who finds it.",
    limitationsHeading: 'Limitations',
    resultsCaption: 'PyVulDS — scoped results',
  },
  nextScene: {
    heading: "What I'm chasing next",
    subLabel: 'Questions I want to spend the next years on.',
  },
  reel: {
    heading: "Things I've shipped",
    subLabel: 'Production work and hackathon builds.',
    archiveTitle: 'Archive · 2020–2022',
    archiveList: 'Vietcode · VYA · AnimalShelter · HRFO',
    sreFootnote: 'Outcomes and technologies only. Internal details withheld.',
  },
  fieldNotes: {
    heading: "When I'm not at a terminal",
    subLabel: "I'm usually holding a camera—saving the moments my memory will definitely misplace.",
    touchHint: 'swipe · tap to develop',
    linkPending: 'Link coming soon',
  },
  credits: {
    heading: 'Achievements',
    subLabel: 'Shiny things, honestly earned.',
  },
  closing: {
    heading: 'Roll credits? Not yet.',
    subLabel: 'Say hi on LinkedIn — I reply.',
    ctaPrimary: 'Say hi on LinkedIn',
    ctaSecondary: 'GitHub',
    endCard: 'END OF RUNTIME',
    backToTop: 'Back to the top',
  },
} as const;
