/* ==========================================================================
   Essays page: "Thoughts" timeline of X and LinkedIn posts
   Reads /assets/data/posts.json and renders it newest-first. The markup
   inside #feed-list is a fallback (links to the profiles) that stays if
   the JSON can't load or JavaScript is off.
   ========================================================================== */
(function () {
  'use strict';

  var list = document.getElementById('feed-list');
  if (!list) return;
  var filters = document.querySelectorAll('.feed-filter');
  var sampleTag = document.querySelector('.feed-sample');

  var ICONS = {
    x: '<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.9 2H22l-7.6 8.7L23.3 22h-7l-5.5-7.2L4.5 22H1.4l8.1-9.3L1 2h7.2l5 6.6L18.9 2zm-1.2 18h1.7L7.4 3.9H5.6L17.7 20z"/></svg>',
    linkedin: '<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.03-1.85-3.03-1.85 0-2.14 1.45-2.14 2.94v5.66H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z"/></svg>'
  };

  var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  function formatDate(iso) {
    var p = iso.split('-');
    return MONTHS[+p[1] - 1] + ' ' + (+p[2]) + ', ' + p[0];
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  var PAGE = 12;
  var state = { source: 'all', shown: PAGE };
  var more = document.querySelector('.feed-more');
  var avatar = document.querySelector('.feed-avatar');

  // Escape, then keep the post's own line breaks.
  function formatText(s) {
    return escapeHtml(s).replace(/\n/g, '<br>');
  }

  function renderQuote(q) {
    return (
      '<blockquote class="feed-quote">' +
        '<p class="feed-quote-author">' + escapeHtml(q.author) + ' <span>' + escapeHtml(q.handle) + '</span></p>' +
        '<p>' + formatText(q.text) + '</p>' +
        (q.inner ? '<p class="feed-quote-inner">' + formatText(q.inner) + '</p>' : '') +
      '</blockquote>'
    );
  }

  function renderLink(l) {
    return (
      '<a class="feed-card" href="' + escapeHtml(l.url) + '" target="_blank" rel="noopener">' +
        '<span class="feed-card-site">' + escapeHtml(l.site) + '</span>' +
        '<span class="feed-card-title">' + escapeHtml(l.title) + '</span>' +
      '</a>'
    );
  }

  function render(data) {
    var posts = data.posts.slice().sort(function (a, b) { return a.date < b.date ? 1 : -1; });
    list.innerHTML = posts.map(function (post) {
      var profile = data.profiles[post.source];
      return (
        '<li class="feed-item" data-source="' + post.source + '">' +
          '<div class="feed-meta">' +
            '<span class="feed-source" role="img" aria-label="' + profile.label + '">' + ICONS[post.source] + '</span>' +
            '<time datetime="' + post.date + '">' + formatDate(post.date) + '</time>' +
          '</div>' +
          '<p>' + formatText(post.text) + '</p>' +
          (post.quote ? renderQuote(post.quote) : '') +
          (post.link ? renderLink(post.link) : '') +
          (post.image ? '<img class="feed-image" src="' + escapeHtml(post.image) + '" alt="' + escapeHtml(post.alt || '') + '" loading="lazy" decoding="async">' : '') +
          '<a class="feed-link" href="' + escapeHtml(post.url) + '" target="_blank" rel="noopener">View on ' + profile.label + ' <span aria-hidden="true">&rarr;</span></a>' +
        '</li>'
      );
    }).join('');
    if (sampleTag) sampleTag.hidden = !data.sample;
    if (avatar && data.profiles.x.avatar) {
      avatar.src = data.profiles.x.avatar;
      avatar.hidden = false;
    }
  }

  // Show the first `shown` posts matching the current source filter.
  function update() {
    Array.prototype.forEach.call(filters, function (btn) {
      btn.setAttribute('aria-pressed', btn.dataset.source === state.source ? 'true' : 'false');
    });
    var matching = 0;
    Array.prototype.forEach.call(list.querySelectorAll('.feed-item'), function (item) {
      var match = state.source === 'all' || item.dataset.source === state.source;
      if (match) matching++;
      item.hidden = !match || matching > state.shown;
    });
    if (more) more.hidden = matching <= state.shown;
  }

  Array.prototype.forEach.call(filters, function (btn) {
    btn.addEventListener('click', function () {
      state.source = btn.dataset.source;
      state.shown = PAGE;
      update();
    });
  });

  if (more) {
    more.addEventListener('click', function () {
      state.shown += PAGE;
      update();
    });
  }

  fetch('/assets/data/posts.json')
    .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(function (data) {
      render(data);
      update();
    })
    .catch(function () { /* keep the fallback links */ });
})();
