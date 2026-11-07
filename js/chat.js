(function () {
    'use strict';

    var whatsapp = 'https://wa.me/94773132168';
    var history = [];
    var busy = false;
    var lastQuestion = '';
    var widget = document.createElement('div');
    widget.className = 'una-chat';
    widget.innerHTML = `
        <button class="una-chat-launcher" type="button" aria-label="Open Una AI chat" aria-expanded="false" aria-controls="una-chat-panel">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5H4l-3 2V11.5a10 10 0 0 1 20 0Z"/><path d="M7 11h.01M12 11h.01M17 11h.01" stroke-width="3" stroke-linecap="round"/></svg>
            <span class="visually-hidden">Ask Una</span>
        </button>
        <section id="una-chat-panel" class="una-chat-panel" role="dialog" aria-labelledby="una-chat-title" hidden>
            <header class="una-chat-header">
                <div><h2 id="una-chat-title">Ask Una</h2><p>AI rental assistant</p></div>
                <button class="una-chat-close" type="button" aria-label="Close chat">&times;</button>
            </header>
            <div class="una-chat-log" role="log" aria-live="polite" aria-label="Chat messages" aria-relevant="additions"></div>
            <div class="una-chat-suggestions" aria-label="Suggested questions">
                <button type="button">What bikes can I rent?</button>
                <button type="button">Are helmets included?</button>
                <button type="button">Can you deliver to my hotel?</button>
            </div>
            <p class="una-chat-status" role="status"></p>
            <form class="una-chat-form">
                <label class="visually-hidden" for="una-chat-input">Your rental question</label>
                <input id="una-chat-input" name="question" type="text" maxlength="500" placeholder="Ask about your rental…" autocomplete="off" required>
                <button type="submit" aria-label="Send message">Send</button>
            </form>
            <footer class="una-chat-footer">
                <p>AI answers may be imperfect. Our team confirms prices and bookings.</p>
                <div><a class="una-chat-handoff" href="https://wa.me/94773132168">Talk to Una on WhatsApp</a><button class="una-chat-reset" type="button">New chat</button></div>
            </footer>
        </section>`;
    document.body.appendChild(widget);

    var launcher = widget.querySelector('.una-chat-launcher');
    var panel = widget.querySelector('.una-chat-panel');
    var log = widget.querySelector('.una-chat-log');
    var form = widget.querySelector('form');
    var input = widget.querySelector('input');
    var submit = form.querySelector('button');
    var status = widget.querySelector('.una-chat-status');
    var suggestions = widget.querySelector('.una-chat-suggestions');
    var handoff = widget.querySelector('.una-chat-handoff');
    var reset = widget.querySelector('.una-chat-reset');

    function addMessage(text, role) {
        var message = document.createElement('p');
        message.className = 'una-chat-message una-chat-message-' + role;
        message.textContent = text;
        log.appendChild(message);
        log.scrollTop = log.scrollHeight;
    }

    function greet() {
        addMessage('Hi! I’m Una’s AI rental assistant. Ask me about bikes, cars, helmets, delivery or how to book in Tangalle.', 'assistant');
    }

    function toggle(open) {
        panel.hidden = !open;
        launcher.setAttribute('aria-expanded', String(open));
        if (open) input.focus();
        else launcher.focus();
    }

    launcher.addEventListener('click', function () { toggle(panel.hidden); });
    widget.querySelector('.una-chat-close').addEventListener('click', function () { toggle(false); });
    panel.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') { event.preventDefault(); toggle(false); }
    });

    async function ask(question) {
        question = question.trim();
        if (!question || busy) return;
        busy = true;
        lastQuestion = question;
        input.value = '';
        submit.disabled = true;
        reset.disabled = true;
        suggestions.hidden = true;
        status.textContent = 'Una is thinking…';
        addMessage(question, 'user');
        handoff.href = whatsapp + '?text=' + encodeURIComponent('Hi Una Bike Rental, I need help with: ' + question);
        var messages = history.slice(-8).concat({ role: 'user', content: question });
        while (messages.reduce(function (size, message) { return size + message.content.length; }, 0) > 6000) messages.splice(0, 2);
        try {
            var response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: messages }),
                signal: AbortSignal.timeout(25000)
            });
            if (!response.ok) throw new Error('Chat unavailable');
            var data = await response.json();
            if (typeof data.reply !== 'string' || !data.reply.trim()) throw new Error('Empty answer');
            addMessage(data.reply, 'assistant');
            history = messages.concat({ role: 'assistant', content: data.reply.slice(0, 1500) });
            status.textContent = '';
        } catch {
            status.textContent = 'Chat is unavailable. Try again or talk to Una on WhatsApp.';
            var retry = document.createElement('button');
            retry.type = 'button';
            retry.className = 'una-chat-retry';
            retry.textContent = 'Try again';
            retry.addEventListener('click', function () { retry.remove(); ask(lastQuestion); });
            status.appendChild(document.createTextNode(' '));
            status.appendChild(retry);
        } finally {
            busy = false;
            submit.disabled = false;
            reset.disabled = false;
        }
    }

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        ask(input.value);
    });
    suggestions.querySelectorAll('button').forEach(function (button) {
        button.addEventListener('click', function () { ask(button.textContent); });
    });
    reset.addEventListener('click', function () {
        history = [];
        lastQuestion = '';
        log.replaceChildren();
        status.textContent = '';
        input.value = '';
        suggestions.hidden = false;
        handoff.href = whatsapp;
        greet();
        input.focus();
    });
    greet();
})();
