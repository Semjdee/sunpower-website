/* ============================================================
   SUN POWER — CLIENT-SIDE INTERACTIVITY
   Content is already rendered server-side for SEO. This file only
   adds interactive behavior: menu, accordions, funnel, WhatsApp links.
   window.CONFIG is set inline on each page before this file loads.
   ============================================================ */

function waLink(message){
  return "https://wa.me/" + CONFIG.whatsappNumber + "?text=" + encodeURIComponent(message);
}
function setWaLinks(){
  document.querySelectorAll("[data-wa]").forEach(function(el){
    el.href = waLink(el.getAttribute("data-wa"));
  });
}

/* ---------- Consultation funnel ---------- */
const FUNNEL_STATE = { need:null, powering:[], location:"", bill:"", fileName:"" };
let funnelStep = 1;
function initFunnel(){
  funnelStep = 1;
  FUNNEL_STATE.need = null; FUNNEL_STATE.powering = []; FUNNEL_STATE.location=""; FUNNEL_STATE.bill=""; FUNNEL_STATE.fileName="";
  const root = document;
  if(!root.querySelector('[data-step="1"]')) return;

  function showStep(n){
    root.querySelectorAll('.funnel-step').forEach(function(el){el.classList.toggle('active', +el.dataset.step===n);});
    root.querySelectorAll('#funnelProgress i').forEach(function(el){el.classList.toggle('filled', +el.dataset.step<=n);});
    document.getElementById('funnelBack').style.visibility = n===1 ? 'hidden' : 'visible';
    const nextBtn = document.getElementById('funnelNext');
    nextBtn.style.display = n===6 ? 'none' : 'inline-flex';
    if(n===6) buildSummary();
  }

  root.querySelectorAll('[data-need]').forEach(function(btn){
    btn.addEventListener('click', function(){
      root.querySelectorAll('[data-need]').forEach(function(b){b.classList.remove('selected');});
      btn.classList.add('selected');
      FUNNEL_STATE.need = btn.dataset.need;
    });
  });
  root.querySelectorAll('[data-power]').forEach(function(btn){
    btn.addEventListener('click', function(){
      btn.classList.toggle('selected');
      const v = btn.dataset.power;
      const idx = FUNNEL_STATE.powering.indexOf(v);
      if(idx>-1) FUNNEL_STATE.powering.splice(idx,1); else FUNNEL_STATE.powering.push(v);
    });
  });
  const locInput = document.getElementById('locInput');
  if(locInput) locInput.addEventListener('input', function(){FUNNEL_STATE.location = locInput.value;});
  const billInput = document.getElementById('billInput');
  if(billInput) billInput.addEventListener('input', function(){FUNNEL_STATE.bill = billInput.value;});
  const billFile = document.getElementById('billFile');
  if(billFile) billFile.addEventListener('change', function(){
    FUNNEL_STATE.fileName = billFile.files[0] ? billFile.files[0].name : "";
    document.getElementById('fileNameHint').textContent = FUNNEL_STATE.fileName ? ("Selected: " + FUNNEL_STATE.fileName) : "";
  });

  document.getElementById('funnelNext').addEventListener('click', function(){
    if(funnelStep < 6){ funnelStep++; showStep(funnelStep); window.scrollTo({top: root.querySelector('.funnel-wrap').offsetTop - 100, behavior:'smooth'}); }
  });
  document.getElementById('funnelBack').addEventListener('click', function(){
    if(funnelStep > 1){ funnelStep--; showStep(funnelStep); }
  });

  function buildSummary(){
    const box = document.getElementById('summaryBox');
    const rows = [
      ["Need", FUNNEL_STATE.need || "Not specified"],
      ["Powering", FUNNEL_STATE.powering.length ? FUNNEL_STATE.powering.join(", ") : "Not specified"],
      ["Location", FUNNEL_STATE.location || "Not specified"],
      ["Bill / Challenge", FUNNEL_STATE.bill || "Not specified"],
      ["Bill file", FUNNEL_STATE.fileName || "None selected"]
    ];
    box.innerHTML = rows.map(function(r){return '<div class="summary-row"><span>'+r[0]+'</span><b>'+r[1]+'</b></div>';}).join('');
    const msg = "Hi Sun Power, I'd like a solar consultation.\n\n" +
      "What I need solar for: " + (FUNNEL_STATE.need || "Not specified") + "\n" +
      "What I want to power: " + (FUNNEL_STATE.powering.length ? FUNNEL_STATE.powering.join(", ") : "Not specified") + "\n" +
      "Location: " + (FUNNEL_STATE.location || "Not specified") + "\n" +
      "Monthly bill / energy challenge: " + (FUNNEL_STATE.bill || "Not specified") +
      (FUNNEL_STATE.fileName ? ("\n(I have an electricity bill file to share: " + FUNNEL_STATE.fileName + ")") : "") +
      "\n\n— Sent via the Sun Power website";
    document.getElementById('funnelWaBtn').href = waLink(msg);
  }
  showStep(1);
}

/* ---------- Page init ---------- */
function initPage(){
  setWaLinks();
  document.getElementById('headerWaBtn').href = waLink("Hi Sun Power, I would like to start a WhatsApp consultation.");
  document.getElementById('footerWaBtn').href = waLink("Hi Sun Power, I would like to start a WhatsApp consultation.");
  document.getElementById('floatWaBtn').href = waLink("Hi Sun Power, I would like to start a WhatsApp consultation.");

  document.querySelectorAll('[data-faq-toggle]').forEach(function(btn){
    btn.addEventListener('click', function(){
      btn.closest('.faq-item').classList.toggle('open');
    });
  });

  document.querySelectorAll('[data-eq-toggle]').forEach(function(btn){
    btn.addEventListener('click', function(){
      const card = btn.closest('[data-eq-card]');
      const detail = card.querySelector('[data-eq-detail]');
      const open = detail.classList.toggle('open');
      btn.textContent = open ? "Show Less" : "Explore";
    });
  });

  const menuToggle = document.getElementById('menuToggle');
  if(menuToggle){
    menuToggle.addEventListener('click', function(){
      const menu = document.getElementById('mobileMenu');
      const open = menu.classList.toggle('open');
      this.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  if('IntersectionObserver' in window){
    const io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
    }, {threshold:0.12});
    document.querySelectorAll('.reveal').forEach(function(el){ io.observe(el); });
  } else {
    document.querySelectorAll('.reveal').forEach(function(el){ el.classList.add('in'); });
  }

  initFunnel();
}

if(document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', initPage);
}else{
  initPage();
}
