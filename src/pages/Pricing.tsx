import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ACCENT_GRAD, BG, GREEN, LINE, SURFACE, TEXT } from '../theme';

/* Higher-contrast tones than the home page: this page is read closely, on a solid background. */
const MUTED = '#c4cee6';
const ACCENT = '#a9bcff';
const STRUCK = '#8f9cbb';

/* Services and rates, from the October 2026 pricing guide. All prices in INR, GST extra. */

/* Opens the visitor's mail app with the subject filled in. */
const MAILTO = 'mailto:contact@cipherra.ai?subject=' + encodeURIComponent('Project enquiry');

function Svg({ children, size = 20 }: { children: React.ReactNode; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {children}
    </svg>
  );
}
const ICONS = {
  plan: <><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" /></>,
  image: <><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-5-5L5 21" /></>,
  video: <><rect x="2" y="6" width="14" height="12" rx="2" /><path d="m22 8-6 4 6 4V8Z" /></>,
  mail: <><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-10 6L2 7" /></>,
};

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (delay = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] as any, delay },
  }),
};
function FadeUp({ children, delay = 0, className }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }}
      custom={delay} variants={fadeUp} className={className}>
      {children}
    </motion.div>
  );
}
function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="font-semibold uppercase tracking-widest text-xs mb-3" style={{ color: ACCENT }}>{children}</p>;
}

type Rate = { item: string; unit: string; was: string; now: string };
type Service = {
  icon: keyof typeof ICONS; title: string; note: string; rates: Rate[];
  revisions: { label: string; was?: string; now: string }[];
};

const SERVICES: Service[] = [
  {
    icon: 'plan', title: '2D CAD Drawings', note: 'Refined, clean drawing sets.',
    rates: [
      { item: 'Floor plans', unit: 'per sq ft, total area', was: '₹10 to ₹20', now: '₹5 to ₹10' },
      { item: 'Elevations', unit: 'Interior, per view', was: '₹3,000 to ₹6,000', now: '₹1,500 to ₹3,000' },
      { item: 'Elevations', unit: 'Exterior, per view', was: '₹6,000 to ₹12,000', now: '₹3,000 to ₹6,000' },
    ],
    revisions: [{ label: 'First revision', now: 'Free' }, { label: 'Further revisions', was: '₹4,000', now: '₹2,000 / edit' }],
  },
  {
    icon: 'image', title: 'Photorealistic 3D Stills', note: 'Enhanced, presentation-ready stills.',
    rates: [
      { item: 'Interior', unit: 'per still', was: '₹4,000 to ₹8,000', now: '₹2,000 to ₹4,000' },
      { item: 'Exterior', unit: 'per still', was: '₹8,000 to ₹14,000', now: '₹4,000 to ₹7,000' },
    ],
    revisions: [{ label: 'First revision', now: 'Free' }, { label: 'Further revisions', now: '70% of still rate' }],
  },
  {
    icon: 'video', title: 'Video Walkthroughs', note: 'Immersive visualization of the space.',
    rates: [
      { item: 'Per minute of video', unit: 'Billed on final video length', was: '₹50,000 to ₹80,000', now: '₹25,000 to ₹40,000' },
    ],
    revisions: [{ label: 'First 20 seconds', now: 'Free' }, { label: 'Beyond 20 seconds', was: '₹200', now: '₹100 / sec' }],
  },
];

const STEPS = [
  { title: 'Share Brief', note: 'Drawings and scope' },
  { title: 'Receive Quote', note: 'Rate by type and complexity' },
  { title: 'Confirm', note: 'Project kick-off' },
  { title: 'Deliver & Review', note: 'Revisions as per terms' },
];

const PAYMENTS = [
  { pct: '30%', when: 'On confirmation' },
  { pct: '40%', when: 'At interim review' },
  { pct: '30%', when: 'On final delivery' },
];

const card: React.CSSProperties = { background: SURFACE, border: `1px solid ${LINE}` };

/* "₹5 to ₹10" with a smaller, muted "to". */
function Range({ value }: { value: string }) {
  const parts = value.split(' to ');
  return (
    <>
      {parts.map((p, i) => (
        <span key={i}>
          {i > 0 && <span className="font-medium" style={{ color: MUTED, fontSize: '0.7em' }}> to </span>}
          {p}
        </span>
      ))}
    </>
  );
}

