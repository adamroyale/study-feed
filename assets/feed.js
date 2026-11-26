/* Study Feed – the card feed player.
   Expects window.COURSE_DATA (from the course's cards.js) and SF (store.js).
   URL: feed.html?deck=<lessonId> | <unitId>-mix | missed
*/
(function () {
  var course = window.COURSE_DATA;
  var params = new URLSearchParams(location.search);
  var deckId = params.get("deck") || "";
  var data = SF.load();
  var parentMode = !!data.parentMode;
  var RETRY_GAP = 3;

  /* ---------- resolve the deck ---------- */
  function lessonById(id) {
    for (var u = 0; u < course.units.length; u++) {
      var unit = course.units[u];
      for (var l = 0; l < unit.lessons.length; l++) {
        if (unit.lessons[l].id === id) return { unit: unit, lesson: unit.lessons[l] };
      }
    }
    return null;
  }
  function unitById(id) {
    for (var u = 0; u < course.units.length; u++) if (course.units[u].id === id) return course.units[u];
    return null;
  }
  function allCards() {
    var out = [];
    course.units.forEach(function (unit) {
      unit.lessons.forEach(function (lesson) {
        lesson.cards.forEach(function (c) { out.push(withContext(c, unit, lesson)); });
      });
    });
    return out;
  }
  function withContext(c, unit, lesson) {
    var copy = {};
    for (var k in c) copy[k] = c[k];
    copy.unitId = unit.id;
    copy.lessonId = lesson.id;
    copy.lessonTitle = lesson.title;
    return copy;
  }
  function shuffle(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = arr[i]; arr[i] = arr[j]; arr[j] = t;
    }
    return arr;
  }

  var deck = { id: deckId, title: "", cards: [], kind: "lesson" };
  var mixMatch = /^(u\d+)-mix$/.exec(deckId);
  if (deckId === "missed") {
    var missed = SF.missedIds(data, course.code + "-");
    deck.title = "Ones I've missed";
    deck.kind = "missed";
    deck.cards = allCards().filter(function (c) { return missed.indexOf(c.id) >= 0; });
  } else if (mixMatch) {
    var unit = unitById(mixMatch[1]);
    if (unit) {
      deck.title = "Mixed review · " + unit.short;
      deck.kind = "mix";
      var pool = [];
      unit.lessons.forEach(function (lesson) {
        lesson.cards.forEach(function (c) {
          if (c.type !== "explain") pool.push(withContext(c, unit, lesson));
        });
      });
      deck.cards = shuffle(pool);
    }
  } else {
    var found = lessonById(deckId);
    if (found) {
      deck.title = found.lesson.title;
      deck.cards = found.lesson.cards.map(function (c) { return withContext(c, found.unit, found.lesson); });
    }
  }

  var backHref = "index.html";
  var quizTotal = deck.cards.filter(function (c) { return c.type === "quiz"; }).length;

  /* ---------- session ---------- */
  var session = null;
  if (!parentMode && deck.cards.length) {
    session = {
      id: SF.uid(), course: course.code, deck: deck.id, title: deck.title,
      startedAt: Date.now(), endedAt: null, quizzes: quizTotal, right: 0, wrong: 0, done: false
    };
    data.sessions.push(session);
    if (data.sessions.length > 400) data.sessions = data.sessions.slice(-400);
    SF.save(data);
  }
  var firstAttempt = {}; // card id -> true once answered this session

  /* ---------- DOM ---------- */
  var feed = document.getElementById("feed");
  var topName = document.getElementById("deck-name");
  var counter = document.getElementById("counter");
  var bar = document.getElementById("bar");
  var hint = document.getElementById("swipe-hint");
  var badge = document.getElementById("parent-badge");
  topName.innerHTML = SF.fmt(deck.title || "Deck not found");
  if (parentMode) badge.style.display = "inline-block";

  function cardShell(c, kickerLeft, kickerRight) {
    var sec = document.createElement("section");
    sec.className = "card " + c.type + "-card";
    sec.dataset.id = c.id || "";
    var inner = document.createElement("div");
    inner.className = "card-inner";
    inner.innerHTML = '<div class="kicker"><span class="tag">' + SF.esc(kickerLeft) + "</span><span>" + SF.fmt(kickerRight || "") + "</span></div>";
    sec.appendChild(inner);
    return { sec: sec, inner: inner };
  }

  function renderExplain(c) {
    var s = cardShell(c, "Explainer", c.lessonTitle);
    var html = "<h2>" + SF.fmt(c.title) + "</h2>";
    (c.lines || []).forEach(function (line) { html += "<p>" + SF.fmt(line) + "</p>"; });
    if (c.example) html += '<div class="example"><span class="label">Example</span>' + SF.fmt(c.example) + "</div>";
    s.inner.insertAdjacentHTML("beforeend", html);
    return s.sec;
  }

  function renderTerm(c) {
    var s = cardShell(c, "Key term", c.lessonTitle);
    var html = '<div class="term-big">' + SF.fmt("«" + c.term + "»") + "</div>" +
      '<div class="tap-hint">Tap to reveal</div>' +
      '<div class="term-def">' + SF.fmt(c.def) + (c.note ? '<div class="term-note">' + SF.fmt(c.note) + "</div>" : "") + "</div>";
    s.inner.insertAdjacentHTML("beforeend", html);
    s.inner.addEventListener("click", function () {
      if (s.sec.classList.contains("revealed")) return;
      s.sec.classList.add("revealed");
      if (!parentMode) { SF.recordCard(data, c.id, "seen"); SF.save(data); }
    });
    return s.sec;
  }

  function renderQuiz(c, isRetry) {
    var s = cardShell(c, isRetry ? "Try again" : "Quick check", c.lessonTitle);
    var html = "<h2>" + SF.fmt(c.q) + "</h2>" + '<div class="options"></div>' + '<div class="feedback"></div>';
    s.inner.insertAdjacentHTML("beforeend", html);
    var optsEl = s.inner.querySelector(".options");
    var fb = s.inner.querySelector(".feedback");
    var buttons = [];
    c.options.forEach(function (opt, i) {
      var b = document.createElement("button");
      b.className = "opt";
      b.type = "button";
      b.innerHTML = SF.isHebrew(opt) ? SF.fmt("«" + opt + "»") : SF.fmt(opt);
      b.addEventListener("click", function () { answer(i); });
      optsEl.appendChild(b);
      buttons.push(b);
    });
    function answer(i) {
      var right = i === c.answer;
      buttons.forEach(function (b, j) {
        b.disabled = true;
        if (j === c.answer) b.classList.add("correct");
        else if (j === i) b.classList.add("wrong");
      });
      fb.className = "feedback show " + (right ? "ok" : "bad");
      fb.innerHTML = (right ? "Correct" : "Not quite") + '<span class="why">' + SF.fmt(c.why || "") + "</span>";
      if (!parentMode) {
        SF.recordCard(data, c.id, right ? "right" : "wrong");
        if (session && !isRetry && !firstAttempt[c.id]) {
          firstAttempt[c.id] = true;
          if (right) session.right += 1; else session.wrong += 1;
        }
        SF.save(data);
      }
      if (!right) scheduleRetry(c, s.sec);
      updateCounter();
    }
    return s.sec;
  }

  function renderEnd() {
    var c = { type: "end", id: "" };
    var s = cardShell(c, "Deck complete", "");
    s.sec.id = "end-card";
    s.inner.innerHTML += '<h2 id="end-title"></h2><div class="score-big" id="end-score"></div><p id="end-sub" class="tap-hint"></p>' +
      '<div id="end-actions"></div>';
    return s.sec;
  }

  function renderEmpty(msg) {
    var s = cardShell({ type: "explain" }, "Study Feed", "");
    s.inner.innerHTML += "<h2>" + SF.esc(msg) + "</h2>" + '<a class="btn primary" href="' + backHref + '">Back to decks</a>';
    return s.sec;
  }

  function renderCard(c, isRetry) {
    if (c.type === "explain") return renderExplain(c);
    if (c.type === "term") return renderTerm(c);
    if (c.type === "quiz") return renderQuiz(c, isRetry);
    return renderEmpty("Unknown card");
  }

  /* ---------- build ---------- */
  if (!deck.cards.length) {
    feed.appendChild(renderEmpty(deck.kind === "missed" ? "Nothing missed yet. Nice." : "This deck has no cards."));
    hint.style.display = "none";
  } else {
    deck.cards.forEach(function (c) { feed.appendChild(renderCard(c, false)); });
    feed.appendChild(renderEnd());
  }

  function cardEls() { return Array.prototype.slice.call(feed.querySelectorAll(".card")); }

  function scheduleRetry(c, afterEl) {
    var els = cardEls();
    var idx = els.indexOf(afterEl);
    var endCard = document.getElementById("end-card");
    var target = idx + RETRY_GAP + 1;
    var retryEl = renderQuiz(c, true);
    retryEl.classList.add("retry");
    if (target < els.length && els[target] !== endCard) feed.insertBefore(retryEl, els[target]);
    else feed.insertBefore(retryEl, endCard);
    observe(retryEl);
  }

  /* ---------- position tracking ---------- */
  var currentIdx = 0;
  var endShown = false;
  function updateCounter() {
    var els = cardEls();
    var total = els.length - 1; // minus end card
    var shown = Math.min(currentIdx + 1, total);
    counter.textContent = total > 0 ? shown + " / " + total : "";
    bar.style.width = total > 0 ? Math.round((shown / total) * 100) + "%" : "0%";
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting || en.intersectionRatio < 0.6) return;
      var els = cardEls();
      currentIdx = els.indexOf(en.target);
      if (navTarget === currentIdx) navTarget = null;
      if (currentIdx > 0) hint.style.display = "none";
      if (en.target.id === "end-card") finish();
      updateCounter();
    });
  }, { root: feed, threshold: [0.6] });
  function observe(el) { io.observe(el); }
  cardEls().forEach(observe);
  updateCounter();

  function finish() {
    if (endShown) return;
    endShown = true;
    var pct = quizTotal ? Math.round(((session ? session.right : 0) / quizTotal) * 100) : null;
    document.getElementById("end-title").innerHTML = SF.fmt(deck.title);
    var scoreEl = document.getElementById("end-score");
    var sub = document.getElementById("end-sub");
    if (parentMode) {
      scoreEl.textContent = "Parent mode";
      sub.textContent = "Nothing was recorded.";
    } else if (quizTotal) {
      scoreEl.textContent = pct + "%";
      sub.textContent = session.right + " of " + quizTotal + " quick checks right on the first try.";
    } else {
      scoreEl.textContent = "Done";
      sub.textContent = "No quick checks in this deck.";
    }
    if (session) { session.done = true; session.endedAt = Date.now(); SF.save(data); }
    var actions = document.getElementById("end-actions");
    var stillMissed = SF.missedIds(data, course.code + "-").length;
    var html = "";
    if (stillMissed && deck.kind !== "missed") html += '<a class="btn primary" href="feed.html?deck=missed">Replay ones I\'ve missed (' + stillMissed + ")</a>";
    if (stillMissed && deck.kind === "missed") html += '<a class="btn primary" href="feed.html?deck=missed">Go again (' + stillMissed + " left)</a>";
    html += '<a class="btn" href="feed.html?deck=' + encodeURIComponent(deck.id) + '">Do this deck again</a>';
    html += '<a class="btn" href="' + backHref + '">Back to decks</a>';
    actions.innerHTML = html;
  }

  /* keyboard for laptops */
  document.addEventListener("keydown", function (e) {
    if (e.key === "ArrowDown" || e.key === " " || e.key === "PageDown") { e.preventDefault(); step(1); }
    if (e.key === "ArrowUp" || e.key === "PageUp") { e.preventDefault(); step(-1); }
  });
  var navTarget = null;
  function step(d) {
    var els = cardEls();
    var from = navTarget === null ? currentIdx : navTarget;
    var next = Math.max(0, Math.min(els.length - 1, from + d));
    navTarget = next;
    els[next].scrollIntoView({ behavior: "smooth", block: "start" });
  }

  document.getElementById("theme-btn").addEventListener("click", SF.toggleTheme);
})();
