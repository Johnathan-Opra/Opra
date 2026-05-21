// Opra Particle Globe — extended with target-state lerping for scroll-driven transitions.
// Vanilla canvas — rotating fibonacci sphere + drifting particles + event pings + focus city.

(function () {
  const TAU = Math.PI * 2;

  const CITIES = [
    [-26.2041, 28.0473, "Johannesburg"],
    [-33.9249, 18.4241, "Cape Town"],
    [-29.8587, 31.0218, "Durban"],
    [6.5244, 3.3792, "Lagos"],
    [-1.2921, 36.8219, "Nairobi"],
    [30.0444, 31.2357, "Cairo"],
    [51.5072, -0.1276, "London"],
    [40.7128, -74.006, "New York"],
    [37.7749, -122.4194, "San Francisco"],
    [52.52, 13.405, "Berlin"],
    [48.8566, 2.3522, "Paris"],
    [25.2048, 55.2708, "Dubai"],
    [1.3521, 103.8198, "Singapore"],
    [-33.8688, 151.2093, "Sydney"],
    [35.6762, 139.6503, "Tokyo"],
    [19.076, 72.8777, "Mumbai"],
    [-23.5505, -46.6333, "São Paulo"],
    [43.6532, -79.3832, "Toronto"],
  ];

  const EVENTS = [
    "Lead captured",
    "CRM sync",
    "Invoice sent",
    "Onboarding triggered",
    "Report generated",
    "Proposal drafted",
    "Workflow run",
    "Approval granted",
    "Document parsed",
    "Email routed",
  ];

  function lerp(a, b, t) { return a + (b - a) * t; }
  function lerpAngle(a, b, t) {
    let d = ((b - a) % TAU + TAU * 1.5) % TAU - Math.PI;
    return a + d * t;
  }

  window.OpraGlobe = function (canvas, opts = {}) {
    const cfg = Object.assign(
      {
        dots: 1400,
        particles: 90,
        accent: "#7CE3FF",
        dim: "rgba(220,232,245,0.55)",
        speed: 0.0009,
        showLabels: true,
        showLines: true,
        showRings: true,
        radiusPct: 0.34,
        glow: true,
        eventEveryMs: 2200,
      },
      opts
    );

    const ctx = canvas.getContext("2d");
    let W = 0, H = 0, DPR = 1, R0 = 0, CX = 0, CY = 0;
    let dots = [];
    let particles = [];
    let events = [];

    const state = {
      offsetX: 0, offsetY: 0,
      scale: 1,
      spin: cfg.speed,
      ringOpacity: 1,
      labelOpacity: 1,
      lineOpacity: 1,
      particleAlpha: 1,
      focusAmt: 0,
      focusLat: 0, focusLon: 0,
      rotY: 0, rotX: -0.32,
      eventsPerSec: 0.5,
    };

    const target = {
      offsetX: 0, offsetY: 0,
      scale: 1,
      spin: cfg.speed,
      ringOpacity: 1,
      labelOpacity: 1,
      lineOpacity: 1,
      particleAlpha: 1,
      focusAmt: 0,
      focusLat: 0, focusLon: 0,
      eventsPerSec: 0.5,
    };

    let rotXTarget = -0.32;
    let rotYTarget = null;

    let raf = 0;
    let lastT = performance.now();
    let eventTimer = 0;

    function resize() {
      DPR = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      W = rect.width;
      H = rect.height;
      canvas.width = W * DPR;
      canvas.height = H * DPR;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      CX = W / 2;
      CY = H / 2;
      R0 = Math.min(W, H) * cfg.radiusPct;
    }

    function makeDots(n) {
      const arr = [];
      const phi = Math.PI * (3 - Math.sqrt(5));
      for (let i = 0; i < n; i++) {
        const y = 1 - (i / (n - 1)) * 2;
        const r = Math.sqrt(1 - y * y);
        const theta = phi * i;
        arr.push({ x: Math.cos(theta) * r, y, z: Math.sin(theta) * r });
      }
      return arr;
    }

    function latLonToVec(lat, lon) {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lon + 180) * (Math.PI / 180);
      return {
        x: -Math.sin(phi) * Math.cos(theta),
        y: Math.cos(phi),
        z: Math.sin(phi) * Math.sin(theta),
      };
    }

    function makeParticles(n) {
      const arr = [];
      for (let i = 0; i < n; i++) {
        arr.push({
          dir: randomUnit(),
          baseOrbit: 1.05 + Math.random() * 0.55,
          axis: randomUnit(),
          omega: (Math.random() * 2 - 1) * 0.0006,
          phase: Math.random() * TAU,
          twinkle: Math.random() * TAU,
          size: 0.6 + Math.random() * 1.4,
        });
      }
      return arr;
    }

    function randomUnit() {
      const u = Math.random() * 2 - 1;
      const a = Math.random() * TAU;
      const s = Math.sqrt(1 - u * u);
      return { x: s * Math.cos(a), y: u, z: s * Math.sin(a) };
    }

    function rotAxis(v, axis, a) {
      const cosA = Math.cos(a), sinA = Math.sin(a);
      const dot = v.x * axis.x + v.y * axis.y + v.z * axis.z;
      const cx = axis.y * v.z - axis.z * v.y;
      const cy = axis.z * v.x - axis.x * v.z;
      const cz = axis.x * v.y - axis.y * v.x;
      return {
        x: v.x * cosA + cx * sinA + axis.x * dot * (1 - cosA),
        y: v.y * cosA + cy * sinA + axis.y * dot * (1 - cosA),
        z: v.z * cosA + cz * sinA + axis.z * dot * (1 - cosA),
      };
    }

    function applyGlobeRot(v) {
      const cy = Math.cos(state.rotY), sy = Math.sin(state.rotY);
      const x1 = v.x * cy + v.z * sy;
      const z1 = -v.x * sy + v.z * cy;
      const cx = Math.cos(state.rotX), sx = Math.sin(state.rotX);
      const y2 = v.y * cx - z1 * sx;
      const z2 = v.y * sx + z1 * cx;
      return { x: x1, y: y2, z: z2 };
    }

    const FOV = 2.4;
    function project(v, radius) {
      const persp = FOV / (FOV - v.z);
      const ox = state.offsetX * W;
      const oy = state.offsetY * H;
      return {
        x: CX + ox + v.x * radius * persp,
        y: CY + oy + v.y * radius * persp,
        depth: (v.z + 1) / 2,
        persp,
      };
    }

    function spawnEvent(forced) {
      const city = CITIES[(Math.random() * CITIES.length) | 0];
      const ev = EVENTS[(Math.random() * EVENTS.length) | 0];
      const base = latLonToVec(city[0], city[1]);
      events.push({
        base, city: city[2], label: ev,
        t0: performance.now(),
        life: 4800,
        tangent: Math.random() * TAU,
      });
      if (events.length > 6) events.shift();
    }

    function hexToRgb(hex) {
      const h = hex.replace("#", "");
      const n = parseInt(
        h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16
      );
      return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
    }
    let accentRGB = hexToRgb(cfg.accent);
    function accentA(a) {
      return `rgba(${accentRGB.r},${accentRGB.g},${accentRGB.b},${a})`;
    }

    function draw(now) {
      const dt = Math.min(64, now - lastT);
      lastT = now;

      const k = 1 - Math.pow(0.001, dt / 1000);
      const fast = 1 - Math.pow(0.0001, dt / 1000);
      state.offsetX      = lerp(state.offsetX, target.offsetX, k * 0.9);
      state.offsetY      = lerp(state.offsetY, target.offsetY, k * 0.9);
      state.scale        = lerp(state.scale, target.scale, k * 0.9);
      state.spin         = lerp(state.spin, target.spin, k);
      state.ringOpacity  = lerp(state.ringOpacity, target.ringOpacity, k);
      state.labelOpacity = lerp(state.labelOpacity, target.labelOpacity, k);
      state.lineOpacity  = lerp(state.lineOpacity, target.lineOpacity, k);
      state.particleAlpha= lerp(state.particleAlpha, target.particleAlpha, k);
      state.focusAmt     = lerp(state.focusAmt, target.focusAmt, k * 0.6);
      state.focusLat     = lerp(state.focusLat, target.focusLat, k * 0.6);
      state.focusLon     = lerp(state.focusLon, target.focusLon, k * 0.6);
      state.eventsPerSec = lerp(state.eventsPerSec, target.eventsPerSec, k);

      if (state.focusAmt > 0.05) {
        const lonRad = (state.focusLon + 180) * (Math.PI / 180);
        const targetRotY = -lonRad + Math.PI / 2;
        const latRad = state.focusLat * (Math.PI / 180);
        const targetRotX = -latRad;
        state.rotY = lerpAngle(state.rotY, targetRotY, k * 0.5);
        state.rotX = lerp(state.rotX, targetRotX, k * 0.5);
      } else {
        state.rotY += state.spin * dt;
        state.rotX = lerp(state.rotX, -0.32, k * 0.3);
      }

      eventTimer += dt;
      const interval = state.eventsPerSec > 0 ? 1000 / state.eventsPerSec : 1e9;
      if (eventTimer > interval) {
        eventTimer = 0;
        if (state.labelOpacity > 0.05) spawnEvent();
      }

      ctx.clearRect(0, 0, W, H);

      const R = R0 * state.scale;

      if (cfg.glow) drawGlow(R);
      if (cfg.showRings && state.ringOpacity > 0.02) drawRings(R);
      drawDots(R);
      drawParticles(R, now);
      if (cfg.showLabels && state.labelOpacity > 0.02) drawEvents(R, now);
      if (state.focusAmt > 0.1) drawFocus(R, now);

      raf = requestAnimationFrame(draw);
    }

    function drawGlow(R) {
      const ox = state.offsetX * W;
      const oy = state.offsetY * H;
      const grad = ctx.createRadialGradient(
        CX + ox, CY + oy, R * 0.15,
        CX + ox, CY + oy, R * 2.4
      );
      grad.addColorStop(0, accentA(0.09));
      grad.addColorStop(0.45, accentA(0.025));
      grad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);
    }

    function drawRings(R) {
      ctx.save();
      ctx.strokeStyle = accentA(0.08 * state.ringOpacity);
      ctx.lineWidth = 1;
      const steps = 120;
      const rings = [
        (t) => ({ x: Math.cos(t), y: 0, z: Math.sin(t) }),
        (t) => ({ x: Math.cos(t), y: Math.sin(t), z: 0 }),
        (t) => ({ x: 0, y: Math.sin(t), z: Math.cos(t) }),
      ];
      for (const rf of rings) {
        ctx.beginPath();
        for (let i = 0; i <= steps; i++) {
          const t = (i / steps) * TAU;
          const v = applyGlobeRot(rf(t));
          const p = project(v, R);
          if (i === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y);
        }
        ctx.stroke();
      }
      ctx.restore();
    }

    function drawDots(R) {
      for (let i = 0; i < dots.length; i++) {
        const v = applyGlobeRot(dots[i]);
        const p = project(v, R);
        const a = Math.pow(p.depth, 1.4);
        if (a < 0.04) continue;
        const size = 0.6 + 1.4 * p.depth;
        ctx.fillStyle = cfg.dim.replace(/[\d.]+\)$/, (a * 0.9).toFixed(3) + ")");
        ctx.beginPath();
        ctx.arc(p.x, p.y, size, 0, TAU);
        ctx.fill();
      }
    }

    function drawParticles(R, now) {
      const drawn = [];
      const pa = state.particleAlpha;
      if (pa < 0.02) return;
      for (let i = 0; i < particles.length; i++) {
        const pt = particles[i];
        pt.phase += pt.omega * 16;
        const dir = rotAxis(pt.dir, pt.axis, pt.phase);
        pt.twinkle += 0.02;
        const orbit = pt.baseOrbit + Math.sin(pt.twinkle) * 0.02;
        const world = { x: dir.x * orbit, y: dir.y * orbit, z: dir.z * orbit };
        const v = applyGlobeRot(world);
        const p = project(v, R);
        const alpha = (0.25 + 0.65 * p.depth) * pa;
        drawn.push({ p, v, pt, alpha });
      }

      if (cfg.showLines && state.lineOpacity > 0.05) {
        ctx.lineWidth = 1;
        for (let i = 0; i < drawn.length; i++) {
          const a = drawn[i];
          for (let j = i + 1; j < drawn.length; j++) {
            const b = drawn[j];
            const dx = a.p.x - b.p.x, dy = a.p.y - b.p.y;
            const d2 = dx * dx + dy * dy;
            const maxD = R * 0.35;
            if (d2 < maxD * maxD) {
              if (a.v.z < -0.4 && b.v.z < -0.4) continue;
              const t = 1 - Math.sqrt(d2) / maxD;
              ctx.strokeStyle = accentA(t * 0.18 * Math.min(a.alpha, b.alpha) * state.lineOpacity);
              ctx.beginPath();
              ctx.moveTo(a.p.x, a.p.y);
              ctx.lineTo(b.p.x, b.p.y);
              ctx.stroke();
            }
          }
        }
      }

      for (const d of drawn) {
        const { p, pt, alpha } = d;
        const size = pt.size * (0.7 + 0.6 * p.depth);
        ctx.fillStyle = accentA(alpha * 0.15);
        ctx.beginPath();
        ctx.arc(p.x, p.y, size * 2.6, 0, TAU);
        ctx.fill();
        ctx.fillStyle = accentA(alpha);
        ctx.beginPath();
        ctx.arc(p.x, p.y, size, 0, TAU);
        ctx.fill();
      }
    }

    function drawEvents(R, now) {
      ctx.save();
      ctx.font = '500 11px ui-monospace, "JetBrains Mono", Menlo, monospace';
      ctx.textBaseline = "middle";
      const op = state.labelOpacity;

      for (let i = events.length - 1; i >= 0; i--) {
        const ev = events[i];
        const age = now - ev.t0;
        if (age > ev.life) { events.splice(i, 1); continue; }
        const t = age / ev.life;

        const v = applyGlobeRot(ev.base);
        const p = project(v, R);
        if (v.z < -0.15) continue;

        const angle = ev.tangent;
        const outR = 24 + 60 * easeOut(t);
        const ex = p.x + Math.cos(angle) * outR;
        const ey = p.y + Math.sin(angle) * outR;

        const fade = (t < 0.15 ? t / 0.15 : t > 0.78 ? Math.max(0, 1 - (t - 0.78) / 0.22) : 1) * op;

        const pulse = (Math.sin(age * 0.012) + 1) / 2;
        ctx.fillStyle = accentA(fade * 0.55);
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3 + pulse * 1.5, 0, TAU);
        ctx.fill();
        ctx.strokeStyle = accentA(fade * 0.4 * (1 - t));
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 6 + t * 18, 0, TAU);
        ctx.stroke();

        ctx.strokeStyle = accentA(fade * 0.45);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(ex, ey);
        ctx.stroke();

        const label = `${ev.label}  ·  ${ev.city}`;
        const textW = ctx.measureText(label).width;
        const padX = 8;
        const rightSide = Math.cos(angle) >= 0;
        const lx = rightSide ? ex + 6 : ex - 6 - textW - padX * 2;
        const ly = ey - 11;

        ctx.fillStyle = `rgba(8, 12, 18, ${0.78 * fade})`;
        roundRect(ctx, lx, ly, textW + padX * 2, 22, 11);
        ctx.fill();
        ctx.strokeStyle = accentA(fade * 0.35);
        ctx.lineWidth = 1;
        roundRect(ctx, lx, ly, textW + padX * 2, 22, 11);
        ctx.stroke();

        ctx.fillStyle = accentA(fade);
        ctx.beginPath();
        ctx.arc(lx + 8, ly + 11, 2.4, 0, TAU);
        ctx.fill();

        ctx.fillStyle = `rgba(232, 240, 250, ${0.9 * fade})`;
        ctx.fillText(label, lx + padX + 8, ly + 11);
      }
      ctx.restore();
    }

    function drawFocus(R, now) {
      const base = latLonToVec(state.focusLat, state.focusLon);
      const v = applyGlobeRot(base);
      const p = project(v, R);
      if (v.z < -0.2) return;

      const amt = state.focusAmt;
      const pulse = (Math.sin(now * 0.004) + 1) / 2;

      for (let i = 0; i < 3; i++) {
        const t = ((now * 0.001 + i * 0.33) % 1);
        ctx.strokeStyle = accentA(amt * (1 - t) * 0.55);
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 6 + t * 40, 0, TAU);
        ctx.stroke();
      }

      ctx.fillStyle = accentA(amt * 0.95);
      ctx.beginPath();
      ctx.arc(p.x, p.y, 4 + pulse * 1.5, 0, TAU);
      ctx.fill();

      const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 70);
      grad.addColorStop(0, accentA(amt * 0.4));
      grad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 70, 0, TAU);
      ctx.fill();
    }

    function roundRect(c, x, y, w, h, r) {
      c.beginPath();
      c.moveTo(x + r, y); c.lineTo(x + w - r, y);
      c.quadraticCurveTo(x + w, y, x + w, y + r);
      c.lineTo(x + w, y + h - r);
      c.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      c.lineTo(x + r, y + h);
      c.quadraticCurveTo(x, y + h, x, y + h - r);
      c.lineTo(x, y + r);
      c.quadraticCurveTo(x, y, x + r, y);
      c.closePath();
    }
    function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

    function init() {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        cfg.speed = 0;
        cfg.particles = 0;
        cfg.showLines = false;
        target.spin = 0;
        state.spin = 0;
        target.eventsPerSec = 0;
        state.eventsPerSec = 0;
      }
      resize();
      dots = makeDots(cfg.dots);
      particles = makeParticles(cfg.particles);
      events = [];
      lastT = performance.now();
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(draw);

      document.addEventListener('visibilitychange', function () {
        if (document.hidden) {
          cancelAnimationFrame(raf);
          raf = 0;
        } else {
          lastT = performance.now();
          raf = requestAnimationFrame(draw);
        }
      });
    }

    const onResize = () => resize();
    window.addEventListener("resize", onResize);
    init();

    return {
      setTarget(t) {
        Object.assign(target, t);
      },
      snap(t) {
        Object.assign(state, t);
        Object.assign(target, t);
      },
      set(name, value) {
        cfg[name] = value;
        if (name === "accent") accentRGB = hexToRgb(value);
        if (name === "dots") dots = makeDots(value);
        if (name === "particles") particles = makeParticles(value);
        if (name === "speed") {
          target.spin = value;
          state.spin = value;
        }
      },
      pulse() { spawnEvent(true); },
      destroy() {
        cancelAnimationFrame(raf);
        window.removeEventListener("resize", onResize);
      },
    };
  };
})();
