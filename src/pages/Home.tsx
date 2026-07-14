import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';

const G = '#0026a4';
const G_LIGHT = '#0026a4';
const HEADING = '#0d1230';
const BODY = 'rgba(13,18,48,0.60)';

const cardClass =
  'bg-white rounded-2xl border border-[rgba(0,38,164,0.10)] shadow-[0_1px_3px_rgba(13,18,48,0.04)] ' +
  'transition-all duration-300 hover:-translate-y-1 hover:border-[rgba(0,38,164,0.35)] ' +
  'hover:shadow-[0_16px_44px_rgba(0,38,164,0.10)]';

const iconChipClass =
  'w-11 h-11 rounded-xl flex items-center justify-center mb-5 text-xl bg-cipherra-blue-light';

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
        background: '#ffffff',
        border: `1px solid ${hovered ? G : 'rgba(0,38,164,0.12)'}`,
        borderRadius: 20,
        padding: '36px 32px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        transition: 'all 0.25s ease',
        boxShadow: hovered ? '0 16px 44px rgba(0,38,164,0.12)' : '0 1px 3px rgba(13,18,48,0.04)',
        transform: hovered ? 'translateY(-6px)' : 'none',
      }}
    >
      <div style={{
        width: 112, height: 112,
        borderRadius: '50%',
        overflow: 'hidden',
        border: `3px solid ${hovered ? G : 'rgba(0,38,164,0.18)'}`,
        boxShadow: hovered ? '0 0 24px rgba(0,38,164,0.35)' : '0 0 12px rgba(0,38,164,0.10)',
        marginBottom: 20,
        transition: 'all 0.25s ease',
        flexShrink: 0,
      }}>
        <img src={photo} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
        <h3 style={{ color: HEADING, fontWeight: 800, fontSize: 20 }}>{name}</h3>
        <a href={linkedin} target="_blank" rel="noopener noreferrer"
          style={{ display: 'flex', flexShrink: 0, color: 'rgba(13,18,48,0.45)', transition: 'color 0.2s' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#0a66c2')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(13,18,48,0.45)')}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
        </a>
      </div>
      <p style={{ color: G, fontSize: 13, fontWeight: 600, marginBottom: 16, letterSpacing: '0.02em' }}>{role}</p>
      <p style={{ color: 'rgba(13,18,48,0.55)', fontSize: 14, lineHeight: 1.7 }}>{bio}</p>
    </div>
  );
}

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
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

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-semibold uppercase tracking-widest text-xs mb-4" style={{ color: G_LIGHT }}>
      {children}
    </p>
  );
}

const h2Style: React.CSSProperties = { color: HEADING, fontSize: 'clamp(1.9rem, 3.5vw, 2.6rem)', lineHeight: 1.15 };
const leadStyle: React.CSSProperties = { color: BODY, lineHeight: 1.7, fontSize: '1.05rem' };

