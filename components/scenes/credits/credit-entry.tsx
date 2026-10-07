'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { MediaFrame } from '@/components/ui/media-frame';
import { PixelIcon } from '@/components/ui/pixel-icon';
import { Rich } from '@/components/ui/rich-text';
import type { Credit } from '@/content/types';
import { cn } from '@/lib/utils';
import styles from './credits.module.css';

interface CreditEntryProps {
  credit: Credit;
}

/**
 * Minimal client island for a credit entry that includes verifiable evidence.
 * Static text entries are rendered directly by the server CreditsScene; only
 * entries with `credit.evidence` mount this interactive trigger + floating plate.
 */
export function CreditEntry({ credit }: CreditEntryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const isHoveredRef = useRef(false);
  const suppressedRef = useRef(false);
  const isPointerInteractingRef = useRef(false);
  const entryRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const buttonId = useId();
  const previewId = `${buttonId}-evidence`;

  const dismiss = () => {
    suppressedRef.current = true;
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  const open = () => {
    if (typeof document !== 'undefined') {
      document.dispatchEvent(new CustomEvent('credit-evidence-open', { detail: buttonId }));
    }
    setIsOpen(true);
  };
  // Close when tapping/clicking outside or pressing Escape (even when opened by hover with focus elsewhere)
  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (e: PointerEvent) => {
      if (entryRef.current && !entryRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        suppressedRef.current = false;
      }
    };

    const handleDocumentKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        dismiss();
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleDocumentKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleDocumentKeyDown);
    };
  }, [isOpen]);

  // Ensure only one evidence plate is open at a time across the entire achievements list
  useEffect(() => {
    const handleOtherOpen = (e: Event) => {
      const custom = e as CustomEvent<string>;
      if (custom.detail !== buttonId) {
        setIsOpen(false);
        suppressedRef.current = false;
      }
    };
    document.addEventListener('credit-evidence-open', handleOtherOpen);
    return () => {
      document.removeEventListener('credit-evidence-open', handleOtherOpen);
    };
  }, [buttonId]);
  // Elevate parent row's stacking context so floating plate renders above subsequent rows
  useEffect(() => {
    const parentRow = entryRef.current?.closest('[data-credit-row]');
    if (!parentRow) return;
    if (isOpen) {
      parentRow.setAttribute('data-evidence-open', 'true');
    } else {
      parentRow.removeAttribute('data-evidence-open');
    }
    return () => {
      parentRow.removeAttribute('data-evidence-open');
    };
  }, [isOpen]);

  const handlePointerEnter = (e: React.PointerEvent) => {
    if (e.pointerType === 'touch') return;
    isHoveredRef.current = true;
    if (!suppressedRef.current) {
      open();
    }
  };

  const handlePointerLeave = (e: React.PointerEvent) => {
    if (e.pointerType === 'touch') return;
    isHoveredRef.current = false;
    suppressedRef.current = false;
    // Keep open while keyboard focus remains inside the entry
    const focusInside = entryRef.current?.contains(document.activeElement);
    if (!focusInside) {
      setIsOpen(false);
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLElement>) => {
    // Escape suppression prevents refocusing trigger from immediately reopening
    if (suppressedRef.current) return;
    // Pointer/touch interaction will be handled by click to avoid focus/click race
    if (isPointerInteractingRef.current) return;
    // Prefer :focus-visible semantics: keyboard Tab focus reveals the preview
    let isFocusVisible = false;
    try {
      const target = (e.target as HTMLElement) ?? triggerRef.current;
      isFocusVisible = target?.matches?.(':focus-visible') ?? false;
    } catch {
      isFocusVisible = false;
    }
    if (isFocusVisible) {
      open();
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLElement>) => {
    // If focus is still inside the entry (e.g. inner interactive control), keep open
    if (entryRef.current && entryRef.current.contains(e.relatedTarget as Node | null)) {
      return;
    }
    suppressedRef.current = false;
    // Focus left the entry; hide if pointer is not hovering
    if (!isHoveredRef.current) {
      setIsOpen(false);
    }
  };

  const handleClick = () => {
    isPointerInteractingRef.current = false;
    setIsOpen((prev) => {
      const next = !prev;
      if (!next) {
        // Closed by tap/click while pointer is still over it; suppress auto-reopen until pointer leaves
        suppressedRef.current = true;
      } else {
        suppressedRef.current = false;
        if (typeof document !== 'undefined') {
          document.dispatchEvent(new CustomEvent('credit-evidence-open', { detail: buttonId }));
        }
      }
      return next;
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && isOpen) {
      e.preventDefault();
      e.stopPropagation();
      dismiss();
    }
  };

  return (
    <dd
      ref={entryRef}
      className={cn(styles.name, styles.evidenceRow, 'text-body-lg')}
      data-open={isOpen ? 'true' : undefined}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onPointerDown={() => {
        isPointerInteractingRef.current = true;
      }}
      onPointerUp={() => {
        isPointerInteractingRef.current = false;
      }}
      onPointerCancel={() => {
        isPointerInteractingRef.current = false;
      }}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
    >
      <button
        ref={triggerRef}
        type="button"
        id={buttonId}
        aria-expanded={isOpen}
        aria-controls={isOpen && credit.evidence ? previewId : undefined}
        onClick={handleClick}
        className={cn(styles.evidenceTrigger, isOpen && styles.evidenceTriggerActive)}
      >
        <span className={styles.triggerText}>
          <Rich text={credit.name} />
        </span>
        <PixelIcon name="cam" size={16} className={styles.proofCue} aria-hidden="true" />
      </button>

      {credit.detail ? (
        <span className={styles.detail}>
          <span aria-hidden="true"> · </span>
          <span className="sr-only">, </span>
          <Rich text={credit.detail} />
        </span>
      ) : null}

      {isOpen && credit.evidence ? (
        <div
          id={previewId}
          role="region"
          aria-label={`Evidence for ${credit.name}`}
          className={styles.evidencePlate}
        >
          <div className={styles.plateHeader}>
            <span className={cn(styles.plateLabel, 'label-pixel')}>
              {credit.evidence.label}
            </span>
            <span className={cn(styles.plateBadge, 'label-mono')}>
              VERIFIED
            </span>
          </div>
          <div className={styles.plateMedia}>
            <MediaFrame
              media={credit.evidence}
              viewfinder
              sizes="(min-width: 768px) 360px, 90vw"
            />
          </div>
        </div>
      ) : null}
    </dd>
  );
}
