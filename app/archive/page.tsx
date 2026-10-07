import type { Metadata } from 'next';
import { PageStage } from '@/components/case/page-stage';
import { SubPageHeader } from '@/components/case/sub-page';
import { PixelIcon } from '@/components/ui/pixel-icon';
import { Rich, stripRich } from '@/components/ui/rich-text';
import { ARCHIVE } from '@/content/archive';
import { SCENE_COPY, getScene } from '@/content/scenes';
import { SITE } from '@/content/site';
import styles from '@/components/case/sub-page.module.css';

const TITLE = SCENE_COPY.reel.archiveTitle;
const LEDE = 'Earlier web work from the [[old portfolio]]. Public demos as listed there — *some may no longer load*.';

export const metadata: Metadata = {
  title: `${TITLE} · ${SITE.name}`,
  description: stripRich(LEDE),
};

/** `/archive` — 2020–2022 entries from the old portfolio; compact list, no highlight (master §4.1). */
export default function ArchivePage() {
  const reel = getScene('reel');
  return (
    <main id="main" tabIndex={-1} className="outline-none">
      <PageStage>
        <div className={styles.page} data-grade="amber">
          <SubPageHeader
            number={reel.number}
            label={`${reel.slate} · ARCHIVE`}
            titleId="archive-title"
            title={TITLE}
            lede={LEDE}
            back={{ href: '/#reel', label: 'Back to the reel' }}
          />

          <section aria-labelledby="archive-list-title" className={styles.section}>
            <div className="frame">
              <h2 id="archive-list-title" className="label-mono mb-4 text-ink-3">
                <span className="font-pixel text-pixel-sm text-ink-2">{String(ARCHIVE.length).padStart(2, '0')}</span> entries
              </h2>
              <ol className={styles.archiveList}>
                {ARCHIVE.map((entry) => (
                  <li key={`${entry.title}-${entry.year}`} className={styles.archiveRow} data-reveal>
                    <span className={styles.archiveYear}>{entry.year}</span>
                    <div className="min-w-0">
                      <h3 className="font-display text-heading-md text-ink">{entry.title}</h3>
                      <p className="label-mono mt-1 text-ink-3">
                        <Rich text={entry.role} />
                      </p>
                      <p className="mt-3 max-w-measure text-body-sm text-ink-2">
                        <Rich text={entry.summary} />
                      </p>
                    </div>
                    <div className="md:justify-self-end">
                      {entry.href ? (
                        <a href={entry.href} target="_blank" rel="noopener noreferrer" className={styles.archiveLink}>
                          Open demo
                          <PixelIcon name="external" size={16} />
                          <span className="sr-only">(opens in a new tab)</span>
                        </a>
                      ) : (
                        <span className="label-mono inline-flex min-h-11 items-center text-ink-3">No public link</span>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </section>
        </div>
      </PageStage>
    </main>
  );
}
