// 特殊シーン: スターター選択 / 進化 / エンディング
function StarterScene(resolve) {
  this.resolve = resolve;
  this.idx = 1;
  this.starters = [1, 4, 7];
  this.t = 0;
  this.phase = 0; // 0=えらぶ 1=かくにん
}
StarterScene.prototype.update = function (dt) {
  this.t += dt;
  if (this.phase !== 0) return;
  if (Input.p("left")) { this.idx = (this.idx + 2) % 3; Audio2.sfx.select(); }
  if (Input.p("right")) { this.idx = (this.idx + 1) % 3; Audio2.sfx.select(); }
  if (Input.p("a")) {
    Audio2.sfx.confirm();
    var self = this;
    var sp = MONSTERS[this.starters[this.idx]];
    this.phase = 1;
    Dialogue.choice(["この子にする!", "やっぱり まよう"], { cancelable: false }).then(function (ci) {
      if (ci === 0) {
        var id = self.starters[self.idx];
        var mon = Rules.newMon(id, 5);
        Rules.addMon(mon);
        Game.flags.starter = true;
        Game.flags.starterChoice = id;
        Audio2.sfx.catchOk();
        Dialogue.show([
          "ユウは " + sp.name + "を\nなかまに した!",
          "カエデはかせ『いいセンスだ!\nだいじに そだてるんだよ。』",
          "カエデはかせ『モンスターカプセルと\nキズぐすりも もっていきなさい。』",
          "ずかんも わたしておこう。\nたくさん つかまえてくれたまえ!"
        ]).then(function () {
          G.pop();
          var r = self.resolve; self.resolve = null;
          if (r) r();
        });
      } else {
        self.phase = 0;
      }
    });
  }
};
StarterScene.prototype.draw = function (c) {
  var grad = c.createLinearGradient(0, 0, 0, 576);
  grad.addColorStop(0, "#2c3262");
  grad.addColorStop(1, "#10122a");
  c.fillStyle = grad;
  c.fillRect(0, 0, G.W, G.H);
  G.textOutlined(c, "さいしょの パートナーを えらぼう!", 320, 36, 30, "#ffd95e", "#222238", "center");
  c.imageSmoothingEnabled = false;
  for (var i = 0; i < 3; i++) {
    var sp = MONSTERS[this.starters[i]];
    var x = 110 + i * 210;
    var sel = i === this.idx;
    var fy = sel ? Math.sin(this.t * 3) * 8 : 0;
    if (sel) {
      c.fillStyle = "rgba(255,217,94,0.18)";
      G.roundRect(c, x - 80, 110, 160, 270, 16);
      c.fill();
      c.strokeStyle = "#ffd95e";
      c.lineWidth = 3;
      G.roundRect(c, x - 80, 110, 160, 270, 16);
      c.stroke();
    }
    var mc = SpriteLib.monsterCanvas(this.starters[i]);
    c.drawImage(mc, x - 60, 140 + fy, 120, 120);
    G.textOutlined(c, sp.name, x, 286, 24, sel ? "#ffd95e" : "#fff", "#222238", "center");
    var t = TYPES[sp.types[0]];
    c.fillStyle = t.color;
    G.roundRect(c, x - 45, 322, 90, 28, 6);
    c.fill();
    G.text(c, t.name, x, 326, 17, "#fff", "center");
  }
  var sp2 = MONSTERS[this.starters[this.idx]];
  G.panel(c, 60, 420, 520, 120);
  var lines = wrapJP(sp2.desc || "", 20);
  for (var l = 0; l < lines.length && l < 2; l++) {
    G.text(c, lines[l], 90, 448 + l * 34, 21, "#222238");
  }
  G.textOutlined(c, "← → で えらんで Zボタン", 320, 552, 18, "#cfc8ef", "#222238", "center");
};

