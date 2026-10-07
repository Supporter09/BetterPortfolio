import { MEDIA } from './media';
import type { Experience } from './types';

/**
 * Scene 03 — Timeline (refine round 1). One row per engagement, newest first.
 * Dates are `YYYY-MM` or `YYYY` (awards); no `end` = still running.
 * FPT Smart Cloud: outcomes and technologies only — no internal architecture, procedures,
 * customer information, prompts, or identifiers (mai-van-nhat-minh.md §5, master §7).
 * Contribution text uses `[[keyword]]` highlights (rendered by `<Rich>`).
 */

/** Year ruler bounds for the timeline. */
export const TIMELINE_RANGE = { start: 2022, end: 2027 } as const;

/** Org-mark chip overrides: `orgShort` → 2–4 letter pixel mark when `orgShort` is too long. */
export const ORG_MARKS: Record<string, string> = {
  KAIST: 'KST',
  SOICT: 'SSH',
};

export const EXPERIENCE: Experience[] = [
  {
    id: 'kaist-gpw-2026',
    kind: 'field',
    org: 'KAIST School of Computing',
    orgShort: 'KAIST',
    role: 'Global Preview Week 2026',
    location: 'Daejeon & Seoul',
    start: '2026-09',
    end: '2026-09',
    status: 'released',
    summary: 'One-week in-person program at KAIST School of Computing (Sep 6–13, 2026).',
    // source: mai-van-nhat-minh.md §2 (theme 4), §7
    contributions: [
      { text: 'Completed 1-week in-person program in [[amber:Global Preview Week 2026]] across Daejeon and Seoul (Sep 6–13, 2026).' },
    ],
  },
  {
    id: 'pyvulds',
    kind: 'research',
    org: 'Hanoi University of Science and Technology',
    orgShort: 'HUST',
    role: 'Course research project',
    location: 'Hanoi',
    start: '2026-03',
    end: '2026-06',
    status: 'released',
    summary: 'PyVulDS — path-aware vulnerability triage for Python repositories (3 months).',
    // source: mai-van-nhat-minh.md §6.1
    contributions: [
      {
        text: 'Staged triage: learned local scoring, bounded [[Deep-AST]] paths, sink-aware evidence filtering.',
        media: MEDIA.research.pyvulds,
      },
      { text: 'Completed in 3 months as an undergraduate research project at HUST.' },
    ],
    stack: ['Python', 'Deep-AST', 'Static analysis', 'ML for security'],
    href: '/work/pyvulds',
  },
  {
    id: 'fpt-smart-cloud',
    kind: 'work',
    org: 'FPT Smart Cloud',
    orgShort: 'FPT',
    role: 'DevOps/SRE Intern',
    location: 'Onsite',
    start: '2025-06',
    end: '2025-12',
    status: 'released',
    summary: 'SRE release automation and DevSecOps tooling. Outcomes only.',
    // source: mai-van-nhat-minh.md §5 FPT Smart Cloud (outcome level only).
    contributions: [
      {
        text: 'Automated the SRE release-management ticket workflow — [[70% fewer]] manual operational steps.',
        media: MEDIA.work['sre-release-automation'],
      },
      { text: 'Deployed [[ArgoCD]] notifications for real-time Kubernetes sync status.' },
      { text: 'Set up and operated centralized [[SonarQube]] for code-quality and security checks.' },
      { text: 'Built an internal [[AI assistant]] for SRE process and operations questions.' },
    ],
    stack: ['Kubernetes', 'ArgoCD', 'SonarQube', 'CI/CD'],
    // source: mai-van-nhat-minh.md §5 FPT Smart Cloud; master §7 (verified, odometer allowed).
    metric: {
      value: '70%',
      numeric: 70,
      suffix: '%',
      label: 'Fewer manual operational steps',
      scope: 'FPT Smart Cloud, 2025. Reduction in manual operational steps for the SRE release-management ticket workflow.',
      claim: 'verified',
      odometer: true,
    },
    href: '/work/sre-release-automation',
  },
  {
    id: 'selfomy',
    kind: 'work',
    org: 'Selfomy',
    orgShort: 'SLF',
    role: 'Software Engineer',
    location: 'Remote',
    start: '2024-07',
    end: '2026-08',
    status: 'released',
    summary: 'Cloud migration, CI/CD, server hardening, Laravel features.',
    // source: mai-van-nhat-minh.md §5 Selfomy
    contributions: [
      { text: 'Migrated a service from a virtual machine to [[AWS]].' },
      { text: '[[CI/CD]] with GitHub Actions; BugSnag for production error monitoring.' },
      { text: 'Hardened servers with firewall controls and [[CrowdSec]].' },
      { text: '[[Laravel]] product features with unit and feature tests.' },
    ],
    stack: ['Laravel', 'AWS', 'GitHub Actions', 'BugSnag', 'CrowdSec'],
    // source: mai-van-nhat-minh.md §5 Selfomy (CV-reported); master §7 → "reported", no odometer.
    metric: {
      value: '30%',
      label: 'Reported reduction in production errors',
      scope: 'Selfomy. CV-reported; measurement scope not yet documented.',
      claim: 'reported',
      odometer: false,
    },
  },
  {
    id: 'scic-2024',
    kind: 'award',
    org: 'Student Creative Ideas Challenge 2024',
    orgShort: 'SCIC',
    role: 'Third Place',
    location: 'Vietnam',
    start: '2024',
    summary: 'Third Place, Student Creative Ideas Challenge 2024.',
    // source: mai-van-nhat-minh.md §7
    contributions: [{ text: '[[amber:Third Place]] — Student Creative Ideas Challenge 2024.' }],
  },
  {
    id: 'soict-2023',
    kind: 'award',
    org: 'Samsung SOICT Hackathon 2023',
    orgShort: 'SOICT',
    role: 'Frontend Developer · Fourth Place, Track',
    location: 'Hanoi',
    start: '2023',
    summary: 'HUST Smart Assistant — real-time student-services chatbot.',
    // source: mai-van-nhat-minh.md §6.2
    contributions: [
      {
        text: '[[amber:Fourth Place, Track]] — HUST Smart Assistant, a real-time chatbot on the OpenAI API and WebSockets.',
        media: MEDIA.work['hust-smart-assistant'],
      },
      { text: 'Reported [[90%]] query accuracy (CV-reported; evaluation method not recorded).' },
    ],
    stack: ['OpenAI API', 'WebSockets'],
    // source: mai-van-nhat-minh.md §6.2 (CV-reported, evaluation method not recorded); master §7 → "reported", no odometer.
    metric: {
      value: '90%',
      label: 'Reported query accuracy',
      scope: 'HUST Smart Assistant. CV-reported; evaluation method not recorded.',
      claim: 'reported',
      odometer: false,
    },
    href: '/work/hust-smart-assistant',
  },
  {
    id: 'iai-2023',
    kind: 'award',
    org: 'IAI Hackathon 2023',
    orgShort: 'IAI',
    role: 'Frontend Developer · Second Prize',
    location: 'Vietnam',
    start: '2023',
    summary: 'Testeria — RPG-style educational game platform.',
    // source: mai-van-nhat-minh.md §6.3
    contributions: [
      {
        text: '[[amber:Second Prize]] — Testeria, an RPG-style learning platform with Phaser and Next.js.',
        media: MEDIA.work.testeria,
      },
      { text: 'WebSockets supported [[50+]] concurrent students; deploys via GitHub Actions.' },
    ],
    stack: ['Phaser', 'Next.js', 'WebSockets', 'GitHub Actions'],
    // source: mai-van-nhat-minh.md §6.3 ("more than 50 concurrent students"); no odometer (02a §9).
    metric: {
      value: '50+',
      numeric: 50,
      suffix: '+',
      label: 'Concurrent students over WebSockets',
      scope: 'Testeria, IAI Hackathon 2023.',
      claim: 'verified',
      odometer: false,
    },
    href: '/work/testeria',
  },
  {
    id: 'hust',
    kind: 'education',
    org: 'Hanoi University of Science and Technology',
    orgShort: 'HUST',
    role: 'Cyber Security undergraduate',
    location: 'Hanoi',
    start: '2023-07',
    summary: 'Cyber Security programme, School of ICT. Three scholarships.',
    // source: mai-van-nhat-minh.md §4, §7
    contributions: [
      { text: 'Four-year [[Cyber Security]] programme, School of Information and Communication Technology.' },
      { text: '[[3]] Academic Achievement Scholarships — semesters 2024.1, 2024.2, 2025.1.' },
    ],
    // source: mai-van-nhat-minh.md §4, §7 (three scholarships); master §7 (odometer allowed).
    metric: {
      value: '3',
      numeric: 3,
      label: 'Academic Achievement Scholarships',
      scope: 'HUST, semesters 2024.1, 2024.2, and 2025.1.',
      claim: 'verified',
      odometer: true,
    },
  },
  {
    id: 'fbi-2022',
    kind: 'award',
    org: 'Future Blue Innovation 2022',
    orgShort: 'FBI',
    role: 'Second Prize',
    location: 'Vietnam',
    start: '2022',
    summary: 'AnimalShelter — web project on protecting endangered animals.',
    // source: mai-van-nhat-minh.md §6.4; old-site demo linked from content/archive.ts.
    contributions: [
      { text: '[[amber:Second Prize]] — *AnimalShelter*, a [[React]] web project about endangered animals.', media: MEDIA.work.animalshelter },
    ],
    stack: ['React'],
    href: 'https://www.animalshelter.tech/',
  },
];
