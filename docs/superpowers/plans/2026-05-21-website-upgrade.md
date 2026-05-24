# Website Upgrade Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade the Opra website visual quality and interactivity by tightening the glass card treatment, replacing CSS transitions with Motion.js spring physics, enhancing the globe, and fixing accessibility/UX gaps.

**Architecture:** Pure vanilla HTML/CSS/JS site — no build toolchain. All changes are direct edits to source files. Motion.js is loaded via CDN. A new `motion-controller.js` owns all spring animation logic. Globe changes are surgical additions to existing functions in `globe.js`.

**Tech Stack:** Vanilla HTML/CSS/JS, Motion.js v12 (CDN), Canvas API (globe), Airtable (form backend on Vercel)

**Spec:** `docs/superpowers/specs/2026-05-21-website-upgrade-design.md`

---

## File Map

| File | Change type | Responsibility |
|---|---|---|
| `index.html` | Modify | CSS tightening, HTML additions, JS cleanup, script tags |
| `motion-controller.js` | Create | All spring hover + scroll reveal + corner-tag fade |
| `globe.js` | Modify | Reduced-motion, tab pause, Africa dots, limb glow, arc connections |
| `scroll-controller.js` | Modify | Mouse parallax |
| `api/submit.js` | Modify | Add `message` field passthrough to Airtable |
| `og-image-generator.html` | Create | Canvas-based PNG generator for meta assets |
| `og-image.png` | Create | 1200×630 social preview (generated from above) |
| `logo.png` | Create | 512×512 brand lockup (generated from above) |

---

## Task 1: CSS — Tighten Glass Card Treatment

**Files:**
- Modify: `index.html` (CSS block only, lines 51–657)

- [ ] **Step 1: Update card container CSS**

In `index.html`, find the CSS rule for `.pain-list li` (~line 308) and replace:
```css
.pain-list li {
  display: flex; align-items: flex-start; gap: 16px;
  padding: 18px 20px;
  border: 1px solid var(--line);
  border-radius: 12px;
  background: rgba(11,15,21,0.55);
  backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
  font-size: 15px; line-height: 1.45;
  color: var(--ink-dim);
}
```
With:
```css
.pain-list li {
  display: flex; align-items: flex-start; gap: 16px;
  padding: 18px 20px;
  border: 1px solid rgba(255,255,255,0.11);
  border-radius: 6px;
  background: rgba(11,15,21,0.88);
  backdrop-filter: blur(3px); -webkit-backdrop-filter: blur(3px);
  font-size: 15px; line-height: 1.45;
  color: var(--ink-dim);
  position: relative; overflow: hidden;
}
```

- [ ] **Step 2: Update `.service-card` CSS**

Find `.service-card` (~line 337) and replace:
```css
.service-card {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 22px;
  align-items: center;
  padding: 24px 26px;
  border: 1px solid var(--line);
  border-radius: 14px;
  background: rgba(11,15,21,0.55);
  backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
  transition: all .25s;
  cursor: pointer;
}
```
With:
```css
.service-card {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 22px;
  align-items: center;
  padding: 24px 26px;
  border: 1px solid rgba(255,255,255,0.11);
  border-radius: 6px;
  background: rgba(11,15,21,0.88);
  backdrop-filter: blur(3px); -webkit-backdrop-filter: blur(3px);
  cursor: pointer;
  position: relative; overflow: hidden;
}
```

- [ ] **Step 3: Remove `.service-card:hover` and `.service-card.is-active` CSS hover block**

Find and delete these rules entirely (Motion will own hover state):
```css
.service-card:hover {
  border-color: var(--line-2);
  background: rgba(11,15,21,0.78);
  transform: translateY(-1px);
  box-shadow: 0 8px 24px rgba(124,227,255,0.07);
}
```

- [ ] **Step 4: Update `.process-step` CSS**

Find `.process-step` (~line 385) and replace:
```css
.process-step {
  text-align: left;
  padding: 22px 20px;
  border: 1px solid var(--line);
  border-radius: 12px;
  background: rgba(11,15,21,0.55);
  backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
  min-height: 180px;
  display: flex; flex-direction: column;
  transition: all .3s;
}
```
With:
```css
.process-step {
  text-align: left;
  padding: 22px 20px;
  border: 1px solid rgba(255,255,255,0.11);
  border-radius: 6px;
  background: rgba(11,15,21,0.88);
  backdrop-filter: blur(3px); -webkit-backdrop-filter: blur(3px);
  min-height: 180px;
  display: flex; flex-direction: column;
  position: relative; overflow: hidden;
}
```

- [ ] **Step 5: Remove `.process-step:hover` block**

Find and delete:
```css
.process-step:hover {
  border-color: rgba(124,227,255,0.4);
  background: rgba(11,15,21,0.78);
  transform: translateY(-2px);
  box-shadow: inset 2px 0 0 var(--accent), 0 8px 28px rgba(124,227,255,0.07);
}
```

- [ ] **Step 6: Update `.work-card` CSS**

Find `.work-card` (~line 429) and replace:
```css
.work-card {
  padding: 22px;
  border: 1px solid var(--line);
  border-radius: 12px;
  background: rgba(11,15,21,0.6);
  backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
  transition: all .25s;
  cursor: pointer;
  display: flex; flex-direction: column; gap: 10px;
  min-height: 180px;
}
```
With:
```css
.work-card {
  padding: 22px;
  border: 1px solid rgba(255,255,255,0.11);
  border-radius: 6px;
  background: rgba(11,15,21,0.88);
  backdrop-filter: blur(3px); -webkit-backdrop-filter: blur(3px);
  cursor: pointer;
  display: flex; flex-direction: column; gap: 10px;
  min-height: 180px;
  position: relative; overflow: hidden;
}
```

