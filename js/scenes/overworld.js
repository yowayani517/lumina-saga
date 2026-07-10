// フィールドシーン: マップ描画 / 移動 / NPC / ワープ / エンカウント
function OverworldScene() {
  this.moving = false;
  this.moveFrom = null;
  this.moveProg = 0;
  this.walkFrame = 0;
  this.busy = false; // イベント中
}

OverworldScene.prototype.enter = function () {
  this.mapDef = MAPS[Game.map];
  Audio2.play(this.mapDef.music || "town");
};
OverworldScene.prototype.resume = function () {
  this.mapDef = MAPS[Game.map];
  var bgm = this.mapDef.music || "town";
  if (Audio2.currentTrack() !== bgm) Audio2.play(bgm);
};

OverworldScene.prototype.tileAt = function (x, y) {
  var rows = this.mapDef.tiles;
  if (y < 0 || y >= rows.length || x < 0 || x >= rows[0].length) return "T";
  return rows[y][x];
};

OverworldScene.prototype.npcAt = function (x, y) {
  var npcs = this.mapDef.npcs || [];
  for (var i = 0; i < npcs.length; i++) {
    var n = npcs[i];
    if (!this.npcVisible(n)) continue;
    if (n.x === x && n.y === y) return n;
  }
  return null;
};
OverworldScene.prototype.npcVisible = function (n) {
  if (n.flagRequired && !Game.flags[n.flagRequired]) return false;
  if (n.hideIfFlag && Game.flags[n.hideIfFlag]) return false;
  return true;
};

OverworldScene.prototype.passable = function (x, y) {
  var t = this.tileAt(x, y);
  if (!SpriteLib.WALKABLE[t]) return false;
  if (this.npcAt(x, y)) return false;
  return true;
};

OverworldScene.prototype.warpAt = function (x, y) {
  var ws = this.mapDef.warps || [];
  for (var i = 0; i < ws.length; i++) {
    if (ws[i].x === x && ws[i].y === y) return ws[i];
  }
  return null;
};

OverworldScene.prototype.update = function (dt) {
  if (this.flashT > 0) {
    this.flashT -= dt;
    if (this.flashT <= 0 && this.pendingBattle) {
      var pb = this.pendingBattle;
      this.pendingBattle = null;
      pb();
    }
    return;
  }
  if (this.busy) return;

  if (this.moving) {
    var spd = this.dashing ? 9.0 : 5.4;
    this.moveProg += dt * spd;
    this.walkFrame += dt * (this.dashing ? 16 : 10);
    if (this.moveProg >= 1) {
      this.moving = false;
      this.moveProg = 0;
      this.onStepComplete();
    }
    return;
  }

  if (Input.p("start")) {
    Audio2.sfx.confirm();
    G.push(new MenuScene());
    return;
  }
  if (Input.p("a")) {
    this.tryInteract();
    return;
  }

  var dir = null;
  if (Input.h("up")) dir = "up";
  else if (Input.h("down")) dir = "down";
  else if (Input.h("left")) dir = "left";
  else if (Input.h("right")) dir = "right";
  if (!dir) { this.walkFrame = 0; return; }

  Game.dir = dir;
  this.dashing = Input.h("b");   // Xボタンホールドでダッシュ
  var d = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] }[dir];
  var nx = Game.x + d[0], ny = Game.y + d[1];
  if (this.passable(nx, ny)) {
    this.moving = true;
    this.moveFrom = { x: Game.x, y: Game.y };
    Game.x = nx; Game.y = ny;
  } else {
    var n = this.npcAt(nx, ny);
    if (!n && Math.random() < 0.08) Audio2.sfx.bump();
  }
};

