import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  visible: (delay = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1], delay } }),
};
const staggerContainer = (stagger = 0.1) => ({
  hidden: {},
  visible: { transition: { staggerChildren: stagger } },
});
function FadeUp({ children, delay = 0, style }: { children: React.ReactNode; delay?: number; style?: React.CSSProperties }) {
  return (
    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }}
      custom={delay} variants={fadeUp} style={style}>
      {children}
    </motion.div>
  );
}

const G = '#00e676';
const G_LIGHT = '#69f0ae';
const G_DIM = 'rgba(0,230,118,0.12)';
const G_BORDER = 'rgba(0,230,118,0.2)';
const G_GLOW = 'rgba(0,230,118,0.3)';
const BG = '#050b07';
const CARD = 'rgba(13,26,18,0.85)';
const CARD_BORDER = '1px solid rgba(0,230,118,0.18)';

const TERMINAL_LINES = [
  { text: '$ instaml deploy --model llama-3.1-8b', color: G_LIGHT },
  { text: '' },
  { text: '  Uploading model weights...' },
  { text: '  ✓ Weights validated (4.6 GB)', color: G },
  { text: '' },
  { text: '  Allocating GPU cluster...' },
  { text: '  ✓ H100 node assigned  [India-West-1]', color: G },
  { text: '' },
  { text: '  Optimizing inference engine...' },
  { text: '  ✓ KV cache configured', color: G },
  { text: '  ✓ Token router ready', color: G },
  { text: '' },
  { text: '  Cold start: ✓  ready', color: G_LIGHT },
  { text: '' },
  { text: '  🚀 Endpoint live:', color: G_LIGHT },
  { text: '     api.instaml.cipherra.ai/v1/llama-3.1-8b', color: '#fff' },
  { text: '' },
  { text: '  Ready. Serving requests.', color: G },
];

const FEATURES = [
  {
    icon: '⚡',
    title: 'Fast Cold Starts',
    description: 'Models spin up rapidly. No long waits, no timeouts. Your users get fast responses from the very first call.',
  },
  {
    icon: '💸',
    title: 'Pay Per Token',
    description: 'Zero idle GPU costs. Deploy as many models as you need and pay only when they serve requests — no wasted spend.',
  },
  {
    icon: '🚀',
    title: 'Deploy in Minutes',
    description: 'From model weights to a live API endpoint in minutes. Push a model, get a URL. No infra knowledge required.',
  },
  {
    icon: '📡',
    title: 'Ultra-Low Latency',
    description: 'Optimised for low latency at every layer. Token-level scheduling and cross-tenant batching maximise throughput on every GPU.',
  },
  {
    icon: '🔧',
    title: 'Developer-First API',
    description: 'OpenAI-compatible API. Drop-in replacement — no code changes needed. SDKs for Python, TypeScript, and REST clients.',
  },
  {
    icon: '🇮🇳',
    title: 'India Data Residency',
    description: 'Your data never crosses Indian borders. Deployed inside Indian data centers. Ready for compliance with DPDP and enterprise mandates.',
  },
];

const STEPS = [
  {
    num: '01',
    title: 'Push Your Model',
    body: 'Upload any Hugging Face model or custom weights via CLI, dashboard, or S3-compatible bucket.',
    icon: '📦',
  },
  {
    num: '02',
    title: 'Get Your Endpoint',
    body: 'Receive an OpenAI-compatible API URL. Drop it into your app and start generating.',
    icon: '🔗',
  },
];

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

