# FoodSteps — Project Documentation

> **Retired 25 Sep 2026.** The site now lives in `../foodsteps-next` (Next.js, https://foodsteps-next.vercel.app). `index.html` here only redirects there. The last full HTML version (including the Foody chatbot) is git tag `html-site-final` — `git show html-site-final:index.html`. `script.js` still holds the chatbot code.

> Read this first in every new session before touching any file.

---

## Project Overview

**FoodSteps** is a premium organic baby food brand website for **Xobu Food & Beverages Pvt Ltd**, Tumkur, Karnataka, India. The site sells fruit & veggie puree pouches for babies 6 months and above.

| | |
|---|---|
| **Live URL** | https://baburao.github.io/foodsteps/ |
| **GitHub** | https://github.com/baburao/foodsteps |
| **Local dev** | http://localhost:5500/index.html |
| **Owner email** | baburao.jbr@gmail.com |

### How to run locally
Start the preview server named `foodsteps` (port 5500) via the Claude Preview tool — it serves the `foodsteps/` folder directly. Then navigate to `http://localhost:5500/index.html`. Or run:
```bash
npx http-server /Users/baburao/Desktop/works/Claude/foodsteps -p 5500 --cors -c-1
```

---

## Tech Stack

| Layer | Choice |
|---|---|
| Markup | Pure HTML5 (single `index.html`) |
| Styling | Vanilla CSS with custom properties (`style.css`) |
| JS | Vanilla JS, no frameworks (`script.js`) |
| Fonts | Google Fonts — Playfair Display · DM Sans · Caveat |
| Hosting | GitHub Pages (auto-deploy on push to `main`) |
| Assets | `/assets/` — PNG images |

**No build step. No npm. No bundler.**

---

## File Structure

```
foodsteps/
├── CLAUDE.md                         ← you are here
├── index.html                        ← full single-page site
├── style.css                         ← all styles
├── script.js                         ← all interactions
└── assets/
    ├── logo.png                      ← brand logo (handwritten "foodsteps")
    ├── Hero_banner.png / Hero_banner1.png  ← hero section backgrounds
    ├── S3_spinach/pumpkin/potato.png  ← Why FoodSteps section props
    ├── S4_toddler.png                ← About section lifestyle photo
    ├── safe_section_bg.png           ← Safe section marble background
    ├── Safe_product_photo.png        ← Safe section product (abs positioned right)
    ├── icon_zero/Nopreserv/madefor/Real/Gentle/Quality.png  ← Safe card icons
    ├── footer_asset1.png             ← Footer right prop (green apple)
    ├── footer_asset2.png             ← Footer left prop (spinach + peas)
    └── [product images: green-pack, orange-pack, purple-pack, etc.]
```

---

## Brand Identity

```css
--color-primary:  #4A7C59   /* brand green */
--color-accent:   #F4A261   /* warm orange */
--color-cream:    #FFFBF5   /* page background */
--color-dark:     #2C2C2C   /* body text */
```

**Fonts:** `Playfair Display` (headings) · `DM Sans` (body) · `Caveat` (script/handwritten accent)

---

## Cache Busting

Both asset files use `?v=N` query params. **Always increment when changing either file:**

```html
<link rel="stylesheet" href="style.css?v=62" />
<script src="script.js?v=17"></script>
```

Current versions: **style.css → v62** · **script.js → v17**

---

## What's Been Built

| # | Section | Status | Notes |
|---|---|---|---|
| 1 | **Navbar** | ✅ Done | Glassmorphism sticky nav, mobile hamburger, active link highlight |
| 2 | **Hero** | ✅ Done | Full-width banner with headline + CTA. Background: `Hero_banner.png` |
| 3 | **Why FoodSteps** | ✅ Done | Feature cards with prop images (spinach, pumpkin, potato). `section_3_bg.png` background |
| 4 | **Products** | ✅ Done | 3 product cards (green / orange / purple packs). Food-delivery card style |
| 5 | **About Us** | ✅ Done | `S4_toddler.png` lifestyle photo. Left col wider (grid `3fr 2fr`). Floating stat badges |
| 6 | **Testimonials** | ✅ Done | 3 colored-border cards (Sarah/James/Priya). Decorative script texts + prop placeholders |
| 7 | **Safe for Your Little One** | ✅ Done | `safe_section_bg.png` full-section bg. `Safe_product_photo.png` abs-right. 6 feature cards (3×2 grid) with per-card tinted bg. Top+bottom fog transitions blend with adjacent sections. Content max-width 80% |
| 8 | **Marketplace** | ⏸ Hidden | `display: none` — will redesign when ready |
| 9 | **Contact** | ✅ Done | Phone · Email · Address + contact form |
| 10 | **Footer** | ✅ Done | Dark forest green (`#0E1F0E`). 5-column: Brand / Quick Links / Shop / Contact / Stay Updated. Handwritten scripts, social icons, decorative props (apple + spinach/peas), bottom bar |
| — | **Foody chatbot** | ✅ Done | Floating "Ask Foody" widget. Age → preference → need → product recommendation |

---

## Section Background / Color Chain

Used for fog/blend transitions between sections:

| Section | Background |
|---|---|
| Hero | `Hero_banner.png` |
| Why FoodSteps | `section_3_bg.png` |
| Products | cream `#FFFBF5` |
| About | `section_2-bg.png` |
| Testimonials | `#FEFAF2` |
| **Safe** | `safe_section_bg.png` — fog top from `#FEFAF2`, fog bottom to `#FFFDF8` |
| Marketplace | hidden |
| Contact | default page bg `#FFFDF8` |
| Footer | `#0E1F0E` dark green |

---

## Key CSS Patterns

**Fog transitions** (Safe section top/bottom merge):
```css
.safe::before { /* top — fades from Testimonials #FEFAF2 */ }
.safe::after  { /* bottom — fades into Contact #FFFDF8 */ }
```

**Absolute-positioned product photo** (Safe section):
```css
.safe-product-img { position: absolute; right: 0; bottom: 0; width: clamp(300px, 38%, 520px); }
```

**About section grid** (left photo bigger):
```css
.about-inner { grid-template-columns: 3fr 2fr; }
```

---

## Pending Tasks

- [ ] **Marketplace section** — currently hidden; redesign when ready
- [ ] **Contact section** — functional but may need visual redesign
- [ ] **Mobile responsive check** — Safe section and Footer on small screens
- [ ] Add real **Amazon / Flipkart product URLs** (currently placeholder links)
- [ ] `S5_spinach.png` and `S5_carrot.png` — Testimonials prop assets (user to provide)
- [ ] "Good food fuels brighter days" text baked into `S4_toddler.png` — may need new photo

---

## Known Issues

| Issue | Detail |
|---|---|
| Preview DPR=2 | Screenshots render small; use `getBoundingClientRect()` or JS for measurements |
| Cache busting | Always increment `?v=N` in `index.html` when editing `style.css` or `script.js` |
| GitHub Pages delay | ~1–2 min after `git push` for live site to update |
| Toddler photo text | "Good food fuels brighter days" is baked into `S4_toddler.png` |

---

## Deployment

```bash
cd /Users/baburao/Desktop/works/Claude/foodsteps
git add .
git commit -m "your message"
git push
# Live at https://baburao.github.io/foodsteps/ in ~1 min
```
