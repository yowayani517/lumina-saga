// メニュー類: ポーズ / パーティ / ステータス / バッグ / ずかん / ボックス / せってい
function MenuScene() {
  this.transparent = true;
  this.idx = 0;
  this.items = ["ずかん", "モンスター", "バッグ", "ボックス", "レポート", "バッジ", "せってい", "とじる"];
}
MenuScene.prototype.update = function () {
  if (Input.p("down")) { this.idx = (this.idx + 1) % this.items.length; Audio2.sfx.select(); }
  if (Input.p("up")) { this.idx = (this.idx + this.items.length - 1) % this.items.length; Audio2.sfx.select(); }
  if (Input.p("b") || Input.p("start")) { Audio2.sfx.cancel(); G.pop(); return; }
  if (Input.p("a")) {
    Audio2.sfx.confirm();
    var sel = this.items[this.idx];
    if (sel === "とじる") { G.pop(); return; }
    if (sel === "ずかん") G.push(new DexScene());
    else if (sel === "モンスター") G.push(new PartyScene("view"));
    else if (sel === "バッグ") G.push(new BagScene("field"));
    else if (sel === "ボックス") G.push(new BoxScene());
    else if (sel === "レポート") {
      var ok = Rules.save();
      Audio2.sfx.save();
      Dialogue.show([ok ? "レポートに しっかり\nかきのこした!" : "セーブに しっぱいした…"]);
    }
    else if (sel === "バッジ") G.push(new BadgeScene());
    else if (sel === "せってい") G.push(new SettingsScene());
  }
};
MenuScene.prototype.draw = function (c) {
  var w = 230, h = this.items.length * 42 + 28;
  var x = G.W - w - 16, y = 16;
  G.panel(c, x, y, w, h);
  for (var i = 0; i < this.items.length; i++) {
    var ty = y + 18 + i * 42;
    if (i === this.idx) {
      c.fillStyle = "#e53935";
      c.beginPath();
      c.moveTo(x + 16, ty + 3); c.lineTo(x + 16, ty + 23); c.lineTo(x + 30, ty + 13);
      c.fill();
    }
    G.text(c, this.items[i], x + 40, ty, 23, "#222238");
  }
  // しょじきん
  G.panel(c, 16, G.H - 70, 250, 54);
  G.text(c, "しょじきん " + Game.money + "えん", 36, G.H - 54, 21, "#222238");
};

// ---------- パーティ ----------
// mode: "view"=メニューから / "select"=たいしょうをえらぶ(callbackにindex, -1=キャンセル)
function PartyScene(mode, callback, opts) {
  this.mode = mode;
  this.callback = callback;
  this.opts = opts || {};
  this.idx = 0;
  this.swapFrom = -1;
}
PartyScene.prototype.update = function () {
  var n = Game.party.length;
  if (n === 0) { G.pop(); if (this.callback) this.callback(-1); return; }
  if (Input.p("down")) { this.idx = (this.idx + 1) % n; Audio2.sfx.select(); }
  if (Input.p("up")) { this.idx = (this.idx + n - 1) % n; Audio2.sfx.select(); }
  if (Input.p("b")) {
    Audio2.sfx.cancel();
    if (this.swapFrom >= 0) { this.swapFrom = -1; return; }
    G.pop();
    if (this.callback) this.callback(-1);
    return;
  }
  if (Input.p("a")) {
    Audio2.sfx.confirm();
    var self = this;
    if (this.swapFrom >= 0) {
      var t = Game.party[this.swapFrom];
      Game.party[this.swapFrom] = Game.party[this.idx];
      Game.party[this.idx] = t;
      this.swapFrom = -1;
      return;
    }
    if (this.mode === "select") {
      G.pop();
      if (this.callback) this.callback(this.idx);
      return;
    }
    Dialogue.choice(["ステータス", "いれかえ", "もどる"]).then(function (ci) {
      if (ci === 0) G.push(new StatusScene(Game.party[self.idx]));
      else if (ci === 1) self.swapFrom = self.idx;
    });
  }
};
PartyScene.prototype.draw = function (c) {
  c.fillStyle = "#3b4466";
  c.fillRect(0, 0, G.W, G.H);
  G.textOutlined(c, this.opts.title || "モンスター", 24, 16, 30, "#fff", "#222238");
  c.imageSmoothingEnabled = false;
  for (var i = 0; i < Game.party.length; i++) {
    var m = Game.party[i];
    var st = Rules.statsOf(m);
    var y = 64 + i * 82;
    G.panel(c, 20, y, G.W - 40, 74, { bg: i === this.idx ? "#fff8dc" : "#f0f0ea" });
    if (i === this.swapFrom) {
      c.strokeStyle = "#e53935"; c.lineWidth = 4;
      c.strokeRect(22, y + 2, G.W - 44, 70);
    }
    var mc = SpriteLib.monsterCanvas(m.species);
    c.drawImage(mc, 36, y + 12, 52, 52);
    G.text(c, Rules.nameOf(m), 104, y + 12, 23, "#222238");
    G.text(c, "Lv" + m.level, 104, y + 42, 20, "#555");
    G.hpBar(c, 260, y + 24, 220, m.curHP, st.hp);
    G.text(c, m.curHP + "/" + st.hp, 260, y + 40, 19, "#444");
    if (m.curHP <= 0) G.text(c, "ひんし", 500, y + 24, 21, "#c62828");
    else if (m.status) G.text(c, Rules.STATUS_NAME[m.status], 500, y + 24, 21, "#8e24aa");
    if (i === this.idx) {
      c.fillStyle = "#e53935";
      c.beginPath();
      c.moveTo(8, y + 28); c.lineTo(8, y + 48); c.lineTo(20, y + 38);
      c.fill();
    }
  }
};

