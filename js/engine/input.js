// 入力管理 (キーボード + テスト用シミュレーション)
var Input = (function () {
  var keyMap = {
    ArrowUp: "up", ArrowDown: "down", ArrowLeft: "left", ArrowRight: "right",
    w: "up", s: "down", a: "left", d: "right",
    z: "a", Z: "a", " ": "a",
    x: "b", X: "b", Escape: "b",
    Enter: "start"
  };
  var held = {};      // 現在押下中
  var pressed = {};   // このフレームで押された(エッジ)
  var queue = [];     // シミュレーション用キュー {key, frames}
  var sim = {};       // シミュレーション押下中 {key: 残フレーム}

  window.addEventListener("keydown", function (e) {
    var k = keyMap[e.key];
    if (!k) return;
    e.preventDefault();
    if (!held[k]) pressed[k] = true;
    held[k] = true;
    if (window.Audio2 && Audio2.unlock) Audio2.unlock();
  });
  window.addEventListener("keyup", function (e) {
    var k = keyMap[e.key];
    if (!k) return;
    held[k] = false;
  });
  window.addEventListener("pointerdown", function () {
    if (window.Audio2 && Audio2.unlock) Audio2.unlock();
  });

  return {
    // エッジ入力 (押した瞬間のみ true)
    p: function (k) { return !!pressed[k]; },
    // ホールド入力
    h: function (k) { return !!held[k] || !!sim[k]; },
    // 何かしらの決定/開始キー
    anyConfirm: function () { return this.p("a") || this.p("start"); },
    // フレーム末で呼ぶ
    endFrame: function () {
      pressed = {};
      for (var k in sim) {
        sim[k]--;
        if (sim[k] <= 0) delete sim[k];
      }
      if (queue.length > 0) {
        var q = queue.shift();
        pressed[q.key] = true;
        if (q.frames > 1) sim[q.key] = q.frames;
      }
    },
    // テスト用: 次フレームにキー入力を注入。frames>1でホールド
    simulate: function (key, frames) {
      queue.push({ key: key, frames: frames || 1 });
    },
    simulateSeq: function (keys, gap) {
      var g = gap || 8;
      for (var i = 0; i < keys.length; i++) {
        queue.push({ key: keys[i], frames: 1 });
        for (var j = 0; j < g - 1; j++) queue.push({ key: "__none", frames: 1 });
      }
    },
    queueLength: function () { return queue.length; }
  };
})();
