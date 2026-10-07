import type { ArchiveEntry } from './types';

/**
 * `/archive` — 2020–2022 work from the old portfolio (docs/portfolio-plan/research/old-portfolio-audit.md §2).
 * Compact list, no highlight; summaries ≤ 20 words. Links are the public demos listed on the old site; some may no longer load.
 */
export const ARCHIVE: ArchiveEntry[] = [
  {
    title: 'AnimalShelter',
    role: 'Award entry · Second Prize, Future Blue Innovation 2022',
    year: '2022',
    summary: 'React web project on protecting endangered animals, with species information for Vietnamese readers.',
    href: 'https://www.animalshelter.tech/',
  },
  {
    title: 'Vietcode',
    role: 'Product Manager',
    year: '2021',
    summary: "Built the organization's landing page; market research and validation for new and existing features.",
  },
  {
    title: 'Vietcode website',
    role: 'Frontend Developer',
    year: '2020',
    summary: 'Non-profit site for Vietnamese students in tech. ReactJS, Material UI, Firebase; reviewed production pull requests.',
    href: 'https://vietcodenew.netlify.app/',
  },
  {
    title: 'Vietnam Youth Alliance',
    role: 'Backend Developer',
    year: '2020',
    summary: 'Backend work with the front-end team: troubleshooting data and processes, handling user and site data.',
  },
  {
    title: 'HRFO website',
    role: 'Web developer',
    // The old site does not record the build year (HRFO itself was founded in June 2020).
    year: 'n.d.',
    summary: 'Site for a 2020 non-profit sharing perspectives on gender equality, freedom, and children’s rights.',
    href: 'https://hrfowdorg.netlify.app/',
  },
];
