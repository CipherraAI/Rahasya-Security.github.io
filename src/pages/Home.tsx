import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const G = '#00e676';
const G_LIGHT = '#69f0ae';
const G_DIM = 'rgba(0,230,118,0.10)';
const G_BORDER = 'rgba(0,230,118,0.20)';
const G_GLOW = '0 0 24px rgba(0,230,118,0.25)';
const CARD: React.CSSProperties = {
  background: 'rgba(13,26,18,0.80)',
  border: '1px solid rgba(0,230,118,0.15)',
  borderRadius: '16px',
};

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
        background: 'rgba(13,26,18,0.80)',
        border: `1px solid ${hovered ? G : 'rgba(0,230,118,0.15)'}`,
        borderRadius: 20,
        padding: '36px 32px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        transition: 'all 0.25s ease',
        boxShadow: hovered ? '0 0 32px rgba(0,230,118,0.2), 0 12px 40px rgba(0,0,0,0.5)' : '0 4px 20px rgba(0,0,0,0.3)',
        transform: hovered ? 'translateY(-6px)' : 'none',
      }}
    >
      <div style={{
        width: 112, height: 112,
        borderRadius: '50%',
        overflow: 'hidden',
        border: `3px solid ${hovered ? G : 'rgba(0,230,118,0.2)'}`,
        boxShadow: hovered ? '0 0 24px rgba(0,230,118,0.3)' : '0 0 12px rgba(0,230,118,0.1)',
        marginBottom: 20,
        transition: 'all 0.25s ease',
        flexShrink: 0,
      }}>
        <img src={photo} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
        <h3 style={{ color: '#fff', fontWeight: 800, fontSize: 20 }}>{name}</h3>
        <a href={linkedin} target="_blank" rel="noopener noreferrer"
          style={{ display: 'flex', flexShrink: 0, color: 'rgba(255,255,255,0.35)', transition: 'color 0.2s' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#0a66c2')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.35)')}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
        </a>
      </div>
      <p style={{ color: G, fontSize: 13, fontWeight: 600, marginBottom: 16, letterSpacing: '0.02em' }}>{role}</p>
      <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 14, lineHeight: 1.7 }}>{bio}</p>
    </div>
  );
}

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] as any, delay },
  }),
};

