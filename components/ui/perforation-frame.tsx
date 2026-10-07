import type { ElementType, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface PerforationFrameProps {
  /** Crawl the sprocket holes (STILL ROLLING). CSS-gated to Tier A/B; static otherwise. */
  active?: boolean;
  as?: ElementType;
  className?: string;
  children: ReactNode;
}

/**
 * Film-perforation border (master §11.3). Pure CSS (`.perforation-frame` in globals.css):
 * sprocket holes on all four edges, crawling via background-position only when active and Tier A/B.
 */
export function PerforationFrame({ active = false, as: Tag = 'div', className, children }: PerforationFrameProps) {
  return (
    <Tag className={cn('perforation-frame', className)} data-active={active ? 'true' : undefined}>
      {children}
    </Tag>
  );
}
