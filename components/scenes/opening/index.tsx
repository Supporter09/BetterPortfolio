import { SceneShell, sceneTitleId, slateProps } from '@/components/scene/scene-shell';
import { Slate } from '@/components/scene/slate';
import { Button } from '@/components/ui/button';
import { Rich } from '@/components/ui/rich-text';
import { getScene } from '@/content/scenes';
import { SITE } from '@/content/site';
import { cn } from '@/lib/utils';
import { OpeningStage } from './opening-stage';
import { Universe } from './universe';
import styles from './opening.module.css';

/**
 * Scene 01 — Opening shot (round 2 §3). Pixel universe (Minh sprite + orbiting companions) beside a short
 * copy column: slate, full name, the page <h1> ("Hi, I'm Minh."), one highlighted line, roles, two CTAs.
 * ≥ 1024: copy 5/12 + universe 7/12; below: universe first, then copy. DOM order = focus order:
 * CTAs → "Pause orbit". Motion lives in <OpeningStage> / <Universe> (Tier A/B only).
 */
export function OpeningScene() {
  const meta = getScene('opening');
  const { primary, secondary } = SITE.ctas.opening;

  return (
    <SceneShell id="opening" slate={false} className="py-0">
      <OpeningStage className={cn('frame', styles.stage)}>
        <div data-hero-copy className={styles.copy}>
          <div data-hero-reveal className={styles.reveal}>
            <Slate {...slateProps('opening')} />
          </div>

          <h1 id={sceneTitleId('opening')} data-hero-reveal className={cn('mt-4 md:mt-5', styles.title, styles.reveal)}>
            {meta.title}
          </h1>

          <p
            data-hero-reveal
            data-hl-hover
            className={cn('mt-6 max-w-[34ch] text-body-lg text-ink-2 md:mt-7', styles.reveal)}
          >
            <Rich text={SITE.subheadline} />
          </p>

          <ul
            data-hero-reveal
            aria-label="Roles"
            className={cn('label-mono mt-6 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-ink-3', styles.reveal)}
          >
            <li aria-hidden="true" className={styles.rule} />
            {SITE.roles.split(' · ').map((role, i) => (
              <li key={role} className="inline-flex items-center gap-x-3">
                {i > 0 ? (
                  <span aria-hidden="true" className="text-line-strong">
                    ·
                  </span>
                ) : null}
                {role}
              </li>
            ))}
          </ul>

          <div data-hero-reveal className={cn('mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap md:mt-10', styles.reveal)}>
            <Button href={primary.href} size="lg" className="w-full sm:w-auto">
              {primary.label}
            </Button>
            <Button href={secondary.href} variant="ghost" size="lg" className="w-full bg-bg-0/40 sm:w-auto">
              {secondary.label}
            </Button>
          </div>
        </div>

        <Universe className={styles.reveal} />
      </OpeningStage>
    </SceneShell>
  );
}
