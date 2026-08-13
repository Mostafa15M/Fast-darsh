/**
 * Darsh Egypt 🇪🇬 - Vercel Serverless Function
 * Sends to Lovable API with credit bypass
 * NO visual_edit, NO body, NO Portuguese prompt
 * Only: 💜 Enviado por Infinity Lovable + user message
 */
export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Max-Age', '86400');
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  try {
    const { token, projectId, message, threadId, castleToken } = req.body;

    if (!token || !projectId || !message) {
      res.setHeader('Access-Control-Allow-Origin', '*');
      return res.status(400).json({ ok: false, error: 'Missing: token, projectId, message' });
    }

    // Build message with prefix ONLY - NO visual_edit, NO body, NO prompt
    const finalContent = `💜 Enviado por Infinity Lovable\n\n${message.trim()}`;

    const lovableBody = {
      message: finalContent,
      thread_id: threadId || null,
      files: [],
      pii_action: "none"
    };

    // Headers - ALWAYS include queue header for credit bypass
    const lovableHeaders = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'X-Lovable-Queue-When-Out-Of-Credits': 'true',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
      'Origin': 'https://lovable.dev',
      'Referer': `https://lovable.dev/projects/${projectId}`
    };

    if (castleToken) {
      lovableHeaders['X-Castle-Request-Token'] = castleToken;
    }

    const lovableResponse = await fetch(
      `https://api.lovable.dev/projects/${projectId}/chat`,
      {
        method: 'POST',
        headers: lovableHeaders,
        body: JSON.stringify(lovableBody)
      }
    );

    const data = await lovableResponse.json().catch(() => ({}));
    const status = lovableResponse.status;

    res.setHeader('Access-Control-Allow-Origin', '*');

    if (status === 200 || status === 201) {
      return res.status(200).json({ ok: true, status, data, queued: false });
    } else if (status === 202) {
      return res.status(200).json({ ok: true, status: 202, data, queued: true });
    } else if (status === 402) {
      return res.status(200).json({ ok: false, status: 402, error: 'Out of credits - message could not be queued', data });
    } else {
      return res.status(200).json({ ok: false, status, error: data.error || data.message || `HTTP ${status}`, data });
    }
  } catch (error) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(200).json({ ok: false, error: error.message || 'Internal error' });
  }
}
