/* ============================================================================
   portfolio-animations.js — vanilla JS, no dependencies
   Handles: reveal-on-scroll, header frosting, timeline scroll-fill,
   skills dot fill, hero typewriter, active-nav detection, timeline filters,
   card expand/collapse, hero particle canvas.
   ========================================================================== */
(function () {
  "use strict";

  var prefersReduced =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ----------------------------------------------------------------------
     1. Reveal on scroll
     ---------------------------------------------------------------------- */
  function initReveal() {
    var els = document.querySelectorAll(".reveal");
    if (!els.length) return;
    if (!("IntersectionObserver" in window) || prefersReduced) {
      els.forEach(function (el) { el.classList.add("visible"); });
      return;
    }
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    els.forEach(function (el) { io.observe(el); });
  }

  /* ----------------------------------------------------------------------
     2. Header frosting on scroll
     ---------------------------------------------------------------------- */
  function initHeader() {
    var header = document.getElementById("header");
    if (!header) return;
    function onScroll() {
      if (window.scrollY > 40) header.classList.add("scrolled");
      else header.classList.remove("scrolled");
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ----------------------------------------------------------------------
     3a. Timeline items reveal (without this they stay opacity:0)
     ---------------------------------------------------------------------- */
  function initTimelineItems() {
    var items = document.querySelectorAll(".cyber-timeline .ct-item");
    if (!items.length) return;
    if (!("IntersectionObserver" in window) || prefersReduced) {
      items.forEach(function (it) { it.classList.add("visible"); });
      return;
    }
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );
    items.forEach(function (it) { io.observe(it); });
  }

  /* ----------------------------------------------------------------------
     3. Timeline scroll-fill progress
     ---------------------------------------------------------------------- */
  function initTimelineProgress() {
    var tl = document.querySelector(".cyber-timeline");
    var prog = document.querySelector(".cyber-timeline__progress");
    if (!tl || !prog) return;
    function update() {
      var rect = tl.getBoundingClientRect();
      var vh = window.innerHeight;
      var total = rect.height;
      var scrolled = vh * 0.5 - rect.top;
      var pct = Math.max(0, Math.min(1, scrolled / total));
      prog.style.height = pct * 100 + "%";
    }
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
  }

  /* ----------------------------------------------------------------------
     4. Skills dot fill animation
     ---------------------------------------------------------------------- */
  function initSkills() {
    var cards = document.querySelectorAll(".skill-card");
    if (!cards.length) return;
    function reveal(card) {
      card.classList.add("visible");
      var dots = card.querySelectorAll(".skill-dot");
      dots.forEach(function (d, i) {
        d.style.transitionDelay = i * 70 + "ms";
      });
    }
    if (!("IntersectionObserver" in window) || prefersReduced) {
      cards.forEach(reveal);
      return;
    }
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            reveal(e.target);
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.3 }
    );
    cards.forEach(function (c) { io.observe(c); });
  }

  /* ----------------------------------------------------------------------
     5. Hero typewriter
     ---------------------------------------------------------------------- */
  function initTypewriter() {
    var el = document.querySelector("[data-typewriter]");
    if (!el) return;
    var words = (el.getAttribute("data-words") || "")
      .split("|")
      .map(function (w) { return w.trim(); })
      .filter(Boolean);
    if (!words.length) return;

    var textNode = document.createElement("span");
    var cursor = document.createElement("span");
    cursor.className = "tw-cursor";
    cursor.textContent = ".";
    el.textContent = "";
    el.appendChild(textNode);
    el.appendChild(cursor);

    if (prefersReduced) { textNode.textContent = words[0]; return; }

    var wi = 0, ci = 0, deleting = false;
    function tick() {
      var word = words[wi];
      if (!deleting) {
        ci++;
        textNode.textContent = word.slice(0, ci);
        if (ci === word.length) {
          deleting = true;
          return setTimeout(tick, 1500);
        }
        return setTimeout(tick, 90);
      } else {
        ci--;
        textNode.textContent = word.slice(0, ci);
        if (ci === 0) {
          deleting = false;
          wi = (wi + 1) % words.length;
          return setTimeout(tick, 350);
        }
        return setTimeout(tick, 45);
      }
    }
    tick();
  }

  /* ----------------------------------------------------------------------
     6. Active nav section detection
     ---------------------------------------------------------------------- */
  function initActiveNav() {
    var links = Array.prototype.slice.call(
      document.querySelectorAll(".header .nav-link")
    );
    var map = {};
    var sections = [];
    links.forEach(function (a) {
      var href = a.getAttribute("href") || "";
      var hashIndex = href.indexOf("#");
      if (hashIndex === -1) return;
      var id = href.slice(hashIndex + 1);
      if (!id) return;
      var sec = document.getElementById(id);
      if (sec) { map[id] = a; sections.push(sec); }
    });
    if (!sections.length || !("IntersectionObserver" in window)) return;

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            links.forEach(function (l) { l.classList.remove("nav-active"); });
            var active = map[e.target.id];
            if (active) active.classList.add("nav-active");
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach(function (s) { io.observe(s); });
  }

  /* ----------------------------------------------------------------------
     7. Timeline filter buttons
     ---------------------------------------------------------------------- */
  function initFilters() {
    var bar = document.querySelector(".cyber-activity__filters");
    if (!bar) return;
    var buttons = bar.querySelectorAll(".cyber-filter");
    var items = document.querySelectorAll(".cyber-timeline .ct-item");
    bar.addEventListener("click", function (ev) {
      var btn = ev.target.closest(".cyber-filter");
      if (!btn) return;
      buttons.forEach(function (b) { b.classList.remove("active"); });
      btn.classList.add("active");
      var f = btn.getAttribute("data-filter");
      items.forEach(function (it) {
        var group = it.getAttribute("data-group") || "";
        if (f === "all" || group === f) it.classList.remove("hide");
        else it.classList.add("hide");
      });
      var prog = document.querySelector(".cyber-timeline__progress");
      if (prog) prog.style.height = "0%";
      window.dispatchEvent(new Event("scroll"));
    });
  }

  /* ----------------------------------------------------------------------
     8. Card expand / collapse
     ---------------------------------------------------------------------- */
  function initExpanders() {
    /* activity timeline cards */
    document.querySelectorAll(".cyber-timeline .ct-card").forEach(function (card) {
      card.addEventListener("click", function () {
        card.closest(".ct-item").classList.toggle("open");
      });
    });
    /* generic expand toggles (volunteer) */
    document.querySelectorAll(".expand-toggle").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var target = document.getElementById(btn.getAttribute("aria-controls"));
        if (!target) return;
        var open = target.classList.toggle("open");
        btn.setAttribute("aria-expanded", open ? "true" : "false");
        var label = btn.querySelector(".expand-label");
        if (label) {
          label.textContent = open
            ? btn.getAttribute("data-less") || "Show less"
            : btn.getAttribute("data-more") || "Show more";
        }
      });
    });
    /* experience cards: toggle .is-expanded on the card (multiple can stay open) */
    document.querySelectorAll(".exp-card__toggle").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var card = btn.closest(".exp-card");
        if (!card) return;
        var expanded = card.classList.toggle("is-expanded");
        btn.setAttribute("aria-expanded", expanded ? "true" : "false");
        var label = btn.querySelector(".exp-toggle-label");
        if (label) {
          label.textContent = expanded
            ? btn.getAttribute("data-less") || "Show less"
            : btn.getAttribute("data-more") || "Show more";
        }
        var chev = btn.querySelector(".exp-toggle-chev");
        if (chev) chev.textContent = expanded ? "▴" : "▾";
      });
    });
  }

  /* ----------------------------------------------------------------------
     9. Hero particle canvas
     ---------------------------------------------------------------------- */
  function initParticles() {
    var canvas = document.querySelector(".cyber-hero__canvas");
    if (!canvas || prefersReduced) return;
    var ctx = canvas.getContext("2d");
    var dots = [];
    var w, h, dpr;

    function size() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function build() {
      var count = Math.min(70, Math.floor((w * h) / 16000));
      dots = [];
      for (var i = 0; i < count; i++) {
        dots.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          r: Math.random() * 1.8 + 0.6,
        });
      }
    }

    function frame() {
      ctx.clearRect(0, 0, w, h);
      for (var i = 0; i < dots.length; i++) {
        var d = dots[i];
        d.x += d.vx; d.y += d.vy;
        if (d.x < 0 || d.x > w) d.vx *= -1;
        if (d.y < 0 || d.y > h) d.vy *= -1;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0,212,255,0.55)";
        ctx.fill();
        for (var j = i + 1; j < dots.length; j++) {
          var o = dots[j];
          var dx = d.x - o.x, dy = d.y - o.y;
          var dist = dx * dx + dy * dy;
          if (dist < 14000) {
            ctx.beginPath();
            ctx.moveTo(d.x, d.y);
            ctx.lineTo(o.x, o.y);
            ctx.strokeStyle = "rgba(57,255,20," + (0.12 * (1 - dist / 14000)) + ")";
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(frame);
    }

    var raf;
    size(); build(); frame();
    window.addEventListener("resize", function () { size(); build(); });
  }

  /* ---------------------------------------------------------------------- */
  function boot() {
    initReveal();
    initHeader();
    initTimelineItems();
    initTimelineProgress();
    initSkills();
    initTypewriter();
    initActiveNav();
    initFilters();
    initExpanders();
    initParticles();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
