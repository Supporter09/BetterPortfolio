import Image from 'next/image';
import type { MediaRef } from '@/content/types';
import { MediaVideo } from '@/components/ui/media-video';
import { Dither, type DitherReveal } from '@/components/ui/dither';
import { cn } from '@/lib/utils';

interface MediaFrameProps {
  media: MediaRef;
  /** LCP media (hero/portrait above the fold). */
  priority?: boolean;
  className?: string;
  /** Wrap in viewfinder corner brackets (01 §5.6). */
  viewfinder?: boolean;
  /** next/image `sizes`. */
  sizes?: string;
  /** Letterbox bars on placeholder footage (default true). */
  letterbox?: boolean;
  /** Custom-cursor label over this media (Tier A), e.g. 'VIEW' | 'PLAY' | 'EXPAND'. */
  cursorLabel?: string;
  /** Video control noun: `Pause ${videoLabel}` (default 'background video', WCAG 2.2.2). */
  videoLabel?: string;
  /** Dot-matrix dither over the content: `hover` reveals on hover/focus/toggle, `never` = faint overlay (hero). */
  dither?: DitherReveal;
}

/**
 * MediaFrame: placeholder footage (CSS layers, drift only Tier A/B), next/image, or muted inline video
 * with a real pause control. The aspect box (`media.aspect`, e.g. '16/9') reserves space → no CLS.
 */
export function MediaFrame({
  media,
  priority = false,
  className,
  viewfinder = false,
  sizes = '(min-width: 1024px) 50vw, 100vw',
  letterbox = true,
  cursorLabel,
  videoLabel = 'background video',
  dither,
}: MediaFrameProps) {
  const content = (
    <div className="relative w-full overflow-hidden bg-bg-1" style={{ aspectRatio: media.aspect }}>
      {media.kind === 'image' && media.src ? (
        <Image src={media.src} alt={media.alt} fill sizes={sizes} priority={priority} className="object-cover" />
      ) : media.kind === 'video' && media.src ? (
        <MediaVideo src={media.src} poster={media.poster} alt={media.alt} controlNoun={videoLabel} />
      ) : (
        <PlaceholderFootage media={media} letterbox={letterbox} />
      )}
    </div>
  );
  return (
    <div
      className={cn('relative', viewfinder && 'viewfinder', className)}
      data-cursor="media"
      data-cursor-label={cursorLabel}
    >
      {dither ? (
        <Dither media={media} reveal={dither}>
          {content}
        </Dither>
      ) : (
        content
      )}
    </div>
  );
}

/** Graded plate + grain + vignette only — no text label (round 2 §6); `media.alt` carries the description. */
function PlaceholderFootage({ media, letterbox }: { media: MediaRef; letterbox: boolean }) {
  return (
    <div className="footage absolute inset-0" data-tone={media.tone} role="img" aria-label={media.alt}>
      <div className="footage__plate" />
      <div className="footage__plate footage__plate--b" />
      <div className="footage__vignette" />
      <div className="footage__grain" />
      {letterbox ? <div className="footage__bars" /> : null}
    </div>
  );
}