- [ ] **Step 7: Remove `.work-card:hover` block**

Find and delete:
```css
.work-card:hover { border-color: rgba(124,227,255,0.2); transform: translateY(-2px); box-shadow: 0 8px 32px rgba(124,227,255,0.08); }
```

- [ ] **Step 8: Update `form.contact` CSS**

Find `form.contact` (~line 485) and update:
```css
form.contact {
  padding: 32px;
  border: 1px solid rgba(255,255,255,0.11);
  border-radius: 6px;
  background: rgba(11,15,21,0.88);
  backdrop-filter: blur(3px); -webkit-backdrop-filter: blur(3px);
  display: flex; flex-direction: column; gap: 16px;
}
```

- [ ] **Step 9: Remove CSS transitions from buttons and nav**

Find and update `.btn-primary, .btn-ghost`:
```css
.btn-primary, .btn-ghost {
  font-family: var(--sans); font-size: 14px; font-weight: 500;
  padding: 14px 22px; border-radius: 999px;
  text-decoration: none;
  display: inline-flex; align-items: center; gap: 8px;
  cursor: pointer; border: none;
}
```

Find `.nav-cta` and remove `transition: all .2s;` from it.

Find `.nav-cta:hover` and remove it entirely (Motion handles hover color).

Find `.arrow` rule and delete it:
```css
.arrow { transition: transform .2s; }
.btn-primary:hover .arrow { transform: translateX(2px); }
```

- [ ] **Step 10: Add `.accent-bar` CSS class**

Add this rule after the `.work-card` block:
```css
.accent-bar {
  position: absolute;
  left: 0; top: 15%; bottom: 15%;
  width: 2px; background: var(--accent);
  border-radius: 2px;
  transform: scaleY(0);
  transform-origin: center;
  pointer-events: none;
}
```

- [ ] **Step 11: Update pain-list hover (remove old CSS hover, add border-color only)**

Find the existing pain list hover rules and replace:
```css
/* Pain list item hover */
.pain-list li { transition: border-color .25s, background .25s, box-shadow .25s; }
.pain-list li:hover {
  border-color: rgba(124,227,255,0.22);
  background: rgba(11,15,21,0.78);
  box-shadow: inset 2px 0 0 var(--accent);
}
```
With (CSS only handles background on hover; Motion handles the border and accent bar):
```css
.pain-list li {
  transition: background 0.15s ease;
}
.pain-list li:hover {
  background: rgba(11,15,21,0.95);
}
```

- [ ] **Step 12: Remove scroll reveal CSS classes**

Find and delete the entire scroll reveal CSS block (~lines 636–656):
```css
/* Scroll reveal — text elements (fade + slide) */
.fade-up { ... }
.fade-up.visible { ... }
/* Scroll reveal — glass cards (opacity only...) */
.fade-in { ... }
.fade-in.visible { ... }
/* Stagger delays for grouped items */
[data-d="1"] { ... }
[data-d="2"] { ... }
...
[data-d="6"] { ... }
```

- [ ] **Step 13: Fix process grid mobile breakpoints**

Find the `@media (max-width: 540px)` block and replace:
```css
@media (max-width: 540px) {
  .process-grid { grid-template-columns: 1fr; }
  section { padding: 80px 22px; }
}
```
With:
```css
@media (max-width: 540px) {
  .process-grid { grid-template-columns: 1fr 1fr; }
  section { padding: 80px 22px; }
}
@media (max-width: 400px) {
  .process-grid { grid-template-columns: 1fr; }
}
```

- [ ] **Step 14: Verify visually**

Open `index.html` in a browser. Check:
- All cards have tighter corners (6px), less frosted glass, more solid dark background
- No hover effects fire on any card (CSS transitions removed — Motion not yet wired)
- Form container matches cards visually

- [ ] **Step 15: Commit**

```bash
cd /Users/jjarlow/Documents/Opra/Code/Website/Opra
git add index.html
git commit -m "style: tighten glass card treatment, remove CSS transitions for Motion handoff"
```

---

## Task 2: index.html — HTML Additions and JS Cleanup

**Files:**
- Modify: `index.html` (HTML structure, inline JS block)

- [ ] **Step 1: Add canvas accessibility attributes**

Find `<canvas id="globe">` and replace with:
```html
<canvas id="globe" role="img" aria-label="Animated globe showing Opra's global network"></canvas>
```

- [ ] **Step 2: Add aria-live status region for form**

Find `</form>` (the closing tag of `form.contact`) and add immediately after it:
```html
<div id="formStatus" role="status" aria-live="polite" style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;"></div>
```

- [ ] **Step 3: Add "What are you trying to solve?" textarea**

Find the email label in `form.contact`:
```html
<label>Email address<input type="email" name="email" required /></label>
```
Add the new textarea immediately after it:
```html
<label>Email address<input type="email" name="email" required /></label>
<label>What are you trying to solve?
  <textarea name="message" rows="3" placeholder="Briefly describe the problem or system you want built"></textarea>
</label>
```

- [ ] **Step 4: Remove the IntersectionObserver scroll-reveal JS block**

Find and delete the entire `/* ── SCROLL REVEAL ── */` block from the inline `<script>` at the bottom of `<body>`. It starts with:
```js
/* ── SCROLL REVEAL ── */
(function () {
  // Text elements in non-hero sections: fade + slide up
  document.querySelectorAll('section:not(#hero)')...
```
And ends before `/* ── FORM ── */`. Delete the entire IIFE (~30 lines).

