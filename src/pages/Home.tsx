import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import HEAnimation from '../components/HEAnimation';

declare global {
  interface Window {
    gsap: any;
    ScrollTrigger: any;
  }
}

export default function Home() {
  const location = useLocation();

  // When navigating from another page with a hash (e.g. /#features), scroll to that section
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
        const cards = document.querySelectorAll('.glass-card, .bg-white.rounded-2xl');
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
      {/* indexML announcement banner - spacer pushes it below the fixed header (h-20 = 80px) */}
      <div className="pt-20">
        <div className="bg-cipherra-blue text-white text-center py-3 px-4">
          <a href="https://instaml.cipherra.ai" className="inline-flex items-center gap-2 font-medium hover:underline underline-offset-2">
            <span>🚀 Introducing InstaML — AI inference on Indian GPUs, live in minutes</span>
            <span className="hidden sm:inline">Learn more →</span>
          </a>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden bg-gradient-to-br from-white/40 via-cipherra-blue-lighter/40 to-white/40 backdrop-blur-xs z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight">
              <span className="text-gray-900">Compute on Encrypted Data</span><br />
              <span className="gradient-text">Without Ever Decrypting It</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
              Revolutionary homomorphic encryption technology enabling secure data processing while maintaining complete privacy. Your data stays encrypted from start to finish.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a href="#contact" className="px-8 py-4 bg-cipherra-blue text-white font-semibold rounded-full hover:bg-cipherra-blue-dark transition-all shadow-xl shadow-cipherra-blue/30 hover:shadow-2xl hover:shadow-cipherra-blue/40 hover:-translate-y-1 text-lg">
                Get Early Access
              </a>
              <a href="#he-animation" className="px-8 py-4 bg-white text-cipherra-blue font-semibold rounded-full border-2 border-cipherra-blue hover:bg-cipherra-blue-light transition-all text-lg">
                Learn More
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 md:py-32 bg-white/40 backdrop-blur-xs relative z-10" id="features">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Why Homomorphic Encryption Changes Everything
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Unlock the power of secure computation without compromising privacy
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-card rounded-3xl p-8 shadow-xl card-hover">
              <div className="w-16 h-16 bg-gradient-to-br from-cipherra-blue to-cipherra-blue-dark rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <span className="text-3xl">🔐</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Never Decrypt</h3>
              <p className="text-gray-600 leading-relaxed">
                Perform complex computations on encrypted data without ever exposing the raw information. Your sensitive data remains protected throughout the entire process.
              </p>
            </div>

            <div className="glass-card rounded-3xl p-8 shadow-xl card-hover">
              <div className="w-16 h-16 bg-gradient-to-br from-cipherra-blue to-cipherra-blue-dark rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <span className="text-3xl">⚡</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Full Functionality</h3>
              <p className="text-gray-600 leading-relaxed">
                Execute any mathematical operation, machine learning algorithm, or business logic on encrypted data with complete functionality preserved.
              </p>
            </div>

            <div className="glass-card rounded-3xl p-8 shadow-xl card-hover">
              <div className="w-16 h-16 bg-gradient-to-br from-cipherra-blue to-cipherra-blue-dark rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <span className="text-3xl">🌐</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Zero Trust Architecture</h3>
              <p className="text-gray-600 leading-relaxed">
                Enable secure multi-party computation where no single entity has access to the complete dataset, perfect for collaborative analytics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Homomorphic Encryption Animation Section */}
      <section className="py-20 md:py-28 bg-white/40 backdrop-blur-xs relative z-10" id="he-animation">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <HEAnimation />
        </div>
      </section>

      {/* Applications Section */}
      <section className="py-24 md:py-32 bg-gradient-to-b from-white/40 to-gray-50/40 backdrop-blur-xs relative z-10" id="applications">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Potential Applications We're Exploring
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Transforming industries with privacy-preserving analytics
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-md hover:shadow-xl hover:border-cipherra-blue/30 transition-all card-hover">
              <div className="w-12 h-12 bg-cipherra-blue-light rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl">🏥</span>
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">Healthcare Analytics</h4>
              <p className="text-gray-600 leading-relaxed text-sm">Analyze patient data across hospitals without compromising privacy or HIPAA compliance.</p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-md hover:shadow-xl hover:border-cipherra-blue/30 transition-all card-hover">
              <div className="w-12 h-12 bg-cipherra-blue-light rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl">💳</span>
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">Financial Services</h4>
              <p className="text-gray-600 leading-relaxed text-sm">Enable secure credit scoring and fraud detection while keeping financial data encrypted.</p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-md hover:shadow-xl hover:border-cipherra-blue/30 transition-all card-hover">
              <div className="w-12 h-12 bg-cipherra-blue-light rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl">☁️</span>
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">Cloud Computing</h4>
              <p className="text-gray-600 leading-relaxed text-sm">Process sensitive workloads in the cloud without trusting the cloud provider with your data.</p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-md hover:shadow-xl hover:border-cipherra-blue/30 transition-all card-hover">
              <div className="w-12 h-12 bg-cipherra-blue-light rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl">🤖</span>
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">Machine Learning</h4>
              <p className="text-gray-600 leading-relaxed text-sm">Train ML models on encrypted datasets, enabling privacy-preserving AI applications.</p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-md hover:shadow-xl hover:border-cipherra-blue/30 transition-all card-hover">
              <div className="w-12 h-12 bg-cipherra-blue-light rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl">🛡️</span>
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">Government & Defense</h4>
              <p className="text-gray-600 leading-relaxed text-sm">Secure multi-agency data sharing and analysis without exposing classified information.</p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-md hover:shadow-xl hover:border-cipherra-blue/30 transition-all card-hover">
              <div className="w-12 h-12 bg-cipherra-blue-light rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl">📡</span>
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">IoT & Edge Computing</h4>
              <p className="text-gray-600 leading-relaxed text-sm">Process sensor data securely at the edge while maintaining end-to-end encryption.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 md:py-32 bg-gradient-to-br from-cipherra-blue via-cipherra-blue-dark to-cipherra-blue text-white relative overflow-hidden z-10" id="contact">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Transform Data Privacy?
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Join us in building the future of secure computation. Get early access to our platform and help shape the applications that matter most.
          </p>
          <div className="max-w-2xl mx-auto mb-8 bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden">
            <div className="p-6 md:p-8 pt-8 md:pt-10">
              <iframe src="https://tally.so/embed/wAGZxN?alignLeft=1&hideTitle=1&transparentBackground=1" loading="lazy" width="100%" frameBorder="0" marginHeight={0} marginWidth={0} title="Cipherra Early Access" className="h-[280px] md:h-[200px] w-full rounded-none block" style={{ borderRadius: 0 }}></iframe>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
