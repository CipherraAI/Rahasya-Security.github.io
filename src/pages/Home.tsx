import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';

const G = '#0026a4';
const G_LIGHT = '#0026a4';
const HEADING = '#0d1230';
const BODY = 'rgba(13,18,48,0.60)';
const ACCENT_GRAD = 'linear-gradient(135deg, #0026a4 0%, #3b6fff 100%)';

const cardClass =
  'group bg-white rounded-2xl border border-[rgba(0,38,164,0.10)] shadow-[0_1px_3px_rgba(13,18,48,0.05)] ' +
  'transition-all duration-300 hover:-translate-y-1.5 hover:border-[rgba(0,38,164,0.35)] ' +
  'hover:shadow-[0_20px_50px_rgba(0,38,164,0.14)]';

/* ── SVG icon system ─────────────────────────────────────── */
function Svg({ children }: { children: React.ReactNode }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      {children}
    </svg>
  );
}
const ICONS = {
  duplicate: <><rect x="9" y="9" width="11" height="11" rx="2" /><path d="M5 15V5a2 2 0 0 1 2-2h10" /></>,
  collision: <><path d="M13 2 3 14h7l-1 8 10-12h-7l1-8Z" /></>,
  warn: <><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" /><path d="M12 9v4M12 17h.01" /></>,
  plug: <><path d="M12 22v-5M9 8V2M15 8V2M6 8h12v2a6 6 0 0 1-12 0V8Z" /></>,
  memory: <><ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M3 5v14a9 3 0 0 0 18 0V5" /><path d="M3 12a9 3 0 0 0 18 0" /></>,
  lock: <><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></>,
  merge: <><circle cx="18" cy="18" r="3" /><circle cx="6" cy="6" r="3" /><path d="M6 9v3a9 9 0 0 0 9 9" /></>,
  platform: <><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" /></>,
  cube: <><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" /><path d="m3.3 7 8.7 5 8.7-5M12 22V12" /></>,
  route: <><circle cx="6" cy="19" r="3" /><circle cx="18" cy="5" r="3" /><path d="M12 19h4.5a2.5 2.5 0 0 0 0-5h-8a2.5 2.5 0 0 1 0-5H9" /></>,
  plan: <><path d="M9 11H3v10h6V11ZM21 3h-6v18h6V3ZM15 7H9v14h6V7Z" /></>,
  code: <><path d="m8 6-6 6 6 6M16 6l6 6-6 6" /></>,
  review: <><path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></>,
  fix: <><path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.6 2.6-2-2 2.6-2.6Z" /></>,
};

/* ── Hero agent-to-agent chat ────────────────────────────── */
type Msg = { from: 'A' | 'B' | 'sys'; tag?: string; text: React.ReactNode };
const Mono: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <code style={{ fontFamily: "'JetBrains Mono','Fira Code',monospace", fontSize: '0.82em', color: '#cdd9ff' }}>{children}</code>
);
const THREAD: Msg[] = [
  { from: 'A', tag: 'request', text: <>You own <Mono>auth.py</Mono>. Can you make <Mono>login()</Mono> accept an OAuth token?</> },
  { from: 'B', tag: 'acknowledge', text: <>On it. Claiming <Mono>auth.py:login()</Mono>.</> },
  { from: 'B', tag: 'result', text: <>Done. <Mono>login(token) → Session</Mono>. Saved the new signature to shared memory.</> },
  { from: 'A', tag: 'recall', text: <>Recalled it. Wiring my caller to match the new signature.</> },
  { from: 'sys', text: <>Patches merged clean · compiles ✓</> },
];

const AGENTS = {
  A: { name: 'Agent A', color: '#6b8fff', bg: 'rgba(107,143,255,0.14)', border: 'rgba(107,143,255,0.30)' },
  B: { name: 'Agent B', color: '#fbbf24', bg: 'rgba(251,191,36,0.14)', border: 'rgba(251,191,36,0.30)' },
};

function Avatar({ who }: { who: 'A' | 'B' }) {
  const a = AGENTS[who];
  return (
    <span className="flex items-center justify-center shrink-0 rounded-full font-bold"
      style={{ width: 26, height: 26, fontSize: '0.72rem', color: '#0a1030', background: a.color }}>
      {who}
    </span>
  );
}

