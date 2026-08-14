#!/usr/bin/env node
/* ============================================================
   RAYGRID — STATIC SITE BUILD
   Reads editable content from content/*.json and generates real,
   independent, pre-rendered HTML pages (one per route) into dist/.
   Run automatically by Netlify on every deploy via netlify.toml.
   ============================================================ */
const fs = require('fs');
const path = require('path');

// TODO: update this once the real domain is purchased and connected.
const SITE_URL = "https://raygridsolarenergy.com";

const ROOT = __dirname;
const DIST = path.join(ROOT, 'dist');

function readJSON(file, fallback){
  try{
    return JSON.parse(fs.readFileSync(path.join(ROOT, 'content', file), 'utf8'));
  }catch(e){
    console.warn('Could not read', file, '— using fallback.', e.message);
    return fallback;
  }
}

const siteData = readJSON('site.json', {});
const CONFIG = Object.assign({
  whatsappNumber: "000000000000",
  phoneDisplay: "+xxx xxx xxx xxx",
  email: "info@sunpower.example",
  address: "Address to be supplied by RayGrid",
  heroHeadline: "Power Designed Around You.",
  heroSub: "Professionally designed solar and energy systems for homes, businesses, farms and institutions.",
  whyCards: [],
  brands: []
}, siteData);

let SOLUTIONS = (readJSON('solutions.json', {items:[]}).items) || [];
let SERVICES  = (readJSON('services.json',  {items:[]}).items) || [];
let EQUIPMENT = (readJSON('equipment.json', {items:[]}).items) || [];
let PROJECTS  = (readJSON('projects.json',  {items:[]}).items) || [];
let LOCATIONS = (readJSON('locations.json', {items:[]}).items) || [];

/* ============================================================
   TEMPLATE FUNCTIONS (pure — generated from the tested SPA build)
   ============================================================ */
const ICONS = {
  home:'<path d="M3 11.5 12 4l9 7.5"/><path d="M5 10v10h14V10"/><path d="M9.5 20v-6h5v6"/>',
  building:'<rect x="4" y="3" width="16" height="18"/><path d="M9 8h1M14 8h1M9 12h1M14 12h1M9 16h1M14 16h1"/>',
  tractor:'<circle cx="7" cy="17" r="3"/><circle cx="18" cy="17" r="2.4"/><path d="M10 17h5.5"/><path d="M4 13V6h6l3 4h3.5a2 2 0 0 1 2 2v3"/><path d="M9 6v4"/>',
  school:'<path d="M3 9 12 4l9 5-9 5-9-5z"/><path d="M6 11v5c0 1.5 2.7 3 6 3s6-1.5 6-3v-5"/><path d="M21 9v6"/>',
  droplet:'<path d="M12 3s6.5 7 6.5 11.5A6.5 6.5 0 0 1 5.5 14.5C5.5 10 12 3 12 3z"/>',
  heat:'<path d="M9 3v11a3 3 0 1 0 6 0V3"/><path d="M9 8h6"/><circle cx="12" cy="17" r="1"/>',
  bulb:'<path d="M9 18h6"/><path d="M10 21h4"/><path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z"/>',
  shield:'<path d="M12 3l8 3v6c0 5-3.5 7.8-8 9-4.5-1.2-8-4-8-9V6l8-3z"/><path d="m9 12 2 2 4-4"/>',
  battery:'<rect x="3" y="8" width="16" height="9" rx="1.2"/><path d="M21 11v3"/><path d="M7 12v3M11 12v3"/>',
  wrench:'<path d="M14.7 6.3a4 4 0 0 0-5.4 5l-6 6a2 2 0 0 0 2.8 2.8l6-6a4 4 0 0 0 5-5.4l-2.6 2.6-2.4-2.4 2.6-2.6z"/>',
  design:'<path d="M4 20 15 9l3 3L7 23z"/><path d="m15 9 2.5-2.5a2 2 0 1 1 3 3L18 12"/><path d="M4 20 2 22"/>',
  search:'<circle cx="11" cy="11" r="6.5"/><path d="m20 20-4.3-4.3"/>',
  truck:'<rect x="2" y="8" width="12" height="9"/><path d="M14 11h4l3 3v3h-7z"/><circle cx="6.5" cy="19" r="1.6"/><circle cx="17.5" cy="19" r="1.6"/>',
  headset:'<path d="M4 13v-1a8 8 0 0 1 16 0v1"/><rect x="2.5" y="13" width="4" height="6" rx="1.2"/><rect x="17.5" y="13" width="4" height="6" rx="1.2"/><path d="M19.5 19.5A6 6 0 0 1 14 22"/>',
  upgrade:'<path d="M12 21V7"/><path d="m6 13 6-6 6 6"/><path d="M5 21h14"/>',
  check:'<path d="M20 6 9 17l-5-5"/>',
  arrow:'<path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',
  mail:'<path d="M2 6h20v12H2z"/><path d="m22 6-10 7L2 6"/>',
  phone:'<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.7a2 2 0 0 1-.5 2.1L8 9.7a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.5 2.7.6a2 2 0 0 1 1.7 2.1z"/>',
  pin:'<path d="M21 10c0 6-9 12-9 12s-9-6-9-12a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>',
  upload:'<path d="M12 16V4"/><path d="m7 9 5-5 5 5"/><path d="M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3"/>',
  play:'<circle cx="12" cy="12" r="10"/><path d="m10 8 6 4-6 4z"/>',
  bolt:'<path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z"/>',
  gear:'<circle cx="12" cy="12" r="3.2"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5v.2a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H4a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.6-1.1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H10a1.7 1.7 0 0 0 1-1.5V4a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9V10a1.7 1.7 0 0 0 1.5 1h.2a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.6 1z"/>',
  eye:'<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/>',
  compass:'<circle cx="12" cy="12" r="10"/><path d="m16 8-2 6-6 2 2-6z"/>'
};
function icon(name, cls){
  return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" class="'+(cls||'')+'" aria-hidden="true">'+(ICONS[name]||'')+'</svg>';
}

/* ============================================================
   DATA
   ============================================================ */
const PROCESS_STEPS = [
  {n:"01", t:"Consult", d:"We start with a conversation about your property, energy needs, application and budget."},
  {n:"02", t:"Assess", d:"A site assessment confirms roof, ground or pump conditions, loads and constraints."},
  {n:"03", t:"Design", d:"Our team designs a layout and system architecture specific to your site."},
  {n:"04", t:"Source", d:"We source equipment suited to your design, application and budget."},
  {n:"05", t:"Install", d:"Professional installation and commissioning by our technical team."},
  {n:"06", t:"Support", d:"Ongoing maintenance, troubleshooting and system upgrades as your needs grow."}
];

const AUDIENCES = [
  {key:"home", label:"Home", icon:"home", blurb:"Rooftop solar, backup power and water heating designed around your household's daily energy use.", slug:"residential"},
  {key:"business", label:"Business", icon:"building", blurb:"Commercial solar and hybrid systems sized to your operating hours, load profile and site.", slug:"commercial"},
  {key:"agriculture", label:"Agriculture", icon:"tractor", blurb:"Solar water pumping and irrigation systems built around your water source and land.", slug:"agriculture"},
  {key:"institution", label:"Institution", icon:"school", blurb:"Reliable solar and backup energy for schools, healthcare and hospitality facilities.", slug:"institutional"}
];


function processRailHTML(){
  return '<div class="process-rail">' + PROCESS_STEPS.map(function(s){
    return '<div class="process-step reveal"><div class="num">'+s.n+'</div><h4>'+s.t+'</h4><p>'+s.d+'</p></div>';
  }).join('') + '</div>';
}

function faqHTML(items, idPrefix){
  return '<div class="faq-list">' + items.map(function(f,i){
    return '<div class="faq-item" data-faq><button class="faq-q" data-faq-toggle>'+f.q+icon('plus')+'</button>'+
      '<div class="faq-a"><div class="faq-a-inner">'+f.a+'</div></div></div>';
  }).join('') + '</div>';
}

function equipTagsFor(keys){
  return keys.map(function(k){
    const eq = EQUIPMENT.find(function(e){return e.key===k;});
    return eq ? '<a class="chip" href="/equipment/#eq-'+k+'">'+eq.name+'</a>' : '';
  }).join('');
}

function ctaBlock(title, sub, waMsg){
  return '<div class="side-card corner-frame">'+
    '<div class="eyebrow on-dark">Next Step</div>'+
    '<h3 style="margin-top:10px;">'+title+'</h3>'+
    '<p>'+sub+'</p>'+
    '<a class="btn btn-primary btn-block" href="/consultation/">Start a Consultation '+icon('arrow')+'</a>'+
    '<a class="btn btn-wa btn-block" style="margin-top:10px;" data-wa="'+waMsg+'" target="_blank" rel="noopener">Ask on WhatsApp</a>'+
    '</div>';
}

/* ============================================================
   PAGE: HOME
   ============================================================ */
