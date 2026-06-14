// コアエンジン: ループ / シーンスタック / 描画ヘルパ / フェード
var G = (function () {
  var canvas, ctx;
  var scenes = [];           // シーンスタック。最上位がアクティブ
  var frame = 0;
  var fadeAlpha = 0;         // 0=なし 1=真っ暗
  var fadeTarget = 0;
  var fadeSpeed = 0;
  var fadeResolve = null;
  var lastT = 0;

  var paused = false;
  var rafPending = false;
  var lastTick = 0;

  function schedule() {
    if (rafPending) return;
    rafPending = true;
    requestAnimationFrame(function (t) {
      rafPending = false;
      loop(t);
    });
  }

  function init() {
    canvas = document.getElementById("game");
    ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;
    schedule();
    // rAFが発火しない環境(バックグラウンドタブ等)向けフォールバック
    setInterval(function () {
      if (!paused && performance.now() - lastTick > 45) loop(performance.now());
    }, 33);
  }

  function loop(t) {
    if (paused) return;
    lastTick = performance.now();
    var dt = Math.min((t - lastT) / 1000, 0.05);
    lastT = t;
    frame++;

    var top = scenes[scenes.length - 1];
    if (top && top.update) top.update(dt);

    // フェード進行
    if (fadeAlpha !== fadeTarget) {
      var d = fadeSpeed * dt;
      if (fadeAlpha < fadeTarget) fadeAlpha = Math.min(fadeTarget, fadeAlpha + d);
      else fadeAlpha = Math.max(fadeTarget, fadeAlpha - d);
      if (fadeAlpha === fadeTarget && fadeResolve) {
        var r = fadeResolve; fadeResolve = null; r();
      }
    }

    // 描画: 最上位の不透明シーンから上へ
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    var start = scenes.length - 1;
    while (start > 0 && scenes[start].transparent) start--;
    for (var i = start; i < scenes.length; i++) {
      if (scenes[i].draw) scenes[i].draw(ctx);
    }

    if (fadeAlpha > 0) {
      ctx.fillStyle = "rgba(0,0,0," + fadeAlpha.toFixed(3) + ")";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    Input.endFrame();
    schedule();
  }

  // ---------- シーン ----------
  function push(s) { scenes.push(s); if (s.enter) s.enter(); }
  function pop() {
    var s = scenes.pop();
    if (s && s.exit) s.exit();
    var top = scenes[scenes.length - 1];
    if (top && top.resume) top.resume();
    return s;
  }
  function replace(s) {
    while (scenes.length) { var o = scenes.pop(); if (o.exit) o.exit(); }
    push(s);
  }
  function topScene() { return scenes[scenes.length - 1]; }

  // ---------- フェード ----------
  function fadeOut(ms) {
    fadeTarget = 1;
    fadeSpeed = 1000 / (ms || 300) ;
    return new Promise(function (res) {
      if (fadeAlpha === 1) res(); else fadeResolve = res;
    });
  }
  function fadeIn(ms) {
    fadeTarget = 0;
    fadeSpeed = 1000 / (ms || 300);
    return new Promise(function (res) {
      if (fadeAlpha === 0) res(); else fadeResolve = res;
    });
  }

  // ---------- テキスト ----------
  function text(c, str, x, y, size, color, align) {
    c.font = "bold " + (size || 20) + "px 'Hiragino Kaku Gothic ProN','Yu Gothic','Meiryo',sans-serif";
    c.textAlign = align || "left";
    c.textBaseline = "top";
    c.fillStyle = color || "#fff";
    c.fillText(str, x, y);
    c.textAlign = "left";
  }
  function textOutlined(c, str, x, y, size, color, outline, align) {
    c.font = "bold " + (size || 20) + "px 'Hiragino Kaku Gothic ProN','Yu Gothic','Meiryo',sans-serif";
    c.textAlign = align || "left";
    c.textBaseline = "top";
    c.lineWidth = 4;
    c.strokeStyle = outline || "#1a1a2e";
    c.lineJoin = "round";
    c.strokeText(str, x, y);
    c.fillStyle = color || "#fff";
    c.fillText(str, x, y);
    c.textAlign = "left";
  }

  // クラシックなウィンドウ枠
  function panel(c, x, y, w, h, opts) {
    opts = opts || {};
    c.fillStyle = opts.bg || "#f8f8f0";
    c.strokeStyle = "#30304a";
    c.lineWidth = 3;
    roundRect(c, x + 1.5, y + 1.5, w - 3, h - 3, 8);
    c.fill();
    c.stroke();
    c.strokeStyle = opts.inner || "#9090b0";
    c.lineWidth = 2;
    roundRect(c, x + 6, y + 6, w - 12, h - 12, 5);
    c.stroke();
  }
  function roundRect(c, x, y, w, h, r) {
    c.beginPath();
    c.moveTo(x + r, y);
    c.arcTo(x + w, y, x + w, y + h, r);
    c.arcTo(x + w, y + h, x, y + h, r);
    c.arcTo(x, y + h, x, y, r);
    c.arcTo(x, y, x + w, y, r);
    c.closePath();
  }

  // HPバー
  function hpBar(c, x, y, w, cur, max) {
    var ratio = Math.max(0, Math.min(1, cur / max));
    c.fillStyle = "#30304a";
    c.fillRect(x - 2, y - 2, w + 4, 12);
    c.fillStyle = "#555570";
    c.fillRect(x, y, w, 8);
    c.fillStyle = ratio > 0.5 ? "#4caf50" : ratio > 0.2 ? "#ffb300" : "#e53935";
    c.fillRect(x, y, Math.round(w * ratio), 8);
  }

  // 待機ユーティリティ
  function wait(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

  return {
    init: init,
    push: push, pop: pop, replace: replace, top: topScene,
    fadeOut: fadeOut, fadeIn: fadeIn,
    text: text, textOutlined: textOutlined, panel: panel, roundRect: roundRect, hpBar: hpBar,
    wait: wait,
    frameCount: function () { return frame; },
    pauseLoop: function () { paused = true; },
    resumeLoop: function () {
      if (paused) { paused = false; lastT = performance.now(); schedule(); }
    },
    W: 640, H: 576
  };
})();