// ---------- ステータス ----------
function StatusScene(mon) { this.mon = mon; }
StatusScene.prototype.update = function () {
  if (Input.p("b") || Input.p("a")) { Audio2.sfx.cancel(); G.pop(); }
};
StatusScene.prototype.draw = function (c) {
  var m = this.mon;
  var sp = MONSTERS[m.species];
  var st = Rules.statsOf(m);
  c.fillStyle = "#3b4466";
  c.fillRect(0, 0, G.W, G.H);
  G.panel(c, 20, 20, 280, 300);
  c.imageSmoothingEnabled = false;
  var mc = SpriteLib.monsterCanvas(m.species);
  c.drawImage(mc, 76, 50, 168, 168);
  G.text(c, sp.name + "  Lv" + m.level, 48, 240, 25, "#222238");
  for (var i = 0; i < sp.types.length; i++) {
    var t = TYPES[sp.types[i]];
    c.fillStyle = t.color;
    G.roundRect(c, 48 + i * 110, 274, 100, 30, 6);
    c.fill();
    G.text(c, t.name, 98 + i * 110, 278, 19, "#fff", "center");
  }
  G.panel(c, 320, 20, 300, 300);
  var rows = [
    ["HP", m.curHP + "/" + st.hp],
    ["こうげき", st.atk], ["ぼうぎょ", st.def],
    ["とくこう", st.spa], ["とくぼう", st.spdef], ["すばやさ", st.spe],
    ["つぎのLvまで", m.level >= 100 ? "-" : (Rules.expForLevel(m.level + 1) - m.exp)]
  ];
  for (var r = 0; r < rows.length; r++) {
    G.text(c, rows[r][0], 344, 44 + r * 38, 21, "#222238");
    G.text(c, "" + rows[r][1], 596, 44 + r * 38, 21, "#222238", "right");
  }
  G.panel(c, 20, 336, 600, 200);
  G.text(c, "わざ", 44, 352, 21, "#666");
  for (var w = 0; w < m.moves.length; w++) {
    var mv = MOVES[m.moves[w].id];
    G.text(c, mv.name, 60, 384 + w * 36, 22, "#222238");
    c.fillStyle = TYPES[mv.type].color;
    G.roundRect(c, 280, 386 + w * 36, 90, 26, 5);
    c.fill();
    G.text(c, TYPES[mv.type].name, 325, 388 + w * 36, 17, "#fff", "center");
    G.text(c, "PP " + m.moves[w].pp + "/" + mv.pp, 596, 384 + w * 36, 20, "#444", "right");
  }
};

