import { PixelIcon } from '@/components/ui/pixel-icon';
import type { WorkStatus } from '@/content/types';
import { cn } from '@/lib/utils';

const SR_LABEL: Record<WorkStatus, string> = {
  'pre-production': 'Status: planned research, not started',
  'in-production': 'Status: in progress, still rolling',
  released: 'Status: released',
};

interface StatusBadgeProps {
  status: WorkStatus;
  className?: string;
}

/**
 * StatusBadge (01 §5.4). Three channels (text, icon, border style) so meaning never relies on colour.
 * `in-production` = STILL ROLLING variant (master §11.3): REC dot pulses in Tier A/B, static in Tier C.
 */
export function StatusBadge({ status, className }: StatusBadgeProps) {
  const base =
    'inline-flex h-6 shrink-0 items-center gap-1.5 rounded-full border px-2.5 font-pixel text-pixel-sm font-normal uppercase whitespace-nowrap tabular-nums';

  if (status === 'pre-production') {
    return (
      <span className={cn(base, 'border-dashed border-ink-3 text-ink-2', className)}>
        <PixelIcon name="flag" size={16} />
        <span aria-hidden="true">Pre-production</span>
        <span className="sr-only">{SR_LABEL[status]}</span>
      </span>
    );
  }

  if (status === 'in-production') {
    return (
      <span className={cn(base, 'border-line-strong text-ink', className)}>
        <span className="rec-dot" data-pulse="true" aria-hidden="true" />
        <span aria-hidden="true">Still rolling</span>
        <span className="sr-only">{SR_LABEL[status]}</span>
      </span>
    );
  }

  return (
    <span className={cn(base, 'border-grade-teal/50 text-ink', className)}>
      <PixelIcon name="check" size={16} className="text-grade-teal" />
      <span aria-hidden="true">Released</span>
      <span className="sr-only">{SR_LABEL[status]}</span>
    </span>
  );
}
