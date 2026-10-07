import { SceneShell, sceneTitleId } from '@/components/scene/scene-shell';
import { PixelIcon } from '@/components/ui/pixel-icon';
import { Rich } from '@/components/ui/rich-text';
import { CREDITS } from '@/content/credits';
import { SCENE_COPY } from '@/content/scenes';
import type { Credit } from '@/content/types';
import { cn } from '@/lib/utils';
import { CreditsStage } from './credits-stage';
import { CreditEntry } from './credit-entry';
import styles from './credits.module.css';

/** Consecutive credits with the same role share one `<dt>` (e.g. the three scholarships). */
function groupByRole(credits: Credit[]): { role: string; entries: Credit[] }[] {
  const groups: { role: string; entries: Credit[] }[] = [];
  for (const credit of credits) {
    const last = groups[groups.length - 1];
    if (last && last.role === credit.role) last.entries.push(credit);
    else groups.push({ role: credit.role, entries: [credit] });
  }
  return groups;
}

/**
 * Scene 08 — Achievements (02b Scene 07, retitled in round 2 §5). Education and awards as end credits: a `<dl>`
 * with role (pixel label + icon, right) / name (Geist, left) meeting on the centre axis. Content comes from
 * CREDITS only (no GPA, no dates beyond the ones recorded); IELTS shows the score alone. Nothing auto-scrolls;
 * the "08" watermark is decorative.
 */
export function CreditsScene() {
  const groups = groupByRole(CREDITS);
  // Visual beats: studying · scholarships · competition results · KAIST + English.
  const sections = [groups.slice(0, 1), groups.slice(1, 2), groups.slice(2, 5), groups.slice(5)].filter((s) => s.length);

  return (
    <SceneShell id="credits" className="overflow-clip">
      <CreditsStage>
        <div className={styles.watermark} data-watermark aria-hidden="true">
          08
        </div>

        <div className="frame relative">
          <h2 id={sceneTitleId('credits')} className="text-center text-display-md text-ink" data-split>
            {SCENE_COPY.credits.heading}
          </h2>
          <p className="mt-3 text-center text-body-lg text-ink-2" data-credit-sub>
            {SCENE_COPY.credits.subLabel}
          </p>

          <dl className={cn(styles.list, 'mt-12 md:mt-20')}>
            {sections.map((section, s) =>
              section.map((group, g) => (
                <div
                  key={group.role + group.entries[0].name}
                  className={cn(styles.row, s > 0 && g === 0 && styles.sectionStart)}
                  data-credit-row
                >
                  <dt className={cn(styles.role, 'label-pixel')}>
                    {/PLACE|PRIZE/i.test(group.role) ? (
                      <PixelIcon name="trophy" size={16} className={cn(styles.roleIcon, 'text-grade-amber')} />
                    ) : (
                      <PixelIcon name="grad-cap" size={16} className={styles.roleIcon} />
                    )}
                    {group.role}
                  </dt>
                  {group.entries.map((credit) =>
                    credit.evidence ? (
                      <CreditEntry key={credit.name + (credit.detail ?? '')} credit={credit} />
                    ) : (
                      <dd key={credit.name + (credit.detail ?? '')} className={cn(styles.name, 'text-body-lg')}>
                        <Rich text={credit.name} />
                        {credit.detail ? (
                          <span className={styles.detail}>
                            <span aria-hidden="true"> · </span>
                            <span className="sr-only">, </span>
                            <Rich text={credit.detail} />
                          </span>
                        ) : null}
                      </dd>
                    ),
                  )}
                </div>
              )),
            )}
          </dl>
        </div>
      </CreditsStage>
    </SceneShell>
  );
}
