// Scroll controller — maps page scroll position to globe state presets.

(function () {
  const PRESETS = {
    hero: {
      offsetX: 0, offsetY: 0.06, scale: 1.0, spin: 0.00045,
      ringOpacity: 0.9, labelOpacity: 1, lineOpacity: 1, particleAlpha: 1,
      focusAmt: 0, focusLat: -26.2041, focusLon: 28.0473,
      eventsPerSec: 0.55,
    },
    problem: {
      offsetX: 0.26, offsetY: 0, scale: 0.62, spin: 0.0009,
      ringOpacity: 0.4, labelOpacity: 0.7, lineOpacity: 1.2, particleAlpha: 1.1,
      focusAmt: 0, focusLat: -26.2041, focusLon: 28.0473,
      eventsPerSec: 0.85,
    },
    services: {
      offsetX: 0.28, offsetY: 0, scale: 0.6, spin: 0.0004,
      ringOpacity: 0.7, labelOpacity: 0.85, lineOpacity: 0.9, particleAlpha: 0.85,
      focusAmt: 0, focusLat: 0, focusLon: 0,
      eventsPerSec: 0.45,
    },
    process: {
      offsetX: 0, offsetY: 0.04, scale: 0.4, spin: 0.0007,
      ringOpacity: 1, labelOpacity: 0.4, lineOpacity: 0.8, particleAlpha: 0.75,
      focusAmt: 0, focusLat: 0, focusLon: 0,
      eventsPerSec: 0.3,
    },
    work: {
      offsetX: -0.28, offsetY: 0, scale: 0.55, spin: 0.0006,
      ringOpacity: 0.7, labelOpacity: 0.95, lineOpacity: 1, particleAlpha: 0.9,
      focusAmt: 0, focusLat: 0, focusLon: 0,
      eventsPerSec: 0.7,
    },
    contact: {
      offsetX: 0.22, offsetY: -0.04, scale: 1.1, spin: 0.0001,
      ringOpacity: 1, labelOpacity: 0.5, lineOpacity: 0.6, particleAlpha: 0.7,
      focusAmt: 1, focusLat: -26.2041, focusLon: 28.0473,
      eventsPerSec: 0.4,
    },
  };

  const SECTION_IDS = ["hero", "problem", "services", "process", "work", "contact"];

  let mouseOffsetX = 0;
  let mouseOffsetY = 0;

  window.addEventListener('mousemove', function (e) {
    mouseOffsetX = ((e.clientX / window.innerWidth)  - 0.5) * 0.06;
    mouseOffsetY = ((e.clientY / window.innerHeight) - 0.5) * 0.06;
  }, { passive: true });

  function lerp(a, b, t) { return a + (b - a) * t; }
  function lerpPreset(a, b, t) {
    const out = {};
    for (const k of Object.keys(a)) out[k] = lerp(a[k], b[k] ?? a[k], t);
    return out;
  }
  function smoothstep(t) { return t * t * (3 - 2 * t); }

  function init() {
    const canvas = document.getElementById("globe");
    if (!canvas) return;

    const globe = window.OpraGlobe(canvas, {
      accent: "#7CE3FF",
      dots: 1400,
      particles: 90,
      radiusPct: 0.34,
    });
    window.__opraGlobe = globe;
    window.__opraPresets = PRESETS;
    globe.snap(PRESETS.hero);

    const sections = SECTION_IDS
      .map((id) => ({ id, el: document.getElementById(id) }))
      .filter((s) => s.el);

    function getCenter(el) {
      const r = el.getBoundingClientRect();
      return r.top + r.height / 2;
    }

    function onScroll() {
      const vpCenter = window.innerHeight / 2;
      const centers = sections.map((s) => ({ id: s.id, c: getCenter(s.el) }));

      let prev = centers[0];
      let next = centers[centers.length - 1];

      for (let i = 0; i < centers.length - 1; i++) {
        if (centers[i].c <= vpCenter && centers[i + 1].c >= vpCenter) {
          prev = centers[i];
          next = centers[i + 1];
          break;
        }
        if (centers[i + 1].c < vpCenter) {
          prev = centers[i + 1];
          next = centers[i + 1];
        }
        if (centers[i].c > vpCenter) {
          prev = centers[i];
          next = centers[i];
          break;
        }
      }

      let t;
      if (prev.id === next.id) {
        t = 0;
      } else {
        t = (vpCenter - prev.c) / (next.c - prev.c);
        t = Math.max(0, Math.min(1, t));
        t = smoothstep(t);
      }

      const blended = lerpPreset(PRESETS[prev.id], PRESETS[next.id], t);
      globe.setTarget(Object.assign({}, blended, {
        offsetX: (blended.offsetX || 0) + mouseOffsetX,
        offsetY: (blended.offsetY || 0) + mouseOffsetY,
      }));

      let bestId = prev.id;
      let bestDist = Math.abs(prev.c - vpCenter);
      for (const c of centers) {
        const d = Math.abs(c.c - vpCenter);
        if (d < bestDist) { bestDist = d; bestId = c.id; }
      }
      document.querySelectorAll("#rail a").forEach((a) => {
        a.classList.toggle("is-active", a.getAttribute("data-section") === bestId);
      });
    }

    let raf = null;
    function schedule() {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = null;
        onScroll();
      });
    }

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    schedule();

    const serviceCities = {
      websites:   { lat: -26.2041, lon: 28.0473 },
      platforms:  { lat: 51.5072,  lon: -0.1276 },
      automation: { lat: 1.3521,   lon: 103.8198 },
      ai:         { lat: 37.7749,  lon: -122.4194 },
    };
    let activeSvc = null;
    document.querySelectorAll(".service-card").forEach((card) => {
      card.addEventListener("mouseenter", () => {
        const k = card.getAttribute("data-svc");
        const city = serviceCities[k];
        if (!city) return;
        activeSvc = k;
        document.querySelectorAll(".service-card").forEach((c) => c.classList.toggle("is-active", c === card));
        globe.setTarget({
          focusLat: city.lat,
          focusLon: city.lon,
          focusAmt: 0.85,
        });
      });
      card.addEventListener("mouseleave", () => {
        if (activeSvc === card.getAttribute("data-svc")) {
          activeSvc = null;
          document.querySelectorAll(".service-card").forEach((c) => c.classList.remove("is-active"));
          schedule();
        }
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
