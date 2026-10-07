import { MEDIA } from './media';
import type { WorkEntry } from './types';

/**
 * Scene 05 — The Reel (02b Scene 05), in reel order. `/work/<slug>` renders entries that have a `caseStudy`.
 * FPT Smart Cloud: outcomes and technologies only — no internal architecture, procedures,
 * customer information, prompts, or identifiers (mai-van-nhat-minh.md §5, master §7).
 */
export const WORK: WorkEntry[] = [
  {
    slug: 'sre-release-automation',
    title: 'SRE Release Automation',
    org: 'FPT Smart Cloud',
    role: 'DevOps/SRE Intern',
    period: 'Jun – Dec 2025',
    status: 'released',
    // Summaries ≤ 20 words; `[[x]]` highlights rendered by <Rich>.
    summary:
      '[[Release-management automation]] and [[DevSecOps]] tooling from an onsite DevOps/SRE internship. Outcomes and technologies only.',
    // source: mai-van-nhat-minh.md §5 FPT Smart Cloud
    points: [
      'Automated the SRE release-management ticket workflow — 70% fewer manual operational steps.',
      'Deployed ArgoCD notifications for real-time Kubernetes sync status.',
      'Set up and operated centralized SonarQube for code-quality and security checks.',
      'Built an internal AI assistant for SRE process and operations questions.',
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
    // source: mai-van-nhat-minh.md §5 FPT Smart Cloud (outcome level only).
    caseStudy: {
      problem:
        'Reduce the manual operational steps in SRE release-management tickets, and add Kubernetes sync status and centralized code-quality and security checks to the existing CI/CD and DevSecOps workflow.',
      constraints: [
        'Onsite internship, June – December 2025.',
        'Publication boundary: outcomes and technologies only. Internal architecture, procedures, customer information, prompts, and identifiers are withheld.',
      ],
      design: [
        'An automated workflow for SRE release-management tickets.',
        'ArgoCD notifications reporting real-time Kubernetes synchronization status in the CI/CD workflow.',
        'Centralized SonarQube infrastructure for code-quality and security checks in a DevSecOps workflow.',
        'An internal AI assistant for answering SRE process and operations questions.',
      ],
      contribution: [
        'Built the automated SRE release-management ticket workflow.',
        'Deployed ArgoCD notifications for Kubernetes synchronization status.',
        'Set up and operated the centralized SonarQube infrastructure.',
        'Developed the internal AI assistant for SRE process and operations questions.',
      ],
      evidence: [
        'The automated release-management ticket workflow reduced manual operational steps by 70%.',
        'Positive supervisor feedback for work discipline, task completion, practical solutions, and development potential.',
      ],
      limitations: [
        'Outcome-level write-up: the system design and measurement details are internal and not published.',
      ],
      next: [],
    },
    media: MEDIA.work['sre-release-automation'],
  },
  {
    slug: 'testeria',
    title: 'Testeria',
    org: 'IAI Hackathon 2023',
    role: 'Frontend Developer',
    period: '2023',
    status: 'released',
    award: 'Second Prize — IAI Hackathon 2023',
    summary:
      '[[RPG-style]] educational game platform. [[WebSockets]] for [[50+]] concurrent students; deploys via GitHub Actions.',
    // source: mai-van-nhat-minh.md §6.3
    points: [
      'Built an RPG-style educational game platform with Phaser and Next.js.',
      'Used WebSockets to support more than 50 concurrent students.',
      'Automated deployment with GitHub Actions.',
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
    // source: mai-van-nhat-minh.md §6.3
    caseStudy: {
      problem: 'Build an RPG-style educational game platform within a hackathon.',
      constraints: [
        'Hackathon timeline.',
        'Real-time play for more than 50 students at once.',
      ],
      design: [
        'Game client built with Phaser inside a Next.js application.',
        'WebSockets for real-time, multi-student sessions.',
        'Deployment automated with GitHub Actions.',
      ],
      contribution: [
        'Frontend Developer: built the game platform with Phaser and Next.js.',
      ],
      evidence: [
        'Second Prize at IAI Hackathon 2023.',
        'WebSockets supported more than 50 concurrent students.',
      ],
      limitations: ['Hackathon build. Screenshots and public links are pending.'],
      next: [],
    },
    media: MEDIA.work.testeria,
  },
  {
    slug: 'hust-smart-assistant',
    title: 'HUST Smart Assistant',
    org: 'Samsung SOICT Hackathon 2023',
    role: 'Frontend Developer',
    period: '2023',
    status: 'released',
    award: 'Fourth Place, Track — Samsung SOICT Hackathon 2023',
    summary: 'Real-time [[student-services chatbot]] with personalized recommendations. Reported [[90%]] query accuracy.',
    // source: mai-van-nhat-minh.md §6.2
    points: [
      'Built a real-time student-services chatbot using the OpenAI API and WebSockets.',
      'Implemented personalized recommendations for student needs.',
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
    // source: mai-van-nhat-minh.md §6.2
    caseStudy: {
      problem: 'Give students a real-time assistant for student-services questions during a hackathon.',
      constraints: ['Hackathon timeline.', 'Answers delivered in real time.'],
      design: [
        'Chatbot built on the OpenAI API.',
        'WebSockets for real-time conversation.',
        'Personalized recommendations for student needs.',
      ],
      contribution: [
        'Frontend Developer: built the real-time chatbot experience and personalized recommendations.',
      ],
      evidence: [
        'Fourth Place in its track at Samsung SOICT Hackathon 2023.',
        'Reported 90% query accuracy (CV-reported; evaluation method not recorded).',
      ],
      limitations: [
        'The 90% figure stays labelled "reported" until the evaluation method is documented.',
        'Hackathon build. Screenshots and public links are pending.',
      ],
      next: [],
    },
    media: MEDIA.work['hust-smart-assistant'],
  },
  {
    // Award entry only (mai-van-nhat-minh.md §6.4): no case study until supporting details exist.
    // Old-site demo (2022): https://www.animalshelter.tech/ — linked from `content/archive.ts`.
    slug: 'animalshelter',
    title: 'AnimalShelter',
    org: 'Future Blue Innovation 2022',
    role: 'Award entry',
    period: '2022',
    award: 'Second Prize — Future Blue Innovation 2022',
    summary: 'Web project on [[protecting endangered animals]] for Vietnamese readers.',
    points: ['Second Prize — Future Blue Innovation 2022.'],
    stack: ['React'],
    media: MEDIA.work.animalshelter,
  },
];
