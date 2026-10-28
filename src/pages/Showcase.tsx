import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import ClipCycler, { CLIPS } from '../components/ClipCycler';
import { Eyebrow, FadeUp, h2Style, h3Style, leadStyle, Svg, ICONS } from '../components/ui';
import { ACCENT, BG, GREEN, LINE, MUTED, SURFACE, TEXT } from '../theme';

/* Narrated walkthroughs in the Walkthrough stage, one captioned player each. */
const WALKTHROUGHS = [
  { clips: [CLIPS.passage, CLIPS.villas, CLIPS.rishikesh], title: 'Luxury hospitality', caption: 'A thoughtfully crafted retreat.' },
  { clips: [CLIPS.commercial], title: 'Office space', caption: 'A sharp workspace designed for professionals.' },
  { clips: [CLIPS.residence], title: 'Private residence', caption: 'A classical family home, inside and out.' },
];

/* ── Framed image (deck-style panel) ─────────────────────── */
function Frame({ src, alt, label, labelColor = ACCENT, paper, aspect = '4 / 3', fit }: {
  src: string; alt: string; label?: string; labelColor?: string;
  paper?: boolean; aspect?: string; fit?: 'cover' | 'contain';
}) {
  return (
    <div className="h-full flex flex-col">
      {label && (
        <div className="font-semibold mb-2.5" style={{ color: labelColor, fontSize: '0.8rem', letterSpacing: '0.01em' }}>
          {label}
        </div>
      )}
      <div className="rounded-2xl overflow-hidden" style={{
        background: SURFACE, border: `1px solid ${LINE}`, padding: paper ? 14 : 0,
        boxShadow: '0 24px 60px rgba(0,0,0,0.35)',
      }}>
        <div style={{ aspectRatio: aspect, background: paper ? '#ffffff' : BG, borderRadius: paper ? 8 : 0, overflow: 'hidden' }}>
          <img src={src} alt={alt} loading="lazy" style={{
            width: '100%', height: '100%', display: 'block',
            objectFit: fit ?? (paper ? 'contain' : 'cover'),
            padding: paper ? 10 : 0,
          }} />
        </div>
      </div>
    </div>
  );
}