function TypingDots({ who }: { who: 'A' | 'B' }) {
  const a = AGENTS[who];
  const right = who === 'B';
  return (
    <div className={`flex items-end gap-2 ${right ? 'flex-row-reverse' : ''}`}>
      <Avatar who={who} />
      <div className="flex items-center gap-1 rounded-2xl px-3 py-2.5"
        style={{ background: a.bg, border: `1px solid ${a.border}`, borderBottomLeftRadius: right ? 16 : 4, borderBottomRightRadius: right ? 4 : 16 }}>
        {[0, 1, 2].map((i) => (
          <motion.span key={i} style={{ width: 5, height: 5, borderRadius: '50%', background: a.color, display: 'inline-block' }}
            animate={{ opacity: [0.3, 1, 0.3], y: [0, -2, 0] }}
            transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }} />
        ))}
      </div>
    </div>
  );
}

function CoordinationPanel() {
  const [shown, setShown] = useState(0);
  const [typing, setTyping] = useState<'A' | 'B' | null>(null);

  useEffect(() => {
    let cancelled = false;
    const timers: number[] = [];
    const wait = (ms: number, fn: () => void) => timers.push(window.setTimeout(() => { if (!cancelled) fn(); }, ms));

    const run = (i: number) => {
      if (i >= THREAD.length) {
        wait(3000, () => { setShown(0); setTyping(null); run(0); });
        return;
      }
      const msg = THREAD[i];
      if (msg.from === 'sys') {
        wait(600, () => { setShown(i + 1); wait(900, () => run(i + 1)); });
      } else {
        setTyping(msg.from);
        wait(1000, () => {
          setTyping(null);
          setShown(i + 1);
          wait(750, () => run(i + 1));
        });
      }
    };
    run(0);
    return () => { cancelled = true; timers.forEach(clearTimeout); };
  }, []);

  return (
    <div
      style={{
        background: 'linear-gradient(160deg, #0a1030 0%, #05081c 100%)',
        border: '1px solid rgba(107,143,255,0.22)',
        borderRadius: 18,
        boxShadow: '0 30px 70px rgba(0,38,164,0.28)',
        overflow: 'hidden',
      }}
    >
      {/* title bar */}
      <div className="flex items-center gap-1.5 px-5 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f57' }} />
        <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#febc2e' }} />
        <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#28c840' }} />
        <span className="mx-auto flex items-center gap-2" style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.72rem' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#34d399' }} />
          cipherra · shared coordination layer
        </span>
      </div>

      {/* chat thread (newest anchored to bottom) */}
      <div className="flex flex-col justify-end gap-3 px-5 py-5" style={{ height: 430 }}>
        {THREAD.slice(0, shown).map((m, i) => {
          if (m.from === 'sys') {
            return (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }} className="flex justify-center">
                <span className="flex items-center gap-2 rounded-full px-3.5 py-1.5" style={{
                  background: 'rgba(52,211,153,0.14)', border: '1px solid rgba(52,211,153,0.35)',
                  color: '#6ee7b7', fontSize: '0.74rem', fontWeight: 600,
                }}>{m.text}</span>
              </motion.div>
            );
          }
          const a = AGENTS[m.from];
          const right = m.from === 'B';
          return (
            <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }} className={`flex items-end gap-2 ${right ? 'flex-row-reverse' : ''}`}>
              <Avatar who={m.from} />
              <div className="rounded-2xl px-3.5 py-2.5" style={{
                maxWidth: '82%', background: a.bg, border: `1px solid ${a.border}`,
                borderBottomLeftRadius: right ? 16 : 4, borderBottomRightRadius: right ? 4 : 16,
              }}>
                {m.tag && (
                  <div className="mb-1 font-semibold uppercase" style={{ color: a.color, fontSize: '0.6rem', letterSpacing: '0.08em' }}>
                    {m.tag}
                  </div>
                )}
                <div style={{ color: 'rgba(255,255,255,0.90)', fontSize: '0.82rem', lineHeight: 1.5 }}>{m.text}</div>
              </div>
            </motion.div>
          );
        })}
        {typing && <TypingDots who={typing} />}
      </div>
    </div>
  );
}

