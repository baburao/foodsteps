# FoodSteps — Project Documentation

> Read this first in every new session before touching any file.

---

## Project Overview

**FoodSteps** is a premium organic baby food brand website for **Xobu Food & Beverages Pvt Ltd**, Tumkur, Karnataka, India. The site sells fruit & veggie puree pouches for babies 6 months and above.

| | |
|---|---|
| **Live URL** | https://baburao.github.io/foodsteps/ |
| **GitHub** | https://github.com/baburao/foodsteps |
| **Local dev** | http://localhost:5500/foodsteps/index.html |
| **Owner email** | baburao.jbr@gmail.com |

### How to run locally
Start the preview server named `add-family-member` (port 5500) via the Claude Preview tool, then navigate to `/foodsteps/index.html`. Or run:
```bash
npx http-server /Users/baburao/Desktop/works/Claude -p 5500
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
| Assets | `/assets/` — PNG images only so far |

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
    ├── food-packs.png                ← all 3 pouches together (hero was, now removed)
    ├── purple-sweet-potato.png       ← single product pouch shot (used in product card)
    └── baby-purple-sweet-potato.png  ← lifestyle photo: baby eating (used in About)
```

---

## Brand Identity

```css
--color-primary:       #4A7C59   /* brand green */
--color-accent:        #F4A261   /* warm orange */
--color-cream:         #FFFBF5   /* page background */
--color-dark:          #2C2C2C   /* body text */

/* Fruit palette (added for color refresh) */
--fruit-yellow-bg:    #FFFBDD
--fruit-orange:       #FF8C42
--fruit-lime:         #6BCB77
--fruit-berry:        #9B5DE5
--fruit-strawberry:   #FF6B6B
--fruit-peach:        #FFAB76
```

**Fonts:** `Playfair Display` (headings) · `DM Sans` (body) · `Caveat` (script/handwritten accent)

---

## Cache Busting

Both asset files use `?v=N` query params. **Always increment when changing either file:**

```html
<link rel="stylesheet" href="style.css?v=11" />
<script src="script.js?v=11"></script>
```

Current version: **v11** → next change should use **v12**.

---

## What's Been Built

| # | Section | Status | Notes |
|---|---|---|---|
| 1 | **Navbar** | ✅ Done | Glassmorphism (rgba 18% + blur 24px), sticky, mobile hamburger, active link highlight |
| 2 | **Hero** | ✅ Done | Headline + CTA. Three accordion cards (Starters / Explorers / Toddlers) expand on **hover** (desktop), tap (mobile). Flex-grow animation |
| 3 | **Why FoodSteps** | ✅ Done | 2-column zigzag sticky-notes board. 3D pushpins, dashed SVG connectors, ruled-paper bg |
| 4 | **Products** | 🔄 Redesigning | 3 product cards. Currently: yellow bg, star ratings, Best Seller badge. **Being redesigned** to food-delivery card style (floating image, solid color bg, price badge) |
| 5 | **About Us** | ✅ Done | Lifestyle photo (`baby-purple-sweet-potato.png`) with floating "100% Natural" / "6m+" stat badges |
| 6 | **Testimonials** | ✅ Done | 3 colorful cards (yellow / peach / lavender), fruit-colored quote marks |
| 7 | **Trust Badges** | ✅ Done | 6 colorful badges — FSSAI, Non-GMO, No Sugar, No Preservatives, Gluten Free, Vegetarian |
| 8 | **Marketplace** | ✅ Done | Amazon + Flipkart CTA buttons |
| 9 | **Contact** | ✅ Done | Phone · Email · Address + contact form |
| 10 | **Footer** | ✅ Done | Logo + nav links + newsletter subscribe |
| — | **Foody chatbot** | ✅ Done | Floating "Ask Foody" widget. 3-step flow: age → preference → need → recommends product. Rule-based scoring engine |

---

## Current Task

**Redesigning the Products section** to match a food-delivery-style card UI (reference provided by user):

### Target design
- Product image **floating/overlapping above** the card (not inside a box at top)
- Card has **solid gradient background** (orange / purple / yellow per product)
- Circular **white price/weight badge** overlapping top-right
- **Script font** sub-label (e.g. "Carrot,") + **bold large title** (e.g. "Apple & Ragi")
- Star rating row
- Tags with semi-transparent pill style
- Dark pill **"Buy on Amazon"** button at bottom

---

## Pending Tasks

- [ ] **Products redesign** — food-delivery card style (in progress this session)
- [ ] Add actual **Amazon / Flipkart product URLs** (currently placeholder `https://www.amazon.in`)
- [ ] Add **real product images** to Card 1 (Carrot) and Card 3 (Banana) — only Card 2 has a real photo
- [ ] User said they'll add more **images and videos** to `assets/` — integrate when added
- [ ] Full **fruit-color redesign** of remaining sections after Products (About bg already updated)

---

## Known Issues

| Issue | Detail |
|---|---|
| Preview DPR=2 | Screenshot tool renders at ~0.31× CSS scale. Measurements via `getBoundingClientRect()` are correct; visual screenshots look small |
| Cache busting | Always increment `?v=N` in both `index.html` references when editing CSS or JS |
| GitHub Pages delay | ~1–2 min after `git push` for live site to update |
| Product images | Only `purple-sweet-potato.png` exists. Cards 1 and 3 use emoji placeholders |
| No prices | Amazon pricing varies; product cards link to Amazon but don't show INR prices |

---

## Deployment

```bash
cd /Users/baburao/Desktop/works/Claude/foodsteps
git add .
git commit -m "your message"
git push
# Live at https://baburao.github.io/foodsteps/ in ~1 min
```
