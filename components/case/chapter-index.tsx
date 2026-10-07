'use client';

import { useEffect, useState } from 'react';
import type { Chapter } from './cases';
import styles from './case.module.css';

/**
 * Sticky chapter index (desktop ≥1024×600). Plain hash links — they work without JS
 * (Lenis `anchors` smooths them in Tier A, CSS `scroll-behavior` in Tier B). With JS, the chapter
 * crossing the upper third of the viewport is marked `aria-current`.
 */
export function ChapterIndex({ chapters }: { chapters: readonly Chapter[] }) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const sections = chapters
      .map((chapter) => document.getElementById(chapter.id))
      .filter((el): el is HTMLElement => el !== null);
    if (!sections.length) return;

    const visible = new Set<string>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }
        // First chapter in reading order inside the band wins; keep the last one when none is.
        const next = chapters.find((chapter) => visible.has(chapter.id))?.id;
        if (next) setActive(next);
      },
      // Band from just under the HUD to 40% down the viewport.
      { rootMargin: '-15% 0px -60% 0px' },
    );
    sections.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [chapters]);

  return (
    <nav aria-label="Chapters" className={styles.index} data-index>
      <p className="label-mono text-ink-3">Chapters</p>
      <ol className={styles.indexList}>
        {chapters.map((chapter, i) => (
          <li key={chapter.id} data-index-item>
            <a
              href={`#${chapter.id}`}
              className={styles.indexLink}
              aria-current={active === chapter.id ? 'true' : undefined}
            >
              <span className={styles.indexNumber} aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className={styles.indexLabel}>{chapter.label}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
