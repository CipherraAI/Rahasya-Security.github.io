import { useEffect, useRef, useState } from 'react';

export type Clip = { src: string; poster: string };

/* Walkthrough clips, muted and without labels. Posters are each clip's first frame. */
export const CLIPS: Record<'arrival' | 'passage' | 'villas' | 'rishikesh' | 'cadEdit' | 'commercial' | 'residence', Clip> = {
  // Sped-up recording of a CAD edit session (house plans), shown in the Edit stage.
  cadEdit: { src: '/work/clip-cad-walls.mp4', poster: '/work/clip-cad-walls-poster.webp' },
  arrival: { src: '/work/clip-arrival.mp4', poster: '/work/clip-arrival-poster.webp' },
  passage: { src: '/work/clip-passage.mp4', poster: '/work/clip-passage-poster.webp' },
  villas: { src: '/work/clip-villas.mp4', poster: '/work/clip-villas-poster.webp' },
  rishikesh: { src: '/work/clip-rishikesh.mp4', poster: '/work/clip-rishikesh-poster.webp' },
  // 30 s narrated portfolio cuts: a commercial headquarters and a private residence.
  commercial: { src: '/work/clip-commercial.mp4', poster: '/work/clip-commercial-poster.webp' },
  residence: { src: '/work/clip-residence.mp4', poster: '/work/clip-residence-poster.webp' },
};

/* Sent when a player's narration is unmuted, so the other players fall silent. */
const NARRATION_EVENT = 'cipherra:narration';

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
export default function ClipCycler({ clips, fadeMs = 1200, style, className, narration = false }: {
  clips: Clip[]; fadeMs?: number; style?: React.CSSProperties; className?: string;
  /** Clips carry a narration track: show a mute/unmute control (muted by default). */
  narration?: boolean;
}) {
  const [active, setActive] = useState(0);
  const [still] = useState(prefersReducedMotion);
  const [near, setNear] = useState(false);
  const [visible, setVisible] = useState(false);
  const [prefetch, setPrefetch] = useState(false);
  // Clips that have rendered a frame; until then their poster shows instead.
  const [playing, setPlaying] = useState<Set<number>>(() => new Set());
  const [soundOn, setSoundOn] = useState(false);
  const [hinted, setHinted] = useState(false);
  // Mouse users click, touch users tap.
  const [verb] = useState(() => (window.matchMedia?.('(hover: hover) and (pointer: fine)').matches ? 'Click' : 'Tap'));
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

  // Whether the player is actually on screen (at least a fifth of it) in a visible tab.
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    let onScreen = false;
    const update = () => setVisible(onScreen && document.visibilityState === 'visible');
    const io = new IntersectionObserver(([e]) => { onScreen = e.intersectionRatio >= 0.2; update(); }, { threshold: [0, 0.2, 0.5] });
    io.observe(el);
    document.addEventListener('visibilitychange', update);
    return () => { io.disconnect(); document.removeEventListener('visibilitychange', update); };
  }, []);

  // A newly active clip starts from the top.
  useEffect(() => {
    if (!ready) return;
    setPrefetch(false);
    const v = refs.current[active];
    if (v) v.currentTime = 0;
    // Pause the previous clip once it has faded out.
    const pause = window.setTimeout(() => {
      refs.current.forEach((other, i) => { if (other && i !== active) other.pause(); });
    }, fadeMs);
    return () => window.clearTimeout(pause);
  }, [active, fadeMs, ready]);

  // Play only while on screen; scrolling back resumes from where it paused.
  useEffect(() => {
    if (!ready) return;
    const v = refs.current[active];
    if (!v) return;
    if (!visible) { v.pause(); return; }
    v.play().catch(() => {});
    // Fallback in case 'ended' never fires (e.g. autoplay blocked).
    const fallback = single ? undefined : window.setTimeout(() => setActive((a) => (a + 1) % clips.length), 15000);
    return () => window.clearTimeout(fallback);
  }, [active, clips.length, single, ready, visible]);

  // Only the clip on screen is audible, so narration follows the crossfade.
  // (Set as a property: React does not keep the muted attribute in sync after mount.)
  useEffect(() => {
    refs.current.forEach((v, i) => { if (v) v.muted = !(soundOn && i === active); });
  }, [soundOn, active]);

  // One narration at a time: unmuting this player mutes any other on the page.
  useEffect(() => {
    if (!narration) return;
    const onOther = (e: Event) => { if ((e as CustomEvent).detail !== box.current) setSoundOn(false); };
    window.addEventListener(NARRATION_EVENT, onOther);
    return () => window.removeEventListener(NARRATION_EVENT, onOther);
  }, [narration]);

  const toggleSound = () => {
    setHinted(true);
    if (!soundOn) window.dispatchEvent(new CustomEvent(NARRATION_EVENT, { detail: box.current }));
    setSoundOn((on) => {
      // Unmute in the click handler itself (browsers allow sound only from a user gesture);
      // playback simply continues from where it is.
      const v = refs.current[active];
      if (v) v.muted = on;
      return !on;
    });
  };

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
    <div ref={box} className={className} style={{ position: 'relative', overflow: 'hidden', ...style }}>
      {clips.map((c, i) => {
        if (still) return i === 0 && <img key={c.src} src={c.poster} alt="" aria-hidden="true" style={fill} />;
        const hasSrc = ready && (i === active || preloadFor(i) === 'auto' || attached.current.has(i));
        if (hasSrc) attached.current.add(i);
        const showPoster = i === active || i === next || attached.current.has(i);
        return (
          <div key={c.src} data-active={i === active || undefined} aria-hidden="true"
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
      {narration && !still && (
        <div className="absolute left-3 bottom-3 flex items-center gap-2" style={{ zIndex: 2 }}>
          <button type="button" onClick={toggleSound}
            aria-label={soundOn ? 'Mute narration' : 'Unmute to hear narration'} aria-pressed={soundOn}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-transform hover:scale-105"
            style={{ background: 'rgba(9,15,37,0.78)', border: '1px solid rgba(255,255,255,0.22)', color: '#fff', backdropFilter: 'blur(6px)' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 5 6 9H3v6h3l5 4V5z" />
              {soundOn
                ? <><path d="M15.5 8.5a5 5 0 0 1 0 7" /><path d="M18.5 5.5a9 9 0 0 1 0 13" /></>
                : <><path d="m16 9 5 6" /><path d="m21 9-5 6" /></>}
            </svg>
          </button>
          {!hinted && (
            <span className="relative text-xs font-semibold px-2.5 py-1.5 rounded-md pointer-events-none"
              style={{ background: 'rgba(255,255,255,0.94)', color: '#0b1430', boxShadow: '0 4px 14px rgba(0,0,0,0.3)' }}>
              <span aria-hidden="true" style={{
                position: 'absolute', left: -5, top: '50%', transform: 'translateY(-50%)',
                borderTop: '5px solid transparent', borderBottom: '5px solid transparent', borderRight: '5px solid rgba(255,255,255,0.94)',
              }} />
              {verb} to hear narration
            </span>
          )}
        </div>
      )}
    </div>
  );
}

const fill: React.CSSProperties = {
  position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block',
};
