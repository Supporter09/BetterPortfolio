import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CaseChapters } from '@/components/case/case-chapters';
import { CaseHero, CASE_TITLE_ID } from '@/components/case/case-hero';
import { CaseNav } from '@/components/case/case-nav';
import { CASES, CHAPTERS, getCase, getCaseNeighbors } from '@/components/case/cases';
import { ChapterIndex } from '@/components/case/chapter-index';
import { PageStage } from '@/components/case/page-stage';
import { stripRich } from '@/components/ui/rich-text';
import { SITE } from '@/content/site';
import styles from '@/components/case/case.module.css';

type Params = Promise<{ slug: string }>;

/** Only the slugs in `CASES` exist; anything else is a 404 at build time (03a §3). */
export const dynamicParams = false;

export function generateStaticParams(): { slug: string }[] {
  return CASES.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const record = getCase(slug);
  if (!record) return {};
  return {
    title: `${record.title} — Case file · ${SITE.name}`,
    description: stripRich(record.summary),
  };
}

/** `/work/[slug]` — one case file (research entry or reel entry with a case study). */
export default async function CasePage({ params }: { params: Params }) {
  const { slug } = await params;
  const record = getCase(slug);
  if (!record) notFound();
  const { prev, next } = getCaseNeighbors(slug);

  return (
    <main id="main" tabIndex={-1} className="outline-none">
      <PageStage>
        <article aria-labelledby={CASE_TITLE_ID} className={styles.case} data-kind={record.kind}>
          <CaseHero record={record} />

          <div className="frame">
            <div className={styles.body}>
              <ChapterIndex chapters={CHAPTERS} />
              <CaseChapters record={record} />
            </div>
          </div>

          <CaseNav record={record} prev={prev} next={next} />
        </article>
      </PageStage>
    </main>
  );
}
