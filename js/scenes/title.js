// タイトル画面 / オープニング
function TitleScene() {
  this.t = 0;
  this.phase = 0; // 0=PUSH ENTER 1=メニュー
  this.idx = 0;
  this.stars = [];
  for (var i = 0; i < 60; i++) {
    this.stars.push({ x: Math.random() * 640, y: Math.random() * 380, s: Math.random() * 2 + 1, p: Math.random() * 6 });
  }
}
TitleScene.prototype.enter = function () {
  Audio2.play("title");
};
TitleScene.prototype.update = function (dt) {
  this.t += dt;
  if (this.phase === 0) {
    if (Input.p("a") || Input.p("start")) {
      Audio2.sfx.confirm();
      this.phase = 1;
      this.idx = 0;
    }
  } else {
    var opts = this.options();
    if (Input.p("down")) { this.idx = (this.idx + 1) % opts.length; Audio2.sfx.select(); }
    if (Input.p("up")) { this.idx = (this.idx + opts.length - 1) % opts.length; Audio2.sfx.select(); }
    if (Input.p("b")) { this.phase = 0; Audio2.sfx.cancel(); }
    if (Input.p("a") || Input.p("start")) {
      var sel = opts[this.idx];
      if (sel === "つづきから") {
        Audio2.sfx.confirm();
        var self = this;
        G.fadeOut(500).then(function () {
          Rules.load();
          G.replace(new OverworldScene());
          G.fadeIn(500);
        });
        this.phase = 2;
      } else if (sel === "さいしょから") {
        Audio2.sfx.confirm();
        this.phase = 2;
        G.fadeOut(500).then(function () {
          Rules.newGame();
          G.replace(new IntroScene());
          G.fadeIn(700);
        });
      }
    }
  }
};
TitleScene.prototype.options = function () {
  return Rules.hasSave() ? ["つづきから", "さいしょから"] : ["さいしょから"];
};
TitleScene.prototype.draw = function (c) {
  // 夜空グラデーション
  var grad = c.createLinearGradient(0, 0, 0, 576);
  grad.addColorStop(0, "#0d1342");
  grad.addColorStop(0.55, "#27357e");
  grad.addColorStop(0.8, "#7e5a9e");
  grad.addColorStop(1, "#e8907a");
  c.fillStyle = grad;
  c.fillRect(0, 0, 640, 576);

  // 星
  for (var i = 0; i < this.stars.length; i++) {
    var s = this.stars[i];
    var a = 0.4 + 0.6 * Math.abs(Math.sin(this.t * 1.5 + s.p));
    c.fillStyle = "rgba(255,255,230," + a.toFixed(2) + ")";
    c.fillRect(s.x, s.y, s.s, s.s);
  }

  // 地平線シルエット
  c.fillStyle = "#1a1430";
  c.beginPath();
  c.moveTo(0, 500);
  c.lineTo(80, 440); c.lineTo(170, 490); c.lineTo(300, 420);
  c.lineTo(420, 480); c.lineTo(540, 430); c.lineTo(640, 470);
  c.lineTo(640, 576); c.lineTo(0, 576);
  c.fill();

  // でんせつのモンスター(id26)が浮かぶ
  if (window.MONSTERS && MONSTERS[26]) {
    var mc = SpriteLib.monsterCanvas(26);
    var fy = Math.sin(this.t * 1.2) * 10;
    c.save();
    c.imageSmoothingEnabled = false;
    c.globalAlpha = 0.92;
    c.drawImage(mc, 478, 48 + fy, 140, 140);
    c.globalAlpha = 1;
    c.restore();
  }

  // ロゴ
  c.save();
  c.translate(320, 190);
  G.textOutlined(c, "ルミナサーガ", 0, -60, 76, "#ffd95e", "#3d2b00", "center");
  G.textOutlined(c, "- LUMINA SAGA -", 0, 30, 26, "#fff", "#27357e", "center");
  c.restore();

  if (this.phase === 0) {
    if (Math.floor(this.t * 1.6) % 2 === 0) {
      G.textOutlined(c, "Z または ENTER で スタート", 320, 470, 26, "#fff", "#1a1430", "center");
    }
  } else if (this.phase === 1) {
    var opts = this.options();
    var h = opts.length * 44 + 30;
    G.panel(c, 200, 420, 240, h);
    for (var j = 0; j < opts.length; j++) {
      var ty = 440 + j * 44;
      if (j === this.idx) {
        c.fillStyle = "#e53935";
        c.beginPath();
        c.moveTo(224, ty + 3); c.lineTo(224, ty + 23); c.lineTo(240, ty + 13);
        c.fill();
      }
      G.text(c, opts[j], 252, ty, 25, "#222238");
    }
  }
  G.textOutlined(c, "(C) LUMINA TEAM 2026", 320, 545, 16, "#cfc8ef", "#1a1430", "center");
};

// オープニング: カエデはかせのあいさつ
function IntroScene() {
  this.t = 0;
  this.started = false;
}
IntroScene.prototype.enter = function () {
  Audio2.play("center");
};
IntroScene.prototype.update = function (dt) {
  this.t += dt;
  if (!this.started && this.t > 0.6) {
    this.started = true;
    Dialogue.show([
      "やあ! ルミナちほうへ ようこそ!",
      "わたしは モンスターはかせの\nカエデ。",
      "このせかいには フシギな いきもの\n「モンスター」が くらしている。",
      "ひとと モンスターは たすけあい\nともに いきてきたんだ。",
      "きみの なまえは……そうそう\nユウ だったね!",
      "きょうから きみの\nモンスターものがたりが はじまる!",
      "さあ ぼうけんの せかいへ\nとびこもう!"
    ]).then(function () {
      G.fadeOut(700).then(function () {
        G.replace(new OverworldScene());
        G.fadeIn(700);
      });
    });
  }
};
IntroScene.prototype.draw = function (c) {
  c.fillStyle = "#101225";
  c.fillRect(0, 0, 640, 576);
  // スポットライト
  var grad = c.createRadialGradient(320, 260, 40, 320, 260, 260);
  grad.addColorStop(0, "#2c3262");
  grad.addColorStop(1, "#101225");
  c.fillStyle = grad;
  c.fillRect(0, 0, 640, 576);
  // はかせ (AIポートレート)
  c.imageSmoothingEnabled = false;
  var pim = SpriteLib.getImage("p_prof");
  if (pim) {
    c.drawImage(pim, 200, 90, 250, 250);
  } else {
    var sheet = SpriteLib.npcSheet ? SpriteLib.npcSheet("prof") : null;
    if (sheet) c.drawImage(sheet, 0, 0, 16, 32, 264, 110, 112, 224);
  }
  // ふわふわするモンスター (コロミミ)
  if (window.MONSTERS && MONSTERS[14]) {
    var mc = SpriteLib.monsterCanvas(14);
    var fy = Math.sin(this.t * 2) * 6;
    c.drawImage(mc, 440, 200 + fy, 84, 84);
  }
};