function pageHome(){
  return '' +
  '<section class="hero">' +
    '<div class="hero-grid"></div>' +
    '<div class="container hero-inner">' +
      '<div class="hero-copy">' +
        '<div class="eyebrow on-dark">Solar &amp; Energy Solutions</div>' +
        '<h1>' + CONFIG.heroHeadline + '</h1>' +
        '<p class="lead">' + CONFIG.heroSub + '</p>' +
        '<div class="hero-ctas">' +
          '<a class="btn btn-wa" data-wa="Hi RayGrid, I would like to start a WhatsApp consultation." target="_blank" rel="noopener">'+icon('phone')+' Start WhatsApp Consultation</a>' +
          '<a class="btn btn-outline on-navy" href="/solutions/">Explore Solutions '+icon('arrow')+'</a>' +
        '</div>' +
        '<div class="op-line"><b>DESIGN</b><span class="dot"></span><b>INSTALL</b><span class="dot"></span><b>SUPPORT</b></div>' +
      '</div>' +
      '<div class="hero-art">' +
        '<div class="blueprint-panel corner-frame">' + heroSchematicSVG() +
          '<div class="blueprint-tag" style="top:10px;left:10px;">SITE PLAN — ILLUSTRATIVE</div>' +
          '<div class="blueprint-tag" style="bottom:10px;right:10px;">REV — SITE ASSESSMENT PENDING</div>' +
        '</div>' +
      '</div>' +
    '</div>' +
  '</section>' +

  '<section class="section">' +
    '<div class="container">' +
      '<div class="section-head reveal">' +
        '<div class="eyebrow">Start Here</div>' +
        '<h2>What are you powering?</h2>' +
        '<p>Every card below routes to a solution built for that application — not a generic product list.</p>' +
      '</div>' +
      '<div class="grid grid-4">' + AUDIENCES.map(function(a){
        return '<a class="audience-card reveal" href="/solutions/'+a.slug+'/">'+
          '<div class="band"></div>'+
          '<div class="body"><div class="icon-wrap">'+icon(a.icon)+'</div>'+
          '<h3>'+a.label+'</h3><p>'+a.blurb+'</p>'+
          '<span class="card-link">Explore '+a.label+' '+icon('arrow')+'</span></div>'+
        '</a>';
      }).join('') + '</div>' +
    '</div>' +
  '</section>' +

  '<section class="section on-navy">' +
    '<div class="container">' +
      '<div class="section-head reveal">' +
        '<div class="eyebrow on-dark">Site-Specific</div>' +
        '<h2>Designed for your site</h2>' +
        '<p>Layouts are drawn around your roof, ground or water source — not dropped in from a template.</p>' +
      '</div>' +
      '<div class="grid grid-3">' +
        siteDesignCard("Residential", ["Roof assessment","Panel layout","Inverter & storage","Install plan"]) +
        siteDesignCard("Commercial", ["Load assessment","Roof/ground layout","System architecture","Implementation"]) +
        siteDesignCard("Agriculture", ["Water source","Pump & array sizing","Storage plan","Irrigation layout"]) +
      '</div>' +
      '<div style="text-align:center;margin-top:36px;">' +
        '<a class="btn btn-primary" href="/consultation/">Request a Site Assessment '+icon('arrow')+'</a>' +
      '</div>' +
    '</div>' +
  '</section>' +

  '<section class="section on-off">' +
    '<div class="container">' +
      '<div class="section-head reveal">' +
        '<div class="eyebrow">Applications</div>' +
        '<h2>Our solutions</h2>' +
        '<p>Application-led solar and energy solutions across every property type we serve.</p>' +
      '</div>' +
      '<div class="grid grid-3">' +
        solutionMiniCard("bolt","Solar Power Systems","Grid-tied and hybrid solar power for any property type.", "/solutions/") +
        solutionMiniCard("battery","Backup & Hybrid Energy","Keep essential loads running through grid outages.", "/solutions/backup-hybrid/") +
        solutionMiniCard("droplet","Water Pumping & Irrigation","Solar-powered pumping for boreholes and irrigation.", "/solutions/water-pumping/") +
        solutionMiniCard("heat","Solar Water Heating","Reduce water heating costs with a system sized to demand.", "/solutions/water-heating/") +
        solutionMiniCard("bulb","Solar Lighting & Security","Standalone and wired lighting for compounds and streets.", "/solutions/lighting-security/") +
        solutionMiniCard("shield","Energy Monitoring & Control","Protection, switching and control equipment for your system.", "/equipment/#eq-protection") +
      '</div>' +
    '</div>' +
  '</section>' +

  '<section class="section on-navy">' +
    '<div class="container">' +
      '<div class="section-head reveal">' +
        '<div class="eyebrow on-dark">Our Process</div>' +
        '<h2>How RayGrid works</h2>' +
        '<p>A defined sequence, followed for every project regardless of size.</p>' +
      '</div>' +
      processRailHTML() +
    '</div>' +
  '</section>' +

  '<section class="section">' +
    '<div class="container">' +
      '<div class="section-head reveal">' +
        '<div class="eyebrow">Technical Expertise</div>' +
        '<h2>Equipment &amp; technologies</h2>' +
        '<p>Shown to demonstrate sourcing capability and technical range — this is not a shop.</p>' +
      '</div>' +
      '<div class="grid grid-4">' + EQUIPMENT.map(function(e){
        return '<a class="card reveal" href="/equipment/#eq-'+e.key+'">'+
          '<div class="icon-wrap">'+icon(e.icon)+'</div>'+
          '<h3>'+e.name+'</h3><p>'+e.d+'</p>'+
          '<span class="card-link">Explore '+icon('arrow')+'</span>'+
        '</a>';
      }).join('') + '</div>' +
      '<div style="text-align:center;margin-top:32px;"><a class="btn btn-outline" href="/equipment/">View All Equipment '+icon('arrow')+'</a></div>' +
    '</div>' +
  '</section>' +

  '<section class="section on-off">' +
    '<div class="container">' +
      '<div class="section-head reveal">' +
        '<div class="eyebrow">Sourcing</div>' +
        '<h2>Brands we source &amp; work with</h2>' +
        '<p>Confirmed brand relationships will appear here. Nothing below implies authorised distributor status.</p>' +
      '</div>' +
      '<div class="grid grid-4 reveal">' + brandTilesHTML() + '</div>' +
      '<div class="notice reveal" style="margin-top:18px;">' + icon('shield') +
        '<span>We source and work with reputable manufacturers matched to each project\'s requirements. Confirmed brand names and any verified partnerships will be added here by RayGrid.</span>' +
      '</div>' +
    '</div>' +
  '</section>' +

  '<section class="section">' +
    '<div class="container">' +
      '<div class="section-head reveal">' +
        '<div class="eyebrow">Proof of Work</div>' +
        '<h2>Featured projects</h2>' +
        '<p>Placeholder cards below — replaced with real completed-project photography and data once supplied.</p>' +
      '</div>' +
      '<div class="grid grid-3">' + PROJECTS.slice(0,3).map(projectCard).join('') + '</div>' +
      '<div style="text-align:center;margin-top:32px;"><a class="btn btn-outline" href="/projects/">View All Projects '+icon('arrow')+'</a></div>' +
    '</div>' +
  '</section>' +

  '<section class="section on-off">' +
    '<div class="container">' +
      '<div class="section-head reveal">' +
        '<div class="eyebrow">Why RayGrid</div>' +
        '<h2>Built on design, not guesswork</h2>' +
      '</div>' +
      '<div class="grid grid-4">' + CONFIG.whyCards.map(function(w){
        return '<div class="card reveal"><div class="icon-wrap">'+icon(w.icon)+'</div><h3>'+w.title+'</h3><p>'+w.description+'</p></div>';
      }).join('') + '</div>' +
    '</div>' +
  '</section>' +

  '<section class="section">' +
    '<div class="container">' +
      '<div class="section-head reveal">' +
        '<div class="eyebrow">Learn</div>' +
        '<h2>Solar knowledge</h2>' +
        '<p>Practical explainers, FAQs and video content — added as RayGrid publishes them.</p>' +
      '</div>' +
      '<div class="grid grid-3">' +
        knowledgeTile("Video", "How solar sizing actually works") +
        knowledgeTile("Podcast", "Choosing between grid-tie and hybrid") +
        knowledgeTile("Guide", "What a site assessment covers") +
      '</div>' +
      '<div class="stack reveal" style="margin-top:40px;max-width:760px;">' +
        faqHTML([
          {q:"Do you offer financing?", a:"Financing options depend on the provider relationships RayGrid confirms — ask your consultant for current options."},
          {q:"How is my system size determined?", a:"Through your site assessment: your loads or water demand, available space, and budget together determine the recommended system size."},
          {q:"Do you work outside your immediate area?", a:"Reach out with your location during consultation and we will confirm whether your site is within our service area."}
        ]) +
      '</div>' +
    '</div>' +
  '</section>' +

  '<section class="section on-navy corner-frame">' +
    '<div class="container" style="text-align:center;">' +
      '<div class="eyebrow on-dark" style="justify-content:center;">Let\'s Talk</div>' +
      '<h2 style="margin-top:12px;font-size:clamp(1.6rem,3.4vw,2.4rem);">Let\'s design your solar solution.</h2>' +
      '<div class="chip-row" style="justify-content:center;margin-top:26px;">' +
        AUDIENCES.map(function(a){return '<a class="chip" style="background:transparent;border-color:#3A4A63;color:#fff;" href="/solutions/'+a.slug+'/">'+a.label+'</a>';}).join('') +
      '</div>' +
      '<div style="margin-top:28px;"><a class="btn btn-wa" data-wa="Hi RayGrid, I would like to design a solar solution for my property." target="_blank" rel="noopener">'+icon('phone')+' Start WhatsApp Consultation</a></div>' +
    '</div>' +
  '</section>';
}

function siteDesignCard(title, steps){
  return '<div class="card reveal" style="background:var(--navy-2);border-color:#23324A;">' +
    '<h3 style="color:#fff;">'+title+'</h3>' +
    '<ul style="margin-top:14px;display:flex;flex-direction:column;gap:8px;">' +
      steps.map(function(s,i){return '<li style="font-size:0.86rem;color:#AEB7C4;display:flex;gap:8px;align-items:center;"><span style="font-family:var(--font-mono);color:var(--yellow);font-size:0.72rem;">'+(i+1)+'</span>'+s+'</li>';}).join('') +
    '</ul>' +
  '</div>';
}
function solutionMiniCard(iconName,title,d,href){
  return '<a class="card reveal" href="'+href+'"><div class="icon-wrap">'+icon(iconName)+'</div><h3>'+title+'</h3><p>'+d+'</p><span class="card-link">Explore '+icon('arrow')+'</span></a>';
}
function projectCard(p){
  const thumb = p.image
    ? '<div class="project-thumb" style="background:#101820;"><img src="'+p.image+'" alt="'+p.title+'" style="width:100%;height:100%;object-fit:cover;"></div>'
    : '<div class="project-thumb">'+projectSchematic()+'<span>PLACEHOLDER</span></div>';
  return '<div class="project-card reveal">' + thumb +
    '<div class="project-body"><span class="tag">'+p.category+'</span><h3>'+p.title+'</h3><p>'+(p.description||'')+'</p></div></div>';
}
function brandTilesHTML(){
  if(!CONFIG.brands || !CONFIG.brands.length){
    return '<div class="placeholder-tile">BRAND<br>PENDING</div>'.repeat(4);
  }
  return CONFIG.brands.map(function(b){
    return b.logo
      ? '<div class="placeholder-tile" style="border-style:solid;padding:10px;"><img src="'+b.logo+'" alt="'+b.name+'" style="max-height:38px;max-width:100%;object-fit:contain;"></div>'
      : '<div class="placeholder-tile" style="border-style:solid;">'+b.name+'</div>';
  }).join('');
}
function knowledgeTile(kind,title){
  return '<div class="knowledge-tile reveal"><div class="knowledge-thumb">'+icon('play')+'</div>' +
    '<div class="knowledge-body"><span>'+kind.toUpperCase()+' — COMING SOON</span><h4>'+title+'</h4></div></div>';
}

function heroSchematicSVG(){
  return '<svg viewBox="0 0 460 320" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Illustrative rooftop array schematic">' +
    '<rect x="18" y="18" width="424" height="284" fill="none" class="bp-line"/>' +
    '<path d="M40 260 L120 90 L340 90 L420 260 Z" class="bp-solid draw"/>' +
    generatePanels(150,110,150,90,4,3) +
    '<line x1="40" y1="260" x2="420" y2="260" class="bp-line"/>' +
    '<path d="M120 90 L120 40" class="bp-mark"/><circle cx="120" cy="40" r="3" fill="#F5A623"/>' +
    '<path d="M340 90 L340 40" class="bp-mark"/><circle cx="340" cy="40" r="3" fill="#F5A623"/>' +
    '</svg>';
}
function generatePanels(x,y,w,h,cols,rows){
  var out='';
  var cw=w/cols, ch=h/rows;
  for(var r=0;r<rows;r++){
    for(var c=0;c<cols;c++){
      out += '<rect x="'+(x+c*cw+2)+'" y="'+(y+r*ch+2)+'" width="'+(cw-4)+'" height="'+(ch-4)+'" class="bp-panel"/>';
    }
  }
  return out;
}
function projectSchematic(){
  return '<svg viewBox="0 0 100 60" width="70" style="opacity:0.35;position:absolute;">' +
    '<rect x="10" y="10" width="80" height="40" fill="none" stroke="#8992A0" stroke-width="1" stroke-dasharray="3 3"/>' +
    '</svg>';
}

