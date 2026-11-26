/* Links that should open in a new tab (fallback for links added by JavaScript or missed in the HTML).
   - Any http(s) link whose hostname differs from this page's
   - mailto: links (so the inbox or mail app opens without leaving the site)
   Each gets target="_blank" rel="noopener", so the original page stays open.
   Links that already have a target are left alone. Same-host, relative and #anchor
   links, plus tel:, sms: and javascript: links, are never touched.
   Doesn't cancel clicks, so the GA4 click events (beacon transport) fire exactly as before. */
(function () {
  'use strict';
  function addNoopener(a) {
    var rel = (a.getAttribute('rel') || '').split(/\s+/).filter(Boolean);
    if (rel.indexOf('noopener') === -1) { rel.push('noopener'); a.setAttribute('rel', rel.join(' ')); }
  }
  function shouldOpenNewTab(href) {
    if (/^mailto:/i.test(href)) return true;
    var u;
    try { u = new URL(href, location.href); } catch (e) { return false; }
    if (!/^https?:$/.test(u.protocol)) return false;
    return u.hostname !== location.hostname;
  }
  function fix(a) {
    if (!a || !a.getAttribute || a.hasAttribute('target')) return;
    var href = a.getAttribute('href') || '';
    if (!shouldOpenNewTab(href)) return;
    a.setAttribute('target', '_blank');
    addNoopener(a);
  }
  function scan(root) {
    if (root.nodeName === 'A') fix(root);
    if (root.querySelectorAll) Array.prototype.forEach.call(root.querySelectorAll('a[href]'), fix);
  }
  scan(document);
  if (window.MutationObserver) {
    new MutationObserver(function (list) {
      list.forEach(function (m) {
        if (m.type === 'attributes') fix(m.target);
        else Array.prototype.forEach.call(m.addedNodes, function (n) { if (n.nodeType === 1) scan(n); });
      });
    }).observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ['href'] });
  }
  // Last check at click time (capture phase), for anything the observer hasn't processed yet.
  document.addEventListener('click', function (e) {
    var a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
    if (a) fix(a);
  }, true);
})();
