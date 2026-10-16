// Early-access signups: validates the site form and appends a row to a Google
// Sheet through an Apps Script web app (see integrations/google-sheets/).
//
// Env vars (Vercel project settings):
//   SHEET_WEBHOOK_URL     Apps Script web app URL (ends in /exec)
//   SHEET_WEBHOOK_SECRET  shared secret, must match SECRET in the Apps Script

const LIMITS = { name: 120, email: 200, company: 160, role: 120, message: 2000 } as const;
type Field = keyof typeof LIMITS;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function json(status: number, body: Record<string, unknown>): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  });
}

function clean(value: unknown, max: number): string {
  if (typeof value !== 'string') return '';
  // Strip control characters and a leading formula trigger so values stay plain text in the sheet.
  const text = value.replace(/[\u0000-\u001f\u007f]+/g, ' ').trim().slice(0, max);
  return /^[=+\-@]/.test(text) ? `'${text}` : text;
}

export async function POST(request: Request): Promise<Response> {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return json(400, { ok: false, error: 'Invalid request.' });
  }

  // Honeypot: real visitors never see or fill this field.
  if (typeof body.website === 'string' && body.website.trim() !== '') {
    return json(200, { ok: true });
  }

  const fields = Object.fromEntries(
    (Object.keys(LIMITS) as Field[]).map((k) => [k, clean(body[k], LIMITS[k])]),
  ) as Record<Field, string>;

  if (!fields.name || !fields.email) {
    return json(400, { ok: false, error: 'Please add your name and work email.' });
  }
  if (!EMAIL_RE.test(fields.email)) {
    return json(400, { ok: false, error: 'Please enter a valid email address.' });
  }

  const url = process.env.SHEET_WEBHOOK_URL;
  const secret = process.env.SHEET_WEBHOOK_SECRET;
  if (!url || !secret) {
    console.error('early-access: SHEET_WEBHOOK_URL or SHEET_WEBHOOK_SECRET is not set');
    return json(500, { ok: false, error: 'Signups are not configured yet. Please email us instead.' });
  }

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        secret,
        submittedAt: new Date().toISOString(),
        ...fields,
        source: request.headers.get('referer') ?? '',
      }),
      redirect: 'follow',
    });
    const result = (await res.json().catch(() => null)) as { ok?: boolean } | null;
    if (!res.ok || !result?.ok) {
      console.error('early-access: sheet webhook failed', res.status, result);
      return json(502, { ok: false, error: 'Could not save your signup. Please try again.' });
    }
  } catch (err) {
    console.error('early-access: sheet webhook error', err);
    return json(502, { ok: false, error: 'Could not save your signup. Please try again.' });
  }

  return json(200, { ok: true });
}