/* ============================================================
   PAGE: SOLUTIONS OVERVIEW
   ============================================================ */
function pageSolutions(){
  return pageHeroBlock("compass", "Solutions", "Solar &amp; energy solutions, by application", "We design around what you are powering — not a fixed product package. Explore each application below.", [["Home","/"],["Solutions",null]]) +
  '<section class="section">' +
    '<div class="container">' +
      '<div class="grid grid-3">' + SOLUTIONS.map(function(s){
        return '<a class="card reveal" href="/solutions/'+s.slug+'/"><div class="icon-wrap">'+icon(s.icon)+'</div>'+
          '<h3>'+s.name+'</h3><p>'+s.short+'</p><span class="card-link">Explore '+icon('arrow')+'</span></a>';
      }).join('') + '</div>' +
    '</div>' +
  '</section>';
}

/* ============================================================
   PAGE: SOLUTION DETAIL
   ============================================================ */
function pageSolutionDetail(slug){
  const s = SOLUTIONS.find(function(x){return x.slug===slug;});
  if(!s) return page404();
  return pageHeroBlock(s.icon, s.name, "Solutions", s.short, [["Home","/"],["Solutions","/solutions/"],[s.name,null]]) +
  '<section class="section">' +
    '<div class="container two-col">' +
      '<div>' +
        '<div class="reveal"><div class="eyebrow">The Challenge</div><p style="margin-top:12px;font-size:1.05rem;color:var(--ink);">'+s.problem+'</p></div>' +
        '<div class="reveal" style="margin-top:32px;"><div class="eyebrow">Where This Applies</div><p style="margin-top:12px;color:var(--muted);">'+s.application+'</p></div>' +
        '<div class="reveal" style="margin-top:32px;"><div class="eyebrow">How RayGrid Designs This</div>' +
          '<ul class="check-list" style="margin-top:14px;">' + s.approach.map(function(a){return '<li>'+icon('check')+'<span>'+a+'</span></li>';}).join('') + '</ul>' +
        '</div>' +
        '<div class="reveal" style="margin-top:32px;"><div class="eyebrow">Typical Equipment Categories</div>' +
          '<div class="chip-row" style="margin-top:14px;">' + equipTagsFor(s.equipment) + '</div>' +
        '</div>' +
        '<div class="reveal" style="margin-top:40px;"><div class="eyebrow">Our Process</div><div style="margin-top:16px;background:var(--navy);border-radius:var(--radius-lg);padding:28px;">'+processRailHTML()+'</div></div>' +
        '<div class="reveal" style="margin-top:40px;"><div class="eyebrow">Frequently Asked</div><div style="margin-top:10px;">'+faqHTML(s.faq)+'</div></div>' +
      '</div>' +
      '<div>' + ctaBlock("Ready to design your "+s.name.toLowerCase()+"?", "Start a short consultation and we will follow up with next steps for a site assessment.", "Hi RayGrid, I am interested in "+s.name+". Could you tell me more?") + '</div>' +
    '</div>' +
  '</section>';
}

/* ============================================================
   PAGE: SERVICES
   ============================================================ */
function pageServices(){
  return pageHeroBlock("wrench","Services", "Consultation to long-term support", "RayGrid's service lifecycle covers every stage of a project — from first conversation to ongoing maintenance.", [["Home","/"],["Services",null]]) +
  '<section class="section">' +
    '<div class="container">' +
      '<div class="stack" style="gap:20px;">' + SERVICES.map(function(sv,i){
        return '<div class="card reveal" style="display:grid;grid-template-columns:auto 1fr auto;gap:22px;align-items:center;">' +
          '<div class="icon-wrap" style="margin:0;">'+icon(sv.icon)+'</div>' +
          '<div><h3>'+sv.name+'</h3><p>'+sv.d+'</p>' +
            '<ul style="margin-top:12px;display:flex;flex-wrap:wrap;gap:8px;">' + sv.bullets.map(function(b){return '<li class="tag">'+b+'</li>';}).join('') + '</ul>' +
          '</div>' +
          '<a class="btn btn-ghost btn-sm" data-wa="Hi RayGrid, I would like to ask about: '+sv.name+'." target="_blank" rel="noopener">Ask an Expert</a>' +
        '</div>';
      }).join('') + '</div>' +
    '</div>' +
  '</section>' +
  '<section class="section on-off">' +
    '<div class="container" style="text-align:center;">' +
      '<h2>Not sure which service you need?</h2>' +
      '<p class="muted" style="margin-top:10px;max-width:520px;margin-left:auto;margin-right:auto;">Start with a consultation — we will identify the right starting point for your project.</p>' +
      '<div style="margin-top:24px;"><a class="btn btn-primary" href="/consultation/">Start a Consultation '+icon('arrow')+'</a></div>' +
    '</div>' +
  '</section>';
}

/* ============================================================
   PAGE: EQUIPMENT
   ============================================================ */
function pageEquipment(){
  return pageHeroBlock("bolt","Equipment & Technologies", "Sourced to your design, not sold off a shelf", "Equipment here demonstrates sourcing capability and technical range. Every item is matched to a project's design — this page is not a shop.", [["Home","/"],["Equipment",null]]) +
  '<section class="section">' +
    '<div class="container">' +
      '<div class="grid grid-3" id="equipGrid">' + EQUIPMENT.map(function(e){
        return '<div class="equip-card reveal" id="eq-'+e.key+'" data-eq-card>' +
          '<div class="top"><div class="icon-wrap">'+icon(e.icon)+'</div></div>' +
          '<h3>'+e.name+'</h3><p>'+e.d+'</p>' +
          '<div class="equip-tags">' + e.uses.map(function(u){return '<span class="tag">'+u+'</span>';}).join('') + '</div>' +
          '<div class="equip-detail" data-eq-detail><div class="equip-detail-inner">'+e.detail+'</div></div>' +
          '<div class="actions">' +
            '<button class="btn btn-outline btn-sm" data-eq-toggle>Explore</button>' +
            '<a class="btn btn-ghost btn-sm" data-wa="Hi RayGrid, I would like to ask an expert about: '+e.name+'." target="_blank" rel="noopener">Ask an Expert</a>' +
          '</div>' +
        '</div>';
      }).join('') + '</div>' +
    '</div>' +
  '</section>' +
  '<section class="section on-off">' +
    '<div class="container" style="text-align:center;">' +
      '<h2>Looking for a complete system, not a single item?</h2>' +
      '<p class="muted" style="margin-top:10px;">Equipment is selected as part of a full design — start with a consultation instead.</p>' +
      '<div style="margin-top:24px;"><a class="btn btn-primary" href="/consultation/">Start a Consultation '+icon('arrow')+'</a></div>' +
    '</div>' +
  '</section>';
}

/* ============================================================
   PAGE: PROJECTS
   ============================================================ */
function pageProjects(){
  return pageHeroBlock("eye","Projects", "Completed work — coming soon", "This gallery will show RayGrid's completed installations once photography and project details are supplied.", [["Home","/"],["Projects",null]]) +
  '<section class="section">' +
    '<div class="container">' +
      '<div class="notice reveal" style="margin-bottom:32px;">' + icon('shield') +
        '<span>The project cards below are placeholders showing how completed work will be presented. No imagery here represents a real RayGrid project.</span>' +
      '</div>' +
      '<div class="grid grid-3">' + PROJECTS.map(projectCard).join('') + '</div>' +
    '</div>' +
  '</section>' +
  '<section class="section on-navy corner-frame">' +
    '<div class="container" style="text-align:center;">' +
      '<h2>Want a similar solution for your property?</h2>' +
      '<div style="margin-top:24px;"><a class="btn btn-primary" href="/consultation/">Start a Consultation '+icon('arrow')+'</a></div>' +
    '</div>' +
  '</section>';
}

/* ============================================================
   PAGE: LOCATIONS (hub + detail)
   ============================================================ */
function pageLocations(){
  return pageHeroBlock("pin","Where We Work", "Service Areas", "RayGrid serves clients across Uganda, with dedicated local focus in Kampala and Mukono. Don't see your area listed — reach out anyway, we cover a wider radius.", [["Home","/"],["Locations",null]]) +
  '<section class="section">' +
    '<div class="container">' +
      '<div class="grid grid-3">' + LOCATIONS.map(function(loc){
        return '<a class="card reveal" href="/locations/'+loc.slug+'/"><div class="icon-wrap">'+icon('pin')+'</div>'+
          '<h3>'+loc.name+'</h3><p>'+loc.short+'</p><span class="card-link">Explore '+icon('arrow')+'</span></a>';
      }).join('') + '</div>' +
    '</div>' +
  '</section>' +
  '<section class="section on-navy corner-frame">' +
    '<div class="container" style="text-align:center;">' +
      '<h2>Not sure if we cover your area?</h2>' +
      '<div style="margin-top:24px;"><a class="btn btn-primary" href="/consultation/">Start a Consultation '+icon('arrow')+'</a></div>' +
    '</div>' +
  '</section>';
}

function pageLocationDetail(slug){
  const loc = LOCATIONS.find(function(x){return x.slug===slug;});
  if(!loc) return page404();
  return pageHeroBlock("pin", "Solar & Energy Solutions in "+loc.name, "Service Area", loc.short, [["Home","/"],["Locations","/locations/"],[loc.name,null]]) +
  '<section class="section">' +
    '<div class="container two-col">' +
      '<div>' +
        '<div class="reveal"><div class="eyebrow">Local Context</div><p style="margin-top:12px;font-size:1.05rem;color:var(--ink);">'+loc.context+'</p></div>' +
        '<div class="reveal" style="margin-top:32px;"><div class="eyebrow">What We Help With in '+loc.name+'</div>' +
          '<div class="chip-row" style="margin-top:14px;">' + equipTagsForSolutions(loc.focusSolutions) + '</div>' +
        '</div>' +
        '<div class="reveal" style="margin-top:40px;"><div class="eyebrow">Our Process</div><div style="margin-top:16px;background:var(--navy);border-radius:var(--radius-lg);padding:28px;">'+processRailHTML()+'</div></div>' +
        (loc.faq && loc.faq.length ? '<div class="reveal" style="margin-top:40px;"><div class="eyebrow">Frequently Asked</div><div style="margin-top:10px;">'+faqHTML(loc.faq)+'</div></div>' : '') +
      '</div>' +
      '<div>' + ctaBlock("Ready to design your solution in "+loc.name+"?", "Start a short consultation and we will follow up with next steps for a site assessment.", "Hi RayGrid, I'm in "+loc.name+" and would like a solar consultation.") + '</div>' +
    '</div>' +
  '</section>';
}
function equipTagsForSolutions(slugs){
  if(!slugs) return '';
  return slugs.map(function(s){
    const sol = SOLUTIONS.find(function(x){return x.slug===s;});
    return sol ? '<a class="chip" href="/solutions/'+s+'/">'+sol.name+'</a>' : '';
  }).join('');
}

/* ============================================================
   PAGE: ABOUT
   ============================================================ */
