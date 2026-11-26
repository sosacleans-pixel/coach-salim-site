/* Functional Foundations: the program app. Progress stays on this device (localStorage). No analytics here. */
(function () {
  'use strict';
  var cfg = window.FOUNDATIONS_CONFIG, F = window.FOUNDATIONS;
  var root = document.getElementById('app');
  var timerBar = document.getElementById('timer');

  function el(tag, attrs, kids) {
    var n = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      if (k === 'class') n.className = attrs[k];
      else if (k === 'text') n.textContent = attrs[k];
      else if (k.slice(0, 2) === 'on') n.addEventListener(k.slice(2), attrs[k]);
      else if (attrs[k] !== false && attrs[k] != null) n.setAttribute(k, attrs[k]);
    });
    (kids || []).forEach(function (c) { if (c != null) n.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); });
    return n;
  }

  /* ---- member gate ---- */
  var member = null;
  try { member = JSON.parse(localStorage.getItem(cfg.memberKey) || 'null'); } catch (e) {}
  if (!member) {
    root.appendChild(el('div', { class: 'gate' }, [
      el('p', { class: 'eyebrow', text: 'Functional Foundations' }),
      el('h1', { class: 'app-h1', text: 'Enter your email to start' }),
      el('p', { class: 'app-sub', text: 'The program is free. Add your email once, and it opens on this device.' }),
      el('a', { class: 'btn btn-xl', href: '/foundations/join/', text: 'Start free' })
    ]));
    return;
  }

  /* ---- progress store ---- */
  var store = { done: {}, sets: {}, checks: {} };
  try { var s = JSON.parse(localStorage.getItem(cfg.progressKey) || 'null'); if (s) store = { done: s.done || {}, sets: s.sets || {}, checks: s.checks || {} }; } catch (e) {}
  function save() { try { localStorage.setItem(cfg.progressKey, JSON.stringify(store)); } catch (e) {} }

  var strengthIds = ['a', 'b', 'c'];
  function wById(id) { return F.workouts.filter(function (w) { return w.id === id; })[0]; }
  function weekDone(n) { return strengthIds.filter(function (id) { return store.done[n + id]; }).length; }
  function totalDone() { return [1, 2, 3, 4].reduce(function (a, n) { return a + weekDone(n); }, 0); }

  /* ---- views ---- */
  function equipBox(w) {
    return el('div', { class: 'equip' }, [
      el('b', { text: 'Equipment for Week ' + w.n }),
      el('p', { text: w.equipment.label }),
      el('ul', null, w.equipment.items.map(function (x) { return el('li', { text: x }); })),
      el('p', { text: 'No weights? Every move lists a no-weights option. A backpack or a filled water jug works as a weight.' })
    ]);
  }
  function safetyNote() { return el('p', { class: 'safety', text: F.safety }); }

  function home() {
    var frag = document.createDocumentFragment();
    frag.appendChild(el('p', { class: 'eyebrow', text: 'Free · 4 weeks' }));
    frag.appendChild(el('h1', { class: 'app-h1', text: member.n ? 'Welcome, ' + member.n : 'Functional Foundations' }));
    frag.appendChild(el('p', { class: 'app-sub', text: 'Week 1 is bodyweight only. Each week adds a little more weight, up to full weighted sessions in Week 4. Do 3 strength days a week, plus the optional easy cardio and mobility day.' }));
    var done = totalDone();
    frag.appendChild(el('div', { class: 'app-progress' }, [
      el('b', { text: done + ' of 12 strength workouts complete' }),
      el('div', { class: 'app-bar', role: 'progressbar', 'aria-valuemin': '0', 'aria-valuemax': '12', 'aria-valuenow': String(done), 'aria-label': 'Program progress' }, [el('span', { style: 'width:' + Math.round(done / 12 * 100) + '%' })])
    ]));
    var list = el('div', { class: 'app-list' });
    F.weeks.forEach(function (w) {
      list.appendChild(el('a', { class: 'app-card', href: '#/w/' + w.n }, [
        weekDone(w.n) === 3 ? el('span', { class: 'done', text: 'Complete' }) : null,
        el('span', { class: 'k', text: 'Week ' + w.n + ' · ' + w.tag }),
        el('h3', { text: w.title }),
        el('p', { text: 'Equipment: ' + w.equipment.label + '. ' + weekDone(w.n) + ' of 3 workouts done.' })
      ]));
    });
    frag.appendChild(list);
    frag.appendChild(el('p', { class: 'app-sub', style: 'margin-top:28px', text: 'Progress is saved on this device. Questions about the program? Email coachsalimheyaime@gmail.com.' }));
    frag.appendChild(safetyNote());
    return frag;
  }

  function weekNav(n) {
    return el('nav', { class: 'weeknav', 'aria-label': 'Weeks' }, F.weeks.map(function (w) {
      return el('a', { href: '#/w/' + w.n, 'aria-current': w.n === n ? 'page' : false, text: 'Week ' + w.n });
    }));
  }

  function week(n) {
    var w = F.weeks[n - 1];
    var frag = document.createDocumentFragment();
    frag.appendChild(el('a', { class: 'app-crumb', href: '#/', text: 'Back to all weeks' }));
    frag.appendChild(weekNav(n));
    frag.appendChild(el('p', { class: 'eyebrow', text: 'Week ' + n + ' · ' + w.tag }));
    frag.appendChild(el('h1', { class: 'app-h1', text: w.title }));
    frag.appendChild(el('p', { class: 'app-sub', text: w.goal }));
    frag.appendChild(equipBox(w));
    frag.appendChild(el('div', { class: 'blk' }, [
      el('h2', { text: 'How hard this week' }),
      el('p', { text: w.effort }),
      el('p', { text: w.tempo })
    ]));
    var list = el('div', { class: 'app-list' });
    F.workouts.forEach(function (wk, i) {
      var isD = wk.id === 'd';
      var k = isD ? 'Optional day' : 'Day ' + (i + 1);
      var extra = (wk.selfCheck && (n === 1 || n === 4)) ? ' Includes the 5 minute self-check.' : '';
      list.appendChild(el('a', { class: 'app-card' + (isD ? ' is-opt' : ''), href: '#/w/' + n + '/' + wk.id }, [
        store.done[n + wk.id] ? el('span', { class: 'done', text: 'Done' }) : null,
        el('span', { class: 'k', text: k + (wk.minutes ? ' · about ' + wk.minutes + ' minutes' : ' · ' + wk.cardio[n - 1].minutes + ' minutes easy') }),
        el('h3', { text: wk.name }),
        el('p', { text: wk.short + '.' + extra })
      ]));
    });
    frag.appendChild(list);
    frag.appendChild(safetyNote());
    return frag;
  }

  function lines(arr) {
    return el('ul', { class: 'plain' }, arr.map(function (x) { return el('li', null, [el('span', { text: x.name }), el('span', { text: x.dose })]); }));
  }

  function selfCheckBlock(n) {
    var blk = el('div', { class: 'blk' }, [el('h2', { text: 'Self-check (5 minutes)' })]);
    blk.appendChild(el('p', { text: n === 1 ? 'Do this right after your warm-up. Write down your numbers. You will repeat it in Week 4 to see your own progress. There is no right or wrong score.' : 'Repeat the Week 1 check right after your warm-up and compare your numbers with Week 1.' }));
    var ck = store.checks['w' + n] || (store.checks['w' + n] = {});
    F.selfCheck.forEach(function (c) {
      var id = 'sc-' + n + c.key;
      var inp = el('input', { id: id, type: 'number', inputmode: 'numeric', min: '0', max: '999', value: ck[c.key] != null ? ck[c.key] : '' });
      inp.addEventListener('change', function () { var v = inp.value.trim(); if (v === '') delete ck[c.key]; else ck[c.key] = Number(v); save(); });
      blk.appendChild(el('div', { class: 'sc-row' }, [el('label', { for: id, text: c.label + ' (' + c.unit + ')' }), el('small', { text: c.how }), inp]));
    });
    if (n === 4) {
      var w1 = store.checks.w1 || {};
      var tbl = el('table', { class: 'sc-cmp' }, [el('thead', null, [el('tr', null, [el('th', { text: 'Check' }), el('th', { text: 'Week 1' }), el('th', { text: 'Week 4' })])])]);
      var body = el('tbody');
      F.selfCheck.forEach(function (c) {
        body.appendChild(el('tr', null, [el('td', { text: c.label }), el('td', { text: w1[c.key] != null ? w1[c.key] : 'not logged' }), el('td', { text: ck[c.key] != null ? ck[c.key] : 'not logged' })]));
      });
      tbl.appendChild(body);
      blk.appendChild(tbl);
    }
    return blk;
  }

  function exercise(n, i, ex) {
    var p = ex.byWeek[n - 1];
    var card = el('section', { class: 'ex', 'aria-label': ex.label });
    card.appendChild(el('span', { class: 'n', text: 'Exercise ' + (i + 1) + ' · ' + ex.label }));
    card.appendChild(el('h3', { text: p.move }));
    var rx = el('div', { class: 'rx' });
    if (ex.circuit) {
      rx.appendChild(el('span', { class: 'load', text: p.load }));
      rx.appendChild(el('span', { text: p.rounds + ' rounds' }));
      rx.appendChild(el('span', { text: p.work + ' sec on, ' + p.restSec + ' sec off' }));
      card.appendChild(rx);
      card.appendChild(el('p', { class: 'alt', text: 'Do each station for ' + p.work + ' seconds, rest ' + p.restSec + ' seconds, then move on. ' + p.rest + '.' }));
      card.appendChild(el('ol', { class: 'circ' }, p.stations.map(function (s) { return el('li', { text: s }); })));
    } else {
      rx.appendChild(el('span', { class: 'load', text: p.load }));
      rx.appendChild(el('span', { text: p.sets + ' sets' }));
      rx.appendChild(el('span', { text: p.reps }));
      rx.appendChild(el('span', { text: 'Rest ' + p.rest }));
      card.appendChild(rx);
      if (p.alt) card.appendChild(el('p', { class: 'alt', text: p.alt }));
    }
    var count = ex.circuit ? p.rounds : p.sets;
    var sets = el('div', { class: 'sets', role: 'group', 'aria-label': (ex.circuit ? 'Rounds' : 'Sets') + ' for ' + ex.label });
    for (var s = 1; s <= count; s++) (function (s) {
      var key = n + ':' + ex.key + ':' + s;
      var b = el('button', { type: 'button', 'aria-pressed': store.sets[key] ? 'true' : 'false', text: (ex.circuit ? 'Round ' : 'Set ') + s });
      b.addEventListener('click', function () {
        var on = b.getAttribute('aria-pressed') !== 'true';
        b.setAttribute('aria-pressed', on ? 'true' : 'false');
        if (on) store.sets[key] = 1; else delete store.sets[key];
        save();
      });
      sets.appendChild(b);
    })(s);
    card.appendChild(sets);
    card.appendChild(el('details', null, [el('summary', { text: 'Form cues' }), el('ul', null, ex.cues.map(function (c) { return el('li', { text: c }); }))]));
    card.appendChild(el('details', null, [el('summary', { text: 'Easier option' }), el('p', { text: ex.easy })]));
    card.appendChild(el('details', null, [el('summary', { text: 'Harder option' }), el('p', { text: ex.harder })]));
    return card;
  }

  function workout(n, id) {
    var w = F.weeks[n - 1], wk = wById(id);
    if (!w || !wk) return notFound();
    var frag = document.createDocumentFragment();
    frag.appendChild(el('a', { class: 'app-crumb', href: '#/w/' + n, text: 'Back to Week ' + n }));
    frag.appendChild(el('p', { class: 'eyebrow', text: 'Week ' + n + ' · ' + w.tag + (wk.minutes ? ' · about ' + wk.minutes + ' minutes' : '') }));
    frag.appendChild(el('h1', { class: 'app-h1', text: wk.name }));
    frag.appendChild(el('p', { class: 'app-sub', text: wk.intro }));
    frag.appendChild(equipBox(w));

    if (wk.id === 'd') {
      frag.appendChild(el('div', { class: 'blk' }, [el('h2', { text: 'Easy cardio' }), el('p', { text: wk.cardio[n - 1].text }), el('p', { text: wk.talkTest })]));
      frag.appendChild(el('div', { class: 'blk' }, [el('h2', { text: 'Mobility flow (about 8 minutes)' }), lines(wk.mobility)]));
    } else {
      frag.appendChild(el('div', { class: 'blk' }, [el('h2', { text: 'Warm-up (5 minutes)' }), lines(wk.warmup)]));
      if (wk.selfCheck && (n === 1 || n === 4)) frag.appendChild(selfCheckBlock(n));
      wk.exercises.forEach(function (ex, i) { frag.appendChild(exercise(n, i, ex)); });
      frag.appendChild(el('div', { class: 'blk' }, [el('h2', { text: 'Cooldown (5 minutes)' }), lines(wk.cooldown)]));
    }
    var doneBtn = el('button', { class: 'btn btn-xl btn-block', type: 'button', text: store.done[n + id] ? 'Completed. Tap to undo' : 'Mark workout complete' });
    doneBtn.addEventListener('click', function () {
      if (store.done[n + id]) delete store.done[n + id]; else store.done[n + id] = Date.now();
      save();
      location.hash = '#/w/' + n;
    });
    frag.appendChild(doneBtn);
    frag.appendChild(safetyNote());
    return frag;
  }

  function notFound() {
    return el('div', null, [el('h1', { class: 'app-h1', text: 'Not found' }), el('a', { class: 'btn', href: '#/', text: 'Back to the program' })]);
  }

  function render() {
    var h = location.hash.replace(/^#\/?/, '');
    var parts = h ? h.split('/') : [];
    var view;
    if (!parts.length) view = home();
    else if (parts[0] === 'w' && /^[1-4]$/.test(parts[1] || '')) view = parts[2] ? workout(+parts[1], parts[2]) : week(+parts[1]);
    else view = notFound();
    root.textContent = '';
    root.appendChild(view);
    timerBar.hidden = !(parts[0] === 'w' && parts[2] && parts[2] !== 'd');
    window.scrollTo(0, 0);
    root.focus({ preventScroll: true });
  }
  window.addEventListener('hashchange', render);

  /* ---- rest timer ---- */
  var tEl = document.getElementById('timer-t'), tick = null, left = 0;
  function fmt(s) { return Math.floor(s / 60) + ':' + ('0' + (s % 60)).slice(-2); }
  function stop() { if (tick) clearInterval(tick); tick = null; left = 0; tEl.textContent = '0:00'; }
  Array.prototype.forEach.call(timerBar.querySelectorAll('button[data-s]'), function (b) {
    b.addEventListener('click', function () {
      stop(); left = +b.getAttribute('data-s'); tEl.textContent = fmt(left);
      tick = setInterval(function () { left--; if (left <= 0) { stop(); tEl.textContent = 'Go'; } else tEl.textContent = fmt(left); }, 1000);
    });
  });
  document.getElementById('timer-stop').addEventListener('click', stop);

  render();
})();
