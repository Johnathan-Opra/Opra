export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const token = process.env.AIRTABLE_TOKEN;
  const base  = process.env.AIRTABLE_BASE;

  if (!token || !base) {
    return res.status(500).json({ error: 'Server misconfigured' });
  }

  const airtableRes = await fetch(
    `https://api.airtable.com/v0/${base}/Leads`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type':  'application/json',
      },
      body: JSON.stringify(req.body),
    }
  );

  const data = await airtableRes.json();

  return res.status(airtableRes.status).json(data);
}
