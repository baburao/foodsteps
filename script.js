/* ═══════════════════════════════════════════
   FOODSTEPS — script.js
═══════════════════════════════════════════ */

/* ── Navbar: floating pill on scroll ── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 10);
}, { passive: true });


/* ── Mobile Menu ── */
const hamburger    = document.getElementById('hamburger');
const mobileMenu   = document.getElementById('mobileMenu');
const mobileOverlay = document.getElementById('mobileOverlay');
const mobileClose  = document.getElementById('mobileClose');
const mobileLinks  = document.querySelectorAll('.mobile-nav a, .mobile-menu .btn');

function openMenu() {
  mobileMenu.classList.add('open');
  mobileOverlay.style.display = 'block';
  hamburger.classList.add('open');
  requestAnimationFrame(() => mobileOverlay.classList.add('visible'));
  document.body.style.overflow = 'hidden';
}

function closeMenu() {
  mobileMenu.classList.remove('open');
  mobileOverlay.classList.remove('visible');
  hamburger.classList.remove('open');
  document.body.style.overflow = '';
  setTimeout(() => { mobileOverlay.style.display = 'none'; }, 300);
}

hamburger.addEventListener('click', openMenu);
mobileClose.addEventListener('click', closeMenu);
mobileOverlay.addEventListener('click', closeMenu);
mobileLinks.forEach(link => link.addEventListener('click', closeMenu));


/* ── Scroll-triggered fade-in (Intersection Observer) ── */
const fadeEls = document.querySelectorAll('.fade-in');

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

fadeEls.forEach((el, i) => {
  /* Stagger cards in the same grid row */
  const parent = el.parentElement;
  if (parent && (parent.classList.contains('why-grid') ||
                 parent.classList.contains('products-grid') ||
                 parent.classList.contains('testimonials-grid') ||
                 parent.classList.contains('trust-grid'))) {
    const siblings = Array.from(parent.querySelectorAll('.fade-in'));
    const idx = siblings.indexOf(el);
    el.style.transitionDelay = `${idx * 0.1}s`;
  }
  observer.observe(el);
});


/* ── Smooth active-link highlight on scroll ── */
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navAnchors.forEach(a => a.classList.remove('active'));
        const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  },
  { rootMargin: '-40% 0px -55% 0px' }
);
sections.forEach(s => sectionObserver.observe(s));


