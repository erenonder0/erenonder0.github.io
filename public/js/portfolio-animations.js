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

  /* ----------------------------------------------------------------------
     10. Scroll progress bar (injects its own element)
     ---------------------------------------------------------------------- */
  function initScrollProgress() {
    var bar = document.createElement("div");
    bar.className = "scroll-progress";
    bar.setAttribute("aria-hidden", "true");
    document.body.appendChild(bar);
    var ticking = false;
    function update() {
      var doc = document.documentElement;
      var max = doc.scrollHeight - window.innerHeight;
      var pct = max > 0 ? window.scrollY / max : 0;
      bar.style.transform = "scaleX(" + Math.min(1, Math.max(0, pct)) + ")";
      ticking = false;
    }
    window.addEventListener("scroll", function () {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();
  }

  /* ----------------------------------------------------------------------
     11. Card tilt + cursor glow (all grid/standalone cards site-wide)
     ---------------------------------------------------------------------- */
  function initTilt() {
    if (prefersReduced || !window.matchMedia("(hover: hover)").matches) return;
    var cards = document.querySelectorAll(
      ".cert-card, .project-card, .blog-card, .volunteer-card, " +
      ".skill-card, .education, .ct-card"
    );
    cards.forEach(function (card) {
      card.classList.add("tilt-card");
      var glow = document.createElement("span");
      glow.className = "tilt-glow";
      card.appendChild(glow);
      var raf = null;
      card.addEventListener("mousemove", function (ev) {
        if (raf) return;
        raf = requestAnimationFrame(function () {
          var r = card.getBoundingClientRect();
          var px = (ev.clientX - r.left) / r.width;
          var py = (ev.clientY - r.top) / r.height;
          card.style.setProperty("--mx", px * 100 + "%");
          card.style.setProperty("--my", py * 100 + "%");
          var rx = (0.5 - py) * 6; /* max 3deg each way */
          var ry = (px - 0.5) * 6;
          card.style.transform =
            "perspective(800px) rotateX(" + rx + "deg) rotateY(" + ry + "deg) translateY(-4px)";
          raf = null;
        });
      });
      card.addEventListener("mouseleave", function () {
        card.style.transform = "";
      });
    });
  }

  /* ----------------------------------------------------------------------
     12. Terminal easter egg (>_ trigger button, ` shortcut)
     ---------------------------------------------------------------------- */
  function initTerminal() {
    var dataEl = document.getElementById("terminal-data");
    if (!dataEl) return;
    var data;
    try { data = JSON.parse(dataEl.textContent); } catch (e) { return; }
    var s = data.strings;
    var promptStr = data.promptUser + "@" + data.promptHost + ":~$";

    var trigger = document.createElement("button");
    trigger.type = "button";
    trigger.className = "terminal-trigger";
    trigger.setAttribute("aria-label", s.triggerLabel);
    trigger.title = s.triggerLabel;
    trigger.textContent = ">_";
    document.body.appendChild(trigger);

    var overlay = document.createElement("div");
    overlay.className = "terminal-overlay";
    overlay.setAttribute("aria-hidden", "true");

    var win = document.createElement("div");
    win.className = "terminal-window";
    win.setAttribute("role", "dialog");
    win.setAttribute("aria-modal", "true");
    win.setAttribute("aria-label", s.triggerLabel);

    var titlebar = document.createElement("div");
    titlebar.className = "terminal-titlebar";
    ["red", "yellow", "green"].forEach(function (c) {
      var dot = document.createElement("span");
      dot.className = "terminal-dot terminal-dot--" + c;
      titlebar.appendChild(dot);
    });
    var titleLabel = document.createElement("span");
    titleLabel.className = "terminal-titlebar__label";
    titleLabel.textContent = data.promptUser + "@" + data.promptHost + ": ~";
    titlebar.appendChild(titleLabel);
    var closeBtn = document.createElement("button");
    closeBtn.type = "button";
    closeBtn.className = "terminal-close";
    closeBtn.setAttribute("aria-label", s.closeLabel);
    closeBtn.textContent = "×";
    titlebar.appendChild(closeBtn);

    var output = document.createElement("div");
    output.className = "terminal-output";

    var inputRow = document.createElement("div");
    inputRow.className = "terminal-input-row";
    var promptSpan = document.createElement("span");
    promptSpan.className = "terminal-prompt";
    promptSpan.textContent = promptStr;
    var input = document.createElement("input");
    input.type = "text";
    input.className = "terminal-input";
    input.autocomplete = "off";
    input.setAttribute("autocapitalize", "off");
    input.setAttribute("spellcheck", "false");
    input.placeholder = s.placeholder;
    inputRow.appendChild(promptSpan);
    inputRow.appendChild(input);

    /* Snake game view — swapped in over output+input while playing */
    var snakeCols = 18, snakeRows = 14, snakeCell = 16;
    var snakeWrap = document.createElement("div");
    snakeWrap.className = "terminal-snake";
    var snakeScoreEl = document.createElement("div");
    snakeScoreEl.className = "terminal-snake__score";
    var snakeCanvas = document.createElement("canvas");
    snakeCanvas.className = "terminal-snake__canvas";
    snakeCanvas.width = snakeCols * snakeCell;
    snakeCanvas.height = snakeRows * snakeCell;
    var snakeHint = document.createElement("div");
    snakeHint.className = "terminal-snake__hint";
    snakeHint.textContent = s.snakeHint;
    snakeWrap.appendChild(snakeScoreEl);
    snakeWrap.appendChild(snakeCanvas);
    snakeWrap.appendChild(snakeHint);
    var snakeCtx = snakeCanvas.getContext("2d");

    win.appendChild(titlebar);
    win.appendChild(output);
    win.appendChild(inputRow);
    win.appendChild(snakeWrap);
    overlay.appendChild(win);
    document.body.appendChild(overlay);

    function printLine(text, cls) {
      var line = document.createElement("div");
      line.className = "terminal-line" + (cls ? " " + cls : "");
      line.textContent = text;
      output.appendChild(line);
    }
    function printLines(lines, cls) {
      (lines || []).forEach(function (l) { printLine(l, cls); });
    }
    function printLinkLine(label, href) {
      var line = document.createElement("div");
      line.className = "terminal-line terminal-line--link";
      var a = document.createElement("a");
      a.href = href;
      if (href.indexOf("mailto:") !== 0) {
        a.target = "_blank";
        a.rel = "noopener";
      }
      a.textContent = label;
      line.appendChild(a);
      output.appendChild(line);
    }

    var history = [];
    var historyIndex = -1;
    var welcomeShown = false;

    /* ---- Snake game state ---- */
    var snakeActive = false;
    var snakeInterval = null;
    var snakeSpeedMs = 130;
    var snakeBody, snakeDir, snakeNextDir, snakeFood, snakeScore, snakeBest;

    function snakeLoadBest() {
      try { return parseInt(localStorage.getItem("terminal_snake_best"), 10) || 0; }
      catch (e) { return 0; }
    }
    function snakeSaveBest(v) {
      try { localStorage.setItem("terminal_snake_best", String(v)); } catch (e) { /* storage unavailable */ }
    }
    function snakeUpdateScoreLine() {
      snakeScoreEl.textContent =
        s.snakeScoreLabel + ": " + snakeScore + "    " +
        s.snakeBestLabel + ": " + Math.max(snakeScore, snakeBest);
    }
    function snakeRandomFood() {
      var cell;
      do {
        cell = { x: Math.floor(Math.random() * snakeCols), y: Math.floor(Math.random() * snakeRows) };
      } while (snakeBody.some(function (seg) { return seg.x === cell.x && seg.y === cell.y; }));
      return cell;
    }
    function setSnakeDirection(dir) {
      var opposite = { up: "down", down: "up", left: "right", right: "left" };
      if (opposite[dir] === snakeDir) return; /* no instant 180 turn */
      snakeNextDir = dir;
    }
    function snakeDraw() {
      var w = snakeCanvas.width, h = snakeCanvas.height;
      snakeCtx.fillStyle = "#0d1117";
      snakeCtx.fillRect(0, 0, w, h);
      snakeCtx.strokeStyle = "rgba(0,212,255,0.07)";
      snakeCtx.lineWidth = 1;
      for (var gx = 0; gx <= snakeCols; gx++) {
        snakeCtx.beginPath(); snakeCtx.moveTo(gx * snakeCell + .5, 0); snakeCtx.lineTo(gx * snakeCell + .5, h); snakeCtx.stroke();
      }
      for (var gy = 0; gy <= snakeRows; gy++) {
        snakeCtx.beginPath(); snakeCtx.moveTo(0, gy * snakeCell + .5); snakeCtx.lineTo(w, gy * snakeCell + .5); snakeCtx.stroke();
      }
      snakeCtx.fillStyle = "#00d4ff";
      snakeCtx.shadowColor = "#00d4ff"; snakeCtx.shadowBlur = 8;
      snakeCtx.fillRect(snakeFood.x * snakeCell + 2, snakeFood.y * snakeCell + 2, snakeCell - 4, snakeCell - 4);
      snakeCtx.shadowBlur = 0;
      snakeBody.forEach(function (seg, i) {
        snakeCtx.fillStyle = i === 0 ? "#39ff14" : "rgba(57,255,20,0.75)";
        snakeCtx.fillRect(seg.x * snakeCell + 1, seg.y * snakeCell + 1, snakeCell - 2, snakeCell - 2);
      });
    }
    function snakeTick() {
      snakeDir = snakeNextDir;
      var head = snakeBody[0];
      var next = { x: head.x, y: head.y };
      if (snakeDir === "up") next.y--;
      else if (snakeDir === "down") next.y++;
      else if (snakeDir === "left") next.x--;
      else next.x++;

      var hitWall = next.x < 0 || next.x >= snakeCols || next.y < 0 || next.y >= snakeRows;
      /* exclude the tail cell — it moves away this tick unless food is eaten */
      var body = snakeBody.slice(0, -1);
      var hitSelf = body.some(function (seg) { return seg.x === next.x && seg.y === next.y; });
      if (hitWall || hitSelf) { stopSnake(false); return; }

      snakeBody.unshift(next);
      if (next.x === snakeFood.x && next.y === snakeFood.y) {
        snakeScore++;
        snakeFood = snakeRandomFood();
      } else {
        snakeBody.pop();
      }
      snakeDraw();
      snakeUpdateScoreLine();
    }
    function startSnake() {
      snakeActive = true;
      win.classList.add("is-snake-mode");
      input.blur();
      snakeBody = [{ x: 8, y: 7 }, { x: 7, y: 7 }, { x: 6, y: 7 }];
      snakeDir = "right"; snakeNextDir = "right";
      snakeScore = 0; snakeBest = snakeLoadBest();
      snakeFood = snakeRandomFood();
      snakeUpdateScoreLine();
      snakeDraw();
      if (snakeInterval) clearInterval(snakeInterval);
      snakeInterval = setInterval(snakeTick, snakeSpeedMs);
    }
    function stopSnake(manual) {
      if (snakeInterval) { clearInterval(snakeInterval); snakeInterval = null; }
      snakeActive = false;
      win.classList.remove("is-snake-mode");
      if (snakeScore > snakeBest) { snakeBest = snakeScore; snakeSaveBest(snakeBest); }
      if (manual) {
        printLine(s.snakeQuit, "terminal-line--muted");
      } else {
        printLine(
          s.snakeGameOverPrefix + " " + s.snakeScoreLabel + ": " + snakeScore +
          "    " + s.snakeBestLabel + ": " + snakeBest,
          "terminal-line--error"
        );
      }
      output.scrollTop = output.scrollHeight;
      setTimeout(function () { input.focus(); }, 30);
    }

    function scrollToSection(id) {
      var target = document.getElementById(id);
      if (target) {
        target.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth", block: "start" });
      } else {
        window.location.href = data.homeUrl + "#" + id;
      }
    }

    var commands = {
      help: function () { printLines(s.help); },
      whoami: function () {
        printLine(data.name, "terminal-line--accent");
        printLine(data.role);
        printLine(data.bio, "terminal-line--muted");
        scrollToSection("showcase");
      },
      skills: function () {
        printLine(s.skillsRedirect, "terminal-line--accent");
        scrollToSection("skills");
      },
      experience: function () {
        printLine(s.experienceRedirect, "terminal-line--accent");
        scrollToSection("experience-list-shortcode");
      },
      certifications: function () {
        printLine(s.certificationsRedirect, "terminal-line--accent");
        scrollToSection("certifications");
      },
      contact: function () {
        printLinkLine(data.email, "mailto:" + data.email);
        Object.keys(data.social).forEach(function (key) {
          printLinkLine(data.social[key], data.social[key]);
        });
      },
      cv: function () { printLinkLine(s.cvLabel, data.cvUrl); },
      clear: function () { output.textContent = ""; },
      exit: function () { closeTerminal(true); },
      snake: function () { startSnake(); }
    };
    commands.certs = commands.certifications;
    commands["sudo hire-me"] = function () {
      printLines(s.hireMe, "terminal-line--accent");
      printLinkLine(data.email, "mailto:" + data.email);
    };

    function printPromptEcho(cmd) {
      printLine(promptStr + " " + cmd, "terminal-line--echo");
    }

    function runCommand(raw) {
      var cmd = raw.trim();
      if (!cmd) return;
      printPromptEcho(cmd);
      history.push(cmd);
      historyIndex = history.length;
      var key = cmd.toLowerCase();
      var handler = commands[key];
      if (handler) {
        handler();
      } else {
        printLine(s.notFound.replace("%s", cmd), "terminal-line--error");
      }
      output.scrollTop = output.scrollHeight;
    }

    function openTerminal() {
      overlay.classList.add("is-open");
      overlay.setAttribute("aria-hidden", "false");
      if (!welcomeShown) { printLines(s.welcome, "terminal-line--muted"); printLine(""); welcomeShown = true; }
      setTimeout(function () { input.focus(); }, 60);
    }
    function closeTerminal(returnFocus) {
      overlay.classList.remove("is-open");
      overlay.setAttribute("aria-hidden", "true");
      if (returnFocus) trigger.focus();
    }

    trigger.addEventListener("click", function () {
      if (overlay.classList.contains("is-open")) closeTerminal(true);
      else openTerminal();
    });
    closeBtn.addEventListener("click", function () { closeTerminal(true); });
    /* chat-widget style: click anywhere outside the popup closes it (no focus steal) */
    document.addEventListener("click", function (ev) {
      if (!overlay.classList.contains("is-open")) return;
      if (overlay.contains(ev.target) || trigger.contains(ev.target)) return;
      closeTerminal();
    });

    input.addEventListener("keydown", function (ev) {
      if (ev.key === "Enter") {
        runCommand(input.value);
        input.value = "";
      } else if (ev.key === "Escape") {
        closeTerminal(true);
      } else if (ev.key === "ArrowUp" && history.length) {
        historyIndex = Math.max(0, historyIndex - 1);
        input.value = history[historyIndex] || "";
        ev.preventDefault();
      } else if (ev.key === "ArrowDown" && history.length) {
        historyIndex = Math.min(history.length, historyIndex + 1);
        input.value = history[historyIndex] || "";
        ev.preventDefault();
      }
    });

    var snakeKeyMap = {
      ArrowUp: "up", ArrowDown: "down", ArrowLeft: "left", ArrowRight: "right",
      w: "up", s: "down", a: "left", d: "right",
      W: "up", S: "down", A: "left", D: "right"
    };
    document.addEventListener("keydown", function (ev) {
      if (snakeActive) {
        if (ev.key === "Escape") { stopSnake(true); return; }
        var dir = snakeKeyMap[ev.key];
        if (dir) { ev.preventDefault(); setSnakeDirection(dir); }
        return;
      }
      var isOpen = overlay.classList.contains("is-open");
      if (ev.key === "`" && !isOpen) {
        var tag = (ev.target && ev.target.tagName) || "";
        if (tag === "INPUT" || tag === "TEXTAREA") return;
        ev.preventDefault();
        openTerminal();
      } else if (ev.key === "Escape" && isOpen) {
        closeTerminal(true);
      }
    });
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
    initScrollProgress();
    initTilt();
    initTerminal();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
