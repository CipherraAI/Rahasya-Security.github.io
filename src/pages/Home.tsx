import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import EarlyAccessForm from '../components/EarlyAccessForm';
import ClipCycler, { CLIPS } from '../components/ClipCycler';
import { ACCENT, ACCENT_GRAD, BG, GREEN, LINE, MUTED, SURFACE, TEXT } from '../theme';


/* ── SVG icon system ─────────────────────────────────────── */
function Svg({ children, size = 22 }: { children: React.ReactNode; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      {children}
    </svg>
  );
}
const ICONS = {
  chat: <><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></>,
  drawing: <><path d="M3 21h18" /><path d="M5 21V7l7-4 7 4v14" /><path d="M9 21v-6h6v6" /></>,
  review: <><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="3" /></>,
  schedule: <><rect x="3" y="4" width="18" height="17" rx="2" /><path d="M3 10h18M9 4v17" /></>,
  check: <><path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></>,
  layers: <><path d="m12 2 10 5-10 5L2 7l10-5Z" /><path d="m2 17 10 5 10-5" /><path d="m2 12 10 5 10-5" /></>,
  tick: <><path d="M20 6 9 17l-5-5" /></>,
};

/* ── Motion + layout helpers ─────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (delay = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] as any, delay },
  }),
};
function FadeUp({ children, delay = 0, style, className }: {
  children: React.ReactNode; delay?: number; style?: React.CSSProperties; className?: string;
}) {
  return (
    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }}
      custom={delay} variants={fadeUp} style={style} className={className}>
      {children}
    </motion.div>
  );
}
function Eyebrow({ children, color = ACCENT }: { children: React.ReactNode; color?: string }) {
  return (
    <p className="font-semibold uppercase tracking-widest text-xs mb-4" style={{ color }}>
      {children}
    </p>
  );
}

const h2Style: React.CSSProperties = { color: TEXT, fontSize: 'clamp(1.9rem, 3.5vw, 2.6rem)', lineHeight: 1.15 };
const h3Style: React.CSSProperties = { color: TEXT, fontSize: 'clamp(1.5rem, 2.6vw, 2rem)', lineHeight: 1.2 };
const leadStyle: React.CSSProperties = { color: MUTED, lineHeight: 1.7, fontSize: '1.05rem' };

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

/* ── Hero: cycling stage showcase ────────────────────────── */
type Stage = { key: string; label: string; caption: string; src: string; paper?: boolean; clip?: boolean; ms?: number };
const STAGES: Stage[] = [
  { key: 'bubble', label: 'Bubble diagram', caption: 'Spatial planning intent', src: '/work/bubble-diagram.webp', paper: true },
  { key: 'cad', label: '2D CAD', caption: 'Generated floor plan', src: '/work/generated-plan.webp', paper: true },
  { key: 'render', label: 'Rendered 3D', caption: 'Model + render', src: '/work/mall-render.webp' },
  { key: 'enhance', label: 'Enhanced stills', caption: 'Developed visual detail', src: '/work/gallery-enhanced.webp' },
  { key: 'walk', label: 'Walkthrough', caption: 'Narrated, any duration', src: CLIPS.arrival.poster, clip: true, ms: 8000 },
];

