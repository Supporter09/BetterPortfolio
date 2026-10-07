import type { CSSProperties } from 'react';
import { SceneShell, sceneTitleId } from '@/components/scene/scene-shell';
import { BOOT_LOG, SCENES, getScene } from '@/content/scenes';
import { cn } from '@/lib/utils';
import { ColdOpenController } from './cold-open-controller';
import styles from './cold-open.module.css';

/**
 * Scene 00 — Cold open (02a Scene 00). Server markup + CSS keyframes only (globals.css `.cold-open*`):
 * renders nothing visible unless the boot script set `html[data-boot=play]` (Tier A/B, first visit this session).
 * The boot log is decorative (`aria-hidden`); screen readers get a one-sentence summary.
 */
export function ColdOpenScene() {
  const meta = getScene('cold-open');
  const opening = getScene('opening');
  const last = BOOT_LOG.length - 1;

  return (
    <SceneShell id="cold-open" slate={false} className="cold-open">
      <div className={styles.backdrop} aria-hidden="true" />
      <ColdOpenController />

      <div className={styles.console}>
        <h2 id={sceneTitleId('cold-open')} className="label-mono text-ink">
          RUNTIME <span className="text-ink-3">[</span>
          {meta.title}
          <span className="text-ink-3">]</span>
        </h2>
        <p className="sr-only">
          Intro sequence: {SCENES.length} scenes indexed, slate set for scene {opening.number}. Press Escape or use
          Skip intro to go straight to the opening shot.
        </p>

        <ol aria-hidden="true" className="mt-6 space-y-1.5 font-mono text-body-sm text-ink-2">
          {BOOT_LOG.map((line, i) => (
            <li
              key={line.text}
              className="cold-open__line whitespace-nowrap"
              style={{ '--i': i } as CSSProperties}
              // Tier B shows 4 lines: the letterbox line is dropped (02a Scene 00 §6).
              data-tier-b={line.text.startsWith('letterbox') ? 'hidden' : undefined}
            >
              <span className={cn(styles.status, line.status === 'OK' ? styles.ok : styles.pending)}>
                {`[ ${line.status} ]`}
              </span>{' '}
              {line.text}
              {i === last ? <span className={styles.caret} /> : null}
            </li>
          ))}
        </ol>

        <div aria-hidden="true" className={cn(styles.board, 'mt-10 md:mt-12')}>
          <div className={styles.sticks}>
            <div className={cn(styles.stick, styles.stickTop, 'cold-open__clap')} />
            <div className={cn(styles.stick, styles.stickBase)} />
          </div>
          <div className={styles.grid}>
            <div className={styles.cell}>
              <span className="label-mono text-ink-3">Scene</span>
              <span className={styles.cellValue}>{opening.number}</span>
            </div>
            <div className={styles.cell}>
              <span className="label-mono text-ink-3">Take</span>
              <span className={styles.cellValue}>01</span>
            </div>
            <div className={styles.cell}>
              <span className="label-mono text-ink-3">Roll</span>
              <span className={styles.cellValue}>A001</span>
            </div>
          </div>
          <div className={cn(styles.footer, 'label-mono text-ink-3')}>
            <span>Prod. RUNTIME</span>
            <span>{opening.slate}</span>
          </div>
        </div>
      </div>
    </SceneShell>
  );
}