function pageAbout(){
  return pageHeroBlock("compass","About RayGrid", "Design. Install. Support.", "RayGrid is a solar and energy solutions company — a consultant, designer, installer and equipment expert, not a retail shop.", [["Home","/"],["About",null]]) +
  '<section class="section">' +
    '<div class="container two-col">' +
      '<div>' +
        '<div class="reveal"><div class="eyebrow">Who We Are</div>' +
          '<p style="margin-top:14px;font-size:1.05rem;">RayGrid designs solar and energy systems around the customer\'s property, energy requirement, application and budget. We work across residential, commercial, agriculture, institutional, healthcare and hospitality projects, following the same consult-to-support process on every job.</p>' +
        '</div>' +
        '<div class="reveal" style="margin-top:32px;"><div class="eyebrow">Our Service Promise</div><div style="margin-top:16px;">'+processRailOnLight()+'</div></div>' +
        '<div class="reveal" style="margin-top:36px;"><div class="eyebrow">Our Technical Approach</div>' +
          '<ul class="check-list" style="margin-top:14px;">' +
            '<li>'+icon('check')+'<span>Site-specific design, not templated packages</span></li>' +
            '<li>'+icon('check')+'<span>Equipment selection matched to design, application and budget</span></li>' +
            '<li>'+icon('check')+'<span>Professional installation and commissioning by our technical team</span></li>' +
            '<li>'+icon('check')+'<span>Ongoing maintenance, troubleshooting and upgrade support</span></li>' +
          '</ul>' +
        '</div>' +
        '<div class="reveal" style="margin-top:36px;"><div class="eyebrow">Our Values</div>' +
          '<div class="grid grid-2" style="margin-top:14px;">' +
            valueCard("Transparency","Clear scope, clear process — no invented figures or unverified claims.") +
            valueCard("Technical Rigor","Every design is grounded in an actual site assessment.") +
            valueCard("Local Context","Solutions built for the realities of the properties and sites we serve.") +
            valueCard("Long-Term Support","We stay engaged after installation, not just through the sale.") +
          '</div>' +
        '</div>' +
        '<div class="notice reveal" style="margin-top:36px;">'+icon('shield')+'<span>Team photographs and a people-led profile will be added once RayGrid supplies them.</span></div>' +
      '</div>' +
      '<div>' + ctaBlock("Have a project in mind?", "Tell us about your property and energy needs — we will guide you to the right next step.", "Hi RayGrid, I would like to learn more about your company and process.") + '</div>' +
    '</div>' +
  '</section>';
}
function valueCard(t,d){
  return '<div class="card"><h3 style="font-size:1rem;">'+t+'</h3><p>'+d+'</p></div>';
}
function processRailOnLight(){
  return '<div style="background:var(--navy);border-radius:var(--radius-lg);padding:26px;">'+processRailHTML()+'</div>';
}

/* ============================================================
   PAGE: 404
   ============================================================ */
function page404(){
  return '<section class="section"><div class="container" style="text-align:center;padding:60px 0;">' +
    '<div class="eyebrow" style="justify-content:center;">404</div>' +
    '<h1 style="margin-top:14px;">Page not found</h1>' +
    '<p class="muted" style="margin-top:12px;">The page you\'re looking for doesn\'t exist.</p>' +
    '<div style="margin-top:24px;"><a class="btn btn-primary" href="/">Back to Home</a></div>' +
  '</div></section>';
}

/* ============================================================
   SHARED: page hero block + breadcrumb
   ============================================================ */
function pageHeroBlock(iconName, title, kicker, lead, crumbs){
  return '<div class="page-hero">' +
    '<div class="container">' +
      '<div class="breadcrumb">' + crumbs.map(function(c,i){
        var sep = i>0 ? icon('arrow',"") : '';
        var content = c[1] ? '<a href="'+c[1]+'">'+c[0]+'</a>' : '<span>'+c[0]+'</span>';
        return (i>0?' / ':'') + content;
      }).join('') + '</div>' +
      '<div class="eyebrow" style="margin-top:16px;">'+kicker+'</div>' +
      '<h1>'+title+'</h1>' +
      '<p class="lead">'+lead+'</p>' +
    '</div>' +
  '</div>';
}

/* ============================================================
   PAGE: CONSULTATION FUNNEL
   ============================================================ */

const NEED_OPTIONS = [
  {v:"Home", icon:"home"}, {v:"Business", icon:"building"}, {v:"Farm / Agriculture", icon:"tractor"},
  {v:"Institution", icon:"school"}, {v:"Water Pumping", icon:"droplet"}, {v:"Other", icon:"compass"}
];
const POWER_OPTIONS = [
  {v:"Lights", icon:"bulb"}, {v:"Refrigeration", icon:"battery"}, {v:"TV & Electronics", icon:"bolt"},
  {v:"Wi-Fi & Devices", icon:"wrench"}, {v:"Air Conditioning", icon:"gear"}, {v:"Water Pump", icon:"droplet"},
  {v:"Machinery / Equipment", icon:"truck"}, {v:"Entire Property", icon:"home"}, {v:"Not sure yet", icon:"compass"}
];

function pageConsultation(){
  return pageHeroBlock("phone","Start a Consultation","Consultation","A few quick questions help us prepare before we connect — then we open WhatsApp with your details pre-filled.", [["Home","/"],["Consultation",null]]) +
  '<section class="section">' +
    '<div class="container funnel-wrap">' +
      '<div class="progress" id="funnelProgress">' +
        [1,2,3,4,5,6].map(function(i){return '<i data-step="'+i+'" class="'+(i===1?'filled':'')+'"></i>';}).join('') +
      '</div>' +

      '<div class="funnel-step active" data-step="1">' +
        '<div class="step-label">Step 1 of 6</div><h2>What do you need solar for?</h2>' +
        '<div class="option-grid">' + NEED_OPTIONS.map(function(o){
          return '<button class="option-btn" data-need="'+o.v+'"><span class="icon-wrap">'+icon(o.icon)+'</span><span>'+o.v+'</span></button>';
        }).join('') + '</div>' +
      '</div>' +

      '<div class="funnel-step" data-step="2">' +
        '<div class="step-label">Step 2 of 6</div><h2>What do you want to power?</h2>' +
        '<p class="hint">Select all that apply.</p>' +
        '<div class="option-grid">' + POWER_OPTIONS.map(function(o){
          return '<button class="option-btn" data-power="'+o.v+'"><span class="icon-wrap">'+icon(o.icon)+'</span><span>'+o.v+'</span></button>';
        }).join('') + '</div>' +
      '</div>' +

      '<div class="funnel-step" data-step="3">' +
        '<div class="step-label">Step 3 of 6</div><h2>Where is your site located?</h2>' +
        '<div class="field"><label for="locInput">Location (town / area)</label>' +
          '<input type="text" id="locInput" placeholder="e.g. your city or district">' +
          '<p class="hint">This helps us confirm whether your site is within our service area.</p>' +
        '</div>' +
      '</div>' +

      '<div class="funnel-step" data-step="4">' +
        '<div class="step-label">Step 4 of 6</div><h2>Monthly bill or current energy challenge</h2>' +
        '<div class="field"><label for="billInput">Approximate monthly electricity bill, or describe your energy challenge</label>' +
          '<input type="text" id="billInput" placeholder="e.g. approximate bill amount, or \'frequent outages\'">' +
        '</div>' +
      '</div>' +

      '<div class="funnel-step" data-step="5">' +
        '<div class="step-label">Step 5 of 6 — Optional</div><h2>Have an electricity bill to share?</h2>' +
        '<div class="upload-box">' + icon('upload') +
          '<p>Select a file to remember it — you\'ll attach it directly in WhatsApp, since files can\'t be pre-attached to a WhatsApp link.</p>' +
          '<input type="file" id="billFile" accept="image/*,.pdf">' +
          '<p class="hint" id="fileNameHint"></p>' +
        '</div>' +
      '</div>' +

      '<div class="funnel-step" data-step="6">' +
        '<div class="step-label">Step 6 of 6</div><h2>Review &amp; connect</h2>' +
        '<div class="summary-box" id="summaryBox"></div>' +
        '<a class="btn btn-wa btn-block" style="margin-top:22px;" id="funnelWaBtn" target="_blank" rel="noopener">'+icon('phone')+' Open WhatsApp with My Details</a>' +
        '<p class="hint" style="text-align:center;margin-top:12px;">Prefer another way? Call '+CONFIG.phoneDisplay+' or email '+CONFIG.email+' (placeholders — update in config).</p>' +
      '</div>' +

      '<div class="funnel-nav">' +
        '<button class="btn btn-outline btn-sm" id="funnelBack" style="visibility:hidden;">Back</button>' +
        '<button class="btn btn-primary btn-sm" id="funnelNext">Continue '+icon('arrow')+'</button>' +
      '</div>' +
    '</div>' +
  '</section>';
}


/* ============================================================
   SHARED HEADER / FOOTER (build-time, with active-nav baked in)
   ============================================================ */
