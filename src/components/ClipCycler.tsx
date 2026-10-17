import { useEffect, useRef, useState } from 'react';

export type Clip = { src: string; poster: string };

/* Walkthrough clips, muted and without labels. Posters are each clip's first frame. */
export const CLIPS: Record<'arrival' | 'passage' | 'villas' | 'rishikesh', Clip> = {
  arrival: { src: '/work/clip-arrival.mp4', poster: '/work/clip-arrival-poster.webp' },
  passage: { src: '/work/clip-passage.mp4', poster: '/work/clip-passage-poster.webp' },
  villas: { src: '/work/clip-villas.mp4', poster: '/work/clip-villas-poster.webp' },
  rishikesh: { src: '/work/clip-rishikesh.mp4', poster: '/work/clip-rishikesh-poster.webp' },
};

function prefersReducedMotion() {
  if (typeof window === 'undefined') return false;
  const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches || !!saveData;
}

/**
 * Plays clips one after another, crossfading between them. A single clip loops.
 * Only the current and next clip are preloaded.
 */
export default function ClipCycler({ clips, fadeMs = 1200, style, className }: {
  clips: Clip[]; fadeMs?: number; style?: React.CSSProperties; className?: string;
}) {
  const [active, setActive] = useState(0);
  const [still] = useState(prefersReducedMotion);
  const refs = useRef<(HTMLVideoElement | null)[]>([]);
  const single = clips.length === 1;

  useEffect(() => {
    if (still) return;
    const v = refs.current[active];
    if (!v) return;
    v.currentTime = 0;
    v.play().catch(() => {});
    // Fallback in case 'ended' never fires (e.g. autoplay blocked).
    const fallback = single ? undefined : window.setTimeout(() => setActive((a) => (a + 1) % clips.length), 15000);
    // Pause the previous clip once it has faded out.
    const pause = window.setTimeout(() => {
      refs.current.forEach((other, i) => { if (other && i !== active) other.pause(); });
    }, fadeMs);
    return () => { window.clearTimeout(fallback); window.clearTimeout(pause); };
  }, [active, clips.length, fadeMs, single, still]);

  const next = (active + 1) % clips.length;

  return (
    <div className={className} style={{ position: 'relative', overflow: 'hidden', ...style }} aria-hidden="true">
      {clips.map((c, i) => (
        still ? (
          i === 0 && <img key={c.src} src={c.poster} alt="" style={fill} />
        ) : (
          <video key={c.src} ref={(el) => { refs.current[i] = el; }}
            src={c.src} poster={c.poster} muted playsInline loop={single}
            preload={i === active || i === next ? 'auto' : 'none'}
            onEnded={() => { if (i === active) setActive(next); }}
            style={{ ...fill, opacity: i === active ? 1 : 0, transition: `opacity ${fadeMs}ms ease` }} />
        )
      ))}
    </div>
  );
}

const fill: React.CSSProperties = {
  position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block',
};
