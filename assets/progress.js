/* Study Feed – parent progress view. Loads every course's cards.js to name topics. */
(function () {
  var data = SF.load();
  var courses = window.COURSES || [];
  var loaded = {};
  var pending = courses.length;

  document.getElementById("theme-btn").addEventListener("click", SF.toggleTheme);

  var pm = document.getElementById("parent-mode");
  pm.checked = !!data.parentMode;
  pm.addEventListener("change", function () {
    data.parentMode = pm.checked;
    SF.save(data);
  });

  (function syncStatus() {
    var st = document.getElementById("sync-status"), meta = document.getElementById("sync-meta"), btn = document.getElementById("sync-now");
    if (!window.SFSync) return;
    document.getElementById("device-id").textContent = SFSync.deviceId();
    function refresh() {
      var q = SFSync.queued();
      if (!SFSync.enabled()) {
        st.textContent = "Not set up";
        meta.textContent = "Progress stays on this device. See SHEET-SETUP.md in the repo to connect a Google Sheet." + (q ? " " + q + " events are waiting." : "");
      } else {
        var err = SFSync.lastError();
        st.textContent = err ? "Connected, but the last send failed" : "Connected";
        meta.textContent = (q ? q + " events waiting to send." : "All events sent.") + (err ? " Last error: " + err + ". Check the web app is deployed with access set to Anyone." : "");
        btn.style.display = q ? "block" : "none";
      }
    }
    btn.addEventListener("click", function () { SFSync.flush(); setTimeout(refresh, 2500); });
    refresh();
    setTimeout(refresh, 3000);
  })();

  document.getElementById("reset").addEventListener("click", function () {
    if (confirm("Erase all sessions and card history saved in this browser? This cannot be undone.")) {
      SF.reset();
      location.reload();
    }
  });

  if (!pending) { render(); return; }
  courses.forEach(function (c) {
    var s = document.createElement("script");
    s.src = c.path + "cards.js";
    s.onload = function () { loaded[c.code] = window.COURSE_DATA; if (--pending === 0) render(); };
    s.onerror = function () { if (--pending === 0) render(); };
    document.head.appendChild(s);
  });

  function lessonMap() {
    var map = {}; // lessonId -> {title, course, unit}
    for (var code in loaded) {
      var cd = loaded[code];
      cd.units.forEach(function (u) {
        u.lessons.forEach(function (l) {
          map[code + "-" + l.id] = { title: l.title, course: cd.title, unit: u.short, lessonId: l.id, coursePath: pathFor(code) };
        });
      });
    }
    return map;
  }
  function pathFor(code) {
    for (var i = 0; i < courses.length; i++) if (courses[i].code === code) return courses[i].path;
    return "";
  }
  function deckTitle(code, deck) {
    var cd = loaded[code];
    if (!cd) return deck;
    if (deck === "missed") return "Ones I've missed";
    var m = /^(u\d+)-mix$/.exec(deck);
    for (var i = 0; i < cd.units.length; i++) {
      var u = cd.units[i];
      if (m && u.id === m[1]) return "Mixed review · " + u.short;
      for (var j = 0; j < u.lessons.length; j++) if (u.lessons[j].id === deck) return u.lessons[j].title;
    }
    return deck;
  }
  function fmtDate(ts) {
    var d = new Date(ts);
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric" }) + " " + d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
  }

  function render() {
    var sessions = data.sessions.slice().reverse();
    var done = sessions.filter(function (s) { return s.done; });
    var totalRight = 0, totalQ = 0;
    done.forEach(function (s) { totalRight += s.right; totalQ += s.quizzes; });
    var missed = SF.missedIds(data).length;

    document.getElementById("stats").innerHTML =
      '<div class="stat"><div class="num">' + done.length + '</div><div class="lbl">decks finished</div></div>' +
      '<div class="stat"><div class="num">' + (totalQ ? Math.round(totalRight / totalQ * 100) + "%" : "–") + '</div><div class="lbl">first-try accuracy</div></div>' +
      '<div class="stat"><div class="num">' + missed + '</div><div class="lbl">still missed</div></div>';

    /* weakest topics: group card results by lesson */
    var lessons = lessonMap();
    var byLesson = {};
    for (var id in data.cards) {
      var c = data.cards[id];
      if (!c.right && !c.wrong) continue;
      var key = null;
      for (var lid in lessons) if (id.indexOf(lid + "-") === 0) { key = lid; break; }
      if (!key) continue;
      var b = byLesson[key] || { right: 0, wrong: 0 };
      b.right += c.right; b.wrong += c.wrong;
      byLesson[key] = b;
    }
    var weak = [];
    for (var k in byLesson) {
      var t = byLesson[k].right + byLesson[k].wrong;
      if (t < 3) continue;
      weak.push({ key: k, rate: byLesson[k].right / t, total: t, wrong: byLesson[k].wrong });
    }
    weak.sort(function (a, b) { return a.rate - b.rate; });
    var weakEl = document.getElementById("weak");
    if (!weak.length) weakEl.innerHTML = '<div class="note">Not enough answers yet. Topics appear after a few quick checks.</div>';
    else {
      var html = '<div class="list">';
      weak.slice(0, 5).forEach(function (w) {
        var l = lessons[w.key];
        var pct = Math.round(w.rate * 100);
        html += '<a class="row" href="' + l.coursePath + "feed.html?deck=" + encodeURIComponent(l.lessonId) + '"><div><div class="row-title">' + SF.fmt(l.title) + '</div><div class="row-meta">' + SF.esc(l.course + " · " + l.unit) + " · " + w.wrong + " wrong of " + w.total + '</div></div><span class="row-right"><span class="pill ' + (pct < 60 ? "bad" : "") + '">' + pct + "%</span></span></a>";
      });
      weakEl.innerHTML = html + "</div>";
    }

    /* best scores per deck */
    var bestMap = {};
    done.forEach(function (s) {
      if (!s.quizzes) return;
      var key = s.course + "|" + s.deck;
      var pct = Math.round(s.right / s.quizzes * 100);
      if (!bestMap[key] || pct > bestMap[key].pct) bestMap[key] = { course: s.course, deck: s.deck, pct: pct, at: s.endedAt || s.startedAt };
    });
    var bestEl = document.getElementById("best");
    var bestRows = Object.keys(bestMap).map(function (k) { return bestMap[k]; });
    if (!bestRows.length) bestEl.innerHTML = '<div class="note">No finished decks yet.</div>';
    else {
      var th = '<table class="simple"><tr><th>Deck</th><th>Best</th></tr>';
      bestRows.forEach(function (b) {
        th += "<tr><td>" + SF.fmt(deckTitle(b.course, b.deck)) + '</td><td><span class="pill ' + (b.pct >= 80 ? "ok" : b.pct < 60 ? "bad" : "") + '">' + b.pct + "%</span></td></tr>";
      });
      bestEl.innerHTML = th + "</table>";
    }

    /* sessions */
    var sEl = document.getElementById("sessions");
    if (!sessions.length) sEl.innerHTML = '<div class="note">No sessions yet.</div>';
    else {
      var st = '<table class="simple"><tr><th>When</th><th>Deck</th><th>Score</th></tr>';
      sessions.slice(0, 25).forEach(function (s) {
        var score = s.quizzes ? Math.round(s.right / s.quizzes * 100) + "%" : "–";
        st += "<tr><td>" + fmtDate(s.startedAt) + "</td><td>" + SF.fmt(deckTitle(s.course, s.deck)) + "</td><td>" + (s.done ? score : '<span class="pill">not finished</span>') + "</td></tr>";
      });
      sEl.innerHTML = st + "</table>";
    }
  }
})();
