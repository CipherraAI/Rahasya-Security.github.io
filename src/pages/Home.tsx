import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';

declare global {
  interface Window {
    gsap: any;
    ScrollTrigger: any;
  }
}

const G = '#0026a4';
const G_LIGHT = '#0026a4';

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
        border: `1px solid ${hovered ? G : 'rgba(0,38,164,0.18)'}`,
        borderRadius: 20,
        padding: '36px 32px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        transition: 'all 0.25s ease',
        boxShadow: hovered ? '0 0 32px rgba(0,38,164,0.22), 0 12px 40px rgba(0,0,0,0.12)' : '0 4px 20px rgba(0,0,0,0.08)',
        transform: hovered ? 'translateY(-6px)' : 'none',
      }}
    >
      <div style={{
        width: 112, height: 112,
        borderRadius: '50%',
        overflow: 'hidden',
        border: `3px solid ${hovered ? G : 'rgba(0,38,164,0.22)'}`,
        boxShadow: hovered ? '0 0 24px rgba(0,38,164,0.40)' : '0 0 12px rgba(0,38,164,0.12)',
        marginBottom: 20,
        transition: 'all 0.25s ease',
        flexShrink: 0,
      }}>
        <img src={photo} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
        <h3 style={{ color: '#0d1230', fontWeight: 800, fontSize: 20 }}>{name}</h3>
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

  // GSAP scroll-triggered animations for cards (Layout loads GSAP)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (window.gsap && window.ScrollTrigger) {
        const cards = document.querySelectorAll('.glass-card, .reveal-card');
        cards.forEach((card, index) => {
          const rect = (card as HTMLElement).getBoundingClientRect();
          const isInViewport = rect.top < window.innerHeight * 0.95 && rect.bottom > 0;
          if (isInViewport) {
            window.gsap.set(card, { opacity: 1, y: 0 });
          } else {
            window.gsap.set(card, { opacity: 0, y: 50 });
            window.gsap.to(card, {
              opacity: 1,
              y: 0,
              duration: 0.3,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: card,
                start: 'top 95%',
                toggleActions: 'play none none none',
                once: true,
              },
              delay: index * 0.1,
            });
          }
        });
      }
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-40 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-gradient-to-br from-white/40 via-cipherra-blue-lighter/40 to-white/40 backdrop-blur-xs z-10" id="hero">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 rounded-full bg-cipherra-blue-light text-cipherra-blue text-sm font-semibold">
              <span className="w-2 h-2 rounded-full bg-cipherra-blue animate-pulse"></span>
              Coordination layer for multi-agent coding
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight">
              <span className="text-gray-900">Multiple coding agents. One codebase.</span><br />
              <span className="gradient-text">Zero merge chaos.</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
              When several AI agents edit the same repository in parallel, they duplicate work, overwrite each other, and produce patches that don't merge. Cipherra gives them a shared coordination layer — ownership, shared memory, and structured hand-offs — so a team of agents behaves like a coordinated engineering team instead of colliding individuals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a href="#contact" className="px-8 py-4 bg-cipherra-blue text-white font-semibold rounded-full hover:bg-cipherra-blue-dark transition-all shadow-xl shadow-cipherra-blue/30 hover:shadow-2xl hover:shadow-cipherra-blue/40 hover:-translate-y-1 text-lg">
                Get Early Access
              </a>
              <a href="#how-it-works" className="px-8 py-4 bg-white text-cipherra-blue font-semibold rounded-full border-2 border-cipherra-blue hover:bg-cipherra-blue-light transition-all text-lg">
                See How It Works
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-24 md:py-32 bg-white/40 backdrop-blur-xs relative z-10" id="problem">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              More agents shouldn't mean more chaos
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Frontier coding runs multiple agents in parallel — but they have no way to coordinate on shared code. Adding <em>more</em> agents often makes runs <span className="font-semibold text-gray-800">worse</span>, not better. Coordination — not raw model power — is the bottleneck.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="reveal-card bg-white rounded-2xl p-6 border border-gray-200 shadow-md">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">🔁</span>
                <h4 className="text-lg font-bold text-gray-900">Duplicated effort</h4>
              </div>
              <p className="text-gray-600 leading-relaxed text-sm">Agents re-derive the same facts and re-read the same files, over and over.</p>
            </div>
            <div className="reveal-card bg-white rounded-2xl p-6 border border-gray-200 shadow-md">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">💥</span>
                <h4 className="text-lg font-bold text-gray-900">Collisions</h4>
              </div>
              <p className="text-gray-600 leading-relaxed text-sm">Two agents edit the same function; their patches conflict at merge time.</p>
            </div>
            <div className="reveal-card bg-white rounded-2xl p-6 border border-gray-200 shadow-md">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">🧩</span>
                <h4 className="text-lg font-bold text-gray-900">Silent build breaks</h4>
              </div>
              <p className="text-gray-600 leading-relaxed text-sm">Each adds the same new helper; the merge is "clean" but doesn't compile.</p>
            </div>
            <div className="reveal-card bg-white rounded-2xl p-6 border border-gray-200 shadow-md">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">🔌</span>
                <h4 className="text-lg font-bold text-gray-900">Interface mismatches</h4>
              </div>
              <p className="text-gray-600 leading-relaxed text-sm">One agent expects a signature the other never delivered.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works / Solution Section */}
      <section className="py-24 md:py-32 bg-gradient-to-b from-white/40 to-gray-50/40 backdrop-blur-xs relative z-10" id="how-it-works">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              A coordination layer agents share
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Cipherra borrows the model of <span className="font-semibold text-gray-800">cache coherence</span> — how CPU cores share memory without corrupting it — and applies it to agents sharing a codebase. It's model-agnostic and drops in as a shared service the agents talk to.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="glass-card rounded-3xl p-8 shadow-xl card-hover">
              <div className="w-16 h-16 bg-gradient-to-br from-cipherra-blue to-cipherra-blue-dark rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <span className="text-3xl">🧠</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Shared memory</h3>
              <p className="text-gray-600 leading-relaxed">
                An agent records a derived insight — a signature, a contract, a gotcha — and teammates <span className="font-semibold text-gray-800">recall</span> exactly what they need instead of re-deriving it. Stale premises are invalidated automatically.
              </p>
            </div>

            <div className="glass-card rounded-3xl p-8 shadow-xl card-hover">
              <div className="w-16 h-16 bg-gradient-to-br from-cipherra-blue to-cipherra-blue-dark rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <span className="text-3xl">🔑</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Ownership</h3>
              <p className="text-gray-600 leading-relaxed">
                An agent <span className="font-semibold text-gray-800">claims</span> a code region before editing it. If it's unowned, it becomes the sole writer; if a teammate owns it, the agent <span className="font-semibold text-gray-800">asks</span> instead of editing — so patches merge cleanly by construction. Overlap is detected by symbol containment, so genuinely-separate work stays parallel.
              </p>
            </div>

            <div className="glass-card rounded-3xl p-8 shadow-xl card-hover">
              <div className="w-16 h-16 bg-gradient-to-br from-cipherra-blue to-cipherra-blue-dark rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <span className="text-3xl">✨</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">New-symbol coordination</h3>
              <p className="text-gray-600 leading-relaxed">
                Catches the case where two agents independently add the <span className="font-semibold text-gray-800">same</span> new function or symbol — a clean git merge that fails to compile — and routes them to reuse one definition.
              </p>
            </div>

            <div className="glass-card rounded-3xl p-8 shadow-xl card-hover">
              <div className="w-16 h-16 bg-gradient-to-br from-cipherra-blue to-cipherra-blue-dark rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <span className="text-3xl">🤝</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Structured hand-offs</h3>
              <p className="text-gray-600 leading-relaxed">
                Planner → coders → reviewer → fixer, with each role's findings automatically passed to the next through the shared layer.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-24 md:py-32 bg-white/40 backdrop-blur-xs relative z-10" id="results">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Coordination, not model size, closes the gap
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Evaluated on <span className="font-semibold text-gray-800">CooperBench</span>, a multi-agent software-engineering benchmark where two agents implement different features in the same codebase, using a deliberately weak/small model — so the gains come from coordination, not model strength.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-5xl mx-auto mb-10">
            <div className="glass-card rounded-3xl p-8 shadow-xl text-center card-hover">
              <div className="text-5xl font-extrabold gradient-text mb-2">56% → 78%</div>
              <div className="text-gray-900 font-semibold mb-1">Clean-merge rate</div>
              <p className="text-gray-600 text-sm">Merge conflicts cut roughly in half.</p>
            </div>
            <div className="glass-card rounded-3xl p-8 shadow-xl text-center card-hover">
              <div className="text-5xl font-extrabold gradient-text mb-2">30% → 38%</div>
              <div className="text-gray-900 font-semibold mb-1">Task success rate</div>
              <p className="text-gray-600 text-sm">On a matched 50-task set, both arms measured identically.</p>
            </div>
            <div className="glass-card rounded-3xl p-8 shadow-xl text-center card-hover">
              <div className="text-5xl font-extrabold gradient-text mb-2">Fewer</div>
              <div className="text-gray-900 font-semibold mb-1">Wasted steps</div>
              <p className="text-gray-600 text-sm">Coordinated agents reach solutions with substantially less redundant exploration.</p>
            </div>
          </div>

          <div className="max-w-3xl mx-auto text-center">
            <p className="text-gray-700 leading-relaxed mb-4">
              We also built a generic <span className="font-semibold text-gray-900">plan → code → review → fix</span> multi-agent pipeline that officially resolves real open-source bug-fix tasks a single agent fails to complete.
            </p>
            <p className="text-sm text-gray-500 italic">
              These are research-benchmark results on small models, chosen to isolate the value of coordination. They are not production customer results.
            </p>
          </div>
        </div>
      </section>

      {/* Use cases Section */}
      <section className="py-24 md:py-32 bg-gradient-to-b from-white/40 to-gray-50/40 backdrop-blur-xs relative z-10" id="use-cases">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Who it's for
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              A coordination primitive for anyone running more than one agent on a codebase
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="reveal-card bg-white rounded-2xl p-8 border border-gray-200 shadow-md hover:shadow-xl hover:border-cipherra-blue/30 transition-all card-hover">
              <div className="w-12 h-12 bg-cipherra-blue-light rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl">🛠️</span>
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">Multi-agent coding platforms & IDE agents</h4>
              <p className="text-gray-600 leading-relaxed text-sm">Running several agents on one repo without them stepping on each other.</p>
            </div>
            <div className="reveal-card bg-white rounded-2xl p-8 border border-gray-200 shadow-md hover:shadow-xl hover:border-cipherra-blue/30 transition-all card-hover">
              <div className="w-12 h-12 bg-cipherra-blue-light rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl">🧱</span>
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">Agent framework builders</h4>
              <p className="text-gray-600 leading-relaxed text-sm">Who need a coordination primitive — ownership plus shared memory — rather than reinventing it.</p>
            </div>
            <div className="reveal-card bg-white rounded-2xl p-8 border border-gray-200 shadow-md hover:shadow-xl hover:border-cipherra-blue/30 transition-all card-hover">
              <div className="w-12 h-12 bg-cipherra-blue-light rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl">🧭</span>
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">Long-horizon SWE tasks</h4>
              <p className="text-gray-600 leading-relaxed text-sm">Decomposed across specialized agents — planner, coders, reviewer, fixer.</p>
            </div>
          </div>

          {/* Roadmap */}
          <div className="mt-20 max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <span className="inline-block px-4 py-1.5 rounded-full bg-cipherra-blue-light text-cipherra-blue text-sm font-semibold mb-3">Where we're headed</span>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900">Roadmap</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="glass-card rounded-2xl p-6 shadow-lg">
                <p className="text-gray-700 leading-relaxed text-sm">Coordination for larger, long-horizon tasks — many files, many agents.</p>
              </div>
              <div className="glass-card rounded-2xl p-6 shadow-lg">
                <p className="text-gray-700 leading-relaxed text-sm">Stronger models as executors under the same coordination layer.</p>
              </div>
              <div className="glass-card rounded-2xl p-6 shadow-lg">
                <p className="text-gray-700 leading-relaxed text-sm">Deeper integration hooks for popular agent frameworks.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section (preserved from prior site) */}
      <section className="py-20 md:py-28 relative z-10" id="team">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <FadeUp className="text-center mb-14">
            <p className="font-medium uppercase tracking-widest text-xs mb-4" style={{ color: G_LIGHT }}>Founding Team</p>
            <h2 className="font-bold mb-4" style={{ color: '#0d1230', fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)' }}>
              Built by people who've done this before
            </h2>
            <p className="max-w-xl mx-auto" style={{ color: 'rgba(13,18,48,0.58)', lineHeight: 1.7, fontSize: '1rem' }}>
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

      {/* CTA / Contact Section (preserved Tally form) */}
      <section className="py-24 md:py-32 relative overflow-hidden z-10" id="contact">
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse at center, rgba(0,38,164,0.08) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
        <div className="max-w-3xl mx-auto px-6 lg:px-8 text-center relative z-10">
          <FadeUp>
            <h2 className="font-bold mb-4" style={{ color: '#0d1230', fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
              Give your agents a way to{' '}
              <span style={{ color: G }}>work together.</span>
            </h2>
            <p className="mb-10 max-w-xl mx-auto" style={{ color: 'rgba(13,18,48,0.58)', lineHeight: 1.7, fontSize: '1.05rem' }}>
              We're working with early partners running multiple agents on real codebases.
              Get early access and help shape the coordination layer.
            </p>
          </FadeUp>

          <FadeUp delay={0.1}>
            <div
              style={{
                background: '#ffffff',
                border: '1px solid rgba(0,38,164,0.22)',
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
