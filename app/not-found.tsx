import type { Metadata } from 'next';
import { PageStage } from '@/components/case/page-stage';
import { SubPageHeader } from '@/components/case/sub-page';
import { Button } from '@/components/ui/button';
import { SITE } from '@/content/site';
import styles from '@/components/case/sub-page.module.css';

export const metadata: Metadata = {
  title: `Scene not found — take 404 · ${SITE.name}`,
  robots: { index: false },
};

/** 404 — "Scene not found — take 404" with the way back to `/` (master §4.1). */
export default function NotFound() {
  return (
    <main id="main" tabIndex={-1} className="outline-none">
      <PageStage>
        <div className={`${styles.page} ${styles.notFound}`} data-grade="teal">
          <SubPageHeader
            number="--"
            take={404}
            label="SCENE NOT FOUND"
            titleId="not-found-title"
            title="Scene not found — take 404"
            lede="No scene at this address. Cut back to the [[amber:opening shot]], or pick up the reel."
          >
            <div className="mt-10 flex flex-wrap gap-3" data-intro>
              <Button href="/" size="lg">
                Back to the film
              </Button>
              <Button href="/#reel" variant="ghost" size="lg">
                Go to the reel
              </Button>
            </div>
          </SubPageHeader>
        </div>
      </PageStage>
    </main>
  );
}
