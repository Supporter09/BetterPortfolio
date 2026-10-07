import type { LinkItem } from './types';

// source: mai-van-nhat-minh.md §2–§3 (copy bank, condensed), §12 (CTAs); master §4.3, §10–§11 (owner decisions).
// Copy diet (refine round 1): `[[keyword]]` = pixel highlight, `[[amber:x]]` = human/field tone, `*x*` = italic.
// Round 2 voice: friendly, lightly humorous, storytelling; facts only. Rendered through `<Rich>`;
// limits: subheadline = round 2 §5 opening sub-label, shortBio ≤ 35 words / ≤ 3 highlights, extendedAbout = 3 one-line beats.

export interface Cta {
  label: string;
  href: string;
  external?: boolean;
}

export interface SiteContent {
  name: string;
  monogram: string;
  roles: string;
  title: string;
  description: string;
  headline: string;
  subheadline: string;
  shortBio: string;
  extendedAbout: string[];
  narrativeAnchor: string;
  location: string;
  links: LinkItem[];
  ctas: {
    opening: { primary: Cta; secondary: Cta };
    pyvulds: Cta;
    reel: Cta;
    fieldNotes: Cta;
    /** Closing scene (09) primary CTA → LinkedIn. Secondary is `links` GitHub. */
    nextScene: Cta;
  };
}

const LINKEDIN: LinkItem = {
  label: 'LinkedIn',
  href: 'https://www.linkedin.com/in/charlie1807/',
  kind: 'engineering',
  external: true,
};

const GITHUB: LinkItem = {
  label: 'GitHub',
  href: 'https://github.com/Supporter09',
  kind: 'engineering',
  external: true,
};

// Owner adds the real channel URL later; render as a disabled "Link coming soon".
const FILM_CHANNEL: LinkItem = {
  label: 'Film channel',
  href: '#',
  kind: 'film',
  external: true,
  placeholder: true,
};

export const SITE: SiteContent = {
  name: 'Mai Van Nhat Minh',
  monogram: 'NM',
  roles: 'Cyber Security Undergraduate · Software Engineer · DevOps/SRE Practitioner · Security Research Builder',
  title: 'Mai Van Nhat Minh — Security Research Builder · DevOps/SRE',
  description:
    'Cyber Security undergraduate at HUST with hands-on software engineering and DevOps/SRE experience, building production tooling, cloud-native automation, and evidence-oriented security systems.',
  // Plain (no markup): reused as the metadata description in app/layout.tsx.
  headline: 'Building secure, reliable systems across software, cloud infrastructure, and applied security research.',
  // Hero line = round 2 §5 opening sub-label (13 words).
  subheadline: 'I keep [[systems up]], poke [[holes in them]] on purpose, and [[amber:film the rest]].',
  // Origin paragraph — 33 words, 3 highlights (≤ 3 per paragraph).
  shortBio:
    "Cyber Security undergraduate at HUST. I've moved services to [[AWS]], wired up CI/CD and kept [[Kubernetes]] honest at Selfomy and FPT Smart Cloud. These days I'm building [[PyVulDS]], a Python vulnerability triage tool that shows its evidence.",
  // Three one-line beats: production work · research · direction (mai-van-nhat-minh.md §3.4, §6.1, §9). ≤ 3 highlights each.
  extendedAbout: [
    'Day job so far — [[AWS]] migration, CI/CD, server hardening, [[ArgoCD]] delivery and [[SonarQube]] DevSecOps at Selfomy and FPT Smart Cloud.',
    'Side quest — [[PyVulDS]]: learned scores, bounded [[Deep-AST]] paths, [[sink-aware]] evidence. Scoped wins, honest limits.',
    'Up next — [[network security]], [[distributed systems]] and safe [[agentic AI]]. Still questions, not papers.',
  ],
  // The origin scene's single italic accent lives here.
  narrativeAnchor:
    "I care about what's actually *in focus* — in cinematography, the subject; in production systems, reliability; in security, verifiable evidence.",
  location: 'VIETNAM',
  links: [LINKEDIN, GITHUB, FILM_CHANNEL],
  ctas: {
    opening: {
      primary: { label: 'See the work', href: '#log' },
      secondary: { label: 'Watch the reel', href: '#field-notes' },
    },
    pyvulds: { label: 'Read the case study', href: '/work/pyvulds' },
    reel: { label: 'Browse the archive', href: '/archive' },
    fieldNotes: { label: 'See all films', href: '/films' },
    // Closing-scene CTA → owner-approved primary contact channel (LinkedIn, master §10.1).
    nextScene: {
      label: 'Say hi on LinkedIn',
      href: LINKEDIN.href,
      external: true,
    },
  },
};
