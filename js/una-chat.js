(function () {
    'use strict';
    if (document.getElementById('una-chat')) return;

    // All replies are prepared business information. No model, API or network request is used.
    var answers = {
        greeting: 'Hi! I’m Una, your website guide. I can help with Una Bike Rental’s vehicles, safari tours, rental FAQs and booking enquiries. What would you like to know?',
        scope: 'I can only help with Una Bike Rental’s vehicles, safari tours, rental information and contact details. Try “Rent a bike”, “Explore safaris” or “How do I book?” For anything else about your visit, please ask our team on WhatsApp.',
        identity: 'I’m Una, a website assistant using prepared answers about Una Bike Rental. I don’t use an external AI service or check live availability. Our team confirms quotes and bookings on WhatsApp.',
        vehicles: 'Our website lists Yamaha ZR, Ntorq, Ntorq Sport and Honda Dio bikes, plus the Toyota Roomy and Suzuki Every. Tell our team your preferred model, pickup and return dates, and pickup location on WhatsApp. They will confirm availability and your quote.',
        safaris: 'Explore four safari experiences: Yala Wildlife Safari, Udawalawe Elephant Safari, Bundala Birdwatching Safari and Ridiyagama Safari Park Experience. Which destination interests you?',
        yala: 'Yala Wildlife Safari explores leopard habitat, dry woodland and open clearings, with elephants, spotted deer and birdlife also found in the park. Wildlife sightings are never guaranteed. Send your travel date, group size and pickup location on WhatsApp for pricing and arrangements.',
        udawalawe: 'Udawalawe Elephant Safari offers grasslands and reservoir scenery in a well-known elephant habitat, with buffalo, peacocks and other birds. Sightings vary. Send your travel date, group size and pickup location on WhatsApp for pricing and arrangements.',
        bundala: 'Bundala Birdwatching Safari focuses on coastal wetlands, shallow lagoons and salt marshes, with birds such as painted storks and egrets. Birdlife varies with the season. Send your travel date, group size and pickup location on WhatsApp for pricing and arrangements.',
        ridiyagama: 'Ridiyagama is a managed safari park, rather than a national park, with animal zones where visitors can observe animals such as lions. Ask our team about current access, pricing and visit arrangements on WhatsApp.',
        prices: 'Please request a quote for your chosen vehicle or safari and travel dates. Rental discounts for longer stays depend on the rental period. Our team confirms the total price, any deposit, payment and cancellation terms before you book. This chat cannot quote a current price.',
        availability: 'This website assistant cannot check live availability or reserve a vehicle or safari. Use Continue on WhatsApp to send your dates and preferences. Your booking is confirmed only when our team confirms it with you.',
        rentalBooking: 'To request a rental, send your preferred vehicle, pickup date and time, return date and time, and pickup/drop-off location. Use Continue on WhatsApp below to send your enquiry. Our team will confirm availability, your quote and rental terms.',
        safariBooking: 'To request a safari, send the destination, preferred date, number of adults and children, and pickup location. Use Continue on WhatsApp below to send your enquiry. Our team will confirm availability, pricing, timings, transport and inclusions.',
        booking: 'Choose a vehicle or safari, then send your preferred dates and pickup location on WhatsApp. For a safari, include the number of adults and children. Our team confirms availability, pricing and arrangements. Sending an enquiry does not confirm a booking.',
        delivery: 'Delivery can be requested. Share your hotel or preferred pickup and return locations on WhatsApp. Our team will confirm whether those locations can be served, the timing and any additional charges before you book.',
        helmets: 'Helmets are included with bike rentals. Tell our team how many riders are travelling so they can arrange them.',
        distance: 'Our vehicle rentals include unlimited kilometres, with no daily distance limit. Confirm the rest of your rental terms with our team before booking.',
        licence: 'Bring identification and a driving licence valid for the vehicle category in Sri Lanka. Overseas visitors should confirm whether a local recognition permit or other authorisation is needed. Ask our team to confirm your documents before pickup; don’t send document numbers in this chat.',
        terms: 'Before booking, confirm insurance cover, any excess, damage responsibility, deposit, fuel policy, payment and cancellation terms with our team. Check and photograph the vehicle condition at pickup. These details must be confirmed directly on WhatsApp.',
        location: 'Find Una Bike Rental at 45/A Muslim Street, Tangalle, Sri Lanka. Use the location link on our website for directions, or contact +94 77 313 2168 for help finding us.',
        contact: 'Contact Una Bike Rental on WhatsApp or by phone: +94 77 313 2168. Email: unabikerental@gmail.com. Use Continue on WhatsApp below to send your enquiry to our team.',
        hours: 'The website lists Monday–Friday, 8:00 am–10:00 pm, and Saturday–Sunday, 8:30 am–10:00 pm. Please confirm pickup, return or safari times with our team on WhatsApp.',
        sightings: 'Wildlife sightings are never guaranteed. Animals move freely in the national parks and conditions vary by day and season. Our safari options are Yala, Udawalawe, Bundala and the managed Ridiyagama Safari Park.',
        thanks: 'You’re welcome! I can help with more Una Bike Rental questions. Use Continue on WhatsApp whenever you’re ready to send your enquiry.',
        details: 'Your details are included in the WhatsApp draft below. Please add any remaining dates, vehicle or safari choice, group size and pickup location there, then send it to our team. Nothing has been sent or booked from this chat.'
    };
    var topic = '';
    function answerFor(text) {
        var q = text.toLowerCase().replace(/[’']/g, '').replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
        var destination = /\byala\b/.test(q) ? 'yala' : /\budawalawe\b/.test(q) ? 'udawalawe' : /\bbundala\b/.test(q) ? 'bundala' : /\bridiyagama\b/.test(q) ? 'ridiyagama' : '';
        if (destination || /\b(safari|safaris|tour|tours)\b/.test(q)) topic = 'safari';
        else if (/\b(bike|bikes|scooter|scooters|car|cars|vehicle|vehicles|yamaha|ntorq|dio|roomy|suzuki)\b/.test(q)) topic = 'rental';
        if (/\b(who are you|are you ai|are you a bot|how do you work|what can you do)\b/.test(q)) return answers.identity;
        if (/^(hi|hello|hey|good morning|good afternoon|good evening)( una)?$/.test(q)) return answers.greeting;
        if (/^(thanks|thank you|thank you una|thanks una|ok thanks)$/.test(q)) return answers.thanks;
        if (/\b(price|prices|pricing|cost|costs|rate|rates|quote|discount|discounts|how much|cheap|cheapest|expensive)\b/.test(q)) return answers.prices;
        if (/\b(available|availability|reserve|reservation|confirmed|confirmation)\b/.test(q)) return answers.availability;
        if (/\b(helmet|helmets)\b/.test(q)) return answers.helmets;
        if (/\b(kilometre|kilometres|kilometer|kilometers|mileage|distance limit|km limit|unlimited|daily limit)\b/.test(q)) return answers.distance;
        if (/\b(licence|license|permit|documents|identification|passport|driving documents)\b/.test(q)) return answers.licence;
        if (/\b(insurance|excess|damage|deposit|fuel|cancel|cancellation|refund|payment|pay|terms)\b/.test(q)) return answers.terms;
        if (/\b(delivery|deliver|hotel|pickup|pick up|drop off|dropoff|return location)\b/.test(q) && !/\b(book|booking|rent|rental)\b/.test(q)) return answers.delivery;
        if (/\b(contact|phone|number|email|whatsapp|human|staff|speak|call)\b/.test(q)) return answers.contact;
        if (/\b(hours|opening|open|close|closing|weekend)\b/.test(q)) return answers.hours;
        if (/\b(address|location|directions|where are you|where is una|find you|where is your)\b/.test(q)) return answers.location;
        if (/\b(guarantee|guaranteed|sightings|see animals|see a leopard|see leopards)\b/.test(q)) return answers.sightings;
        if (/\b(book|booking|bookings|hire)\b/.test(q)) return topic === 'safari' ? answers.safariBooking : topic === 'rental' ? answers.rentalBooking : answers.booking;
        if (destination) return answers[destination];
        if (/\b(safari|safaris|tour|tours|elephant|elephants|leopard|leopards|birdwatching|wildlife)\b/.test(q)) { topic = 'safari'; return answers.safaris; }
        if (/\b(rent|rental|rentals|bike|bikes|scooter|scooters|car|cars|vehicle|vehicles|yamaha|ntorq|dio|roomy|suzuki)\b/.test(q)) { topic = 'rental'; return answers.vehicles; }
        if (topic && (/\b(today|tomorrow|monday|tuesday|wednesday|thursday|friday|saturday|sunday|january|february|march|april|may|june|july|august|september|october|november|december)\b/.test(q) || /^\d+( people| adults| children| persons| days| nights)?$/.test(q) || /^\d{1,4}[\s]+\d{1,2}([\s]+\d{1,4})?$/.test(q))) return answers.details;
        return answers.scope;
    }

    var root = document.createElement('div');
    root.id = 'una-chat';
    // Only this fixed template uses HTML. All conversation text uses textContent.
    root.innerHTML = '<button type="button" class="una-chat-launcher" aria-controls="una-chat-panel" aria-expanded="false"><span aria-hidden="true">✦</span> Ask Una</button>' +
        '<section id="una-chat-panel" class="una-chat-panel" role="dialog" aria-labelledby="una-chat-title" hidden>' +
        '<header class="una-chat-header"><div><h2 id="una-chat-title">Ask Una</h2><p>Website guide · Rentals &amp; safaris</p></div><button type="button" class="una-chat-close" aria-label="Close chat">×</button></header>' +
        '<div class="una-chat-messages" role="log" aria-label="Chat messages" aria-live="polite" aria-relevant="additions"></div>' +
        '<div class="una-chat-quick" aria-label="Suggested questions"><button type="button">Rent a bike</button><button type="button">Explore safaris</button><button type="button">Pickup &amp; delivery</button></div>' +
        '<form class="una-chat-form"><label class="una-chat-sr" for="una-chat-input">Your message</label><textarea id="una-chat-input" rows="2" maxlength="1500" placeholder="Ask about Una Bike Rental…" required></textarea><button type="submit" aria-label="Send message">Send</button></form>' +
        '<div class="una-chat-footer"><nav aria-label="Explore our website"><a href="vehicle.html">View vehicles</a> · <a href="safari.html">View safari tours</a></nav><a class="una-chat-whatsapp" href="https://wa.me/94773132168" target="_blank" rel="noopener noreferrer">Continue on WhatsApp ↗</a><button type="button" class="una-chat-reset">New chat</button><p>Prepared answers from our website. Our team confirms quotes and bookings. Chat stays on this page until you choose to share it on WhatsApp.</p></div></section>';
    document.body.appendChild(root);
    var launcher = root.querySelector('.una-chat-launcher');
    var panel = root.querySelector('.una-chat-panel');
    var log = root.querySelector('.una-chat-messages');
    var form = root.querySelector('form');
    var input = root.querySelector('textarea');
    var handoff = root.querySelector('.una-chat-whatsapp');
    var enquiries = [];

    function addMessage(role, text) {
        var node = document.createElement('p');
        node.className = 'una-chat-message una-chat-' + role;
        node.textContent = text;
        log.appendChild(node);
        while (log.children.length > 40) log.firstElementChild.remove();
        log.scrollTop = log.scrollHeight;
    }
    function updateHandoff() {
        var text = 'Hi Una Bike Rental, I would like help with my enquiry.';
        if (enquiries.length) text += '\n\nMy chat enquiry:\n' + enquiries.join('\n').slice(-1600);
        handoff.href = 'https://wa.me/94773132168?text=' + encodeURIComponent(text);
    }
    function open(value) {
        panel.hidden = !value;
        launcher.setAttribute('aria-expanded', String(value));
        document.body.classList.toggle('una-chat-open', value);
        if (value) input.focus();
        else launcher.focus();
    }
    function reset() {
        enquiries = [];
        topic = '';
        log.replaceChildren();
        addMessage('assistant', answers.greeting);
        input.value = '';
        updateHandoff();
    }
    function ask(text) {
        if (!text.trim()) return;
        text = text.trim().slice(0, 1500);
        input.value = '';
        addMessage('user', text);
        enquiries.push(text);
        enquiries = enquiries.slice(-12);
        updateHandoff();
        addMessage('assistant', answerFor(text));
        if (!panel.hidden) input.focus();
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
