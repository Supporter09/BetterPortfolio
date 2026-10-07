import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PixelIcon } from '@/components/ui/pixel-icon';
import type { CaseRecord } from './cases';
import styles from './case.module.css';

interface CaseNavProps {
  record: CaseRecord;
  prev?: CaseRecord;
  next?: CaseRecord;
}

/** Prev/next through the case list plus the way back to the entry's scene on the film. */
export function CaseNav({ record, prev, next }: CaseNavProps) {
  return (
    <nav aria-label="More case files" className={styles.caseNav}>
      <div className="frame">
        <div className={styles.navGrid}>
          {prev ? (
            <Link href={`/work/${prev.slug}`} className={styles.navCard} data-dir="prev" data-reveal>
              <span className="label-mono inline-flex items-center gap-2 text-ink-3">
                <PixelIcon name="arrow-left" size={16} />
                Previous case
              </span>
              <span className={styles.navTitle}>{prev.title}</span>
              <span className="text-caption text-ink-3">{prev.kicker}</span>
            </Link>
          ) : null}
          {next ? (
            <Link href={`/work/${next.slug}`} className={styles.navCard} data-dir="next" data-reveal>
              <span className="label-mono inline-flex items-center gap-2 text-ink-3">
                Next case
                <PixelIcon name="arrow-right" size={16} />
              </span>
              <span className={styles.navTitle}>{next.title}</span>
              <span className="text-caption text-ink-3">{next.kicker}</span>
            </Link>
          ) : null}
        </div>
        <div className="mt-8" data-reveal>
          <Button href={record.backHref} variant="ghost" icon="none">
            <PixelIcon name="arrow-left" size={20} />
            {record.backLabel}
          </Button>
        </div>
      </div>
    </nav>
  );
}
