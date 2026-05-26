/* ==========================================================================
   AVYUKT VIEW - COALESCED FRONTEND ARCHITECTURE PLATFORM ENGINE
   ========================================================================== */

// 1. System Local Cart State Storage Array
let localBasket = [];

/**
 * 2. GLOBAL CHAT CLOSING CONSOLE OVERRIDE
 * Explicit handle declared outside lexical scopes so inline structural markup elements
 * (like your decorative close icon buttons) can execute minimizes seamlessly.
 */
function minimizeChatWidgetManually() {
    const widget = document.getElementById('chat-widget');
    const openBtn = document.getElementById('chat-open-btn');
    
    if (widget) {
        widget.classList.remove('scale-100', 'opacity-100');
        widget.classList.add('scale-95', 'opacity-0');
        setTimeout(() => {
            widget.classList.add('hidden');
        }, 200);
    }
    if (openBtn) {
        openBtn.classList.remove('opacity-0', 'pointer-events-none');
    }
}

// Experience 1: Dynamic Frontend Menu Categorization Filter Toggling
function toggleMenuCategory(catName) {
    const categories = ['all', 'spirits', 'cocktails', 'cuisine'];
    categories.forEach(c => {
        const tab = document.getElementById(`tab-${c}`);
        if (tab) tab.classList.remove('filter-tab-active');
    });
    
    const activeTab = document.getElementById(`tab-${catName}`);
    if (activeTab) activeTab.classList.add('filter-tab-active');

    const elements = document.querySelectorAll('.menu-display-card');
    elements.forEach(el => {
        if (catName === 'all' || el.getAttribute('data-cat') === catName) {
            el.style.display = 'flex';
        } else {
            el.style.display = 'none';
        }
    });
}

// Experience 3: Real-Time Interactive Pre-Order Menu Basket Core
function pushToBasket(title, rate) {
    const target = localBasket.find(i => i.title === title);
    if (target) {
        target.quantity += 1;
    } else {
        localBasket.push({ title: title, rate: rate, quantity: 1 });
    }
    rebuildBasketDOM();
}

function pullFromBasket(index) {
    localBasket.splice(index, 1);
    rebuildBasketDOM();
}

function rebuildBasketDOM() {
    const stackBox = document.getElementById('basket-dynamic-stack');
    const badgeBox = document.getElementById('lbl-cart-count');
    
    if (!stackBox || !badgeBox) return;
    
    if (localBasket.length === 0) {
        stackBox.innerHTML = 'Your pre-order collection is empty.';
        badgeBox.innerText = '0 Items';
        document.getElementById('lbl-subtotal').innerText = '₹0';
        document.getElementById('lbl-tax').innerText = '₹0';
        document.getElementById('lbl-total').innerText = '₹0';
        return;
    }

    stackBox.innerHTML = '';
    let cumulativeSum = 0;
    let cumulativeItems = 0;

    localBasket.forEach((item, idx) => {
        cumulativeSum += item.rate * item.quantity;
        cumulativeItems += item.quantity;

        stackBox.innerHTML += `
            <div class="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100 font-sans">
                <div>
                    <p class="font-semibold text-gray-800">${item.title}</p>
                    <span class="text-[10px] text-slate-500 block mt-0.5">₹${item.rate} x ${item.quantity}</span>
                </div>
                <button onclick="pullFromBasket(${idx})" class="text-rose-500 hover:text-rose-700 transition px-1">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
            </div>
        `;
    });

    const taxAmount = Math.round(cumulativeSum * 0.18);
    const netValue = cumulativeSum + taxAmount;

    badgeBox.innerText = `${cumulativeItems} Items`;
    document.getElementById('lbl-subtotal').innerText = `₹${cumulativeSum.toLocaleString('en-IN')}`;
    document.getElementById('lbl-tax').innerText = `₹${taxAmount.toLocaleString('en-IN')}`;
    document.getElementById('lbl-total').innerText = `₹${netValue.toLocaleString('en-IN')}`;
    
    const hiddenPayloadField = document.getElementById('basket_hidden_field');
    if (hiddenPayloadField) hiddenPayloadField.value = JSON.stringify(localBasket);
}

function verifyBasketData() {
    if (localBasket.length === 0) {
        alert('Please select items from the menu options before dispatching data to the external app.');
        return false;
    }
    return true;
}

