import { SceneShell, sceneTitleId } from '@/components/scene/scene-shell';
import { EXPERIENCE } from '@/content/experience';
import { SCENE_COPY } from '@/content/scenes';
import { Timeline } from './timeline';

/**
 * Scene 03 — Timeline (refine contract §3). Year ruler + one row per engagement from `EXPERIENCE`;
 * markup is complete without JS (first row's detail open). Interaction and motion live in <Timeline>.
 */
export function LogScene() {
  const copy = SCENE_COPY.log;
  return (
    <SceneShell id="log">
      <div className="frame">
        <header>
          <h2 id={sceneTitleId('log')} className="text-display-lg leading-[1.2] text-ink">
            {copy.heading}
          </h2>
          <p className="mt-3 max-w-lead text-body-lg text-ink-2">{copy.subLabel}</p>
        </header>
        <Timeline rows={EXPERIENCE} className="mt-10 md:mt-14" />
      </div>
    </SceneShell>
  );
}
