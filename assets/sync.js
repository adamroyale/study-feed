/* Study Feed – queues progress events and posts them to the Apps Script endpoint.
   Sends only: a random device id, card ids, right/wrong, scores, timestamps.
   Nothing is sent while parent mode is on or while no endpoint is configured. */
(function () {
  var OUTBOX = "studyfeed:outbox";
  var DEVICE = "studyfeed:device";
  var cfg = window.SF_CONFIG || {};
  var sending = false;

  function deviceId() {
    var id = null;
    try { id = localStorage.getItem(DEVICE); } catch (e) {}
    if (!id) {
      id = "";
      var chars = "abcdefghijklmnopqrstuvwxyz0123456789";
      var arr = new Uint8Array(12);
      if (window.crypto && crypto.getRandomValues) crypto.getRandomValues(arr);
      else for (var i = 0; i < 12; i++) arr[i] = Math.floor(Math.random() * 256);
      for (var j = 0; j < 12; j++) id += chars[arr[j] % chars.length];
      try { localStorage.setItem(DEVICE, id); } catch (e) {}
    }
    return id;
  }

  function readBox() {
    try { return JSON.parse(localStorage.getItem(OUTBOX) || "[]") || []; } catch (e) { return []; }
  }
  function writeBox(items) {
    try { localStorage.setItem(OUTBOX, JSON.stringify(items.slice(-500))); } catch (e) {}
  }

  function enabled() { return !!(cfg.endpoint && /^https:\/\//.test(cfg.endpoint)); }
  function parentMode() { try { return !!SF.load().parentMode; } catch (e) { return false; } }

  function enqueue(item) {
    if (parentMode()) return;
    item.at = item.at || Date.now();
    var box = readBox();
    box.push(item);
    writeBox(box);
    flush();
  }

  function payload(items) {
    return JSON.stringify({ key: cfg.key || "", device: deviceId(), items: items });
  }

  /* Posts the queue. The body goes as text/plain so the browser sends no CORS preflight
     (Apps Script cannot answer one). Events are removed from the queue only when the script
     replies {ok:true}; a sign-in page, a 403 or a network error leaves them queued. */
  var lastError = "";
  var confirmedOnce = false;
  try { confirmedOnce = sessionStorage.getItem("studyfeed:sync-ok") === "1"; } catch (e) {}
  function flush() {
    if (!enabled() || sending || parentMode()) return;
    var box = readBox();
    if (!box.length) return;
    sending = true;
    var batch = box.slice(0, 100);
    fetch(cfg.endpoint, { method: "POST", body: payload(batch), headers: { "Content-Type": "text/plain" }, redirect: "follow" })
      .then(function (res) { return res.ok ? res.json() : Promise.reject(new Error("HTTP " + res.status)); })
      .then(function (json) {
        if (!json || !json.ok) throw new Error(json && json.error ? json.error : "not accepted");
        var rest = readBox().slice(batch.length);
        writeBox(rest);
        lastError = "";
        confirmedOnce = true;
        try { sessionStorage.setItem("studyfeed:sync-ok", "1"); } catch (e) {}
        sending = false;
        if (rest.length) flush();
      })
      .catch(function (err) { lastError = String(err && err.message || err); sending = false; });
  }

  /* On leaving the page, hand what is left to sendBeacon so it survives navigation.
     Only once a normal send has been confirmed in this session, so a misconfigured
     endpoint never swallows events. */
  function flushOnLeave() {
    if (!enabled() || parentMode() || !navigator.sendBeacon || !confirmedOnce) return;
    var box = readBox();
    if (!box.length) return;
    var ok = navigator.sendBeacon(cfg.endpoint, new Blob([payload(box.slice(0, 100))], { type: "text/plain" }));
    if (ok) writeBox(box.slice(100));
  }
  document.addEventListener("visibilitychange", function () { if (document.visibilityState === "hidden") flushOnLeave(); });
  window.addEventListener("pagehide", flushOnLeave);

  window.SFSync = { enqueue: enqueue, flush: flush, deviceId: deviceId, enabled: enabled, queued: function () { return readBox().length; }, lastError: function () { return lastError; } };
  flush();
})();
