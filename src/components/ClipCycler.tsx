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

  return (
    <div ref={box} className={className} style={{ position: 'relative', overflow: 'hidden', ...style }} aria-hidden="true">
      {clips.map((c, i) => (
        still ? (
          i === 0 && <img key={c.src} src={c.poster} alt="" style={fill} />
        ) : (
          <video key={c.src} ref={(el) => { refs.current[i] = el; }}
            // No src until ready, so the browser cannot start fetching early.
            src={ready && (i === active || preloadFor(i) === 'auto' || attached.current.has(i))
              ? (attached.current.add(i), c.src) : undefined}
            poster={c.poster} muted playsInline loop={single}
            preload={preloadFor(i)}
            onTimeUpdate={(e) => {
              if (i !== active || single || prefetch) return;
              const v = e.currentTarget;
              if (v.duration && v.duration - v.currentTime < PREFETCH_LEAD) setPrefetch(true);
            }}
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
