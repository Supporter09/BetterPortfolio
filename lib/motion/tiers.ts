'use client';

import { useSyncExternalStore } from 'react';
import { DESKTOP_FINE_QUERY, MOTION_CONDITIONS, MOTION_PREF_KEY } from '@/lib/motion/conditions';

export type MotionTier = 'A' | 'B' | 'C';

/** True when the visitor explicitly chose "Motion: off" (persisted in localStorage.runtime_motion). */
export function getMotionOptOut(): boolean {
  try {
    return localStorage.getItem(MOTION_PREF_KEY) === 'off';
  } catch {
    return false;
  }
}

/** Default has animation: desktop+fine is A, other is B; explicit opt-out is C. */
function computeTier(optOut = getMotionOptOut()): MotionTier {
  if (optOut) return 'C';
  return window.matchMedia(DESKTOP_FINE_QUERY).matches ? 'A' : 'B';
}

const listeners = new Set<() => void>();
let detach: (() => void) | null = null;

/** Re-evaluate the tier, mirror it on <html data-tier>, and notify subscribers. */
function syncTier() {
  const next = computeTier();
  const root = document.documentElement;
  if (root.dataset.tier !== next) root.dataset.tier = next;
  listeners.forEach((listener) => listener());
}

function subscribe(onChange: () => void): () => void {
  listeners.add(onChange);
  if (!detach) {
    const lists = [MOTION_CONDITIONS.reduce, DESKTOP_FINE_QUERY].map((q) => window.matchMedia(q));
    const onStorage = (event: StorageEvent) => {
      if (event.key === MOTION_PREF_KEY) syncTier();
    };
    lists.forEach((list) => list.addEventListener('change', syncTier));
    window.addEventListener('storage', onStorage);
    detach = () => {
      lists.forEach((list) => list.removeEventListener('change', syncTier));
      window.removeEventListener('storage', onStorage);
    };
  }
  return () => {
    listeners.delete(onChange);
    if (listeners.size === 0 && detach) {
      detach();
      detach = null;
    }
  };
}

function getSnapshot(): MotionTier {
  const t = document.documentElement.dataset.tier;
  return t === 'A' || t === 'B' || t === 'C' ? t : computeTier();
}

// SSR does not know the tier → null. Render the static (Tier C-safe) state until known; never assume 'A'.
function getServerSnapshot(): MotionTier | null {
  return null;
}

export function useMotionTier(): MotionTier | null {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/**
 * Palette/menu "Motion: on/off". Persists `localStorage.runtime_motion` (read by the boot script
 * on next load) and re-evaluates the tier live; MotionProvider reacts by stopping/starting the runtime.
 */
export function setMotionEnabled(enabled: boolean): void {
  try {
    if (enabled) localStorage.removeItem(MOTION_PREF_KEY);
    else localStorage.setItem(MOTION_PREF_KEY, 'off');
  } catch {
    // storage blocked: still apply for this page view below
  }
  if (typeof window !== 'undefined') {
    window.location.reload();
  }
}