- [ ] **Step 5: Update form JS to write to aria-live region**

In the inline form script, find the success handler:
```js
if (res.ok) {
  btn.textContent = 'Submitted — we will be in touch within 4 hours.';
  btn.style.background = 'rgba(124,227,255,0.15)';
  btn.style.color = 'var(--accent)';
  btn.style.borderColor = 'rgba(124,227,255,0.3)';
  form.reset();
}
```
Replace with:
```js
if (res.ok) {
  btn.textContent = 'Submitted — we will be in touch within 4 hours.';
  btn.style.background = 'rgba(124,227,255,0.15)';
  btn.style.color = 'var(--accent)';
  btn.style.borderColor = 'rgba(124,227,255,0.3)';
  const status = document.getElementById('formStatus');
  if (status) status.textContent = 'Submitted — we will be in touch within 4 hours.';
  form.reset();
}
```

Find the two error handler lines:
```js
btn.textContent = 'Something went wrong — email us directly.';
```
After each one, add:
```js
const status = document.getElementById('formStatus');
if (status) status.textContent = 'Something went wrong — email us directly.';
```

- [ ] **Step 6: Add Motion CDN and motion-controller.js script tags**

Find the existing script tags at the bottom of `<body>`:
```html
<script src="globe.js"></script>
<script src="scroll-controller.js"></script>
```
Replace with:
```html
<script src="globe.js"></script>
<script src="scroll-controller.js"></script>
<script src="https://cdn.jsdelivr.net/npm/motion@12/dist/motion.js"></script>
<script src="motion-controller.js"></script>
```

- [ ] **Step 7: Verify**

Open `index.html` in browser. Check:
- Form has the new textarea field with placeholder text
- No JS errors in console (Motion CDN will 404 since motion-controller.js doesn't exist yet — that's fine)
- Process grid shows 2 columns on a 500px-wide viewport

- [ ] **Step 8: Commit**

```bash
git add index.html
git commit -m "feat: add form textarea, aria-live region, canvas a11y, script tags, remove scroll reveal JS"
```

---

## Task 3: Create motion-controller.js — Hover Springs

**Files:**
- Create: `motion-controller.js`

- [ ] **Step 1: Create the file with hover spring logic**

Create `/Users/jjarlow/Documents/Opra/Code/Website/Opra/motion-controller.js`:

