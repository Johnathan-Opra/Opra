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

    // Ghost button and nav CTA — border colour spring only
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
