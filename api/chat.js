import { generateText } from 'ai';
import { assistantInstructions } from '../server/rental-knowledge.js';

export const config = { maxDuration: 30 };

// The optional generator lets request validation be tested without paid model calls.
export function createChatHandler(generate = generateText) {
    return async function handler(req, res) {
        res.setHeader('Cache-Control', 'no-store');
        if (req.method !== 'POST') {
            res.setHeader('Allow', 'POST');
            return res.status(405).json({ error: 'Please send a chat message.' });
        }
        if (!req.headers['content-type']?.startsWith('application/json')) {
            return res.status(415).json({ error: 'Please send a JSON chat message.' });
        }
        const origin = req.headers.origin;
        if (origin) {
            let sameOrigin = false;
            try { sameOrigin = new URL(origin).host === req.headers.host; } catch { /* Reject malformed origins. */ }
            if (!sameOrigin) return res.status(403).json({ error: 'Please use the chat on Una Bike Rental.' });
        }
        let body;
        try { body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body; }
        catch { return res.status(400).json({ error: 'Please try your message again.' }); }
        const messages = body?.messages;
        if (!Array.isArray(messages) || !messages.length || messages.length > 12 ||
            messages[messages.length - 1]?.role !== 'user' ||
            messages.some(message => !message || !['user', 'assistant'].includes(message.role) ||
                typeof message.content !== 'string' || !message.content.trim() || message.content.length > 1500) ||
            messages[messages.length - 1].content.length > 500 ||
            messages.reduce((size, message) => size + message.content.length, 0) > 6000) {
            return res.status(400).json({ error: 'Please send a shorter rental question (up to 500 characters).' });
        }
        try {
            const { text } = await generate({
                model: process.env.AI_GATEWAY_MODEL || 'google/gemini-3.8-flash',
                instructions: assistantInstructions,
                messages: messages.map(({ role, content }) => ({ role, content })),
                maxOutputTokens: 600,
                maxRetries: 0,
                abortSignal: AbortSignal.timeout(20000)
            });
            if (!text?.trim()) throw new Error('Empty answer');
            return res.status(200).json({ reply: text.trim() });
        } catch (error) {
            // Never return provider errors or authentication details to visitors.
            console.error('Una chat request failed', {
                name: error.name,
                status: error.statusCode,
                cause: error.cause?.name
            });
            return res.status(503).json({ error: 'Una’s AI assistant is unavailable right now. Please try again or contact our team on WhatsApp.' });
        }
    };
}

export default createChatHandler();