```js
(function () {
  function initHovers() {
    const { animate } = window.Motion;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) return;

    function injectBar(el) {
      const bar = document.createElement('span');
      bar.className = 'accent-bar';
      el.appendChild(bar);
      return bar;
    }

    // Service cards — arrow slides, accent bar scales in
    document.querySelectorAll('.service-card').forEach(function (card) {
      const bar = injectBar(card);
      const arrow = card.querySelector('.svc-arrow');
      card.addEventListener('mouseenter', function () {
        card.style.borderColor = 'rgba(124,227,255,0.32)';
        card.style.boxShadow = '0 0 0 1px rgba(124,227,255,0.08), 0 6px 20px rgba(124,227,255,0.09)';
        animate(bar, { scaleY: 1 }, { type: 'spring', stiffness: 320, damping: 22 });
        if (arrow) animate(arrow, { x: 5 }, { type: 'spring', stiffness: 320, damping: 22 });
      });
      card.addEventListener('mouseleave', function () {
        card.style.borderColor = 'rgba(255,255,255,0.11)';
        card.style.boxShadow = 'none';
        animate(bar, { scaleY: 0 }, { type: 'spring', stiffness: 320, damping: 22 });
        if (arrow) animate(arrow, { x: 0 }, { type: 'spring', stiffness: 320, damping: 22 });
      });
    });

    // Pain list rows — accent bar scales in from centre
    document.querySelectorAll('.pain-list li').forEach(function (item) {
      const bar = injectBar(item);
      item.addEventListener('mouseenter', function () {
        item.style.borderColor = 'rgba(124,227,255,0.22)';
        animate(bar, { scaleY: 1 }, { type: 'spring', stiffness: 280, damping: 20 });
      });
      item.addEventListener('mouseleave', function () {
        item.style.borderColor = 'rgba(255,255,255,0.11)';
        animate(bar, { scaleY: 0 }, { type: 'spring', stiffness: 280, damping: 20 });
      });
    });

    // Process steps — lift with left border flash
    document.querySelectorAll('.process-step').forEach(function (step) {
      step.addEventListener('mouseenter', function () {
        step.style.borderColor = 'rgba(124,227,255,0.4)';
        step.style.boxShadow = 'inset 2px 0 0 #7CE3FF, 0 8px 28px rgba(124,227,255,0.07)';
        animate(step, { y: -3 }, { type: 'spring', stiffness: 260, damping: 18 });
      });
      step.addEventListener('mouseleave', function () {
        step.style.borderColor = 'rgba(255,255,255,0.11)';
        step.style.boxShadow = 'none';
        animate(step, { y: 0 }, { type: 'spring', stiffness: 260, damping: 18 });
      });
    });

    // Work cards — lift with glow
    document.querySelectorAll('.work-card').forEach(function (card) {
      card.addEventListener('mouseenter', function () {
        card.style.borderColor = 'rgba(124,227,255,0.2)';
        card.style.boxShadow = '0 8px 32px rgba(124,227,255,0.08)';
        animate(card, { y: -3 }, { type: 'spring', stiffness: 260, damping: 20 });
      });
      card.addEventListener('mouseleave', function () {
        card.style.borderColor = 'rgba(255,255,255,0.11)';
        card.style.boxShadow = 'none';
        animate(card, { y: 0 }, { type: 'spring', stiffness: 260, damping: 20 });
      });
    });

    // Primary button and form submit — scale bounce + arrow slide
    document.querySelectorAll('.btn-primary, .submit').forEach(function (btn) {
      const arrow = btn.querySelector('.arrow');
      btn.addEventListener('mouseenter', function () {
        if (btn.disabled) return;
        animate(btn, { scale: 1.04 }, { type: 'spring', stiffness: 400, damping: 22 });
        if (arrow) animate(arrow, { x: 3 }, { type: 'spring', stiffness: 400, damping: 22 });
      });
      btn.addEventListener('mouseleave', function () {
        animate(btn, { scale: 1 }, { type: 'spring', stiffness: 400, damping: 22 });
        if (arrow) animate(arrow, { x: 0 }, { type: 'spring', stiffness: 400, damping: 22 });
      });
    });

    // Ghost button and nav CTA — colour only (short CSS transition sufficient, but spring for border)
    document.querySelectorAll('.btn-ghost, .nav-cta').forEach(function (el) {
      el.addEventListener('mouseenter', function () {
        animate(el, { borderColor: 'rgba(124,227,255,0.4)' }, { type: 'spring', stiffness: 300, damping: 24 });
      });
      el.addEventListener('mouseleave', function () {
        animate(el, { borderColor: 'rgba(255,255,255,0.14)' }, { type: 'spring', stiffness: 300, damping: 24 });
      });
    });
  }

  function initScrollReveals() {
    const { animate, inView } = window.Motion;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) return;

    function setInitial(els, y) {
      els.forEach(function (el) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(' + y + 'px)';
      });
    }

    function springIn(el, y, delay) {
      animate(el, { opacity: 1, y: [y, 0] }, {
        type: 'spring', stiffness: 200, damping: 26,
        delay: delay || 0,
      });
    }

    // Section text elements (non-hero)
    var textEls = Array.from(document.querySelectorAll(
      'section:not(#hero) .section-label, section:not(#hero) .section-title, section:not(#hero) .section-lead'
    ));
    setInitial(textEls, 18);
    textEls.forEach(function (el) {
      inView(el, function () {
        springIn(el, 18, 0);
      }, { once: true });
    });

    // Card groups — staggered by parent trigger
    var groups = [
      { parent: '.pain-list',    selector: '.pain-list li' },
      { parent: '.services-list', selector: '.service-card' },
      { parent: '.process-grid', selector: '.process-step' },
      { parent: '.work-grid',    selector: '.work-card' },
    ];
    groups.forEach(function (g) {
      var parent = document.querySelector(g.parent);
      if (!parent) return;
      var items = Array.from(parent.querySelectorAll(g.selector));
      setInitial(items, 12);
      inView(parent, function () {
        items.forEach(function (item, i) {
          springIn(item, 12, i * 0.07);
        });
      }, { once: true, margin: '0px 0px -32px 0px' });
    });

    // Contact section
    var contactMeta = document.querySelector('.contact-meta');
    var contactForm = document.querySelector('form.contact');
    [contactMeta, contactForm].forEach(function (el, i) {
      if (!el) return;
      el.style.opacity = '0';
      el.style.transform = 'translateY(18px)';
      inView(el, function () {
        springIn(el, 18, i * 0.14);
      }, { once: true });
    });
  }

  function initCornerTag() {
    const { animate } = window.Motion;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) return;

    var tag = document.querySelector('.corner-tag');
    if (!tag) return;
    var faded = false;

    window.addEventListener('scroll', function () {
      if (!faded && window.scrollY > 80) {
        faded = true;
        animate(tag, { opacity: 0 }, { duration: 0.3, easing: 'ease-out' });
      }
    }, { passive: true });
  }

  function init() {
    initHovers();
    initScrollReveals();
    initCornerTag();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
```

- [ ] **Step 2: Verify hover springs in browser**

Open `index.html`. Check:
- Hovering a service card: the `→` arrow should spring to the right with slight overshoot, a cyan bar should appear on the left edge
- Hovering a pain list item: cyan left bar should spring in
- Hovering a process step: card should lift 3px with spring overshoot
- Hovering a work card: card should lift 3px
- Hovering "Book a free consultation" button: scale bounces to 1.04 with overshoot
- Scrolling past hero 80px: "Scroll to explore" text fades out
- Check browser console — no errors

- [ ] **Step 3: Commit**

```bash
git add motion-controller.js
git commit -m "feat: add motion-controller.js with spring hover animations and scroll reveals"
```

---

## Task 4: motion-controller.js — Verify Scroll Reveals

**Files:**
- Verify: `motion-controller.js` (already written in Task 3)

- [ ] **Step 1: Verify scroll reveals in browser**

Open `index.html` and scroll through the full page. Check:
- Section labels, titles, and lead paragraphs in all non-hero sections start invisible and spring in as they enter the viewport
- Pain list items stagger in (each one slightly after the previous)
- Service cards stagger in
- Process steps stagger in
- Work cards stagger in
- Contact meta and form spring in sequentially
- No elements get stuck invisible (check all sections)
- After refreshing and scrolling fast, no elements remain invisible

- [ ] **Step 2: Verify reduced-motion**

In macOS: System Settings → Accessibility → Display → Reduce Motion (enable).
Reload the page. Check:
- All cards are immediately visible (no fade-in)
- No hover transforms occur
- Globe still renders as static sphere

Disable Reduce Motion again.

---

## Task 5: Globe — Reduced-Motion and Tab Visibility Pause

**Files:**
- Modify: `globe.js`

- [ ] **Step 1: Add prefers-reduced-motion check in init()**