OverworldScene.prototype.onStepComplete = function () {
  var w = this.warpAt(Game.x, Game.y);
  if (w) { this.doWarp(w); return; }

  var t = this.tileAt(Game.x, Game.y);
  if (t === "G" && this.mapDef.encounters && this.mapDef.encounters.length) {
    if (Math.random() < (this.mapDef.encounterRate || 0.12)) {
      // レア/でんせつ テーブル判定 (低確率)
      var rl = this.mapDef.rareEncounters;
      if (rl && rl.length && Math.random() < (this.mapDef.rareChance || 0.05)) {
        this.startWildBattle(true);
      } else {
        this.startWildBattle(false);
      }
    }
  }
};

OverworldScene.prototype.doWarp = function (w) {
  var self = this;
  this.busy = true;
  Audio2.sfx.door();
  G.fadeOut(280).then(function () {
    Game.map = w.to;
    Game.x = w.tx; Game.y = w.ty;
    self.mapDef = MAPS[Game.map];
    var bgm = self.mapDef.music || "town";
    if (Audio2.currentTrack() !== bgm) Audio2.play(bgm);
    G.fadeIn(280).then(function () { self.busy = false; });
  });
};

OverworldScene.prototype.pickEncounter = function (rare) {
  var list = rare ? this.mapDef.rareEncounters : this.mapDef.encounters;
  var total = 0;
  list.forEach(function (e) { total += e.weight; });
  var r = Math.random() * total;
  for (var i = 0; i < list.length; i++) {
    r -= list[i].weight;
    if (r <= 0) {
      var lv = list[i].min + Math.floor(Math.random() * (list[i].max - list[i].min + 1));
      return Rules.newMon(list[i].species, lv);
    }
  }
  var e0 = list[0];
  return Rules.newMon(e0.species, e0.min);
};

OverworldScene.prototype.startWildBattle = function (rare) {
  var self = this;
  this.busy = true;
  var wild = this.pickEncounter(rare);
  var special = null;
  if (rare) {
    special = MONSTERS[wild.species].legendary ? "legend" : "rare";
  }
  Rules.markDex(wild.species, false);
  Audio2.sfx.encounter();
  this.flashT = special ? 1.3 : 0.6;
  this.flashKind = special;
  this.pendingBattle = function () {
    startBattle({ kind: "wild", enemy: [wild], special: special }).then(function (result) {
      self.afterBattle(result, null);
    });
  };
};

OverworldScene.prototype.afterBattle = function (result, trainerNpc) {
  var self = this;
  var chain = Promise.resolve();

  if (result === "lose") {
    chain = chain.then(function () {
      return Dialogue.show(["ユウは めのまえが\nまっくらに なった!"]);
    }).then(function () {
      return G.fadeOut(500);
    }).then(function () {
      Game.money = Math.max(0, Math.floor(Game.money / 2));
      Rules.healParty();
      var lh = Game.lastHeal || { map: GAME_START.map, x: GAME_START.x, y: GAME_START.y };
      Game.map = lh.map; Game.x = lh.x; Game.y = lh.y; Game.dir = "down";
      self.mapDef = MAPS[Game.map];
      Audio2.play(self.mapDef.music || "town");
      return G.fadeIn(500);
    });
  } else if (result === "win" && trainerNpc) {
    var tr = trainerNpc.trainer;
    chain = chain.then(function () {
      Game.money += tr.reward;
      var pages = (tr.afterDialogue || []).slice(0, 1);
      pages.push("しょうきん " + tr.reward + "えん\nてにいれた!");
      return Dialogue.show(pages);
    }).then(function () {
      if (tr.flagSet) {
        Game.flags[tr.flagSet] = true;
        if (tr.flagSet.indexOf("badge") === 0) {
          Audio2.sfx.levelup();
          return Dialogue.show(["ユウは " + badgeName(tr.flagSet) + "を\nてにいれた!"]);
        }
        if (tr.flagSet === "champion") {
          return G.fadeOut(800).then(function () {
            G.replace(new EndingScene());
          });
        }
      }
    });
  }
  chain.then(function () { self.busy = false; });
};

function badgeName(flag) {
  return { badge1: "ロックバッジ", badge2: "スパークバッジ", badge3: "ファントムバッジ" }[flag] || "バッジ";
}

