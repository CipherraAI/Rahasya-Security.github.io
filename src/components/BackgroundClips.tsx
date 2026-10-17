import ClipCycler, { CLIPS } from './ClipCycler';

/* Full-screen walkthrough clips behind the page, faded so content stays readable. */
export default function BackgroundClips() {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
      <ClipCycler clips={[CLIPS.arrival, CLIPS.passage, CLIPS.villas, CLIPS.rishikesh]} fadeMs={1600}
        style={{ position: 'absolute', inset: 0, opacity: 0.22 }} />
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 120% 90% at 50% 40%, rgba(9,15,37,0.15) 0%, rgba(9,15,37,0.75) 100%)',
      }} />
    </div>
  );
}
