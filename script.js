/* ═══════════════════════════════════════════
   FOODSTEPS — script.js
═══════════════════════════════════════════ */

/* ── Navbar: shadow on scroll ── */
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
   FOODY — AI-style baby food recommender chatbot
   Flow: welcome → age → preference → need → recommendation
═══════════════════════════════════════════════════════════════ */

const PRODUCTS = {
  carrot: {
    emoji: '🥕🍎',
    name: 'Carrot, Apple & Ragi',
    badge: '6m+ · 100g',
    desc: 'Iron-rich Ragi supercharges growth, apple adds natural sweetness, and carrot provides essential beta-carotene. Perfect first superfood.',
    link: 'https://www.amazon.in',
    tags: ['Iron-rich', 'Superfood', 'Veg+Fruit'],
  },
  sweetpotato: {
    emoji: '🍠🍌',
    name: 'Purple Sweet Potato, Banana & Dates',
    badge: '6m+ · 100g',
    desc: 'Natural sweetness from dates, steady energy from banana, and powerful antioxidants from purple sweet potato. Great for on-the-go.',
    link: 'https://www.amazon.in',
    tags: ['Sweet', 'Energy-boost', 'Travel-friendly'],
  },
  banana: {
    emoji: '🍌🍓',
    name: 'Banana, Strawberry & Oats',
    badge: '6m+ · 100g',
    desc: 'Fibre from oats keeps tummies happy, Vitamin C from strawberry boosts immunity, and banana makes every spoonful irresistible.',
    link: 'https://www.amazon.in',
    tags: ['Fruit-forward', 'Gentle', 'Fibre-rich'],
  },
};

/* Recommendation engine — takes age + pref + need, returns array of product keys */
function recommend(age, pref, need) {
  let scores = { carrot: 0, sweetpotato: 0, banana: 0 };

  // Age scoring
  if (age === '6-8m')  { scores.carrot += 3; scores.banana += 2; }
  if (age === '9-12m') { scores.sweetpotato += 3; scores.carrot += 2; scores.banana += 2; }
  if (age === '12-18m'){ scores.sweetpotato += 3; scores.banana += 3; scores.carrot += 1; }
  if (age === '18m+')  { scores.sweetpotato += 2; scores.banana += 3; scores.carrot += 2; }

  // Preference scoring
  if (pref === 'fruits') { scores.banana += 3; scores.sweetpotato += 2; }
  if (pref === 'veggies'){ scores.carrot += 3; }
  if (pref === 'mix')    { scores.carrot += 2; scores.banana += 2; scores.sweetpotato += 1; }
  if (pref === 'unsure') { scores.carrot += 1; scores.banana += 1; scores.sweetpotato += 1; }

  // Need scoring
  if (need === 'iron')   { scores.carrot += 4; }
  if (need === 'energy') { scores.sweetpotato += 4; }
  if (need === 'gentle') { scores.banana += 3; scores.carrot += 1; }
  if (need === 'sweet')  { scores.sweetpotato += 4; scores.banana += 2; }

  // Sort by score and return top 2
  return Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(e => e[0]);
}

/* Chat state */
let foodyState = { step: 0, age: null, pref: null, need: null };

const foodyTrigger  = document.getElementById('foodyTrigger');
const foodyPanel    = document.getElementById('foodyPanel');
const foodyClose    = document.getElementById('foodyClose');
const foodyMessages = document.getElementById('foodyMessages');
const foodyReplies  = document.getElementById('foodyReplies');

foodyTrigger.addEventListener('click', foodyOpen);
foodyClose.addEventListener('click',   foodyClosePanel);

function foodyOpen() {
  foodyPanel.classList.add('open');
  foodyTrigger.classList.add('hidden');
  if (foodyState.step === 0) {
    foodyState.step = 1;
    setTimeout(() => foodyBotMsg("Hi there! 👋 I'm <strong>Foody</strong>, your FoodSteps guide. I'll find the perfect puree for your little one in just 3 quick questions!"), 300);
    setTimeout(() => foodyAskAge(), 1400);
  }
}

function foodyClosePanel() {
  foodyPanel.classList.remove('open');
  foodyTrigger.classList.remove('hidden');
}

function foodyRestart() {
  foodyMessages.innerHTML = '';
  foodyReplies.innerHTML  = '';
  foodyState = { step: 0, age: null, pref: null, need: null };
  foodyOpen();
}

/* ── Message helpers ── */
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
  const wrap = foodyBotMsg(
    `<span class="foody-typing-dot"></span>
     <span class="foody-typing-dot"></span>
     <span class="foody-typing-dot"></span>`,
    'foody-typing'
  );
  return wrap;
}

function foodySetChips(chips) {
  foodyReplies.innerHTML = '';
  chips.forEach(({ label, value, cb }) => {
    const btn = document.createElement('button');
    btn.className = 'foody-chip';
    btn.textContent = label;
    btn.onclick = () => {
      foodyReplies.innerHTML = '';
      foodyUserMsg(label);
      cb(value);
    };
    foodyReplies.appendChild(btn);
  });
}

