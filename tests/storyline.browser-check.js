// In-page checks for the homepage storyline. Paste into the browser console
// (or run through the browser pane's JS tool) on http://localhost:8743/.
// Resolves to { pass, failures, notes }. Resize the window and rerun to
// cover each width (320, 375, 640, 768, 1024, 1280).
(async function storylineCheck() {
  var failures = [];
  var notes = [];
  var fail = function (msg) { failures.push(msg); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  var wait = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  var centerOn = async function (el) {
    var r = el.getBoundingClientRect();
    window.scrollTo({ top: window.scrollY + r.top + r.height / 2 - innerHeight / 2, behavior: 'instant' });
    await wait(1500);
  };

  // Order and required fields (Req 2)
  var expected = ['ai-foundry', 'innosight', 'sandbox', 'ballard', 'creamies', 'mock-trial', 'brazil', 'origin'];
  var chapters = $$('.chapter');
  var ids = chapters.map(function (c) { return c.id.replace('ch-', ''); });
  if (ids.join() !== expected.join()) fail('Chapter order: ' + ids.join());
  chapters.forEach(function (c) {
    if (!c.querySelector('.chapter-org') || !c.querySelector('h3.chapter-role')) fail(c.id + ' missing org/role');
    if (c.id !== 'ch-origin' && !c.querySelector('.chapter-date')) fail(c.id + ' missing date');
  });

  // Text matches the Portfolio page (Req 2.5)
  try {
    var portfolio = await fetch('/portfolio.html').then(function (r) { return r.text(); });
    var norm = function (s) { return s.replace(/\s+/g, ' ').replace(/&amp;/g, '&').trim(); };
    var page = norm(portfolio);
    $$('.chapter-points li').forEach(function (li) {
      var t = norm(li.textContent);
      if (li.closest('#ch-origin')) return;
      if (page.indexOf(t) === -1) fail('Point not on portfolio page: ' + t.slice(0, 60));
    });
  } catch (e) { notes.push('Could not fetch portfolio.html: ' + e.message); }

  // Accessibility (Req 15)
  $$('.storyline img').forEach(function (img) { if (!img.hasAttribute('alt')) fail('img without alt: ' + img.src); });
  $$('.storyline [role="img"]').forEach(function (el) {
    if (!(el.getAttribute('aria-label') || '').trim()) fail('role=img without label');
  });
  var levels = $$('h1, h2, h3, h4').map(function (h) { return +h.tagName[1]; });
  for (var i = 1; i < levels.length; i++) if (levels[i] - levels[i - 1] > 1) fail('Heading skip at #' + i);

  // No horizontal page overflow (Req 14.3)
  if (document.documentElement.scrollWidth > innerWidth) {
    fail('Horizontal overflow at ' + innerWidth + 'px: ' + document.documentElement.scrollWidth);
  }

  // Tap targets on narrow screens (Req 14.4)
  if (innerWidth < 640) {
    $$('.org-node rect').forEach(function (r) {
      var b = r.getBoundingClientRect();
      if (b.height < 44) fail('Org node under 44px tall: ' + b.height.toFixed(1));
    });
  }

  // Focus: exactly one chapter in color, and it's the centered one (Req 3.5)
  var anim = document.documentElement.classList.contains('anim');
  if (document.documentElement.classList.contains('sl-io')) {
    var po = 'PerformanceObserver' in window ? [] : null;
    var obs;
    if (po) {
      obs = new PerformanceObserver(function (l) { l.getEntries().forEach(function (e) { po.push(e.duration); }); });
      try { obs.observe({ entryTypes: ['longtask'] }); } catch (e) { po = null; }
    }
    for (var c = 0; c < chapters.length; c++) {
      await centerOn(chapters[c]);
      var focused = $$('.chapter.is-focused');
      if (focused.length !== 1 || focused[0] !== chapters[c]) {
        fail('Focus at ' + chapters[c].id + ': ' + focused.map(function (f) { return f.id; }).join());
      }
    }
    if (obs) obs.disconnect();
    if (po) {
      if (po.length) fail('Long tasks during scroll: ' + po.map(function (d) { return d.toFixed(0) + 'ms'; }).join(', '));
      else notes.push('No long tasks during scroll');
    }
    // Reveal is sticky once played (Req 4.1)
    var unrevealed = $$('[data-reveal]').filter(function (el) { return !el.classList.contains('is-revealed'); });
    if (unrevealed.length) fail(unrevealed.length + ' figures never revealed');
  }

  // Reduced motion → no pre-animation state (Req 4.3)
  if (!anim) {
    $$('.storyline .pop').forEach(function (el) {
      if (getComputedStyle(el).opacity === '0') fail('Element hidden without animation');
    });
    var counter = document.querySelector('.counter');
    if (counter && counter.textContent !== '$50,000+') fail('Counter not final: ' + counter.textContent);
  }

  // Org chart interaction (Req 6.4–6.6)
  var cfo = document.querySelector('.org-node[data-id="cfo"]');
  if (cfo) {
    cfo.focus();
    cfo.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    var live = document.querySelector('.org-live').textContent;
    if (cfo.getAttribute('aria-pressed') !== 'true') fail('Enter did not pin CFO');
    if (!/^CFO: reports to President & CEO/.test(live)) fail('Live region: ' + live);
    if (!document.querySelector('.org-edge[data-edge="cfo-coo"]').classList.contains('is-linked')) fail('Decision edge not linked');
    cfo.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    if (document.querySelector('.org-chart').classList.contains('has-active')) fail('Escape did not clear');
    cfo.blur();
  }

  // Placeholders show for missing images (Req 13.2)
  notes.push('Placeholders: ' + $$('.media-frame.is-placeholder').map(function (f) { return f.dataset.placeholder; }).join(', '));

  return { width: innerWidth, anim: anim, pass: failures.length === 0, failures: failures, notes: notes };
})();
