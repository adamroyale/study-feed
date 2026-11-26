/* Study Feed – progress storage (browser localStorage only). */
(function () {
  var KEY = "studyfeed:v1";
  var THEME_KEY = "studyfeed:theme";

  function blank() {
    return { v: 1, parentMode: false, sessions: [], cards: {} };
  }

  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw) return blank();
      var data = JSON.parse(raw);
      if (!data || data.v !== 1) return blank();
      data.sessions = data.sessions || [];
      data.cards = data.cards || {};
      return data;
    } catch (e) {
      return blank();
    }
  }

  function save(data) {
    try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (e) {}
  }

  function reset() {
    try { localStorage.removeItem(KEY); } catch (e) {}
  }

  /* Record one answer or reveal for a card. result: "right" | "wrong" | "seen" */
  function recordCard(data, id, result) {
    var c = data.cards[id] || { seen: 0, right: 0, wrong: 0, last: null, at: 0 };
    c.seen += 1;
    if (result === "right") { c.right += 1; c.last = "right"; }
    if (result === "wrong") { c.wrong += 1; c.last = "wrong"; }
    c.at = Date.now();
    data.cards[id] = c;
  }

  function missedIds(data, prefix) {
    var out = [];
    for (var id in data.cards) {
      if (data.cards[id].last === "wrong" && (!prefix || id.indexOf(prefix) === 0)) out.push(id);
    }
    return out;
  }

  function bestScore(data, course, deck) {
    var best = null;
    data.sessions.forEach(function (s) {
      if (s.course !== course || s.deck !== deck || !s.done || !s.quizzes) return;
      var pct = Math.round((s.right / s.quizzes) * 100);
      if (best === null || pct > best) best = pct;
    });
    return best;
  }

  function uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  /* theme */
  function applyTheme() {
    var t = null;
    try { t = localStorage.getItem(THEME_KEY); } catch (e) {}
    if (t === "dark" || t === "light") document.documentElement.setAttribute("data-theme", t);
    else document.documentElement.removeAttribute("data-theme");
  }
  function toggleTheme() {
    var cur = document.documentElement.getAttribute("data-theme");
    var prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    var effective = cur || (prefersDark ? "dark" : "light");
    var next = effective === "dark" ? "light" : "dark";
    try { localStorage.setItem(THEME_KEY, next); } catch (e) {}
    applyTheme();
  }

  /* Hebrew markup: «text» becomes an RTL span. Everything else is escaped. */
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (ch) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch];
    });
  }
  function fmt(s) {
    return esc(s).replace(/«([^»]*)»/g, '<span class="he" dir="rtl" lang="he">$1</span>');
  }
  function isHebrew(s) {
    return /[֐-׿]/.test(s) && !/[A-Za-z]/.test(s);
  }

  window.SF = {
    load: load, save: save, reset: reset, recordCard: recordCard, missedIds: missedIds,
    bestScore: bestScore, uid: uid, applyTheme: applyTheme, toggleTheme: toggleTheme,
    esc: esc, fmt: fmt, isHebrew: isHebrew
  };
  applyTheme();
})();
