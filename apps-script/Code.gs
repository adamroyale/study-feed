/**
 * Study Feed – add-only progress logger for Google Sheets.
 *
 * Paste this into the Apps Script project bound to the "Study Feed Progress" sheet
 * (Extensions → Apps Script), run setup() once, then deploy as a Web app
 * (Execute as: Me, Who has access: Anyone). See SHEET-SETUP.md in the repo.
 *
 * It only ever appends rows. It never reads back, edits or deletes anything,
 * and it never receives a name or anything typed by the student.
 */

// Must match "key" in assets/config.js on the site. It is not a secret (the site is public);
// it just stops random posts from landing in the sheet.
var KEY = "studyfeed";

var HEADERS = {
  events:   ["time", "device", "course", "deck", "card", "lesson", "result", "retry", "session"],
  sessions: ["time", "device", "course", "deck", "deck title", "quizzes", "right", "wrong", "score %", "seconds", "session"],
  devices:  ["device", "first seen", "last seen", "label (you fill this in)"]
};

/** Run once by hand: creates the tabs, headers and a Summary tab. Safe to run again. */
function setup() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  ensureSheets_(ss);
  // The summary formulas are (re)written on every run, so running setup again repairs them.
  var summary = ss.getSheetByName("summary") || ss.insertSheet("summary");
  summary.getRange("A1").setValue("Right and wrong answers by lesson (all devices)");
  summary.getRange("A2").setFormula('=IFERROR(QUERY(events!A:I, "select F, count(G) where G=\'right\' or G=\'wrong\' group by F pivot G label F \'lesson\'", 1), "no answers yet")');
  summary.getRange("F1").setValue("Best score per deck");
  summary.getRange("F2").setFormula('=IFERROR(QUERY(sessions!A:K, "select B, E, max(I) group by B, E label B \'device\', E \'deck\', max(I) \'best %\'", 1), "no sessions yet")');
  summary.getRange("K1").setValue("Answers per day");
  summary.getRange("K2").setFormula('=IFERROR(QUERY(events!A:I, "select toDate(A), count(G) where G=\'right\' or G=\'wrong\' group by toDate(A) order by toDate(A) desc label toDate(A) \'day\', count(G) \'answers\'", 1), "no answers yet")');
  summary.getRange("K3:K1000").setNumberFormat("yyyy-mm-dd");
  summary.getRange("A1:L1").setFontWeight("bold");
  var first = ss.getSheets()[0];
  if (first.getName() === "Sheet1" && first.getLastRow() === 0) ss.deleteSheet(first);
}

/** The site posts JSON here. Always answers 200 so the browser never retries forever. */
function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    var body = JSON.parse((e && e.postData && e.postData.contents) || "{}");
    if (body.key !== KEY) return out_({ ok: false, error: "bad key" });
    if (!body.device || !/^[a-z0-9]{6,32}$/i.test(body.device)) return out_({ ok: false, error: "bad device" });
    var items = Array.isArray(body.items) ? body.items.slice(0, 200) : [];

    lock.waitLock(20000);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    ensureSheets_(ss);
    var events = ss.getSheetByName("events");
    var sessions = ss.getSheetByName("sessions");
    var now = new Date();
    var eventRows = [], sessionRows = [];

    items.forEach(function (it) {
      if (!it || typeof it !== "object") return;
      var at = it.at ? new Date(it.at) : now;
      if (it.type === "answer") {
        eventRows.push([at, body.device, s_(it.course), s_(it.deck), s_(it.card), s_(it.lesson), s_(it.result), it.retry ? "yes" : "no", s_(it.session)]);
      } else if (it.type === "session") {
        var q = n_(it.quizzes), r = n_(it.right), w = n_(it.wrong);
        eventRows.length; // no-op, keeps order of declarations clear
        sessionRows.push([at, body.device, s_(it.course), s_(it.deck), s_(it.title), q, r, w, q ? Math.round(r / q * 100) : "", n_(it.seconds), s_(it.session)]);
      }
    });
    if (eventRows.length) events.getRange(events.getLastRow() + 1, 1, eventRows.length, HEADERS.events.length).setValues(eventRows);
    if (sessionRows.length) sessions.getRange(sessions.getLastRow() + 1, 1, sessionRows.length, HEADERS.sessions.length).setValues(sessionRows);
    touchDevice_(ss.getSheetByName("devices"), body.device, now);
    return out_({ ok: true, events: eventRows.length, sessions: sessionRows.length });
  } catch (err) {
    return out_({ ok: false, error: String(err) });
  } finally {
    try { lock.releaseLock(); } catch (ignored) {}
  }
}

/** Lets you open the web app URL in a browser to confirm it is deployed. */
function doGet() {
  return out_({ ok: true, service: "study-feed-progress" });
}

function ensureSheets_(ss) {
  Object.keys(HEADERS).forEach(function (name) {
    var sh = ss.getSheetByName(name);
    if (!sh) sh = ss.insertSheet(name);
    if (sh.getLastRow() === 0) {
      sh.appendRow(HEADERS[name]);
      sh.getRange(1, 1, 1, HEADERS[name].length).setFontWeight("bold");
      sh.setFrozenRows(1);
    }
  });
}

function touchDevice_(sh, device, now) {
  var last = sh.getLastRow();
  if (last > 1) {
    var ids = sh.getRange(2, 1, last - 1, 1).getValues();
    for (var i = 0; i < ids.length; i++) {
      if (ids[i][0] === device) { sh.getRange(i + 2, 3).setValue(now); return; }
    }
  }
  sh.appendRow([device, now, now, ""]);
}

function s_(v) { return v == null ? "" : String(v).slice(0, 120); }
function n_(v) { var n = Number(v); return isFinite(n) ? n : ""; }
function out_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
