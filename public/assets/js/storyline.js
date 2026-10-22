/* ==========================================================================
   Career storyline (homepage)
   - Pure helpers at the top are also exported for `node --test tests/`.
   - All scroll-driven behavior uses IntersectionObserver; there are no
     scroll handlers, so nothing here competes with the Earth's recompute loop
     in starfield.js.
   - The markup is written in its final state. The inline <head> script adds
     `sl-io` (IntersectionObserver available → color-on-focus) and `anim`
     (also no reduced motion → pre-animation states). Without them,
     everything simply shows finished.
   ========================================================================== */
(function (root) {
  'use strict';

  // ------------------------------------------------------------------------
  // Data
  // ------------------------------------------------------------------------

  // Placeholder decision architecture for the Innosight chapter. No real
  // client names or people; `reports` edges run superior → subordinate.
  var ORG = {
    nodes: [
      { id: 'board', label: 'Board of Trustees' },
      { id: 'ceo', label: 'President & CEO' },
      { id: 'coo', label: 'COO' },
      { id: 'cfo', label: 'CFO' },
      { id: 'cto', label: 'CTO' },
      { id: 'cro', label: 'Chief Research Officer' },
      { id: 'ops', label: 'Operations' },
      { id: 'fin', label: 'Finance' },
      { id: 'lab1', label: 'Lab 1' },
      { id: 'lab2', label: 'Lab 2' },
      { id: 'prog', label: 'Programs' }
    ],
    edges: [
      { from: 'board', to: 'ceo', kind: 'reports' },
      { from: 'ceo', to: 'coo', kind: 'reports' },
      { from: 'ceo', to: 'cfo', kind: 'reports' },
      { from: 'ceo', to: 'cto', kind: 'reports' },
      { from: 'ceo', to: 'cro', kind: 'reports' },
      { from: 'coo', to: 'ops', kind: 'reports' },
      { from: 'cfo', to: 'fin', kind: 'reports' },
      { from: 'cto', to: 'lab1', kind: 'reports' },
      { from: 'cto', to: 'lab2', kind: 'reports' },
      { from: 'cro', to: 'prog', kind: 'reports' },
      { from: 'board', to: 'cro', kind: 'decides', note: 'approves the research portfolio' },
      { from: 'cfo', to: 'coo', kind: 'decides', note: 'joint budget sign-off' }
    ]
  };

  // Illustrative series (labeled as such on the page).
  var DATA = {
    sandbox: [
      { label: 'Sep', value: 70 }, { label: 'Oct', value: 71 }, { label: 'Nov', value: 73 },
      { label: 'Jan', value: 74 }, { label: 'Feb', value: 76 }, { label: 'Mar', value: 78 },
      { label: 'Apr', value: 79 }
    ],
    ballard: [
      { label: '2022', value: 140 },
      { label: '2023', value: 165 },
      { label: '2024', value: 190, note: 'prior record' },
      { label: '2025', value: 298, note: '+57%' }
    ]
  };

  // ------------------------------------------------------------------------
  // Pure helpers
  // ------------------------------------------------------------------------

  // At most one chapter is focused. While two overlap the center band
  // (brief, at a boundary), keep the previous one so color doesn't flicker.
  function pickFocused(intersecting, last) {
    if (!intersecting.length) return null;
    if (last !== null && intersecting.indexOf(last) !== -1) return last;
    return intersecting[0];
  }

  function formatCount(value, prefix, suffix) {
    var n = Math.round(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return (prefix || '') + n + (suffix || '');
  }

  // Ease-out cubic, t clamped to [0, 1].
  function tween(from, to, t) {
    t = Math.max(0, Math.min(1, t));
    return from + (to - from) * (1 - Math.pow(1 - t, 3));
  }

  function pctIncrease(a, b) {
    return ((b - a) / a) * 100;
  }

  function edgeId(e) {
    return e.from + '-' + e.to;
  }

  function nodeById(graph, id) {
    for (var i = 0; i < graph.nodes.length; i++) {
      if (graph.nodes[i].id === id) return graph.nodes[i];
    }
    return null;
  }

  function linkedIds(graph, id) {
    if (!nodeById(graph, id)) return { nodes: [], edges: [] };
    var nodes = [];
    var edges = [];
    graph.edges.forEach(function (e) {
      if (e.from !== id && e.to !== id) return;
      edges.push(edgeId(e));
      var other = e.from === id ? e.to : e.from;
      if (nodes.indexOf(other) === -1) nodes.push(other);
    });
    return { nodes: nodes, edges: edges };
  }

  function describeNode(graph, id) {
    var node = nodeById(graph, id);
    if (!node) return '';
    var label = function (nid) { return nodeById(graph, nid).label; };
    var parts = [];
    var reportsTo = [];
    var oversees = [];
    var decisions = [];
    graph.edges.forEach(function (e) {
      if (e.kind === 'reports') {
        if (e.to === id) reportsTo.push(label(e.from));
        if (e.from === id) oversees.push(label(e.to));
      } else if (e.from === id || e.to === id) {
        decisions.push(e.note + ' with ' + label(e.from === id ? e.to : e.from));
      }
    });
    if (reportsTo.length) parts.push('reports to ' + reportsTo.join(', '));
    if (oversees.length) parts.push('oversees ' + oversees.join(', '));
    parts = parts.concat(decisions);
    return node.label + ': ' + parts.join('; ') + '.';
  }

  var helpers = {
    ORG: ORG,
    DATA: DATA,
    pickFocused: pickFocused,
    formatCount: formatCount,
    tween: tween,
    pctIncrease: pctIncrease,
    linkedIds: linkedIds,
    describeNode: describeNode
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = helpers;
    return;
  }

  // ------------------------------------------------------------------------
  // Page behavior
  // ------------------------------------------------------------------------

  var doc = root.document;
  var html = doc.documentElement;
  var storyline = doc.querySelector('.storyline');
  if (!storyline) return;

  // Reduced motion can change while the page is open.
  var motionQuery = root.matchMedia('(prefers-reduced-motion: reduce)');
  function syncMotion() {
    var canAnimate = 'IntersectionObserver' in root && !motionQuery.matches;
    html.classList.toggle('anim', canAnimate);
  }
  syncMotion();
  if (motionQuery.addEventListener) motionQuery.addEventListener('change', syncMotion);

  initImages();
  initOrgChart();

  if (!('IntersectionObserver' in root)) {
    html.classList.remove('sl-io');
    return;
  }
  initFocus();
  initReveal();

  // Missing or broken images fall back to their labeled placeholder.
  function initImages() {
    var imgs = storyline.querySelectorAll('.media-frame img');
    Array.prototype.forEach.call(imgs, function (img) {
      var frame = img.closest('.media-frame');
      var fail = function () { frame.classList.add('is-placeholder'); };
      img.addEventListener('error', fail);
      if (img.complete && img.naturalWidth === 0 && img.getAttribute('src')) fail();
    });
  }

  function initFocus() {
    var chapters = Array.prototype.slice.call(storyline.querySelectorAll('.chapter'));
    var intersecting = [];
    var current = null;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var i = chapters.indexOf(entry.target);
        var at = intersecting.indexOf(i);
        if (entry.isIntersecting && at === -1) intersecting.push(i);
        if (!entry.isIntersecting && at !== -1) intersecting.splice(at, 1);
      });
      intersecting.sort(function (a, b) { return a - b; });
      var next = pickFocused(intersecting, current);
      if (next === current) return;
      if (current !== null) chapters[current].classList.remove('is-focused');
      if (next !== null) chapters[next].classList.add('is-focused');
      current = next;
    }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });

    chapters.forEach(function (c) { observer.observe(c); });
  }

  // Each [data-reveal] figure plays its animation once, the first time it
  // is meaningfully in view.
  function initReveal() {
    var counters = storyline.querySelectorAll('[data-count-to]');
    if (html.classList.contains('anim')) {
      Array.prototype.forEach.call(counters, function (el) {
        el.textContent = formatCount(0, el.dataset.prefix, el.dataset.suffix);
      });
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        observer.unobserve(el);
        el.classList.add('is-revealed');
        Array.prototype.forEach.call(el.querySelectorAll('[data-count-to]'), runCounter);
        if (html.classList.contains('anim')) {
          Array.prototype.forEach.call(el.querySelectorAll('.packet-motion'), function (m) {
            if (m.beginElement) m.beginElement();
          });
        }
      });
    }, { threshold: 0.35 });

    Array.prototype.forEach.call(storyline.querySelectorAll('[data-reveal]'), function (el) {
      observer.observe(el);
    });
  }

  function runCounter(el) {
    var to = parseFloat(el.dataset.countTo);
    var write = function (v) { el.textContent = formatCount(v, el.dataset.prefix, el.dataset.suffix); };
    if (!html.classList.contains('anim')) {
      write(to);
      return;
    }
    var DURATION = 1200;
    var start = null;
    function step(time) {
      if (start === null) start = time;
      var t = (time - start) / DURATION;
      write(tween(0, to, t));
      if (t < 1) root.requestAnimationFrame(step);
    }
    root.requestAnimationFrame(step);
  }

  function initOrgChart() {
    var chart = storyline.querySelector('.org-chart');
    if (!chart) return;
    var live = chart.closest('figure').querySelector('.org-live');
    var pinned = null;

    // On narrow screens the chart scrolls inside its panel; start centered
    // on the board/CEO spine rather than the left edge.
    var scroller = chart.parentNode;
    scroller.scrollLeft = (scroller.scrollWidth - scroller.clientWidth) / 2;

    function show(id) {
      var linked = id ? linkedIds(ORG, id) : { nodes: [], edges: [] };
      chart.classList.toggle('has-active', !!id);
      Array.prototype.forEach.call(chart.querySelectorAll('.org-node'), function (n) {
        var nid = n.getAttribute('data-id');
        n.classList.toggle('is-active', nid === id);
        n.classList.toggle('is-linked', linked.nodes.indexOf(nid) !== -1);
        n.setAttribute('aria-pressed', nid === pinned ? 'true' : 'false');
      });
      Array.prototype.forEach.call(chart.querySelectorAll('.org-edge'), function (e) {
        e.classList.toggle('is-linked', linked.edges.indexOf(e.getAttribute('data-edge')) !== -1);
      });
      if (live) live.textContent = id ? describeNode(ORG, id) : 'Select a role to see its reporting and decision links.';
    }

    function togglePin(id) {
      pinned = pinned === id ? null : id;
      show(pinned);
    }

    Array.prototype.forEach.call(chart.querySelectorAll('.org-node'), function (n) {
      var id = n.getAttribute('data-id');
      n.addEventListener('pointerenter', function () { if (!pinned) show(id); });
      n.addEventListener('pointerleave', function () { show(pinned); });
      n.addEventListener('focus', function () { if (!pinned) show(id); });
      n.addEventListener('blur', function () { show(pinned); });
      n.addEventListener('click', function (ev) {
        ev.stopPropagation();
        togglePin(id);
      });
      n.addEventListener('keydown', function (ev) {
        if (ev.key === 'Enter' || ev.key === ' ') {
          ev.preventDefault();
          togglePin(id);
        }
      });
    });

    chart.addEventListener('keydown', function (ev) {
      if (ev.key === 'Escape') {
        pinned = null;
        show(null);
      }
    });
    chart.addEventListener('click', function () {
      pinned = null;
      show(null);
    });
  }
})(typeof window !== 'undefined' ? window : this);
