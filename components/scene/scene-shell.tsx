import type { ReactNode } from 'react';
import type { SceneId, SceneMeta } from '@/content/types';
import { getScene } from '@/content/scenes';
import { Slate } from '@/components/scene/slate';

/** Id of the scene <h2>; SceneShell points `aria-labelledby` at it. Scenes MUST put it on their h2. */
export function sceneTitleId(id: SceneId): string {
  return `${id}-title`;
}

interface SceneShellProps {
  id: SceneId;
  /** Overrides the grade from SCENES (exposed as `data-grade`). */
  grade?: SceneMeta['grade'];
  className?: string;
  /** Render the inline slate from SCENES above children (inside a `.frame`). Default true. */
  slate?: boolean;
  /** Take number shown in the slate (e.g. research `takes`). */
  take?: number;
  children: ReactNode;
}

/**
 * Scene contract (master §4.2): `<section id data-scene data-scene-number data-scene-title aria-labelledby>`.
 * SceneObserver reads these attributes; the scene grade comes from `[data-scene=…]::before` in globals.css.
 */
export function SceneShell({ id, grade, className, slate = true, take, children }: SceneShellProps) {
  const meta = getScene(id);
  return (
    <section
      id={id}
      data-scene={id}
      data-scene-number={meta.number}
      data-scene-title={meta.title}
      data-grade={grade ?? meta.grade}
      aria-labelledby={sceneTitleId(id)}
      className={className}
    >
      {slate ? (
        <div className="frame mb-6">
          <Slate number={meta.number} take={take} label={meta.slate} />
        </div>
      ) : null}
      {children}
    </section>
  );
}

/** Convenience for scenes that lay out their own slate: `<Slate {...slateProps('log')} />`. */
export function slateProps(id: SceneId): { number: string; label: string } {
  const meta = getScene(id);
  return { number: meta.number, label: meta.slate };
}
