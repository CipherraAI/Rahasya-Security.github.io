import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import EarlyAccessForm from '../components/EarlyAccessForm';
import ClipCycler, { CLIPS } from '../components/ClipCycler';
import { Eyebrow, FadeUp, h2Style, leadStyle, Svg, ICONS } from '../components/ui';
import { ACCENT, ACCENT_GRAD, BG, GREEN, LINE, MUTED, SURFACE, TEXT } from '../theme';


/* Project types we have delivered for (the scrolling banner under the hero). */
const SECTORS = ['Luxury 5-star resorts', 'Hotels', 'Commercial spaces', 'Residences'];

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

const WORKFLOW = [
  { id: '/showcase#plan', label: 'Bubble diagram', caption: 'Spatial planning intent', src: '/work/bubble-diagram.webp', paper: true },
  { id: '/showcase#plan', label: '2D CAD', caption: 'Generated floor plan', src: '/work/generated-plan.webp', paper: true },
  { id: '/showcase#render', label: 'Rendered 3D', caption: 'Model + render', src: '/work/mall-render.webp' },
  { id: '/showcase#enhance', label: 'Enhanced stills', caption: 'Developed visual detail', src: '/work/gallery-enhanced.webp' },
  { id: '/showcase#walkthrough', label: 'Walkthrough', caption: 'Narrated, any duration', src: CLIPS.arrival.poster },
];

/* Sector names scrolling sideways in a loop (two copies, the track moves by one copy's width). */
function SectorMarquee() {
  const row = [...SECTORS, ...SECTORS];
  return (
    <div className="marquee mt-7" aria-label={'Delivered projects for ' + SECTORS.join(', ')}>
      <div className="marquee-track" aria-hidden="true">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0 items-center">
            {row.map((label, i) => (
              <span key={i} className="marquee-item flex items-center shrink-0 whitespace-nowrap" style={{ color: TEXT }}>
                <span className="mx-7 md:mx-10 w-px h-6" style={{ background: 'rgba(166,180,210,0.35)' }} />
                {label}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

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

      {/* Trusted by */}
      <section className="py-12 md:py-16 relative z-10" aria-label="Trusted by" style={{
        borderTop: `1px solid ${LINE}`, borderBottom: `1px solid ${LINE}`, background: 'rgba(18,29,55,0.55)',
      }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <FadeUp>
            <h2 className="font-bold mb-2" style={{ color: TEXT, fontSize: 'clamp(1.35rem, 2.4vw, 1.8rem)', lineHeight: 1.25 }}>
              Trusted by Architecture and Interior Design Firms
            </h2>
            <p className="font-semibold uppercase tracking-widest text-xs" style={{ color: ACCENT }}>Delivered projects for</p>
          </FadeUp>
        </div>
        <SectorMarquee />
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
                <Link to={w.id} className="group block h-full rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1.5"
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
                </Link>
              </FadeUp>
            ))}
          </div>
          <FadeUp className="text-center mt-12">
            <Link to="/showcase"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-white font-semibold text-base transition-all hover:-translate-y-0.5"
              style={{ background: ACCENT_GRAD, boxShadow: '0 8px 28px rgba(107,143,255,0.35)' }}>
              Explore the showcase
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h14m0 0-6-6m6 6-6 6" />
              </svg>
            </Link>
            <p className="mt-3 text-sm" style={{ color: MUTED }}>Real work from actual project sessions, stage by stage.</p>
          </FadeUp>
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
