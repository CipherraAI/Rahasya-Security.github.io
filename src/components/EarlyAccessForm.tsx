import { useState } from 'react';
import { ACCENT, ACCENT_GRAD, BG, GREEN, LINE, MUTED, SURFACE, TEXT } from '../theme';

type Status = 'idle' | 'sending' | 'done' | 'error';

const EMPTY = { name: '', email: '', company: '', role: '', message: '', website: '' };

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: BG,
  border: `1px solid ${LINE}`,
  borderRadius: 12,
  padding: '12px 14px',
  color: TEXT,
  fontSize: '0.95rem',
  outline: 'none',
  transition: 'border-color 0.2s, box-shadow 0.2s',
};

function Field({ label, optional, children }: { label: string; optional?: boolean; children: React.ReactNode }) {
  return (
    <label className="block text-left">
      <span className="block mb-1.5 font-semibold" style={{ color: TEXT, fontSize: '0.82rem' }}>
        {label}
        {optional && <span style={{ color: MUTED, fontWeight: 500 }}> (optional)</span>}
      </span>
      {children}
    </label>
  );
}

const focus = {
  onFocus: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.currentTarget.style.borderColor = ACCENT;
    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(107,143,255,0.18)';
  },
  onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.currentTarget.style.borderColor = LINE;
    e.currentTarget.style.boxShadow = 'none';
  },
};

export default function EarlyAccessForm() {
  const [form, setForm] = useState(EMPTY);
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');

  const set = (k: keyof typeof EMPTY) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setError('');
    try {
      const res = await fetch('/api/early-access', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) throw new Error(data.error || 'Something went wrong. Please try again.');
      setStatus('done');
      setForm(EMPTY);
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    }
  };

  const card: React.CSSProperties = {
    background: `linear-gradient(160deg, ${SURFACE} 0%, ${BG} 100%)`,
    border: `1px solid ${LINE}`,
    borderRadius: 20,
    boxShadow: '0 30px 70px rgba(0,0,0,0.40)',
  };

  if (status === 'done') {
    return (
      <div className="p-8 md:p-10 text-center" style={card} role="status">
        <div className="mx-auto mb-4 flex items-center justify-center rounded-full"
          style={{ width: 52, height: 52, background: 'rgba(105,230,174,0.14)', border: '1px solid rgba(105,230,174,0.4)', color: GREEN }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
        </div>
        <h3 className="font-bold mb-2" style={{ color: TEXT, fontSize: '1.25rem' }}>You're on the list</h3>
        <p style={{ color: MUTED, lineHeight: 1.6 }}>Thanks for your interest. We'll be in touch about early access soon.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="p-6 md:p-8" style={card}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Name">
          <input required name="name" autoComplete="name" value={form.name} onChange={set('name')} maxLength={120} style={inputStyle} {...focus} />
        </Field>
        <Field label="Work email">
          <input required type="email" name="email" autoComplete="email" value={form.email} onChange={set('email')} maxLength={200} style={inputStyle} {...focus} />
        </Field>
        <Field label="Firm / studio" optional>
          <input name="company" autoComplete="organization" value={form.company} onChange={set('company')} maxLength={160} style={inputStyle} {...focus} />
        </Field>
        <Field label="Role" optional>
          <input name="role" autoComplete="organization-title" value={form.role} onChange={set('role')} maxLength={120} style={inputStyle} {...focus} />
        </Field>
        <div className="sm:col-span-2">
          <Field label="What would you like to use Cipherra for?" optional>
            <textarea name="message" rows={3} value={form.message} onChange={set('message')} maxLength={2000}
              style={{ ...inputStyle, resize: 'vertical', minHeight: 92 }} {...focus} />
          </Field>
        </div>
      </div>

      {/* Honeypot for bots; hidden from people and screen readers. */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" value={form.website} onChange={set('website')}
        style={{ position: 'absolute', left: '-10000px', width: 1, height: 1, opacity: 0 }} />

      {status === 'error' && (
        <p className="mt-4 text-left" role="alert" style={{ color: '#ff9b9b', fontSize: '0.9rem' }}>{error}</p>
      )}

      <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <p className="text-left" style={{ color: MUTED, fontSize: '0.8rem', lineHeight: 1.5 }}>
          We only use this to contact you about early access.
        </p>
        <button type="submit" disabled={status === 'sending'}
          className="px-7 py-3.5 rounded-full text-white font-semibold text-base transition-all hover:-translate-y-0.5 shrink-0"
          style={{ background: ACCENT_GRAD, boxShadow: '0 8px 28px rgba(107,143,255,0.35)', opacity: status === 'sending' ? 0.7 : 1, cursor: status === 'sending' ? 'wait' : 'pointer' }}>
          {status === 'sending' ? 'Sending…' : 'Request early access'}
        </button>
      </div>
    </form>
  );
}