// ---------- しんか ----------
function EvolutionScene(mon, resolve) {
  this.mon = mon;
  this.resolve = resolve;
  this.t = 0;
  this.phase = 0; // 0=ため 1=フラッシュ 2=かんせい
  this.fromId = mon.species;
  this.toId = MONSTERS[mon.species].evolvesTo;
  this.started = false;
  this.burst = 0;
}
EvolutionScene.prototype.enter = function () {
  Audio2.play("center");
};
EvolutionScene.prototype.update = function (dt) {
  this.t += dt;
  var self = this;
  if (!this.started) {
    this.started = true;
    Dialogue.show(["おや……?\n" + Rules.nameOf(this.mon) + "の ようすが…!"]).then(function () {
      self.phase = 1;
      self.t = 0;
    });
    return;
  }
  if (this.burst > 0) this.burst -= dt * 0.8;
  if (this.phase === 1 && this.t > 3.6) {
    this.phase = 2;
    this.burst = 1.2;
    Audio2.play("victory");
    var oldName = MONSTERS[this.fromId].name;
    var oldMax = Rules.statsOf(this.mon).hp;
    this.mon.species = this.toId;
    var newMax = Rules.statsOf(this.mon).hp;
    this.mon.curHP = Math.min(newMax, this.mon.curHP + (newMax - oldMax));
    Rules.markDex(this.toId, true);
    Audio2.sfx.catchOk();
    var learn = MONSTERS[this.toId].learnset.filter(function (e) { return e.level === self.mon.level; });
    var p = Dialogue.show(["おめでとう!\n" + oldName + "は " + MONSTERS[this.toId].name + "に\nしんかした!"]);
    learn.forEach(function (e) {
      p = p.then(function () {
        if (self.mon.moves.length < 4 && !self.mon.moves.some(function (m) { return m.id === e.move; })) {
          self.mon.moves.push({ id: e.move, pp: MOVES[e.move].pp });
          Audio2.sfx.levelup();
          return Dialogue.show([MONSTERS[self.toId].name + "は\n" + MOVES[e.move].name + "を おぼえた!"]);
        }
      });
    });
    p.then(function () {
      G.pop();
      var r = self.resolve; self.resolve = null;
      if (r) r();
    });
  }
};
EvolutionScene.prototype.draw = function (c) {
  // しんかの ひかりに つつまれる はいけい
  var glow = this.phase === 1 ? Math.min(0.55, this.t * 0.16) : 0.15;
  var grad = c.createRadialGradient(320, 270, 60, 320, 270, 420);
  grad.addColorStop(0, this.phase === 1 ? "#7a86c8" : "#4a5288");
  grad.addColorStop(1, "#15162c");
  c.fillStyle = grad;
  c.fillRect(0, 0, G.W, G.H);

  // こうせん(ひかりのレイ)
  if (this.phase >= 1) {
    c.save();
    c.translate(320, 270);
    for (var rIdx = 0; rIdx < 12; rIdx++) {
      var ang = rIdx * Math.PI / 6 + this.t * (this.phase === 1 ? 0.8 : 0.25);
      c.fillStyle = "rgba(255,240,170," + (this.phase === 1 ? 0.10 + glow * 0.18 : 0.07).toFixed(3) + ")";
      c.beginPath();
      c.moveTo(0, 0);
      c.lineTo(Math.cos(ang) * 480, Math.sin(ang) * 480 - 24);
      c.lineTo(Math.cos(ang + 0.16) * 480, Math.sin(ang + 0.16) * 480 - 24);
      c.fill();
    }
    c.restore();
  }

  c.imageSmoothingEnabled = false;
  var id = this.fromId;
  var white = false;
  if (this.phase === 1) {
    var speed = Math.min(16, 2 + this.t * 4.5);
    var blink = Math.floor(this.t * speed) % 2 === 0;
    id = blink ? this.fromId : this.toId;
    white = Math.floor(this.t * speed * 2) % 2 === 0;
  } else if (this.phase === 2) {
    id = this.toId;
  }
  var mc = SpriteLib.monsterCanvas(id, white && this.phase === 1);
  var scale = this.phase === 2 ? 200 + Math.sin(this.t * 2) * 4 : 168 + Math.sin(this.t * 6) * 8;
  c.drawImage(mc, 320 - scale / 2, 270 - scale / 2, scale, scale);

  if (this.phase === 1) {
    // ひろがる ひかりのリング
    for (var ring = 0; ring < 3; ring++) {
      var rr = ((this.t * 140 + ring * 110) % 340);
      var ra = Math.max(0, 0.5 - rr / 340 * 0.5);
      c.strokeStyle = "rgba(255,240,170," + ra.toFixed(3) + ")";
      c.lineWidth = 5 - ring;
      c.beginPath();
      c.ellipse(320, 270, rr, rr * 0.72, 0, 0, 7);
      c.stroke();
    }
    // ひかりのパーティクル
    for (var i = 0; i < 18; i++) {
      var a = i * 0.35 + this.t * 2.2;
      var r = 120 + Math.sin(this.t * 3 + i) * 50;
      c.fillStyle = "rgba(255,235,140," + (0.4 + 0.3 * Math.sin(this.t * 5 + i)).toFixed(2) + ")";
      c.beginPath();
      c.arc(320 + Math.cos(a) * r, 270 + Math.sin(a) * r * 0.7, 3 + (i % 3), 0, 7);
      c.fill();
    }
  }

  // しんかかんりょうの ホワイトバースト
  if (this.burst > 0) {
    c.fillStyle = "rgba(255,255,255," + Math.min(1, this.burst).toFixed(3) + ")";
    c.fillRect(0, 0, G.W, G.H);
  }
};

