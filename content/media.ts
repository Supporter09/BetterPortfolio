import type { MediaRef } from './types';

/**
 * Every media reference on the site lives here so visual assets and evidence
 * are registered in one place (master §11.4). Asset codes (A1, A2, …) follow master §8.
 *
 * Real imagery uses `kind: 'image'` with an optimized local `src`.
 * Abstract diagrams or pending captures use `kind: 'placeholder'` (CSS/SVG footage layers).
 */

/** Intrinsic size of `public/media/portrait.png` (owner's photo from the old portfolio repo). */
export const PORTRAIT_SIZE = { width: 2561, height: 3840 } as const;

/** Kept for case pages / OG fallbacks; the opening scene is a pixel universe and no longer renders it. */
const hero: MediaRef = {
  kind: 'placeholder',
  alt: 'Graded footage frame: a slow, wide establishing shot.',
  label: 'A1 · HERO LOOP',
  tone: 'teal',
  aspect: '2.39/1',
};

const portrait: MediaRef = {
  kind: 'image',
  src: '/media/portrait.png',
  alt: 'Portrait of Mai Van Nhat Minh in a dark collared jacket, seated indoors.',
  label: 'A4 · PORTRAIT',
  tone: 'amber',
  aspect: `${PORTRAIT_SIZE.width}/${PORTRAIT_SIZE.height}`,
};

/** Film stills (A2/A5), keyed by frame code in `content/films.ts`. */
const films = {
  '00A': {
    kind: 'image',
    src: '/media/films/daejeon-gate.jpg',
    alt: 'KAIST main campus gate in Daejeon.',
    label: 'A2 · 00A · DAEJEON',
    tone: 'amber',
    aspect: '4/3',
  },
  '01A': {
    kind: 'image',
    src: '/media/films/hust-return.jpg',
    alt: 'Returning to HUST in Hanoi after KAIST Global Preview Week.',
    label: 'A2 · 01A · HANOI',
    tone: 'amber',
    aspect: '4/3',
  },
  '02A': {
    kind: 'image',
    src: '/media/films/korean-barbecue.jpg',
    alt: 'Korean barbecue (grilled meat) with friends during the KAIST trip in South Korea.',
    label: 'A2 · 02A · SOUTH KOREA',
    tone: 'amber',
    aspect: '4/3',
  },
  '03A': {
    kind: 'image',
    src: '/media/films/hoi-an-cu-lao-cham-thumb.jpg',
    alt: 'Travel recap poster for the Hoi An and Cu Lao Cham summer trip.',
    label: 'A2 · 03A · TRIP',
    tone: 'amber',
    aspect: '16/9',
  },
} satisfies Record<string, MediaRef>;

/** Work media (A7). The SRE card must stay an abstract diagram: no captures of internal systems. */
const work = {
  'sre-release-automation': {
    kind: 'placeholder',
    alt: 'Abstract release-workflow plate. Internal details withheld.',
    label: 'A7 · SRE WORKFLOW (ABSTRACT)',
    tone: 'teal',
    aspect: '16/10',
  },
  testeria: {
    kind: 'image',
    src: '/media/work/testeria.jpg',
    alt: 'Screenshot of the Testeria RPG-style learning platform interface.',
    label: 'A7 · TESTERIA',
    tone: 'teal',
    aspect: '1224/716',
  },
  'hust-smart-assistant': {
    kind: 'image',
    src: '/media/work/hust-smart-assistant.jpg',
    alt: 'Screenshot of the HUST Smart Assistant real-time chatbot interface.',
    label: 'A7 · HUST SMART ASSISTANT',
    tone: 'teal',
    aspect: '1920/1079',
  },
  // Award entry: rendered as production hero visual or typographic plate fallback.
  animalshelter: {
    kind: 'image',
    src: '/media/work/animalshelter.png',
    alt: 'Production interface of AnimalShelter endangered animal web application.',
    label: 'AWARD ENTRY · ANIMALSHELTER',
    tone: 'amber',
    aspect: '16/10',
  },
} satisfies Record<string, MediaRef>;

/**
 * Research thumbnails. The PyVulDS pipeline diagram (A6) is drawn in code (inline SVG),
 * so this ref is only a fallback thumbnail for index lists / OG — no asset file needed.
 */
const research = {
  pyvulds: {
    kind: 'placeholder',
    alt: 'PyVulDS pipeline diagram, drawn in code on the case-study page.',
    label: 'A6 · PYVULDS PIPELINE (DRAWN IN CODE)',
    tone: 'teal',
    aspect: '16/9',
  },
} satisfies Record<string, MediaRef>;

/** Achievement and credential evidence plates. */
const evidence = {
  'hust-smart-assistant': {
    kind: 'image',
    src: '/media/evidence/hust-smart-assistant.jpg',
    alt: 'HUST Smart Assistant real-time chatbot interface plate for Samsung SOICT Hackathon 2023.',
    label: 'EVIDENCE · HUST SMART ASSISTANT',
    tone: 'teal',
    aspect: '1920/1079',
  },
  'iai-hackathon': {
    kind: 'image',
    src: '/media/evidence/iai-hackathon.jpg',
    alt: 'Certificate of Second Prize at IAI Hackathon 2023 for Testeria.',
    label: 'EVIDENCE · IAI HACKATHON 2023',
    tone: 'amber',
    aspect: '4/3',
  },
  'future-blue': {
    kind: 'image',
    src: '/media/evidence/future-blue.jpg',
    alt: 'Certificate of Second Prize at Future Blue Innovation 2022 for AnimalShelter.',
    label: 'EVIDENCE · FUTURE BLUE INNOVATION 2022',
    tone: 'amber',
    aspect: '1920/1357',
  },
} satisfies Record<string, MediaRef>;

export const MEDIA = {
  hero,
  portrait,
  films,
  work,
  research,
  evidence,
} as const;
