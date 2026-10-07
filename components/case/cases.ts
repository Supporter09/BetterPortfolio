import type { CaseStudy, MediaRef, ResearchEntry, WorkEntry, WorkStatus } from '@/content/types';
import { RESEARCH } from '@/content/research';
import { WORK } from '@/content/work';

export type CaseKind = 'research' | 'work';

/** One `/work/<slug>` page: a research entry, or a work entry that carries a `caseStudy`. */
export interface CaseRecord {
  kind: CaseKind;
  slug: string;
  title: string;
  /** Mono line above the title (research `kicker`; work `org · role · period`). */
  kicker: string;
  /** Italic line under the title (research `subtitle`; work `award`). */
  subtitle?: string;
  summary: string;
  status?: WorkStatus;
  startedAt?: string;
  takes?: number;
  caseStudy: CaseStudy;
  media: MediaRef;
  /** Where the entry lives on the film. */
  backHref: '/#pyvulds' | '/#reel';
  backLabel: string;
  research?: ResearchEntry;
  work?: WorkEntry;
}

export interface Chapter {
  id: string;
  label: string;
}

/** The 7-part case pattern (master §4.1), in reading order; ids double as anchors. */
export const CHAPTERS: readonly Chapter[] = [
  { id: 'problem', label: 'Problem' },
  { id: 'constraints', label: 'Constraints' },
  { id: 'system-design', label: 'System Design' },
  { id: 'contribution', label: 'Contribution' },
  { id: 'evidence', label: 'Evidence' },
  { id: 'limitations', label: 'Limitations' },
  { id: 'next-step', label: 'Next Step' },
];

/** Chapter body: the problem is a paragraph, everything else a list (possibly empty, e.g. `next`). */
export function chapterBody(study: CaseStudy, id: string): string | string[] {
  switch (id) {
    case 'problem':
      return study.problem;
    case 'constraints':
      return study.constraints;
    case 'system-design':
      return study.design;
    case 'contribution':
      return study.contribution;
    case 'evidence':
      return study.evidence;
    case 'limitations':
      return study.limitations;
    case 'next-step':
      return study.next;
    default:
      return [];
  }
}

function fromResearch(entry: ResearchEntry): CaseRecord {
  return {
    kind: 'research',
    slug: entry.slug,
    title: entry.title,
    kicker: entry.kicker,
    subtitle: entry.subtitle,
    summary: entry.summary,
    status: entry.status,
    startedAt: entry.startedAt,
    takes: entry.takes,
    caseStudy: entry.caseStudy,
    media: entry.media,
    backHref: '/#pyvulds',
    backLabel: 'Back to the research collection',
    research: entry,
  };
}

function fromWork(entry: WorkEntry, caseStudy: CaseStudy): CaseRecord {
  return {
    kind: 'work',
    slug: entry.slug,
    title: entry.title,
    kicker: [entry.org, entry.role, entry.period].filter(Boolean).join(' · '),
    subtitle: entry.award,
    summary: entry.summary,
    status: entry.status,
    caseStudy,
    media: entry.media,
    backHref: '/#reel',
    backLabel: 'Back to the reel',
    work: entry,
  };
}

/** Every static case page, in film order: research first, then reel entries with a case study. */
export const CASES: readonly CaseRecord[] = [
  ...RESEARCH.map(fromResearch),
  ...WORK.flatMap((entry) => (entry.caseStudy ? [fromWork(entry, entry.caseStudy)] : [])),
];

export function getCase(slug: string): CaseRecord | undefined {
  return CASES.find((record) => record.slug === slug);
}

/** Linear prev/next through the case list (no wrap-around). */
export function getCaseNeighbors(slug: string): { prev?: CaseRecord; next?: CaseRecord } {
  const index = CASES.findIndex((record) => record.slug === slug);
  if (index === -1) return {};
  return { prev: CASES[index - 1], next: CASES[index + 1] };
}
