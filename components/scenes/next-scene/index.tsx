import { SceneShell, sceneTitleId } from '@/components/scene/scene-shell';
import { PixelSprite } from '@/components/ui/pixel-sprite';
import { Rich } from '@/components/ui/rich-text';
import { DIRECTION, DIRECTION_COPY } from '@/content/direction';
import { SCENE_COPY } from '@/content/scenes';
import { SPRITES } from '@/content/sprites';
import { cn } from '@/lib/utils';
import { NextSceneStage } from './next-scene-stage';
import styles from './next-scene.module.css';

/**
 * Scene 05 — Next Scene (round 2 §5). Direction cards only: four static `<li>` panels, each with a 16×16
 * pixel sprite (content/sprites.ts), the title and a 4-word pixel tag, then one small line
 * (`DIRECTION_COPY.note`) that keeps the claim honest. No goal block, no badge, no CTA — those moved to
 * the closing scene. Every fact comes from content/direction.ts.
 */
export function NextSceneScene() {
  const copy = SCENE_COPY.nextScene;

  return (
    <SceneShell id="next-scene" className="overflow-clip">
      <NextSceneStage>
        <div className="frame">
          <h2 id={sceneTitleId('next-scene')} className="text-display-lg leading-[1.2] text-ink" data-split>
            {copy.heading}
          </h2>
          <p className="mt-4 max-w-measure text-body-lg text-ink-2" data-ns-intro>
            <Rich text={DIRECTION_COPY.intro} />
          </p>

          <ul className={cn(styles.cards, 'mt-12 md:mt-16')} aria-label="Candidate research directions" data-ns-cards>
            {DIRECTION.map((card, i) => (
              <li key={card.title} className={styles.card} data-ns-card data-hl-hover>
                <span className={cn(styles.cardIndex, 'font-pixel text-pixel-sm')} aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <PixelSprite sprite={SPRITES[card.sprite]} scale={3} className={styles.sprite} />
                <h3 className={styles.cardTitle}>{card.title}</h3>
                <p className={cn(styles.cardSummary, 'font-pixel text-pixel-sm uppercase')}>
                  <Rich text={card.summary} />
                </p>
              </li>
            ))}
          </ul>

          <p className="mt-6 label-mono text-ink-3" data-ns-note>
            {DIRECTION_COPY.note}
          </p>
        </div>
      </NextSceneStage>
    </SceneShell>
  );
}
