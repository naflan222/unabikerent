import { generateText } from 'ai';
import { handleChat } from '../server/chat.mjs';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  if (req.method !== 'POST') res.setHeader('Allow', 'POST');
  let body = req.body;
  if (typeof body === 'string') {
    if (Buffer.byteLength(body, 'utf8') > 24000) return res.status(413).json({ error: 'Please shorten your message.' });
    try { body = JSON.parse(body); }
    catch { return res.status(400).json({ error: 'Please send a valid chat message.' }); }
  }
  const result = await handleChat({ method: req.method, headers: req.headers, body }, generateText);
  return res.status(result.status).json(result.body);
}
