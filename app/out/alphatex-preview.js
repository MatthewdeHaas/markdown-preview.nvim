(function () {
  var VERSION = "1.9.0"; // replace with a current version
  var BASE = "https://cdn.jsdelivr.net/npm/@coderline/alphatab@" + VERSION + "/dist/";
  var SELECTOR = "pre > code.language-alphatex";
  var loading = null;

  function loadAlphaTab() {
    if (window.alphaTab) return Promise.resolve();
    if (!loading) {
      loading = new Promise(function (resolve, reject) {
        var s = document.createElement("script");
        s.src = BASE + "alphaTab.min.js";
        s.onload = resolve;
        s.onerror = reject;
        document.head.appendChild(s);
      });
    }
    return loading;
  }

  function render() {
    if (!document.querySelector(SELECTOR)) return;
    loadAlphaTab().then(function () {
      document.querySelectorAll(SELECTOR).forEach(function (code) {
        var pre = code.parentElement;
        var holder = document.createElement("div");
        holder.className = "alphatab-score";
        pre.replaceWith(holder);
        var api = new alphaTab.AlphaTabApi(holder, {
          core: { fontDirectory: BASE + "font/", useWorkers: false },
        });
        api.tex(code.textContent);
      });
    });
  }

  var timer = null;
  function schedule() {
    clearTimeout(timer);
    timer = setTimeout(render, 150);
  }

  function start() {
    new MutationObserver(schedule).observe(document.body, {
      childList: true,
      subtree: true,
    });
    schedule();
  }

  if (document.body) start();
  else document.addEventListener("DOMContentLoaded", start);
})();
