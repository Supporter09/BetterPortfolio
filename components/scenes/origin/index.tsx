import { SceneShell, sceneTitleId } from '@/components/scene/scene-shell';
import { MediaFrame } from '@/components/ui/media-frame';
import { Rich } from '@/components/ui/rich-text';
import { MEDIA } from '@/content/media';
import { SCENE_COPY, getScene } from '@/content/scenes';
import { SITE } from '@/content/site';
import { OriginStage } from './origin-stage';
import styles from './origin.module.css';

/**
 * Scene 02 — Origin. Amber-graded portrait (dot-matrix dither, resolves on hover/focus/tap) in a CSS-sticky
 * column (≥1024) beside one highlighted paragraph, three one-line beats, and the narrative anchor as a pull
 * quote. <1024: linear stack, portrait first.
 *
 * Story-flow hooks (round 2 §4):
 * - `[data-origin-figure]` receives the opening's digitize stream: Tier A/B hide its media until the
 *   stream sets `data-received` (CSS below); Tier C / no-JS show it at once.
 * - `[data-flow-anchor="portrait"]` = the portrait frame (geometry source for the stream and the timeline's
 *   energy line). It sits inside a sticky box, so use `[data-origin-column]` (non-sticky cell) for a
 *   document-stable top, and `[data-flow-anchor-bottom]` (non-sticky marker right under the portrait's
 *   natural position) for "under the frame".
 */
export function OriginScene() {
  const meta = getScene('origin');
  const copy = SCENE_COPY.origin;

  return (
    <SceneShell id="origin" className="overflow-x-clip">
      <OriginStage className="frame">
        <header>
          <p aria-hidden="true" className="font-pixel text-pixel-sm text-ink-3">
            {`// ${meta.number}`}
          </p>
          <h2 id={sceneTitleId('origin')} className="mt-3 text-display-lg text-ink">
            {copy.heading}
          </h2>
          <p className="mt-3 max-w-lead text-body-lg text-ink-2">{copy.subLabel}</p>
        </header>

        <div className="grid-frame mt-12 gap-y-14 md:mt-16">
          <div data-origin-column className="col-span-4 md:col-span-6 md:col-start-2 lg:col-span-5 lg:col-start-1">
            <div data-origin-sticky className="lg:sticky lg:top-[120px]">
              <div data-origin-figure className="relative">
                <div data-origin-portrait data-flow-anchor="portrait" className={styles.portrait}>
                  <div data-origin-media className={styles.media}>
                    <MediaFrame
                      media={MEDIA.portrait}
                      sizes="(min-width: 1024px) 40vw, (min-width: 768px) 75vw, 100vw"
                      dither="hover"
                      className={styles.portraitMedia}
                    />
                    <div aria-hidden="true" className={styles.duotone} />
                    <div aria-hidden="true" className={styles.lift} />
                    <div aria-hidden="true" className={styles.vignette} />
                  </div>
                  <div aria-hidden="true" className={styles.signal} />
                </div>
                <div aria-hidden="true" data-origin-corners className={styles.corners} />
              </div>
              <p aria-hidden="true" className="label-mono mt-5 flex items-center gap-2 text-ink-3">
                <span className="inline-block h-px w-6 bg-grade-amber" />
                {MEDIA.portrait.label}
              </p>
            </div>
            <div aria-hidden="true" data-flow-anchor-bottom className="h-0" />
          </div>

          <div className="col-span-4 md:col-span-8 lg:col-span-6 lg:col-start-7">
            <div data-origin-bio>
              <p data-hl-hover className="text-body-lg text-ink">
                <Rich text={SITE.shortBio} />
              </p>

              <h3 className="label-mono mt-12 flex items-center gap-3 text-ink-3">
                <span aria-hidden="true" className="inline-block h-px w-6 bg-line-strong" />
                Beats
              </h3>
              <ol className="mt-5 divide-y divide-line border-y border-line">
                {SITE.extendedAbout.map((beat, i) => (
                  <li key={beat} className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-x-3 py-3.5">
                    <span aria-hidden="true" className="pt-0.5 font-pixel text-pixel-sm text-ink-3">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <p data-hl-hover className="text-body text-ink-2">
                      <Rich text={beat} />
                    </p>
                  </li>
                ))}
              </ol>
            </div>

            <figure data-origin-quote className="mt-16 border-l-2 border-grade-amber pl-6 md:mt-20 md:pl-8">
              <span aria-hidden="true" className={styles.quoteMark}>
                “
              </span>
              <blockquote>
                <p className="font-display text-[clamp(1.75rem,1.35rem+1.6vw,2.75rem)] leading-[1.2] font-medium tracking-[-0.02em] text-balance text-ink">
                  <Rich text={SITE.narrativeAnchor} emClassName="text-grade-amber" />
                </p>
              </blockquote>
              <figcaption className="label-mono mt-6 text-ink-3">{SITE.name}</figcaption>
            </figure>
          </div>
        </div>
      </OriginStage>
    </SceneShell>
  );
}