function StageShowcase() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused) return;
    const id = window.setTimeout(() => setActive((a) => (a + 1) % STAGES.length), STAGES[active].ms ?? 3200);
    return () => clearTimeout(id);
  }, [paused, active]);
  const s = STAGES[active];

  return (
    <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}
      style={{
        background: `linear-gradient(160deg, ${SURFACE} 0%, ${BG} 100%)`,
        border: `1px solid ${LINE}`, borderRadius: 20, overflow: 'hidden',
        boxShadow: '0 30px 80px rgba(0,0,0,0.45), 0 0 0 1px rgba(107,143,255,0.06)',
      }}>
      <div className="relative" style={{ aspectRatio: '16 / 10', background: s.paper ? '#ffffff' : BG }}>
        <AnimatePresence mode="wait">
          {s.clip ? (
            <motion.div key={s.key} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }} style={{ position: 'absolute', inset: 0 }}>
              <ClipCycler clips={[CLIPS.arrival]} style={{ position: 'absolute', inset: 0 }} />
            </motion.div>
          ) : (
            <motion.img key={s.key} src={s.src} alt={`${s.label}: ${s.caption}`}
              initial={{ opacity: 0, scale: 1.02 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              style={{
                position: 'absolute', inset: 0, width: '100%', height: '100%',
                objectFit: s.paper ? 'contain' : 'cover', padding: s.paper ? 14 : 0,
              }} />
          )}
        </AnimatePresence>
        <div className="absolute left-4 bottom-4 rounded-full px-3.5 py-1.5 flex items-center gap-2"
          style={{ background: 'rgba(9,15,37,0.82)', border: `1px solid ${LINE}`, backdropFilter: 'blur(6px)' }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: GREEN }} />
          <span style={{ color: TEXT, fontSize: '0.75rem', fontWeight: 600 }}>{s.label}</span>
          <span className="hidden sm:inline" style={{ color: MUTED, fontSize: '0.75rem' }}>· {s.caption}</span>
        </div>
      </div>
      <div className="grid grid-cols-5" style={{ borderTop: `1px solid ${LINE}` }}>
        {STAGES.map((st, i) => (
          <button key={st.key} onClick={() => setActive(i)}
            className="relative px-1 py-3 text-center transition-colors text-[0.6rem] sm:text-[0.7rem]"
            style={{
              color: i === active ? TEXT : 'rgba(166,180,210,0.65)',
              fontWeight: 600, lineHeight: 1.25,
              borderLeft: i ? `1px solid ${LINE}` : 'none',
              background: i === active ? 'rgba(107,143,255,0.10)' : 'transparent',
            }}>
            {i === active && (
              <motion.span layoutId="stage-bar" className="absolute left-0 right-0 top-0"
                style={{ height: 2, background: ACCENT }} />
            )}
            {st.label}
          </button>
        ))}
      </div>
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

/* ── Team ────────────────────────────────────────────────── */
const TEAM = [
  {
    name: 'Dhruv Chopra',
    role: 'Co-founder & CEO',
    photo: '/dhruv-profile.jpeg',
    bio: 'Ex-ML Researcher at Qualcomm with deep expertise in LLM optimization and efficient inference. IITM class of 2021.',
    linkedin: 'https://www.linkedin.com/in/dhruvchopra1610/',
  },
  {
    name: 'Nithesh Hariharan',
    role: 'Co-founder & CTO',
    photo: '/nithesh-profile.jpeg',
    bio: 'Ex-Software Engineer at Microsoft, building cloud-scale orchestration and networking systems on Azure. IITM class of 2021.',
    linkedin: 'https://www.linkedin.com/in/nithesh-hariharan/',
  },
];

function TeamCard({ name, role, photo, bio, linkedin }: (typeof TEAM)[0]) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: `1px solid ${hovered ? 'rgba(107,143,255,0.55)' : LINE}`,
        borderRadius: 20,
        padding: '36px 32px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        transition: 'all 0.25s ease',
        boxShadow: hovered ? '0 20px 50px rgba(0,0,0,0.40)' : '0 1px 3px rgba(0,0,0,0.20)',
        transform: hovered ? 'translateY(-6px)' : 'none',
      }}
    >
      <div style={{
        width: 112, height: 112, borderRadius: '50%', overflow: 'hidden',
        border: `3px solid ${hovered ? '#8ab0ff' : 'rgba(255,255,255,0.20)'}`,
        boxShadow: hovered ? '0 0 24px rgba(107,143,255,0.45)' : '0 0 12px rgba(107,143,255,0.15)',
        marginBottom: 20, transition: 'all 0.25s ease', flexShrink: 0,
      }}>
        <img src={photo} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
        <h3 style={{ color: '#ffffff', fontWeight: 800, fontSize: 20 }}>{name}</h3>
        <a href={linkedin} target="_blank" rel="noopener noreferrer" aria-label={`${name} on LinkedIn`}
          style={{ display: 'flex', flexShrink: 0, color: 'rgba(255,255,255,0.50)', transition: 'color 0.2s' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#8ab0ff')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.50)')}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
          </svg>
        </a>
      </div>
      <p style={{ color: '#8ab0ff', fontSize: 13, fontWeight: 600, marginBottom: 16, letterSpacing: '0.02em' }}>{role}</p>
      <p style={{ color: MUTED, fontSize: 14, lineHeight: 1.7 }}>{bio}</p>
    </div>
  );
}