function ServiceCard({ s }: { s: Service }) {
  const single = s.rates.length === 1;
  return (
    <div className="rounded-2xl p-6 md:p-7 h-full flex flex-col" style={card}>
      <div className="flex items-center gap-3 pb-4 mb-2" style={{ borderBottom: `2px solid ${ACCENT}` }}>
        <span className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: 'rgba(107,143,255,0.12)', color: ACCENT }}>
          <Svg size={18}>{ICONS[s.icon]}</Svg>
        </span>
        <h3 className="font-bold" style={{ color: TEXT, fontSize: '1.1rem' }}>{s.title}</h3>
      </div>
      {s.rates.map((r) => single ? (
        <div key={r.item} className="py-4">
          <p className="font-semibold uppercase tracking-widest text-xs mb-2" style={{ color: ACCENT }}>{r.item}</p>
          <p className="line-through text-sm" style={{ color: STRUCK }}>{r.was}</p>
          <p className="font-bold" style={{ color: TEXT, fontSize: 'clamp(1.6rem, 2.6vw, 2.1rem)', lineHeight: 1.2 }}><Range value={r.now} /></p>
          <p className="mt-1 text-sm" style={{ color: MUTED }}>{r.unit}</p>
        </div>
      ) : (
        <div key={r.item + r.unit} className="flex items-start justify-between gap-4 py-4" style={{ borderBottom: `1px dashed ${LINE}` }}>
          <div>
            <p className="font-semibold" style={{ color: TEXT, fontSize: '0.98rem' }}>{r.item}</p>
            <p className="text-xs mt-0.5" style={{ color: MUTED }}>{r.unit}</p>
          </div>
          <div className="text-right shrink-0">
            <p className="line-through text-xs" style={{ color: STRUCK }}>{r.was}</p>
            <p className="font-bold" style={{ color: TEXT, fontSize: '1.2rem' }}><Range value={r.now} /></p>
          </div>
        </div>
      ))}
      <p className="py-4 text-sm" style={{ color: MUTED }}>{s.note}</p>
      <div className="mt-auto rounded-xl p-4" style={{ background: BG, border: `1px solid ${LINE}` }}>
        <p className="font-semibold uppercase tracking-widest mb-2" style={{ color: ACCENT, fontSize: '0.68rem' }}>Revisions</p>
        {s.revisions.map((v, i) => (
          <div key={v.label} className="flex items-center justify-between gap-3 py-2 text-sm"
            style={{ borderTop: i ? `1px solid ${LINE}` : undefined }}>
            <span style={{ color: MUTED }}>{v.label}</span>
            <span className="text-right">
              {v.was && <span className="line-through mr-2 text-xs" style={{ color: STRUCK }}>{v.was}</span>}
              <span className="font-semibold" style={{ color: v.now === 'Free' ? GREEN : TEXT }}>{v.now}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Pricing() {
  useEffect(() => {
    window.scrollTo(0, 0);
    const title = document.title;
    document.title = 'Pricing | Cipherra';
    return () => { document.title = title; };
  }, []);

  return (
    <>
      {/* Header + launch offer */}
      <section className="relative pt-32 pb-12 md:pt-40 md:pb-16 overflow-hidden z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <FadeUp>
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 lg:gap-12 items-center">
              <div>
                <Eyebrow>An Architect’s Companion</Eyebrow>
                <h1 className="font-extrabold mb-5 tracking-tight" style={{ color: TEXT, fontSize: 'clamp(2.4rem, 5vw, 3.8rem)', lineHeight: 1.05 }}>
                  Services & <span className="gradient-text">Pricing</span>
                </h1>
                <p style={{ color: MUTED, fontSize: '1.1rem', lineHeight: 1.7, maxWidth: 620 }}>
                  CAD drawings, photorealistic 3D stills and video walkthroughs. Rates within each range depend on project type and complexity.
                </p>
              </div>
              <div className="rounded-2xl px-8 py-6" style={{
                background: 'rgba(105,230,174,0.06)', border: `1px dashed ${GREEN}`,
                boxShadow: '0 0 50px rgba(105,230,174,0.08)',
              }}>
                <p className="font-semibold uppercase tracking-widest text-xs mb-2" style={{ color: GREEN }}>Launch offer</p>
                <p className="font-extrabold" style={{ color: TEXT, fontSize: '3rem', lineHeight: 1 }}>
                  50%<span className="ml-2 font-bold" style={{ fontSize: '1.1rem' }}>OFF</span>
                </p>
                <p className="mt-2 text-sm" style={{ color: MUTED }}>On all services.</p>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Rate card */}
      <section className="pb-16 md:pb-20 relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <FadeUp>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-8">
              <div>
                <h2 className="font-bold" style={{ color: TEXT, fontSize: 'clamp(1.6rem, 3vw, 2.1rem)' }}>Rate Card</h2>
                <p className="text-sm mt-1" style={{ color: MUTED }}>All prices in INR. GST extra.</p>
              </div>
              <div style={{ maxWidth: 440 }}>
                <div className="flex items-center gap-3 font-semibold uppercase tracking-widest" style={{ fontSize: '0.7rem' }}>
                  <span style={{ color: MUTED }}>Residential</span>
                  <span className="flex-1 h-1 rounded-full" style={{ background: 'linear-gradient(90deg, rgba(107,143,255,0.25), #3b6fff)' }} />
                  <span style={{ color: ACCENT }}>Commercial</span>
                </div>
                <p className="text-xs mt-2" style={{ color: MUTED, lineHeight: 1.6 }}>
                  Residential projects typically sit toward the lower end of each range and commercial projects toward the upper end. Final rate depends on complexity.
                </p>
              </div>
            </div>
          </FadeUp>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {SERVICES.map((s, i) => (
              <FadeUp key={s.title} delay={i * 0.08} className="h-full">
                <ServiceCard s={s} />
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="pb-16 md:pb-20 relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <FadeUp>
            <div className="rounded-2xl p-6 md:p-8" style={card}>
              <Eyebrow>How it works</Eyebrow>
              <ol className="grid grid-cols-2 md:grid-cols-4 gap-6 list-none mt-5">
                {STEPS.map((s, i) => (
                  <li key={s.title} className="text-center">
                    <span className="inline-flex w-9 h-9 rounded-full items-center justify-center font-bold text-sm mb-3"
                      style={{ background: ACCENT_GRAD, color: '#ffffff' }}>{i + 1}</span>
                    <p className="font-semibold" style={{ color: TEXT }}>{s.title}</p>
                    <p className="text-sm mt-1" style={{ color: MUTED }}>{s.note}</p>
                  </li>
                ))}
              </ol>
            </div>
          </FadeUp>

          {/* Terms */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1.4fr_1fr] gap-6 mt-6">
            <FadeUp className="h-full">
              <div className="rounded-2xl p-6 h-full" style={card}>
                <Eyebrow>Applicable to</Eyebrow>
                <p className="font-bold mb-2" style={{ color: TEXT }}>Residences & Commercial</p>
                <p className="text-sm" style={{ color: MUTED, lineHeight: 1.6 }}>Homes, offices and commercial spaces.</p>
              </div>
            </FadeUp>
            <FadeUp delay={0.08} className="h-full">
              <div className="rounded-2xl p-6 h-full" style={card}>
                <Eyebrow>Payment schedule</Eyebrow>
                <p className="font-bold mb-4" style={{ color: TEXT }}>Milestone-Based</p>
                <div className="grid grid-cols-3 gap-3">
                  {PAYMENTS.map((p, i) => (
                    <div key={p.when}>
                      <div className="h-1 rounded-full mb-3" style={{ background: ACCENT, opacity: 1 - i * 0.25 }} />
                      <p className="font-bold" style={{ color: TEXT, fontSize: '1.15rem' }}>{p.pct}</p>
                      <p className="text-xs mt-0.5" style={{ color: MUTED }}>{p.when}</p>
                    </div>
                  ))}
                </div>
              </div>
            </FadeUp>
            <FadeUp delay={0.16} className="h-full">
              <div className="rounded-2xl p-6 h-full" style={card}>
                <Eyebrow>Revisions</Eyebrow>
                <p className="font-bold mb-2" style={{ color: TEXT }}>As Listed Above</p>
                <p className="text-sm" style={{ color: MUTED, lineHeight: 1.6 }}>Free allowances included. Further revisions billed at listed rates.</p>
              </div>
            </FadeUp>
          </div>

          {/* Large-scale projects */}
          <FadeUp>
            <div className="rounded-2xl p-6 md:p-8 mt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-5"
              style={{ ...card, background: `linear-gradient(135deg, rgba(59,111,255,0.14) 0%, ${SURFACE} 70%)` }}>
              <div style={{ maxWidth: 640 }}>
                <Eyebrow>Large-scale projects</Eyebrow>
                <p className="font-bold mb-2" style={{ color: TEXT, fontSize: '1.35rem' }}>Custom Pricing on Request</p>
                <p className="text-sm" style={{ color: MUTED, lineHeight: 1.6 }}>
                  Townships, campuses and large developments are quoted per project, based on scope, area and deliverables.
                </p>
              </div>
              <a href={MAILTO} className="inline-flex items-center gap-2 font-semibold text-sm shrink-0"
                style={{ color: ACCENT }}>
                <Svg size={18}>{ICONS.mail}</Svg> contact@cipherra.ai
              </a>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Get started */}
      <section className="py-20 md:py-28 relative overflow-hidden z-10">
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse at center, rgba(107,143,255,0.14) 0%, transparent 70%)',
        }} />
        <div className="max-w-3xl mx-auto px-6 lg:px-8 text-center relative z-10">
          <FadeUp>
            <h2 className="font-bold mb-4" style={{ color: TEXT, fontSize: 'clamp(2rem, 4vw, 3rem)', lineHeight: 1.15 }}>
              Ready to <span className="gradient-text">get started?</span>
            </h2>
            <p className="mb-9 max-w-xl mx-auto" style={{ color: MUTED, lineHeight: 1.7, fontSize: '1.05rem' }}>
              Share your drawings and scope, and we’ll send a quote based on your project type and complexity. The launch offer applies to all services.
            </p>
            <a href={MAILTO}
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full text-white font-semibold text-base transition-all hover:-translate-y-0.5"
              style={{ background: ACCENT_GRAD, boxShadow: '0 8px 28px rgba(107,143,255,0.35)' }}>
              <Svg size={18}>{ICONS.mail}</Svg> Contact us to get started
            </a>
            <p className="mt-4 text-sm" style={{ color: MUTED }}>contact@cipherra.ai</p>
          </FadeUp>
        </div>
      </section>
    </>
  );
}