// Master Table Seating Grid Map Filter Actions
function filterFloorMap(targetZone) {
    const keys = ['all', 'rooftop', 'bar_counter', 'booths'];
    keys.forEach(k => {
        const btn = document.getElementById(`zone-btn-${k}`);
        if (btn) btn.classList.remove('filter-tab-active');
    });
    
    const activeBtn = document.getElementById(`zone-btn-${targetZone}`);
    if (activeBtn) activeBtn.classList.add('filter-tab-active');

    document.querySelectorAll('.table-grid-unit').forEach(card => {
        if (targetZone === 'all' || card.getAttribute('data-zone-group') === targetZone) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    
    /* ==========================================
       CORE LAYOUT NAVIGATION MECHANICS
       ========================================== */
    const moreBtn = document.getElementById('moreBtn');
    const moreDropdown = document.getElementById('moreDropdown');
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    // Click handler for more dropdown
    moreBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        moreDropdown?.classList.toggle('hidden');
    });

    // Prevent random closures when interacting inside dropdown card box links
    moreDropdown?.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    mobileBtn?.addEventListener('click', () => {
        mobileMenu?.classList.toggle('hidden');
    });

    // Auto-close open navbar trays on clicking anchor jumps
    document.querySelectorAll('.menu-close-link, .mobile-nav-link').forEach(linkItem => {
        linkItem.addEventListener('click', () => {
            moreDropdown?.classList.add('hidden');
            mobileMenu?.classList.add('hidden');
        });
    });

    // Clicking anywhere outside dropdown dismisses view cleanly
    document.addEventListener('click', (e) => {
        if (moreDropdown && !moreDropdown.classList.contains('hidden')) {
            moreDropdown.classList.add('hidden');
        }
    });

    /* ==========================================
       SCROLL TRANSITION OBSERVER TRACK
       ========================================== */
    const revealElements = document.querySelectorAll('.reveal');
    if (revealElements.length) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });
        revealElements.forEach((el) => revealObserver.observe(el));
    }

    /* ==========================================
       ASYNC CONTACT & NEWSLETTER DATA SUBMISSIONS
       ========================================== */
    const form = document.getElementById('contactForm');
    const status = document.getElementById('formStatus');
    form?.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (status) status.textContent = 'Sending...';
        const fd = new FormData(form);
        try {
            const res = await fetch('/contact', { method: 'POST', body: fd });
            const data = await res.json();
            if (data && data.status === 'ok') {
                if (status) status.textContent = 'Message received. We will get back to you shortly.';
                form.reset();
            } else {
                if (status) status.textContent = 'Sorry, something went wrong.';
            }
        } catch (err) {
            if (status) status.textContent = 'Could not send message.';
        }
    });

    const newsletter = document.getElementById('newsletterForm');
    const footerNewsletter = document.getElementById('footerNewsletter');
    const newsletterStatus = document.getElementById('newsletterStatus');

    async function submitNewsletter(formEl, statusEl) {
        const fd = new FormData(formEl);
        try {
            const res = await fetch('/newsletter', { method: 'POST', body: fd });
            const data = await res.json();
            if (data && data.status === 'ok') {
                if (statusEl) statusEl.textContent = 'Thanks — you are subscribed.';
                formEl.reset();
            } else {
                if (statusEl) statusEl.textContent = 'Could not subscribe.';
            }
        } catch (err) {
            if (statusEl) statusEl.textContent = 'Could not subscribe.';
        }
    }

    newsletter?.addEventListener('submit', (e) => { 
        e.preventDefault(); 
        submitNewsletter(newsletter, newsletterStatus); 
    });
    footerNewsletter?.addEventListener('submit', (e) => { 
        e.preventDefault(); 
        submitNewsletter(footerNewsletter, null); 
    });

    // Dynamic Copyright Year Sync
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();


    /* ==========================================
       CORE EXPERIENCE 2: PROGRAMMATIC 40-TABLE MAP BLUEPRINT GENERATOR
       ========================================== */
    const floorCanvas = document.getElementById('table-floor-grid');
    if (floorCanvas) {
        const zonesList = ['rooftop', 'bar_counter', 'booths'];
        let injectedHTML = '';
        
        for (let i = 1; i <= 40; i++) {
            let currentZone = zonesList[i % zonesList.length];
            let zoneLabel = currentZone === 'rooftop' ? 'Rooftop' : (currentZone === 'bar_counter' ? 'Bar Counter' : 'Booths');
            let maxCovers = i % 3 == 0 ? 6 : (i % 2 == 0 ? 4 : 2);
            
            injectedHTML += `
                <div id="grid-table-card-${i}" 
                     onclick="assignTableToWizard('${i}', '${zoneLabel}', '${currentZone}')"
                     class="table-grid-unit select-none cursor-pointer border border-slate-200 bg-white p-4 rounded-xl shadow-sm flex flex-col justify-between h-40 border-l-4 border-l-emerald-500 transition-all hover:scale-[1.02]" 
                     data-zone-group="${currentZone}" 
                     data-status="vacant">
                    <div class="space-y-1">
                        <div class="flex justify-between items-center">
                            <span class="font-serif font-bold text-gray-900 text-base">Table T-${i}</span>
                            <span id="badge-state-${i}" class="text-[9px] tracking-wide text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-bold uppercase border border-emerald-200">Vacant</span>
                        </div>
                        <span class="text-xs font-semibold text-amber-700 tracking-wider block">${zoneLabel}</span>
                    </div>
                    
                    <div class="pt-2 border-t border-slate-100 text-xs text-slate-500 space-y-2">
                        <span class="block text-[10px] text-slate-400 font-light">${zoneLabel} Capacity ${maxCovers}</span>
                        <button type="button" 
                                onclick="event.stopPropagation(); toggleTableOccupancyState('${i}');" 
                                id="toggle-btn-${i}"
                                class="w-full text-[10px] bg-slate-100 text-slate-700 hover:bg-amber-500 hover:text-black font-bold py-1.5 px-2 rounded-md border border-slate-200 transition-all flex items-center justify-center gap-1">
                            <i class="fa-solid fa-right-left text-[9px]"></i> Set to Full
                        </button>
                    </div>
                </div>
            `;
        }
        floorCanvas.innerHTML = injectedHTML;
        window.recalculateDashboardMetrics();
    }


    /* ==========================================
       VIRTUAL RECEPTIONS CONCIERGE CHAT WIDGET INTERFACES
       ========================================== */
    const openBtn = document.getElementById('chat-open-btn');
    const widget = document.getElementById('chat-widget');
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const messagesContainer = document.getElementById('chat-messages');

    let conversationInitialized = false;

    // Open Chat Callback Trigger
    openBtn?.addEventListener('click', function() {
        if (!widget) return;
        widget.classList.remove('hidden');
        setTimeout(() => {
            widget.classList.remove('scale-95', 'opacity-0');
            widget.classList.add('scale-100', 'opacity-100');
        }, 10);
        openBtn.classList.add('opacity-0', 'pointer-events-none');

        if (!conversationInitialized) {
            if (messagesContainer) {
                messagesContainer.innerHTML = `
                    <div class="bg-amber-50 text-amber-900 p-3 rounded-2xl border border-amber-200/50 max-w-[85%] font-sans text-left">
                        Hello and welcome! I am your <strong>AVYUKT VIEW Digital Concierge</strong>. How can I assist you with your luxury dining experience today?
                    </div>
                `;
                // Render Tier 1 Core Conversation Starters
                renderNewSuggestionPills([
                    "How do I choose and book a table?",
                    "Can I pre-order food and drinks?",
                    "What are your operating hours and location?",
                    "How do I contact the Hotel Main Desk?"
                ]);
            }
            conversationInitialized = true;
        }
    });

    // Submit box processing router links
    chatForm?.addEventListener('submit', function(event) {
        event.preventDefault();
        const queryText = chatInput.value.trim();
        if (!queryText || !messagesContainer) return;

        processChatMessagePipeline(queryText);
        chatInput.value = '';
    });

    // Global hook routing for user micro-pill options clicks
    window.handlePresetQuestionClick = function(questionText) {
        processChatMessagePipeline(questionText);
    };

    // Helper utility to inject new context follow-up pills cleanly
    function renderNewSuggestionPills(questionsArray) {
        document.getElementById('preset-questions-wrapper')?.remove();

        const pillsBox = document.createElement('div');
        pillsBox.id = 'preset-questions-wrapper';
        pillsBox.className = "pt-2 flex flex-col gap-1.5 max-w-[90%] transition-all duration-300 opacity-0 transform translate-y-2 text-left";

        let buttonsHTML = `<p class="text-[10px] text-slate-400 font-semibold uppercase tracking-wider pl-1">Suggested Follow-ups:</p>`;
        questionsArray.forEach(q => {
            buttonsHTML += `<button type="button" onclick="handlePresetQuestionClick('${q.replace(/'/g, "\\'")}')" class="w-full text-left bg-white border border-slate-200 hover:border-amber-500 text-gray-700 hover:text-black p-2 rounded-xl transition-all shadow-sm text-xs font-medium">${q}</button>`;
        });

        pillsBox.innerHTML = buttonsHTML;
        messagesContainer.appendChild(pillsBox);
        
        setTimeout(() => {
            pillsBox.classList.remove('opacity-0', 'translate-y-2');
            pillsBox.classList.add('opacity-100', 'translate-y-0');
        }, 50);

        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function processChatMessagePipeline(text) {
        // Drop past context options
        document.getElementById('preset-questions-wrapper')?.remove();

        // 1. Render User Message Bubble
        const userBubble = document.createElement('div');
        userBubble.className = "bg-slate-900 text-white p-3 rounded-2xl rounded-tr-none ml-auto max-w-[85%] font-sans shadow-sm text-left";
        userBubble.innerText = text;
        messagesContainer.appendChild(userBubble);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        // 2. Compute AI Rule Branching and inject fresh Follow-Ups
        setTimeout(() => {
            const botBubble = document.createElement('div');
            botBubble.className = "bg-white text-gray-800 p-3 rounded-2xl rounded-tl-none mr-auto max-w-[85%] font-sans shadow-sm border border-slate-200/60 text-left";
            
            const checkText = text.toLowerCase();
            let reply = "Thank you for messaging AVYUKT VIEW. Let me know if you need specific details regarding dining menus, table availability states, or room suite packages!";
            
            let nextQuestions = [
                "How do I choose and book a table?",
                "Can I pre-order food and drinks?",
                "What are your operating hours and location?"
            ];

            if (checkText.includes('table') || checkText.includes('book') || checkText.includes('choose') || checkText.includes('reserve')) {
                reply = "To secure your table, browse our real-time 40-table floor grid map above. Select any active green 'Vacant' card, and the system will populate the metrics and smoothly scroll down directly over your two-column booking form!";
                nextQuestions = [
                    "Can I pre-order food and drinks?",
                    "What are your operating hours and location?",
                    "How do I change a table from Full to Vacant?"
                ];
            } 
            else if (checkText.includes('menu') || checkText.includes('food') || checkText.includes('drink') || checkText.includes('order')) {
                reply = "You can absolutely pre-order! Explore our Epicurean selection section above. Filter through Spirits, Cocktails, or Gourmet Cuisine, and tap items to add them to your basket to live-calculate taxes automatically.";
                nextQuestions = [
                    "How do I choose and book a table?",
                    "Is there a tax or service charge applied?",
                    "What are your operating hours and location?"
                ];
            } 
            else if (checkText.includes('change') || checkText.includes('full') || checkText.includes('vacant') || checkText.includes('toggle')) {
                reply = "To change occupancy states on the fly for testing or monitoring, click the mini 'Set to Full' or 'Set to Vacant' switch button located inside any individual table asset grid unit card.";
                nextQuestions = [
                    "How do I choose and book a table?",
                    "Can I pre-order food and drinks?"
                ];
            }
            else if (checkText.includes('tax') || checkText.includes('charge') || checkText.includes('price')) {
                reply = "We apply a standard 18% tax calculation framework to live menu collections added to your interactive panel basket. The final consolidated value update is displayed under the subtotal summary card module row.";
                nextQuestions = [
                    "Can I pre-order food and drinks?",
                    "How do I choose and book a table?"
                ];
            }
            else if (checkText.includes('hour') || checkText.includes('time') || checkText.includes('location') || checkText.includes('address')) {
                reply = "Our Sky Rooftop Lounge and Epicurean Dining Room are open daily from 11:00 AM to 11:30 PM. We are located at our main resort property. Check the location pin details block down at the foot of our webpage overview row.";
                nextQuestions = [
                    "How do I choose and book a table?",
                    "How do I contact the Hotel Main Desk?"
                ];
            } 
            else if (checkText.includes('hotel') || checkText.includes('desk') || checkText.includes('main website') || checkText.includes('stay')) {
                reply = "To book luxury stay accommodations, explore master suites, or review room check-in times, select 'Main Website' from the 'MORE' menu link dropdown at the top, or click the primary 'Book Now!' top header anchor link.";
                nextQuestions = [
                    "What are your operating hours and location?",
                    "How do I choose and book a table?"
                ];
            }

            botBubble.innerText = reply;
            messagesContainer.appendChild(botBubble);
            
            // Append the fresh set of tailored contextual follow-up questions
            renderNewSuggestionPills(nextQuestions);
            
        }, 500);
    }
});