In `globe.js`, find the `function init()` block (~line 493):
```js
function init() {
  resize();
  dots = makeDots(cfg.dots);
  particles = makeParticles(cfg.particles);
  events = [];
  lastT = performance.now();
  cancelAnimationFrame(raf);
  raf = requestAnimationFrame(draw);
}
```
Replace with:
```js
function init() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    cfg.speed = 0;
    cfg.particles = 0;
    cfg.showLines = false;
    target.spin = 0;
    state.spin = 0;
    target.eventsPerSec = 0;
    state.eventsPerSec = 0;
  }
  resize();
  dots = makeDots(cfg.dots);
  particles = makeParticles(cfg.particles);
  events = [];
  lastT = performance.now();
  cancelAnimationFrame(raf);
  raf = requestAnimationFrame(draw);

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      cancelAnimationFrame(raf);
      raf = 0;
    } else {
      lastT = performance.now();
      raf = requestAnimationFrame(draw);
    }
  });
}
```

- [ ] **Step 2: Verify tab pause**

Open `index.html`. Switch to another browser tab, wait 3 seconds, switch back. The globe animation should pause while hidden and resume smoothly (no jump/stutter) when the tab becomes active.

- [ ] **Step 3: Commit**

```bash
git add globe.js
git commit -m "feat: globe respects prefers-reduced-motion and pauses on hidden tab"
```

---

## Task 6: Globe — Africa Dot Cluster

**Files:**
- Modify: `globe.js`

- [ ] **Step 1: Update makeDots() to add Africa cluster**

Find `function makeDots(n)` (~line 118):
```js
function makeDots(n) {
  const arr = [];
  const phi = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = phi * i;
    arr.push({ x: Math.cos(theta) * r, y, z: Math.sin(theta) * r });
  }
  return arr;
}
```
Replace with:
```js
function makeDots(n) {
  const arr = [];
  const phi = Math.PI * (3 - Math.sqrt(5));
  const base = n - 80;
  for (let i = 0; i < base; i++) {
    const y = 1 - (i / (base - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = phi * i;
    arr.push({ x: Math.cos(theta) * r, y, z: Math.sin(theta) * r });
  }
  // Africa cluster: 80 extra dots near Southern Africa (lat -30, lon 26, radius ~18°)
  const clusterLat = -30 * (Math.PI / 180);
  const clusterLon = 26  * (Math.PI / 180);
  const clusterR   = 18  * (Math.PI / 180);
  const cx = Math.cos(clusterLat) * Math.cos(clusterLon);
  const cy = Math.sin(clusterLat);
  const cz = Math.cos(clusterLat) * Math.sin(clusterLon);
  for (let i = 0; i < 80; i++) {
    const u = Math.random();
    const v = Math.random();
    const theta = TAU * v;
    const phi2  = Math.acos(1 - u * (1 - Math.cos(clusterR)));
    // Rotate (0,0,1) by phi2 around a perpendicular axis, then align to cluster centre
    const sinP = Math.sin(phi2);
    const lx = sinP * Math.cos(theta);
    const ly = sinP * Math.sin(theta);
    const lz = Math.cos(phi2);
    // Rodrigues: rotate local z-axis to cluster centre
    const dot = cz;
    const ax = -cy, ay = cx, az = 0;
    const axLen = Math.sqrt(ax*ax + ay*ay + az*az);
    if (axLen < 1e-6) { arr.push({ x: lx, y: ly, z: lz }); continue; }
    const nx = ax/axLen, ny = ay/axLen, nz = az/axLen;
    const cosA = cz, sinA = Math.sqrt(1 - cz*cz);
    const d = lx*nx + ly*ny + lz*nz;
    arr.push({
      x: lx*cosA + (ny*lz - nz*ly)*sinA + nx*d*(1-cosA),
      y: ly*cosA + (nz*lx - nx*lz)*sinA + ny*d*(1-cosA),
      z: lz*cosA + (nx*ly - ny*lx)*sinA + nz*d*(1-cosA),
    });
  }
  return arr;
}
```

- [ ] **Step 2: Verify in browser**

Open `index.html`. The globe's Southern Africa region should appear slightly denser with dots compared to other regions. The difference is subtle — check by looking at Africa (roughly bottom-left quadrant of the globe at rest).

- [ ] **Step 3: Commit**

```bash
git add globe.js
git commit -m "feat: globe adds Africa dot density cluster around Southern Africa"
```

---

## Task 7: Globe — Limb Atmosphere Glow

**Files:**
- Modify: `globe.js`

- [ ] **Step 1: Add drawLimb() function**

In `globe.js`, find `function drawGlow(R)` (~line 276). Add the new `drawLimb` function immediately after the closing `}` of `drawGlow`:

```js
function drawLimb(R) {
  const ox = state.offsetX * W;
  const oy = state.offsetY * H;
  const grad = ctx.createRadialGradient(
    CX + ox, CY + oy, R * 0.82,
    CX + ox, CY + oy, R * 1.18
  );
  grad.addColorStop(0,    'rgba(0,0,0,0)');
  grad.addColorStop(0.45, accentA(0.045));
  grad.addColorStop(0.55, accentA(0.07));
  grad.addColorStop(0.65, accentA(0.045));
  grad.addColorStop(1,    'rgba(0,0,0,0)');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(CX + ox, CY + oy, R * 1.18, 0, TAU);
  ctx.fill();
}
```

- [ ] **Step 2: Call drawLimb() in draw()**

