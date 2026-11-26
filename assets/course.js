/* Study Feed – renders a course's deck list (units, lessons, mixed review, missed). */
(function () {
  var course = window.COURSE_DATA;
  var data = SF.load();
  document.title = course.title + " · Study Feed";
  document.getElementById("course-title").textContent = course.title;
  document.getElementById("course-sub").textContent = course.subtitle;

  var root = document.getElementById("decks");
  var missed = SF.missedIds(data, course.code + "-").length;

  function row(href, title, meta, right, accent) {
    var a = document.createElement("a");
    a.className = "row" + (accent ? " row-accent" : "");
    a.href = href;
    a.innerHTML = '<div><div class="row-title">' + SF.fmt(title) + '</div>' + (meta ? '<div class="row-meta">' + SF.esc(meta) + "</div>" : "") + "</div>" +
      '<span class="row-right">' + (right || "") + '<span class="chev">›</span></span>';
    return a;
  }
  function scorePill(deckId) {
    var best = SF.bestScore(data, course.code, deckId);
    if (best === null) return "";
    return '<span class="pill ' + (best >= 80 ? "ok" : "") + '">best ' + best + "%</span>";
  }

  var top = document.createElement("div");
  top.className = "list";
  top.appendChild(row("feed.html?deck=missed", "Ones I've missed", missed ? missed + " quick checks to retry" : "Nothing missed yet", "", missed > 0));
  root.appendChild(top);

  course.units.forEach(function (unit) {
    var label = document.createElement("div");
    label.className = "section-label";
    label.textContent = unit.title;
    root.appendChild(label);
    var list = document.createElement("div");
    list.className = "list";
    unit.lessons.forEach(function (lesson) {
      var terms = 0, quizzes = 0;
      lesson.cards.forEach(function (c) { if (c.type === "term") terms++; if (c.type === "quiz") quizzes++; });
      var meta = [];
      if (terms) meta.push(terms + " terms");
      if (quizzes) meta.push(quizzes + " checks");
      list.appendChild(row("feed.html?deck=" + encodeURIComponent(lesson.id), lesson.title, meta.join(" · "), scorePill(lesson.id)));
    });
    list.appendChild(row("feed.html?deck=" + unit.id + "-mix", "Mixed review · " + unit.short, "All terms and checks, shuffled. Good for test prep.", scorePill(unit.id + "-mix")));
    root.appendChild(list);
  });

  document.getElementById("theme-btn").addEventListener("click", SF.toggleTheme);
})();
