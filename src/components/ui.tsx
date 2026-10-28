import { motion } from 'framer-motion';
import { ACCENT, MUTED, TEXT } from '../theme';

/* Shared building blocks for the site's pages. */

/* ── SVG icon system ─────────────────────────────────────── */
export function Svg({ children, size = 22 }: { children: React.ReactNode; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      {children}
    </svg>
  );
}
export const ICONS = {
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
export function FadeUp({ children, delay = 0, style, className }: {
  children: React.ReactNode; delay?: number; style?: React.CSSProperties; className?: string;
}) {
  return (
    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }}
      custom={delay} variants={fadeUp} style={style} className={className}>
      {children}
    </motion.div>
  );
}
export function Eyebrow({ children, color = ACCENT }: { children: React.ReactNode; color?: string }) {
  return (
    <p className="font-semibold uppercase tracking-widest text-xs mb-4" style={{ color }}>
      {children}
    </p>
  );
}

export const h2Style: React.CSSProperties = { color: TEXT, fontSize: 'clamp(1.9rem, 3.5vw, 2.6rem)', lineHeight: 1.15 };
export const h3Style: React.CSSProperties = { color: TEXT, fontSize: 'clamp(1.5rem, 2.6vw, 2rem)', lineHeight: 1.2 };
export const leadStyle: React.CSSProperties = { color: MUTED, lineHeight: 1.7, fontSize: '1.05rem' };
