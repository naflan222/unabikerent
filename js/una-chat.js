(function () {
    'use strict';
    if (document.getElementById('una-chat')) return;
    var root = document.createElement('div');
    root.id = 'una-chat';
    // Only this fixed template uses HTML. Customer and model text always use textContent.
    root.innerHTML = '<button type="button" class="una-chat-launcher" aria-controls="una-chat-panel" aria-expanded="false"><span aria-hidden="true">✦</span> Ask Una</button>' +
        '<section id="una-chat-panel" class="una-chat-panel" role="dialog" aria-labelledby="una-chat-title" hidden>' +
        '<header class="una-chat-header"><div><h2 id="una-chat-title">Ask Una</h2><p>AI assistant · Rentals &amp; safaris</p></div><button type="button" class="una-chat-close" aria-label="Close chat">×</button></header>' +
        '<div class="una-chat-messages" role="log" aria-label="Chat messages" aria-live="polite" aria-relevant="additions"></div>' +
        '<div class="una-chat-quick" aria-label="Suggested questions"><button type="button">Rent a bike</button><button type="button">Explore safaris</button><button type="button">Pickup &amp; delivery</button></div>' +
        '<p class="una-chat-status" role="status"></p>' +
        '<form class="una-chat-form"><label class="una-chat-sr" for="una-chat-input">Your message</label><textarea id="una-chat-input" rows="2" maxlength="1500" placeholder="Ask about a rental or safari…" required></textarea><button type="submit" aria-label="Send message">Send</button></form>' +
        '<div class="una-chat-footer"><a class="una-chat-whatsapp" href="https://wa.me/94773132168" target="_blank" rel="noopener noreferrer">Continue on WhatsApp ↗</a><button type="button" class="una-chat-reset">New chat</button><p>AI can make mistakes. Our team confirms prices and bookings. Messages are sent to our AI service to answer your questions. Don’t share payment or ID details.</p></div></section>';
    document.body.appendChild(root);
    var launcher = root.querySelector('.una-chat-launcher');
    var panel = root.querySelector('.una-chat-panel');
    var log = root.querySelector('.una-chat-messages');
    var form = root.querySelector('form');
    var input = root.querySelector('textarea');
    var send = form.querySelector('button');
    var status = root.querySelector('.una-chat-status');
    var handoff = root.querySelector('.una-chat-whatsapp');
    var history = [];
    var enquiries = [];
    var pending = false;
    var controller;
    var generation = 0;

    function addMessage(role, text) {
        var node = document.createElement('p');
        node.className = 'una-chat-message una-chat-' + role;
        node.textContent = text;
        log.appendChild(node);
        log.scrollTop = log.scrollHeight;
    }
    function updateHandoff() {
        var requests = enquiries;
        var text = 'Hi Una Bike Rental, I would like help with my enquiry.';
        if (requests.length) text += '\n\nMy chat enquiry:\n' + requests.join('\n').slice(-1600);
        handoff.href = 'https://wa.me/94773132168?text=' + encodeURIComponent(text);
    }
    function busy(value) {
        pending = value;
        send.disabled = value;
        input.disabled = value;
        root.querySelectorAll('.una-chat-quick button').forEach(function (b) { b.disabled = value; });
        status.textContent = value ? 'Una is thinking…' : '';
    }
    function open(value) {
        panel.hidden = !value;
        launcher.setAttribute('aria-expanded', String(value));
        document.body.classList.toggle('una-chat-open', value);
        if (value) { if (!pending) input.focus(); }
        else launcher.focus();
    }
    function reset() {
        generation++;
        if (controller) controller.abort();
        history = [];
        enquiries = [];
        log.replaceChildren();
        addMessage('assistant', 'Hi! I’m Una, your AI assistant. I can help you explore rentals and safari tours. What are you planning?');
        input.value = '';
        busy(false);
        updateHandoff();
    }
    async function ask(text) {
        if (pending || !text.trim()) return;
        text = text.trim().slice(0, 1500);
        input.value = '';
        addMessage('user', text);
        enquiries.push(text);
        enquiries = enquiries.slice(-12);
        // Keep complete user/assistant pairs and a bounded context.
        history = history.slice(-6);
        history.push({ role: 'user', content: text });
        updateHandoff();
        busy(true);
        controller = new AbortController();
        var current = generation;
        var timeout = setTimeout(function () { controller.abort(); }, 25000);
        try {
            var response = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: history }), signal: controller.signal });
            var data = await response.json();
            if (!response.ok || typeof data.reply !== 'string' || !data.reply.trim()) throw new Error('Chat unavailable');
            if (current !== generation) return;
            history.push({ role: 'assistant', content: data.reply.slice(0, 1800) });
            addMessage('assistant', data.reply);
        } catch (error) {
            if (current !== generation) return;
            // A failure is not a model reply; remove the unmatched user turn before retrying.
            history.pop();
            addMessage('assistant', 'I couldn’t connect right now. Please use Continue on WhatsApp below and our team will help.');
            status.textContent = 'Connection unavailable. Your enquiry is ready for WhatsApp.';
        } finally {
            clearTimeout(timeout);
            if (current === generation) {
                var notice = status.textContent;
                busy(false);
                if (notice.indexOf('Connection unavailable') === 0) status.textContent = notice;
                if (!panel.hidden) input.focus();
            }
        }
    }
    launcher.addEventListener('click', function () { open(panel.hidden); });
    root.querySelector('.una-chat-close').addEventListener('click', function () { open(false); });
    root.querySelector('.una-chat-reset').addEventListener('click', function () { reset(); input.focus(); });
    form.addEventListener('submit', function (event) { event.preventDefault(); ask(input.value); });
    input.addEventListener('keydown', function (event) {
        if (event.key === 'Enter' && !event.shiftKey && !event.isComposing) { event.preventDefault(); ask(input.value); }
    });
    root.querySelectorAll('.una-chat-quick button').forEach(function (button) {
        button.addEventListener('click', function () { ask(button.textContent); });
    });
    document.addEventListener('keydown', function (event) { if (event.key === 'Escape' && !panel.hidden) open(false); });
    reset();
}());
