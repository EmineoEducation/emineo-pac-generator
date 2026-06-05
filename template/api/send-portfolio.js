export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return res.status(503).json({ error: 'RESEND_API_KEY not configured' });

  try {
    let body = req.body;
    if (typeof body === 'string') body = JSON.parse(body);

    const { to, studentName, bloc, subject, html } = body || {};
    if (!to || !html) return res.status(400).json({ error: 'Missing required fields: to, html' });

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + apiKey,
      },
      body: JSON.stringify({
        from: process.env.PORTFOLIO_FROM || 'Éminéo PAC <portfolio@emineo.fr>',
        to: [to],
        subject: subject || ('Votre portfolio de compétences — PAC ' + (bloc || '')),
        html,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      console.error('Resend API error:', data);
      return res.status(response.status).json(data);
    }
    return res.status(200).json({ ok: true, id: data.id });
  } catch (err) {
    console.error('send-portfolio error:', err);
    return res.status(500).json({ error: 'send error', message: err.message });
  }
}

export const config = { api: { bodyParser: { sizeLimit: '4mb' } } };