function foodyScrollBottom() {
  setTimeout(() => { foodyMessages.scrollTop = foodyMessages.scrollHeight; }, 50);
}


/* ── Step 1: Ask age ── */
function foodyAskAge() {
  foodyBotMsg('🍼 First up — <strong>how old is your baby?</strong>');
  foodySetChips([
    { label: '6 – 8 months',  value: '6-8m',  cb: onAge },
    { label: '9 – 12 months', value: '9-12m', cb: onAge },
    { label: '12 – 18 months',value: '12-18m',cb: onAge },
    { label: '18+ months',    value: '18m+',  cb: onAge },
  ]);
}

function onAge(val) {
  foodyState.age = val;
  const typing = foodyTyping();
  setTimeout(() => {
    typing.remove();
    foodyBotMsg('Great! Every age has its perfect flavour. 😊');
    setTimeout(() => foodyAskPref(), 700);
  }, 900);
}


/* ── Step 2: Ask preference ── */
function foodyAskPref() {
  foodyBotMsg('🌈 What does your little one <strong>enjoy most?</strong>');
  foodySetChips([
    { label: '🍓 Loves fruits',   value: 'fruits',  cb: onPref },
    { label: '🥕 Loves veggies',  value: 'veggies', cb: onPref },
    { label: '🌈 Mix of both',    value: 'mix',     cb: onPref },
    { label: '🤔 Not sure yet',   value: 'unsure',  cb: onPref },
  ]);
}

function onPref(val) {
  foodyState.pref = val;
  const typing = foodyTyping();
  setTimeout(() => {
    typing.remove();
    foodyBotMsg('Noted! One last thing and I\'ll have the perfect picks ready. ✨');
    setTimeout(() => foodyAskNeed(), 700);
  }, 900);
}


/* ── Step 3: Ask special need ── */
function foodyAskNeed() {
  foodyBotMsg('💡 Any <strong>special priority</strong> for your baby right now?');
  foodySetChips([
    { label: '🌾 Boost iron & growth', value: 'iron',   cb: onNeed },
    { label: '⚡ High energy',         value: 'energy', cb: onNeed },
    { label: '🌸 Gentle on tummy',     value: 'gentle', cb: onNeed },
    { label: '🍬 Something sweet',     value: 'sweet',  cb: onNeed },
  ]);
}

function onNeed(val) {
  foodyState.need = val;
  const typing = foodyTyping();
  setTimeout(() => {
    typing.remove();
    foodyBotMsg('Perfect! Let me find the best matches for your little one… 🔍');
    const typing2 = foodyTyping();
    setTimeout(() => {
      typing2.remove();
      foodyShowResults();
    }, 1400);
  }, 900);
}


/* ── Step 4: Show results ── */
function foodyShowResults() {
  const picks = recommend(foodyState.age, foodyState.pref, foodyState.need);
  const [top, second] = picks;

  foodyBotMsg(`🎉 Here's my <strong>top pick</strong> for your baby:`);

  setTimeout(() => {
    foodyProductCard(PRODUCTS[top]);
    setTimeout(() => {
      if (second) {
        foodyBotMsg(`You might also love this one:`);
        setTimeout(() => {
          foodyProductCard(PRODUCTS[second]);
          setTimeout(() => {
            foodyBotMsg('All FoodSteps pouches are 100% natural, non-GMO, and come with a spoon! 🥄');
            foodySetChips([
              { label: '🔄 Try again', value: '', cb: () => foodyRestart() },
              { label: '🛒 See all products', value: '', cb: () => {
                foodyClosePanel();
                document.querySelector('#products').scrollIntoView({ behavior: 'smooth' });
              }},
            ]);
          }, 600);
        }, 400);
      } else {
        foodySetChips([
          { label: '🔄 Try again',         value: '', cb: () => foodyRestart() },
          { label: '🛒 See all products',   value: '', cb: () => {
            foodyClosePanel();
            document.querySelector('#products').scrollIntoView({ behavior: 'smooth' });
          }},
        ]);
      }
    }, 400);
  }, 400);
}

function foodyProductCard(p) {
  const card = document.createElement('div');
  card.className = 'foody-product-card';
  card.innerHTML = `
    <div class="foody-product-card-header">
      <span class="foody-product-emoji">${p.emoji}</span>
      <div>
        <div class="foody-product-name">${p.name}</div>
        <span class="foody-product-badge">${p.badge}</span>
      </div>
    </div>
    <p class="foody-product-desc">${p.desc}</p>
    <a href="${p.link}" target="_blank" rel="noopener" class="foody-product-cta">
      🛒 Buy on Amazon
    </a>`;
  foodyMessages.appendChild(card);
  foodyScrollBottom();
}
