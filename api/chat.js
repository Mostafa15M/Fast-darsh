/**
 * Darsh Egypt 🇪🇬 - Vercel Proxy Server
 * Sends messages to Lovable API without visual_edit/body/Portuguese prompt
 * Always includes X-Lovable-Queue-When-Out-Of-Credits header (credit bypass)
 */

export default async function handler(req, res) {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Max-Age', '86400');
    return res.status(200).end();
  }

  // Only allow POST
  if (req.method !== 'POST') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const { message, token, projectId, threadId } = req.body || {};
  if (!message || !token || !projectId) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(400).json({
      ok: false,
      error: 'Missing required fields: message, token, projectId'
    });
  }

  const LOVABLE_API = `https://api.lovable.dev/projects/${projectId}/chat`;

  // Clean message: just prefix + user message
  const cleanMessage = `💜 Enviado por Infinity Lovable\n\n${message.trim()}`;

  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
    'User-Agent': 'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Mobile Safari/537.36',
    'Origin': 'https://lovable.dev',
    'Referer': `https://lovable.dev/projects/${projectId}`,
    'X-Lovable-Queue-When-Out-Of-Credits': 'true'
  };

  const body = {
    message: cleanMessage,
    thread_id: threadId || null,
    files: [],
    pii_action: 'none'
  };

  try {
    const resp = await fetch(LOVABLE_API, {
      method: 'POST',
      headers,
      body: JSON.stringify(body)
    });

    const data = await resp.json().catch(() => null);

    res.setHeader('Access-Control-Allow-Origin', '*');

    if (resp.status === 200 || resp.status === 201) {
      return res.status(200).json({ ok: true, status: resp.status, data, queued: false });
    }
    if (resp.status === 202) {
      return res.status(200).json({ ok: true, status: resp.status, data, queued: true });
    }
    if (resp.status === 401 || resp.status === 403) {
      return res.status(200).json({ ok: false, error: 'Invalid token', status: resp.status, data });
    }
    if (resp.status === 402) {
      return res.status(200).json({ ok: false, error: 'Out of credits - queue not available', status: resp.status, data });
    }
    return res.status(200).json({ ok: false, error: `Lovable returned ${resp.status}`, status: resp.status, data });
  } catch (err) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(200).json({ ok: false, error: err.message || 'Internal error' });
  }
}
