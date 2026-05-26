document.addEventListener('DOMContentLoaded', function(){
  const moreBtn = document.getElementById('moreBtn');
  const moreDropdown = document.getElementById('moreDropdown');
  const mobileBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  moreBtn?.addEventListener('click', (e)=>{
    e.stopPropagation();
    moreDropdown.classList.toggle('hidden');
  });

  mobileBtn?.addEventListener('click', ()=>{
    mobileMenu.classList.toggle('hidden');
  });

  document.addEventListener('click', (e)=>{
    if(moreDropdown && !moreDropdown.classList.contains('hidden')) moreDropdown.classList.add('hidden');
  });

  const revealElements = document.querySelectorAll('.reveal');
  if(revealElements.length){
    const revealObserver = new IntersectionObserver((entries)=>{
      entries.forEach((entry)=>{
        if(entry.isIntersecting){
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    revealElements.forEach((el)=> revealObserver.observe(el));
  }

  // Contact form submit via fetch to backend
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  form?.addEventListener('submit', async (e)=>{
    e.preventDefault();
    status.textContent = 'Sending...';
    const fd = new FormData(form);
    try{
      const res = await fetch('/contact', { method: 'POST', body: fd });
      const data = await res.json();
      if(data && data.status === 'ok'){
        status.textContent = 'Message received. We will get back to you shortly.';
        form.reset();
      } else {
        status.textContent = 'Sorry, something went wrong.';
      }
    }catch(err){
      status.textContent = 'Could not send message.';
    }
  });

  // newsletter forms
  const newsletter = document.getElementById('newsletterForm');
  const footerNewsletter = document.getElementById('footerNewsletter');
  const newsletterStatus = document.getElementById('newsletterStatus');

  async function submitNewsletter(formEl, statusEl){
    const fd = new FormData(formEl);
    try{
      const res = await fetch('/newsletter', { method: 'POST', body: fd });
      const data = await res.json();
      if(data && data.status === 'ok'){
        if(statusEl) statusEl.textContent = 'Thanks — you are subscribed.';
        formEl.reset();
      } else {
        if(statusEl) statusEl.textContent = 'Could not subscribe.';
      }
    }catch(err){
      if(statusEl) statusEl.textContent = 'Could not subscribe.';
    }
  }

  newsletter?.addEventListener('submit', (e)=>{ e.preventDefault(); submitNewsletter(newsletter, newsletterStatus); });
  footerNewsletter?.addEventListener('submit', (e)=>{ e.preventDefault(); submitNewsletter(footerNewsletter, null); });

  // set year
  const yearEl = document.getElementById('year');
  if(yearEl) yearEl.textContent = new Date().getFullYear();
});
