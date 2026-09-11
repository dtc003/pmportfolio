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
  var nextShotDelay = randomBetween(2500, 6000);

  var earth = {
    x: 0, y: 0, r: 0, depth: 0.12,
    sphereCanvas: null,
    sphereSize: 0,
    centerLon: -35,
    lastRenderLon: null
  };
  var earthImg = new Image();
  var earthReady = false;
  earthImg.onload = function () {
    earthReady = true;
    renderEarthSphere(true);
  };
  earthImg.src = '/assets/img/earth.jpg';

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
    var count = Math.round((width * height) / 2600);
    count = Math.max(90, Math.min(count, 320));
    stars = [];
    for (var i = 0; i < count; i++) {
      var layer = Math.random();
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: layer < 0.6 ? randomBetween(0.5, 1.2) : layer < 0.9 ? randomBetween(1.2, 1.9) : randomBetween(1.9, 2.6),
        baseAlpha: randomBetween(0.35, 1),
        twinkleSpeed: randomBetween(0.4, 1.6),
        phase: Math.random() * Math.PI * 2,
        depth: layer < 0.6 ? 0.25 : layer < 0.9 ? 0.5 : 0.85
      });
    }
  }

  function buildEarth() {
    var diameter = Math.min(width * 0.5, height * 0.62);
    diameter = Math.max(220, Math.min(diameter, 460));
    earth.r = diameter / 2;
    earth.x = width - earth.r * 0.35;
    earth.y = earth.r * 0.75;
    var sphereSize = Math.round(diameter * dpr);
    if (sphereSize !== earth.sphereSize) {
      earth.sphereSize = sphereSize;
      earth.sphereCanvas = document.createElement('canvas');
      earth.sphereCanvas.width = sphereSize;
      earth.sphereCanvas.height = sphereSize;
      if (earthReady) renderEarthSphere(true);
    }
  }

  // Projects the equirectangular NASA Blue Marble texture onto a circle using
  // arcsine column spacing so longitude lines compress toward the limb, the
  // way they actually foreshorten on a sphere viewed from outside.
  function renderEarthSphere(force) {
    if (!earthReady || !earth.sphereCanvas) return;
    if (!force && earth.lastRenderLon === earth.centerLon) return;
    earth.lastRenderLon = earth.centerLon;

    var size = earth.sphereSize;
    var R = size / 2;
    var sctx = earth.sphereCanvas.getContext('2d');
    sctx.clearRect(0, 0, size, size);
    sctx.save();
    sctx.beginPath();
    sctx.arc(R, R, R, 0, Math.PI * 2);
    sctx.clip();

    var srcW = earthImg.naturalWidth || earthImg.width;
    var srcH = earthImg.naturalHeight || earthImg.height;
    var sliceW = Math.max(1, Math.ceil(size / 220));

    for (var px = 0; px < size; px += 1) {
      var u = (px - R) / R;
      if (u < -1) u = -1;
      if (u > 1) u = 1;
      var angleDeg = Math.asin(u) * (180 / Math.PI);
      var lonDeg = earth.centerLon + angleDeg;
      var frac = ((lonDeg + 180) % 360 + 360) % 360 / 360;
      var srcX = frac * srcW;
      var sx = srcX - sliceW / 2;
      if (sx < 0) sx += srcW;
      if (sx + sliceW > srcW) {
        sctx.drawImage(earthImg, sx, 0, srcW - sx, srcH, px, 0, 1, size);
      } else {
        sctx.drawImage(earthImg, sx, 0, sliceW, srcH, px, 0, 1, size);
      }
    }

    // Day/night terminator — light source from upper-left, matching the rim glow.
    var termGrad = sctx.createLinearGradient(size * 0.08, size * 0.05, size * 0.92, size * 0.95);
    termGrad.addColorStop(0, 'rgba(255,255,255,0)');
    termGrad.addColorStop(0.55, 'rgba(4,6,14,0.12)');
    termGrad.addColorStop(1, 'rgba(2,3,8,0.72)');
    sctx.fillStyle = termGrad;
    sctx.fillRect(0, 0, size, size);

    // Subtle spherical vignette so the limb reads as curved, not a flat disc.
    var vign = sctx.createRadialGradient(R, R, R * 0.55, R, R, R);
    vign.addColorStop(0, 'rgba(0,0,0,0)');
    vign.addColorStop(1, 'rgba(0,0,0,0.35)');
    sctx.fillStyle = vign;
    sctx.fillRect(0, 0, size, size);

    sctx.restore();
  }

  function spawnShootingStar(originX, originY) {
    var fromEdge = originX === undefined;
    var x = fromEdge ? randomBetween(0, width * 0.6) : originX;
    var y = fromEdge ? randomBetween(0, height * 0.3) : originY;
    var angle = randomBetween(0.35, 0.85);
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

    // Outer atmosphere glow.
    var glow = ctx.createRadialGradient(ex, ey, earth.r * 0.98, ex, ey, earth.r * 1.18);
    glow.addColorStop(0, 'rgba(150,190,255,0.22)');
    glow.addColorStop(1, 'rgba(150,190,255,0)');
    ctx.beginPath();
    ctx.arc(ex, ey, earth.r * 1.18, 0, Math.PI * 2);
    ctx.fillStyle = glow;
    ctx.fill();

    if (earth.sphereCanvas) {
      ctx.drawImage(earth.sphereCanvas, ex - earth.r, ey - earth.r, earth.r * 2, earth.r * 2);
    }

    // Rim light along the lit (upper-left) edge.
    ctx.save();
    ctx.beginPath();
    ctx.arc(ex, ey, earth.r, 0, Math.PI * 2);
    ctx.clip();
    var rim = ctx.createRadialGradient(
      ex - earth.r * 0.55, ey - earth.r * 0.55, earth.r * 0.1,
      ex - earth.r * 0.55, ey - earth.r * 0.55, earth.r * 1.5
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

  var lastRotationTick = 0;

  function frame(time) {
    ctx.clearRect(0, 0, width, height);
    drawEarth(time);
    drawStars(time);
    drawShootingStars();

    if (!reduceMotion) {
      if (time - lastRotationTick > 1800) {
        earth.centerLon = (earth.centerLon + 2.2) % 360;
        renderEarthSphere(false);
        lastRotationTick = time;
      }
      if (time - lastShotAt > nextShotDelay) {
        spawnShootingStar();
        lastShotAt = time;
        nextShotDelay = randomBetween(3500, 8000);
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
