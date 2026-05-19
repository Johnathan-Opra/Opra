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

  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

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
          'Full Name':                 String(name).slice(0, 200),
          'Business Name':             String(business ?? '').slice(0, 200),
          'Email':                     String(email).slice(0, 200),
          'Service Interested In':      String(services ?? '').slice(0, 500),
          'How they heard about Opra': String(source ?? '').slice(0, 100),
        },
      }),
    }
  );

  const data = await airtableRes.json();

  return res.status(airtableRes.status).json(data);
}