/* ── Showcase stage header ───────────────────────────────── */
function StageHeader({ n, tag, title, lead }: { n: string; tag: string; title: string; lead: string }) {
  return (
    <FadeUp className="mb-10 md:mb-12 max-w-3xl">
      <div className="flex items-baseline gap-2 mb-4" style={{ fontSize: '0.95rem' }}>
        <span className="font-bold" style={{ color: ACCENT, fontFamily: "'JetBrains Mono','Fira Code',monospace" }}>{n}</span>
        <span className="font-semibold" style={{ color: MUTED }}>{tag}</span>
      </div>
      <h3 className="font-bold mb-3" style={h3Style}>{title}</h3>
      <p style={leadStyle}>{lead}</p>
    </FadeUp>
  );
}

const WORKFLOW = [
  { id: '#plan', label: 'Bubble diagram', caption: 'Spatial planning intent', src: '/work/bubble-diagram.webp', paper: true },
  { id: '#plan', label: '2D CAD', caption: 'Generated floor plan', src: '/work/generated-plan.webp', paper: true },
  { id: '#render', label: 'Rendered 3D', caption: 'Model + render', src: '/work/mall-render.webp' },
  { id: '#enhance', label: 'Enhanced stills', caption: 'Developed visual detail', src: '/work/gallery-enhanced.webp' },
  { id: '#walkthrough', label: 'Walkthrough', caption: 'Narrated, any duration', src: CLIPS.arrival.poster },
];

