(function () {
  'use strict';

  var canvas = document.getElementById('starfield');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var width, height, dpr;
  var stars = [];
  var planets = [];
  var shootingStars = [];
  var mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
  var lastShotAt = 0;
  var nextShotDelay = randomBetween(2500, 6000);

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
    buildPlanets();
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

  function buildPlanets() {
    planets = [
      {
        x: width * 0.86,
        y: height * 0.18,
        r: Math.max(38, Math.min(width, height) * 0.06),
        depth: 0.15,
        colors: ['#ffb27a', '#7a3d2b'],
        ring: false,
        driftPhase: 0
      },
      {
        x: width * 0.1,
        y: height * 0.78,
        r: Math.max(26, Math.min(width, height) * 0.045),
        depth: 0.3,
        colors: ['#a9c4ff', '#2a3970'],
        ring: true,
        driftPhase: 2
      },
      {
        x: width * 0.5,
        y: height * 0.08,
        r: Math.max(10, Math.min(width, height) * 0.015),
        depth: 0.4,
        colors: ['#e8e8f0', '#8a8aa0'],
        ring: false,
        driftPhase: 4
      }
    ];
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

  function drawPlanets(time) {
    for (var i = 0; i < planets.length; i++) {
      var p = planets[i];
      var drift = reduceMotion ? 0 : Math.sin(time * 0.00012 + p.driftPhase) * 10;
      var offsetX = (reduceMotion ? 0 : mouse.x * p.depth * 26) + drift;
      var offsetY = (reduceMotion ? 0 : mouse.y * p.depth * 26) + drift * 0.4;
      var px = p.x + offsetX;
      var py = p.y + offsetY;

      if (p.ring) {
        ctx.save();
        ctx.translate(px, py);
        ctx.rotate(-0.35);
        ctx.beginPath();
        ctx.ellipse(0, 0, p.r * 1.9, p.r * 0.55, 0, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(200,210,255,0.35)';
        ctx.lineWidth = Math.max(2, p.r * 0.08);
        ctx.stroke();
        ctx.restore();
      }

      var grad = ctx.createRadialGradient(px - p.r * 0.3, py - p.r * 0.3, p.r * 0.1, px, py, p.r);
      grad.addColorStop(0, p.colors[0]);
      grad.addColorStop(1, p.colors[1]);
      ctx.beginPath();
      ctx.arc(px, py, p.r, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      var glow = ctx.createRadialGradient(px, py, p.r, px, py, p.r * 2.2);
      glow.addColorStop(0, 'rgba(255,255,255,0.08)');
      glow.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.beginPath();
      ctx.arc(px, py, p.r * 2.2, 0, Math.PI * 2);
      ctx.fillStyle = glow;
      ctx.fill();
    }
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

  function frame(time) {
    ctx.clearRect(0, 0, width, height);
    drawPlanets(time);
    drawStars(time);
    drawShootingStars();

    if (!reduceMotion && time - lastShotAt > nextShotDelay) {
      spawnShootingStar();
      lastShotAt = time;
      nextShotDelay = randomBetween(3500, 8000);
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