OverworldScene.prototype.tryInteract = function () {
  var d = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] }[Game.dir];
  var n = this.npcAt(Game.x + d[0], Game.y + d[1]);
  if (!n) return;
  var self = this;
  this.busy = true;

  // おちているアイテム
  if (n.item) {
    Audio2.sfx.levelup();
    Rules.addItem(n.item, 1);
    if (n.trainer && n.trainer.flagSet) Game.flags[n.trainer.flagSet] = true;
    if (n.flagSetOnTalk) Game.flags[n.flagSetOnTalk] = true;
    if (n.hideIfFlag) Game.flags[n.hideIfFlag] = true;
    Dialogue.show(["ユウは " + ITEMS[n.item].name + "を\nひろった!"]).then(function () {
      self.busy = false;
    });
    return;
  }

  // シンボルエンカウント (でんせつ など)
  if (n.wildBattle && !Game.flags[n.wildBattle.flagSet]) {
    var wb = n.wildBattle;
    var mon = Rules.newMon(wb.species, wb.level);
    Rules.markDex(mon.species, false);
    Dialogue.show(n.dialogue || ["……!"]).then(function () {
      Audio2.sfx.encounter();
      self.flashT = 1.3;
      self.flashKind = "legend";
      self.pendingBattle = function () {
        startBattle({ kind: "wild", enemy: [mon], special: "legend", noRun: true }).then(function (result) {
          if (result === "win" || result === "catch") {
            Game.flags[wb.flagSet] = true;
            var after = result === "catch"
              ? (wb.caughtDialogue || null)
              : ["……モンスターは ひかりに つつまれて\nきえてしまった。"];
            if (after) {
              Dialogue.show(after).then(function () { self.busy = false; });
              return;
            }
          }
          self.afterBattle(result, null);
        });
      };
    });
    return;
  }

  // トレーナー
  var beatKey = "beat_" + Game.map + "_" + n.id;
  if (n.trainer && !Game.flags[beatKey]) {
    var tr = n.trainer;
    Dialogue.show(tr.introDialogue || ["しょうぶだ!"]).then(function () {
      return startBattle({
        kind: "trainer",
        trainerName: tr.name,
        portrait: tr.portrait,
        enemy: Rules.resolveTrainerParty(tr.party),
        defeatDialogue: tr.defeatDialogue,
        isGym: !!(tr.flagSet && (tr.flagSet.indexOf("badge") === 0 || tr.flagSet === "champion"))
      });
    }).then(function (result) {
      if (result === "win") Game.flags[beatKey] = true;
      self.afterBattle(result, n);
    });
    return;
  }

  // つうじょうかいわ
  var lines = n.dialogue || ["……"];
  if (n.altDialogue && Game.flags[n.altDialogue.flag]) lines = n.altDialogue.lines;
  if (n.trainer && Game.flags[beatKey] && n.trainer.afterDialogue) lines = n.trainer.afterDialogue;

  var p = Dialogue.show(lines);

  if (n.heal) {
    p = p.then(function () {
      Audio2.sfx.heal();
      Rules.healParty();
      Game.lastHeal = { map: Game.map, x: Game.x, y: Game.y };
      return Dialogue.show(["モンスターたちは\nげんきいっぱいに なった!"]);
    });
  }
  if (n.shop) {
    p = p.then(function () {
      return new Promise(function (res) {
        G.push(new ShopScene(n.shop, res));
      });
    });
  }
  if (n.starter && !Game.flags.starter) {
    p = p.then(function () {
      return new Promise(function (res) {
        G.push(new StarterScene(res));
      });
    });
  }
  p.then(function () { self.busy = false; });
};


