/* Coach Salim: interactions. GSAP + ScrollTrigger + Lenis (self-hosted), with techniques reused from Santosh v3. */
(function () {
  'use strict';
  var doc = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var hasGsap = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  function splitChars(el) {
    var words = el.textContent.trim().split(/\s+/); el.textContent = '';
    words.forEach(function (w, i) {
      var ws = document.createElement('span'); ws.className = 'split-word';
      w.split('').forEach(function (ch) { var c = document.createElement('span'); c.className = 'char'; c.textContent = ch; ws.appendChild(c); });
      el.appendChild(ws); if (i < words.length - 1) el.appendChild(document.createTextNode(' '));
    });
  }
  function splitWords(el) {
    Array.prototype.slice.call(el.childNodes).forEach(function (n) {
      if (n.nodeType !== 3) return;
      var frag = document.createDocumentFragment();
      n.textContent.split(/(\s+)/).forEach(function (p) {
        if (!p) return;
        if (/^\s+$/.test(p)) { frag.appendChild(document.createTextNode(p)); return; }
        var s = document.createElement('span'); s.className = 'w'; s.textContent = p; frag.appendChild(s);
      });
      el.replaceChild(frag, n);
    });
  }

  /* basics (no GSAP needed) */
  var tog = $('.nav-toggle'), list = $('#nav-links'), nav = $('.nav');
  function closeMenu() { tog.setAttribute('aria-expanded', 'false'); list.classList.remove('open'); }
  tog.addEventListener('click', function () { var o = tog.getAttribute('aria-expanded') === 'true'; tog.setAttribute('aria-expanded', String(!o)); list.classList.toggle('open', !o); });
  $$('#nav-links a').forEach(function (a) { a.addEventListener('click', closeMenu); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });
  window.addEventListener('scroll', function () { nav.classList.toggle('scrolled', window.scrollY > 40); }, { passive: true });
  $$('.acc button').forEach(function (b) {
    b.addEventListener('click', function () {
      var open = b.getAttribute('aria-expanded') === 'true', p = document.getElementById(b.getAttribute('aria-controls'));
      b.setAttribute('aria-expanded', String(!open)); p.hidden = open;
      if (!open && hasGsap && !reduce) gsap.from(p, { height: 0, opacity: 0, duration: .45, ease: 'power3.out', clearProps: 'all' });
      if (hasGsap) ScrollTrigger.refresh();
    });
  });

  if (reduce || !hasGsap) { doc.classList.add(reduce ? 'reduced' : 'no-gsap'); return; }

  doc.classList.add('js-motion');
  gsap.registerPlugin(ScrollTrigger);
  var lenis = null;
  if (fine && window.Lenis) {
    lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (t) { lenis.raf(t * 1000); }); gsap.ticker.lagSmoothing(0);
  }
  $$('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href'); if (id.length < 2) return; var t = $(id); if (!t) return;
      e.preventDefault();
      if (lenis) lenis.scrollTo(t, { duration: 1.3 }); else t.scrollIntoView({ behavior: 'smooth' });
    });
  });

  $$('[data-split]').forEach(splitChars);
  $$('.scrub-words').forEach(splitWords);

  /* hero intro */
  var chars = $$('.hero-title .char');
  gsap.timeline({ delay: .1 })
    .from('.hero-photo picture', { clipPath: 'inset(100% 0% 0% 0% round 22px)', duration: 1.3, ease: 'expo.inOut' })
    // .hero-img now has a CSS Ken Burns loop (see coach.css)
    .from(chars, { yPercent: 115, duration: .9, stagger: .018, ease: 'expo.out' }, '-=1.3')
    .from('.eyebrow:first-child, .hero-sub, .hero-cta, .nav', { y: 24, opacity: 0, duration: .8, stagger: .08, ease: 'power3.out' }, '-=.7');
  gsap.to('.hero-ghost', { xPercent: -18, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  gsap.to('.hero-photo', { yPercent: 12, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });

  /* section heads: word-mask reveal */
  $$('[data-reveal], .h2').forEach(function (h) {
    if (h.closest('.hero')) return;
    gsap.from(h, { y: 60, opacity: 0, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: h, start: 'top 88%' } });
  });

  /* counters */
  $$('[data-count]').forEach(function (n) {
    var o = { v: 0 }, end = +n.dataset.count, suf = n.dataset.suffix || '';
    n.textContent = '0' + suf;
    ScrollTrigger.create({ trigger: n, start: 'top 92%', once: true, onEnter: function () {
      gsap.to(o, { v: end, duration: 1.8, ease: 'power2.out', onUpdate: function () { n.textContent = Math.round(o.v) + suf; } });
    } });
  });
  gsap.from('.stat', { y: 50, opacity: 0, duration: .9, stagger: .1, ease: 'power3.out', scrollTrigger: { trigger: '.stats', start: 'top 85%' } });

  // fromTo with explicit end values: .card has a CSS transform transition, which made gsap.from read a mid-transition end state and leave cards stuck 80px low (overlapping the book)
  gsap.fromTo('.card', { y: 80, opacity: 0, rotate: 1.5 }, { y: 0, opacity: 1, rotate: 0, duration: 1, stagger: .1, ease: 'power3.out', clearProps: 'transform,opacity', scrollTrigger: { trigger: '.cards', start: 'top 80%' } });
  gsap.from('.book > *', { y: 60, opacity: 0, duration: 1, stagger: .15, ease: 'power3.out', scrollTrigger: { trigger: '.book', start: 'top 80%' } });
  gsap.from('.cred-grid li', { y: 40, opacity: 0, duration: .7, stagger: .05, ease: 'power3.out', scrollTrigger: { trigger: '.cred-grid', start: 'top 85%' } });
  gsap.from('.spec', { y: 40, opacity: 0, duration: .7, stagger: .06, ease: 'power3.out', scrollTrigger: { trigger: '.spec-grid', start: 'top 85%' } });
  gsap.from('.rev', { x: 80, opacity: 0, duration: .9, stagger: .1, ease: 'power3.out', scrollTrigger: { trigger: '.rev-track', start: 'top 85%' } });
  gsap.from('.acc-item', { y: 24, opacity: 0, duration: .6, stagger: .05, ease: 'power3.out', scrollTrigger: { trigger: '.acc', start: 'top 85%' } });
  gsap.to('.scrub-words .w', { opacity: 1, stagger: .05, ease: 'none', scrollTrigger: { trigger: '.scrub-words', start: 'top 80%', end: 'bottom 45%', scrub: true } });
  gsap.from('.santosh-inner', { clipPath: 'inset(8% 6% 8% 6% round 60px)', ease: 'none', scrollTrigger: { trigger: '.santosh', start: 'top bottom', end: 'top 35%', scrub: true } });
  gsap.from('.cta-inner', { scale: .92, ease: 'none', scrollTrigger: { trigger: '.cta', start: 'top bottom', end: 'top 35%', scrub: true } });
  gsap.from('.cta-title span', { yPercent: 100, opacity: 0, rotate: 4, duration: 1, stagger: .12, ease: 'expo.out', scrollTrigger: { trigger: '.cta', start: 'top 65%' } });


  /* how it works: pinned step sequence (desktop) */
  var mm = gsap.matchMedia();
  mm.add('(min-width: 900px)', function () {
    var steps = $$('.how-step');
    gsap.set(steps.slice(1), { autoAlpha: 0, y: 80 });
    var tl = gsap.timeline({ scrollTrigger: { trigger: '.how', start: 'top top', end: '+=240%', scrub: 1, pin: '.how-pin', anticipatePin: 1,
      snap: { snapTo: 'labels', duration: { min: .2, max: .6 }, ease: 'power2.inOut' } } });
    tl.addLabel('s0');
    for (var i = 1; i < steps.length; i++) {
      tl.to(steps[i - 1], { autoAlpha: 0, y: -60, scale: .96, duration: .4 })
        .to(steps[i], { autoAlpha: 1, y: 0, duration: .5 }, '<.25')
        .to('.how-rail span', { width: ((i + 1) / steps.length * 100) + '%', duration: .6 }, '<')
        .addLabel('s' + i);
    }
    tl.to({}, { duration: .3 });
    return function () { gsap.set(steps, { clearProps: 'all' }); };
  });
  mm.add('(max-width: 899px)', function () {
    gsap.from('.how-step', { y: 50, opacity: 0, duration: .8, stagger: .1, ease: 'power3.out', scrollTrigger: { trigger: '.how-steps', start: 'top 85%' } });
  });

  /* magnetic (desktop); the kettlebell cursor is pure CSS (coach.css) */
  if (fine) {
    $$('.magnetic').forEach(function (b) {
      var xTo = gsap.quickTo(b, 'x', { duration: .6, ease: 'elastic.out(1,.4)' }), yTo = gsap.quickTo(b, 'y', { duration: .6, ease: 'elastic.out(1,.4)' });
      b.addEventListener('pointermove', function (e) { var r = b.getBoundingClientRect(); xTo((e.clientX - r.left - r.width / 2) * .3); yTo((e.clientY - r.top - r.height / 2) * .4); });
      b.addEventListener('pointerleave', function () { xTo(0); yTo(0); });
    });
    $$('.card').forEach(function (c) {
      c.addEventListener('pointermove', function (e) { var r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
        gsap.to(c, { rotateY: x * 8, rotateX: -y * 6, transformPerspective: 900, duration: .5, ease: 'power2.out' }); });
      c.addEventListener('pointerleave', function () { gsap.to(c, { rotateY: 0, rotateX: 0, duration: .8, ease: 'elastic.out(1,.5)' }); });
    });
  }
  window.addEventListener('load', function () { ScrollTrigger.refresh(); });
})();

/* hero video: honor reduced motion (poster stays as background) */
(function () {
  var v = document.querySelector('.hero-video');
  if (!v) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { v.removeAttribute('autoplay'); v.pause(); v.preload = 'none'; return; }
  var p = v.play(); if (p && p.catch) p.catch(function () {});
})();