function TerminalBlock() {
  const [lines, setLines] = useState<typeof TERMINAL_LINES>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      if (i < TERMINAL_LINES.length) {
        const line = TERMINAL_LINES[i];
        i++;
        setLines(prev => [...prev, line]);
      } else {
        clearInterval(id);
      }
    }, 110);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines]);

  return (
    <div style={{
      background: '#040d06',
      border: CARD_BORDER,
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: `0 0 40px ${G_GLOW}, 0 24px 48px rgba(0,0,0,0.6)`,
      fontFamily: '"Fira Code", "Cascadia Code", Menlo, monospace',
      fontSize: '13px',
    }}>
      {/* title bar */}
      <div style={{
        background: '#0a180d',
        borderBottom: `1px solid ${G_BORDER}`,
        padding: '10px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      }}>
        <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f57', display: 'inline-block' }} />
        <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#febc2e', display: 'inline-block' }} />
        <span style={{ width: 10, height: 10, borderRadius: '50%', background: G, display: 'inline-block' }} />
        <span style={{ color: '#4a8a5a', marginLeft: 8, fontSize: 11 }}>instaml — terminal</span>
      </div>
      {/* lines */}
      <div ref={scrollRef} style={{ padding: '20px 24px', minHeight: 340, maxHeight: 380, overflowY: 'auto' }}>
        {lines.map((l, i) => (
          <div key={i} style={{ color: l.color ?? '#6e8f74', lineHeight: 1.7, whiteSpace: 'pre' }}>
            {l.text}
          </div>
        ))}
        {lines.length < TERMINAL_LINES.length && (
          <span style={{ color: G, animation: 'blink 1s step-end infinite' }}>▋</span>
        )}
      </div>
    </div>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      background: G_DIM,
      border: `1px solid ${G_BORDER}`,
      borderRadius: 999,
      padding: '6px 16px',
      fontSize: 12,
      fontWeight: 600,
      color: G_LIGHT,
      letterSpacing: '0.05em',
      textTransform: 'uppercase',
    }}>
      {children}
    </span>
  );
}