OverworldScene.prototype.draw = function (c) {
  var TILE = SpriteLib.TILE;
  var map = this.mapDef;
  var rows = map.tiles;
  var mw = rows[0].length, mh = rows.length;
  var f = G.frameCount();

  // プレイヤーのピクセル位置(移動補間)
  var px = Game.x, py = Game.y;
  if (this.moving) {
    px = this.moveFrom.x + (Game.x - this.moveFrom.x) * this.moveProg;
    py = this.moveFrom.y + (Game.y - this.moveFrom.y) * this.moveProg;
  }

  // カメラ
  var camX = px * TILE + TILE / 2 - G.W / 2;
  var camY = py * TILE + TILE / 2 - G.H / 2;
  camX = Math.max(0, Math.min(mw * TILE - G.W, camX));
  camY = Math.max(0, Math.min(mh * TILE - G.H, camY));
  if (mw * TILE < G.W) camX = (mw * TILE - G.W) / 2;
  if (mh * TILE < G.H) camY = (mh * TILE - G.H) / 2;
  camX = Math.round(camX); camY = Math.round(camY);

  // タイル
  var x0 = Math.max(0, Math.floor(camX / TILE));
  var y0 = Math.max(0, Math.floor(camY / TILE));
  var x1 = Math.min(mw - 1, Math.ceil((camX + G.W) / TILE));
  var y1 = Math.min(mh - 1, Math.ceil((camY + G.H) / TILE));
  var bgFill = "#000";
  if (map.outdoor) {
    if (map.theme === "ghost") bgFill = "#10081c";
    else if (map.theme === "electric") bgFill = "#0e1528";
    else if (map.theme === "rock") bgFill = "#1a1610";
    else bgFill = "#1a1430";
  } else if (map.theme === "champion") bgFill = "#1a0808";
  else if (map.theme === "ghost") bgFill = "#0a0614";
  else if (map.theme === "hospital") bgFill = "#e8eef2";
  c.fillStyle = bgFill;
  c.fillRect(0, 0, G.W, G.H);
  for (var y = y0; y <= y1; y++) {
    for (var x = x0; x <= x1; x++) {
      SpriteLib.drawTile(c, rows[y][x], x * TILE - camX, y * TILE - camY, f, map.outdoor, map.theme);
    }
  }

  // 一棟として制作した施設スプライト。タイルの反復ではなく完成した建築を描く。
  c.imageSmoothingEnabled = false;
  var landmarks = map.landmarks || [];
  for (var li = 0; li < landmarks.length; li++) {
    var landmark = landmarks[li];
    var landmarkImage = SpriteLib.getImage(landmark.image);
    if (!landmarkImage) continue;
    var landmarkWidth = landmark.w || landmarkImage.width;
    var landmarkHeight = landmark.h || landmarkImage.height;
    var landmarkX = landmark.x * TILE + TILE / 2 - landmarkWidth / 2 - camX;
    var landmarkY = landmark.y * TILE - landmarkHeight - camY;
    if (landmarkX > G.W || landmarkY > G.H ||
        landmarkX + landmarkWidth < 0 || landmarkY + landmarkHeight < 0) continue;
    c.drawImage(landmarkImage, Math.round(landmarkX), Math.round(landmarkY),
      landmarkWidth, landmarkHeight);
  }

  // NPC + プレイヤー を足元Y座標でソートして描画 (Y-sort: 奥行きが正しく重なるように)
  c.imageSmoothingEnabled = false;
  var npcs = map.npcs || [];
  var drawables = [];
  for (var i = 0; i < npcs.length; i++) {
    var n = npcs[i];
    if (!this.npcVisible(n)) continue;
    var nx = n.x * TILE - camX, ny = n.y * TILE - camY;
    if (nx < -TILE || ny < -TILE || nx > G.W || ny > G.H) continue;
    drawables.push({ y: n.y, nx: nx, ny: ny, n: n });
  }
  var animFrame = this.moving ? Math.floor(this.walkFrame) : 0;
  var hx = Math.round(px * TILE - camX), hy = Math.round(py * TILE - camY);
  drawables.push({ y: py, hero: true, hx: hx, hy: hy });
  drawables.sort(function (a, b) { return a.y - b.y; });

  for (var j = 0; j < drawables.length; j++) {
    var dr = drawables[j];
    if (dr.hero) {
      SpriteLib.drawHero(c, Game.dir, animFrame, this.moving && this.dashing, dr.hx, dr.hy);
      continue;
    }
    var n2 = dr.n, nx2 = dr.nx, ny2 = dr.ny;
    if (n2.monster) {
      // シンボルエンカウント: モンスターが その場に いる (ふわふわ + ひかり)
      var mcv = SpriteLib.monsterCanvas(n2.monster);
      var bobY = Math.sin(f * 0.06) * 4;
      var glow = 0.25 + Math.abs(Math.sin(f * 0.04)) * 0.3;
      c.save();
      c.globalAlpha = glow;
      c.fillStyle = "#cfe8ff";
      c.beginPath();
      c.ellipse(nx2 + 16, ny2 + 30, 26, 9, 0, 0, 7);
      c.fill();
      c.restore();
      c.drawImage(mcv, nx2 - 14, ny2 - 28 + bobY, 60, 60);
    } else if (n2.sprite === "ball") {
      SpriteLib.drawBall(c, nx2, ny2);
    } else if (n2.sprite === "sign") {
      var sg = SpriteLib.npcCanvas("sign");
      c.drawImage(sg, 0, 0, 16, 16, nx2, ny2 - 8, 32, 40);
    } else {
      SpriteLib.drawNPCImg(c, n2.sprite || "man", nx2, ny2, n2.dir);
    }
  }

  // 木の樹冠を前景レイヤーとして再描画。
  // 木の北側にいるキャラクターは葉に隠れ、木の中に乗って見えない。
  for (var fy = y0; fy <= y1; fy++) {
    for (var fx = x0; fx <= x1; fx++) {
      SpriteLib.drawForegroundTile(c, rows[fy][fx], fx * TILE - camX, fy * TILE - camY);
    }
  }

  // マップ名(入って数秒)
  if (!this._nameT) this._nameT = {};
  if (this._lastMap !== Game.map) { this._lastMap = Game.map; this._nameShow = 2.5; }
  if (this._nameShow > 0) {
    this._nameShow -= 1 / 60;
    G.panel(c, 12, 12, 260, 52);
    G.text(c, map.name, 32, 26, 24, "#222238");
  }

  // エンカウントフラッシュ
  if (this.flashT > 0) {
    if (this.flashKind) {
      // レア/でんせつ専用: 金色(or紫)の放射光 + 高速フラッシュ
      var gold = this.flashKind === "legend" ? "rgba(190,140,255," : "rgba(255,215,80,";
      var on2 = Math.floor(this.flashT * 16) % 2 === 0;
      c.fillStyle = on2 ? gold + "0.9)" : "rgba(255,255,255,0.95)";
      c.fillRect(0, 0, G.W, G.H);
      c.save();
      c.translate(G.W / 2, G.H / 2);
      c.rotate(this.flashT * 4);
      c.fillStyle = on2 ? "rgba(255,255,255,0.7)" : gold + "0.7)";
      for (var rj = 0; rj < 12; rj++) {
        c.rotate(Math.PI / 6);
        c.beginPath();
        c.moveTo(0, 0); c.lineTo(-30, 460); c.lineTo(30, 460);
        c.fill();
      }
      c.restore();
      G.textOutlined(c, this.flashKind === "legend" ? "!!! でんせつの けはい !!!" : "★ レアモンスター ★",
        G.W / 2, G.H / 2 - 20, 38, "#fff", this.flashKind === "legend" ? "#5b2a91" : "#a06b00", "center");
    } else {
      var on = Math.floor(this.flashT * 12) % 2 === 0;
      c.fillStyle = on ? "rgba(255,255,255,0.85)" : "rgba(0,0,0,0.6)";
      c.fillRect(0, 0, G.W, G.H);
    }
  }
};

// バトル開始ヘルパ (battle.js の BattleScene を起動)
function startBattle(opts) {
  return new Promise(function (resolve) {
    G.push(new BattleScene(opts, resolve));
  });
}
