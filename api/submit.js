const ALLOWED_SOURCES = new Set(['LinkedIn', 'Referral', 'Google search', 'Other', '']);
const ALLOWED_SERVICES = new Set(['Websites', 'Platforms', 'Automation', 'AI Systems', 'Custom Project']);
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function sanitize(str, maxLen) {
  return String(str ?? '').trim()
    .replace(/[\x00-\x1F\x7F]/g, '')
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .slice(0, maxLen);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const token = process.env.AIRTABLE_TOKEN;
  const base  = process.env.AIRTABLE_BASE;

  if (!token || !base) {
    return res.status(500).json({ error: 'Server misconfigured' });
  }

  const { name, business, email, services, source } = req.body ?? {};

  const cleanName     = sanitize(name, 200);
  const cleanBusiness = sanitize(business, 200);
  const cleanEmail    = sanitize(email, 200);
  const cleanSource   = sanitize(source, 100);

  if (!cleanName || !cleanEmail) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  if (!EMAIL_RE.test(cleanEmail)) {
    return res.status(400).json({ error: 'Invalid email address' });
  }

  if (cleanSource && !ALLOWED_SOURCES.has(cleanSource)) {
    return res.status(400).json({ error: 'Invalid source value' });
  }

  const serviceList = services
    ? String(services).split(',').map(s => s.trim()).filter(s => ALLOWED_SERVICES.has(s))
    : [];

  try {
    const airtableRes = await fetch(
      `https://api.airtable.com/v0/${base}/Leads`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type':  'application/json',
        },
        body: JSON.stringify({
          fields: {
            'Full Name':                 cleanName,
            'Business Name':             cleanBusiness,
            'Email':                     cleanEmail,
            'Service Interested In':     serviceList.join(', '),
            'How they heard about Opra': cleanSource,
          },
        }),
      }
    );

    if (!airtableRes.ok) {
      console.error('Airtable error:', await airtableRes.text());
      return res.status(502).json({ error: 'Submission failed. Please try again.' });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Airtable fetch failed:', err);
    return res.status(502).json({ error: 'Submission failed. Please try again.' });
  }
}
