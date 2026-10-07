'use client';

import { useSyncExternalStore } from 'react';

const ICT_TIME = new Intl.DateTimeFormat('en-GB', {
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
  timeZone: 'Asia/Ho_Chi_Minh',
});

function subscribeMinute(onChange: () => void): () => void {
  const id = window.setInterval(onChange, 15_000);
  return () => window.clearInterval(id);
}

/** Live ICT clock `HH:MM` (no aria-live). SSR renders `--:--`; the snapshot only changes once per minute. */
export function HudClock({ className }: { className?: string }) {
  const time = useSyncExternalStore(
    subscribeMinute,
    () => ICT_TIME.format(Date.now()),
    () => '--:--',
  );
  return (
    <time className={className} dateTime={time === '--:--' ? undefined : `${time}+07:00`} suppressHydrationWarning>
      {time}
    </time>
  );
}