export default function Home() {
  const location = useLocation();

  // When navigating with a hash (e.g. /#how-it-works), scroll to that section
  useEffect(() => {
    if (location.hash) {
      const el = document.querySelector(location.hash);
      if (el) {
        const headerOffset = 80;
        const elementPosition = el.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      }
    }
  }, [location.pathname, location.hash]);

  return (
    <>
      {/* Hero */}
      <section className="relative pt-40 pb-24 md:pt-48 md:pb-32 overflow-hidden z-10" id="hero">
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(0,38,164,0.07) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <FadeUp>
              <div
                className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 rounded-full text-sm font-medium"
                style={{ background: 'rgba(0,38,164,0.07)', color: G, border: '1px solid rgba(0,38,164,0.15)' }}
              >
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: G }}></span>
                Coordination layer for multi-agent coding
              </div>
              <h1 className="font-extrabold mb-6 tracking-tight" style={{ color: HEADING, fontSize: 'clamp(2.6rem, 6vw, 4.5rem)', lineHeight: 1.05 }}>
                Multiple coding agents. One codebase.<br />
                <span className="gradient-text">Zero merge chaos.</span>
              </h1>
              <p className="mx-auto mb-10" style={{ color: BODY, fontSize: '1.2rem', lineHeight: 1.7, maxWidth: '640px' }}>
                When several AI agents edit the same repository in parallel, they duplicate work, overwrite each other, and produce patches that don't merge. Cipherra gives them a shared coordination layer: ownership, shared memory, and structured hand-offs, so a team of agents behaves like a coordinated engineering team instead of colliding individuals.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a
                  href="#contact"
                  className="px-7 py-3.5 rounded-full text-white font-semibold text-base transition-all hover:-translate-y-0.5"
                  style={{ background: G, boxShadow: '0 6px 20px rgba(0,38,164,0.25)' }}
                >
                  Get Early Access
                </a>
                <a
                  href="#how-it-works"
                  className="px-7 py-3.5 rounded-full font-semibold text-base transition-all"
                  style={{ background: '#ffffff', color: G, border: '1px solid rgba(0,38,164,0.25)' }}
                >
                  See How It Works
                </a>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="py-20 md:py-28 relative z-10" id="problem">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <FadeUp className="text-center mb-14">
            <Eyebrow>The problem</Eyebrow>
            <h2 className="font-bold mb-4" style={h2Style}>
              More agents shouldn't mean more chaos
            </h2>
            <p className="max-w-2xl mx-auto" style={leadStyle}>
              Frontier coding runs multiple agents in parallel, but they have no way to coordinate on shared code. Adding more agents often makes runs worse, not better. Coordination, not raw model power, is the bottleneck.
            </p>
          </FadeUp>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-4xl mx-auto">
            {[
              { icon: '🔁', title: 'Duplicated effort', body: 'Agents re-derive the same facts and re-read the same files, over and over.' },
              { icon: '💥', title: 'Collisions', body: 'Two agents edit the same function; their patches conflict at merge time.' },
              { icon: '🧩', title: 'Silent build breaks', body: 'Each adds the same new helper; the merge is "clean" but doesn\'t compile.' },
              { icon: '🔌', title: 'Interface mismatches', body: 'One agent expects a signature the other never delivered.' },
            ].map((p, i) => (
              <FadeUp key={p.title} delay={i * 0.08}>
                <div className={`${cardClass} p-6`}>
                  <div className="flex items-center gap-3 mb-2.5">
                    <span className={iconChipClass} style={{ marginBottom: 0, width: 38, height: 38 }}>{p.icon}</span>
                    <h4 className="text-lg font-bold" style={{ color: HEADING }}>{p.title}</h4>
                  </div>
                  <p style={{ color: BODY, fontSize: '0.92rem', lineHeight: 1.65 }}>{p.body}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 md:py-28 relative z-10" id="how-it-works">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <FadeUp className="text-center mb-16">
            <Eyebrow>How it works</Eyebrow>
            <h2 className="font-bold mb-4" style={h2Style}>
              A coordination layer agents share
            </h2>
            <p className="max-w-2xl mx-auto" style={leadStyle}>
              Cipherra borrows the model of cache coherence, how CPU cores share memory without corrupting it, and applies it to agents sharing a codebase. It's model-agnostic and drops in as a shared service the agents talk to.
            </p>
          </FadeUp>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {[
              {
                icon: '🧠',
                title: 'Shared memory',
                body: 'An agent records a derived insight (a signature, a contract, a gotcha) and teammates recall exactly what they need instead of re-deriving it. Stale premises are invalidated automatically.',
              },
              {
                icon: '🔑',
                title: 'Ownership',
                body: 'An agent claims a code region before editing it. If it\'s unowned, it becomes the sole writer; if a teammate owns it, the agent asks instead of editing, so patches merge cleanly by construction. Overlap is detected by symbol containment, so genuinely separate work stays parallel.',
              },
              {
                icon: '✨',
                title: 'New-symbol coordination',
                body: 'Catches the case where two agents independently add the same new function or symbol (a clean git merge that fails to compile) and routes them to reuse one definition.',
              },
              {
                icon: '🤝',
                title: 'Structured hand-offs',
                body: 'Planner → coders → reviewer → fixer, with each role\'s findings automatically passed to the next through the shared layer.',
              },
            ].map((step, i) => (
              <FadeUp key={step.title} delay={i * 0.08}>
                <div className={`${cardClass} p-8 h-full`}>
                  <div className={iconChipClass}>{step.icon}</div>
                  <h3 className="text-xl font-bold mb-3" style={{ color: HEADING }}>{step.title}</h3>
                  <p style={{ color: BODY, lineHeight: 1.7, fontSize: '0.95rem' }}>{step.body}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="py-20 md:py-28 relative z-10" id="results">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <FadeUp className="text-center mb-14">
            <Eyebrow>Results</Eyebrow>
            <h2 className="font-bold mb-4" style={h2Style}>
              Coordination, not model size, closes the gap
            </h2>
            <p className="max-w-2xl mx-auto" style={leadStyle}>
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
                <div className={`${cardClass} p-8 text-center h-full`}>
                  <div className="text-4xl md:text-[2.6rem] font-extrabold gradient-text mb-2 leading-none">{s.stat}</div>
                  <div className="font-semibold mb-1.5" style={{ color: HEADING }}>{s.label}</div>
                  <p style={{ color: BODY, fontSize: '0.9rem', lineHeight: 1.6 }}>{s.body}</p>
                </div>
              </FadeUp>
            ))}
          </div>

          <FadeUp delay={0.1}>
            <div
              className="max-w-3xl mx-auto rounded-2xl p-8 text-center"
              style={{ background: 'rgba(0,38,164,0.05)', border: '1px solid rgba(0,38,164,0.18)' }}
            >
              <p className="font-bold mb-2" style={{ color: HEADING, fontSize: 'clamp(1.15rem, 2.2vw, 1.45rem)', lineHeight: 1.4 }}>
                Flash-class models, frontier-class results.
              </p>
              <p style={{ color: BODY, lineHeight: 1.7, fontSize: '1rem' }}>
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
            <h2 className="font-bold mb-4" style={h2Style}>
              Who it's for
            </h2>
            <p className="max-w-2xl mx-auto" style={leadStyle}>
              A coordination primitive for anyone running more than one agent on a codebase.
            </p>
          </FadeUp>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { icon: '🛠️', title: 'Multi-agent coding platforms & IDE agents', body: 'Running several agents on one repo without them stepping on each other.' },
              { icon: '🧱', title: 'Agent framework builders', body: 'Who need a coordination primitive (ownership plus shared memory) rather than reinventing it.' },
              { icon: '🧭', title: 'Long-horizon SWE tasks', body: 'Decomposed across specialized agents: planner, coders, reviewer, and fixer.' },
            ].map((u, i) => (
              <FadeUp key={u.title} delay={i * 0.1}>
                <div className={`${cardClass} p-8 h-full`}>
                  <div className={iconChipClass}>{u.icon}</div>
                  <h4 className="text-lg font-bold mb-3" style={{ color: HEADING }}>{u.title}</h4>
                  <p style={{ color: BODY, lineHeight: 1.7, fontSize: '0.95rem' }}>{u.body}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 md:py-28 relative z-10" id="team">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <FadeUp className="text-center mb-14">
            <Eyebrow>Founding Team</Eyebrow>
            <h2 className="font-bold mb-4" style={h2Style}>
              Built by people who've done this before
            </h2>
            <p className="max-w-xl mx-auto" style={leadStyle}>
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
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse at center, rgba(0,38,164,0.07) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
        <div className="max-w-3xl mx-auto px-6 lg:px-8 text-center relative z-10">
          <FadeUp>
            <h2 className="font-bold mb-4" style={{ color: HEADING, fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
              Give your agents a way to{' '}
              <span style={{ color: G }}>work together.</span>
            </h2>
            <p className="mb-10 max-w-xl mx-auto" style={leadStyle}>
              We're working with early partners running multiple agents on real codebases. Get early access and help shape the coordination layer.
            </p>
          </FadeUp>

          <FadeUp delay={0.1}>
            <div
              style={{
                background: '#ffffff',
                border: '1px solid rgba(0,38,164,0.18)',
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
