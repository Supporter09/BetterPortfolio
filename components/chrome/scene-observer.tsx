'use client';

import { useEffect } from 'react';

export type SceneChangeDetail = { id: string; number: string; title: string };

export const SCENE_CHANGE_EVENT = 'runtime:scenechange';

/**
 * Single source of the active scene (02a §3.3): mirrors the scene crossing the viewport's centre line
 * onto <html data-active-scene> (grain, grade, timecode) and dispatches `runtime:scenechange`.
 * IntersectionObserver only — runs in every tier, no GSAP. The cold-open overlay is not a scene here.
 */
export function SceneObserver() {
  useEffect(() => {
    const root = document.documentElement;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          const detail: SceneChangeDetail = {
            id: el.id,
            number: el.dataset.sceneNumber ?? '00',
            title: el.dataset.sceneTitle ?? '',
          };
          if (root.dataset.activeScene === detail.id) continue;
          root.dataset.activeScene = detail.id;
          window.dispatchEvent(new CustomEvent<SceneChangeDetail>(SCENE_CHANGE_EVENT, { detail }));
        }
      },
      // 1px band at the vertical centre → exactly one active scene at a time.
      { rootMargin: '-50% 0px -50% 0px' },
    );
    document
      .querySelectorAll<HTMLElement>('[data-scene-number]:not([data-scene="cold-open"])')
      .forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return null;
}