// ---------- バッグ ----------
// mode: "field" / "battle" (battleはcallbackに{itemId}か null)
function BagScene(mode, callback) {
  this.mode = mode;
  this.callback = callback;
  this.idx = 0;
}
BagScene.prototype.itemList = function () {
  return Object.keys(Game.bag);
};
BagScene.prototype.update = function () {
  var list = this.itemList();
  if (Input.p("b")) {
    Audio2.sfx.cancel(); G.pop();
    if (this.callback) this.callback(null);
    return;
  }
  if (list.length === 0) return;
  if (this.idx >= list.length) this.idx = list.length - 1;
  if (Input.p("down")) { this.idx = (this.idx + 1) % list.length; Audio2.sfx.select(); }
  if (Input.p("up")) { this.idx = (this.idx + list.length - 1) % list.length; Audio2.sfx.select(); }
  if (Input.p("a")) {
    Audio2.sfx.confirm();
    var id = list[this.idx];
    var item = ITEMS[id];
    var self = this;
    if (this.mode === "battle") {
      G.pop();
      if (this.callback) this.callback(id);
      return;
    }
    if (item.kind === "ball") {
      Dialogue.show(["バトルちゅうにしか\nつかえない。"]);
      return;
    }
    G.push(new PartyScene("select", function (pi) {
      if (pi < 0) return;
      var m = Game.party[pi];
      var st = Rules.statsOf(m);
      if (item.kind === "heal") {
        if (m.curHP <= 0 || m.curHP >= st.hp) { Dialogue.show(["つかっても こうかが ないよ。"]); return; }
        m.curHP = Math.min(st.hp, m.curHP + item.amount);
        Audio2.sfx.heal();
        Rules.removeItem(id);
        Dialogue.show([Rules.nameOf(m) + "の HPが\nかいふくした!"]);
      } else if (item.kind === "status") {
        if (!m.status || m.curHP <= 0) { Dialogue.show(["つかっても こうかが ないよ。"]); return; }
        m.status = null;
        Audio2.sfx.heal();
        Rules.removeItem(id);
        Dialogue.show([Rules.nameOf(m) + "は\nげんきに なった!"]);
      } else if (item.kind === "revive") {
        if (m.curHP > 0) { Dialogue.show(["つかっても こうかが ないよ。"]); return; }
        m.curHP = Math.floor(st.hp / 2);
        Audio2.sfx.heal();
        Rules.removeItem(id);
        Dialogue.show([Rules.nameOf(m) + "は\nめを さました!"]);
      }
    }, { title: "だれに つかう?" }));
  }
};
BagScene.prototype.draw = function (c) {
  c.fillStyle = "#4a3f5c";
  c.fillRect(0, 0, G.W, G.H);
  G.textOutlined(c, "バッグ", 24, 16, 30, "#fff", "#222238");
  var list = this.itemList();
  G.panel(c, 20, 64, 380, 460);
  if (list.length === 0) {
    G.text(c, "なにも もっていない", 50, 100, 22, "#666");
  }
  for (var i = 0; i < list.length; i++) {
    var y = 88 + i * 44;
    if (i === this.idx) {
      c.fillStyle = "#e53935";
      c.beginPath();
      c.moveTo(36, y + 2); c.lineTo(36, y + 22); c.lineTo(50, y + 12);
      c.fill();
    }
    G.text(c, ITEMS[list[i]].name, 60, y, 21, "#222238");
    G.text(c, "x" + Game.bag[list[i]], 372, y, 21, "#444", "right");
  }
  G.panel(c, 416, 64, 204, 460);
  if (list[this.idx]) {
    var desc = ITEMS[list[this.idx]].desc;
    var words = desc.split(" ");
    var lines = [], cur = "";
    for (var w2 = 0; w2 < words.length; w2++) {
      if ((cur + words[w2]).length > 8) { lines.push(cur); cur = words[w2]; }
      else cur += (cur ? " " : "") + words[w2];
    }
    lines.push(cur);
    for (var l = 0; l < lines.length; l++) {
      G.text(c, lines[l], 436, 92 + l * 30, 19, "#222238");
    }
  }
};

