/* coachsalimheyaime.com: lead pop-up ("Can I help you find something?").
   - First show: 20 s on the page or 50% scroll, whichever comes first (never on page load).
   - "Just looking", X or Esc closes it and re-shows it 3 min later; at most 3 shows per visit (sessionStorage).
   - After a successful submit it never shows again on this browser (localStorage).
   - Never on /privacy/ or the 404 page; postponed while the visitor is typing in a form field.
   - Debug: ?popupdebug=1 shortens the timers to a few seconds (only for that URL; normal visitors are unaffected).
   - Sends via FormSubmit AJAX; GA4 generate_lead on success only, no personal data. */
(function () {
  'use strict';

  var ENDPOINT = 'https://formsubmit.co/ajax/coachsalimheyaime@gmail.com';
  var KEY_DONE = 'csh_popup_done';     // localStorage: '1' after a successful submit
  var KEY_SHOWS = 'csh_popup_shows';   // sessionStorage: shows this visit
  var KEY_NEXT = 'csh_popup_next';     // sessionStorage: earliest time (ms) of the next re-show
  var MAX_SHOWS = 3;
  var SCROLL_FRACTION = 0.5;
  var MIN_FILL_MS = 3000;

  var debug = /(?:^|[?&])popupdebug=1(?:&|$)/.test(location.search.slice(1));
  var FIRST_DELAY = debug ? 3000 : 20000;
  var RESHOW_DELAY = debug ? 4000 : 180000;
  var RETRY_DELAY = debug ? 500 : 2000;     // postponed show (typing / hidden tab / menu open)

  /* ---------- where not to run ---------- */
  var path = location.pathname.toLowerCase();
  if (/^\/privacy(\/|$)/.test(path) || /\/404(\.html)?$/.test(path)) return;
  if (/not found/i.test(document.title) || document.documentElement.hasAttribute('data-no-popup')) return;
  if (location.hash === '#thanks') return; // just sent the main contact form

  /* ---------- storage (fails quietly in private modes) ---------- */
  function lsGet(k) { try { return window.localStorage.getItem(k); } catch (e) { return null; } }
  function lsSet(k, v) { try { window.localStorage.setItem(k, v); } catch (e) {} }
  function ssGet(k) { try { return window.sessionStorage.getItem(k); } catch (e) { return null; } }
  function ssSet(k, v) { try { window.sessionStorage.setItem(k, v); } catch (e) {} }
  function shows() { return parseInt(ssGet(KEY_SHOWS) || '0', 10) || 0; }

  if (lsGet(KEY_DONE) === '1' || shows() >= MAX_SHOWS) return;

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var EMAIL_PATTERN = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

  /* ---------- markup ---------- */
  var root = document.createElement('div');
  root.className = 'pop';
  root.hidden = true;
  root.setAttribute('data-state', 'ask');
  root.setAttribute('data-lenis-prevent', ''); // let wheel/touch inside scroll natively (Lenis ignores it)
  root.innerHTML =
    '<div class="pop-backdrop" aria-hidden="true"></div>' +
    '<div class="pop-dialog" role="dialog" aria-labelledby="pop-title" tabindex="-1">' +
      '<button type="button" class="pop-x" aria-label="Close"><span aria-hidden="true"></span></button>' +
      '<div class="pop-view pop-ask">' +
        '<p class="pop-eyebrow">Coach Salim</p>' +
        '<h2 class="pop-title" id="pop-title">Can I help you find something?</h2>' +
        '<div class="pop-actions">' +
          '<button type="button" class="btn pop-info">Looking for information</button>' +
          '<button type="button" class="btn btn-ghost pop-browse">Just looking</button>' +
        '</div>' +
      '</div>' +
      '<form class="pop-view pop-form" novalidate hidden>' +
        '<h2 class="pop-title" id="pop-form-title">What can I help with?</h2>' +
        '<p class="pop-sub">Leave your details and Coach Salim will reply by email.</p>' +
        '<input type="text" name="_honey" class="pop-hp" tabindex="-1" autocomplete="off" aria-hidden="true">' +
        '<div class="pop-field"><label for="pop-name">Name</label><input id="pop-name" name="name" type="text" autocomplete="name" required minlength="2" aria-describedby="pop-name-err"><span class="pop-err" id="pop-name-err"></span></div>' +
        '<div class="pop-field"><label for="pop-email">Email</label><input id="pop-email" name="email" type="email" inputmode="email" autocomplete="email" required aria-describedby="pop-email-err"><span class="pop-err" id="pop-email-err"></span></div>' +
        '<div class="pop-field"><label for="pop-msg">What would you like to know?</label><textarea id="pop-msg" name="message" rows="4" required aria-describedby="pop-msg-err"></textarea><span class="pop-err" id="pop-msg-err"></span></div>' +
        '<p class="pop-fail" role="alert" hidden></p>' +
        '<button type="submit" class="btn pop-submit">Submit</button>' +
      '</form>' +
      '<div class="pop-view pop-thanks" hidden>' +
        '<h2 class="pop-title" id="pop-thanks-title" tabindex="-1">Thanks! Your message is in.</h2>' +
        '<p class="pop-sub">Coach Salim will reply by email, usually within a day or two.</p>' +
        '<button type="button" class="btn pop-done">Close</button>' +
      '</div>' +
    '</div>';

  var $ = function (s) { return root.querySelector(s); };
  var dialog = $('.pop-dialog');
  var viewAsk = $('.pop-ask'), form = $('.pop-form'), viewThanks = $('.pop-thanks');
  var nameIn = $('#pop-name'), emailIn = $('#pop-email'), msgIn = $('#pop-msg'), honey = $('.pop-hp');
  var failMsg = $('.pop-fail'), submitBtn = $('.pop-submit');

  var isOpen = false, sending = false, done = false;
  var state = 'ask';
  var showTimer = null, firstTriggered = false;
  var returnFocus = null, formOpenedAt = 0;

  function mount() { if (!root.parentNode) document.body.appendChild(root); }

  /* ---------- scheduling ---------- */
  function clearShowTimer() { if (showTimer) { clearTimeout(showTimer); showTimer = null; } }
  function schedule(ms) { clearShowTimer(); showTimer = setTimeout(tryShow, Math.max(0, ms)); }

  function busy() {
    var a = document.activeElement;
    if (a && a !== document.body && !root.contains(a)) {
      if (a.closest && a.closest('.cform')) return true; // typing in the main contact form
      if (/^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName) || a.isContentEditable) return true;
    }
    if (document.hidden) return true;
    var menu = document.getElementById('nav-links');
    if (menu && menu.classList.contains('open')) return true;
    return false;
  }

  function tryShow() {
    showTimer = null;
    if (isOpen || done || lsGet(KEY_DONE) === '1' || shows() >= MAX_SHOWS) return;
    if (busy()) { schedule(RETRY_DELAY); return; }
    open();
  }

  function onScroll() {
    if (firstTriggered) return;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    if (max > 0 && window.scrollY / max >= SCROLL_FRACTION) firstTrigger();
  }
  function firstTrigger() {
    if (firstTriggered) return;
    firstTriggered = true;
    window.removeEventListener('scroll', onScroll);
    tryShow();
  }

  /* ---------- views ---------- */
  function setState(s) {
    state = s;
    root.setAttribute('data-state', s);
    viewAsk.hidden = s !== 'ask';
    form.hidden = s !== 'form';
    viewThanks.hidden = s !== 'thanks';
    var labelled = s === 'ask' ? 'pop-title' : s === 'form' ? 'pop-form-title' : 'pop-thanks-title';
    dialog.setAttribute('aria-labelledby', labelled);
    // Only the question is non-modal (page stays scrollable); the form and thank-you are modal.
    if (s === 'ask') {
      dialog.removeAttribute('aria-modal');
      document.documentElement.classList.remove('pop-lock');
    } else {
      dialog.setAttribute('aria-modal', 'true');
      document.documentElement.classList.add('pop-lock');
    }
  }

  function focusables() {
    return Array.prototype.slice.call(dialog.querySelectorAll('button, [href], input:not([type=hidden]):not(.pop-hp), textarea, select'))
      .filter(function (el) { return !el.disabled && !el.closest('[hidden]') && el.offsetParent !== null; });
  }

  function open() {
    mount();
    ssSet(KEY_SHOWS, String(shows() + 1));
    returnFocus = document.activeElement && document.activeElement !== document.body ? document.activeElement : null;
    setState('ask');
    root.hidden = false;
    isOpen = true;
    // force a frame so the enter transition runs
    void root.offsetWidth;
    root.classList.add('is-in');
    var first = $('.pop-info');
    try { first.focus({ preventScroll: true }); } catch (e) { first.focus(); }
    document.addEventListener('keydown', onKey, true);
  }

  function close(reason) {
    if (!isOpen) return;
    isOpen = false;
    document.removeEventListener('keydown', onKey, true);
    root.classList.remove('is-in');
    document.documentElement.classList.remove('pop-lock');
    var finish = function () { root.hidden = true; resetForm(); setState('ask'); };
    if (reduce) finish(); else setTimeout(finish, 260);
    if (returnFocus && document.contains(returnFocus) && typeof returnFocus.focus === 'function') {
      try { returnFocus.focus({ preventScroll: true }); } catch (e) { returnFocus.focus(); }
    } else if (document.activeElement && root.contains(document.activeElement)) {
      document.activeElement.blur();
    }
    returnFocus = null;
    if (done || reason === 'done') return;
    // "Just looking", X and Esc all count the same: re-show later, within the per-visit cap.
    if (shows() < MAX_SHOWS) {
      ssSet(KEY_NEXT, String(Date.now() + RESHOW_DELAY));
      schedule(RESHOW_DELAY);
    }
  }

  function onKey(e) {
    if (!isOpen) return;
    if (e.key === 'Escape' || e.key === 'Esc') { e.preventDefault(); e.stopPropagation(); close(done ? 'done' : 'esc'); return; }
    if (e.key !== 'Tab') return;
    var f = focusables();
    if (!f.length) { e.preventDefault(); dialog.focus(); return; }
    var first = f[0], last = f[f.length - 1], a = document.activeElement;
    if (!dialog.contains(a)) { e.preventDefault(); (e.shiftKey ? last : first).focus(); return; }
    if (e.shiftKey && a === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && a === last) { e.preventDefault(); first.focus(); }
  }

  /* ---------- form ---------- */
  function fieldWrap(el) { return el.closest('.pop-field'); }
  function setErr(el, msg) {
    var w = fieldWrap(el); w.classList.add('is-invalid');
    el.setAttribute('aria-invalid', 'true');
    w.querySelector('.pop-err').textContent = msg;
  }
  function clearErr(el) {
    var w = fieldWrap(el); w.classList.remove('is-invalid');
    el.removeAttribute('aria-invalid');
    w.querySelector('.pop-err').textContent = '';
  }
  function vName() { if ((nameIn.value || '').trim().length < 2) { setErr(nameIn, 'Enter your name (at least 2 characters).'); return false; } clearErr(nameIn); return true; }
  function vEmail() {
    var v = (emailIn.value || '').trim();
    if (!v) { setErr(emailIn, 'Enter your email address.'); return false; }
    if (!EMAIL_PATTERN.test(v)) { setErr(emailIn, 'Enter a valid email address (e.g. you@example.com).'); return false; }
    clearErr(emailIn); return true;
  }
  function vMsg() { if (!(msgIn.value || '').trim()) { setErr(msgIn, 'Tell Coach Salim what you would like to know.'); return false; } clearErr(msgIn); return true; }

  [[nameIn, vName], [emailIn, vEmail], [msgIn, vMsg]].forEach(function (p) {
    p[0].addEventListener('input', function () { if (fieldWrap(p[0]).classList.contains('is-invalid')) p[1](); });
    p[0].addEventListener('blur', function () { if ((p[0].value || '').trim()) p[1](); });
  });

  function resetForm() {
    if (done) return;
    form.reset();
    [nameIn, emailIn, msgIn].forEach(clearErr);
    failMsg.hidden = true; failMsg.textContent = '';
    submitBtn.disabled = false; submitBtn.textContent = 'Submit';
    sending = false;
  }

  function showForm() {
    setState('form');
    formOpenedAt = Date.now();
    try { nameIn.focus({ preventScroll: true }); } catch (e) { nameIn.focus(); }
  }

  function showThanks() {
    setState('thanks');
    var t = $('#pop-thanks-title');
    try { t.focus({ preventScroll: true }); } catch (e) { t.focus(); }
  }

  function trackLead() {
    var params = { form_name: 'popup', service: 'popup' };
    try {
      if (typeof window.gaEvent === 'function') window.gaEvent('generate_lead', params);
      else if (typeof window.gtag === 'function') window.gtag('event', 'generate_lead', params);
    } catch (e) {}
  }

  function onSuccess() {
    done = true;
    lsSet(KEY_DONE, '1');
    clearShowTimer();
    trackLead();
    showThanks();
  }

  function onFail() {
    sending = false;
    submitBtn.disabled = false;
    submitBtn.textContent = 'Try again';
    failMsg.textContent = 'Sorry, that didn\u2019t go through. Please try again, or email coachsalimheyaime@gmail.com.';
    failMsg.hidden = false;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (sending || done) return;
    // Bot checks: honeypot filled -> pretend it worked, send nothing, track nothing, remember nothing.
    if (honey.value) { showThanks(); return; }
    // Too fast to be a person: ignore the submit.
    if (Date.now() - formOpenedAt < MIN_FILL_MS) return;
    var ok = vName(), okE = vEmail(), okM = vMsg();
    if (!(ok && okE && okM)) {
      var bad = form.querySelector('.pop-field.is-invalid input, .pop-field.is-invalid textarea');
      if (bad) bad.focus();
      return;
    }
    sending = true;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending\u2026';
    failMsg.hidden = true;
    var payload = {
      name: nameIn.value.trim(),
      email: emailIn.value.trim(),
      message: msgIn.value.trim(),
      source: 'popup',
      page: location.origin + location.pathname,
      _subject: 'Pop-up inquiry',
      _template: 'table',
      _captcha: 'false',
      _honey: ''
    };
    if (typeof window.fetch !== 'function') { onFail(); return; }
    window.fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(payload)
    }).then(function (r) {
      return r.json().catch(function () { return {}; }).then(function (j) {
        if (r.ok && String(j.success) !== 'false') onSuccess(); else onFail();
      });
    }).catch(onFail);
  });

  /* ---------- wiring ---------- */
  $('.pop-info').addEventListener('click', showForm);
  $('.pop-browse').addEventListener('click', function () { close('just-looking'); });
  $('.pop-x').addEventListener('click', function () { close(done ? 'done' : 'x'); });
  $('.pop-done').addEventListener('click', function () { close('done'); });

  /* ---------- start ---------- */
  function start() {
    var n = shows();
    if (n === 0) {
      // First show of the visit: 20 s on the page or 50% scroll, whichever comes first.
      showTimer = setTimeout(firstTrigger, FIRST_DELAY);
      window.addEventListener('scroll', onScroll, { passive: true });
    } else {
      // Already shown this visit (e.g. reload): honour the pending re-show, never on page load.
      firstTriggered = true;
      var next = parseInt(ssGet(KEY_NEXT) || '0', 10) || 0;
      schedule(Math.max(next - Date.now(), FIRST_DELAY));
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