Find in `draw()`:
```js
if (cfg.glow) drawGlow(R);
if (cfg.showRings && state.ringOpacity > 0.02) drawRings(R);
```
Replace with:
```js
if (cfg.glow) drawGlow(R);
drawLimb(R);
if (cfg.showRings && state.ringOpacity > 0.02) drawRings(R);
```

- [ ] **Step 3: Verify in browser**

The globe should have a faint cyan atmospheric rim glow at its edge — like a planet's limb. It should be subtle (not overwhelming). Compare with and without by temporarily commenting out `drawLimb(R)`.

- [ ] **Step 4: Commit**

```bash
git add globe.js
git commit -m "feat: globe adds limb atmosphere glow at sphere edge"
```

---

## Task 8: Globe — Arc Connections on Event Pings

**Files:**
- Modify: `globe.js`

- [ ] **Step 1: Store origin vec in spawnEvent()**

Find `function spawnEvent(forced)` (~line 199):
```js
function spawnEvent(forced) {
  const city = CITIES[(Math.random() * CITIES.length) | 0];
  const ev = EVENTS[(Math.random() * EVENTS.length) | 0];
  const base = latLonToVec(city[0], city[1]);
  events.push({
    base, city: city[2], label: ev,
    t0: performance.now(),
    life: 4800,
    tangent: Math.random() * TAU,
  });
  if (events.length > 6) events.shift();
}
```
Replace with:
```js
function spawnEvent(forced) {
  const city = CITIES[(Math.random() * CITIES.length) | 0];
  const ev = EVENTS[(Math.random() * EVENTS.length) | 0];
  const base = latLonToVec(city[0], city[1]);
  // Origin is always Johannesburg; destination is the event city
  const origin = latLonToVec(-26.2041, 28.0473);
  events.push({
    base, city: city[2], label: ev,
    origin,
    t0: performance.now(),
    life: 4800,
    tangent: Math.random() * TAU,
  });
  if (events.length > 6) events.shift();
}
```

- [ ] **Step 2: Draw great-circle arc in drawEvents()**

Find `function drawEvents(R, now)` (~line 380). Inside the per-event loop, find where `ctx.restore()` is about to run and add the arc drawing code. Specifically, find the block that draws the line from city dot to label:
```js
ctx.strokeStyle = accentA(fade * 0.45);
ctx.lineWidth = 1;
ctx.beginPath();
ctx.moveTo(p.x, p.y);
ctx.lineTo(ex, ey);
ctx.stroke();
```
After that block (before the label pill drawing), add:
```js
// Great-circle arc from Johannesburg to event city
if (ev.origin) {
  const ov = applyGlobeRot(ev.origin);
  // Only draw if both endpoints are on the front hemisphere
  if (v.z > -0.2 && ov.z > -0.2) {
    const op = project(ov, R);
    const STEPS = 40;
    ctx.beginPath();
    ctx.strokeStyle = accentA(fade * 0.28);
    ctx.lineWidth = 1;
    for (let s = 0; s <= STEPS; s++) {
      const tArc = s / STEPS;
      // Slerp between origin and destination unit vectors
      const dot = ev.origin.x * ev.base.x + ev.origin.y * ev.base.y + ev.origin.z * ev.base.z;
      const clampedDot = Math.max(-1, Math.min(1, dot));
      const omega = Math.acos(clampedDot);
      let ax, ay, az;
      if (Math.abs(omega) < 1e-6) {
        ax = ev.origin.x; ay = ev.origin.y; az = ev.origin.z;
      } else {
        const sinO = Math.sin(omega);
        ax = (Math.sin((1 - tArc) * omega) / sinO) * ev.origin.x + (Math.sin(tArc * omega) / sinO) * ev.base.x;
        ay = (Math.sin((1 - tArc) * omega) / sinO) * ev.origin.y + (Math.sin(tArc * omega) / sinO) * ev.base.y;
        az = (Math.sin((1 - tArc) * omega) / sinO) * ev.origin.z + (Math.sin(tArc * omega) / sinO) * ev.base.z;
      }
      const sv = applyGlobeRot({ x: ax, y: ay, z: az });
      const sp = project(sv, R);
      if (s === 0) ctx.moveTo(sp.x, sp.y); else ctx.lineTo(sp.x, sp.y);
    }
    ctx.stroke();
  }
}
```

- [ ] **Step 3: Verify in browser**