/* ── 3D tilt on product cards ── */
document.querySelectorAll('.s3-card').forEach(card => {
  const MAX_TILT = 5; // degrees — subtle

  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width  / 2;
    const cy = rect.height / 2;
    const rotateY =  ((x - cx) / cx) * MAX_TILT;
    const rotateX = -((y - cy) / cy) * MAX_TILT;
    card.style.transform =
      `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px) scale(1.02)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    card.style.transform  = 'perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)';
    setTimeout(() => { card.style.transition = ''; }, 500);
  });

  card.addEventListener('mouseenter', () => {
    card.style.transition = 'transform 0.1s ease';
  });
});


/* ── Contact form submit ── */
function handleFormSubmit(e) {
  e.preventDefault();
  const success = document.getElementById('formSuccess');
  success.style.display = 'block';
  e.target.reset();
  setTimeout(() => { success.style.display = 'none'; }, 5000);
}


/* ── Newsletter submit ── */
function handleNewsletterSubmit(e) {
  e.preventDefault();
  const success = document.getElementById('newsletterSuccess');
  success.style.display = 'block';
  e.target.reset();
}


/* ── Hero card expand / collapse ── */
function initHeroCards() {
  const row   = document.getElementById('heroCardsRow');
  const cards = document.querySelectorAll('.hcard[data-card]');
  if (!row || !cards.length) return;

  function activateCard(idx) {
    row.dataset.active = String(idx);
    cards.forEach((c, i) => {
      c.classList.toggle('hcard--active', i === idx);
    });
  }

  /* Desktop: expand on hover */
  cards.forEach((card, idx) => {
    card.addEventListener('mouseenter', () => activateCard(idx));
  });

  /* Row mouse-leave: return to first card */
  row.addEventListener('mouseleave', () => activateCard(0));

  /* Mobile: tap to expand */
  cards.forEach((card, idx) => {
    card.addEventListener('touchend', (e) => {
      if (card.classList.contains('hcard--active') &&
          !e.target.closest('.hcard-arrow')) return;
      e.preventDefault();
      activateCard(idx);
    }, { passive: false });
  });
}

/* Run after DOM is ready */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initHeroCards);
} else {
  initHeroCards();
}

/* ── Active nav link style injection ── */
const style = document.createElement('style');
style.textContent = `.nav-links a.active { color: var(--color-primary); background: var(--color-primary-light); }`;
document.head.appendChild(style);


/* ═══════════════════════════════════════════════════════════════
   FOODY — FoodSteps Product Assistance Chatbot v2
   Modules: Main Menu → Finder | Allergen | Feeding | Storage | Order | Human
   Safety: Medical guardrail | Under-6 block | Disclaimer on open
═══════════════════════════════════════════════════════════════ */

/* ── Product data ── */
const PRODUCTS = {
  pumpkin: {
    key: 'pumpkin',
    name: 'Pumpkin, Carrot & Apple Puree',
    age: '6m+',
    ageMonths: 6,
    size: '100g',
    ingredients: ['Pumpkin', 'Carrot', 'Apple'],
    tags: ['First food', 'Beta-carotene rich', 'Naturally sweet'],
    desc: 'Sweet pumpkin and carrot are rich in beta-carotene for healthy vision and growth, while apple adds a gentle fruity freshness. A nourishing, easy-to-digest first puree.',
    marketplaceLink: 'https://www.amazon.in',
    allergensNote: 'Please check the pouch label before serving, especially if your child has known food sensitivities.',
    noAddedSugar: true,
    noPreservatives: true,
    glutenFree: true,
  },
  sweetpotato: {
    key: 'sweetpotato',
    name: 'Purple Sweet Potato, Banana & Dates Puree',
    age: '6m+',
    ageMonths: 6,
    size: '100g',
    ingredients: ['Purple Sweet Potato', 'Banana', 'Dates'],
    tags: ['Naturally sweet', 'Energy-rich', 'Best seller'],
    desc: 'Natural sweetness from dates, steady energy from banana, and powerful antioxidants from purple sweet potato. A vibrant, wholesome blend babies love from 6 months.',
    marketplaceLink: 'https://www.amazon.in',
    allergensNote: 'Please check the pouch label before serving, especially if your child has known food sensitivities.',
    noAddedSugar: true,
    noPreservatives: true,
    glutenFree: true,
  },
  spinach: {
    key: 'spinach',
    name: 'Spinach, Pea & Apple Puree',
    age: '6m+',
    ageMonths: 6,
    size: '100g',
    ingredients: ['Spinach', 'Pea', 'Apple'],
    tags: ['Iron-rich', 'Veggie-packed', 'Protein boost'],
    desc: 'Iron-rich spinach and protein-packed peas meet the gentle sweetness of green apple — a vibrant, veggie-forward blend for growing babies from 6 months.',
    marketplaceLink: 'https://www.amazon.in',
    allergensNote: 'Please check the pouch label before serving, especially if your child has known food sensitivities.',
    noAddedSugar: true,
    noPreservatives: true,
    glutenFree: true,
  },
};

/* ── Medical guardrail keywords ── */
const MEDICAL_KEYWORDS = [
  'rash','allergy','allergic','vomit','vomiting','fever','swelling',
  'breathing','choking','diarrhea','diarrhoea','blood','sick','emergency',
  'doctor','pediatrician','paediatrician','premature','formula',
  'breastfeeding','dosage','supplement','reaction','hives','seizure','hospital'
];

function isMedicalOrAdverseQuery(text) {
  const lower = (text || '').toLowerCase();
  return MEDICAL_KEYWORDS.some(kw => lower.includes(kw));
}

/* ── Recommendation engine ── */
function recommend(ageMonths, avoid, flavor, priority) {
  let eligible = Object.entries(PRODUCTS).filter(([, p]) => ageMonths >= p.ageMonths);

  const avoidMap = { gluten: ['oats'], dairy: [], nuts: [], soy: [] };
  if (avoid && avoid !== 'none' && avoid !== 'unsure' && avoidMap[avoid]) {
    const bad = avoidMap[avoid];
    if (bad.length) {
      eligible = eligible.filter(([, p]) =>
        !bad.some(b => p.ingredients.some(i => i.toLowerCase().includes(b)))
      );
    }
  }
  if (!eligible.length) return [];

  const scores = {};
  eligible.forEach(([k]) => { scores[k] = 0; });
  const add = (k, pts) => { if (scores[k] !== undefined) scores[k] += pts; };

  if (flavor === 'fruits')  { add('pumpkin', 2); add('sweetpotato', 1); add('spinach', 1); }
  if (flavor === 'veggies') { add('spinach', 3); add('pumpkin', 2); }
  if (flavor === 'mixed')   { eligible.forEach(([k]) => add(k, 1)); }
  if (flavor === 'sweet')   { add('sweetpotato', 3); add('pumpkin', 2); }

  if (priority === 'first')  { add('pumpkin', 4); add('sweetpotato', 2); }
  if (priority === 'travel') { add('sweetpotato', 3); eligible.forEach(([k]) => add(k, 1)); }
  if (priority === 'energy') { add('sweetpotato', 4); add('pumpkin', 2); }
  if (priority === 'gentle') { add('pumpkin', 3); add('spinach', 1); }

  return Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(([k]) => k);
}

/* ── Chat state ── */
let foodyState = {
  step: 0, module: null,
  ageMonths: 0, ageLabel: '',
  avoid: null, flavor: null, priority: null,
  selectedProduct: null,
};

/* ── DOM refs ── */
const foodyTrigger  = document.getElementById('foodyTrigger');
const foodyPanel    = document.getElementById('foodyPanel');
const foodyClose    = document.getElementById('foodyClose');
const foodyMessages = document.getElementById('foodyMessages');
const foodyReplies  = document.getElementById('foodyReplies');

foodyTrigger.addEventListener('click', foodyOpen);
foodyClose.addEventListener('click', foodyClosePanel);

/* ── Open / Close / Restart ── */
function foodyOpen() {
  foodyPanel.classList.add('open');
  foodyTrigger.classList.add('hidden');
  if (foodyState.step === 0) {
    foodyState.step = 1;
    _showDisclaimer();
  }
}

function foodyClosePanel() {
  foodyPanel.classList.remove('open');
  foodyTrigger.classList.remove('hidden');
}

function foodyRestart() {
  foodyMessages.innerHTML = '';
  foodyReplies.innerHTML  = '';
  foodyState = { step: 0, module: null, ageMonths: 0, ageLabel: '', avoid: null, flavor: null, priority: null, selectedProduct: null };
  foodyOpen();
}

function foodyBackToMenu() {
  foodyState.module = null;
  foodyState.ageMonths = 0; foodyState.avoid = null;
  foodyState.flavor = null; foodyState.priority = null;
  foodyState.selectedProduct = null;
  const t = foodyTyping();
  setTimeout(() => { t.remove(); foodyBotMsg('What else can I help you with? 😊'); foodyShowMainMenu(); }, 600);
}

/* ═══════════════════════════════
   DISCLAIMER + MAIN MENU
═══════════════════════════════ */
function _showDisclaimer() {
  const card = document.createElement('div');
  card.className = 'foody-disclaimer-card';
  card.innerHTML = `
    <p>Hi! I'm <strong>Foody</strong>, FoodSteps' product guide. I can help you explore our products, check ingredients and allergens, and answer basic product questions.</p>
    <p class="foody-disclaimer-note">⚕️ I'm <strong>not</strong> a medical professional or nutritionist. For health concerns, feeding decisions, or adverse reactions, please consult your <strong>pediatrician</strong>.</p>`;
  foodyMessages.appendChild(card);
  foodyScrollBottom();
  setTimeout(() => { foodyBotMsg('How can I help you today? 👇'); foodyShowMainMenu(); }, 700);
}

function foodyShowMainMenu() {
  foodySetChips([
    { label: '🌿 Find a Product',        cb: () => { foodyUserMsg('🌿 Find a Product');        _startFinder(); }},
    { label: '🔍 Check Ingredients',     cb: () => { foodyUserMsg('🔍 Check Ingredients');     _startAllergen(); }},
    { label: '👶 Feeding Stage Guide',   cb: () => { foodyUserMsg('👶 Feeding Stage Guide');   _startFeeding(); }},
    { label: '🥣 Storage & Usage',       cb: () => { foodyUserMsg('🥣 Storage & Usage');       _startStorage(); }},
    { label: '🛒 Order / Contact Help',  cb: () => { foodyUserMsg('🛒 Order / Contact Help');  _showOrderHelp(); }},
    { label: '💬 Talk to Human',         cb: () => { foodyUserMsg('💬 Talk to Human');         _showHumanHandoff(); }},
  ]);
}

/* ═══════════════════════════════
   MODULE 1 — Product Finder
═══════════════════════════════ */
function _startFinder() {
  foodyState.module = 'finder';
  const t = foodyTyping();
  setTimeout(() => {
    t.remove();
    foodyBotMsg('🍼 Let me find the right FoodSteps pouch for your little one.<br><br><strong>How old is your baby?</strong>');
    foodySetChips([
      { label: 'Under 6 months', cb: () => { foodyUserMsg('Under 6 months'); _finderUnder6(); }},
      { label: '6 – 8 months',   cb: () => { foodyUserMsg('6 – 8 months');   _finderAge(6,  '6–8 months'); }},
      { label: '9 – 12 months',  cb: () => { foodyUserMsg('9 – 12 months');  _finderAge(9,  '9–12 months'); }},
      { label: '12+ months',     cb: () => { foodyUserMsg('12+ months');     _finderAge(12, '12+ months'); }},
      { label: '⬅ Back to Menu', cb: () => { foodyUserMsg('⬅ Back to Menu'); foodyBackToMenu(); }},
    ]);
  }, 700);
}

function _finderUnder6() {
  const t = foodyTyping();
  setTimeout(() => {
    t.remove();
    _safetyCard('FoodSteps products are designed for babies from 6 months and up. Please consult your pediatrician before introducing solids, especially for babies under 6 months.', false);
    foodySetChips([
      { label: '⬅ Back to Menu',       cb: () => { foodyUserMsg('⬅ Back to Menu');       foodyBackToMenu(); }},
      { label: '📞 Contact FoodSteps', cb: () => { foodyUserMsg('📞 Contact FoodSteps'); _showHumanHandoff(); }},
    ]);
  }, 800);
}

function _finderAge(months, label) {
  foodyState.ageMonths = months; foodyState.ageLabel = label;
  const t = foodyTyping();
  setTimeout(() => {
    t.remove();
    foodyBotMsg('Got it! 😊<br><br><strong>Any ingredient you want to avoid?</strong>');
    foodySetChips([
      { label: 'No restriction', cb: () => { foodyUserMsg('No restriction'); _finderAvoid('none'); }},
      { label: 'Gluten',         cb: () => { foodyUserMsg('Gluten');         _finderAvoid('gluten'); }},
      { label: 'Dairy',          cb: () => { foodyUserMsg('Dairy');          _finderAvoid('dairy'); }},
      { label: 'Nuts',           cb: () => { foodyUserMsg('Nuts');           _finderAvoid('nuts'); }},
      { label: 'Soy',            cb: () => { foodyUserMsg('Soy');            _finderAvoid('soy'); }},
      { label: 'Not sure',       cb: () => { foodyUserMsg('Not sure');       _finderAvoid('unsure'); }},
    ]);
  }, 800);
}

function _finderAvoid(val) {
  foodyState.avoid = val;
  const t = foodyTyping();
  setTimeout(() => {
    t.remove();
    foodyBotMsg('🌈 <strong>What flavour style is your baby enjoying?</strong>');
    foodySetChips([
      { label: '🍓 Fruits',           cb: () => { foodyUserMsg('🍓 Fruits');           _finderFlavor('fruits'); }},
      { label: '🥕 Veggies',          cb: () => { foodyUserMsg('🥕 Veggies');          _finderFlavor('veggies'); }},
      { label: '🌈 Mixed',            cb: () => { foodyUserMsg('🌈 Mixed');            _finderFlavor('mixed'); }},
      { label: '🍯 Naturally Sweet',  cb: () => { foodyUserMsg('🍯 Naturally Sweet');  _finderFlavor('sweet'); }},
      { label: '🤔 Not sure',         cb: () => { foodyUserMsg('🤔 Not sure');         _finderFlavor('mixed'); }},
    ]);
  }, 800);
}

function _finderFlavor(val) {
  foodyState.flavor = val;
  const t = foodyTyping();
  setTimeout(() => {
    t.remove();
    foodyBotMsg('💡 Last one — <strong>what is your priority right now?</strong>');
    foodySetChips([
      { label: '🌱 First food',       cb: () => { foodyUserMsg('🌱 First food');       _finderPriority('first'); }},
      { label: '✈️ Travel-friendly',  cb: () => { foodyUserMsg('✈️ Travel-friendly');  _finderPriority('travel'); }},
      { label: '⚡ Energy',            cb: () => { foodyUserMsg('⚡ Energy');            _finderPriority('energy'); }},
      { label: '🌸 Gentle taste',     cb: () => { foodyUserMsg('🌸 Gentle taste');     _finderPriority('gentle'); }},
    ]);
  }, 800);
}

function _finderPriority(val) {
  foodyState.priority = val;
  const t = foodyTyping();
  setTimeout(() => {
    t.remove();
    foodyBotMsg('Finding the best matches… 🔍');
    const t2 = foodyTyping();
    setTimeout(() => {
      t2.remove();
      const picks = recommend(foodyState.ageMonths, foodyState.avoid, foodyState.flavor, foodyState.priority);
      if (!picks.length) {
        foodyBotMsg('No products matched those filters right now — our range is growing! Please contact us for personalised help.');
        foodySetChips([
          { label: '🔄 Try again',          cb: () => { foodyUserMsg('🔄 Try again');          _startFinder(); }},
          { label: '📞 Contact FoodSteps',  cb: () => { foodyUserMsg('📞 Contact FoodSteps');  _showHumanHandoff(); }},
          { label: '⬅ Back to Menu',        cb: () => { foodyUserMsg('⬅ Back to Menu');        foodyBackToMenu(); }},
        ]);
        return;
      }
      const [top, second] = picks;
      foodyBotMsg('🎉 Here\'s my <strong>top pick</strong> for your baby:');
      setTimeout(() => {
        foodyProductCard(PRODUCTS[top]);
        setTimeout(() => {
          if (second) {
            foodyBotMsg('You might also enjoy:');
            setTimeout(() => {
              foodyProductCard(PRODUCTS[second]);
              setTimeout(() => {
                foodyBotMsg('All FoodSteps pouches are 100% natural, non-GMO, and come with a spoon! 🥄');
                _finderEndChips();
              }, 500);
            }, 400);
          } else {
            foodyBotMsg('All FoodSteps pouches are 100% natural, non-GMO, and come with a spoon! 🥄');
            _finderEndChips();
          }
        }, 400);
      }, 400);
    }, 1200);
  }, 800);
}

function _finderEndChips() {
  foodySetChips([
    { label: '🔄 Search again',     cb: () => { foodyUserMsg('🔄 Search again');    _startFinder(); }},
    { label: '⬅ Back to Menu',     cb: () => { foodyUserMsg('⬅ Back to Menu');    foodyBackToMenu(); }},
    { label: '🛒 See all products', cb: () => { foodyClosePanel(); document.querySelector('#products')?.scrollIntoView({ behavior: 'smooth' }); }},
  ]);
}

/* ═══════════════════════════════
   MODULE 2 — Ingredient / Allergen Checker
═══════════════════════════════ */
function _startAllergen() {
  foodyState.module = 'allergen';
  const t = foodyTyping();
  setTimeout(() => {
    t.remove();
    foodyBotMsg('🔍 <strong>Which product would you like to check?</strong>');
    foodySetChips([
      { label: '🥕 Carrot, Apple & Ragi',       cb: () => { foodyUserMsg('Carrot, Apple & Ragi');        _allergenProduct('carrot'); }},
      { label: '🍠 Purple Sweet Potato & Dates', cb: () => { foodyUserMsg('Purple Sweet Potato & Dates'); _allergenProduct('sweetpotato'); }},
      { label: '🍌 Banana, Strawberry & Oats',  cb: () => { foodyUserMsg('Banana, Strawberry & Oats');   _allergenProduct('banana'); }},
      { label: '⬅ Back to Menu',                cb: () => { foodyUserMsg('⬅ Back to Menu');              foodyBackToMenu(); }},
    ]);
  }, 700);
}

function _allergenProduct(key) {
  foodyState.selectedProduct = key;
  const p = PRODUCTS[key];
  const t = foodyTyping();
  setTimeout(() => {
    t.remove();
    foodyBotMsg(`Got it — <strong>${p.name}</strong>. What would you like to check?`);
    foodySetChips([
      { label: '📋 Ingredients',       cb: () => { foodyUserMsg('📋 Ingredients');        _allergenShow('ingredients'); }},
      { label: '⚠️ Allergen note',     cb: () => { foodyUserMsg('⚠️ Allergen note');      _allergenShow('allergen'); }},
      { label: '🚫 No added sugar?',   cb: () => { foodyUserMsg('🚫 No added sugar?');    _allergenShow('sugar'); }},
      { label: '✅ No preservatives?', cb: () => { foodyUserMsg('✅ No preservatives?');  _allergenShow('preservatives'); }},
      { label: '🌾 Gluten free?',      cb: () => { foodyUserMsg('🌾 Gluten free?');       _allergenShow('gluten'); }},
      { label: '⬅ Back to Menu',      cb: () => { foodyUserMsg('⬅ Back to Menu');        foodyBackToMenu(); }},
    ]);
  }, 700);
}

function _allergenShow(topic) {
  const p = PRODUCTS[foodyState.selectedProduct];
  const t = foodyTyping();
  setTimeout(() => {
    t.remove();
    if (topic === 'ingredients') {
      const items = p.ingredients.map(i => `<li>${i}</li>`).join('');
      foodyBotMsg(`<strong>${p.name}</strong> contains:<ul class="foody-ingredient-list">${items}</ul><span class="foody-label-note">📦 Always verify the physical pouch label before serving.</span>`);
    } else if (topic === 'allergen') {
      _safetyCard(`<strong>Allergen Note — ${p.name}</strong><br>${p.allergensNote}<br><br>Based on product information available on this website. <strong>Always check the physical pouch label before serving.</strong>`, false);
    } else if (topic === 'sugar') {
      foodyBotMsg(p.noAddedSugar
        ? `✅ <strong>${p.name}</strong> contains <strong>no added sugar</strong>. Sweetness comes naturally from the ingredients. Please confirm on the pouch label.`
        : `ℹ️ Please check the pouch label for sugar information on <strong>${p.name}</strong>.`);
    } else if (topic === 'preservatives') {
      foodyBotMsg(p.noPreservatives
        ? `✅ <strong>${p.name}</strong> contains <strong>no artificial preservatives</strong>. Please confirm on the pouch label.`
        : `ℹ️ Please check the pouch label for preservative information.`);
    } else if (topic === 'gluten') {
      foodyBotMsg(p.glutenFree
        ? `✅ <strong>${p.name}</strong> is considered <strong>gluten-free</strong> based on listed ingredients. Please check the physical label, especially if your child has coeliac disease or gluten sensitivity.`
        : `⚠️ <strong>${p.name}</strong> contains <strong>Oats</strong>, which may contain gluten. If your child has gluten sensitivity or coeliac disease, please consult your pediatrician before serving and verify the pouch label.`);
    }
    setTimeout(() => {
      foodySetChips([
        { label: '🔍 Check another',  cb: () => { foodyUserMsg('🔍 Check another');  _startAllergen(); }},
        { label: '⬅ Back to Menu',   cb: () => { foodyUserMsg('⬅ Back to Menu');   foodyBackToMenu(); }},
      ]);
    }, 500);
  }, 800);
}

/* ═══════════════════════════════
   MODULE 3 — Feeding Stage Guide
═══════════════════════════════ */
function _startFeeding() {
  foodyState.module = 'feeding';
  const t = foodyTyping();
  setTimeout(() => {
    t.remove();
    foodyBotMsg('👶 <strong>Select your baby\'s age range:</strong>');
    foodySetChips([
      { label: 'Under 6 months', cb: () => { foodyUserMsg('Under 6 months'); _feedingResponse(0); }},
      { label: '6 – 8 months',   cb: () => { foodyUserMsg('6 – 8 months');   _feedingResponse(6); }},
      { label: '9 – 12 months',  cb: () => { foodyUserMsg('9 – 12 months');  _feedingResponse(9); }},
      { label: '12+ months',     cb: () => { foodyUserMsg('12+ months');     _feedingResponse(12); }},
      { label: '⬅ Back to Menu', cb: () => { foodyUserMsg('⬅ Back to Menu'); foodyBackToMenu(); }},
    ]);
  }, 700);
}

function _feedingResponse(months) {
  const map = {
    0:  { safe: false, text: 'Please consult your pediatrician before introducing solids. FoodSteps products are designed from 6 months and up.' },
    6:  { safe: true,  text: 'Smooth, simple purees are a great starting point when introducing solids. <strong>FoodSteps Starters</strong> are designed for babies from 6 months and up — a gentle first step into flavours.' },
    9:  { safe: true,  text: 'This stage is often about exploring richer combinations and more varied textures. <strong>FoodSteps Explorers</strong> are designed for growing babies from 9 months and up.' },
    12: { safe: true,  text: 'Toddler-friendly blends support flavour variety and convenient snacking on the go. <strong>FoodSteps Toddlers</strong> are designed for 12 months and up.' },
  };
  const msg = map[months];
  const t = foodyTyping();
  setTimeout(() => {
    t.remove();
    if (!msg.safe) {
      _safetyCard(msg.text, false);
    } else {
      foodyBotMsg(msg.text);
      foodyBotMsg('<em class="foody-disclaimer-inline">This is general product guidance, not medical advice. Always consult your pediatrician for feeding decisions specific to your baby.</em>');
    }
    foodySetChips([
      { label: '🌿 Find a Product', cb: () => { foodyUserMsg('🌿 Find a Product'); _startFinder(); }},
      { label: '⬅ Back to Menu',   cb: () => { foodyUserMsg('⬅ Back to Menu');   foodyBackToMenu(); }},
    ]);
  }, 900);
}

/* ═══════════════════════════════
   MODULE 4 — Storage & Usage
═══════════════════════════════ */
function _startStorage() {
  foodyState.module = 'storage';
  const t = foodyTyping();
  setTimeout(() => {
    t.remove();
    foodyBotMsg('🥣 <strong>What would you like to know about storage and usage?</strong>');
    foodySetChips([
      { label: '📦 How to store?',  cb: () => { foodyUserMsg('📦 How to store?');  _storageResponse('store'); }},
      { label: '✈️ Can I travel?',  cb: () => { foodyUserMsg('✈️ Can I travel?');  _storageResponse('travel'); }},
      { label: '🔓 After opening?', cb: () => { foodyUserMsg('🔓 After opening?'); _storageResponse('open'); }},
      { label: '🥄 Serving tips',   cb: () => { foodyUserMsg('🥄 Serving tips');   _storageResponse('serve'); }},
      { label: '⬅ Back to Menu',   cb: () => { foodyUserMsg('⬅ Back to Menu');   foodyBackToMenu(); }},
    ]);
  }, 700);
}

function _storageResponse(topic) {
  const responses = {
    store:  'Store FoodSteps pouches in a cool, dry place away from direct sunlight. Please check the pouch label for exact storage conditions and the best-before date.',
    travel: 'FoodSteps pouches are designed to be compact and travel-friendly — no preparation or refrigeration needed before opening. Please store as instructed on the pouch and check the label for specific travel guidance.',
    open:   'Once opened, pouches should be consumed promptly. Please check the pouch label for specific opened-pouch storage guidance.',
    serve:  'No heating or preparation needed — just open and serve directly from the pouch or spoon into a bowl. Always check the texture is appropriate for your baby\'s stage. Please refer to the pouch label for any additional serving guidance.',
  };
  const t = foodyTyping();
  setTimeout(() => {
    t.remove();
    foodyBotMsg(`${responses[topic]}<br><br><span class="foody-label-note">📦 Always refer to the physical pouch label for the most accurate and up-to-date guidance.</span>`);
    foodySetChips([
      { label: '🥣 Ask another',  cb: () => { foodyUserMsg('🥣 Ask another');  _startStorage(); }},
      { label: '⬅ Back to Menu', cb: () => { foodyUserMsg('⬅ Back to Menu'); foodyBackToMenu(); }},
    ]);
  }, 900);
}

/* ═══════════════════════════════
   MODULE 5 — Order / Contact Help
═══════════════════════════════ */
function _showOrderHelp() {
  foodyState.module = 'order';
  const t = foodyTyping();
  setTimeout(() => {
    t.remove();
    foodyBotMsg('🛒 FoodSteps is available through marketplace links and direct contact.');
    _contactCard();
    foodySetChips([
      { label: '🛒 Shop on Amazon',    cb: () => { window.open('https://www.amazon.in', '_blank'); }},
      { label: '📞 Contact FoodSteps', cb: () => { foodyUserMsg('📞 Contact FoodSteps'); _showHumanHandoff(); }},
      { label: '⬅ Back to Menu',      cb: () => { foodyUserMsg('⬅ Back to Menu'); foodyBackToMenu(); }},
    ]);
  }, 700);
}

/* ═══════════════════════════════
   MODULE 6 — Human Handoff
═══════════════════════════════ */
function _showHumanHandoff() {
  foodyState.module = 'human';
  const t = foodyTyping();
  setTimeout(() => {
    t.remove();
    foodyBotMsg('💬 I can help you reach the FoodSteps team directly.');
    _contactCard();
    _safetyCard('For medical concerns or adverse reactions, please contact your <strong>pediatrician immediately</strong>.', false);
    foodySetChips([
      { label: '⬅ Back to Menu', cb: () => { foodyUserMsg('⬅ Back to Menu'); foodyBackToMenu(); }},
    ]);
  }, 700);
}

/* ═══════════════════════════════
   Medical escalation
═══════════════════════════════ */
function foodyShowMedicalEscalation() {
  _safetyCard('I\'m not able to provide medical advice. Please contact your <strong>pediatrician immediately</strong>. If your baby has breathing difficulty, severe swelling, vomiting, or other emergency symptoms, <strong>seek emergency medical help right away.</strong>', true);
  foodySetChips([
    { label: '📞 Contact FoodSteps', cb: () => { foodyUserMsg('📞 Contact FoodSteps'); _showHumanHandoff(); }},
    { label: '⬅ Back to Menu',      cb: () => { foodyUserMsg('⬅ Back to Menu');      foodyBackToMenu(); }},
  ]);
}

/* ═══════════════════════════════
   Message helpers
═══════════════════════════════ */
function foodyBotMsg(html, extraClass = '') {
  const wrap = document.createElement('div');
  wrap.className = 'foody-msg' + (extraClass ? ' ' + extraClass : '');
  wrap.innerHTML = `
    <div class="foody-msg-avatar">🌿</div>
    <div class="foody-msg-bubble">${html}</div>`;
  foodyMessages.appendChild(wrap);
  foodyScrollBottom();
  return wrap;
}

function foodyUserMsg(label) {
  const wrap = document.createElement('div');
  wrap.className = 'foody-msg user-msg';
  wrap.innerHTML = `<div class="foody-msg-bubble">${label}</div>`;
  foodyMessages.appendChild(wrap);
  foodyScrollBottom();
}

function foodyTyping() {
  return foodyBotMsg(
    `<span class="foody-typing-dot"></span>
     <span class="foody-typing-dot"></span>
     <span class="foody-typing-dot"></span>`,
    'foody-typing'
  );
}

function foodySetChips(chips) {
  foodyReplies.innerHTML = '';
  chips.forEach(({ label, cb }) => {
    const btn = document.createElement('button');
    btn.className = 'foody-chip';
    btn.textContent = label;
    btn.onclick = () => { foodyReplies.innerHTML = ''; cb(); };
    foodyReplies.appendChild(btn);
  });
}

function foodyScrollBottom() {
  setTimeout(() => { foodyMessages.scrollTop = foodyMessages.scrollHeight; }, 50);
}

/* ── Safety / warning card ── */
function _safetyCard(html, urgent) {
  const card = document.createElement('div');
  card.className = 'foody-safety-card' + (urgent ? ' foody-safety-card--urgent' : '');
  card.innerHTML = `<span class="foody-safety-icon">${urgent ? '🚨' : '⚠️'}</span><div>${html}</div>`;
  foodyMessages.appendChild(card);
  foodyScrollBottom();
}

/* ── Contact card ── */
function _contactCard() {
  const card = document.createElement('div');
  card.className = 'foody-contact-card';
  card.innerHTML = `
    <div class="foody-contact-row"><span>📞</span><a href="tel:+918197877744">+91 81978 77744</a></div>
    <div class="foody-contact-row"><span>✉️</span><a href="mailto:info@foodsteps.baby">info@foodsteps.baby</a></div>`;
  foodyMessages.appendChild(card);
  foodyScrollBottom();
}

/* ── Product card ── */
function foodyProductCard(p) {
  const tags = p.tags.map(t => `<span class="foody-ptag">${t}</span>`).join('');
  const ingredients = p.ingredients.join(' · ');
  const card = document.createElement('div');
  card.className = 'foody-product-card';
  card.innerHTML = `
    <div class="foody-product-card-header">
      <span class="foody-product-emoji">${p.emoji}</span>
      <div class="foody-product-info">
        <div class="foody-product-name">${p.name}</div>
        <div class="foody-product-badges">
          <span class="foody-product-badge">${p.age}</span>
          <span class="foody-product-badge foody-badge-grey">${p.size}</span>
        </div>
      </div>
    </div>
    <p class="foody-product-desc">${p.desc}</p>
    <div class="foody-product-ingredients">🌿 ${ingredients}</div>
    <div class="foody-product-tags">${tags}</div>
    <a href="${p.marketplaceLink}" target="_blank" rel="noopener" class="foody-product-cta">🛒 Buy on Amazon</a>`;
  foodyMessages.appendChild(card);
  foodyScrollBottom();
}
