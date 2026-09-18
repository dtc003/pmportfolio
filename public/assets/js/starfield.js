(function () {
  'use strict';

  var canvas = document.getElementById('starfield');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasHero = !!document.querySelector('.hero');
  var scrollY = window.scrollY || 0;

  var width, height, dpr;
  var stars = [];
  var shootingStars = [];
  var mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
  var lastShotAt = 0;
  var nextShotDelay = randomBetween(5000, 12000);

  var ROTATION_DEG_PER_MS = 4 / 1000;
  var RECOMPUTE_INTERVAL_MS = 60;

  var earth = {
    x: 0, y: 0, r: 0, depth: 0.12,
    sphereSize: 0,
    displayLon: -35,
    sphereCanvas: null,
    lastRenderedLon: null
  };
  var earthImg = new Image();
  var earthReady = false;
  earthImg.onload = function () {
    earthReady = true;
    renderEarthNow();
  };
  earthImg.src = '/assets/img/earth.jpg';

  var nightImg = new Image();
  var nightReady = false;
  nightImg.onload = function () {
    nightReady = true;
    renderEarthNow();
  };
  nightImg.src = '/assets/img/earth-night.jpg';

  var cloudsImg = new Image();
  var cloudsReady = false;
  cloudsImg.onload = function () {
    cloudsReady = true;
    renderEarthNow();
  };
  cloudsImg.src = '/assets/img/earth-clouds.jpg';

  function randomBetween(min, max) {
    return Math.random() * (max - min) + min;
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    buildStars();
    buildEarth();
  }

  function buildStars() {
    var count = Math.round((width * height) / 4500);
    count = Math.max(60, Math.min(count, 190));
    stars = [];
    for (var i = 0; i < count; i++) {
      var layer = Math.random();
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: layer < 0.6 ? randomBetween(0.35, 0.8) : layer < 0.9 ? randomBetween(0.8, 1.2) : randomBetween(1.2, 1.7),
        baseAlpha: randomBetween(0.3, 0.9),
        twinkleSpeed: randomBetween(0.4, 1.6),
        phase: Math.random() * Math.PI * 2,
        depth: layer < 0.6 ? 0.25 : layer < 0.9 ? 0.5 : 0.85
      });
    }
  }

  var EARTH_SCALE = 1.6;
  var heroContentEl = document.querySelector('.hero-content');

  function buildEarth() {
    var isNarrow = width < 640;
    if (isNarrow) {
      var heroActions = document.querySelector('.hero-actions');
      var diameter = Math.min(width * 0.7, height * 0.4) * EARTH_SCALE;
      diameter = Math.max(220, Math.min(diameter, 460));
      earth.r = diameter / 2;
      earth.x = width - earth.r * 0.45;
      var actionsBottom = heroActions ? heroActions.getBoundingClientRect().bottom : height * 0.7;
      earth.y = Math.max(actionsBottom + earth.r * 0.4, height - earth.r * 0.6);
    } else {
      var margin = Math.max(70, width * 0.09);
      var idealDiameter = Math.min(width * 0.3, height * 0.55) * EARTH_SCALE;
      idealDiameter = Math.max(280, Math.min(idealDiameter, 640));
      // Measure the actual rendered text column so the sphere can never
      // overlap it, whatever the font/viewport combination does — a fixed
      // px/vw formula can't account for real text metrics at every width.
      var textRight = heroContentEl ? heroContentEl.getBoundingClientRect().right : 0;
      var gap = 48;
      var availableWidth = width - margin - textRight - gap;
      var diameter = Math.max(200, Math.min(idealDiameter, availableWidth));
      earth.r = diameter / 2;
      earth.x = width - earth.r - margin;
      earth.y = 72 + (height - 72) / 2;
    }
    // Internal render resolution is capped well below the display size and
    // upscaled via drawImage (cheap, GPU-accelerated bitmap scaling) rather
    // than compositing the full per-column projection at full display
    // resolution every tick — that was the actual cost driver, not the
    // rotation itself. SpaceX's equivalent (inspected directly) is a
    // pre-rendered video, not a live per-frame render, which is why it
    // costs nothing at runtime; this is the closest equivalent for a
    // canvas-generated sphere: do the expensive part at a fixed modest
    // resolution, stretch the result to display size.
    var sphereSize = Math.round(Math.min(diameter * dpr, 480));
    if (sphereSize !== earth.sphereSize) {
      earth.sphereSize = sphereSize;
      earth.sphereCanvas = document.createElement('canvas');
      earth.sphereCanvas.width = sphereSize;
      earth.sphereCanvas.height = sphereSize;
      earth.lastRenderedLon = null;
      renderEarthNow();
    }
  }

  // Projects an equirectangular texture onto a destination canvas using
  // arcsine column spacing so longitude lines compress toward the limb, the
  // way they actually foreshorten on a sphere viewed from outside. Caller is
  // responsible for clipping the destination to the sphere circle first.
  function projectColumns(destCtx, img, size, R, step, sliceW, centerLon) {
    var srcW = img.naturalWidth || img.width;
    var srcH = img.naturalHeight || img.height;
    for (var px = 0; px < size; px += step) {
      var u = (px - R) / R;
      if (u < -1) u = -1;
      if (u > 1) u = 1;
      var angleDeg = Math.asin(u) * (180 / Math.PI);
      var lonDeg = centerLon + angleDeg;
      var frac = ((lonDeg + 180) % 360 + 360) % 360 / 360;
      var srcX = frac * srcW;
      var sx = srcX - sliceW / 2;
      if (sx < 0) sx += srcW;
      if (sx + sliceW > srcW) {
        destCtx.drawImage(img, sx, 0, srcW - sx, srcH, px, 0, step, size);
      } else {
        destCtx.drawImage(img, sx, 0, sliceW, srcH, px, 0, step, size);
      }
    }
  }

  var nightLayer = document.createElement('canvas');
  var cloudsLayer = document.createElement('canvas');

  // Terminator runs along a VERTICAL axis (light left, dark right) rather
  // than a diagonal split, but fades gradually across a wide band — like
  // the real spacex.com Mars phase, not a hard binary edge. All three masks
  // below share this exact axis so the day/night boundary, night lights,
  // and cloud fade all line up. Stops pushed darker/earlier than a first
  // pass — that version read as too washed-out once seen at full size.
  var SHADOW_STOPS = [
    [0, 'rgba(0,0,0,0)'],
    [0.18, 'rgba(0,0,0,0)'],
    [0.35, 'rgba(0,0,0,0.4)'],
    [0.5, 'rgba(0,0,0,0.78)'],
    [0.65, 'rgba(0,0,0,0.95)'],
    [0.8, 'rgba(0,0,0,0.995)'],
    [1, 'rgba(0,0,0,1)']
  ];
  var CLOUD_FADE_STOPS = [
    [0, 'rgba(255,255,255,1)'],
    [0.18, 'rgba(255,255,255,1)'],
    [0.35, 'rgba(255,255,255,0.7)'],
    [0.5, 'rgba(255,255,255,0.3)'],
    [0.65, 'rgba(255,255,255,0.1)'],
    [0.8, 'rgba(255,255,255,0.04)'],
    [1, 'rgba(255,255,255,0.04)']
  ];

  function verticalAxisGradient(ctx2d, size, stops) {
    var g = ctx2d.createLinearGradient(size * 0.2, 0, size * 0.8, 0);
    for (var i = 0; i < stops.length; i++) g.addColorStop(stops[i][0], stops[i][1]);
    return g;
  }

  // Pure: composes one fully-lit/shadowed/cloud-covered sphere at a given
  // longitude into destCanvas.
  function composeSphereInto(destCanvas, size, lonDeg) {
    var R = size / 2;
    var sctx = destCanvas.getContext('2d');
    sctx.clearRect(0, 0, size, size);
    sctx.save();
    sctx.beginPath();
    sctx.arc(R, R, R, 0, Math.PI * 2);
    sctx.clip();

    var step = size > 340 ? 2 : 1;
    var sliceW = Math.max(1, Math.ceil((size / 220) * step));

    projectColumns(sctx, earthImg, size, R, step, sliceW, lonDeg);

    sctx.fillStyle = verticalAxisGradient(sctx, size, SHADOW_STOPS);
    sctx.fillRect(0, 0, size, size);

    if (nightReady) {
      if (nightLayer.width !== size) {
        nightLayer.width = size;
        nightLayer.height = size;
      }
      var nctx = nightLayer.getContext('2d');
      nctx.clearRect(0, 0, size, size);
      nctx.save();
      nctx.beginPath();
      nctx.arc(R, R, R, 0, Math.PI * 2);
      nctx.clip();
      // High contrast, no brightness lift: crushes the ocean's faint blue
      // tint down to true black while still popping city lights, so the
      // night side reads as "just the lights," not a lit blue hemisphere.
      nctx.filter = 'contrast(2.4) saturate(1.4) brightness(1.05)';
      projectColumns(nctx, nightImg, size, R, step, sliceW, lonDeg);
      nctx.filter = 'none';
      nctx.globalCompositeOperation = 'destination-in';
      nctx.fillStyle = verticalAxisGradient(nctx, size, SHADOW_STOPS);
      nctx.fillRect(0, 0, size, size);
      nctx.restore();

      sctx.globalCompositeOperation = 'screen';
      sctx.drawImage(nightLayer, 0, 0);
      sctx.globalCompositeOperation = 'source-over';
    }

    // Cloud layer — grayscale cloud-fraction map, "screen" blended so bright
    // (cloudy) pixels add white and black (clear sky) pixels leave the
    // surface untouched underneath. Cut almost entirely on the night side —
    // only lights should show through the shadow, not cloud haze.
    if (cloudsReady) {
      if (cloudsLayer.width !== size) {
        cloudsLayer.width = size;
        cloudsLayer.height = size;
      }
      var cctx = cloudsLayer.getContext('2d');
      cctx.clearRect(0, 0, size, size);
      cctx.save();
      cctx.beginPath();
      cctx.arc(R, R, R, 0, Math.PI * 2);
      cctx.clip();
      projectColumns(cctx, cloudsImg, size, R, step, sliceW, lonDeg);
      cctx.globalCompositeOperation = 'destination-in';
      cctx.fillStyle = verticalAxisGradient(cctx, size, CLOUD_FADE_STOPS);
      cctx.fillRect(0, 0, size, size);
      cctx.restore();

      sctx.globalCompositeOperation = 'screen';
      sctx.drawImage(cloudsLayer, 0, 0);
      sctx.globalCompositeOperation = 'source-over';
    }

    // Subtle spherical vignette so the limb reads as curved, not a flat disc.
    var vign = sctx.createRadialGradient(R, R, R * 0.55, R, R, R);
    vign.addColorStop(0, 'rgba(0,0,0,0)');
    vign.addColorStop(1, 'rgba(0,0,0,0.35)');
    sctx.fillStyle = vign;
    sctx.fillRect(0, 0, size, size);

    sctx.restore();
  }

  // Renders the sphere at its current displayLon directly into the single
  // reusable sphereCanvas. Called on a short throttle (see frame()), not
  // every animation frame.
  //
  // History here matters — two other approaches were tried and rejected:
  // 1. Live recompute every ~45ms: smooth, but the recompute itself (three
  //    layers of per-column projection) was expensive enough to visibly
  //    lag the whole page.
  // 2. Precomputing a fixed set of rotation frames once and cross-fading
  //    between the two nearest via globalAlpha: cheap at runtime (two
  //    drawImage calls), but a plain opacity dissolve between two full,
  //    independently-rendered bitmaps of a *rotating* sphere reads as a
  //    flicker/pulse on high-contrast detail (city lights, the sharp
  //    terminator edge) rather than motion — it looks like fast, repeating
  //    juddering, not a smooth spin. Confirmed by direct comparison; this
  //    was the actual cause of the "way too fast / repeats" report, not a
  //    speed miscalculation.
  // The fix is a compromise between those two: recompute live (so every
  // rendered frame is a genuine, correctly-projected sphere at its own
  // angle — no dissolve artifact) but throttled to a short, fixed interval
  // rather than every animation frame, now that the internal render
  // resolution is already capped low (see buildEarth) — that resolution
  // cap, not the interval, was the actual cost driver behind report #1.
  function renderEarthNow() {
    if (!earthReady || !earth.sphereCanvas) return;
    composeSphereInto(earth.sphereCanvas, earth.sphereSize, earth.displayLon);
    earth.lastRenderedLon = earth.displayLon;
  }

  function spawnShootingStar(originX, originY) {
    var fromEdge = originX === undefined;
    var x = fromEdge ? randomBetween(-width * 0.3, width * 0.9) : originX;
    var y = fromEdge ? randomBetween(-height * 0.15, height * 0.45) : originY;
    var angle = randomBetween(0.1, 1.1);
    var speed = randomBetween(9, 15);
    shootingStars.push({
      x: x,
      y: y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 1,
      length: randomBetween(80, 160)
    });
  }

  function drawStars(time) {
    for (var i = 0; i < stars.length; i++) {
      var s = stars[i];
      var twinkle = reduceMotion ? 0 : Math.sin(time * 0.001 * s.twinkleSpeed + s.phase) * 0.35;
      var alpha = Math.max(0, Math.min(1, s.baseAlpha + twinkle));
      var offsetX = reduceMotion ? 0 : (mouse.x * s.depth * 18);
      var offsetY = reduceMotion ? 0 : (mouse.y * s.depth * 18);
      ctx.beginPath();
      ctx.arc(s.x + offsetX, s.y + offsetY, s.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,' + alpha.toFixed(3) + ')';
      ctx.fill();
    }
  }

  function drawEarth(time) {
    if (!hasHero || !earthReady) return;
    var offsetX = reduceMotion ? 0 : mouse.x * earth.depth * 22;
    var offsetY = reduceMotion ? 0 : mouse.y * earth.depth * 22;
    var ex = earth.x + offsetX;
    var ey = earth.y + offsetY - scrollY * 0.6;

    if (ey + earth.r * 1.2 < 0 || ey - earth.r * 1.2 > height) return;

    if (earth.sphereCanvas) {
      var d = earth.r * 2;
      ctx.drawImage(earth.sphereCanvas, ex - earth.r, ey - earth.r, d, d);
    }

    // Rim light along the lit (left) edge, matching the vertical terminator.
    ctx.save();
    ctx.beginPath();
    ctx.arc(ex, ey, earth.r, 0, Math.PI * 2);
    ctx.clip();
    var rim = ctx.createRadialGradient(
      ex - earth.r * 0.75, ey, earth.r * 0.1,
      ex - earth.r * 0.75, ey, earth.r * 1.5
    );
    rim.addColorStop(0, 'rgba(255,255,255,0.16)');
    rim.addColorStop(0.4, 'rgba(255,255,255,0)');
    ctx.fillStyle = rim;
    ctx.fillRect(ex - earth.r, ey - earth.r, earth.r * 2, earth.r * 2);
    ctx.restore();
  }

  function drawShootingStars() {
    for (var i = shootingStars.length - 1; i >= 0; i--) {
      var c = shootingStars[i];
      c.x += c.vx;
      c.y += c.vy;
      c.life -= 0.012;

      var tailX = c.x - c.vx * (c.length / 12);
      var tailY = c.y - c.vy * (c.length / 12);
      var grad = ctx.createLinearGradient(c.x, c.y, tailX, tailY);
      grad.addColorStop(0, 'rgba(255,255,255,' + Math.max(0, c.life).toFixed(3) + ')');
      grad.addColorStop(1, 'rgba(255,255,255,0)');

      ctx.beginPath();
      ctx.strokeStyle = grad;
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.moveTo(c.x, c.y);
      ctx.lineTo(tailX, tailY);
      ctx.stroke();

      if (c.life <= 0 || c.x > width + 100 || c.y > height + 100) {
        shootingStars.splice(i, 1);
      }
    }
  }

  var lastFrameTime = 0;
  var lastEarthRenderTime = 0;

  function frame(time) {
    var deltaMs = lastFrameTime ? Math.min(time - lastFrameTime, 100) : 0;
    lastFrameTime = time;

    ctx.clearRect(0, 0, width, height);
    drawStars(time);
    drawEarth(time);
    drawShootingStars();

    if (!reduceMotion) {
      earth.displayLon = (earth.displayLon + ROTATION_DEG_PER_MS * deltaMs) % 360;
      if (time - lastEarthRenderTime > RECOMPUTE_INTERVAL_MS) {
        renderEarthNow();
        lastEarthRenderTime = time;
      }
      if (time - lastShotAt > nextShotDelay) {
        spawnShootingStar();
        lastShotAt = time;
        nextShotDelay = randomBetween(7000, 16000);
      }
    }

    requestAnimationFrame(frame);
  }

  function onPointerMove(clientX, clientY) {
    mouse.targetX = (clientX / width - 0.5) * 2;
    mouse.targetY = (clientY / height - 0.5) * 2;
  }

  function smoothMouse() {
    mouse.x += (mouse.targetX - mouse.x) * 0.04;
    mouse.y += (mouse.targetY - mouse.y) * 0.04;
    requestAnimationFrame(smoothMouse);
  }

  window.addEventListener('resize', resize);
  window.addEventListener('scroll', function () {
    scrollY = window.scrollY || 0;
  }, { passive: true });
  window.addEventListener('mousemove', function (e) {
    onPointerMove(e.clientX, e.clientY);
  });
  window.addEventListener('touchmove', function (e) {
    if (e.touches && e.touches[0]) {
      onPointerMove(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: true });
  window.addEventListener('click', function (e) {
    spawnShootingStar(e.clientX, e.clientY);
  });
  window.addEventListener('touchstart', function (e) {
    if (e.touches && e.touches[0]) {
      spawnShootingStar(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: true });

  resize();
  requestAnimationFrame(frame);
  if (!reduceMotion) requestAnimationFrame(smoothMouse);
})();
