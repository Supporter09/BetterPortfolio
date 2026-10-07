import type { ElementType, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ViewfinderProps {
  as?: ElementType;
  className?: string;
  children: ReactNode;
}

/**
 * Viewfinder corner brackets (01 §5.6) around media/cards. Decorative only (`::after`);
 * hover → amber, `:has(:focus-visible)` → amber 2px. Never replaces the focus outline.
 */
export function Viewfinder({ as: Tag = 'div', className, children }: ViewfinderProps) {
  return <Tag className={cn('viewfinder', className)}>{children}</Tag>;
}