function FadeUp({
  children,
  delay = 0,
  style,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  style?: React.CSSProperties;
  className?: string;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      custom={delay}
      variants={fadeUp}
      style={style}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const STAT_ITEMS = [
  { icon: '✓', label: 'runs completed', value: '30', color: G },
  { icon: '✗', label: 'failures detected', value: '7', color: '#f87171' },
  { icon: '→', label: 'classified as learnable', value: '5', color: '#fbbf24' },
  { icon: '⚡', label: 'training job triggered', value: null as null, color: G },
];

function StatsPanel() {
  const [visible, setVisible] = useState(0);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    if (visible < STAT_ITEMS.length) {
      const t = setTimeout(() => setVisible((v) => v + 1), 620);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setShowResult(true), 900);
    return () => clearTimeout(t);
  }, [visible]);

  return (
    <div
      style={{
        background: 'rgba(5,11,7,0.95)',
        border: '1px solid rgba(0,230,118,0.20)',
        borderRadius: '12px',
        padding: '20px 24px',
        fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
        fontSize: '0.82rem',
        lineHeight: 1.7,
        minHeight: '320px',
      }}
    >
      <div className="flex items-center gap-1.5 mb-5">
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f57' }} />
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#febc2e' }} />
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#28c840' }} />
        <span style={{ marginLeft: 8, color: 'rgba(255,255,255,0.3)', fontSize: '0.72rem' }}>eval cycle #4 · qwen-2.5-7b-instruct</span>
      </div>

      <div className="space-y-2 mb-5">
        {STAT_ITEMS.slice(0, visible).map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25 }}
            className="flex items-center gap-3"
          >
            <span style={{ color: item.color, width: 14, flexShrink: 0, textAlign: 'center' as const }}>{item.icon}</span>
            {item.value && (
              <span style={{ color: '#fff', fontWeight: 700, minWidth: 24 }}>{item.value}</span>
            )}
            <span style={{ color: 'rgba(255,255,255,0.50)' }}>{item.label}</span>
          </motion.div>
        ))}
        {visible < STAT_ITEMS.length && (
          <motion.span
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 0.9, repeat: Infinity }}
            style={{ color: G, fontWeight: 700, display: 'inline-block', marginLeft: 2 }}
          >
            ▋
          </motion.span>
        )}
      </div>

      {showResult && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{
            background: 'rgba(0,230,118,0.06)',
            border: '1px solid rgba(0,230,118,0.22)',
            borderRadius: 10,
            padding: '14px 16px',
            marginTop: 8,
          }}
        >
          <div style={{ color: G_LIGHT, fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' as const, marginBottom: 10 }}>
            post-training re-eval
          </div>
          <div className="flex items-center justify-between" style={{ fontSize: '0.78rem' }}>
            <div>
              <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.68rem', marginBottom: 2 }}>before training</div>
              <div style={{ color: 'rgba(255,255,255,0.65)', fontWeight: 700 }}>76.7%</div>
            </div>
            <div style={{ color: G, fontSize: '1.1rem' }}>→</div>
            <div style={{ textAlign: 'right' as const }}>
              <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.68rem', marginBottom: 2 }}>after training</div>
              <div style={{ color: G, fontWeight: 700 }}>90.0% <span style={{ fontSize: '0.7rem' }}>↑ +13.3%</span></div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

// Diagnostic report terminal

const PROBLEMS = [
  {
    icon: '🎲',
    title: 'Evals are flaky',
    body: 'A failed eval run might mean your model regressed — or it might mean a rate limit, a misconfigured step limit, or a broken task environment. Without redundancy and failure classification, you can\'t tell the difference.',
  },
  {
    icon: '🔧',
    title: 'Manual pipelines don\'t scale',
    body: 'You\'re scripting eval runs yourself against lm-eval-harness or custom tasks — no standardization, no CI trigger, no redundancy across non-deterministic runs.',
  },
  {
    icon: '❓',
    title: 'Raw scores don\'t explain failures',
    body: 'When a task fails, you read through trajectory JSON files manually. Hours of work. Deep familiarity with harness internals required. No systematic remediation.',
  },
];

const STEPS = [
  {
    num: '01',
    icon: '📦',
    title: 'Submit a Job',
    body: 'Upload a Harbor-format task bundle. Set your model config, redundancy N, and step limits. Submit via API, CLI, or dashboard.',
  },
  {
    num: '02',
    icon: '⚙️',
    title: 'Runs Execute at Scale',
    body: 'N containers run independently per task using your model endpoint. Results are averaged and score variance is surfaced across redundant runs.',
  },
  {
    num: '03',
    icon: '📊',
    title: 'Get Your Diagnostic Report',
    body: 'Every failure is classified by root cause — config, API, or model behavior. Issues ranked by severity and fixability with specific remediation steps.',
  },
];

const PROVIDERS = [
  { name: 'Anthropic', tag: 'claude-haiku, claude-sonnet, claude-opus', color: '#d97757' },
  { name: 'OpenAI', tag: 'gpt-4o, o3-mini, o1', color: '#74aa9c' },
  { name: 'OpenRouter', tag: 'Nemotron, Gemma, Phi-4 — free tier', color: '#6366f1', free: true },
  { name: 'Together AI', tag: 'Llama 3, Qwen 2.5, Mistral', color: '#7c3aed' },
  { name: 'vLLM', tag: 'self-hosted endpoint', color: '#2563eb' },
  { name: 'Ollama', tag: 'local models', color: '#0891b2' },
  { name: 'Any OpenAI-compat', tag: 'custom api_base + BYOK', color: '#059669' },
];

const SELF_HEAL_STEPS = [
  {
    step: '01',
    icon: '📡',
    title: 'Failures Ingested',
    body: 'Pull from eval run outputs or stream in production traces. Any trajectory where the agent fell short — wrong tool call, bad reasoning, task not completed — is ingested.',
  },
  {
    step: '02',
    icon: '🧠',
    title: 'Smart Classification',
    body: 'Failures split into learnable (genuine model behavior gap) vs. noise (env bug, rate limit, config error). Only signal proceeds.',
  },
  {
    step: '03',
    icon: '⚡',
    title: 'Training Job Triggered',
    body: 'Curated failure trajectories are formatted as training data and submitted to your training infra — GRPO, SFT, or DPO.',
  },
  {
    step: '04',
    icon: '📈',
    title: 'Checkpoint Re-evaluated',
    body: 'The new checkpoint is re-evaluated on the exact failure categories that triggered the run. Track improvement over time.',
  },
];

export default function Home() {

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative pt-36 pb-24 md:pt-44 md:pb-32 overflow-hidden" id="hero">
        {/* Subtle green radial glow behind hero */}
        <div
          style={{
            position: 'absolute',
            top: '0',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '900px',
            height: '500px',
            background: 'radial-gradient(ellipse at center top, rgba(0,230,118,0.07) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left: copy */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-8"
                  style={{
                    background: G_DIM,
                    border: `1px solid ${G_BORDER}`,
                    color: G_LIGHT,
                  }}
                >
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      background: G,
                      display: 'inline-block',
                      boxShadow: `0 0 8px ${G}`,
                    }}
                  />
                  Now in early access · Free tier available
                </div>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.08 }}
                className="font-extrabold leading-tight mb-6"
                style={{ fontSize: 'clamp(2.4rem, 5vw, 3.6rem)', color: '#fff' }}
              >
                Continuous Evals.{' '}
                <span style={{ color: G }}>Continuous Improvement.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.16 }}
                style={{ color: 'rgba(255,255,255,0.55)', fontSize: '1.15rem', lineHeight: 1.7, marginBottom: '2.5rem', maxWidth: '520px' }}
              >
                Run eval suites against any model. Get prioritized diagnostic reports — not just a score.
                Failures get classified, learnable ones become training data, and the loop closes automatically.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.24 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <a
                  href="https://app.cipherra.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-7 py-3.5 rounded-full font-semibold text-base text-center transition-all"
                  style={{
                    background: G,
                    color: '#050b07',
                    boxShadow: G_GLOW,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 0 36px rgba(0,230,118,0.45)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = G_GLOW;
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  Try it →
                </a>
                <a
                  href="#contact"
                  className="px-7 py-3.5 rounded-full font-semibold text-base text-center transition-all"
                  style={{
                    background: 'transparent',
                    color: 'rgba(255,255,255,0.75)',
                    border: '1px solid rgba(255,255,255,0.15)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = G_BORDER;
                    e.currentTarget.style.color = G_LIGHT;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
                    e.currentTarget.style.color = 'rgba(255,255,255,0.75)';
                  }}
                >
                  Get Early Access
                </a>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="mt-10 flex flex-wrap gap-6"
              >
                {['BYOK — any model', 'Harbor task format', 'Self-learning loop'].map((feat) => (
                  <div key={feat} className="flex items-center gap-2" style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.82rem' }}>
                    <span style={{ color: G, fontSize: '0.75rem' }}>✓</span>
                    {feat}
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right: typing terminal */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.65, delay: 0.2 }}
            >
              <StatsPanel />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Problem Strip ──────────────────────────────────── */}
      <section className="py-20 md:py-24" id="problem">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <FadeUp>
            <p
              className="text-center mb-12 font-medium uppercase tracking-widest text-xs"
              style={{ color: G_LIGHT }}
            >
              The problem with AI agent evaluation today
            </p>
          </FadeUp>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PROBLEMS.map((p, i) => (
              <FadeUp key={p.title} delay={i * 0.1}>
                <div
                  className="p-7 h-full transition-all"
                  style={{ ...CARD, cursor: 'default' }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = G_BORDER;
                    (e.currentTarget as HTMLElement).style.boxShadow = G_GLOW;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,230,118,0.15)';
                    (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                  }}
                >
                  <div className="text-3xl mb-4">{p.icon}</div>
                  <h3 className="font-bold text-lg mb-3" style={{ color: '#fff' }}>{p.title}</h3>
                  <p style={{ color: 'rgba(255,255,255,0.52)', lineHeight: 1.7, fontSize: '0.9rem' }}>{p.body}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ───────────────────────────────────── */}
      <section className="py-20 md:py-28" id="how-it-works">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <FadeUp className="text-center mb-16">
            <p className="font-medium uppercase tracking-widest text-xs mb-4" style={{ color: G_LIGHT }}>How it works</p>
            <h2 className="font-bold" style={{ color: '#fff', fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)' }}>
              Submit → Run → Diagnose
            </h2>
            <p className="mt-4 max-w-xl mx-auto" style={{ color: 'rgba(255,255,255,0.48)', fontSize: '1rem', lineHeight: 1.7 }}>
              Three steps from checkpoint to actionable insight. No infra to manage. No harness internals to learn.
            </p>
          </FadeUp>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">

            {STEPS.map((step, i) => (
              <FadeUp key={step.num} delay={i * 0.12}>
                <div className="p-8 text-center transition-all" style={CARD}>
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-6"
                    style={{ background: G_DIM, border: `1px solid ${G_BORDER}` }}
                  >
                    {step.icon}
                  </div>
                  <div
                    className="text-xs font-bold mb-2 tracking-widest"
                    style={{ color: G, fontFamily: 'monospace' }}
                  >
                    {step.num}
                  </div>
                  <h3 className="font-bold text-lg mb-3" style={{ color: '#fff' }}>{step.title}</h3>
                  <p style={{ color: 'rgba(255,255,255,0.50)', lineHeight: 1.7, fontSize: '0.88rem' }}>{step.body}</p>
                </div>
              </FadeUp>
            ))}
          </div>

          {/* Redundancy callout */}
          <FadeUp delay={0.3} className="mt-10">
            <div
              className="max-w-2xl mx-auto p-5 rounded-xl text-center"
              style={{ background: G_DIM, border: `1px solid ${G_BORDER}` }}
            >
              <span style={{ color: G_LIGHT, fontSize: '0.88rem' }}>
                <strong style={{ color: G }}>Redundancy is built in.</strong> Run the same task N times independently.
                LLM outputs are non-deterministic — a task that passes 1/5 runs is diagnosed differently from one that passes 0/5.
              </span>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── Platform Preview ───────────────────────────────── */}
      <section className="py-20 md:py-28" id="integrations">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <FadeUp className="text-center mb-14">
            <p className="font-medium uppercase tracking-widest text-xs mb-4" style={{ color: G_LIGHT }}>The platform</p>
            <h2 className="font-bold mb-4" style={{ color: '#fff', fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)' }}>
              Submit a job. See results in minutes.
            </h2>
            <p className="max-w-xl mx-auto" style={{ color: 'rgba(255,255,255,0.48)', lineHeight: 1.7, fontSize: '1rem' }}>
              A web dashboard and REST API. Upload your task bundle, pick your model, set redundancy — then watch runs execute and results come in live.
            </p>
          </FadeUp>

          <FadeUp delay={0.1}>
            <div
              className="rounded-2xl overflow-hidden"
              style={{
                border: '1px solid rgba(0,230,118,0.18)',
                boxShadow: '0 0 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(0,230,118,0.05)',
              }}
            >
              {/* fake browser chrome */}
              <div
                className="flex items-center gap-2 px-4 py-3"
                style={{ background: 'rgba(13,26,18,0.95)', borderBottom: '1px solid rgba(0,230,118,0.10)' }}
              >
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f57' }} />
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#febc2e' }} />
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#28c840' }} />
                <div
                  className="ml-3 px-3 py-1 rounded text-xs"
                  style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.35)', fontFamily: 'monospace' }}
                >
                  app.cipherra.ai/jobs
                </div>
              </div>
              <img
                src="/dashboard.png"
                alt="Cipherra eval jobs dashboard"
                className="w-full block"
                style={{ display: 'block' }}
              />
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── BYOM ───────────────────────────────────────────── */}
      <section className="py-20 md:py-28" id="byom">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <FadeUp className="text-center mb-14">
            <p className="font-medium uppercase tracking-widest text-xs mb-4" style={{ color: G_LIGHT }}>Bring Your Own Model</p>
            <h2 className="font-bold mb-4" style={{ color: '#fff', fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)' }}>
              Your model endpoint. Our infrastructure.
            </h2>
            <p className="max-w-xl mx-auto" style={{ color: 'rgba(255,255,255,0.48)', lineHeight: 1.7, fontSize: '1rem' }}>
              BYOK — bring your own API key. Works with any OpenAI-compatible endpoint.
              Hosted APIs, self-hosted vLLM, local Ollama — anything with an HTTP interface.
            </p>
          </FadeUp>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-5 mb-12">
            {PROVIDERS.map((p, i) => (
              <FadeUp key={p.name} delay={i * 0.07}>
                <div
                  className="p-5 flex flex-col gap-2 transition-all"
                  style={{ ...CARD }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = G_BORDER;
                    (e.currentTarget as HTMLElement).style.boxShadow = G_GLOW;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,230,118,0.15)';
                    (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                  }}
                >
                  <div className="flex items-center gap-2">
                    <div className="text-xs font-bold tracking-wide" style={{ color: '#fff' }}>{p.name}</div>
                    {(p as any).free && (
                      <span
                        className="text-xs font-bold px-1.5 py-0.5 rounded"
                        style={{ background: 'rgba(0,230,118,0.12)', color: G, border: '1px solid rgba(0,230,118,0.2)', fontSize: '0.65rem', letterSpacing: '0.04em' }}
                      >
                        FREE
                      </span>
                    )}
                  </div>
                  <div style={{ color: 'rgba(255,255,255,0.40)', fontSize: '0.78rem' }}>{p.tag}</div>
                </div>
              </FadeUp>
            ))}
          </div>

          <FadeUp>
            <div
              className="max-w-2xl mx-auto p-5 rounded-xl text-center"
              style={{ background: G_DIM, border: `1px solid ${G_BORDER}` }}
            >
              <p style={{ color: G_LIGHT, fontSize: '0.875rem', lineHeight: 1.6 }}>
                <strong style={{ color: G }}>Fine-tuning on Llama or Qwen?</strong>{' '}
                Point your vLLM endpoint at Cipherra. Eval every GRPO/PPO/DPO checkpoint without touching your training loop.
              </p>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── Diagnostic Reports ─────────────────────────────── */}
      <section className="py-20 md:py-28" id="diagnostics">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left: real screenshot */}
            <FadeUp>
              <div
                className="rounded-2xl overflow-hidden"
                style={{
                  border: '1px solid rgba(0,230,118,0.18)',
                  boxShadow: '0 0 40px rgba(0,0,0,0.5)',
                }}
              >
                <div
                  className="flex items-center gap-2 px-4 py-3"
                  style={{ background: 'rgba(13,26,18,0.95)', borderBottom: '1px solid rgba(0,230,118,0.10)' }}
                >
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f57' }} />
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#febc2e' }} />
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#28c840' }} />
                  <div
                    className="ml-3 px-3 py-1 rounded text-xs"
                    style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.35)', fontFamily: 'monospace' }}
                  >
                    app.cipherra.ai/jobs/ecdeca88…
                  </div>
                </div>
                <img
                  src="/job-detail.png"
                  alt="Cipherra diagnostic report"
                  className="w-full block"
                />
              </div>
            </FadeUp>

            {/* Right: copy */}
            <FadeUp delay={0.15}>
              <p className="font-medium uppercase tracking-widest text-xs mb-4" style={{ color: G_LIGHT }}>
                Diagnostic reports
              </p>
              <h2 className="font-bold mb-6" style={{ color: '#fff', fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)' }}>
                Not just a score.{' '}
                <span style={{ color: G }}>An action plan.</span>
              </h2>
              <p className="mb-8" style={{ color: 'rgba(255,255,255,0.50)', lineHeight: 1.75, fontSize: '1rem' }}>
                Every completed job produces a prioritized diagnostic report. Failures are classified
                by root cause — config, API, or model behavior. Issues are sorted by severity and
                fixability, with specific remediation steps you can act on immediately.
              </p>

              <div className="space-y-5">
                {[
                  {
                    color: '#f87171',
                    label: 'CRITICAL',
                    desc: 'Config or API issues — wrong step limits, auth failures, rate limits. Fix before re-running.',
                  },
                  {
                    color: '#fbbf24',
                    label: 'LIKELY',
                    desc: 'High-confidence behavioral patterns — high variance, context exceeded, consistent failure point.',
                  },
                  {
                    color: '#60a5fa',
                    label: 'POSSIBLE',
                    desc: 'Patterns worth reviewing — potential task config bugs, edge-case model behaviors.',
                  },
                ].map((item) => (
                  <div key={item.label} className="flex gap-4">
                    <div
                      className="w-2 rounded-full flex-shrink-0 mt-1"
                      style={{ background: item.color, height: '100%', minHeight: 16, alignSelf: 'stretch' }}
                    />
                    <div>
                      <span className="text-xs font-bold tracking-widest" style={{ color: item.color }}>{item.label}</span>
                      <p style={{ color: 'rgba(255,255,255,0.50)', fontSize: '0.875rem', lineHeight: 1.6, marginTop: 2 }}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ── Self-Healing Agents ────────────────────────────── */}
      <section className="py-20 md:py-28" id="self-healing">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <FadeUp className="text-center mb-14">
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-6"
              style={{ background: 'rgba(251,191,36,0.08)', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.20)' }}
            >
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#fbbf24', display: 'inline-block', boxShadow: '0 0 8px #fbbf24' }} />
              Coming Soon
            </div>
            <p className="font-medium uppercase tracking-widest text-xs mb-4" style={{ color: G_LIGHT }}>
              Self-Healing Agents
            </p>
            <h2 className="font-bold mb-4" style={{ color: '#fff', fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)' }}>
              Eval failures become{' '}
              <span style={{ color: G }}>training signal.</span>
            </h2>
            <p className="max-w-2xl mx-auto" style={{ color: 'rgba(255,255,255,0.48)', lineHeight: 1.7, fontSize: '1rem' }}>
              Pull from eval runs or stream in production traces. Not every failure is worth
              learning from — Cipherra classifies which ones are genuine model behavior gaps,
              curates the right trajectories, and automatically triggers a training job.
            </p>
          </FadeUp>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
            {SELF_HEAL_STEPS.map((step, i) => (
              <FadeUp key={step.step} delay={i * 0.09}>
                <div
                  className="p-6 h-full flex flex-col transition-all"
                  style={CARD}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = G_BORDER;
                    (e.currentTarget as HTMLElement).style.boxShadow = G_GLOW;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,230,118,0.15)';
                    (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                  }}
                >
                  <div className="flex items-center justify-between mb-5">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                      style={{ background: G_DIM, border: `1px solid ${G_BORDER}` }}
                    >
                      {step.icon}
                    </div>
                    <div className="text-xs font-bold tracking-widest" style={{ color: G, fontFamily: 'monospace' }}>{step.step}</div>
                  </div>
                  <h3 className="font-bold text-sm mb-2" style={{ color: '#fff' }}>{step.title}</h3>
                  <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.8rem', lineHeight: 1.65, flexGrow: 1 }}>{step.body}</p>
                </div>
              </FadeUp>
            ))}
          </div>

          <FadeUp delay={0.2}>
            <div className="max-w-3xl mx-auto text-center py-6">
              <p className="font-bold" style={{ color: '#fff', fontSize: 'clamp(1.15rem, 2.2vw, 1.5rem)', lineHeight: 1.5 }}>
                After every training run,{' '}
                <span style={{ color: G }}>know if your model actually got better.</span>
              </p>
              <p className="mt-3" style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Re-eval runs automatically on the new checkpoint against the exact failure categories that triggered training.
                No manual testing. No guessing. A clear signal every cycle.
              </p>
            </div>
          </FadeUp>

          <FadeUp delay={0.3}>
            <div
              className="max-w-2xl mx-auto p-5 rounded-xl text-center"
              style={{ background: G_DIM, border: `1px solid ${G_BORDER}` }}
            >
              <p style={{ color: G_LIGHT, fontSize: '0.875rem', lineHeight: 1.6 }}>
                <strong style={{ color: G }}>Works across eval and production.</strong>{' '}
                Pipe in eval run results for model testing, or connect your production trace pipeline.
                Failures that matter get fed back into the next training run — automatically.
              </p>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── Team ───────────────────────────────────────────── */}
      <section className="py-20 md:py-28" id="team">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <FadeUp className="text-center mb-14">
            <p className="font-medium uppercase tracking-widest text-xs mb-4" style={{ color: G_LIGHT }}>Founding Team</p>
            <h2 className="font-bold mb-4" style={{ color: '#fff', fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)' }}>
              Built by people who've done this before
            </h2>
            <p className="max-w-xl mx-auto" style={{ color: 'rgba(255,255,255,0.48)', lineHeight: 1.7, fontSize: '1rem' }}>
              We've worked inside the systems we're replacing — at Qualcomm, Microsoft, and IIT Madras.
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

      {/* ── CTA ────────────────────────────────────────────── */}
      <section className="py-24 md:py-32 relative overflow-hidden" id="contact">
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse at center, rgba(0,230,118,0.06) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
        <div className="max-w-3xl mx-auto px-6 lg:px-8 text-center relative z-10">
          <FadeUp>
            <h2 className="font-bold mb-4" style={{ color: '#fff', fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
              Start evaluating your agents{' '}
              <span style={{ color: G }}>continuously.</span>
            </h2>
            <p className="mb-10 max-w-xl mx-auto" style={{ color: 'rgba(255,255,255,0.48)', lineHeight: 1.7, fontSize: '1.05rem' }}>
              Free tier — 5 jobs, up to 50 tasks each, redundancy up to 3.
              Bring your own API key. No credit card required.
            </p>
          </FadeUp>

          <FadeUp delay={0.1}>
            <div
              style={{
                background: 'rgba(13,26,18,0.8)',
                border: '1px solid rgba(0,230,118,0.2)',
                borderRadius: 16,
                padding: '8px 24px 16px',
                backdropFilter: 'blur(12px)',
              }}
            >
              <iframe
                src="https://tally.so/embed/ja0baa?alignLeft=1&hideTitle=1&transparentBackground=1"
                loading="lazy"
                width="100%"
                frameBorder="0"
                title="Cipherra Early Access"
                style={{ display: 'block', height: 168, marginTop: 10 }}
              />
            </div>
          </FadeUp>
        </div>
      </section>
    </>
  );
}