function renderHeader(activePath){
  let html = "<header class=\"site\">\n  <div class=\"container header-inner\">\n    <a href=\"/\" class=\"brand\" aria-label=\"RayGrid home\">\n      <img class=\"brand-mark\" src=\"/images/raygrid-emblem.png\" alt=\"RayGrid emblem\" width=\"34\" height=\"34\">\n      <span>\n        <span class=\"brand-word\"><span class=\"sun\">RAY</span> <span class=\"power\">GRID</span></span>\n        <span class=\"brand-sub\">Solar &amp; Energy Solutions</span>\n      </span>\n    </a>\n\n    <nav class=\"primary\" id=\"primaryNav\" aria-label=\"Primary\">\n      <a href=\"/\" data-path=\"/\">Home</a>\n      <a href=\"/solutions/\" data-path=\"/solutions\">Solutions</a>\n      <a href=\"/services/\" data-path=\"/services\">Services</a>\n      <a href=\"/equipment/\" data-path=\"/equipment\">Equipment</a>\n      <a href=\"/projects/\" data-path=\"/projects\">Projects</a>\n      <a href=\"/about/\" data-path=\"/about\">About</a>\n      <a href=\"/consultation/\" data-path=\"/consultation\">Consultation</a>\n    </nav>\n\n    <div class=\"header-actions\">\n      <a class=\"btn btn-outline btn-sm\" href=\"/consultation/\">Request Assessment</a>\n      <a class=\"btn btn-wa btn-sm\" id=\"headerWaBtn\" target=\"_blank\" rel=\"noopener\">\n        <svg viewBox=\"0 0 24 24\" fill=\"currentColor\"><path d=\"M17.5 14.4c-.3-.2-1.7-.9-2-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-.3-.2-1.3-.5-2.5-1.6-.9-.8-1.5-1.9-1.7-2.2-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.1.2-.3.3-.5.1-.2 0-.4 0-.5-.1-.2-.7-1.7-1-2.3-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4s1.1 2.9 1.2 3.1c.1.2 2.2 3.4 5.4 4.7.8.3 1.4.5 1.8.6.8.3 1.5.2 2-.1.6-.4 1.9-1.2 2.1-1.8.2-.5.2-.9.1-1-.1-.1-.3-.2-.6-.3z\"/><path d=\"M12 2C6.5 2 2 6.5 2 12c0 1.8.5 3.5 1.3 5L2 22l5.2-1.4c1.4.8 3.1 1.2 4.8 1.2 5.5 0 10-4.5 10-10S17.5 2 12 2zm0 18.2c-1.6 0-3.1-.4-4.4-1.2l-.3-.2-3.1.8.8-3-.2-.3C4 14.9 3.5 13.5 3.5 12c0-4.7 3.8-8.5 8.5-8.5s8.5 3.8 8.5 8.5-3.8 8.5-8.5 8.5z\"/></svg>\n        WhatsApp Us\n      </a>\n      <button class=\"menu-toggle\" id=\"menuToggle\" aria-label=\"Toggle menu\" aria-expanded=\"false\">\n        <svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\"><path d=\"M3 6h18M3 12h18M3 18h18\"/></svg>\n      </button>\n    </div>\n  </div>\n  <div class=\"mobile-menu\" id=\"mobileMenu\">\n    <a href=\"/\" data-path=\"/\">Home</a>\n    <a href=\"/solutions/\" data-path=\"/solutions\">Solutions</a>\n    <a href=\"/services/\" data-path=\"/services\">Services</a>\n    <a href=\"/equipment/\" data-path=\"/equipment\">Equipment</a>\n    <a href=\"/projects/\" data-path=\"/projects\">Projects</a>\n    <a href=\"/about/\" data-path=\"/about\">About</a>\n    <a href=\"/consultation/\" data-path=\"/consultation\">Consultation</a>\n  </div>\n</header>";
  const navPaths = ["/", "/solutions/", "/services/", "/equipment/", "/projects/", "/about/", "/consultation/"];
  navPaths.forEach(function(p){
    const isActive = (p === "/") ? (activePath === "/") : activePath.indexOf(p) === 0;
    if(isActive){
      const re = new RegExp('(href="' + p.replace(/\//g,'\\/') + '"[^>]*)>', 'g');
      html = html.replace(re, '$1 class="active">');
    }
  });
  return html;
}

function renderFooter(){
  let html = "<footer class=\"site\">\n  <div class=\"container\">\n    <div class=\"footer-grid\">\n      <div class=\"footer-brand\">\n        <span class=\"brand-word\"><span style=\"color:#fff\">RAY</span> <span class=\"power\">GRID</span></span>\n        <p>We design, source, install and support complete solar and energy systems for homes, businesses, farms and institutions \u2014 around your property, your requirement and your budget.</p>\n        <div class=\"op-line\" style=\"margin-top:16px;\">\n          <span>DESIGN</span><span class=\"dot\"></span><span>INSTALL</span><span class=\"dot\"></span><span>SUPPORT</span>\n        </div>\n      </div>\n      <div>\n        <h4>Solutions</h4>\n        <ul id=\"footerSolutions\"></ul>\n      </div>\n      <div>\n        <h4>Company</h4>\n        <ul>\n          <li><a href=\"/services/\">Services</a></li>\n          <li><a href=\"/equipment/\">Equipment</a></li>\n          <li><a href=\"/projects/\">Projects</a></li>\n          <li><a href=\"/locations/\">Service Areas</a></li>\n          <li><a href=\"/about/\">About</a></li>\n          <li><a href=\"/consultation/\">Consultation</a></li>\n        </ul>\n      </div>\n      <div>\n        <h4>Contact</h4>\n        <div class=\"contact-line\">\n          <svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\"><path d=\"M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.7a2 2 0 0 1-.5 2.1L8 9.7a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.5 2.7.6a2 2 0 0 1 1.7 2.1z\"/></svg>\n          <span>Phone<br><em id=\"footerPhone\" style=\"color:#6B7A93;font-style:normal;\">+xxx xxx xxx xxx</em></span>\n        </div>\n        <div class=\"contact-line\">\n          <svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\"><path d=\"M4 4h16v16H4z\" opacity=\"0\"/><path d=\"M22 6 12 13 2 6\"/><path d=\"M2 6h20v12H2z\"/></svg>\n          <span>Email<br><em id=\"footerEmail\" style=\"color:#6B7A93;font-style:normal;\">info@sunpower.example</em></span>\n        </div>\n        <div class=\"contact-line\">\n          <svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\"><path d=\"M21 10c0 6-9 12-9 12s-9-6-9-12a9 9 0 0 1 18 0z\"/><circle cx=\"12\" cy=\"10\" r=\"3\"/></svg>\n          <span id=\"footerAddress\">Address to be supplied by RayGrid</span>\n        </div>\n        <a class=\"btn btn-wa btn-sm\" style=\"margin-top:6px;\" id=\"footerWaBtn\" target=\"_blank\" rel=\"noopener\">\n          <svg viewBox=\"0 0 24 24\" fill=\"currentColor\"><path d=\"M17.5 14.4c-.3-.2-1.7-.9-2-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-.3-.2-1.3-.5-2.5-1.6-.9-.8-1.5-1.9-1.7-2.2-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.1.2-.3.3-.5.1-.2 0-.4 0-.5-.1-.2-.7-1.7-1-2.3-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4s1.1 2.9 1.2 3.1c.1.2 2.2 3.4 5.4 4.7.8.3 1.4.5 1.8.6.8.3 1.5.2 2-.1.6-.4 1.9-1.2 2.1-1.8.2-.5.2-.9.1-1-.1-.1-.3-.2-.6-.3z\"/><path d=\"M12 2C6.5 2 2 6.5 2 12c0 1.8.5 3.5 1.3 5L2 22l5.2-1.4c1.4.8 3.1 1.2 4.8 1.2 5.5 0 10-4.5 10-10S17.5 2 12 2zm0 18.2c-1.6 0-3.1-.4-4.4-1.2l-.3-.2-3.1.8.8-3-.2-.3C4 14.9 3.5 13.5 3.5 12c0-4.7 3.8-8.5 8.5-8.5s8.5 3.8 8.5 8.5-3.8 8.5-8.5 8.5z\"/></svg>\n          Chat on WhatsApp\n        </a>\n      </div>\n    </div>\n    <div class=\"footer-note\">\n      <span>\u00a9 2026 RayGrid Solar &amp; Energy Solutions. Prototype build \u2014 legal name, registration and social links pending.</span>\n      <span>Contact details shown are placeholders pending confirmation.</span>\n    </div>\n  </div>\n</footer>";
  const solutionLinks = SOLUTIONS.slice(0,6).map(function(s){
    return '<li><a href="/solutions/'+s.slug+'/">'+s.name+'</a></li>';
  }).join('') + '<li><a href="/solutions/">All Solutions</a></li>';
  html = html.replace('<ul id="footerSolutions"></ul>', '<ul id="footerSolutions">'+solutionLinks+'</ul>');
  html = html.replace('<em id="footerPhone" style="color:#6B7A93;font-style:normal;">+xxx xxx xxx xxx</em>',
    '<em id="footerPhone" style="color:#6B7A93;font-style:normal;">'+CONFIG.phoneDisplay+'</em>');
  html = html.replace('<em id="footerEmail" style="color:#6B7A93;font-style:normal;">info@sunpower.example</em>',
    '<em id="footerEmail" style="color:#6B7A93;font-style:normal;">'+CONFIG.email+'</em>');
  html = html.replace('<span id="footerAddress">Address to be supplied by RayGrid</span>',
    '<span id="footerAddress">'+CONFIG.address+'</span>');
  return html;
}

const WA_FLOAT_HTML = "<a class=\"wa-float\" id=\"floatWaBtn\" target=\"_blank\" rel=\"noopener\" aria-label=\"Chat on WhatsApp\">\n  <svg viewBox=\"0 0 24 24\" fill=\"currentColor\"><path d=\"M17.5 14.4c-.3-.2-1.7-.9-2-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-.3-.2-1.3-.5-2.5-1.6-.9-.8-1.5-1.9-1.7-2.2-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.1.2-.3.3-.5.1-.2 0-.4 0-.5-.1-.2-.7-1.7-1-2.3-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4s1.1 2.9 1.2 3.1c.1.2 2.2 3.4 5.4 4.7.8.3 1.4.5 1.8.6.8.3 1.5.2 2-.1.6-.4 1.9-1.2 2.1-1.8.2-.5.2-.9.1-1-.1-.1-.3-.2-.6-.3z\"/><path d=\"M12 2C6.5 2 2 6.5 2 12c0 1.8.5 3.5 1.3 5L2 22l5.2-1.4c1.4.8 3.1 1.2 4.8 1.2 5.5 0 10-4.5 10-10S17.5 2 12 2zm0 18.2c-1.6 0-3.1-.4-4.4-1.2l-.3-.2-3.1.8.8-3-.2-.3C4 14.9 3.5 13.5 3.5 12c0-4.7 3.8-8.5 8.5-8.5s8.5 3.8 8.5 8.5-3.8 8.5-8.5 8.5z\"/></svg>\n</a>";

/* ============================================================
   STRUCTURED DATA (JSON-LD)
   ============================================================ */
function localBusinessSchema(){
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "RayGrid Solar Energy",
    "description": "Solar and energy solutions provider — consultation, site assessment, design, sourcing, installation and support.",
    "url": SITE_URL,
    "telephone": CONFIG.phoneDisplay,
    "email": CONFIG.email,
    "address": CONFIG.address,
    "areaServed": LOCATIONS.map(function(l){ return l.name; }).concat(["Uganda"])
  };
}
function faqSchema(items){
  if(!items || !items.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": items.map(function(f){
      return {
        "@type": "Question",
        "name": f.q,
        "acceptedAnswer": { "@type": "Answer", "text": f.a }
      };
    })
  };
}
function breadcrumbSchema(crumbs){
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": crumbs.filter(c => c[1]).map(function(c, i){
      return { "@type": "ListItem", "position": i+1, "name": c[0], "item": SITE_URL + c[1] };
    })
  };
}

/* ============================================================
   PAGE WRAPPER — assembles a full standalone HTML document
   ============================================================ */
