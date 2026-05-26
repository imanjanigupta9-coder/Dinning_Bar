/* ==========================================================================
   AVYUKT VIEW - COALESCED FRONTEND ARCHITECTURE PLATFORM ENGINE
   ========================================================================== */

/**
 * 1. GLOBAL CHAT CLOSING CONSOLE OVERRIDE
 * Explicit handle declared outside lexical scopes so inline structural markup elements
 * (like your decorative orange circle header buttons) can execute triggers seamlessly.
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
        openBtn.classList.remove('scale-0', 'pointer-events-none');
    }
}

// Master Table Seating Matrix Allocator & Filter Actions
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

    moreBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        moreDropdown?.classList.toggle('hidden');
    });

    mobileBtn?.addEventListener('click', () => {
        mobileMenu?.classList.toggle('hidden');
    });

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
       ASYNC CONTACT & NEWSLETTER MANAGEMENT DATA SUBMISSIONS
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

    // Set Copyright Year Element Dynamically
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();


    /* ==========================================
       CORE EXPERIENCE 2: PROGRAMMATIC 40-TABLE MAP blueprint GENERATOR
       ========================================== */
    const floorCanvas = document.getElementById('table-floor-grid');
    if (floorCanvas) {
        const zonesList = ['rooftop', 'bar_counter', 'booths'];
        let injectedHTML = '';
        
        // Loop generate upscaled luxury cards mapping data cleanly
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
        window.recalculateDashboardMetrics(); // Trigger dynamic recount updates initially
    }


    /* ==========================================
       VIRTUAL RECEPTIONS CONCIERGE CHAT WIDGET INTERFACES
       ========================================== */
    const openBtn = document.getElementById('chat-open-btn');
    const closeBtn = document.getElementById('chat-close-btn');
    const widget = document.getElementById('chat-widget');
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const messagesContainer = document.getElementById('chat-messages');

    let conversationInitialized = false;

    // Open Chat Event Callback
    openBtn?.addEventListener('click', function() {
        if (!widget) return;
        widget.classList.remove('hidden');
        setTimeout(() => {
            widget.classList.remove('scale-95', 'opacity-0');
            widget.classList.add('scale-100', 'opacity-100');
        }, 10);
        openBtn.classList.add('scale-0', 'pointer-events-none');

        if (!conversationInitialized) {
            if (messagesContainer) {
                messagesContainer.innerHTML = `
                    <div class="bg-amber-50 text-amber-900 p-3 rounded-2xl border border-amber-200/50 max-w-[85%] font-sans">
                        Hello and welcome! I am your <strong>AVYUKT VIEW Digital Concierge</strong>. How may I assist you with your table layout selection, menu pre-ordering, or bar seating arrangements today?
                    </div>
                `;
            }
            conversationInitialized = true;
        }
    });

    // Close Button Selector Callback
    closeBtn?.addEventListener('click', function(e) {
        e.stopPropagation(); // Stops parent container click bubbling issues
        minimizeChatWidgetManually();
    });

    // Message input validation thread loops
    chatForm?.addEventListener('submit', function(event) {
        event.preventDefault();
        const queryText = chatInput.value.trim();
        if (!queryText || !messagesContainer) return;

        // Form User Response Speech bubble
        const userBubble = document.createElement('div');
        userBubble.className = "bg-slate-900 text-white p-3 rounded-2xl rounded-tr-none ml-auto max-w-[85%] font-sans shadow-sm text-left";
        userBubble.innerText = queryText;
        messagesContainer.appendChild(userBubble);
        chatInput.value = '';
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        // Automated bot calculation reply simulation triggers
        setTimeout(() => {
            const botBubble = document.createElement('div');
            botBubble.className = "bg-white text-gray-800 p-3 rounded-2xl rounded-tl-none mr-auto max-w-[85%] font-sans shadow-sm border border-slate-200/60";
            
            const checkText = queryText.toLowerCase();
            let reply = "Thank you for reaching out to us. Your data parameter packages are forwarded safely to our master digital backend portal configuration framework.";

            if (checkText.includes('table') || checkText.includes('book') || checkText.includes('reserve')) {
                reply = "To lock down a table, explore our interactive 40-table layout matrix grid map above, select any active green vacant unit card, and it will update your booking wizard fields instantly!";
            } else if (checkText.includes('menu') || checkText.includes('food') || checkText.includes('drink')) {
                reply = "Our interactive food and drink selections are available right above! You can add Glenfiddich shots or truffle sliders to your basket collection to live calculate taxes.";
            }

            botBubble.innerText = reply;
            messagesContainer.appendChild(botBubble);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }, 600);
    });
});

/* ==========================================================================
   AUXILIARY INTERACTIVE WINDOW SCOPED HELPER MODULE FUNCTIONALITIES
   ========================================================================== */

// Selected Node data matching router injection function maps
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

    // Fluid auto scroll transition trigger dropping browser down directly over form
    const targetFormWrapper = document.getElementById('live-booking-form');
    targetFormWrapper?.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
    });
}

// Occupancy State Toggler Machine
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
        
        // Wipe selection values if user manually blocks out active table container
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

// Global dashboard panel tracker sync
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