Watch the globe for 10–15 seconds. When an event fires (a city ping appears), a faint arc should curve from the Johannesburg position to the destination city. The arc follows the sphere surface (not a straight line). If Johannesburg is the event city, the arc will be a point (that's fine).

- [ ] **Step 4: Commit**

```bash
git add globe.js
git commit -m "feat: globe draws great-circle arc from Johannesburg to event city on ping"
```

---

## Task 9: Globe — Mouse Parallax

**Files:**
- Modify: `scroll-controller.js`

- [ ] **Step 1: Add mouseOffsetX/Y variables and mousemove listener**

In `scroll-controller.js`, find the top of the IIFE (just after `(function () {`):
```js
(function () {
  const PRESETS = {
```
Add two variables and the mousemove listener after the PRESETS and SECTION_IDS declarations, just before `function lerp`:

```js
  let mouseOffsetX = 0;
  let mouseOffsetY = 0;

  window.addEventListener('mousemove', function (e) {
    mouseOffsetX = ((e.clientX / window.innerWidth)  - 0.5) * 0.06;
    mouseOffsetY = ((e.clientY / window.innerHeight) - 0.5) * 0.06;
    if (window.__opraGlobe) {
      // Trigger a re-render with the new mouse offset blended in
      if (raf) return;
      raf = requestAnimationFrame(function () {
        raf = null;
        onScroll();
      });
    }
  }, { passive: true });
```

- [ ] **Step 2: Blend mouse offset into setTarget call**

Find in `onScroll()`:
```js
      const blended = lerpPreset(PRESETS[prev.id], PRESETS[next.id], t);
      globe.setTarget(blended);
```
Replace with:
```js
      const blended = lerpPreset(PRESETS[prev.id], PRESETS[next.id], t);
      globe.setTarget(Object.assign({}, blended, {
        offsetX: blended.offsetX + mouseOffsetX,
        offsetY: blended.offsetY + mouseOffsetY,
      }));
```

- [ ] **Step 3: Verify in browser**

Open `index.html`. Move the mouse slowly around the screen. The globe should drift subtly toward the cursor — a slight parallax shift. The effect should be smooth (the globe's internal lerp handles it) and not jarring.

- [ ] **Step 4: Commit**

```bash
git add scroll-controller.js
git commit -m "feat: globe follows mouse with subtle parallax offset"
```

---

## Task 10: api/submit.js — Add Message Field

**Files:**
- Modify: `api/submit.js`

- [ ] **Step 1: Destructure message from request body**

Find line 64:
```js
  const { name, business, email, services, source } = req.body ?? {};
```
Replace with:
```js
  const { name, business, email, services, source, message } = req.body ?? {};
```

- [ ] **Step 2: Sanitize the message field**

Find the block of `sanitize` calls (~line 66):
```js
  const cleanName     = sanitize(name, 200);
  const cleanBusiness = sanitize(business, 200);
  const cleanEmail    = sanitize(email, 200);
  const cleanSource   = sanitize(source, 100);
```
Add after:
```js
  const cleanMessage  = sanitize(message, 2000);
```

- [ ] **Step 3: Include message in Airtable fields**

Find the `fields` object in the `fetch` call (~line 97):
```js
          fields: {
            'Full Name':                 cleanName,
            'Business Name':             cleanBusiness,
            'Email':                     cleanEmail,
            'Service Interested In':     serviceList.join(', '),
            'How they heard about Opra': cleanSource,
          },
```
Replace with:
```js
          fields: {
            'Full Name':                 cleanName,
            'Business Name':             cleanBusiness,
            'Email':                     cleanEmail,
            'Service Interested In':     serviceList.join(', '),
            'How they heard about Opra': cleanSource,
            'Message':                   cleanMessage,
          },
```

- [ ] **Step 4: Update index.html form submit to send message**

In `index.html`, find the form `fetch` body:
```js
      body: JSON.stringify({
        name:     nameVal,
        business: businessVal,
        email:    emailVal,
        services: Array.from(form.querySelectorAll('input[name="services"]:checked')).map(el => el.value).join(', '),
        source:   form.source.value,
      }),
```
Replace with:
```js
      body: JSON.stringify({
        name:     nameVal,
        business: businessVal,
        email:    emailVal,
        services: Array.from(form.querySelectorAll('input[name="services"]:checked')).map(el => el.value).join(', '),
        source:   form.source.value,
        message:  sanitizeText(form.message ? form.message.value : ''),
      }),
```

- [ ] **Step 5: Add Airtable column note**

> **Manual step:** In your Airtable base, add a new Long Text column named exactly `Message` to the Leads table. The API will silently drop the field if the column doesn't exist.

- [ ] **Step 6: Commit**

```bash
git add api/submit.js index.html
git commit -m "feat: pass message field from contact form through to Airtable"
```

---

## Task 11: Create og-image.png and logo.png

**Files:**
- Create: `og-image-generator.html`
- Create: `og-image.png` (manual step)
- Create: `logo.png` (manual step)

- [ ] **Step 1: Create the generator HTML file**

Create `/Users/jjarlow/Documents/Opra/Code/Website/Opra/og-image-generator.html`:

```html
<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>Opra — Asset Generator</title>
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Geist:wght@300;400;500&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
  body { background: #1a1a1a; display: flex; flex-direction: column; align-items: center; gap: 40px; padding: 40px; font-family: sans-serif; }
  canvas { border: 1px solid rgba(255,255,255,0.1); }
  button { background: #7CE3FF; color: #07090d; border: none; padding: 12px 24px; border-radius: 6px; font-size: 14px; font-weight: 600; cursor: pointer; }
  h2 { color: #e8f0fa; margin: 0 0 8px; font-family: 'Geist', sans-serif; }
  .section { display: flex; flex-direction: column; align-items: center; gap: 12px; }
</style>
</head>
<body>
<div class="section">
  <h2>og-image.png (1200×630)</h2>
  <canvas id="og" width="1200" height="630"></canvas>
  <button onclick="download('og', 'og-image.png')">Download og-image.png</button>
</div>
<div class="section">
  <h2>logo.png (512×512)</h2>
  <canvas id="logo" width="512" height="512"></canvas>
  <button onclick="download('logo', 'logo.png')">Download logo.png</button>
</div>
<script>
function waitForFonts(cb) {
  document.fonts.ready.then(cb);
}

function drawOg() {
  const c = document.getElementById('og');
  const ctx = c.getContext('2d');
  const W = 1200, H = 630;

  // Background
  ctx.fillStyle = '#07090d';
  ctx.fillRect(0, 0, W, H);

  // Grid lines
  ctx.strokeStyle = 'rgba(255,255,255,0.022)';
  ctx.lineWidth = 1;
  for (let x = 0; x < W; x += 72) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
  for (let y = 0; y < H; y += 72) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

  // Ambient glow
  const grad = ctx.createRadialGradient(W/2, H, 0, W/2, H, W * 0.7);
  grad.addColorStop(0, 'rgba(124,227,255,0.06)');
  grad.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  // Accent line
  ctx.strokeStyle = '#7CE3FF';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(80, 290); ctx.lineTo(160, 290);
  ctx.stroke();

  // Eyebrow
  ctx.fillStyle = 'rgba(86,101,122,1)';
  ctx.font = '500 18px "JetBrains Mono", monospace';
  ctx.letterSpacing = '0.28em';
  ctx.fillText('OPRA · JOHANNESBURG', 80, 260);

  // Headline
  ctx.fillStyle = '#e8f0fa';
  ctx.font = '400 88px "Instrument Serif", serif';
  ctx.fillText('Operational', 80, 370);
  ctx.fillStyle = '#7CE3FF';
  ctx.font = 'italic 400 88px "Instrument Serif", serif';
  ctx.fillText('Systems.', 80, 465);

  // Tagline
  ctx.fillStyle = 'rgba(147,163,182,1)';
  ctx.font = '400 22px "Geist", sans-serif';
  ctx.letterSpacing = '0';
  ctx.fillText('Automation · Dashboards · Platforms · AI', 80, 560);

  // URL
  ctx.fillStyle = 'rgba(86,101,122,1)';
  ctx.font = '400 18px "JetBrains Mono", monospace';
  ctx.letterSpacing = '0.1em';
  ctx.fillText('opra.co.za', W - 200, 580);
}

function drawLogo() {
  const c = document.getElementById('logo');
  const ctx = c.getContext('2d');
  const W = 512, H = 512;

  ctx.fillStyle = '#07090d';
  ctx.fillRect(0, 0, W, H);

  // Subtle grid
  ctx.strokeStyle = 'rgba(255,255,255,0.025)';
  ctx.lineWidth = 1;
  for (let x = 0; x < W; x += 64) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); }
  for (let y = 0; y < H; y += 64) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }

  // Glow
  const grad = ctx.createRadialGradient(W/2, H/2, 0, W/2, H/2, 220);
  grad.addColorStop(0, 'rgba(124,227,255,0.08)');
  grad.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  // Accent line
  ctx.strokeStyle = '#7CE3FF';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(W/2 - 60, 248); ctx.lineTo(W/2 - 10, 248);
  ctx.stroke();

  // OPRA wordmark
  ctx.fillStyle = '#e8f0fa';
  ctx.font = '500 72px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('OPRA', W/2, 310);

  // Tagline
  ctx.fillStyle = 'rgba(86,101,122,1)';
  ctx.font = '400 18px "JetBrains Mono", monospace';
  ctx.fillText('SYSTEMS', W/2, 358);
}

function download(id, filename) {
  const c = document.getElementById(id);
  const a = document.createElement('a');
  a.download = filename;
  a.href = c.toDataURL('image/png');
  a.click();
}

waitForFonts(function() {
  drawOg();
  drawLogo();
});
</script>
</body>
</html>
```

- [ ] **Step 2: Generate the PNG files**

Open `og-image-generator.html` in a browser (double-click the file). Wait for fonts to load (1–2 seconds). Click:
- "Download og-image.png" → save to `/Users/jjarlow/Documents/Opra/Code/Website/Opra/og-image.png`
- "Download logo.png" → save to `/Users/jjarlow/Documents/Opra/Code/Website/Opra/logo.png`

- [ ] **Step 3: Verify meta tags resolve**

Open `index.html` and inspect the `<head>`. Confirm:
- `og:image` → `https://www.opra.co.za/og-image.png` (file now exists at that path)
- JSON-LD `logo` → `https://www.opra.co.za/logo.png` (file now exists)

- [ ] **Step 4: Commit**

```bash
git add og-image-generator.html og-image.png logo.png
git commit -m "feat: add og-image.png and logo.png for social sharing and JSON-LD schema"
```

---

## Self-Review Checklist

**Spec coverage:**
- [x] CSS glass card tightening → Task 1
- [x] Remove CSS transitions → Task 1 (steps 3, 5, 7, 9)
- [x] `.accent-bar` CSS class → Task 1 (step 10)
- [x] Process grid mobile fix → Task 1 (step 13)
- [x] Canvas aria-label + role → Task 2 (step 1)
- [x] Form aria-live region → Task 2 (step 2)
- [x] Form textarea → Task 2 (step 3)
- [x] Remove IntersectionObserver block → Task 2 (step 4)
- [x] Update form JS for aria-live → Task 2 (step 5)
- [x] Motion CDN + script tags → Task 2 (step 6)
- [x] Spring hover animations (all 6 types) → Task 3
- [x] Spring scroll reveals (all groups) → Tasks 3–4
- [x] Corner-tag fade → Task 3 (initCornerTag)
- [x] Globe: prefers-reduced-motion → Task 5
- [x] Globe: tab visibility pause → Task 5
- [x] Globe: Africa dot cluster → Task 6
- [x] Globe: limb atmosphere glow → Task 7
- [x] Globe: arc connections → Task 8
- [x] Globe: mouse parallax → Task 9
- [x] api/submit.js message field → Task 10
- [x] og-image.png + logo.png → Task 11

**Type/name consistency check:**
- `window.Motion` used consistently across motion-controller.js
- `injectBar()` defined once, called in service cards and pain list
- `springIn()` defined once in initScrollReveals, used for all groups
- `mouseOffsetX/Y` defined in scroll-controller.js IIFE scope, used in onScroll()
- `ev.origin` added in spawnEvent(), read in drawEvents() — both in globe.js ✓
- `cleanMessage` / `'Message'` field name consistent between api/submit.js and the Airtable note ✓