function wrapPage(opts){
  const jsonLdBlocks = [localBusinessSchema()].concat(opts.extraSchema || []).filter(Boolean)
    .map(s => '<script type="application/ld+json">'+JSON.stringify(s)+'</script>').join('\n');
  const canonical = SITE_URL + opts.path;
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${opts.title}</title>
<meta name="description" content="${opts.description}">
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" type="image/png" sizes="16x16" href="/images/favicon-16.png">
<link rel="icon" type="image/png" sizes="32x32" href="/images/favicon-32.png">
<link rel="icon" type="image/png" sizes="192x192" href="/images/favicon-192.png">
<link rel="apple-touch-icon" href="/images/apple-touch-icon.png">
<link rel="canonical" href="${canonical}">
<meta property="og:title" content="${opts.title}">
<meta property="og:description" content="${opts.description}">
<meta property="og:type" content="website">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${SITE_URL}/images/og-image.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${opts.title}">
<meta name="twitter:description" content="${opts.description}">
<meta name="twitter:image" content="${SITE_URL}/images/og-image.png">
<meta name="google-site-verification" content="tpz2CDfNZUbP7K2tj_OGSaANZ2J5ESAEqsDT2qkqC7Q" />
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">
${jsonLdBlocks}
<style>

/* ============================================================
   RAYGRID — DESIGN TOKENS
   Palette: white-dominant UI, deep navy authority, solar yellow
   primary accent, solar blue technical/schematic accent.
   WhatsApp green reserved strictly for WhatsApp CTAs.
   Signature visual language: site-survey / blueprint schematics
   (corner registration marks, dashed grid, mono spec labels) —
   standing in for photography until RayGrid supplies real
   project imagery.
   ============================================================ */
:root{
  --navy:#0B1420;
  --navy-2:#0F1E33;
  --ink:#101820;
  --muted:#5B6472;
  --muted-2:#8992A0;
  --line:#E3E7ED;
  --line-dark:#243247;
  --white:#FFFFFF;
  --off:#F6F7F9;
  --off-2:#EEF1F4;
  --yellow:#F5A623;
  --yellow-deep:#D98C0F;
  --yellow-soft:#FDECC8;
  --blue:#2E6FF2;
  --blue-deep:#123A66;
  --blue-soft:#E7EEFC;
  --whatsapp:#25D366;
  --whatsapp-dark:#1DA851;
  --radius:3px;
  --radius-lg:6px;
  --container:1220px;
  --font-display:'Space Grotesk',sans-serif;
  --font-body:'Inter',sans-serif;
  --font-mono:'IBM Plex Mono',monospace;
  --shadow-card: 0 1px 2px rgba(11,20,32,0.06), 0 8px 24px -12px rgba(11,20,32,0.12);
  --shadow-lift: 0 12px 32px -14px rgba(11,20,32,0.28);
}
*,*::before,*::after{box-sizing:border-box;}
html{scroll-behavior:smooth;}
@media (prefers-reduced-motion: reduce){
  html{scroll-behavior:auto;}
  *,*::before,*::after{animation-duration:0.01ms !important;animation-iteration-count:1 !important;transition-duration:0.01ms !important;scroll-behavior:auto !important;}
}
body{
  margin:0;
  font-family:var(--font-body);
  color:var(--ink);
  background:var(--white);
  -webkit-font-smoothing:antialiased;
  line-height:1.55;
}
h1,h2,h3,h4{
  font-family:var(--font-display);
  font-weight:600;
  color:var(--navy);
  line-height:1.12;
  margin:0;
  letter-spacing:-0.01em;
}
p{margin:0;}
a{color:inherit;text-decoration:none;}
img,svg{display:block;max-width:100%;}
button{font-family:inherit;cursor:pointer;}
ul{margin:0;padding:0;list-style:none;}
input,select,textarea{font-family:inherit;font-size:1rem;}

:focus-visible{outline:2.5px solid var(--blue);outline-offset:3px;}

.container{max-width:var(--container);margin:0 auto;padding:0 24px;}
@media (max-width:640px){.container{padding:0 18px;}}

.eyebrow{
  font-family:var(--font-mono);
  font-size:0.72rem;
  letter-spacing:0.14em;
  text-transform:uppercase;
  color:var(--blue-deep);
  display:inline-flex;
  align-items:center;
  gap:8px;
}
.eyebrow::before{content:"";width:16px;height:1.5px;background:var(--yellow);display:inline-block;}
.eyebrow.on-dark{color:var(--yellow-soft);}
.eyebrow.on-dark::before{background:var(--yellow);}

.section{padding:88px 0;}
.section.tight{padding:64px 0;}
@media (max-width:800px){.section{padding:60px 0;} .section.tight{padding:44px 0;}}
.section.on-off{background:var(--off);}
.section.on-navy{background:var(--navy);color:var(--white);}
.section.on-navy h2,.section.on-navy h3{color:var(--white);}
.section.on-navy .muted{color:#AEB7C4;}

.section-head{max-width:640px;margin-bottom:44px;}
.section-head h2{font-size:clamp(1.55rem,3vw,2.15rem);margin-top:10px;}
.section-head p{margin-top:14px;color:var(--muted);font-size:1.02rem;}
.on-navy .section-head p{color:#AEB7C4;}

.muted{color:var(--muted);}

/* ---------- Buttons ---------- */
.btn{
  display:inline-flex;align-items:center;justify-content:center;gap:8px;
  font-family:var(--font-body);font-weight:600;font-size:0.94rem;
  padding:13px 22px;border-radius:var(--radius);border:1.5px solid transparent;
  transition:transform .15s ease, background-color .15s ease, border-color .15s ease, box-shadow .15s ease;
  white-space:nowrap;
}
.btn:active{transform:translateY(1px);}
.btn-primary{background:var(--yellow);color:var(--navy);border-color:var(--yellow);}
.btn-primary:hover{background:var(--yellow-deep);border-color:var(--yellow-deep);}
.btn-outline{background:transparent;color:var(--navy);border-color:var(--navy);}
.btn-outline:hover{background:var(--navy);color:var(--white);}
.btn-outline.on-navy{color:var(--white);border-color:#3A4A63;}
.btn-outline.on-navy:hover{background:var(--white);color:var(--navy);border-color:var(--white);}
.btn-ghost{background:transparent;color:var(--blue-deep);border-color:var(--line);}
.btn-ghost:hover{border-color:var(--blue);background:var(--blue-soft);}
.btn-wa{background:var(--whatsapp);color:var(--white);border-color:var(--whatsapp);}
.btn-wa:hover{background:var(--whatsapp-dark);border-color:var(--whatsapp-dark);}
.btn-sm{padding:11px 18px;font-size:0.85rem;}
.btn-block{width:100%;}
.btn svg{width:17px;height:17px;flex:none;}

/* ---------- Header ---------- */
.skip-link{position:absolute;left:-999px;top:0;background:var(--navy);color:#fff;padding:10px 16px;z-index:999;border-radius:0 0 4px 0;}
.skip-link:focus{left:0;}
header.site{
  position:sticky;top:0;z-index:80;background:rgba(255,255,255,0.92);backdrop-filter:blur(10px);
  border-bottom:1px solid var(--line);
}
.header-inner{display:flex;align-items:center;justify-content:space-between;height:72px;gap:20px;}
.brand{display:flex;align-items:center;gap:10px;}
.brand-mark{width:34px;height:34px;flex:none;}
.brand-word{font-family:var(--font-display);font-weight:700;font-size:1.18rem;letter-spacing:-0.01em;line-height:1;}
.brand-word .sun{color:var(--navy);}
.brand-word .power{color:var(--yellow-deep);}
.brand-sub{display:block;font-family:var(--font-mono);font-size:0.58rem;letter-spacing:0.12em;color:var(--muted);margin-top:2px;text-transform:uppercase;}

nav.primary{display:flex;align-items:center;gap:2px;}
nav.primary a{
  padding:10px 14px;font-size:0.92rem;font-weight:500;color:var(--ink);border-radius:var(--radius);
  transition:color .15s ease, background .15s ease;
}
nav.primary a:hover{color:var(--blue-deep);background:var(--off);}
nav.primary a.active{color:var(--blue-deep);font-weight:600;}
.header-actions{display:flex;align-items:center;gap:10px;}
.menu-toggle{display:none;background:none;border:none;padding:8px;}
.menu-toggle svg{width:24px;height:24px;color:var(--navy);}

@media (max-width:980px){
  nav.primary{display:none;}
  .header-actions .btn-outline{display:none;}
  .header-actions .btn-wa{display:none;} /* floating WhatsApp button covers this on mobile — avoids header crowding */
  .menu-toggle{display:inline-flex;}
}
.mobile-menu{display:none;flex-direction:column;background:var(--white);border-bottom:1px solid var(--line);}
.mobile-menu.open{display:flex;}
.mobile-menu a{padding:14px 24px;border-top:1px solid var(--line);font-weight:500;}
.mobile-menu a.active{color:var(--blue-deep);}

/* Floating WhatsApp (mobile) */
.wa-float{
  position:fixed;right:16px;bottom:16px;z-index:90;
  width:56px;height:56px;border-radius:50%;background:var(--whatsapp);
  display:flex;align-items:center;justify-content:center;box-shadow:var(--shadow-lift);
}
.wa-float svg{width:27px;height:27px;color:#fff;}
@media (min-width:981px){.wa-float{display:none;}}

/* ---------- Hero ---------- */
.hero{position:relative;background:var(--navy);color:var(--white);overflow:hidden;padding:64px 0 0;}
.hero-grid{
  position:absolute;inset:0;
  background-image:
    linear-gradient(rgba(46,111,242,0.12) 1px, transparent 1px),
    linear-gradient(90deg, rgba(46,111,242,0.12) 1px, transparent 1px);
  background-size:42px 42px;
  mask-image:linear-gradient(to bottom, rgba(0,0,0,0.9), transparent 85%);
  pointer-events:none;
}
.hero-inner{position:relative;display:grid;grid-template-columns:1.05fr 0.95fr;gap:40px;align-items:center;}
@media (max-width:940px){.hero-inner{grid-template-columns:1fr;}}
.hero-copy h1{font-size:clamp(2.1rem,4.6vw,3.4rem);color:#fff;margin-top:16px;}
.hero-copy p.lead{margin-top:18px;font-size:1.1rem;color:#C4CCD8;max-width:520px;}
.hero-ctas{display:flex;flex-wrap:wrap;gap:12px;margin-top:30px;}
.op-line{display:flex;gap:10px;align-items:center;margin-top:38px;font-family:var(--font-mono);font-size:0.76rem;letter-spacing:0.12em;color:#8FA1BE;}
.op-line b{color:var(--yellow);font-weight:500;}
.op-line .dot{width:4px;height:4px;background:#3A4A63;border-radius:50%;}

.hero-art{position:relative;}
.blueprint-panel{
  background:var(--navy-2);border:1px solid #23324A;border-radius:var(--radius-lg);
  padding:22px;position:relative;
}
.blueprint-panel svg{width:100%;height:auto;}
.blueprint-tag{
  position:absolute;font-family:var(--font-mono);font-size:0.62rem;letter-spacing:0.08em;
  color:#7C8CA8;background:rgba(15,30,51,0.85);padding:3px 7px;border:1px solid #23324A;border-radius:2px;
}
.bp-line{stroke:#3E6FD0;stroke-width:1.4;fill:none;stroke-dasharray:6 4;}
.bp-solid{stroke:#5E86DA;stroke-width:1.4;fill:none;}
.bp-panel{fill:#152845;stroke:#2E6FF2;stroke-width:1;}
.bp-panel-line{stroke:#0F1E33;stroke-width:0.6;}
.bp-mark{stroke:#F5A623;stroke-width:1.6;fill:none;}
.draw{stroke-dasharray:900;stroke-dashoffset:900;animation:draw 2.2s ease forwards .2s;}
@keyframes draw{to{stroke-dashoffset:0;}}
@media (prefers-reduced-motion: reduce){.draw{animation:none;stroke-dashoffset:0;}}

/* corner registration marks — signature motif */
.corner-frame{position:relative;}
.corner-frame::before{
  content:"";position:absolute;inset:0;pointer-events:none;
  background:
    linear-gradient(var(--blue) 2px, transparent 2px) top left / 14px 2px no-repeat,
    linear-gradient(var(--blue) 2px, transparent 2px) top right / 14px 2px no-repeat,
    linear-gradient(var(--blue) 2px, transparent 2px) bottom left / 14px 2px no-repeat,
    linear-gradient(var(--blue) 2px, transparent 2px) bottom right / 14px 2px no-repeat,
    linear-gradient(to bottom, var(--blue) 2px, transparent 2px) top left / 2px 14px no-repeat,
    linear-gradient(to bottom, var(--blue) 2px, transparent 2px) top right / 2px 14px no-repeat,
    linear-gradient(to bottom, var(--blue) 2px, transparent 2px) bottom left / 2px 14px no-repeat,
    linear-gradient(to bottom, var(--blue) 2px, transparent 2px) bottom right / 2px 14px no-repeat;
  opacity:0.55;
}
.corner-frame.on-light::before{opacity:0.9;}

/* ---------- Cards ---------- */
.grid{display:grid;gap:20px;}
.grid-2{grid-template-columns:repeat(2,1fr);}
.grid-3{grid-template-columns:repeat(3,1fr);}
.grid-4{grid-template-columns:repeat(4,1fr);}
@media (max-width:900px){.grid-4{grid-template-columns:repeat(2,1fr);} .grid-3{grid-template-columns:repeat(2,1fr);}}
@media (max-width:620px){.grid-4,.grid-3,.grid-2{grid-template-columns:1fr;}}

.card{
  background:var(--white);border:1px solid var(--line);border-radius:var(--radius-lg);
  padding:26px;transition:box-shadow .18s ease, transform .18s ease, border-color .18s ease;
}
.card:hover{box-shadow:var(--shadow-card);transform:translateY(-2px);border-color:#D6DCE5;}
.card .icon-wrap{
  width:44px;height:44px;border-radius:var(--radius);background:var(--blue-soft);
  display:flex;align-items:center;justify-content:center;color:var(--blue-deep);margin-bottom:16px;
}
.card .icon-wrap svg{width:22px;height:22px;}
.card h3{font-size:1.08rem;}
.card p{margin-top:8px;color:var(--muted);font-size:0.93rem;}
.card .card-link{
  margin-top:16px;display:inline-flex;align-items:center;gap:6px;font-weight:600;font-size:0.88rem;color:var(--blue-deep);
}
.card .card-link svg{width:15px;height:15px;transition:transform .15s ease;}
.card:hover .card-link svg{transform:translateX(3px);}

.audience-card{background:var(--white);border:1px solid var(--line);border-radius:var(--radius-lg);padding:0;overflow:hidden;display:flex;flex-direction:column;transition:box-shadow .18s ease, transform .18s ease;}
.audience-card:hover{box-shadow:var(--shadow-card);transform:translateY(-3px);}
.audience-card .band{height:6px;background:var(--yellow);}
.audience-card .body{padding:26px;flex:1;display:flex;flex-direction:column;}
.audience-card .icon-wrap{width:46px;height:46px;border-radius:50%;background:var(--navy);color:var(--yellow);display:flex;align-items:center;justify-content:center;margin-bottom:16px;}
.audience-card .icon-wrap svg{width:22px;height:22px;}
.audience-card h3{font-size:1.15rem;}
.audience-card p{margin-top:8px;color:var(--muted);font-size:0.92rem;flex:1;}
.audience-card .card-link{margin-top:18px;display:inline-flex;align-items:center;gap:6px;font-weight:600;font-size:0.88rem;color:var(--blue-deep);}
.audience-card .card-link svg{width:15px;height:15px;}

/* ---------- Process timeline ---------- */
.process-rail{display:grid;grid-template-columns:repeat(6,1fr);gap:14px;counter-reset:step;}
@media (max-width:900px){.process-rail{grid-template-columns:repeat(3,1fr);}}
@media (max-width:560px){.process-rail{grid-template-columns:1fr;}}
.process-step{border-left:2px solid var(--yellow);padding:4px 0 4px 16px;position:relative;}
@media (max-width:560px){.process-step{border-left:none;border-top:2px solid var(--yellow);padding:14px 0 0;}}
.process-step .num{font-family:var(--font-mono);font-size:0.72rem;color:var(--yellow);letter-spacing:0.08em;}
.process-step h4{margin-top:8px;font-size:1rem;color:var(--white);font-family:var(--font-display);}
.process-step p{margin-top:6px;color:#AEB7C4;font-size:0.86rem;}

/* ---------- Equipment ---------- */
.equip-card{border:1px solid var(--line);border-radius:var(--radius-lg);padding:24px;background:var(--white);}
.equip-card .top{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;}
.equip-card .icon-wrap{width:42px;height:42px;border-radius:var(--radius);background:var(--off);color:var(--navy);display:flex;align-items:center;justify-content:center;}
.equip-card .icon-wrap svg{width:21px;height:21px;}
.equip-card h3{font-size:1.05rem;margin-top:14px;}
.equip-card p{color:var(--muted);font-size:0.91rem;margin-top:8px;}
.equip-tags{display:flex;flex-wrap:wrap;gap:6px;margin-top:12px;}
.tag{font-family:var(--font-mono);font-size:0.68rem;letter-spacing:0.04em;color:var(--blue-deep);background:var(--blue-soft);padding:4px 8px;border-radius:2px;}
.equip-card .actions{display:flex;gap:10px;margin-top:18px;flex-wrap:wrap;}
.equip-detail{max-height:0;overflow:hidden;transition:max-height .3s ease;}
.equip-detail.open{max-height:280px;}
.equip-detail-inner{padding-top:14px;margin-top:14px;border-top:1px dashed var(--line);color:var(--muted);font-size:0.9rem;}

/* ---------- Placeholder tiles (brands / projects) ---------- */
.placeholder-tile{
  border:1.5px dashed #C9D0DA;border-radius:var(--radius);
  display:flex;align-items:center;justify-content:center;height:64px;
  font-family:var(--font-mono);font-size:0.68rem;color:var(--muted-2);letter-spacing:0.04em;text-align:center;padding:6px;
}
.project-card{border:1px solid var(--line);border-radius:var(--radius-lg);overflow:hidden;background:var(--white);}
.project-thumb{
  height:170px;background:
    repeating-linear-gradient(45deg, #EEF1F4 0px, #EEF1F4 10px, #F6F7F9 10px, #F6F7F9 20px);
  position:relative;display:flex;align-items:center;justify-content:center;
}
.project-thumb span{font-family:var(--font-mono);font-size:0.7rem;color:var(--muted-2);letter-spacing:0.06em;background:#fff;padding:5px 10px;border:1px solid var(--line);border-radius:2px;}
.project-body{padding:20px;}
.project-body .tag{margin-bottom:10px;display:inline-block;}
.project-body h3{font-size:1rem;}
.project-body p{margin-top:6px;color:var(--muted);font-size:0.88rem;}

/* ---------- FAQ accordion ---------- */
.faq-item{border-bottom:1px solid var(--line);}
.faq-q{
  width:100%;text-align:left;background:none;border:none;padding:18px 0;
  display:flex;align-items:center;justify-content:space-between;gap:16px;
  font-family:var(--font-display);font-weight:600;font-size:1rem;color:var(--navy);
}
.faq-q svg{width:18px;height:18px;flex:none;transition:transform .2s ease;color:var(--blue-deep);}
.faq-item.open .faq-q svg{transform:rotate(45deg);}
.faq-a{max-height:0;overflow:hidden;transition:max-height .25s ease;}
.faq-item.open .faq-a{max-height:400px;}
.faq-a-inner{padding-bottom:18px;color:var(--muted);font-size:0.95rem;max-width:70ch;}

/* ---------- Solution / detail pages ---------- */
.page-hero{background:var(--off);border-bottom:1px solid var(--line);padding:52px 0;}
.page-hero h1{font-size:clamp(1.7rem,3.4vw,2.5rem);margin-top:12px;max-width:800px;}
.page-hero p.lead{margin-top:14px;color:var(--muted);font-size:1.02rem;max-width:640px;}
.breadcrumb{font-family:var(--font-mono);font-size:0.72rem;color:var(--muted-2);letter-spacing:0.04em;display:flex;flex-wrap:wrap;gap:6px;align-items:center;row-gap:4px;}
.breadcrumb a:hover{color:var(--blue-deep);}

.two-col{display:grid;grid-template-columns:1.3fr 0.9fr;gap:48px;}
@media (max-width:900px){.two-col{grid-template-columns:1fr;}}
.stack{display:flex;flex-direction:column;gap:14px;}
.check-list li{display:flex;gap:10px;align-items:flex-start;padding:10px 0;border-bottom:1px solid var(--line);}
.check-list li:last-child{border-bottom:none;}
.check-list svg{width:18px;height:18px;color:var(--yellow-deep);flex:none;margin-top:2px;}
.check-list span{font-size:0.95rem;color:var(--ink);}

.side-card{background:var(--navy);color:#fff;border-radius:var(--radius-lg);padding:26px;}
.side-card h3{color:#fff;font-size:1.05rem;}
.side-card p{color:#AEB7C4;font-size:0.9rem;margin-top:10px;}
.side-card .btn{margin-top:18px;width:100%;}

.chip-row{display:flex;flex-wrap:wrap;gap:8px;}
.chip{
  font-size:0.83rem;font-weight:500;padding:10px 16px;border-radius:20px;border:1px solid var(--line);
  background:var(--white);color:var(--ink);
}
.chip:hover{border-color:var(--blue);color:var(--blue-deep);}

/* ---------- Consultation funnel ---------- */
.funnel-wrap{max-width:680px;margin:0 auto;}
.progress{display:flex;gap:6px;margin-bottom:34px;}
.progress i{flex:1;height:4px;background:var(--line);border-radius:2px;overflow:hidden;position:relative;}
.progress i::after{content:"";position:absolute;inset:0;background:var(--yellow);transform:scaleX(0);transform-origin:left;transition:transform .25s ease;}
.progress i.filled::after{transform:scaleX(1);}
.funnel-step{display:none;}
.funnel-step.active{display:block;animation:fadein .3s ease;}
@keyframes fadein{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
.funnel-step .step-label{font-family:var(--font-mono);font-size:0.72rem;color:var(--blue-deep);letter-spacing:0.1em;text-transform:uppercase;}
.funnel-step h2{margin-top:10px;font-size:1.5rem;}
.option-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin-top:24px;}
@media (max-width:560px){.option-grid{grid-template-columns:1fr;}}
.option-btn{
  border:1.5px solid var(--line);border-radius:var(--radius);padding:16px;text-align:left;background:#fff;
  display:flex;align-items:center;gap:12px;transition:border-color .15s ease, background .15s ease;
}
.option-btn:hover{border-color:var(--blue);}
.option-btn.selected{border-color:var(--yellow-deep);background:var(--yellow-soft);}
.option-btn .icon-wrap{width:34px;height:34px;border-radius:50%;background:var(--off);display:flex;align-items:center;justify-content:center;color:var(--navy);flex:none;}
.option-btn .icon-wrap svg{width:17px;height:17px;}
.option-btn span{font-weight:500;font-size:0.94rem;}
.field{margin-top:22px;}
.field label{display:block;font-weight:600;font-size:0.9rem;margin-bottom:8px;}
.field input[type=text], .field input[type=tel], .field select{
  width:100%;padding:13px 14px;border:1.5px solid var(--line);border-radius:var(--radius);font-size:0.96rem;background:#fff;
}
.field input:focus,.field select:focus{border-color:var(--blue);}
.hint{font-size:0.82rem;color:var(--muted-2);margin-top:6px;}
.upload-box{border:1.5px dashed #C9D0DA;border-radius:var(--radius);padding:22px;text-align:center;margin-top:22px;}
.upload-box svg{width:26px;height:26px;color:var(--muted-2);margin:0 auto 8px;}
.upload-box input[type=file]{display:block;margin:12px auto 0;font-size:0.85rem;}
.funnel-nav{display:flex;justify-content:space-between;align-items:center;margin-top:32px;gap:12px;}
.summary-box{background:var(--off);border:1px solid var(--line);border-radius:var(--radius-lg);padding:20px;margin-top:22px;}
.summary-row{display:flex;justify-content:space-between;gap:16px;padding:9px 0;border-bottom:1px solid var(--line);font-size:0.9rem;}
.summary-row:last-child{border-bottom:none;}
.summary-row b{color:var(--navy);font-weight:600;text-align:right;max-width:60%;}
.summary-row span{color:var(--muted);}

/* ---------- Footer ---------- */
footer.site{background:var(--navy);color:#AEB7C4;padding:60px 0 26px;}
.footer-grid{display:grid;grid-template-columns:1.4fr 1fr 1fr 1.2fr;gap:36px;}
@media (max-width:900px){.footer-grid{grid-template-columns:1fr 1fr;}}
@media (max-width:560px){.footer-grid{grid-template-columns:1fr;}}
footer.site h4{color:#fff;font-size:0.82rem;letter-spacing:0.08em;text-transform:uppercase;font-family:var(--font-mono);font-weight:500;margin-bottom:16px;}
footer.site ul li{margin-bottom:10px;}
footer.site a:hover{color:#fff;}
.footer-brand p{margin-top:14px;font-size:0.88rem;max-width:280px;color:#8FA1BE;}
.footer-note{border-top:1px solid #23324A;margin-top:44px;padding-top:22px;display:flex;flex-wrap:wrap;justify-content:space-between;gap:12px;font-size:0.78rem;color:#6B7A93;}
.contact-line{display:flex;gap:10px;align-items:flex-start;margin-bottom:12px;font-size:0.88rem;}
.contact-line svg{width:16px;height:16px;margin-top:2px;flex:none;color:var(--yellow);}

/* ---------- Reveal on scroll ---------- */
.reveal{opacity:0;transform:translateY(16px);transition:opacity .55s ease, transform .55s ease;}
.reveal.in{opacity:1;transform:translateY(0);}

/* ---------- Banner (placeholder notice) ---------- */
.notice{
  background:var(--yellow-soft);border:1px solid #F1D9A0;border-radius:var(--radius);
  padding:16px 18px;display:flex;gap:12px;align-items:flex-start;font-size:0.88rem;color:#7A5A0E;
}
.notice svg{width:19px;height:19px;flex:none;color:var(--yellow-deep);margin-top:1px;}

.knowledge-tile{border:1px solid var(--line);border-radius:var(--radius-lg);overflow:hidden;background:#fff;}
.knowledge-thumb{height:140px;background:var(--navy-2);position:relative;display:flex;align-items:center;justify-content:center;}
.knowledge-thumb svg{width:34px;height:34px;color:var(--yellow);}
.knowledge-body{padding:18px;}
.knowledge-body span{font-family:var(--font-mono);font-size:0.68rem;color:var(--muted-2);}
.knowledge-body h4{margin-top:6px;font-size:0.95rem;color:var(--navy);font-family:var(--font-body);font-weight:600;}

</style>
</head>
<body>
<a href="#main" class="skip-link">Skip to content</a>
${renderHeader(opts.activePath)}
<main id="main">${opts.body}</main>
${renderFooter()}
${WA_FLOAT_HTML}
<script>window.CONFIG = ${JSON.stringify({whatsappNumber: CONFIG.whatsappNumber, phoneDisplay: CONFIG.phoneDisplay, email: CONFIG.email})};</script>
<script src="/app.js"></script>
<script src="https://identity.netlify.com/v1/netlify-identity-widget.js"></script>
<script>
  if (window.netlifyIdentity) {
    window.netlifyIdentity.on("init", function(user){
      if(!user){
        window.netlifyIdentity.on("login", function(){ document.location.href = "/admin/"; });
      }
    });
  }
</script>
</body>
</html>`;
}

function writePage(routePath, title, description, bodyHtml, extraSchema){
  const html = wrapPage({path: routePath, title, description, activePath: routePath, body: bodyHtml, extraSchema});
  const outPath = routePath === '/' ? path.join(DIST, 'index.html') : path.join(DIST, routePath.replace(/^\//,'').replace(/\/$/,''), 'index.html');
  fs.mkdirSync(path.dirname(outPath), {recursive:true});
  fs.writeFileSync(outPath, html);
  return routePath;
}

/* ============================================================
   ROUTES — every real page the site generates
   ============================================================ */
const generatedPaths = [];

generatedPaths.push(writePage('/', 'RayGrid | Solar & Energy Solutions — Power Designed Around You',
  "Power Designed Around You. Solar & energy solutions for homes, businesses, farms and institutions across Uganda — from first consultation to lasting support.",
  pageHome()));

generatedPaths.push(writePage('/solutions/', 'Solar & Energy Solutions by Application | RayGrid',
  "Explore RayGrid's solar and energy solutions by application — residential, commercial, agriculture, institutional, water pumping, water heating, lighting and backup power.",
  pageSolutions()));

const SOLUTION_META = {
  "residential": ["Residential Solar Power Systems | RayGrid", "Residential solar systems designed around your roof, energy use and budget. Site assessment, design, sourcing, installation and support from RayGrid."],
  "commercial": ["Commercial Solar Power Systems | RayGrid", "Commercial solar systems sized to your business's load and operating hours. Reduce energy costs and improve power reliability with RayGrid."],
  "agriculture": ["Solar Water Pumping & Irrigation for Farms | RayGrid", "Solar water pumping and irrigation systems for farms and boreholes. Reliable water access without diesel costs, designed and installed by RayGrid."],
  "institutional": ["Solar Power for Schools & Institutions | RayGrid", "Dependable solar power for schools, healthcare facilities and hospitality properties. Priority-load backup and phased installation options from RayGrid."],
  "water-pumping": ["Solar Water Pumps for Boreholes & Livestock | RayGrid", "Solar water pumps for boreholes, livestock and water transfer, sized to your source yield and daily demand by RayGrid's design team."],
  "water-heating": ["Solar Water Heating Systems | RayGrid", "Solar water heating systems for homes, hospitality and institutions. Reduce water heating costs with a system sized to your actual demand."],
  "lighting-security": ["Solar Lighting & Security Systems | RayGrid", "Solar wall, garden, street and security lighting for compounds and public spaces. Self-contained, reliable lighting from RayGrid."],
  "backup-hybrid": ["Backup & Hybrid Solar Energy Systems | RayGrid", "Backup and hybrid solar energy systems that keep essential loads running through grid outages. Battery and inverter sizing from RayGrid."]
};

SOLUTIONS.forEach(function(s){
  const meta = SOLUTION_META[s.slug] || [s.name + " | RayGrid", s.short];
  const crumbs = [["Home","/"],["Solutions","/solutions/"],[s.name,null]];
  generatedPaths.push(writePage('/solutions/'+s.slug+'/', meta[0], meta[1], pageSolutionDetail(s.slug),
    [faqSchema(s.faq), breadcrumbSchema(crumbs)].filter(Boolean)));
});

generatedPaths.push(writePage('/services/', 'Solar Consultation, Design, Installation & Support | RayGrid',
  "From consultation and site survey to design, sourcing, installation and ongoing support — RayGrid's full solar service lifecycle, explained.",
  pageServices()));

generatedPaths.push(writePage('/equipment/', 'Solar Equipment & Technologies | RayGrid',
  "Solar panels, inverters, batteries, pumps, water heaters, lighting and protection equipment — sourced by RayGrid to match your system design.",
  pageEquipment()));

generatedPaths.push(writePage('/projects/', 'Completed Solar Projects | RayGrid',
  "Completed solar and energy installations by RayGrid across residential, commercial, agricultural and institutional properties.",
  pageProjects()));

generatedPaths.push(writePage('/locations/', 'Solar Company Service Areas in Uganda | RayGrid',
  "RayGrid provides solar and energy solutions across Uganda, with dedicated local service in Kampala and Mukono.",
  pageLocations()));

const LOCATION_META = {
  "kampala": ["Solar Company in Kampala | RayGrid", "Solar power systems for homes, businesses and institutions in Kampala. Site assessment, design, sourcing, installation and support from RayGrid."],
  "mukono": ["Solar Company in Mukono | RayGrid", "RayGrid is based in Mukono, Uganda, providing solar power systems for homes, businesses and institutions across the area."]
};
LOCATIONS.forEach(function(loc){
  const meta = LOCATION_META[loc.slug] || ["Solar Company in "+loc.name+" | RayGrid", loc.short];
  const crumbs = [["Home","/"],["Locations","/locations/"],[loc.name,null]];
  generatedPaths.push(writePage('/locations/'+loc.slug+'/', meta[0], meta[1], pageLocationDetail(loc.slug),
    [faqSchema(loc.faq), breadcrumbSchema(crumbs)].filter(Boolean)));
});

generatedPaths.push(writePage('/about/', 'About RayGrid | Solar & Energy Solutions',
  "RayGrid is a solar and energy solutions consultancy — design, sourcing, installation and support for homes, businesses, farms and institutions.",
  pageAbout()));

generatedPaths.push(writePage('/consultation/', 'Start a Solar Consultation | RayGrid',
  "Start a solar consultation with RayGrid. Answer a few quick questions and connect directly via WhatsApp for a site assessment and quotation.",
  pageConsultation()));

/* ============================================================
   SITEMAP + ROBOTS
   ============================================================ */
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${generatedPaths.map(p => `  <url><loc>${SITE_URL}${p}</loc></url>`).join('\n')}
</urlset>`;
fs.writeFileSync(path.join(DIST, 'sitemap.xml'), sitemap);

const robots = `User-agent: *
Allow: /
Disallow: /admin/

Sitemap: ${SITE_URL}/sitemap.xml
`;
fs.writeFileSync(path.join(DIST, 'robots.txt'), robots);

/* ============================================================
   COPY STATIC ASSETS (admin editor + uploaded media)
   Note: content/*.json is intentionally NOT copied into dist —
   the CMS reads/writes it via the Git repo directly (Git Gateway),
   not from the published site, and the pages above already have
   its data baked in at build time.
   ============================================================ */
function copyDir(src, dest){
  if(!fs.existsSync(src)) return;
  fs.mkdirSync(dest, {recursive:true});
  for(const entry of fs.readdirSync(src, {withFileTypes:true})){
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if(entry.isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}
copyDir(path.join(ROOT, 'admin'), path.join(DIST, 'admin'));
copyDir(path.join(ROOT, 'images'), path.join(DIST, 'images'));
fs.copyFileSync(path.join(ROOT, 'app.js'), path.join(DIST, 'app.js'));
fs.copyFileSync(path.join(ROOT, 'images', 'favicon.ico'), path.join(DIST, 'favicon.ico'));

console.log('Build complete.');
console.log('Pages generated:', generatedPaths.length);
generatedPaths.forEach(p => console.log('  ', p));