/* ==========================================================================
   AUXILIARY INTERACTIVE WINDOW SCOPED HELPER MODULE FUNCTIONALITIES
   ========================================================================== */

function assignTableToWizard(id, zoneName, rawZone) {
    const parentCard = document.getElementById(`grid-table-card-${id}`);
    if (!parentCard) return;
    
    if (parentCard.getAttribute('data-status') === 'booked') {
        alert(`Table T-${id} is currently fully occupied. Click the button inside the card to switch it to vacant first.`);
        return;
    }
    
    document.querySelectorAll('.table-grid-unit').forEach(el => {
        el.classList.remove('ring-4', 'ring-amber-500/30', 'border-amber-400');
    });
    parentCard.classList.add('ring-4', 'ring-amber-500/30', 'border-amber-400');

    const inputTable = document.getElementById('assigned_table_id');
    const inputZone = document.getElementById('assigned_zone');
    
    if (inputTable) inputTable.value = `Table T-${id}`;
    if (inputZone) inputZone.value = `${zoneName} Section`;

    const targetFormWrapper = document.getElementById('live-booking-form');
    targetFormWrapper?.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
    });
}

function toggleTableOccupancyState(id) {
    const card = document.getElementById(`grid-table-card-${id}`);
    const badge = document.getElementById(`badge-state-${id}`);
    const button = document.getElementById(`toggle-btn-${id}`);
    if (!card || !badge || !button) return;

    const currentStatus = card.getAttribute('data-status');

    if (currentStatus === 'vacant') {
        card.setAttribute('data-status', 'booked');
        card.classList.remove('border-l-emerald-500');
        card.classList.add('border-l-slate-300', 'bg-slate-50/40', 'opacity-60');
        badge.innerText = "Full";
        badge.classList.remove('text-emerald-700', 'bg-emerald-50', 'border-emerald-200');
        badge.classList.add('text-slate-500', 'bg-slate-100', 'border-slate-200');
        
        button.innerHTML = `<i class="fa-solid fa-right-left text-[9px]"></i> Set to Vacant`;
        button.classList.remove('bg-slate-100', 'text-slate-700');
        button.classList.add('bg-emerald-600', 'text-white', 'border-emerald-700', 'hover:bg-emerald-500');
        
        const inputTable = document.getElementById('assigned_table_id');
        if (inputTable && inputTable.value === `Table T-${id}`) {
            inputTable.value = '';
            const inputZone = document.getElementById('assigned_zone');
            if (inputZone) inputZone.value = '';
            card.classList.remove('ring-4', 'ring-amber-500/30', 'border-amber-400');
        }
    } else {
        card.setAttribute('data-status', 'vacant');
        card.classList.remove('border-l-slate-300', 'bg-slate-50/40', 'opacity-60');
        card.classList.add('border-l-emerald-500');
        badge.innerText = "Vacant";
        badge.classList.remove('text-slate-500', 'bg-slate-100', 'border-slate-200');
        badge.classList.add('text-emerald-700', 'bg-emerald-50', 'border-emerald-200');
        
        button.innerHTML = `<i class="fa-solid fa-right-left text-[9px]"></i> Set to Full`;
        button.classList.remove('bg-emerald-600', 'text-white', 'border-emerald-700', 'hover:bg-emerald-500');
        button.classList.add('bg-slate-100', 'text-slate-700');
    }
    window.recalculateDashboardMetrics();
}

function recalculateDashboardMetrics() {
    const totalTables = document.querySelectorAll('.table-grid-unit').length;
    const bookedTables = document.querySelectorAll('.table-grid-unit[data-status="booked"]').length;
    const vacantTables = totalTables - bookedTables;

    const vacantCountEl = document.getElementById('vacant-count');
    const bookedCountEl = document.getElementById('booked-count');
    
    if (vacantCountEl) vacantCountEl.innerText = vacantTables;
    if (bookedCountEl) bookedCountEl.innerText = bookedTables;
}
window.recalculateDashboardMetrics = recalculateDashboardMetrics;