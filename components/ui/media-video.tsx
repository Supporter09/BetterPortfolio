'use client';

import { useEffect, useRef, useState } from 'react';
import { useMotionTier } from '@/lib/motion/tiers';
import { PixelIcon } from '@/components/ui/pixel-icon';

interface MediaVideoProps {
  src: string;
  poster?: string;
  alt: string;
  /** Noun for the control label: `Pause ${controlNoun}` / `Play ${controlNoun}`. */
  controlNoun: string;
}

interface NetworkInformationLike {
  saveData?: boolean;
  effectiveType?: string;
}

/**
 * Muted, inline, looping video with an always-visible Pause/Play button (01 §5.11, WCAG 2.2.2).
 * Autoplays only in Tier A/B, when ≥50% visible, and not on Save-Data / slow connections;
 * Tier C shows the poster and waits for the visitor to press Play.
 */
export function MediaVideo({ src, poster, alt, controlNoun }: MediaVideoProps) {
  const tier = useMotionTier();
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [userPaused, setUserPaused] = useState(false);

  useEffect(() => {
    const video = ref.current;
    if (!video || userPaused || (tier !== 'A' && tier !== 'B')) return;
    const connection = (navigator as Navigator & { connection?: NetworkInformationLike }).connection;
    if (connection?.saveData || ['slow-2g', '2g', '3g'].includes(connection?.effectiveType ?? '')) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) video.play().catch(() => setPlaying(false));
        else video.pause();
      },
      { threshold: 0.5 },
    );
    io.observe(video);
    return () => io.disconnect();
  }, [tier, userPaused]);

  const toggle = () => {
    const video = ref.current;
    if (!video) return;
    if (video.paused) {
      setUserPaused(false);
      video.play().catch(() => setPlaying(false));
    } else {
      setUserPaused(true);
      video.pause();
    }
  };

  return (
    <>
      <video
        ref={ref}
        className="absolute inset-0 size-full object-cover"
        src={src}
        poster={poster}
        muted
        playsInline
        loop
        preload="none"
        aria-label={alt}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />
      <button
        type="button"
        onClick={toggle}
        aria-label={`${playing ? 'Pause' : 'Play'} ${controlNoun}`}
        className="absolute bottom-3 left-3 z-[5] inline-flex size-11 items-center justify-center rounded-sm bg-bg-0/70 text-ink-2 transition-colors hover-fine:text-ink"
      >
        <PixelIcon name={playing ? 'pause' : 'play'} size={24} />
      </button>
    </>
  );
}
