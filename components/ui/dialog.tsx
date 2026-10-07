'use client';

import * as DialogPrimitive from '@radix-ui/react-dialog';
import type { ComponentPropsWithoutRef, ComponentRef, Ref } from 'react';
import { PixelIcon } from '@/components/ui/pixel-icon';
import { cn } from '@/lib/utils';

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogPortal = DialogPrimitive.Portal;
export const DialogClose = DialogPrimitive.Close;

export function DialogOverlay({
  className,
  ref,
  ...props
}: ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay> & { ref?: Ref<ComponentRef<typeof DialogPrimitive.Overlay>> }) {
  return (
    <DialogPrimitive.Overlay
      ref={ref}
      className={cn('dialog-overlay fixed inset-0 z-(--z-modal) bg-bg-0/80', className)}
      {...props}
    />
  );
}

type DialogContentProps = ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
  ref?: Ref<ComponentRef<typeof DialogPrimitive.Content>>;
  /** `modal`: centred panel (palette, lightbox). `fullscreen`: menu overlay (z-menu, wipe). */
  variant?: 'modal' | 'fullscreen';
  /** Render the default 44px "Close" icon button (top-right). */
  showClose?: boolean;
  closeLabel?: string;
  overlayClassName?: string;
};

export function DialogContent({
  className,
  children,
  ref,
  variant = 'modal',
  showClose = false,
  closeLabel = 'Close',
  overlayClassName,
  ...props
}: DialogContentProps) {
  const fullscreen = variant === 'fullscreen';
  return (
    <DialogPortal>
      {fullscreen ? null : <DialogOverlay className={overlayClassName} />}
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          fullscreen
            ? 'menu-content fixed inset-0 z-(--z-menu) overflow-y-auto bg-bg-0 text-ink'
            : 'dialog-content fixed top-4 left-1/2 z-(--z-modal) max-h-[70dvh] w-[min(640px,calc(100vw-32px))] -translate-x-1/2 overflow-hidden rounded-lg border border-line-strong bg-bg-1 text-ink md:top-[20vh] md:max-h-[60vh]',
          className,
        )}
        {...props}
      >
        {children}
        {showClose ? (
          <DialogPrimitive.Close
            className="absolute top-3 right-3 inline-flex size-11 items-center justify-center rounded-sm text-ink-2 transition-colors hover-fine:text-ink"
            aria-label={closeLabel}
          >
            <PixelIcon name="close" size={24} />
          </DialogPrimitive.Close>
        ) : null}
      </DialogPrimitive.Content>
    </DialogPortal>
  );
}

export function DialogTitle({ className, ...props }: ComponentPropsWithoutRef<typeof DialogPrimitive.Title>) {
  return <DialogPrimitive.Title className={cn('font-display text-heading-md', className)} {...props} />;
}

export function DialogDescription({ className, ...props }: ComponentPropsWithoutRef<typeof DialogPrimitive.Description>) {
  return <DialogPrimitive.Description className={cn('text-body-sm text-ink-2', className)} {...props} />;
}