/* ── Shared dark-panel primitives ────────────────────────── */
const AG: Record<string, string> = { A: '#6b8fff', B: '#fbbf24', C: '#a78bfa' };
const monoFont: React.CSSProperties = { fontFamily: "'JetBrains Mono','Fira Code',monospace" };
const panelStyle: React.CSSProperties = {
  background: 'linear-gradient(160deg, #0a1030 0%, #05081c 100%)',
  border: '1px solid rgba(107,143,255,0.22)',
  borderRadius: 18,
  boxShadow: '0 30px 70px rgba(0,38,164,0.28)',
  overflow: 'hidden',
};
function PanelBar({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-1.5 px-5 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
      <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f57' }} />
      <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#febc2e' }} />
      <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#28c840' }} />
      <span className="mx-auto" style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.72rem' }}>{label}</span>
    </div>
  );
}
function Letter({ who, dim }: { who: string; dim?: boolean }) {
  return (
    <span className="flex items-center justify-center rounded-full font-bold shrink-0"
      style={{ width: 22, height: 22, fontSize: '0.66rem', color: '#0a1030', background: AG[who], opacity: dim ? 0.3 : 1, transition: 'opacity 0.3s' }}>
      {who}
    </span>
  );
}

/* ── Bidding / ownership auction ─────────────────────────── */
function BiddingPanel() {
  const TOTAL = 9;
  const [step, setStep] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setStep((s) => (s >= TOTAL ? 0 : s + 1)), 950);
    return () => clearInterval(id);
  }, []);
  const regions = [
    { file: 'auth.py', bidsAt: 1, bidders: ['A', 'B'], owner: 'A', allocAt: 5 },
    { file: 'api.py', bidsAt: 2, bidders: ['B', 'C'], owner: 'B', allocAt: 6 },
    { file: 'utils.py', bidsAt: 3, bidders: ['A', 'C'], owner: 'C', allocAt: 7 },
  ];
  const allocating = step >= 4 && step < 8;
  const done = step >= 8;
  return (
    <div style={panelStyle}>
      <PanelBar label="orchestrator · ownership auction" />
      <div className="px-5 py-5" style={{ minHeight: 296 }}>
        <div className="flex items-center gap-2 mb-4" style={{ fontSize: '0.72rem' }}>
          <motion.span animate={{ opacity: done ? 1 : [1, 0.3, 1] }} transition={{ duration: 1, repeat: done ? 0 : Infinity }}
            style={{ width: 7, height: 7, borderRadius: '50%', background: done ? '#34d399' : '#6b8fff', display: 'inline-block' }} />
          <span style={{ color: 'rgba(255,255,255,0.55)' }}>
            {done ? 'all regions assigned · no overlap' : allocating ? 'orchestrator allocating…' : 'collecting bids…'}
          </span>
        </div>
        <div className="space-y-2.5">
          {regions.map((r) => {
            const allocated = step >= r.allocAt;
            const bidding = step >= r.bidsAt && !allocated;
            return (
              <div key={r.file} className="flex items-center justify-between rounded-lg px-3 py-2.5"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <span style={{ ...monoFont, color: 'rgba(255,255,255,0.80)', fontSize: '0.8rem' }}>{r.file}</span>
                {allocated ? (
                  <motion.span initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-1.5 rounded-full px-2.5 py-1"
                    style={{ background: `${AG[r.owner]}22`, border: `1px solid ${AG[r.owner]}55`, fontSize: '0.7rem', color: '#fff' }}>
                    <Letter who={r.owner} /> owns ✓
                  </motion.span>
                ) : bidding ? (
                  <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-1.5">
                    {r.bidders.map((b) => <Letter key={b} who={b} />)}
                    <span style={{ color: 'rgba(255,255,255,0.40)', fontSize: '0.68rem' }}>bidding</span>
                  </motion.div>
                ) : (
                  <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.7rem' }}>waiting</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ── Shared memory reuse ─────────────────────────────────── */
function MemoryPanel() {
  const TOTAL = 5;
  const [step, setStep] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setStep((s) => (s >= TOTAL ? 0 : s + 1)), 1100);
    return () => clearInterval(id);
  }, []);
  const entries = [
    { at: 1, by: 'A', text: 'login() → Session' },
    { at: 2, by: 'B', text: 'JWT ttl = 900s' },
  ];
  const recallAt = 3;
  const noteAt = 4;
  return (
    <div style={panelStyle}>
      <PanelBar label="shared memory" />
      <div className="px-5 py-5 flex flex-col" style={{ minHeight: 296 }}>
        <div style={{ color: 'rgba(255,255,255,0.30)', fontSize: '0.62rem', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>
          recorded insights
        </div>
        <div className="space-y-2.5 mb-4">
          {entries.map((e, i) => {
            if (step < e.at) return <div key={i} style={{ height: 42 }} />;
            const highlight = i === 0 && step >= recallAt;
            return (
              <motion.div key={i} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2.5 rounded-lg px-3 py-2.5"
                style={{
                  background: highlight ? 'rgba(52,211,153,0.12)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${highlight ? 'rgba(52,211,153,0.40)' : 'rgba(255,255,255,0.07)'}`,
                  transition: 'background 0.3s, border-color 0.3s',
                }}>
                <Letter who={e.by} />
                <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.7rem' }}>wrote</span>
                <span style={{ ...monoFont, color: 'rgba(255,255,255,0.85)', fontSize: '0.78rem' }}>{e.text}</span>
                {highlight && <span className="ml-auto" style={{ color: '#6ee7b7', fontSize: '0.64rem', fontWeight: 700, letterSpacing: '0.05em' }}>REUSED</span>}
              </motion.div>
            );
          })}
        </div>

        {step >= recallAt && (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2.5">
            <Letter who="C" />
            <span style={{ color: 'rgba(255,255,255,0.60)', fontSize: '0.78rem' }}>
              recalls <span style={{ ...monoFont, color: '#cdd9ff' }}>login()</span> instead of re-deriving it
            </span>
          </motion.div>
        )}

        {step >= noteAt && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-auto pt-4">
            <span className="flex items-center gap-2 rounded-full px-3 py-1.5 w-fit"
              style={{ background: 'rgba(52,211,153,0.12)', border: '1px solid rgba(52,211,153,0.35)', color: '#6ee7b7', fontSize: '0.72rem', fontWeight: 600 }}>
              2 insights shared · 0 re-derived
            </span>
          </motion.div>
        )}
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
        background: 'rgba(255,255,255,0.05)',
        border: `1px solid ${hovered ? 'rgba(107,143,255,0.55)' : 'rgba(255,255,255,0.12)'}`,
        borderRadius: 20,
        padding: '36px 32px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        transition: 'all 0.25s ease',
        boxShadow: hovered ? '0 20px 50px rgba(0,38,164,0.35)' : '0 1px 3px rgba(0,0,0,0.20)',
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
        <a href={linkedin} target="_blank" rel="noopener noreferrer"
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
      <p style={{ color: 'rgba(255,255,255,0.60)', fontSize: 14, lineHeight: 1.7 }}>{bio}</p>
    </div>
  );
}

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
function Eyebrow({ children, light }: { children: React.ReactNode; light?: boolean }) {
  return (
    <p className="font-semibold uppercase tracking-widest text-xs mb-4"
      style={{ color: light ? '#8ab0ff' : G_LIGHT }}>
      {children}
    </p>
  );
}
function IconChip({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 text-white transition-transform duration-300 group-hover:scale-110"
      style={{ background: ACCENT_GRAD, boxShadow: '0 8px 20px rgba(0,38,164,0.30)' }}>
      {children}
    </div>
  );
}

const h2Style: React.CSSProperties = { color: HEADING, fontSize: 'clamp(1.9rem, 3.5vw, 2.6rem)', lineHeight: 1.15 };
const leadStyle: React.CSSProperties = { color: BODY, lineHeight: 1.7, fontSize: '1.05rem' };
const PIPELINE = [
  { icon: ICONS.plan, label: 'Planner' },
  { icon: ICONS.code, label: 'Coders' },
  { icon: ICONS.review, label: 'Reviewer' },
  { icon: ICONS.fix, label: 'Fixer' },
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
      <section className="relative pt-36 pb-20 md:pt-44 md:pb-28 overflow-hidden z-10" id="hero">
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background:
            'radial-gradient(ellipse 70% 55% at 80% 0%, rgba(59,111,255,0.14) 0%, transparent 60%),' +
            'radial-gradient(ellipse 60% 50% at 10% 20%, rgba(0,38,164,0.08) 0%, transparent 55%)',
        }} />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <FadeUp>
              <h1 className="font-extrabold mb-6 tracking-tight"
                style={{ color: HEADING, fontSize: 'clamp(2.5rem, 5vw, 4rem)', lineHeight: 1.06 }}>
                Multiple coding agents. One codebase.{' '}
                <span className="gradient-text">Zero merge chaos.</span>
              </h1>
              <p className="mb-9" style={{ color: BODY, fontSize: '1.15rem', lineHeight: 1.7, maxWidth: 560 }}>
                When several AI agents edit the same repository in parallel, they duplicate work, overwrite each other, and produce patches that don't merge. Cipherra gives them a shared coordination layer: ownership, shared memory, and structured hand-offs, so a team of agents behaves like a coordinated engineering team instead of colliding individuals.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start">
                <a href="#contact"
                  className="px-7 py-3.5 rounded-full text-white font-semibold text-base transition-all hover:-translate-y-0.5"
                  style={{ background: ACCENT_GRAD, boxShadow: '0 8px 24px rgba(0,38,164,0.30)' }}>
                  Get Early Access
                </a>
                <a href="#how-it-works"
                  className="px-7 py-3.5 rounded-full font-semibold text-base transition-all"
                  style={{ background: '#ffffff', color: G, border: '1px solid rgba(0,38,164,0.25)' }}>
                  See How It Works
                </a>
              </div>
            </FadeUp>

            <FadeUp delay={0.15}>
              <CoordinationPanel />
            </FadeUp>
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="py-20 md:py-28 relative z-10" id="problem">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <FadeUp className="text-center mb-14">
            <Eyebrow>The problem</Eyebrow>
            <h2 className="font-bold mb-4" style={h2Style}>More agents shouldn't mean more chaos</h2>
            <p className="max-w-2xl mx-auto" style={leadStyle}>
              Frontier coding runs multiple agents in parallel, but they have no way to coordinate on shared code. Adding more agents often makes runs worse, not better. Coordination, not raw model power, is the bottleneck.
            </p>
          </FadeUp>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-4xl mx-auto">
            {[
              { icon: ICONS.duplicate, title: 'Duplicated effort', body: 'Agents re-derive the same facts and re-read the same files, over and over.' },
              { icon: ICONS.collision, title: 'Collisions', body: 'Two agents edit the same function; their patches conflict at merge time.' },
              { icon: ICONS.warn, title: 'Silent build breaks', body: 'Each adds the same new helper; the merge is "clean" but doesn\'t compile.' },
              { icon: ICONS.plug, title: 'Interface mismatches', body: 'One agent expects a signature the other never delivered.' },
            ].map((p, i) => (
              <FadeUp key={p.title} delay={i * 0.08}>
                <div className={`${cardClass} p-6 h-full`} style={{ color: G }}>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 text-white"
                      style={{ background: ACCENT_GRAD, boxShadow: '0 6px 16px rgba(0,38,164,0.28)' }}>
                      <Svg>{p.icon}</Svg>
                    </div>
                    <div>
                      <h4 className="text-lg font-bold mb-1.5" style={{ color: HEADING }}>{p.title}</h4>
                      <p style={{ color: BODY, fontSize: '0.92rem', lineHeight: 1.65 }}>{p.body}</p>
                    </div>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* How it works (dark band) */}
      <section className="py-20 md:py-28 relative overflow-hidden z-10" id="how-it-works"
        style={{ background: 'linear-gradient(160deg, #05081c 0%, #0c1233 100%)' }}>
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background:
            'radial-gradient(ellipse 45% 45% at 12% 8%, rgba(107,143,255,0.18) 0%, transparent 60%),' +
            'radial-gradient(ellipse 45% 45% at 90% 92%, rgba(0,38,164,0.30) 0%, transparent 60%)',
        }} />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <FadeUp className="text-center mb-16">
            <Eyebrow light>How it works</Eyebrow>
            <h2 className="font-bold mb-4" style={{ color: '#ffffff', fontSize: 'clamp(1.9rem, 3.5vw, 2.6rem)', lineHeight: 1.15 }}>A coordination layer agents share</h2>
            <p className="max-w-2xl mx-auto" style={{ color: 'rgba(255,255,255,0.65)', lineHeight: 1.7, fontSize: '1.05rem' }}>
              Cipherra borrows the model of cache coherence, how CPU cores share memory without corrupting it, and applies it to agents sharing a codebase. It's model-agnostic and drops in as a shared service the agents talk to.
            </p>
          </FadeUp>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-8">
            {[
              { icon: ICONS.memory, title: 'Shared memory', body: 'An agent records a derived insight (a signature, a contract, a gotcha) and teammates recall exactly what they need instead of re-deriving it. Stale premises are invalidated automatically.' },
              { icon: ICONS.lock, title: 'Ownership', body: 'An agent claims a code region before editing it. If it\'s unowned, it becomes the sole writer; if a teammate owns it, the agent asks instead of editing, so patches merge cleanly by construction.' },
              { icon: ICONS.merge, title: 'New-symbol coordination', body: 'Catches the case where two agents independently add the same new function or symbol (a clean git merge that fails to compile) and routes them to reuse one definition.' },
            ].map((step, i) => (
              <FadeUp key={step.title} delay={i * 0.08}>
                <div className="group rounded-2xl p-8 h-full border border-white/10 transition-all duration-300 hover:-translate-y-1.5 hover:border-[rgba(107,143,255,0.45)] hover:shadow-[0_20px_50px_rgba(0,38,164,0.35)]"
                  style={{ background: 'rgba(255,255,255,0.05)' }}>
                  <IconChip><Svg>{step.icon}</Svg></IconChip>
                  <h3 className="text-xl font-bold mb-3" style={{ color: '#ffffff' }}>{step.title}</h3>
                  <p style={{ color: 'rgba(255,255,255,0.65)', lineHeight: 1.7, fontSize: '0.95rem' }}>{step.body}</p>
                </div>
              </FadeUp>
            ))}
          </div>

          {/* Structured hand-offs pipeline */}
          <FadeUp delay={0.1}>
            <div className="max-w-5xl mx-auto rounded-2xl p-8 md:p-10"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)' }}>
              <div className="text-center mb-8">
                <h3 className="text-xl font-bold mb-2" style={{ color: '#ffffff' }}>Structured hand-offs</h3>
                <p className="max-w-xl mx-auto" style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.95rem', lineHeight: 1.65 }}>
                  Each role's findings pass automatically to the next through the shared layer.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-1">
                {PIPELINE.map((s, i) => (
                  <div key={s.label} className="flex items-center gap-3 sm:gap-1">
                    <div className="flex flex-col items-center gap-2 px-2">
                      <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white"
                        style={{ background: ACCENT_GRAD, boxShadow: '0 10px 24px rgba(0,38,164,0.30)' }}>
                        <Svg>{s.icon}</Svg>
                      </div>
                      <span className="font-semibold text-sm" style={{ color: '#ffffff' }}>{s.label}</span>
                    </div>
                    {i < PIPELINE.length - 1 && (
                      <svg className="rotate-90 sm:rotate-0 mx-1" width="34" height="18" viewBox="0 0 34 18" fill="none">
                        <path d="M2 9h28m0 0-6-6m6 6-6 6" stroke="#8ab0ff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
                      </svg>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Coordination in action */}
      <section className="py-20 md:py-28 relative z-10" id="in-action">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <FadeUp className="text-center mb-16">
            <Eyebrow>Coordination in action</Eyebrow>
            <h2 className="font-bold mb-4" style={h2Style}>Watch the layer at work</h2>
            <p className="max-w-2xl mx-auto" style={leadStyle}>
              From the first task assignment to reusing a teammate's work, coordination happens in the open.
            </p>
          </FadeUp>

          {/* Row 1: ownership auction */}
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center mb-16 md:mb-24">
            <FadeUp>
              <Eyebrow>Ownership auction</Eyebrow>
              <h3 className="font-bold mb-4" style={{ color: HEADING, fontSize: 'clamp(1.4rem, 2.5vw, 1.9rem)', lineHeight: 1.2 }}>
                Agents bid, the orchestrator allocates
              </h3>
              <p style={leadStyle}>
                Before any code is written, agents bid for the regions they want to work on. The orchestrator resolves the overlaps and hands each region a single owner, so no two agents ever write the same code.
              </p>
            </FadeUp>
            <FadeUp delay={0.15}>
              <BiddingPanel />
            </FadeUp>
          </div>

          {/* Row 2: shared memory (alternate) */}
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <FadeUp className="lg:order-2">
              <Eyebrow>Shared memory</Eyebrow>
              <h3 className="font-bold mb-4" style={{ color: HEADING, fontSize: 'clamp(1.4rem, 2.5vw, 1.9rem)', lineHeight: 1.2 }}>
                Reuse work instead of redoing it
              </h3>
              <p style={leadStyle}>
                When one agent derives a fact, a signature, or a gotcha, it records it once. Teammates recall it on demand instead of re-deriving, cutting the redundant exploration that slows multi-agent runs down.
              </p>
            </FadeUp>
            <FadeUp delay={0.15} className="lg:order-1">
              <MemoryPanel />
            </FadeUp>
          </div>
        </div>
      </section>

      {/* Results (dark band) */}
      <section className="py-20 md:py-28 relative overflow-hidden z-10" id="results"
        style={{ background: 'linear-gradient(150deg, #030b2e 0%, #0026a4 100%)' }}>
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background:
            'radial-gradient(ellipse 50% 50% at 85% 15%, rgba(107,143,255,0.30) 0%, transparent 60%),' +
            'radial-gradient(ellipse 45% 45% at 10% 90%, rgba(52,211,153,0.14) 0%, transparent 60%)',
        }} />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <FadeUp className="text-center mb-14">
            <Eyebrow light>Results</Eyebrow>
            <h2 className="font-bold mb-4" style={{ color: '#ffffff', fontSize: 'clamp(1.9rem, 3.5vw, 2.6rem)', lineHeight: 1.15 }}>
              Coordination, not model size, closes the gap
            </h2>
            <p className="max-w-2xl mx-auto" style={{ color: 'rgba(255,255,255,0.65)', lineHeight: 1.7, fontSize: '1.05rem' }}>
              Evaluated on CooperBench, a multi-agent software-engineering benchmark where two agents implement different features in the same codebase that conflict without coordination.
            </p>
          </FadeUp>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
            {[
              { stat: '56% → 78%', label: 'Clean-merge rate', body: 'Merge conflicts cut roughly in half.' },
              { stat: '75% better', label: 'Task success vs. baseline', body: 'A higher success rate than the uncoordinated baseline on CooperBench.' },
              { stat: '50% fewer', label: 'Steps to solution', body: 'Reaches the same results with half the redundant exploration.' },
            ].map((s, i) => (
              <FadeUp key={s.label} delay={i * 0.1}>
                <div className="rounded-2xl p-8 text-center h-full transition-all duration-300 hover:-translate-y-1.5"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.14)', backdropFilter: 'blur(6px)' }}>
                  <div className="font-extrabold mb-2 leading-none"
                    style={{
                      fontSize: 'clamp(2rem, 4vw, 2.7rem)',
                      background: 'linear-gradient(135deg, #ffffff 0%, #8ab0ff 100%)',
                      WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                    }}>
                    {s.stat}
                  </div>
                  <div className="font-semibold mb-1.5" style={{ color: '#ffffff' }}>{s.label}</div>
                  <p style={{ color: 'rgba(255,255,255,0.60)', fontSize: '0.9rem', lineHeight: 1.6 }}>{s.body}</p>
                </div>
              </FadeUp>
            ))}
          </div>

          <FadeUp delay={0.1}>
            <div className="max-w-3xl mx-auto rounded-2xl p-8 text-center"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(107,143,255,0.30)' }}>
              <p className="font-bold mb-2" style={{ color: '#ffffff', fontSize: 'clamp(1.15rem, 2.2vw, 1.5rem)', lineHeight: 1.4 }}>
                Flash-class models, frontier-class results.
              </p>
              <p style={{ color: 'rgba(255,255,255,0.68)', lineHeight: 1.7, fontSize: '1rem' }}>
                With strong coordination, teams of fast flash models reach results on par with frontier models. Coordination, not raw scale, closes the gap. We also built a generic plan → code → review → fix pipeline that officially resolves real open-source bug-fix tasks a single agent fails to complete.
              </p>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Use cases */}
      <section className="py-20 md:py-28 relative z-10" id="use-cases">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <FadeUp className="text-center mb-16">
            <Eyebrow>Use cases</Eyebrow>
            <h2 className="font-bold mb-4" style={h2Style}>Who it's for</h2>
            <p className="max-w-2xl mx-auto" style={leadStyle}>
              A coordination primitive for anyone running more than one agent on a codebase.
            </p>
          </FadeUp>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { icon: ICONS.platform, title: 'Multi-agent coding platforms & IDE agents', body: 'Running several agents on one repo without them stepping on each other.' },
              { icon: ICONS.cube, title: 'Agent framework builders', body: 'Who need a coordination primitive (ownership plus shared memory) rather than reinventing it.' },
              { icon: ICONS.route, title: 'Long-horizon SWE tasks', body: 'Decomposed across specialized agents: planner, coders, reviewer, and fixer.' },
            ].map((u, i) => (
              <FadeUp key={u.title} delay={i * 0.1}>
                <div className={`${cardClass} p-8 h-full`}>
                  <IconChip><Svg>{u.icon}</Svg></IconChip>
                  <h4 className="text-lg font-bold mb-3" style={{ color: HEADING }}>{u.title}</h4>
                  <p style={{ color: BODY, lineHeight: 1.7, fontSize: '0.95rem' }}>{u.body}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* Team (dark band) */}
      <section className="py-20 md:py-28 relative overflow-hidden z-10" id="team"
        style={{ background: 'linear-gradient(160deg, #05081c 0%, #0c1233 100%)' }}>
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background:
            'radial-gradient(ellipse 45% 45% at 88% 8%, rgba(107,143,255,0.16) 0%, transparent 60%),' +
            'radial-gradient(ellipse 45% 45% at 8% 92%, rgba(0,38,164,0.28) 0%, transparent 60%)',
        }} />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <FadeUp className="text-center mb-14">
            <Eyebrow light>Founding Team</Eyebrow>
            <h2 className="font-bold mb-4" style={{ color: '#ffffff', fontSize: 'clamp(1.9rem, 3.5vw, 2.6rem)', lineHeight: 1.15 }}>Built by people who've done this before</h2>
            <p className="max-w-xl mx-auto" style={{ color: 'rgba(255,255,255,0.65)', lineHeight: 1.7, fontSize: '1.05rem' }}>
              We've worked inside the systems we're replacing, at Qualcomm, Microsoft, and IIT Madras.
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
          background: 'radial-gradient(ellipse at center, rgba(0,38,164,0.09) 0%, transparent 70%)',
        }} />
        <div className="max-w-3xl mx-auto px-6 lg:px-8 text-center relative z-10">
          <FadeUp>
            <h2 className="font-bold mb-4" style={{ color: HEADING, fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
              Give your agents a way to <span style={{ color: G }}>work together.</span>
            </h2>
            <p className="mb-10 max-w-xl mx-auto" style={leadStyle}>
              We're working with early partners running multiple agents on real codebases. Get early access and help shape the coordination layer.
            </p>
          </FadeUp>
          <FadeUp delay={0.1}>
            <div style={{
              background: '#ffffff', border: '1px solid rgba(0,38,164,0.18)', borderRadius: 16,
              padding: '8px 24px 16px', boxShadow: '0 20px 50px rgba(0,38,164,0.10)',
            }}>
              <iframe
                src="https://tally.so/embed/ja0baa?alignLeft=1&hideTitle=1&transparentBackground=1"
                loading="lazy" width="100%" frameBorder="0" title="Cipherra Early Access"
                style={{ display: 'block', height: 168, marginTop: 10 }}
              />
            </div>
          </FadeUp>
        </div>
      </section>
    </>
  );
}
