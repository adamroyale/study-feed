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

  /* Posts the queue. Apps Script does not answer CORS preflights, so the request is sent as
     text/plain with no-cors; the reply is opaque and a completed request is treated as delivered. */
  function flush() {
    if (!enabled() || sending || parentMode()) return;
    var box = readBox();
    if (!box.length) return;
    sending = true;
    var batch = box.slice(0, 100);
    fetch(cfg.endpoint, { method: "POST", mode: "no-cors", body: payload(batch), headers: { "Content-Type": "text/plain" }, keepalive: true })
      .then(function () {
        var rest = readBox().slice(batch.length);
        writeBox(rest);
        sending = false;
        if (rest.length) flush();
      })
      .catch(function () { sending = false; });
  }

  /* On leaving the page, hand what is left to sendBeacon so it survives navigation. */
  function flushOnLeave() {
    if (!enabled() || parentMode() || !navigator.sendBeacon) return;
    var box = readBox();
    if (!box.length) return;
    var ok = navigator.sendBeacon(cfg.endpoint, new Blob([payload(box.slice(0, 100))], { type: "text/plain" }));
    if (ok) writeBox(box.slice(100));
  }
  document.addEventListener("visibilitychange", function () { if (document.visibilityState === "hidden") flushOnLeave(); });
  window.addEventListener("pagehide", flushOnLeave);

  window.SFSync = { enqueue: enqueue, flush: flush, deviceId: deviceId, enabled: enabled, queued: function () { return readBox().length; } };
  flush();
})();
