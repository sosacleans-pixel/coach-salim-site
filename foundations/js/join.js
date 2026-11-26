/* Functional Foundations: email signup. Calls the public RPC foundations_join (insert only), then opens the program. */
(function () {
  'use strict';
  var cfg = window.FOUNDATIONS_CONFIG;
  var form = document.getElementById('join-form');
  if (!form || !cfg) return;
  var EMAIL = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  var $ = function (id) { return document.getElementById(id); };
  var btn = $('fd-submit'), status = $('fd-status');

  function setErr(id, msg) { $(id).textContent = msg || ''; }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var email = $('fd-email').value.trim();
    var name = $('fd-name').value.trim();
    var ok = true;
    setErr('fd-email-err', ''); setErr('fd-consent-err', ''); setErr('fd-safety-err', ''); status.textContent = ''; status.className = 'fd-status';
    if (!EMAIL.test(email) || email.length > 254) { setErr('fd-email-err', 'Please enter a valid email address.'); ok = false; }
    if (!$('fd-consent').checked) { setErr('fd-consent-err', 'Please check this box to continue.'); ok = false; }
    if (!$('fd-safety').checked) { setErr('fd-safety-err', 'Please check this box to continue.'); ok = false; }
    if (!ok) return;
    if (form.website && form.website.value) { return; } /* honeypot: pretend success, store nothing */

    btn.disabled = true; status.textContent = 'Opening your program...';
    fetch(cfg.supabaseUrl + '/rest/v1/rpc/foundations_join', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'apikey': cfg.supabaseAnonKey, 'Authorization': 'Bearer ' + cfg.supabaseAnonKey },
      body: JSON.stringify({ p_email: email, p_first_name: name || null, p_source: 'foundations-web' })
    }).then(function (r) {
      if (!r.ok) throw new Error('http ' + r.status);
      try { localStorage.setItem(cfg.memberKey, JSON.stringify({ t: Date.now(), n: name.slice(0, 60) })); } catch (err) {}
      try { if (typeof window.gaEvent === 'function') window.gaEvent('generate_lead', { form_name: 'foundations_signup', transport_type: 'beacon' }); } catch (err) {}
      window.location.href = '/foundations/app/';
    }).catch(function () {
      btn.disabled = false;
      status.className = 'fd-status is-err';
      status.textContent = 'Sorry, we could not save your email just now. Please try again, or email coachsalimheyaime@gmail.com and Coach Salim will send you the program.';
    });
  });
})();