// ---------- ずかん ----------
function DexScene() { this.idx = 0; }
DexScene.prototype.update = function () {
  var n = Object.keys(MONSTERS).length;
  if (Input.p("down")) { this.idx = (this.idx + 1) % n; Audio2.sfx.select(); }
  if (Input.p("up")) { this.idx = (this.idx + n - 1) % n; Audio2.sfx.select(); }
  if (Input.p("b")) { Audio2.sfx.cancel(); G.pop(); }
};
DexScene.prototype.draw = function (c) {
  c.fillStyle = "#37474f";
  c.fillRect(0, 0, G.W, G.H);
  G.textOutlined(c, "モンスターずかん", 24, 14, 28, "#fff", "#222238");
  var ids = Object.keys(MONSTERS).map(Number).sort(function (a, b) { return a - b; });
  var caught = ids.filter(function (i) { return Game.dex.caught[i]; }).length;
  var seen = ids.filter(function (i) { return Game.dex.seen[i]; }).length;
  G.textOutlined(c, "みつけた " + seen + "  つかまえた " + caught, G.W - 24, 20, 20, "#ffd95e", "#222238", "right");

  G.panel(c, 20, 60, 300, 500);
  var visible = 11;
  var start = Math.max(0, Math.min(this.idx - 5, ids.length - visible));
  for (var i = start; i < Math.min(ids.length, start + visible); i++) {
    var id = ids[i];
    var y = 80 + (i - start) * 43;
    var label = Game.dex.caught[id] ? MONSTERS[id].name : Game.dex.seen[id] ? MONSTERS[id].name : "?????";
    if (i === this.idx) {
      c.fillStyle = "#ffd95e";
      c.fillRect(32, y - 4, 276, 36);
    }
    if (Game.dex.caught[id]) {
      c.fillStyle = "#e53935";
      c.beginPath(); c.arc(50, y + 13, 7, 0, 7); c.fill();
      c.fillStyle = "#fff";
      c.beginPath(); c.arc(50, y + 13, 3, 0, 7); c.fill();
    }
    G.text(c, ("00" + id).slice(-2) + " " + label, 66, y, 21, "#222238");
  }

  G.panel(c, 336, 60, 284, 500);
  var sel = ids[this.idx];
  c.imageSmoothingEnabled = false;
  if (Game.dex.seen[sel]) {
    var mc = SpriteLib.monsterCanvas(sel, !Game.dex.caught[sel]);
    c.drawImage(mc, 406, 90, 144, 144);
    G.text(c, MONSTERS[sel].name, 478, 246, 24, "#222238", "center");
    if (Game.dex.caught[sel]) {
      var types = MONSTERS[sel].types;
      for (var t = 0; t < types.length; t++) {
        c.fillStyle = TYPES[types[t]].color;
        G.roundRect(c, 388 + t * 100, 282, 90, 28, 6);
        c.fill();
        G.text(c, TYPES[types[t]].name, 433 + t * 100, 286, 17, "#fff", "center");
      }
      var desc = MONSTERS[sel].desc || "";
      var lines = wrapJP(desc, 11);
      for (var l = 0; l < lines.length && l < 6; l++) {
        G.text(c, lines[l], 360, 330 + l * 30, 19, "#222238");
      }
    }
  } else {
    G.text(c, "？", 478, 140, 80, "#90a4ae", "center");
  }
};
function wrapJP(s, n) {
  var parts = s.split(" ");
  var lines = [], cur = "";
  for (var i = 0; i < parts.length; i++) {
    if (cur.length + parts[i].length > n && cur) { lines.push(cur); cur = parts[i]; }
    else cur += parts[i];
  }
  if (cur) lines.push(cur);
  return lines;
}

// ---------- ボックス ----------
function BoxScene() { this.idx = 0; }
BoxScene.prototype.update = function () {
  if (Input.p("b")) { Audio2.sfx.cancel(); G.pop(); return; }
  var n = Game.box.length;
  if (n === 0) return;
  if (this.idx >= n) this.idx = n - 1;
  if (Input.p("down")) { this.idx = (this.idx + 1) % n; Audio2.sfx.select(); }
  if (Input.p("up")) { this.idx = (this.idx + n - 1) % n; Audio2.sfx.select(); }
  if (Input.p("a")) {
    Audio2.sfx.confirm();
    var self = this;
    Dialogue.choice(["パーティにいれる", "もどる"]).then(function (ci) {
      if (ci !== 0) return;
      var mon = Game.box[self.idx];
      if (Game.party.length < 6) {
        Game.box.splice(self.idx, 1);
        Game.party.push(mon);
        Dialogue.show([Rules.nameOf(mon) + "を\nパーティに いれた!"]);
      } else {
        G.push(new PartyScene("select", function (pi) {
          if (pi < 0) return;
          if (Rules.aliveCount() === 1 && Game.party[pi].curHP > 0 && mon.curHP <= 0) {
            Dialogue.show(["たたかえる モンスターが\nいなくなってしまう!"]);
            return;
          }
          var out = Game.party[pi];
          Game.party[pi] = mon;
          Game.box[self.idx] = out;
          Dialogue.show([Rules.nameOf(mon) + "と " + Rules.nameOf(out) + "を\nいれかえた!"]);
        }, { title: "だれと いれかえる?" }));
      }
    });
  }
};
BoxScene.prototype.draw = function (c) {
  c.fillStyle = "#33691e";
  c.fillRect(0, 0, G.W, G.H);
  G.textOutlined(c, "モンスターボックス", 24, 16, 28, "#fff", "#222238");
  G.panel(c, 20, 64, G.W - 40, 490);
  if (Game.box.length === 0) {
    G.text(c, "ボックスは からっぽだ", 50, 100, 22, "#666");
    return;
  }
  c.imageSmoothingEnabled = false;
  var visible = 9;
  var start = Math.max(0, Math.min(this.idx - 4, Game.box.length - visible));
  for (var i = start; i < Math.min(Game.box.length, start + visible); i++) {
    var m = Game.box[i];
    var y = 84 + (i - start) * 52;
    if (i === this.idx) {
      c.fillStyle = "#fff8dc";
      c.fillRect(34, y - 4, G.W - 68, 48);
    }
    var mc = SpriteLib.monsterCanvas(m.species);
    c.drawImage(mc, 44, y, 40, 40);
    G.text(c, Rules.nameOf(m), 100, y + 8, 21, "#222238");
    G.text(c, "Lv" + m.level, 320, y + 8, 21, "#444");
  }
};

