// 会話/選択肢システム (Promiseベース)
var Dialogue = (function () {

  function DialogueScene(pages, resolve) {
    this.transparent = true;
    this.pages = pages;
    this.resolve = resolve;
    this.page = 0;
    this.chars = 0;
    this.blink = 0;
  }
  DialogueScene.prototype.update = function (dt) {
    var cur = this.pages[this.page] || "";
    var speed = Game.settings.textSpeed === 2 ? 200 : Game.settings.textSpeed === 1 ? 60 : 30;
    if (this.chars < cur.length) {
      this.chars = Math.min(cur.length, this.chars + speed * dt);
      if (Input.p("a") || Input.p("b")) this.chars = cur.length;
    } else {
      this.blink += dt;
      if (Input.p("a") || Input.p("b")) {
        Audio2.sfx.select();
        this.page++;
        this.chars = 0;
        this.blink = 0;
        if (this.page >= this.pages.length) {
          G.pop();
          var r = this.resolve; this.resolve = null;
          if (r) r();
        }
      }
    }
  };
  DialogueScene.prototype.draw = function (c) {
    var cur = this.pages[this.page];
    if (cur === undefined) return;
    drawTextboxFrame(c);
    var shown = cur.substring(0, Math.floor(this.chars));
    var lines = shown.split("\n");
    for (var i = 0; i < lines.length && i < 3; i++) {
      G.text(c, lines[i], 44, G.H - 124 + i * 36, 24, "#222238");
    }
    if (this.chars >= cur.length && Math.floor(this.blink * 2) % 2 === 0) {
      c.fillStyle = "#e53935";
      c.beginPath();
      c.moveTo(G.W - 56, G.H - 44);
      c.lineTo(G.W - 36, G.H - 44);
      c.lineTo(G.W - 46, G.H - 30);
      c.fill();
    }
  };

  function drawTextboxFrame(c) {
    G.panel(c, 16, G.H - 152, G.W - 32, 136, { bg: "#f8f8f0" });
  }

  function ChoiceScene(options, opts, resolve) {
    this.transparent = true;
    this.options = options;
    this.opts = opts || {};
    this.resolve = resolve;
    this.idx = this.opts.defaultIdx || 0;
  }
  ChoiceScene.prototype.update = function () {
    if (Input.p("down")) { this.idx = (this.idx + 1) % this.options.length; Audio2.sfx.select(); }
    if (Input.p("up")) { this.idx = (this.idx + this.options.length - 1) % this.options.length; Audio2.sfx.select(); }
    if (Input.p("a")) {
      Audio2.sfx.confirm();
      G.pop();
      var r = this.resolve; this.resolve = null;
      if (r) r(this.idx);
    } else if (Input.p("b") && this.opts.cancelable !== false) {
      Audio2.sfx.cancel();
      G.pop();
      var r2 = this.resolve; this.resolve = null;
      if (r2) r2(-1);
    }
  };
  ChoiceScene.prototype.draw = function (c) {
    var w = this.opts.width || 220;
    var h = this.options.length * 40 + 28;
    var x = this.opts.x !== undefined ? this.opts.x : G.W - w - 24;
    var y = this.opts.y !== undefined ? this.opts.y : G.H - 152 - h - 8;
    G.panel(c, x, y, w, h);
    for (var i = 0; i < this.options.length; i++) {
      var ty = y + 18 + i * 40;
      if (i === this.idx) {
        c.fillStyle = "#e53935";
        c.beginPath();
        c.moveTo(x + 18, ty + 4); c.lineTo(x + 18, ty + 22); c.lineTo(x + 32, ty + 13);
        c.fill();
      }
      G.text(c, this.options[i], x + 42, ty, 23, "#222238");
    }
  };

  // テキストだけ即時表示する常設ボックス(バトル用に枠描画だけ再利用)
  return {
    show: function (pages) {
      if (typeof pages === "string") pages = [pages];
      return new Promise(function (resolve) {
        G.push(new DialogueScene(pages, resolve));
      });
    },
    choice: function (options, opts) {
      return new Promise(function (resolve) {
        G.push(new ChoiceScene(options, opts, resolve));
      });
    },
    drawTextboxFrame: drawTextboxFrame
  };
})();
