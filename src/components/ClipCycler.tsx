import { useEffect, useRef, useState } from 'react';

export type Clip = { src: string; poster: string };

/* Walkthrough clips, muted and without labels. Posters are each clip's first frame. */
export const CLIPS: Record<'arrival' | 'passage' | 'villas' | 'rishikesh', Clip> = {
  arrival: { src: '/work/clip-arrival.mp4', poster: '/work/clip-arrival-poster.webp' },
  passage: { src: '/work/clip-passage.mp4', poster: '/work/clip-passage-poster.webp' },
  villas: { src: '/work/clip-villas.mp4', poster: '/work/clip-villas-poster.webp' },
  rishikesh: { src: '/work/clip-rishikesh.mp4', poster: '/work/clip-rishikesh-poster.webp' },
};

/* Seconds before the current clip ends at which the next one starts downloading. */
const PREFETCH_LEAD = 5;

function prefersReducedMotion() {
  if (typeof window === 'undefined') return false;
  const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches || !!saveData;
}

/* Resolves once the page's own content (HTML, scripts, images) has finished loading. */
function usePageLoaded() {
  const [loaded, setLoaded] = useState(() => typeof document !== 'undefined' && document.readyState === 'complete');
  useEffect(() => {
    if (loaded) return;
    const done = () => setLoaded(true);
    window.addEventListener('load', done, { once: true });
    return () => window.removeEventListener('load', done);
  }, [loaded]);
  return loaded;
}

/**
 * Plays clips one after another, crossfading between them. A single clip loops.
 * Nothing downloads until the page has loaded and the player is near the viewport;
 * the next clip is fetched only shortly before the current one ends.
 */
export default function ClipCycler({ clips, fadeMs = 1200, style, className }: {
  clips: Clip[]; fadeMs?: number; style?: React.CSSProperties; className?: string;
}) {
  const [active, setActive] = useState(0);
  const [still] = useState(prefersReducedMotion);
  const [near, setNear] = useState(false);
  const [prefetch, setPrefetch] = useState(false);
  // Clips that have rendered a frame; until then their poster shows instead.
  const [playing, setPlaying] = useState<Set<number>>(() => new Set());
  const pageLoaded = usePageLoaded();
  const box = useRef<HTMLDivElement>(null);
  const refs = useRef<(HTMLVideoElement | null)[]>([]);
  const single = clips.length === 1;
  const ready = pageLoaded && near && !still;

  useEffect(() => {
    const el = box.current;
    if (!el || near) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) setNear(true); }, { rootMargin: '400px 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, [near]);

  useEffect(() => {
    if (!ready) return;
    setPrefetch(false);
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
  }, [active, clips.length, fadeMs, single, ready]);

  const next = (active + 1) % clips.length;
  // Clips that have been given a src keep it, so a clip fading out never blanks.
  const attached = useRef(new Set<number>());

  const preloadFor = (i: number) => {
    if (!ready) return 'none';
    if (i === active) return 'auto';
    if (i === next && prefetch) return 'auto';
    return 'none';
  };

  // The poster is a plain <img> under the video rather than the video's poster attribute:
  // mobile browsers draw poster attributes letterboxed, ignoring object-fit, so the frame
  // would jump when playback starts. The video fades in only once it is actually playing.
  return (
    <div ref={box} className={className} style={{ position: 'relative', overflow: 'hidden', ...style }} aria-hidden="true">
      {clips.map((c, i) => {
        if (still) return i === 0 && <img key={c.src} src={c.poster} alt="" style={fill} />;
        const hasSrc = ready && (i === active || preloadFor(i) === 'auto' || attached.current.has(i));
        if (hasSrc) attached.current.add(i);
        const showPoster = i === active || i === next || attached.current.has(i);
        return (
          <div key={c.src} data-active={i === active || undefined}
            style={{ position: 'absolute', inset: 0, opacity: i === active ? 1 : 0, transition: `opacity ${fadeMs}ms ease` }}>
            {showPoster && <img src={c.poster} alt="" style={fill} />}
            <video ref={(el) => { refs.current[i] = el; }}
              // No src until ready, so the browser cannot start fetching early.
              src={hasSrc ? c.src : undefined}
              muted playsInline loop={single}
              preload={preloadFor(i)}
              onPlaying={() => setPlaying((p) => (p.has(i) ? p : new Set(p).add(i)))}
              onTimeUpdate={(e) => {
                if (i !== active || single || prefetch) return;
                const v = e.currentTarget;
                if (v.duration && v.duration - v.currentTime < PREFETCH_LEAD) setPrefetch(true);
              }}
              onEnded={() => { if (i === active) setActive(next); }}
              style={{ ...fill, opacity: playing.has(i) ? 1 : 0, transition: 'opacity 400ms ease' }} />
          </div>
        );
      })}
    </div>
  );
}

const fill: React.CSSProperties = {
  position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block',
};
