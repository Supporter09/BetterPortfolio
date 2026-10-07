import type { ReactNode } from 'react';
import { Slate } from '@/components/scene/slate';
import { Button } from '@/components/ui/button';
import { PixelIcon } from '@/components/ui/pixel-icon';
import { Rich } from '@/components/ui/rich-text';
import { cn } from '@/lib/utils';
import styles from './sub-page.module.css';

interface SubPageHeaderProps {
  /** Slate: `SCENE 05 · TAKE 01 · <label>`. */
  number: string;
  take?: number;
  label: string;
  titleId: string;
  title: string;
  /** Rich copy (`[[keyword]]`, `*italic*`). */
  lede?: string;
  /** Back link to the scene this page branches from. */
  back?: { href: string; label: string };
  /** Extra header content (e.g. CTAs on the 404 page). */
  children?: ReactNode;
}

/**
 * Header shared by `/archive`, `/films` and the 404 page: slate + optional back link, one `<h1>`,
 * an optional lede. Hooks for PageStage: `[data-slate]`, `[data-back]`, `[data-split]`, `[data-intro]`.
 */
export function SubPageHeader({ number, take, label, titleId, title, lede, back, children }: SubPageHeaderProps) {
  return (
    <header className={styles.header}>
      <div className="frame">
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
          <div data-slate>
            <Slate number={number} take={take} label={label} />
          </div>
          {back ? (
            <div data-back>
              <Button href={back.href} variant="link" icon="none" className="text-ink-2 hover-fine:text-ink">
                <PixelIcon name="arrow-left" size={20} />
                {back.label}
              </Button>
            </div>
          ) : null}
        </div>
        <h1 id={titleId} className={cn('split-safe font-display mt-10 md:mt-14', styles.title)} data-split>
          {title}
        </h1>
        {lede ? (
          <p className="mt-6 max-w-measure text-body-lg text-ink-2" data-intro>
            <Rich text={lede} />
          </p>
        ) : null}
        {children}
      </div>
    </header>
  );
}
