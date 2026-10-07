import { SceneShell, sceneTitleId, slateProps } from '@/components/scene/scene-shell';
import { Slate } from '@/components/scene/slate';
import { Rich } from '@/components/ui/rich-text';
import { SCENE_COPY } from '@/content/scenes';
import { WORK } from '@/content/work';
import { WorkCard } from './reel-card';
import { ReelStage } from './reel-stage';
/**
 * Scene 06 — The Reel (02b Scene 05; round 2 order). Visible WORK cards in reel order
 * (excluding internal SRE work; Archive card omitted from the reel, direct route kept).
 * Pin #2 (Tier A, `conditions.pinReel`) or native horizontal scroll-snap ≥640px; stacked below 640px.
 */
export function ReelScene() {
  const visibleWork = WORK.filter((entry) => entry.slug !== 'sre-release-automation');
  const count = visibleWork.length;
  return (
    <SceneShell id="reel" slate={false}>
      <ReelStage
        count={count}
        header={
          <>
            <Slate {...slateProps('reel')} />
            <h2 id={sceneTitleId('reel')} className="mt-6 text-display-lg leading-[1.1] text-ink" data-split>
              {SCENE_COPY.reel.heading}
            </h2>
            <p className="mt-3 max-w-lead text-body-lg text-ink-2" data-hl-hover>
              <Rich text={SCENE_COPY.reel.subLabel} />
            </p>
          </>
        }
      >
        {visibleWork.map((entry, i) => (
          <WorkCard key={entry.slug} entry={entry} index={i} />
        ))}
      </ReelStage>
    </SceneShell>
  );
}