export default function Home() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const el = document.querySelector(location.hash);
      if (el) {
        const headerOffset = 80;
        const top = el.getBoundingClientRect().top + window.pageYOffset - headerOffset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    }
  }, [location.pathname, location.hash]);


  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden z-10" id="hero">
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background:
            'radial-gradient(ellipse 60% 55% at 85% 10%, rgba(107,143,255,0.18) 0%, transparent 60%),' +
            'radial-gradient(ellipse 50% 50% at 5% 30%, rgba(59,111,255,0.10) 0%, transparent 55%)',
        }} />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-[1fr_1.15fr] gap-12 lg:gap-14 items-center">
            <FadeUp>
              <h1 className="font-extrabold mb-6 tracking-tight"
                style={{ color: TEXT, fontSize: 'clamp(2.5rem, 5.2vw, 4.1rem)', lineHeight: 1.05 }}>
                An Architect’s{' '}
                <span className="gradient-text">Companion</span>
              </h1>
              <p className="sm:mb-9" style={{ color: MUTED, fontSize: '1.15rem', lineHeight: 1.7, maxWidth: 540 }}>
                Cipherra is your companion for drawing, visualization, and walkthroughs. Describe what you need in architectural language, let it work with your drawings, and review every result before it moves forward.
              </p>
              <div className="hidden sm:flex sm:flex-row gap-4 sm:items-start">
                <a href="#contact"
                  className="px-7 py-3.5 rounded-full text-white font-semibold text-base text-center transition-all hover:-translate-y-0.5"
                  style={{ background: ACCENT_GRAD, boxShadow: '0 8px 28px rgba(107,143,255,0.35)' }}>
                  Get Early Access
                </a>
                <a href="#workflow"
                  className="px-7 py-3.5 rounded-full font-semibold text-base text-center transition-all hover:-translate-y-0.5"
                  style={{ background: 'rgba(255,255,255,0.04)', color: TEXT, border: `1px solid ${LINE}` }}>
                  See the Workflow
                </a>
              </div>
            </FadeUp>

            <FadeUp delay={0.15}>
              <StageShowcase />
            </FadeUp>
          </div>
        </div>
      </section>

      {/* Companion */}
      <section className="py-20 md:py-28 relative z-10" id="companion">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <FadeUp className="text-center mb-14">
            <Eyebrow>The companion</Eyebrow>
            <h2 className="font-bold mb-4" style={h2Style}>A companion for architectural work</h2>
            <p className="max-w-2xl mx-auto" style={leadStyle}>
              Describe what you need. Work with architectural tools. Review the result.
            </p>
          </FadeUp>

          <FadeUp delay={0.1}>
            <div className="max-w-6xl mx-auto rounded-2xl overflow-hidden"
              style={{ border: `1px solid ${LINE}`, boxShadow: '0 40px 90px rgba(0,0,0,0.5), 0 0 60px rgba(107,143,255,0.08)' }}>
              {/* Phones get a crop without the file panel, so the chat and drawing stay legible. */}
              <picture>
                <source media="(max-width: 767px)" srcSet="/work/companion-interface-mobile.webp" />
                <img src="/work/companion-interface.webp" alt="The Cipherra companion: a conversation alongside the open CAD drawing"
                  loading="lazy" style={{ width: '100%', display: 'block' }} />
              </picture>
            </div>
          </FadeUp>

          <div className="grid grid-cols-1 md:grid-cols-3 md:gap-5 max-w-5xl mx-auto mt-6 md:mt-12 rounded-2xl md:rounded-none overflow-hidden md:overflow-visible bg-[#121d37] md:bg-transparent border border-[#263957] md:border-0 divide-y divide-[#263957] md:divide-y-0">
            {[
              { icon: ICONS.chat, title: 'Describe the task', body: 'Explain what you need in your own architectural language, the way you would brief a colleague.' },
              { icon: ICONS.drawing, title: 'Work with the drawing', body: 'The companion uses supported CAD tools to edit and generate drawings in place, layer by layer.' },
              { icon: ICONS.review, title: 'Stay in the loop', body: 'Inspect every change, compare it against the source, and refine the request until it is right.' },
            ].map((s, i) => (
              <FadeUp key={s.title} delay={i * 0.08}>
                <div className="group md:rounded-2xl px-4 py-3.5 md:p-7 h-full flex md:block items-start gap-3.5 transition-all duration-300 md:hover:-translate-y-1.5 md:bg-[#121d37] md:border md:border-[#263957]">
                  <div className="w-8 h-8 md:w-11 md:h-11 shrink-0 rounded-lg md:rounded-xl flex items-center justify-center md:mb-5 text-white transition-transform duration-300 group-hover:scale-110"
                    style={{ background: ACCENT_GRAD, boxShadow: '0 8px 20px rgba(107,143,255,0.25)' }}>
                    <Svg size={20}>{s.icon}</Svg>
                  </div>
                  <div>
                    <h4 className="text-[0.95rem] md:text-lg font-bold mb-0.5 md:mb-2" style={{ color: TEXT }}>{s.title}</h4>
                    <p className="text-[0.82rem] md:text-[0.95rem] leading-snug md:leading-relaxed" style={{ color: MUTED }}>{s.body}</p>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow overview */}
      <section className="py-20 md:py-28 relative overflow-hidden z-10" id="workflow"
        style={{ background: `linear-gradient(160deg, ${SURFACE} 0%, ${BG} 100%)` }}>
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse 45% 50% at 50% 0%, rgba(107,143,255,0.14) 0%, transparent 60%)',
        }} />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <FadeUp className="text-center mb-14">
            <Eyebrow>The workflow</Eyebrow>
            <h2 className="font-bold mb-4" style={h2Style}>Turn architectural inputs into useful outputs</h2>
            <p className="max-w-2xl mx-auto" style={leadStyle}>
              A transformation at each stage, with review built into the process.
            </p>
          </FadeUp>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {WORKFLOW.map((w, i) => (
              <FadeUp key={w.label} delay={i * 0.07} className={i === WORKFLOW.length - 1 ? 'col-span-2 md:col-span-1' : ''}>
                <a href={w.id} className="group block h-full rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1.5"
                  style={{ background: BG, border: `1px solid ${LINE}` }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'rgba(107,143,255,0.6)')}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = LINE)}>
                  <div style={{ aspectRatio: '16 / 10', background: w.paper ? '#ffffff' : SURFACE, overflow: 'hidden' }}>
                    <img src={w.src} alt={w.label} loading="lazy"
                      className="transition-transform duration-500 group-hover:scale-105"
                      style={{ width: '100%', height: '100%', objectFit: w.paper ? 'contain' : 'cover', padding: w.paper ? 8 : 0 }} />
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold" style={{ color: ACCENT, fontSize: '0.72rem', fontFamily: "'JetBrains Mono','Fira Code',monospace" }}>0{i + 1}</span>
                      <span className="font-bold" style={{ color: TEXT, fontSize: '0.95rem' }}>{w.label}</span>
                    </div>
                    <p style={{ color: MUTED, fontSize: '0.82rem' }}>{w.caption}</p>
                  </div>
                </a>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* Showcase */}
      <section className="py-20 md:py-28 relative z-10" id="showcase">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <FadeUp className="text-center mb-16 md:mb-20">
            <Eyebrow>Showcase</Eyebrow>
            <h2 className="font-bold mb-4" style={h2Style}>Real work, stage by stage</h2>
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
              <Transformation arrow="Edit and refine"
                before={<Frame src="/work/cad-before.webp" alt="Starting mall CAD drawing with an empty atrium" label="Starting CAD drawing" paper aspect="1 / 1" />}
                after={<Frame src="/work/cad-after.webp" alt="Refined mall CAD drawing with shops, cores and grids" label="Final CAD drawing" labelColor={GREEN} paper aspect="1 / 1" />} />
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
              <CompareSlider before="/work/gallery-base.webp" after="/work/gallery-enhanced.webp"
                beforeLabel="Base gallery render" afterLabel="Enhanced gallery image" />
            </FadeUp>
          </div>

          {/* 05 Walkthrough */}
          <div id="walkthrough" className="scroll-mt-24">
            <StageHeader n="05" tag="Walkthrough"
              title="From still images to a narrated walkthrough"
              lead="Turn selected architectural views into a professional walkthrough film. Shown here: clips from two of our hospitality projects." />
            <FadeUp>
              <div className="grid grid-cols-1 lg:grid-cols-[1.65fr_1fr] gap-8 lg:gap-12 items-center">
                <div className="rounded-2xl overflow-hidden" style={{
                  border: `1px solid ${LINE}`, background: BG,
                  boxShadow: '0 40px 90px rgba(0,0,0,0.5), 0 0 60px rgba(107,143,255,0.08)',
                }}>
                  <ClipCycler narration clips={[CLIPS.passage, CLIPS.villas, CLIPS.rishikesh]} style={{ width: '100%', aspectRatio: '16 / 9' }} />
                </div>
                <div className="rounded-2xl p-7 md:p-8" style={{ background: SURFACE, border: `1px solid ${LINE}` }}>
                  <h4 className="font-bold mb-3" style={{ color: TEXT, fontSize: 'clamp(1.3rem, 2vw, 1.6rem)', lineHeight: 1.25 }}>
                    Professional walkthroughs, narrated
                  </h4>
                  <p className="mb-6" style={{ color: MUTED, fontSize: '1rem', lineHeight: 1.7 }}>
                    We produce professional walkthrough films from your reviewed architectural views, with voice-over narration that tells the story of the space. Choose any duration you prefer, from a short teaser to a full presentation film.
                  </p>
                  <ul className="space-y-3">
                    {[
                      'Voice-over narration written for your project',
                      'Any preferred duration',
                      'Sequenced from the views you approve',
                      'Presentation-ready for clients and reviews',
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-2.5" style={{ color: TEXT, fontSize: '0.95rem', lineHeight: 1.5 }}>
                        <span className="shrink-0 mt-0.5" style={{ color: GREEN }}><Svg size={16}>{ICONS.tick}</Svg></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 md:py-28 relative overflow-hidden z-10" id="team"
        style={{ background: `linear-gradient(160deg, ${SURFACE} 0%, ${BG} 100%)` }}>
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background:
            'radial-gradient(ellipse 45% 45% at 88% 8%, rgba(107,143,255,0.14) 0%, transparent 60%),' +
            'radial-gradient(ellipse 45% 45% at 8% 92%, rgba(59,111,255,0.12) 0%, transparent 60%)',
        }} />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <FadeUp className="text-center mb-14">
            <Eyebrow>Founding Team</Eyebrow>
            <h2 className="font-bold mb-4" style={h2Style}>The team behind Cipherra</h2>
            <p className="max-w-xl mx-auto" style={leadStyle}>
              Engineers from Qualcomm, Microsoft, and IIT Madras, building tools for the people who design buildings.
            </p>
          </FadeUp>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8" style={{ maxWidth: 760, margin: '0 auto' }}>
            {TEAM.map((member, i) => (
              <FadeUp key={member.name} delay={i * 0.12}>
                <TeamCard {...member} />
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* CTA / Contact */}
      <section className="py-24 md:py-32 relative overflow-hidden z-10" id="contact">
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse at center, rgba(107,143,255,0.12) 0%, transparent 70%)',
        }} />
        <div className="max-w-3xl mx-auto px-6 lg:px-8 text-center relative z-10">
          <FadeUp>
            <h2 className="font-bold mb-4" style={{ color: TEXT, fontSize: 'clamp(2rem, 4vw, 3rem)', lineHeight: 1.15 }}>
              Bring Cipherra into <span className="gradient-text">your next project</span>
            </h2>
            <p className="mb-10 max-w-xl mx-auto" style={leadStyle}>
              We're working with early architecture and design partners on real drawings and real projects. Get early access and help shape the companion.
            </p>
          </FadeUp>
          <FadeUp delay={0.1}>
            <EarlyAccessForm />
          </FadeUp>
        </div>
      </section>
    </>
  );
}
