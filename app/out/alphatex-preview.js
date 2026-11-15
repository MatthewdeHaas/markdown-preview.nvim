(function () {
  var VERSION = "1.9.0"; // the version that worked in your console test
  var BASE = "https://cdn.jsdelivr.net/npm/@coderline/alphatab@" + VERSION + "/dist/";
  var loading = null;

  function findBlocks() {
    return Array.prototype.filter.call(document.querySelectorAll("pre > code"), function (code) {
      return /^\s*!tab\b/.test(code.textContent);
    });
  }

  function loadAlphaTab() {
    if (window.alphaTab) return Promise.resolve();
    if (!loading) {
      loading = new Promise(function (resolve, reject) {
        var s = document.createElement("script");
        s.src = BASE + "alphaTab.min.js";
        s.onload = resolve;
        s.onerror = function () { console.error("[alphatex] failed to load", s.src); reject(); };
        document.head.appendChild(s);
      });
    }
    return loading;
  }

  function render() {
    var blocks = findBlocks();
    if (!blocks.length) return;
    console.log("[alphatex] found", blocks.length, "block(s)");
    loadAlphaTab().then(function () {
      findBlocks().forEach(function (code) {
        var tex = code.textContent.replace(/^\s*!tab[^\n]*\n?/, "");
        var pre = code.parentElement;
        var holder = document.createElement("div");
        holder.className = "alphatab-score";
        pre.replaceWith(holder);
        try {
          var api = new alphaTab.AlphaTabApi(holder, {
            core: { fontDirectory: BASE + "font/", useWorkers: false },
          });
          api.error.on(function (e) { console.error("[alphatex] render error", e); });
          api.tex(tex);
        } catch (e) {
          console.error("[alphatex] exception", e);
        }
      });
    });
  }

  var timer = null;
  function schedule() {
    clearTimeout(timer);
    timer = setTimeout(render, 150);
  }

  function start() {
    console.log("[alphatex] loaded");
    new MutationObserver(schedule).observe(document.body, { childList: true, subtree: true });
    schedule();
  }

  if (document.body) start();
  else document.addEventListener("DOMContentLoaded", start);
})();
