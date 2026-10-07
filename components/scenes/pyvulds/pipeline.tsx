import type { PipelineStage } from '@/content/types';
import { cn } from '@/lib/utils';
import styles from './pyvulds.module.css';

/**
 * Pipeline diagram (02b Scene 04 §2/§8), labels only. Real text in an `<ol>`; nodes and connectors are
 * aria-hidden inline SVG. DOM default = fully drawn (Tier C / no-JS); motion only clips the
 * connectors (`[data-conn]`) and fades the lit node layer (`[data-node-lit]`).
 * Horizontal row from 1024px, vertical spine below. One short line under the diagram explains the
 * optional branch (the only stage with a detail worth keeping on the overview; the rest live in the case study).
 */
export function Pipeline({ title, stages }: { title: string; stages: PipelineStage[] }) {
  const branch = stages.find((stage) => stage.optional);
  return (
    <>
      <ol
        aria-label={`${title} pipeline, ${stages.length} stages`}
        className={styles.pipeline}
        style={{ ['--n' as string]: stages.length }}
        data-pipeline
      >
        {stages.map((stage, i) => {
          const last = i === stages.length - 1;
          // Edges into or out of an optional stage are drawn dashed.
          const dashed = stage.optional || stages[i + 1]?.optional;
          return (
            <li key={stage.id} className={styles.stage} data-stage={i} data-optional={stage.optional || undefined}>
              <div className={styles.rail} aria-hidden="true">
                <span className={styles.node}>
                  <svg viewBox="0 0 40 40" className={styles.nodeRing}>
                    <circle cx="20" cy="20" r="18.5" />
                  </svg>
                  <span className={styles.nodeLit} data-node-lit />
                  <span className="relative font-pixel text-pixel-sm">{String(i + 1).padStart(2, '0')}</span>
                </span>
                {last ? null : (
                  <>
                    <span className={cn(styles.conn, styles.connX)}>
                      <svg viewBox="0 0 100 2" preserveAspectRatio="none" data-conn="x">
                        <line x1="0" y1="1" x2="100" y2="1" data-dashed={dashed || undefined} />
                      </svg>
                    </span>
                    <span className={cn(styles.conn, styles.connY)}>
                      <svg viewBox="0 0 2 100" preserveAspectRatio="none" data-conn="y">
                        <line x1="1" y1="0" x2="1" y2="100" data-dashed={dashed || undefined} />
                      </svg>
                    </span>
                  </>
                )}
              </div>
              <div className={styles.stageText}>
                <p className="label-mono text-ink">
                  {stage.label}
                  {stage.optional ? <span className="sr-only"> (optional)</span> : null}
                </p>
                {stage.optional ? (
                  <p className="mt-1.5" aria-hidden="true">
                    <span className={cn(styles.branchTag, styles.branchOptional)} data-branch="optional">
                      Optional
                    </span>
                  </p>
                ) : null}
              </div>
            </li>
          );
        })}
      </ol>
      {branch ? (
        <p className={styles.pipelineNote}>
          <span className="font-pixel text-pixel-xs text-grade-teal uppercase">{branch.label}</span>
          {branch.detail}
        </p>
      ) : null}
    </>
  );
}
