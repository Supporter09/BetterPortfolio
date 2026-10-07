import { OdometerMetric } from '@/components/ui/odometer-metric';
import { PixelIcon } from '@/components/ui/pixel-icon';
import { Rich } from '@/components/ui/rich-text';
import type { Metric, PipelineStage } from '@/content/types';
import { cn } from '@/lib/utils';
import { CHAPTERS, chapterBody, type CaseRecord } from './cases';
import styles from './case.module.css';

/** The research pipeline as a real ordered list (stage label + detail; optional stages tagged). */
function PipelineList({ title, stages }: { title: string; stages: PipelineStage[] }) {
  return (
    <div className={styles.figure}>
      <div className={styles.figureTitle}>
        <h3 className="label-mono text-ink-3">
          Pipeline · <span className="font-pixel text-pixel-sm text-ink-2">{String(stages.length).padStart(2, '0')}</span> stages
        </h3>
      </div>
      <ol className={styles.pipeline} aria-label={`${title} pipeline, ${stages.length} stages`}>
        {stages.map((stage, i) => (
          <li key={stage.id} className={styles.stage} data-optional={stage.optional || undefined} data-reveal>
            <span className={styles.stageNode} aria-hidden="true">
              {String(i + 1).padStart(2, '0')}
            </span>
            <div className="min-w-0">
              <p className="label-mono text-ink">
                <Rich text={stage.label} />
              </p>
              {stage.optional ? (
                <p className="mt-1.5 flex flex-wrap gap-1.5">
                  <span className={styles.branchTag}>Optional</span>
                  {/fallback/i.test(stage.detail) ? (
                    <span className={cn(styles.branchTag, styles.branchFallback)}>Deterministic fallback</span>
                  ) : null}
                </p>
              ) : null}
              <p className={styles.stageDetail}>
                <Rich text={stage.detail} />
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

/** Scoped figures: every value renders with its scope caption (OdometerMetric; roll only if `metric.odometer`). */
function Metrics({ metrics }: { metrics: Metric[] }) {
  return (
    <div className={styles.figure}>
      <div className={styles.figureTitle}>
        <h3 className="label-mono text-ink-3">
          Results · <span className="font-pixel text-pixel-sm text-ink-2">{String(metrics.length).padStart(2, '0')}</span> scoped
        </h3>
      </div>
      <div className={styles.metrics}>
        {metrics.map((metric) => (
          <OdometerMetric key={metric.label} metric={metric} className="min-w-0" />
        ))}
      </div>
    </div>
  );
}

/**
 * The 7-part case pattern (master §4.1): Problem → Constraints → System Design → Contribution →
 * Evidence → Limitations → Next Step. Each chapter is a focusable `<section id>` the index links to:
 * pixel chapter number, Geist display heading, body through `<Rich>` (problem = one paragraph,
 * the rest = bullets). Research entries add the pipeline list under System Design and the scoped
 * metrics under Evidence; work entries with a headline metric show it under Evidence.
 */
export function CaseChapters({ record }: { record: CaseRecord }) {
  const { caseStudy, research, work } = record;

  return (
    <div className={styles.chapters}>
      {CHAPTERS.map((chapter, i) => {
        const body = chapterBody(caseStudy, chapter.id);
        const titleId = `${chapter.id}-title`;
        const limitations = chapter.id === 'limitations';
        return (
          <section
            key={chapter.id}
            id={chapter.id}
            aria-labelledby={titleId}
            tabIndex={-1}
            className={styles.chapter}
            data-chapter={chapter.id}
          >
            <div className={styles.chapterHead} data-chapter-head>
              <span className={styles.chapterNumber} aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h2 id={titleId} className={cn(styles.chapterTitle, 'flex items-center gap-2')}>
                {limitations ? <PixelIcon name="flag" size={20} className="shrink-0 text-grade-amber" /> : null}
                {chapter.label}
              </h2>
              <span className={styles.chapterRule} aria-hidden="true" data-rule />
            </div>

            {typeof body === 'string' ? (
              <p className={styles.prose} data-reveal>
                <Rich text={body} />
              </p>
            ) : body.length ? (
              <ul className={styles.list}>
                {body.map((item) => (
                  <li key={item} className={styles.item} data-reveal>
                    <Rich text={item} />
                  </li>
                ))}
              </ul>
            ) : (
              <p className={cn(styles.empty, 'text-body-lg italic')} data-reveal>
                Nothing on record.
              </p>
            )}

            {chapter.id === 'system-design' && research ? (
              <PipelineList title={research.title} stages={research.pipeline} />
            ) : null}
            {chapter.id === 'evidence' && research?.metrics.length ? <Metrics metrics={research.metrics} /> : null}
            {chapter.id === 'evidence' && work?.metric ? <Metrics metrics={[work.metric]} /> : null}
          </section>
        );
      })}
    </div>
  );
}
