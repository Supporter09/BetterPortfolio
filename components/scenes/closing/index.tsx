import { SceneShell, sceneTitleId } from '@/components/scene/scene-shell';
import { Button } from '@/components/ui/button';
import { SCENE_COPY } from '@/content/scenes';
import { SITE } from '@/content/site';
import { cn } from '@/lib/utils';
import { BackToTop } from './back-to-top';
import { ClosingStage } from './closing-stage';
import styles from './closing.module.css';

/**
 * Scene 09 — Closing (round 2 §5). The climax CTA (LinkedIn primary, owner-approved; GitHub secondary),
 * then the fade-to-black `END OF RUNTIME` card with the REC → stop marker and Back to top. `pb-0` so the
 * card sits flush on the footer. Copy from SCENE_COPY.closing; links from content/site.ts only.
 */
export function ClosingScene() {
  const copy = SCENE_COPY.closing;
  const cta = SITE.ctas.nextScene;
  const github = SITE.links.find((link) => link.label === 'GitHub');

  return (
    <SceneShell id="closing" className="overflow-clip pb-0">
      <ClosingStage>
        <div className={styles.fade} data-cl-fade aria-hidden="true" />

        <div className={cn(styles.content, 'frame')}>
          <h2 id={sceneTitleId('closing')} className="text-display-lg leading-[1.2] text-ink" data-split>
            {copy.heading}
          </h2>
          <p className="mt-4 max-w-measure text-body-lg text-ink-2" data-cl-sub>
            {copy.subLabel}
          </p>

          {/* data-timecode-clear: the timecode chip hides while this row crosses its band. */}
          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-5 md:mt-12" data-cl-cta data-timecode-clear>
            <div className={styles.ctaWrap}>
              <span className={styles.ctaFrame} data-cl-cta-frame aria-hidden="true" />
              <Button href={cta.href} external={cta.external} size="lg" className="text-left">
                {cta.label}
              </Button>
            </div>
            {github ? (
              <Button href={github.href} external variant="link">
                {github.label}
              </Button>
            ) : null}
          </div>
        </div>

        <div className={cn(styles.content, styles.endCard)} data-cl-end data-timecode-clear>
          <div className="frame flex flex-col items-center gap-6">
            <span className={styles.marker} aria-hidden="true">
              <span className={cn(styles.rec, 'rec-dot')} data-pulse="true" data-cl-rec />
              <span className={styles.stop} data-cl-stop />
            </span>
            <p className={cn(styles.endTitle, 'font-pixel text-pixel-lg')} data-cl-end-copy>
              {copy.endCard}
            </p>
            <div data-cl-end-copy>
              <BackToTop label={copy.backToTop} />
            </div>
          </div>
        </div>
      </ClosingStage>
    </SceneShell>
  );
}