function StepArrow({ label }: { label: string }) {
  return (
    <div className="flex lg:flex-col items-center justify-center gap-3 py-2 lg:py-0">
      <div className="flex items-center justify-center rounded-full rotate-90 lg:rotate-0"
        style={{ width: 52, height: 52, border: `1px solid ${LINE}`, background: SURFACE, color: ACCENT }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14m0 0-6-6m6 6-6 6" />
        </svg>
      </div>
      <span className="text-center font-semibold" style={{ color: MUTED, fontSize: '0.72rem', lineHeight: 1.3, maxWidth: 80 }}>
        {label}
      </span>
    </div>
  );
}

/* Before → after row */
function Transformation({ before, after, arrow }: {
  before: React.ReactNode; after: React.ReactNode; arrow: string;
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-4 lg:gap-6 items-center">
      {before}
      <StepArrow label={arrow} />
      {after}
    </div>
  );
}

/* ── Before / after slider (render → enhanced) ───────────── */
function CompareSlider({ before, after, beforeLabel, afterLabel }: {
  before: string; after: string; beforeLabel: string; afterLabel: string;
}) {
  const [pos, setPos] = useState(50);
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const move = (clientX: number) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setPos(Math.max(0, Math.min(100, ((clientX - r.left) / r.width) * 100)));
  };

  return (
    <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${LINE}`, boxShadow: '0 30px 70px rgba(0,0,0,0.45)' }}>
      <div ref={ref} className="relative select-none" style={{ aspectRatio: '16 / 9', cursor: 'ew-resize', touchAction: 'pan-y' }}
        onPointerDown={(e) => { dragging.current = true; (e.target as Element).setPointerCapture?.(e.pointerId); move(e.clientX); }}
        onPointerMove={(e) => { if (dragging.current) move(e.clientX); }}
        onPointerUp={() => { dragging.current = false; }}
        onPointerCancel={() => { dragging.current = false; }}>
        <img src={after} alt={afterLabel} draggable={false}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
        <img src={before} alt={beforeLabel} draggable={false}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', clipPath: `inset(0 ${100 - pos}% 0 0)` }} />
        <div className="absolute top-0 bottom-0" style={{ left: `${pos}%`, width: 2, marginLeft: -1, background: '#ffffff', boxShadow: '0 0 12px rgba(0,0,0,0.5)' }}>
          <div className="absolute top-1/2 left-1/2 flex items-center justify-center rounded-full"
            style={{ width: 42, height: 42, transform: 'translate(-50%, -50%)', background: '#ffffff', color: BG, boxShadow: '0 6px 20px rgba(0,0,0,0.4)' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 6-6 6 6 6M15 6l6 6-6 6" />
            </svg>
          </div>
        </div>
        <span className="absolute left-3 top-3 rounded-full px-3 py-1" style={{ background: 'rgba(9,15,37,0.80)', color: TEXT, fontSize: '0.72rem', fontWeight: 600 }}>{beforeLabel}</span>
        <span className="absolute right-3 top-3 rounded-full px-3 py-1" style={{ background: 'rgba(9,15,37,0.80)', color: GREEN, fontSize: '0.72rem', fontWeight: 600 }}>{afterLabel}</span>
      </div>
      <input type="range" min={0} max={100} value={pos} onChange={(e) => setPos(Number(e.target.value))}
        aria-label="Compare base render and enhanced image" className="sr-only" />
    </div>
  );
}

/* ── Showcase stage header ───────────────────────────────── */
function StageHeader({ n, tag, title, lead }: { n: string; tag: string; title: string; lead: string }) {
  return (
    <FadeUp className="mb-10 md:mb-12 max-w-4xl">
      <div className="flex items-start gap-4 md:gap-7">
        <span className="stage-num" aria-hidden="true">{n}</span>
        <div className="pt-1 md:pt-3 min-w-0">
          <div className="flex items-center gap-3 mb-3">
            <span className="font-semibold uppercase tracking-widest text-xs" style={{ color: ACCENT }}>
              <span className="sr-only">Stage {n}: </span>{tag}
            </span>
            <span className="h-px w-14 md:w-20" style={{ background: 'linear-gradient(90deg, rgba(107,143,255,0.8), transparent)' }} />
          </div>
          <h3 className="font-bold mb-3" style={h3Style}>{title}</h3>
          <p style={leadStyle}>{lead}</p>
        </div>
      </div>
    </FadeUp>
  );
}

/* Text panel beside a stage's media: a heading, a paragraph and a ticked list. */
function SidePanel({ title, body, items, sticky }: { title: string; body: string; items: string[]; sticky?: boolean }) {
  return (
    <div className={'rounded-2xl p-7 md:p-8' + (sticky ? ' lg:sticky lg:top-28' : '')} style={{ background: SURFACE, border: `1px solid ${LINE}` }}>
      <h4 className="font-bold mb-3" style={{ color: TEXT, fontSize: 'clamp(1.3rem, 2vw, 1.6rem)', lineHeight: 1.25 }}>
        {title}
      </h4>
      <p className="mb-6" style={{ color: MUTED, fontSize: '1rem', lineHeight: 1.7 }}>{body}</p>
      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2.5" style={{ color: TEXT, fontSize: '0.95rem', lineHeight: 1.5 }}>
            <span className="shrink-0 mt-0.5" style={{ color: GREEN }}><Svg size={16}>{ICONS.tick}</Svg></span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Showcase() {
  const location = useLocation();

  // Open at the requested stage (e.g. /showcase#walkthrough), otherwise at the top.
  useEffect(() => {
    const el = location.hash && document.querySelector(location.hash);
    if (!el) { window.scrollTo(0, 0); return; }
    const top = el.getBoundingClientRect().top + window.pageYOffset - 80;
    window.scrollTo({ top, behavior: 'smooth' });
  }, [location.pathname, location.hash]);

  useEffect(() => {
    const title = document.title;
    document.title = 'Showcase | Cipherra';
    return () => { document.title = title; };
  }, []);

  return (
    <section className="pt-32 pb-20 md:pt-40 md:pb-28 relative z-10" id="showcase">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <FadeUp className="text-center mb-16 md:mb-20">
          <Eyebrow>Showcase</Eyebrow>
          <h1 className="font-bold mb-4" style={h2Style}>Real work, stage by stage</h1>
          <p className="max-w-2xl mx-auto" style={leadStyle}>
            Every example below comes from an actual project session, shown as it was reviewed.
          </p>
        </FadeUp>

        {/* 01 Plan */}
        <div id="plan" className="scroll-mt-24 mb-24 md:mb-32">
          <StageHeader n="01" tag="Plan"
            title="From a bubble diagram to a generated CAD plan"
            lead="Turn labeled spatial intent and requirements into supported plan geometry, then review allocation and circulation before continuing in CAD." />
          <FadeUp>
            <Transformation arrow="Generate CAD"
              before={<Frame src="/work/bubble-diagram.webp" alt="Hand-sketched bubble diagram for a two-gallery mall: atrium plaza, showrooms, shops, corridors and cores" label="Bubble diagram" aspect="1 / 1" />}
              after={<Frame src="/work/generated-plan.webp" alt="Generated retail floor plan in CAD" label="Generated CAD plan" labelColor={GREEN} paper aspect="1 / 1" />} />
          </FadeUp>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-10">
            {[
              { icon: ICONS.schedule, title: 'Allocation and schedule', body: 'Requirements and reviewed planning decisions drive the layout and its schedule.' },
              { icon: ICONS.check, title: 'Geometry checks', body: 'Review circulation and advisories before anything moves downstream.' },
              { icon: ICONS.layers, title: 'Layered CAD output', body: 'Continue in your authoring workflow with a layered drawing, not a flat image.' },
            ].map((c, i) => (
              <FadeUp key={c.title} delay={i * 0.08}>
                <div className="flex items-start gap-4 rounded-2xl p-6 h-full" style={{ background: SURFACE, border: `1px solid ${LINE}` }}>
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ color: ACCENT, background: 'rgba(107,143,255,0.12)', border: '1px solid rgba(107,143,255,0.25)' }}>
                    <Svg size={20}>{c.icon}</Svg>
                  </div>
                  <div>
                    <h4 className="font-bold mb-1.5" style={{ color: TEXT }}>{c.title}</h4>
                    <p style={{ color: MUTED, fontSize: '0.9rem', lineHeight: 1.6 }}>{c.body}</p>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>

        {/* 02 Edit */}
        <div id="edit" className="scroll-mt-24 mb-24 md:mb-32">
          <StageHeader n="02" tag="Edit and refine"
            title="From a basic layout to a refined CAD drawing"
            lead="A real drawing-edit session, developed through successive requests." />
          <FadeUp>
            <div className="max-w-5xl mx-auto rounded-2xl overflow-hidden" style={{
              border: `1px solid ${LINE}`, background: '#ffffff',
              boxShadow: '0 40px 90px rgba(0,0,0,0.5), 0 0 60px rgba(107,143,255,0.08)',
            }}>
              <ClipCycler clips={[CLIPS.cadEdit]} style={{ width: '100%', aspectRatio: '16 / 9' }} />
            </div>
          </FadeUp>
        </div>

        {/* 03 Render */}
        <div id="render" className="scroll-mt-24 mb-24 md:mb-32">
          <StageHeader n="03" tag="Build and render"
            title="From 2D CAD to a rendered 3D model"
            lead="Build and render a reviewed model from the supported drawing set. Make the interiors look closer to your vision for the project." />
          <FadeUp>
            <Transformation arrow="Build and render"
              before={<Frame src="/work/mall-cad.webp" alt="Mall first-floor CAD plan" label="Mall first-floor CAD plan" paper aspect="16 / 11" />}
              after={<Frame src="/work/mall-render.webp" alt="Aerial render of the same mall" label="Rendered model of the same mall" labelColor={GREEN} aspect="16 / 11" />} />
          </FadeUp>
        </div>

        {/* 04 Enhance */}
        <div id="enhance" className="scroll-mt-24 mb-24 md:mb-32">
          <StageHeader n="04" tag="Enhance"
            title="From a render to an enhanced image"
            lead="Develop the atmosphere, light, and material detail, while reviewing the result against the original architecture. Drag to compare." />
          <FadeUp>
            <div className="grid grid-cols-1 lg:grid-cols-[1.65fr_1fr] gap-8 lg:gap-12 items-center">
              <CompareSlider before="/work/gallery-base.webp" after="/work/gallery-enhanced.webp"
                beforeLabel="Base gallery render" afterLabel="Enhanced gallery image" />
              <SidePanel title="Enhanced stills, ready to present"
                body="We take your base renders further, developing light, atmosphere and material detail while keeping the architecture true to the original. Every enhanced image is reviewed side by side with its render."
                items={[
                  'Richer light, atmosphere and materials',
                  'Architecture kept true to the base render',
                  'Reviewed side by side before delivery',
                  'High-resolution, presentation-ready output',
                ]} />
            </div>
          </FadeUp>
        </div>

        {/* 05 Walkthrough */}
        <div id="walkthrough" className="scroll-mt-24">
          <StageHeader n="05" tag="Walkthrough"
            title="From still images to a narrated walkthrough"
            lead="Turn selected architectural views into a professional walkthrough film." />
          <div className="grid grid-cols-1 lg:grid-cols-[1.65fr_1fr] gap-8 lg:gap-12 items-start">
            <div className="space-y-10 md:space-y-12">
              <p className="font-semibold uppercase tracking-widest text-xs -mb-4 md:-mb-6" style={{ color: ACCENT }}>
                Glimpses from our delivered projects
              </p>
              {WALKTHROUGHS.map((w) => (
                <FadeUp key={w.title}>
                  <figure className="m-0">
                    <div className="rounded-2xl overflow-hidden" style={{
                      border: `1px solid ${LINE}`, background: BG,
                      boxShadow: '0 40px 90px rgba(0,0,0,0.5), 0 0 60px rgba(107,143,255,0.08)',
                    }}>
                      <ClipCycler narration clips={w.clips} style={{ width: '100%', aspectRatio: '16 / 9' }} />
                    </div>
                    <figcaption className="mt-3 px-1">
                      <span className="font-semibold" style={{ color: TEXT, fontSize: '0.98rem' }}>{w.title}</span>
                      <span style={{ color: MUTED, fontSize: '0.92rem' }}> · {w.caption}</span>
                    </figcaption>
                  </figure>
                </FadeUp>
              ))}
            </div>
            {/* Stays in view while the films scroll past. */}
            <SidePanel sticky title="Professional walkthroughs, narrated"
              body="We produce professional walkthrough films from your reviewed architectural views, with voice-over narration that tells the story of the space. Choose any duration you prefer, from a short teaser to a full presentation film."
              items={[
                'Voice-over narration written for your project',
                'Any preferred duration',
                'Sequenced from the views you approve',
                'Presentation-ready for clients and reviews',
              ]} />
          </div>
        </div>
      </div>
    </section>
  );
}
