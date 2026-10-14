import { useEffect, useState, useRef } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';

declare global {
  interface Window {
    gsap: any;
    ScrollTrigger: any;
  }
}

const ACCENT = '#6b8fff';
const LINE = '#263957';
const NAV_TEXT = 'rgba(244,247,255,0.70)';
const NAV = [
  { href: '#companion', label: 'Companion' },
  { href: '#workflow', label: 'Workflow' },
  { href: '#showcase', label: 'Showcase' },
  { href: '#team', label: 'Team' },
];

export default function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const toastRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const loadGSAP = () => {
      if (window.gsap) return Promise.resolve();
      return new Promise<void>((resolve) => {
        const gsapScript = document.createElement('script');
        gsapScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js';
        gsapScript.onload = () => {
          const scrollTriggerScript = document.createElement('script');
          scrollTriggerScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js';
          scrollTriggerScript.onload = () => {
            if (window.gsap && window.ScrollTrigger) {
              window.gsap.registerPlugin(window.ScrollTrigger);
            }
            resolve();
          };
          document.head.appendChild(scrollTriggerScript);
        };
        document.head.appendChild(gsapScript);
      });
    };

    loadGSAP().then(() => {
      if (backgroundRef.current && window.gsap) {
        const container = backgroundRef.current;
        const dotCount = 80;
        const lineCount = 25;

        for (let i = 0; i < dotCount; i++) {
          const dot = document.createElement('div');
          dot.className = 'animated-dot';
          const size = Math.random() * 4 + 2;
          dot.style.width = size + 'px';
          dot.style.height = size + 'px';
          dot.style.left = Math.random() * 100 + '%';
          dot.style.top = Math.random() * 100 + '%';
          dot.style.opacity = String(Math.random() * 0.35 + 0.1);
          container.appendChild(dot);

          window.gsap.to(dot, {
            x: (Math.random() - 0.5) * 280,
            y: (Math.random() - 0.5) * 280,
            duration: Math.random() * 30 + 20,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: Math.random() * 3,
          });
        }

        for (let i = 0; i < lineCount; i++) {
          const line = document.createElement('div');
          line.className = 'animated-line';
          const length = Math.random() * 180 + 60;
          const angle = Math.random() * 360;
          line.style.width = length + 'px';
          line.style.height = '1px';
          line.style.left = Math.random() * 100 + '%';
          line.style.top = Math.random() * 100 + '%';
          line.style.transform = `rotate(${angle}deg)`;
          line.style.transformOrigin = 'left center';
          container.appendChild(line);

          window.gsap.to(line, {
            rotation: angle + 360,
            duration: Math.random() * 50 + 30,
            repeat: -1,
            ease: 'none',
          });
        }

        if (window.gsap && window.ScrollTrigger) {
          window.gsap.to(container, {
            yPercent: -25,
            ease: 'none',
            scrollTrigger: {
              trigger: 'body',
              start: 'top top',
              end: 'bottom top',
              scrub: true,
            },
          });
        }
      }
    });
  }, []);

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const target = document.querySelector(targetId);
    if (target) {
      const headerOffset = 80;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    if (isHome) {
      handleSmoothScroll(e, targetId);
    } else {
      e.preventDefault();
      navigate('/' + targetId);
      setMobileMenuOpen(false);
    }
  };

  const showToast = () => {
    if (toastRef.current && window.gsap) {
      window.gsap.to(toastRef.current, { x: 0, duration: 0.3, ease: 'power2.out' });
      setTimeout(() => {
        if (toastRef.current && window.gsap) {
          window.gsap.to(toastRef.current, { x: 400, duration: 0.3, ease: 'power2.in' });
        }
      }, 2500);
    }
  };

  const navLinkStyle = {
    color: NAV_TEXT,
    fontSize: '0.875rem',
    fontWeight: 500,
    transition: 'color 0.2s',
    textDecoration: 'none',
  };

  const footerLink = (label: string, props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a {...props} style={{ color: 'rgba(166,180,210,0.75)', fontSize: '0.875rem' }}
      onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
      onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(166,180,210,0.75)')}>
      {label}
    </a>
  );

  return (
    <div className="antialiased relative" style={{ background: '#090f25', minHeight: '100vh' }}>
      <div id="animated-background" ref={backgroundRef} />

      <header
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg"
        style={{
          background: 'rgba(9, 15, 37, 0.88)',
          borderBottom: `1px solid ${LINE}`,
        }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <nav className="flex justify-between items-center h-20">
            <Link to="/" className="flex items-center" aria-label="Cipherra home">
              <img src="/cipherra-logo-white.png" alt="Cipherra" className="logo-img" />
            </Link>
            <ul className="hidden md:flex items-center gap-8 list-none">
              {NAV.map((n) => (
                <li key={n.href}>
                  <a
                    href={n.href}
                    onClick={(e) => handleNavClick(e, n.href)}
                    style={navLinkStyle}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = NAV_TEXT)}
                  >
                    {n.label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="#contact"
                  onClick={(e) => handleNavClick(e, '#contact')}
                  className="ml-2 px-5 py-2 rounded-full text-sm font-semibold transition-all"
                  style={{
                    background: 'linear-gradient(135deg, #3b6fff 0%, #6b8fff 100%)',
                    color: '#ffffff',
                    boxShadow: '0 4px 14px rgba(107,143,255,0.25)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 0 28px rgba(107,143,255,0.55)';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 4px 14px rgba(107,143,255,0.25)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  Get Early Access
                </a>
              </li>
            </ul>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2"
              aria-label="Toggle menu"
              style={{ color: 'rgba(244,247,255,0.85)' }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </nav>
        </div>
        <div
          className={`${mobileMenuOpen ? '' : 'hidden'} md:hidden`}
          style={{ background: 'rgba(9, 15, 37, 0.98)', borderTop: `1px solid ${LINE}` }}
        >
          <div className="max-w-7xl mx-auto px-6 py-4 space-y-3">
            {NAV.map((n) => (
              <a key={n.href} href={n.href} onClick={(e) => handleNavClick(e, n.href)}
                style={{ color: NAV_TEXT, display: 'block', padding: '8px 0' }}>{n.label}</a>
            ))}
            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, '#contact')}
              className="block px-6 py-2.5 text-center rounded-full font-semibold"
              style={{ background: 'linear-gradient(135deg, #3b6fff 0%, #6b8fff 100%)', color: '#ffffff' }}
            >
              Get Early Access
            </a>
          </div>
        </div>
      </header>

      <main className="relative z-10">
        <Outlet />
      </main>

      <footer className="py-16 relative z-10" style={{ background: '#070c1e', borderTop: `1px solid ${LINE}` }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="h-10 mb-4 flex items-center">
                <img src="/cipherra-logo-white.png" alt="Cipherra" className="h-7 w-auto" />
              </div>
              <p style={{ color: 'rgba(166,180,210,0.70)', fontSize: '0.85rem', lineHeight: 1.65 }}>
                A companion for architectural work. From bubble diagrams and CAD drawings to renders, enhanced stills, and walkthroughs, with review built in.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4" style={{ color: '#f4f7ff' }}>Product</h4>
              <ul className="space-y-3">
                {NAV.slice(0, 3).map((n) => (
                  <li key={n.href}>{footerLink(n.label, { href: n.href, onClick: (e) => handleNavClick(e, n.href) })}</li>
                ))}
                <li>{footerLink('Documentation', { href: '#', onClick: (e) => { e.preventDefault(); showToast(); } })}</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4" style={{ color: '#f4f7ff' }}>Company</h4>
              <ul className="space-y-3">
                <li>{footerLink('Team', { href: '#team', onClick: (e) => handleNavClick(e, '#team') })}</li>
                <li>{footerLink('InstaML', { href: 'https://instaml.cipherra.ai' })}</li>
                <li>{footerLink('Careers', { href: '#', onClick: (e) => { e.preventDefault(); showToast(); } })}</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4" style={{ color: '#f4f7ff' }}>Contact</h4>
              <ul className="space-y-3">
                <li>{footerLink('Email', { href: 'mailto:nithesh@cipherra.ai,dhruv@cipherra.ai' })}</li>
                <li>{footerLink('LinkedIn', { href: '#', onClick: (e) => { e.preventDefault(); showToast(); } })}</li>
                <li>{footerLink('Twitter', { href: '#', onClick: (e) => { e.preventDefault(); showToast(); } })}</li>
              </ul>
            </div>
          </div>
          <div className="pt-8" style={{ borderTop: '1px solid rgba(38,57,87,0.7)', textAlign: 'center' }}>
            <p style={{ color: 'rgba(166,180,210,0.50)', fontSize: '0.875rem' }}>© 2026 Cipherra. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <div
        ref={toastRef}
        className="fixed top-5 right-5 px-6 py-4 rounded-full font-semibold shadow-2xl z-50"
        style={{
          background: ACCENT,
          color: '#ffffff',
          transform: 'translateX(400px)',
          transition: 'transform 0.3s',
        }}
      >
        Coming Soon!
      </div>
    </div>
  );
}