// ---------- エンディング ----------
function EndingScene() {
  this.t = 0;
  this.phase = 0;
  this.scroll = 0;
  this.credits = [
    "「ルミナサーガ」",
    "",
    "〜 スタッフ 〜",
    "",
    "そうごうディレクター",
    "クロード リード",
    "",
    "モンスター & タイルセット & はいけい",
    "Guardian Monsters Artwork",
    "by Georg Eckert / lucidtanooki",
    "(CC-BY-4.0)",
    "",
    "キャラクター ポートレート",
    "AI生成 (オリジナル)",
    "",
    "ワールド & シナリオ",
    "ワールドデザイン チーム",
    "",
    "おんがく",
    "チップチューン サウンド エージェント",
    "",
    "プログラム",
    "ゲームエンジン チーム",
    "",
    "スペシャル サンクス",
    "あそんでくれた キミ!",
    "",
    "",
    "そして……",
    "ルミナちほうの ぼうけんは",
    "まだまだ つづく!",
    "",
    "",
    "THE END"
  ];
  this.saved = false;
}
EndingScene.prototype.enter = function () {
  Audio2.play("ending");
  G.fadeIn(1000);
};
EndingScene.prototype.update = function (dt) {
  this.t += dt;
  if (this.phase === 0 && this.t > 4) { this.phase = 1; this.scroll = 0; }
  if (this.phase === 1) {
    this.scroll += dt * 36;
    var endY = this.credits.length * 44 + 100;
    if (this.scroll > endY) {
      this.phase = 2;
      if (!this.saved) { Rules.save(); this.saved = true; }
    }
  }
  if (this.phase === 2 && (Input.p("a") || Input.p("start"))) {
    Audio2.sfx.confirm();
    G.fadeOut(800).then(function () {
      G.replace(new OverworldScene());
      G.fadeIn(800);
    });
  }
};
EndingScene.prototype.draw = function (c) {
  c.fillStyle = "#0d1029";
  c.fillRect(0, 0, G.W, G.H);
  // ほしぞら
  for (var i = 0; i < 70; i++) {
    var x = (i * 137) % 640;
    var y = (i * 211) % 576;
    var a = 0.3 + 0.5 * Math.abs(Math.sin(this.t + i));
    c.fillStyle = "rgba(255,255,230," + a.toFixed(2) + ")";
    c.fillRect(x, y, 2, 2);
  }
  c.imageSmoothingEnabled = false;
  if (this.phase === 0) {
    G.textOutlined(c, "でんどういり おめでとう!", 320, 180, 38, "#ffd95e", "#222238", "center");
    // パーティをならべる
    for (var p = 0; p < Game.party.length; p++) {
      var mc = SpriteLib.monsterCanvas(Game.party[p].species);
      var fy = Math.sin(this.t * 2 + p) * 8;
      c.drawImage(mc, 70 + p * 90, 300 + fy, 72, 72);
    }
  } else if (this.phase === 1) {
    for (var l = 0; l < this.credits.length; l++) {
      var ty = 600 - this.scroll + l * 44;
      if (ty < -50 || ty > 620) continue;
      G.textOutlined(c, this.credits[l], 320, ty, l === 0 ? 34 : 22, l === 0 ? "#ffd95e" : "#fff", "#222238", "center");
    }
  } else {
    G.textOutlined(c, "THE END", 320, 240, 48, "#ffd95e", "#222238", "center");
    G.textOutlined(c, "〜 でんどういり レポートに きろくした 〜", 320, 330, 20, "#cfc8ef", "#222238", "center");
    if (Math.floor(this.t * 1.5) % 2 === 0) {
      G.textOutlined(c, "Zボタンで ぼうけんに もどる", 320, 420, 22, "#fff", "#222238", "center");
    }
  }
};
