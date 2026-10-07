import { MEDIA } from './media';
import type { ResearchEntry } from './types';

/**
 * Research collection (master §11.2). PyVulDS is the first entry and the template for later ones.
 *
 * Adding a future research entry:
 * 1. Append a `ResearchEntry` to `RESEARCH` with a unique `slug` (it becomes `/work/<slug>`).
 * 2. Keep exactly one entry `featured: true` — that one is pinned in Scene 04; the rest render as an index below it.
 * 3. `status: 'in-production'` turns on the STILL ROLLING treatment; `startedAt` (ISO date) drives the running
 *    timecode and `takes` the `TAKE 0n` label (bump it on each meaningful update).
 * 4. Every metric needs a `scope` sentence, a `claim` status, and a `// source:` comment pointing at the evidence.
 *    Never publish a number without its scope, and list limitations honestly.
 * 5. Add a media ref under `MEDIA.research` in `content/media.ts` (placeholder until real assets exist).
 */
export const RESEARCH: ResearchEntry[] = [
  {
    slug: 'pyvulds',
    title: 'PyVulDS',
    subtitle: 'Path-aware vulnerability triage for Python repositories (3-month project)',
    kicker: 'Course research project · HUST',
    // ≤ 20 words; `[[x]]` highlights rendered by <Rich>.
    summary:
      'Staged Python vulnerability triage: [[learned local scoring]], [[bounded Deep-AST]] path recovery, optional LLM-assisted ranking, [[sink-aware]] evidence filtering.',
    status: 'released',
    featured: true,
    startedAt: '2026-03-01',
    takes: 3,
    areas: [
      'Program analysis',
      'Machine learning for security',
      'Static analysis',
      'Vulnerability triage',
      'AST-based path recovery',
    ],
    // source: mai-van-nhat-minh.md §6.1 "System design" (6 stages); labels per 02b Scene 04.
    pipeline: [
      {
        id: 'index',
        label: 'INDEX',
        detail: 'Index functions in a full repository or a change-oriented file set.',
      },
      {
        id: 'local-scoring',
        label: 'LOCAL SCORING',
        detail: 'Score local code windows with trained vulnerability models.',
      },
      {
        id: 'deep-ast',
        label: 'DEEP-AST EXPANSION',
        detail: 'Bounded AST / Deep-AST context expansion for suspicious or structurally risky functions.',
      },
      {
        id: 'path-ranking',
        label: 'PATH RANKING',
        detail:
          'Optional: an LLM ranks a deterministic set of recovered paths. Fallback: deterministic AST ranking.',
        optional: true,
      },
      {
        id: 'sink-filters',
        label: 'SINK FILTERS',
        detail: 'Vulnerability-type-specific sink filters.',
      },
      {
        id: 'reports',
        label: 'REPORTS',
        detail: 'Rich JSON · Semgrep-compatible JSON · reviewer-facing Markdown.',
      },
    ],
    // All metrics static (no odometer): each must render together with its scope (02b Scene 04).
    metrics: [
      // source: mai-van-nhat-minh.md §6.1 — PyGoat subset, 38 → 2 findings
      {
        value: '38 → 2',
        label: 'Findings after refined non-SQL sink rules',
        scope: 'Frozen two-file PyGoat subset · no retraining.',
        claim: 'verified',
        odometer: false,
      },
      // source: mai-van-nhat-minh.md §6.1 — VAmPI SQL slice, precision 0.105 → 1.000, recall 1.000
      {
        value: '0.105 → 1.000',
        label: 'Precision with SQL sink filtering',
        scope: 'Labeled VAmPI SQL slice · recall preserved at 1.000.',
        claim: 'verified',
        odometer: false,
      },
      // source: mai-van-nhat-minh.md §6.1 — nine-case curated benchmark, 0/9 → 9/9
      {
        value: '0/9 → 9/9',
        label: 'Expected-path recovery',
        scope: 'Nine-case curated benchmark: local-only 0/9; Deep-AST and Deep-AST + sink filtering 9/9.',
        claim: 'verified',
        odometer: false,
      },
      // source: mai-van-nhat-minh.md §6.1 — final-test F1 0.900–0.972, seven categories
      {
        value: '0.900–0.972',
        prefix: 'F1 ',
        label: 'Final-test F1',
        scope: 'Seven supported vulnerability categories · frozen local models.',
        claim: 'verified',
        odometer: false,
      },
    ],
    // source: mai-van-nhat-minh.md §6.1 — PyGoat subset, 38 → 2 findings (rack-focus visual)
    findings: {
      before: 38,
      after: 2,
      scope: 'Frozen two-file PyGoat subset · refined non-SQL sink rules · no retraining.',
    },
    // source: mai-van-nhat-minh.md §6.1 "Honest claim boundary"; §13 "Do Not Publish" (no claim of beating Semgrep).
    limitations: [
      'Path-aware vulnerability triage under active refinement — not a universal static-analysis replacement.',
      'Semgrep remains broader on framework and security-hygiene coverage.',
      'The context-training ablation is inconclusive due to limited resolved cross-file data.',
      'Results are scoped to the benchmarks named with each figure; they are not a general accuracy claim.',
    ],
    // source: mai-van-nhat-minh.md §3.4, §6.1, §9.
    caseStudy: {
      problem:
        'A local model can score suspicious code without explaining repository-level reachability, while a rule match can identify a sink without explaining why a changed entry point matters. PyVulDS explores a review workflow that combines ranking with bounded structural evidence.',
      constraints: [
        'Findings must stay reviewable: each result keeps its recovered path and sink evidence.',
        'Context expansion is bounded, and only triggered for suspicious or structurally risky functions.',
        'LLM assistance is optional; the workflow falls back to deterministic AST ranking when it is unavailable.',
        'Output has to fit existing review tooling, including Semgrep-compatible JSON.',
        'Resolved cross-file training data is limited.',
      ],
      design: [
        'Index functions in a full repository or a change-oriented file set.',
        'Score local code windows with trained vulnerability models.',
        'Trigger bounded AST or Deep-AST context expansion for suspicious or structurally risky functions.',
        'Optionally use an LLM to rank a deterministic set of recovered paths; fall back to deterministic AST ranking when unavailable.',
        'Apply vulnerability-type-specific sink filters.',
        'Produce rich JSON, Semgrep-compatible JSON, and reviewer-facing Markdown reports.',
      ],
      contribution: [
        'Developed the staged triage workflow: learned local scoring, bounded Deep-AST path recovery, optional LLM-assisted path selection, and sink-aware evidence filtering.',
        'Preserved reviewer-facing paths and sink evidence in the reports.',
        'Reported scoped benchmark gains and documented where current claims remain limited.',
      ],
      // source: mai-van-nhat-minh.md §6.1 "Evidence-backed results" (same four figures as `metrics`).
      evidence: [
        'Frozen local models reported final-test F1 from 0.900 to 0.972 across seven supported vulnerability categories.',
        'On a nine-case curated benchmark, local-only analysis recovered the expected path in 0/9 cases; Deep-AST and Deep-AST plus sink filtering recovered it in 9/9.',
        'On the labeled VAmPI SQL slice, SQL sink filtering improved precision from 0.105 to 1.000 while preserving recall at 1.000.',
        'On a frozen two-file PyGoat subset, refined non-SQL sink rules reduced findings from 38 to 2 without retraining.',
      ],
      limitations: [
        'PyVulDS is a path-aware vulnerability-triage workflow under active refinement, not a universal static-analysis replacement.',
        'Semgrep remains broader on framework and security-hygiene coverage.',
        'The active context-training ablation is inconclusive because of limited resolved cross-file data.',
        'Each result holds only for the benchmark it was measured on.',
      ],
      next: [
        'Continue refining the workflow; the project is still in production.',
        'Revisit the context-training ablation when more resolved cross-file data is available.',
      ],
    },
    media: MEDIA.research.pyvulds,
  },
];

function getFeaturedResearch(): ResearchEntry {
  const featured = RESEARCH.find((entry) => entry.featured);
  if (!featured) throw new Error('content/research.ts: one entry must be featured');
  return featured;
}

export const FEATURED_RESEARCH: ResearchEntry = getFeaturedResearch();