// ---------- バッジ ----------
function BadgeScene() {}
BadgeScene.prototype.update = function () {
  if (Input.p("b") || Input.p("a")) { Audio2.sfx.cancel(); G.pop(); }
};
BadgeScene.prototype.draw = function (c) {
  c.fillStyle = "#263238";
  c.fillRect(0, 0, G.W, G.H);
  G.textOutlined(c, "ジムバッジ", 24, 16, 30, "#fff", "#222238");
  G.panel(c, 60, 100, 520, 340);
  var badges = [
    { flag: "badge1", name: "ロックバッジ", color: "#b8a038" },
    { flag: "badge2", name: "スパークバッジ", color: "#f8d030" },
    { flag: "badge3", name: "ファントムバッジ", color: "#705898" }
  ];
  for (var i = 0; i < badges.length; i++) {
    var x = 140 + i * 160, y = 180;
    var has = Game.flags[badges[i].flag];
    c.save();
    c.translate(x, y);
    c.fillStyle = has ? badges[i].color : "#455a64";
    c.beginPath();
    for (var p = 0; p < 8; p++) {
      var ang = p * Math.PI / 4 - Math.PI / 8;
      var r = p % 2 ? 26 : 38;
      c[p ? "lineTo" : "moveTo"](Math.cos(ang) * r, Math.sin(ang) * r);
    }
    c.closePath(); c.fill();
    if (has) {
      c.fillStyle = "#fff";
      c.beginPath(); c.arc(-8, -10, 7, 0, 7); c.fill();
    }
    c.restore();
    G.text(c, has ? badges[i].name : "？？？", x, y + 60, 18, has ? "#222238" : "#90a4ae", "center");
  }
  if (Game.flags.champion) {
    G.text(c, "★ チャンピオン ★", 320, 360, 28, "#e6a817", "center");
  }
};

// ---------- せってい ----------
function SettingsScene() { this.idx = 0; }
SettingsScene.prototype.update = function () {
  if (Input.p("b")) { Audio2.sfx.cancel(); G.pop(); return; }
  if (Input.p("down") || Input.p("up")) { this.idx = 1 - this.idx; Audio2.sfx.select(); }
  if (Input.p("a") || Input.p("left") || Input.p("right")) {
    Audio2.sfx.confirm();
    if (this.idx === 0) {
      Game.settings.bgm = !Game.settings.bgm;
      Audio2.setEnabled(Game.settings.bgm);
    } else {
      Game.settings.textSpeed = (Game.settings.textSpeed + 1) % 3;
    }
  }
};
SettingsScene.prototype.draw = function (c) {
  c.fillStyle = "#37474f";
  c.fillRect(0, 0, G.W, G.H);
  G.textOutlined(c, "せってい", 24, 16, 30, "#fff", "#222238");
  G.panel(c, 80, 120, 480, 220);
  var rows = [
    ["おんがく", Game.settings.bgm ? "ON" : "OFF"],
    ["テキストそくど", ["ふつう", "はやい", "いっしゅん"][Game.settings.textSpeed]]
  ];
  for (var i = 0; i < rows.length; i++) {
    var y = 160 + i * 70;
    if (i === this.idx) {
      c.fillStyle = "#e53935";
      c.beginPath();
      c.moveTo(104, y + 3); c.lineTo(104, y + 23); c.lineTo(118, y + 13);
      c.fill();
    }
    G.text(c, rows[i][0], 130, y, 23, "#222238");
    G.text(c, rows[i][1], 520, y, 23, "#1565c0", "right");
  }
  G.text(c, "Bボタンで もどる", 320, 380, 19, "#90a4ae", "center");
};