function FeatureCard({ icon, title, description }: (typeof FEATURES)[0]) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: CARD,
        border: hovered ? `1px solid ${G}` : CARD_BORDER,
        borderRadius: 16,
        padding: '28px 24px',
        transition: 'all 0.25s ease',
        boxShadow: hovered ? `0 0 24px ${G_GLOW}, 0 8px 32px rgba(0,0,0,0.4)` : '0 4px 16px rgba(0,0,0,0.3)',
        transform: hovered ? 'translateY(-4px)' : 'none',
        backdropFilter: 'blur(12px)',
      }}
    >
      <div style={{
        width: 52, height: 52,
        borderRadius: 12,
        background: G_DIM,
        border: `1px solid ${G_BORDER}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 24, marginBottom: 16,
      }}>
        {icon}
      </div>
      <h3 style={{ color: '#e8f5e9', fontWeight: 700, fontSize: 18, marginBottom: 10 }}>{title}</h3>
      <p style={{ color: '#6e8f74', lineHeight: 1.65, fontSize: 14 }}>{description}</p>
    </div>
  );
}


function SectionTitle({ badge, title, subtitle }: { badge?: string; title: string; subtitle?: string }) {
  return (
    <div style={{ textAlign: 'center', marginBottom: 56 }}>
      {badge && <div style={{ marginBottom: 16 }}><Badge>{badge}</Badge></div>}
      <h2 style={{ fontSize: 'clamp(28px, 5vw, 44px)', fontWeight: 800, color: '#e8f5e9', lineHeight: 1.2, marginBottom: subtitle ? 16 : 0 }}>
        {title}
      </h2>
      {subtitle && <p style={{ color: '#6e8f74', fontSize: 18, maxWidth: 560, margin: '0 auto', lineHeight: 1.6 }}>{subtitle}</p>}
    </div>
  );
}

function CodeBlock() {
  const code = `from openai import OpenAI

client = OpenAI(
    base_url="https://api.instaml.cipherra.ai/v1",
    api_key="im_your_api_key_here"
)

response = client.chat.completions.create(
    model="llama-3.1-8b",          # or your custom model
    messages=[
        {"role": "user", "content": "Explain quantum entanglement"}
    ],
    max_tokens=512,
)

print(response.choices[0].message.content)`;

  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{
      background: '#040d06',
      border: CARD_BORDER,
      borderRadius: 12,
      overflow: 'hidden',
      boxShadow: `0 0 32px ${G_GLOW}`,
    }}>
      <div style={{
        background: '#0a180d',
        borderBottom: `1px solid ${G_BORDER}`,
        padding: '10px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <span style={{ color: '#4a8a5a', fontSize: 12, fontFamily: 'monospace' }}>python — openai-compatible</span>
        <button
          onClick={handleCopy}
          style={{
            background: 'transparent',
            border: `1px solid ${G_BORDER}`,
            borderRadius: 6,
            color: copied ? G : '#4a8a5a',
            fontSize: 11,
            padding: '3px 10px',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </div>
      <pre style={{
        padding: '24px',
        margin: 0,
        fontFamily: '"Fira Code", "Cascadia Code", Menlo, monospace',
        fontSize: 13,
        color: '#a8d8b0',
        overflowX: 'auto',
        lineHeight: 1.7,
      }}>
        <code>{code}</code>
      </pre>
    </div>
  );
}

function TeamCard({ name, role, photo, bio, linkedin }: (typeof TEAM)[0]) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: CARD,
        border: hovered ? `1px solid ${G}` : CARD_BORDER,
        borderRadius: 20,
        padding: '36px 32px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        transition: 'all 0.25s ease',
        boxShadow: hovered ? `0 0 32px ${G_GLOW}, 0 12px 40px rgba(0,0,0,0.5)` : '0 4px 20px rgba(0,0,0,0.3)',
        transform: hovered ? 'translateY(-6px)' : 'none',
        backdropFilter: 'blur(12px)',
      }}
    >
      {/* Photo */}
      <div style={{
        width: 120, height: 120,
        borderRadius: '50%',
        overflow: 'hidden',
        border: `3px solid ${hovered ? G : G_BORDER}`,
        boxShadow: hovered ? `0 0 24px ${G_GLOW}` : '0 0 12px rgba(0,230,118,0.1)',
        marginBottom: 20,
        transition: 'all 0.25s ease',
        flexShrink: 0,
      }}>
        <img
          src={photo}
          alt={name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }}
        />
      </div>
      {/* Name + role */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
        <h3 style={{ color: '#e8f5e9', fontWeight: 800, fontSize: 20 }}>{name}</h3>
        <a href={linkedin} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', flexShrink: 0, color: '#6e8f74', transition: 'color 0.2s' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#0a66c2')}
          onMouseLeave={e => (e.currentTarget.style.color = '#6e8f74')}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
        </a>
      </div>
      <p style={{ color: G, fontSize: 13, fontWeight: 600, marginBottom: 16, letterSpacing: '0.02em' }}>{role}</p>
      {/* Bio */}
      <p style={{ color: '#6e8f74', fontSize: 14, lineHeight: 1.7, marginBottom: 20 }}>{bio}</p>
    </div>
  );
}

export default function InstaMLApp() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
const showToast = (e: React.MouseEvent) => {
    e.preventDefault();
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2500);
  };

  const scrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { href: '#features', label: 'Features' },
    { href: '#how-it-works', label: 'How it works' },
    { href: '#india', label: 'India-first' },
    { href: '#team', label: 'Team' },
  ];

  return (
    <div style={{ background: BG, color: '#c8e6c9', fontFamily: 'Inter, -apple-system, sans-serif', minHeight: '100vh' }}>

      {/* ── CURSOR BLINK KEYFRAME ── */}
      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes pulse-green { 0%,100%{box-shadow:0 0 0 0 rgba(0,230,118,0.4)} 50%{box-shadow:0 0 0 12px rgba(0,230,118,0)} }
        @keyframes float-up { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes orb-drift-1 { 0%,100%{transform:translate(0,0) scale(1)} 40%{transform:translate(-40px,30px) scale(1.06)} 70%{transform:translate(25px,-20px) scale(0.96)} }
        @keyframes orb-drift-2 { 0%,100%{transform:translate(0,0) scale(1)} 35%{transform:translate(30px,-35px) scale(0.95)} 65%{transform:translate(-20px,20px) scale(1.04)} }
        @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
        @keyframes glow-pulse { 0%,100%{opacity:0.5} 50%{opacity:1} }
        .instaml-nav-link { color: #6e8f74; font-size: 14px; font-weight: 500; text-decoration: none; transition: color 0.2s; }
        .instaml-nav-link:hover { color: #00e676; }
        .instaml-section { max-width: 1100px; margin: 0 auto; padding: 0 24px; }
        .instaml-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
        .instaml-grid-3 { display: grid; grid-template-columns: repeat(3,1fr); gap: 24px; }
        @media (max-width: 900px) { .instaml-grid-2 { grid-template-columns: 1fr; } .instaml-grid-3 { grid-template-columns: 1fr 1fr; } }
        @media (max-width: 600px) { .instaml-grid-3 { grid-template-columns: 1fr; } }
        .instaml-steps { display: flex; gap: 0; }
        @media (max-width: 768px) { .instaml-steps { flex-direction: column; } }
        .instaml-compare-table { width: 100%; border-collapse: collapse; }
        .instaml-compare-table th, .instaml-compare-table td { padding: 14px 16px; text-align: left; border-bottom: 1px solid rgba(0,230,118,0.1); font-size: 14px; }
        .instaml-compare-table th { color: #4a8a5a; font-weight: 600; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; }
        .instaml-compare-table td:first-child { color: #9eb8a4; }
        .instaml-compare-table td:nth-child(2) { color: #00e676; font-weight: 700; }
        .instaml-compare-table td:not(:first-child):not(:nth-child(2)) { color: #4a6a52; }
        .instaml-btn-primary { display: inline-block; background: #00e676; color: #030d06; font-weight: 700; padding: 14px 32px; border-radius: 999px; text-decoration: none; font-size: 15px; transition: all 0.2s; border: none; cursor: pointer; }
        .instaml-btn-primary:hover { background: #69f0ae; box-shadow: 0 0 24px rgba(0,230,118,0.5); transform: translateY(-2px); }
        .instaml-btn-outline { display: inline-block; background: transparent; color: #00e676; font-weight: 600; padding: 14px 32px; border-radius: 999px; text-decoration: none; font-size: 15px; transition: all 0.2s; border: 1px solid rgba(0,230,118,0.4); }
        .instaml-btn-outline:hover { background: rgba(0,230,118,0.08); border-color: #00e676; }
        .instaml-input { background: rgba(13,26,18,0.8); border: 1px solid rgba(0,230,118,0.25); color: #e8f5e9; border-radius: 999px; padding: 14px 24px; font-size: 15px; outline: none; transition: border-color 0.2s; }
        .instaml-input::placeholder { color: #3a5a42; }
        .instaml-input:focus { border-color: #00e676; }
        .dot-grid { background-image: radial-gradient(circle, rgba(0,230,118,0.12) 1px, transparent 1px); background-size: 32px 32px; }
      `}</style>

      {/* ── HEADER ── */}
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: 'rgba(5,11,7,0.9)',
        backdropFilter: 'blur(16px)',
        borderBottom: `1px solid ${G_BORDER}`,
      }}>
        <div className="instaml-section" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 68 }}>
          {/* Logo + product name */}
          <a href="#" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
            <div style={{ background: '#fff', borderRadius: 6, padding: '3px 6px', display: 'inline-flex' }}>
              <img src="/Cipherra_logo.jpeg" alt="Cipherra" style={{ height: 26, width: 'auto' }} />
            </div>
            <span style={{ color: '#e8f5e9', fontWeight: 800, fontSize: 20, letterSpacing: '-0.02em' }}>
              insta<span style={{ color: G }}>ml</span>
            </span>
          </a>

          {/* Desktop nav */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: 32 }} className="hidden-mobile">
            {navLinks.map(l => (
              <a key={l.href} href={l.href} className="instaml-nav-link" onClick={e => scrollTo(e, l.href)}>{l.label}</a>
            ))}
            <a href="#waitlist" className="instaml-btn-primary" style={{ padding: '10px 24px', fontSize: 13 }} onClick={e => scrollTo(e, '#waitlist')}>
              Get Early Access
            </a>
          </nav>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ background: 'none', border: 'none', color: '#6e8f74', cursor: 'pointer', fontSize: 22 }}
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div style={{ background: '#070f09', borderTop: `1px solid ${G_BORDER}`, padding: '16px 24px 24px' }}>
            {navLinks.map(l => (
              <a key={l.href} href={l.href} className="instaml-nav-link"
                style={{ display: 'block', padding: '12px 0', borderBottom: `1px solid ${G_DIM}` }}
                onClick={e => scrollTo(e, l.href)}>{l.label}</a>
            ))}
            <a href="#waitlist" className="instaml-btn-primary" style={{ marginTop: 16, display: 'block', textAlign: 'center' }}
              onClick={e => scrollTo(e, '#waitlist')}>Get Early Access</a>
          </div>
        )}
      </header>

      {/* ── HERO ── */}
      <section style={{ paddingTop: 140, paddingBottom: 80, position: 'relative', overflow: 'hidden' }}>
        {/* Background glow + drifting orbs */}
        <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 900, height: 600, background: 'radial-gradient(ellipse at center top, rgba(0,230,118,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '5%', right: '0%', width: 560, height: 560, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,230,118,0.06) 0%, transparent 65%)', animation: 'orb-drift-1 18s ease-in-out infinite', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '0%', left: '-5%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,230,118,0.04) 0%, transparent 65%)', animation: 'orb-drift-2 24s ease-in-out infinite', pointerEvents: 'none' }} />

        <div className="instaml-section">
          <div className="instaml-grid-2" style={{ alignItems: 'center', gap: 56 }}>
            {/* Left: copy — staggered entrance */}
            <motion.div initial="hidden" animate="visible" variants={staggerContainer(0.13)}>
              <motion.div variants={fadeUp} custom={0} style={{ marginBottom: 20 }}>
                <Badge>🇮🇳 India-first &nbsp;·&nbsp; Early Access</Badge>
              </motion.div>
              <motion.h1 variants={fadeUp} custom={0.1} style={{
                fontSize: 'clamp(36px, 6vw, 62px)', fontWeight: 900, lineHeight: 1.08,
                color: '#e8f5e9', letterSpacing: '-0.03em', marginBottom: 24,
              }}>
                Deploy Any AI Model.<br />
                <span style={{ color: G }}>Instantly.</span>
              </motion.h1>
              <motion.p variants={fadeUp} custom={0.2} style={{ fontSize: 18, color: '#6e8f74', lineHeight: 1.65, marginBottom: 36, maxWidth: 480 }}>
                From model weights to a live API endpoint in minutes.
                Near-instant cold starts, pay-per-token pricing, and 100% India data residency.
              </motion.p>
              <motion.div variants={fadeUp} custom={0.3} style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                <a href="#waitlist" className="instaml-btn-primary" onClick={e => scrollTo(e, '#waitlist')}>
                  Get Early Access
                </a>
                <a href="#how-it-works" className="instaml-btn-outline" onClick={e => scrollTo(e, '#how-it-works')}>
                  See How It Works
                </a>
              </motion.div>
            </motion.div>

            {/* Right: terminal — slides in from right */}
            <motion.div initial={{ opacity: 0, x: 48 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}>
              <TerminalBlock />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── STAT BAR ── */}

      {/* ── FEATURES ── */}
      <section id="features" style={{ padding: '96px 0' }}>
        <div className="instaml-section">
          <SectionTitle
            badge="Platform Features"
            title="Everything you need to ship AI, fast"
            subtitle="Built for developers who want to move quickly without fighting infrastructure."
          />
          <motion.div className="instaml-grid-3" initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }} variants={staggerContainer(0.09)}>
            {FEATURES.map(f => (
              <motion.div key={f.title} variants={fadeUp}>
                <FeatureCard {...f} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" style={{ padding: '80px 0', background: 'rgba(0,230,118,0.03)', borderTop: `1px solid ${G_BORDER}`, borderBottom: `1px solid ${G_BORDER}` }}>
        <div className="instaml-section">
          <SectionTitle
            badge="Workflow"
            title="Two steps to production"
            subtitle="No DevOps experience required. If you can run a pip install, you can deploy on InstaML."
          />
          <div className="instaml-steps">
            {STEPS.map((s, i) => (
              <motion.div key={s.num} style={{ flex: 1, display: 'flex', position: 'relative' }}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: i * 0.15 }}>
                {/* connector line */}
                {i < STEPS.length - 1 && (
                  <div style={{
                    position: 'absolute',
                    top: 36,
                    right: 0,
                    width: '50%',
                    height: 1,
                    background: `linear-gradient(90deg, ${G_BORDER}, transparent)`,
                    display: 'none',
                  }} className="step-connector" />
                )}
                <div style={{ padding: '32px 24px', flex: 1 }}>
                  <div style={{ fontSize: 32, marginBottom: 12 }}>{s.icon}</div>
                  <div style={{ fontSize: 48, fontWeight: 900, color: 'rgba(0,230,118,0.15)', lineHeight: 1, marginBottom: 8 }}>{s.num}</div>
                  <h3 style={{ fontSize: 20, fontWeight: 700, color: '#e8f5e9', marginBottom: 10 }}>{s.title}</h3>
                  <p style={{ color: '#6e8f74', fontSize: 14, lineHeight: 1.65 }}>{s.body}</p>
                </div>
                {i < STEPS.length - 1 && (
                  <div style={{ display: 'flex', alignItems: 'flex-start', paddingTop: 36, color: '#1e4a2a', fontSize: 24 }}>→</div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── API CODE EXAMPLE ── */}
      <section style={{ padding: '96px 0' }}>
        <div className="instaml-section">
          <div className="instaml-grid-2" style={{ alignItems: 'center', gap: 56 }}>
            <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}>
              <SectionTitle
                badge="Developer API"
                title="OpenAI-compatible. Zero migration cost."
                subtitle={undefined}
              />
              <p style={{ color: '#6e8f74', fontSize: 16, lineHeight: 1.7, marginBottom: 24, marginTop: -32 }}>
                Change one line of code — <code style={{ color: G_LIGHT, background: G_DIM, padding: '2px 8px', borderRadius: 4, fontSize: 13 }}>base_url</code> — and your existing OpenAI integrations route through InstaML on Indian GPUs.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {['Python & TypeScript SDKs', 'Streaming responses', 'Function calling & tool use', 'Custom model endpoints', 'Token usage tracking'].map(item => (
                  <li key={item} style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#9eb8a4', fontSize: 14 }}>
                    <span style={{ color: G, fontWeight: 700, fontSize: 16 }}>✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}>
              <CodeBlock />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── INDIA DATA RESIDENCY ── */}
      <section id="india" style={{
        padding: '96px 0',
        background: 'rgba(0,230,118,0.04)',
        borderTop: `1px solid ${G_BORDER}`,
        borderBottom: `1px solid ${G_BORDER}`,
      }}>
        <div className="instaml-section">
          <div className="instaml-grid-2" style={{ alignItems: 'center', gap: 64 }}>
            {/* Visual */}
            <motion.div style={{ textAlign: 'center' }} initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 240,
                height: 240,
                borderRadius: '50%',
                border: `2px solid ${G_BORDER}`,
                background: G_DIM,
                boxShadow: `0 0 80px rgba(0,230,118,0.15)`,
                position: 'relative',
                animation: 'float-up 4s ease-in-out infinite',
              }}>
                <span style={{ fontSize: 100 }}>🇮🇳</span>
                {/* orbit ping */}
                <div style={{
                  position: 'absolute',
                  inset: -16,
                  borderRadius: '50%',
                  border: `1px solid rgba(0,230,118,0.15)`,
                  animation: 'pulse-green 2.5s ease-in-out infinite',
                }} />
              </div>
            </motion.div>
            {/* Copy */}
            <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}>
              <Badge>🇮🇳 Sovereign AI Infrastructure</Badge>
              <h2 style={{ fontSize: 'clamp(26px, 4vw, 40px)', fontWeight: 800, color: '#e8f5e9', marginTop: 20, marginBottom: 20, lineHeight: 1.2 }}>
                Your data never leaves India.
              </h2>
              <p style={{ color: '#6e8f74', fontSize: 16, lineHeight: 1.7, marginBottom: 28 }}>
                Every token processed on InstaML runs on GPUs physically located inside Indian data centers. We deploy the inference engine directly inside partner facilities — data residency is a first-class guarantee, not an afterthought.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
                {[
                  'Compliant with India\'s DPDP Act (Digital Personal Data Protection)',
                  'Enterprise-ready SLA with data locality attestation',
                  'Latency advantage for Indian users vs. US/EU inference endpoints',
                  'Enables sovereign AI for government and regulated industries',
                ].map(item => (
                  <li key={item} style={{ display: 'flex', gap: 12, color: '#9eb8a4', fontSize: 14, lineHeight: 1.5 }}>
                    <span style={{ color: G, flexShrink: 0, marginTop: 1 }}>✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── TEAM ── */}
      <section id="team" style={{ padding: '96px 0' }}>
        <div className="instaml-section">
          <SectionTitle
            badge="Founding Team"
            title="Built by people who've done this before"
            subtitle="We've worked inside the systems we're replacing — at Qualcomm, Microsoft, and IIT Madras."
          />
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 32,
            maxWidth: 760,
            margin: '0 auto',
          }}>
            {TEAM.map((member, i) => (
              <motion.div key={member.name} initial={{ opacity: 0, y: 36 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: i * 0.15 }}>
                <TeamCard {...member} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA / WAITLIST ── */}
      <section id="waitlist" style={{
        padding: '96px 0',
        background: 'radial-gradient(ellipse at center, rgba(0,230,118,0.12) 0%, transparent 70%)',
        borderTop: `1px solid ${G_BORDER}`,
      }}>
        <FadeUp style={{ textAlign: 'center' }}>
          <Badge>Early Access</Badge>
          <h2 style={{ fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 900, color: '#e8f5e9', marginTop: 20, marginBottom: 16, lineHeight: 1.1 }}>
            Ship your first model this week.
          </h2>
          <p style={{ color: '#6e8f74', fontSize: 18, marginBottom: 40, maxWidth: 480, margin: '0 auto 40px' }}>
            Join the waitlist. We're onboarding developers and teams building on Indian GPUs.
          </p>
          <div style={{
            maxWidth: 520,
            margin: '0 auto',
            background: 'rgba(13,26,18,0.8)',
            border: `1px solid ${G_BORDER}`,
            borderRadius: 16,
            padding: '8px 24px 16px',
            backdropFilter: 'blur(12px)',
          }}>
            <iframe
              src="https://tally.so/embed/ja0baa?alignLeft=1&hideTitle=1&transparentBackground=1"
              loading="lazy"
              width="100%"
              frameBorder="0"
              title="InstaML Waitlist"
              style={{ display: 'block', height: 150, marginTop: 10 }}
            />
          </div>
          <p style={{ color: '#3a5a42', fontSize: 12, marginTop: 16 }}>
            We'll reach out within 24 hours &nbsp;·&nbsp; No spam, ever
          </p>
        </FadeUp>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: `1px solid ${G_BORDER}`, padding: '56px 0 32px' }}>
        <div className="instaml-section">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 40, marginBottom: 48 }}>
            {/* Brand */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <div style={{ background: '#fff', borderRadius: 5, padding: '2px 5px' }}>
                  <img src="/Cipherra_logo.jpeg" alt="Cipherra" style={{ height: 22, width: 'auto' }} />
                </div>
                <span style={{ color: '#e8f5e9', fontWeight: 800, fontSize: 17 }}>
                  insta<span style={{ color: G }}>ml</span>
                </span>
              </div>
              <p style={{ color: '#3a5a42', fontSize: 13, lineHeight: 1.6 }}>
                AI inference infrastructure for India. A product by Cipherra.
              </p>
            </div>

            <div>
              <p style={{ color: G_LIGHT, fontWeight: 600, fontSize: 13, marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Product</p>
              {['Features', 'Documentation', 'Status'].map(l => (
                <a key={l} href="#" onClick={showToast} style={{ display: 'block', color: '#3a5a42', fontSize: 13, marginBottom: 10, textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = G_LIGHT)}
                  onMouseLeave={e => (e.currentTarget.style.color = '#3a5a42')}>{l}</a>
              ))}
            </div>

            <div>
              <p style={{ color: G_LIGHT, fontWeight: 600, fontSize: 13, marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Developers</p>
              {['API Reference', 'Python SDK', 'TypeScript SDK', 'Changelog'].map(l => (
                <a key={l} href="#" onClick={showToast} style={{ display: 'block', color: '#3a5a42', fontSize: 13, marginBottom: 10, textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = G_LIGHT)}
                  onMouseLeave={e => (e.currentTarget.style.color = '#3a5a42')}>{l}</a>
              ))}
            </div>

            <div>
              <p style={{ color: G_LIGHT, fontWeight: 600, fontSize: 13, marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Company</p>
              {['About Cipherra', 'Blog', 'Careers'].map(l => (
                <a key={l} href="#" onClick={showToast} style={{ display: 'block', color: '#3a5a42', fontSize: 13, marginBottom: 10, textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = G_LIGHT)}
                  onMouseLeave={e => (e.currentTarget.style.color = '#3a5a42')}>{l}</a>
              ))}
              <a href="mailto:nithesh2108@gmail.com" style={{ display: 'block', color: '#3a5a42', fontSize: 13, marginBottom: 10, textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = G_LIGHT)}
                onMouseLeave={e => (e.currentTarget.style.color = '#3a5a42')}>Contact</a>
            </div>
          </div>

          <div style={{ borderTop: `1px solid rgba(0,230,118,0.08)`, paddingTop: 24, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <p style={{ color: '#2a3a2c', fontSize: 12 }}>© 2026 Cipherra. All rights reserved.</p>
            <p style={{ color: '#2a3a2c', fontSize: 12 }}>Built in India 🇮🇳 · Data stays in India</p>
          </div>
        </div>
      </footer>

      {/* ── TOAST ── */}
      <div style={{
        position: 'fixed',
        bottom: 28,
        right: 28,
        background: CARD,
        border: `1px solid ${G}`,
        borderRadius: 12,
        padding: '14px 24px',
        color: G_LIGHT,
        fontWeight: 600,
        fontSize: 14,
        boxShadow: `0 0 24px ${G_GLOW}`,
        transform: toastVisible ? 'translateY(0)' : 'translateY(120px)',
        opacity: toastVisible ? 1 : 0,
        transition: 'all 0.3s ease',
        zIndex: 999,
        pointerEvents: 'none',
      }}>
        🚀 Coming soon! We'll reach out shortly.
      </div>
    </div>
  );
}
