import { MEDIA } from './media';
import type { FilmEntry } from './types';

/**
 * Scene 06 — Field Notes and `/films` (02b Scene 06). Film stills and verified video link (A2/A3/A5).
 * City-level locations only, no GPS (master §10.4). Entries without published video links render
 * with a disabled "Link coming soon".
 */
export const FILMS: FilmEntry[] = [
  {
    id: 'kaist-gpw-2026-daejeon',
    frame: '00A',
    title: 'KAIST SoC Global Preview Week 2026 — Daejeon',
    city: 'Daejeon',
    country: 'KR',
    year: '2026',
    url: '#',
    placeholder: true,
    media: MEDIA.films['00A'],
    note: 'KAIST main campus gate in Daejeon.',
  },
  {
    id: 'kaist-gpw-2026-hust-return',
    frame: '01A',
    title: 'Return to HUST after KAIST Global Preview Week',
    city: 'Hanoi',
    country: 'VN',
    year: '2026',
    url: '#',
    placeholder: true,
    media: MEDIA.films['01A'],
    note: 'Returning to HUST in Hanoi after KAIST Global Preview Week.',
  },
  {
    id: 'kaist-gpw-2026-korean-barbecue',
    frame: '02A',
    title: 'Korean Barbecue with Friends during KAIST Trip',
    city: 'South Korea',
    country: '',
    year: '2026',
    url: '#',
    placeholder: true,
    media: MEDIA.films['02A'],
    note: 'Korean barbecue (grilled meat) with friends during the KAIST trip in South Korea.',
  },
  {
    id: 'hoi-an-cu-lao-cham',
    frame: '03A',
    title: 'Hoi An & Cu Lao Cham Summer Trip',
    city: 'Hoi An',
    country: 'VN',
    year: '',
    url: 'https://youtu.be/G3sJAkj3-Bg',
    placeholder: false,
    media: MEDIA.films['03A'],
    note: 'Summer trip with friends to Hoi An and Cu Lao Cham.',
  },
];

/** Frames that form the separate KAIST beat in Scene 06. */
export const KAIST_FRAME_IDS: readonly string[] = [
  'kaist-gpw-2026-daejeon',
  'kaist-gpw-2026-hust-return',
  'kaist-gpw-2026-korean-barbecue',
];

// source: mai-van-nhat-minh.md §7 (KAIST SoC GPW 2026, Daejeon and Seoul), §9 (master's goal); copy per 02b Scene 06.
export const KAIST_BEAT = {
  label: 'KAIST SoC GLOBAL PREVIEW WEEK 2026 · DAEJEON → SEOUL → HANOI',
  caption:
    'Completed the in-person KAIST School of Computing Global Preview Week 2026 in Daejeon and Seoul before returning to HUST in Hanoi.',
  bridge: 'Labs, campus walks, and shared meals with friends — the trip that made the research chapter above feel real.',
} as const;
