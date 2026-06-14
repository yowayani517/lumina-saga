// バトルシーン: ターン制バトル / 捕獲 / 経験値 / AI
var STRUGGLE = { name: "わるあがき", type: "normal", category: "physical", power: 50, accuracy: 100, pp: 1, priority: 0, effect: { kind: "recoil", ratio: 0.25 } };

function BattleScene(opts, resolve) {
  this.opts = opts;
  this.resolve = resolve;
  this.kind = opts.kind;
  this.enemyParty = opts.enemy;
  this.enemyIdx = 0;
  this.playerIdx = Rules.firstAlive();
  this.pStages = {}; this.eStages = {};
  this.sleepTurns = { p: 0, e: 0 };
  this.turn = 0;

  // 表示状態
  this.msg = "";
  this.msgChars = 0;
  this.ui = "none";          // none | menu | moves
  this.menuIdx = 0;
  this.moveIdx = 0;
  this.pOff = { x: -400, y: 0 };  // スプライトオフセット(イントロ用)
  this.eOff = { x: 400, y: 0 };
  this.pFlash = 0; this.eFlash = 0;
  this.shake = 0;
  this.pHPShow = null; this.eHPShow = null;
  this.expShow = null;
  this.ballAnim = null;
  this.ended = false;
  this.t = 0;

  this._aResolve = null;
  this._menuResolve = null;
}

BattleScene.prototype.enter = function () {
  Audio2.play(this.kind === "wild" ? "battle" : "trainerbattle");
  this.pHPShow = this.pMon().curHP;
  this.eHPShow = this.eMon().curHP;
  this.expShow = this.expRatio();
  Rules.markDex(this.eMon().species, false);
  this.script().catch(function (e) { console.error("battle error", e); });
};

BattleScene.prototype.pMon = function () { return Game.party[this.playerIdx]; };
BattleScene.prototype.pMonRef = function () { return Game.party[this.playerIdx]; };
BattleScene.prototype.eMon = function () { return this.enemyParty[this.enemyIdx]; };
BattleScene.prototype.pStats = function () { return Rules.statsOf(this.pMon()); };
BattleScene.prototype.eStats = function () { return Rules.statsOf(this.eMon()); };
BattleScene.prototype.expRatio = function () {
  var m = this.pMon();
  var cur = Rules.expForLevel(m.level), next = Rules.expForLevel(m.level + 1);
  return Math.max(0, Math.min(1, (m.exp - cur) / (next - cur)));
};

// ---------- 非同期ヘルパ ----------
BattleScene.prototype.say = function (text, hold) {
  var self = this;
  this.msg = text;
  this.msgChars = 0;
  return new Promise(function (res) {
    self._sayDone = res;
    self._sayHold = !!hold;
  });
};
BattleScene.prototype.pause = function (ms) { return G.wait(ms); };

BattleScene.prototype.openMenu = function (options) {
  var self = this;
  this.ui = "menu";
  this.menuIdx = 0;
  return new Promise(function (res) { self._menuResolve = res; });
};
BattleScene.prototype.openMoves = function () {
  var self = this;
  this.ui = "moves";
  this.moveIdx = 0;
  return new Promise(function (res) { self._menuResolve = res; });
};

// ---------- メインスクリプト ----------
BattleScene.prototype.script = async function () {
  var self = this;
  // イントロ: スライドイン
  await this.animate(600, function (k) {
    self.pOff.x = -400 * (1 - k);
    self.eOff.x = 400 * (1 - k);
  });
  if (this.kind === "wild") {
    if (this.opts.special === "legend") {
      this.shake = 0.9;
      Audio2.sfx.encounter();
      await this.say("ぜんしんが ふるえる……!");
      this.shake = 0.5;
      await this.say("でんせつのモンスター\n" + Rules.nameOf(this.eMon()) + "が あらわれた!!");
    } else if (this.opts.special === "rare") {
      Audio2.sfx.levelup();
      await this.say("★ かがやく けはい……!\nレアモンスターだ!!");
      await this.say("やせいの " + Rules.nameOf(this.eMon()) + "が\nあらわれた!");
    } else {
      await this.say("やせいの " + Rules.nameOf(this.eMon()) + "が\nあらわれた!");
    }
  } else {
    if (this.opts.portrait) this.portraitOn = true;
    await this.say(this.opts.trainerName + "が\nしょうぶを しかけてきた!");
    this.portraitOn = false;
    await this.say(this.opts.trainerName + "は\n" + Rules.nameOf(this.eMon()) + "を くりだした!");
  }
  await this.say("ゆけっ! " + Rules.nameOf(this.pMon()) + "!");

  // メインループ
  while (!this.ended) {
    this.turn++;
    var action = await this.playerTurnInput();
    if (this.ended) break;
    await this.executeTurn(action);
  }
};

// プレイヤーの行動選択。戻り値 {type:"move",move} {type:"switch",to} {type:"item",id} {type:"run"} {type:"none"}
BattleScene.prototype.playerTurnInput = async function () {
  var self = this;
  while (true) {
    this.msg = Rules.nameOf(this.pMon()) + "は\nどうする?";
    this.msgChars = 999;
    var sel = await this.openMenu();
    if (sel === 0) { // たたかう
      var mi = await this.openMoves();
      if (mi === -1) continue;
      var mv = this.pMon().moves[mi];
      var usable = this.pMon().moves.some(function (m) { return m.pp > 0; });
      if (!usable) return { type: "move", move: STRUGGLE, slot: null };
      if (mv.pp <= 0) {
        await this.say("わざの PPが ない!");
        continue;
      }
      return { type: "move", move: MOVES[mv.id], slot: mv };
    }
    if (sel === 1) { // バッグ
      var itemId = await new Promise(function (res) { G.push(new BagScene("battle", res)); });
      if (!itemId) continue;
      var item = ITEMS[itemId];
      if (item.kind === "ball") {
        if (this.kind !== "wild") {
          await this.say("ひとの モンスターに\nなげては いけない!");
          continue;
        }
        return { type: "ball", id: itemId };
      }
      // かいふくアイテム
      var pi = await new Promise(function (res) {
        G.push(new PartyScene("select", res, { title: "だれに つかう?" }));
      });
      if (pi < 0) continue;
      var target = Game.party[pi];
      var ts = Rules.statsOf(target);
      if (item.kind === "heal" && target.curHP > 0 && target.curHP < ts.hp) {
        target.curHP = Math.min(ts.hp, target.curHP + item.amount);
        Rules.removeItem(itemId);
        Audio2.sfx.heal();
        if (pi === this.playerIdx) this.pHPShow = target.curHP;
        return { type: "item", text: Rules.nameOf(target) + "の HPが かいふくした!" };
      } else if (item.kind === "status" && target.status && target.curHP > 0) {
        target.status = null;
        Rules.removeItem(itemId);
        Audio2.sfx.heal();
        return { type: "item", text: Rules.nameOf(target) + "は げんきに なった!" };
      } else if (item.kind === "revive" && target.curHP <= 0) {
        target.curHP = Math.floor(ts.hp / 2);
        Rules.removeItem(itemId);
        Audio2.sfx.heal();
        return { type: "item", text: Rules.nameOf(target) + "は めを さました!" };
      } else {
        await this.say("こうかが なさそうだ。");
        continue;
      }
    }
    if (sel === 2) { // モンスター
      var si = await new Promise(function (res) {
        G.push(new PartyScene("select", res, { title: "だれと いれかえる?" }));
      });
      if (si < 0) continue;
      if (si === this.playerIdx) { await this.say("すでに たたかっている!"); continue; }
      if (Game.party[si].curHP <= 0) { await this.say("ひんしの モンスターは\nたたかえない!"); continue; }
      return { type: "switch", to: si };
    }
    if (sel === 3) { // にげる
      if (this.kind !== "wild") {
        await this.say("トレーナーせんから\nにげられない!");
        continue;
      }
      var pSpe = Rules.effStat(this.pMon(), this.pStats(), "spe", this.pStages);
      var eSpe = Rules.effStat(this.eMon(), this.eStats(), "spe", this.eStages);
      var chance = pSpe >= eSpe ? 0.9 : 0.45 + 0.12 * this.turn;
      if (Math.random() < chance) {
        Audio2.sfx.cancel();
        await this.say("うまく にげきれた!");
        return await this.endBattle("run");
      }
      return { type: "runfail" };
    }
  }
};

BattleScene.prototype.executeTurn = async function (action) {
  var self = this;
  var eMove = this.enemyPickMove();

  if (action.type === "switch") {
    await this.switchPlayerMon(action.to);
  } else if (action.type === "item") {
    await this.say(action.text);
  } else if (action.type === "ball") {
    var done = await this.throwBall(action.id);
    if (done) return;
  } else if (action.type === "runfail") {
    await this.say("にげられなかった!");
  }

  if (action.type === "move") {
    var pMoveDef = action.move;
    var pPri = pMoveDef.priority || 0;
    var ePri = eMove.def.priority || 0;
    var pSpe = Rules.effStat(this.pMon(), this.pStats(), "spe", this.pStages);
    var eSpe = Rules.effStat(this.eMon(), this.eStats(), "spe", this.eStages);
    var playerFirst = pPri !== ePri ? pPri > ePri : pSpe === eSpe ? Math.random() < 0.5 : pSpe > eSpe;

    var order = playerFirst ? ["p", "e"] : ["e", "p"];
    for (var i = 0; i < order.length; i++) {
      if (this.ended) return;
      if (order[i] === "p") {
        if (this.pMon().curHP <= 0) continue;
        await this.useMove("p", pMoveDef, action.slot);
      } else {
        if (this.eMon().curHP <= 0) continue;
        await this.useMove("e", eMove.def, eMove.slot);
      }
      if (await this.checkFaints()) return;
    }
  } else {
    // プレイヤーが攻撃しないターン: てきだけ こうどう
    if (this.eMon().curHP > 0) {
      await this.useMove("e", eMove.def, eMove.slot);
      if (await this.checkFaints()) return;
    }
  }

  // ターンエンド: どく/やけど
  for (var s = 0; s < 2; s++) {
    var side = s === 0 ? "p" : "e";
    var mon = side === "p" ? this.pMon() : this.eMon();
    if (mon.curHP <= 0) continue;
    var stats = side === "p" ? this.pStats() : this.eStats();
    if (mon.status === "psn" || mon.status === "brn") {
      var d = Math.max(1, Math.floor(stats.hp / (mon.status === "psn" ? 8 : 16)));
      mon.curHP = Math.max(0, mon.curHP - d);
      Audio2.sfx.weakhit();
      await this.animateHP(side);
      await this.say(Rules.nameOf(mon) + "は " + Rules.STATUS_NAME[mon.status] + "の\nダメージを うけている!");
      if (await this.checkFaints()) return;
    }
  }
};

// ---------- わざ実行 ----------
BattleScene.prototype.useMove = async function (side, moveDef, slot) {
  var self = this;
  var attacker = side === "p" ? this.pMon() : this.eMon();
  var defender = side === "p" ? this.eMon() : this.pMon();
  var aStats = side === "p" ? this.pStats() : this.eStats();
  var dStats = side === "p" ? this.eStats() : this.pStats();
  var aStages = side === "p" ? this.pStages : this.eStages;
  var dStages = side === "p" ? this.eStages : this.pStages;
  var aName = (side === "e" ? "てきの " : "") + Rules.nameOf(attacker);
  var dName = (side === "p" ? "てきの " : "") + Rules.nameOf(defender);

  // ねむり
  if (attacker.status === "slp") {
    var key = side === "p" ? "p" : "e";
    if (this.sleepTurns[key] > 0) {
      this.sleepTurns[key]--;
      await this.say(aName + "は\nぐうぐう ねむっている…");
      return;
    }
    attacker.status = null;
    await this.say(aName + "は\nめを さました!");
  }
  // まひ
  if (attacker.status === "par" && Math.random() < 0.25) {
    await this.say(aName + "は からだが しびれて\nうごけない!");
    return;
  }

  if (slot) slot.pp--;
  await this.say(aName + "の\n" + moveDef.name + "!");

  // めいちゅう
  if (Math.random() * 100 >= moveDef.accuracy) {
    await this.say("しかし はずれた!");
    return;
  }

  // こうげきアニメ
  var atkOff = side === "p" ? this.pOff : this.eOff;
  var dirX = side === "p" ? 40 : -40;
  await this.animate(180, function (k) {
    atkOff.x = Math.sin(k * Math.PI) * dirX;
  });

  var eff = 1;
  if (moveDef.power > 0) {
    var r = Rules.calcDamage(attacker, aStats, aStages, defender, dStats, dStages, moveDef);
    eff = r.eff;
    if (eff === 0) {
      await this.say(dName + "には\nこうかが ない みたいだ…");
      return;
    }
    defender.curHP = Math.max(0, defender.curHP - r.dmg);
    if (eff >= 2) { Audio2.sfx.superhit(); this.shake = 0.35; }
    else if (eff < 1) Audio2.sfx.weakhit();
    else Audio2.sfx.hit();
    if (side === "p") this.eFlash = 0.5; else this.pFlash = 0.5;
    await this.animateHP(side === "p" ? "e" : "p");
    if (r.crit) await this.say("きゅうしょに あたった!");
    if (eff >= 2) await this.say("こうかは ばつぐんだ!");
    else if (eff < 1) await this.say("こうかは いまひとつの ようだ…");

    var fx = moveDef.effect;
    if (fx) {
      if (fx.kind === "drain") {
        var heal = Math.max(1, Math.floor(r.dmg * fx.ratio));
        attacker.curHP = Math.min(aStats.hp, attacker.curHP + heal);
        await this.animateHP(side);
        await this.say(dName + "から\nたいりょくを すいとった!");
      } else if (fx.kind === "recoil") {
        var rec = Math.max(1, Math.floor(r.dmg * fx.ratio));
        attacker.curHP = Math.max(0, attacker.curHP - rec);
        await this.animateHP(side);
        await this.say(aName + "は\nはんどうで ダメージを うけた!");
      } else if (fx.kind === "status" && defender.curHP > 0 && !defender.status) {
        if (Math.random() * 100 < (fx.chance || 100)) {
          await this.applyStatus(defender, fx.status, dName, side === "p" ? "e" : "p");
        }
      } else if (fx.kind === "stat" && defender.curHP > 0) {
        if (Math.random() * 100 < (fx.chance || 100)) {
          await this.applyStatChange(fx, side, aName, dName);
        }
      }
    }
  } else {
    // へんかわざ
    var fx2 = moveDef.effect;
    if (!fx2) { await this.say("しかし なにも おこらない…"); return; }
    if (fx2.kind === "heal") {
      var amt = Math.floor(aStats.hp * fx2.ratio);
      if (attacker.curHP >= aStats.hp) { await this.say("しかし HPは まんたんだ!"); return; }
      attacker.curHP = Math.min(aStats.hp, attacker.curHP + amt);
      Audio2.sfx.heal();
      await this.animateHP(side);
      await this.say(aName + "は\nたいりょくを かいふくした!");
    } else if (fx2.kind === "status") {
      if (defender.status) { await this.say("しかし うまく きまらなかった!"); return; }
      await this.applyStatus(defender, fx2.status, dName, side === "p" ? "e" : "p");
    } else if (fx2.kind === "stat") {
      await this.applyStatChange(fx2, side, aName, dName);
    }
  }
};

BattleScene.prototype.applyStatus = async function (mon, status, name, sideKey) {
  mon.status = status;
  if (status === "slp") this.sleepTurns[sideKey] = 1 + Math.floor(Math.random() * 3);
  Audio2.sfx.statdown();
  var txt = { psn: "どくを あびた!", brn: "やけどを おった!", par: "からだが まひした!", slp: "ねむってしまった!" }[status];
  await this.say(name + "は\n" + txt);
};

BattleScene.prototype.applyStatChange = async function (fx, side, aName, dName) {
  var stages = fx.target === "self" ? (side === "p" ? this.pStages : this.eStages)
                                     : (side === "p" ? this.eStages : this.pStages);
  var name = fx.target === "self" ? aName : dName;
  var statName = { atk: "こうげき", def: "ぼうぎょ", spa: "とくこう", spdef: "とくぼう", spe: "すばやさ" }[fx.stat];
  var cur = stages[fx.stat] || 0;
  var next = Math.max(-6, Math.min(6, cur + fx.stages));
  if (next === cur) {
    await this.say(name + "の " + statName + "は\nもう かわらない!");
    return;
  }
  stages[fx.stat] = next;
  if (fx.stages > 0) Audio2.sfx.statup(); else Audio2.sfx.statdown();
  var amt = Math.abs(fx.stages) >= 2 ? "ぐーんと " : "";
  await this.say(name + "の " + statName + "が\n" + amt + (fx.stages > 0 ? "あがった!" : "さがった!"));
};

// ---------- ひんし処理 ----------
BattleScene.prototype.checkFaints = async function () {
  var self = this;
  if (this.eMon().curHP <= 0) {
    Audio2.sfx.faint();
    await this.animate(400, function (k) { self.eOff.y = k * 120; });
    await this.say("てきの " + Rules.nameOf(this.eMon()) + "は\nたおれた!");
    await this.gainExp();
    // つぎのてき
    var next = -1;
    for (var i = this.enemyIdx + 1; i < this.enemyParty.length; i++) {
      if (this.enemyParty[i].curHP > 0) { next = i; break; }
    }
    if (next >= 0) {
      this.enemyIdx = next;
      this.eStages = {};
      this.sleepTurns.e = 0;
      this.eHPShow = this.eMon().curHP;
      Rules.markDex(this.eMon().species, false);
      this.eOff.y = 0; this.eOff.x = 400;
      await this.say(this.opts.trainerName + "は\n" + Rules.nameOf(this.eMon()) + "を くりだした!");
      await this.animate(400, function (k) { self.eOff.x = 400 * (1 - k); });
      return false;
    }
    await this.winBattle();
    return true;
  }
  if (this.pMon().curHP <= 0) {
    Audio2.sfx.faint();
    await this.animate(400, function (k) { self.pOff.y = k * 140; });
    await this.say(Rules.nameOf(this.pMon()) + "は\nたおれた!");
    if (Rules.aliveCount() === 0) {
      if (this.kind === "trainer" && this.opts.defeatDialogue) {
        // まけたときのあいてのセリフはオーバーワールドがわで処理しない
      }
      await this.say("ユウは ぜんめつ してしまった…");
      await this.endBattle("lose");
      return true;
    }
    // つぎのモンスターをえらぶ(キャンセルふか)
    var si = -1;
    while (si < 0 || Game.party[si].curHP <= 0) {
      si = await new Promise(function (res) {
        G.push(new PartyScene("select", res, { title: "つぎは だれに する?" }));
      });
    }
    await this.switchPlayerMon(si, true);
    return false;
  }
  return false;
};

BattleScene.prototype.switchPlayerMon = async function (to, forced) {
  var self = this;
  if (!forced) {
    await this.say(Rules.nameOf(this.pMon()) + "\nもどれ!");
    await this.animate(250, function (k) { self.pOff.x = -300 * k; });
  }
  this.playerIdx = to;
  this.pStages = {};
  this.sleepTurns.p = 0;
  this.pHPShow = this.pMon().curHP;
  this.expShow = this.expRatio();
  this.pOff.x = -300; this.pOff.y = 0;
  await this.say("ゆけっ! " + Rules.nameOf(this.pMon()) + "!");
  await this.animate(300, function (k) { self.pOff.x = -300 * (1 - k); });
};

// ---------- けいけんち ----------
BattleScene.prototype.gainExp = async function () {
  var mon = this.pMon();
  if (mon.curHP <= 0) return;
  var gain = Rules.expGain(this.eMon(), this.kind === "trainer");
  mon.exp += gain;
  await this.say(Rules.nameOf(mon) + "は\nけいけんち " + gain + " を もらった!");
  await this.animateExp();

  while (mon.level < 100 && mon.exp >= Rules.expForLevel(mon.level + 1)) {
    var oldStats = Rules.statsOf(mon);
    mon.level++;
    var newStats = Rules.statsOf(mon);
    mon.curHP = Math.min(newStats.hp, mon.curHP + (newStats.hp - oldStats.hp));
    this.pHPShow = mon.curHP;
    Audio2.sfx.levelup();
    this.expShow = 0;
    await this.say(Rules.nameOf(mon) + "は\nレベル " + mon.level + "に あがった!");
    await this.animateExp();
    // あたらしいわざ
    var learn = MONSTERS[mon.species].learnset.filter(function (e) { return e.level === mon.level; });
    for (var i = 0; i < learn.length; i++) {
      await this.learnMove(mon, learn[i].move);
    }
  }
};

BattleScene.prototype.learnMove = async function (mon, moveId) {
  if (mon.moves.some(function (m) { return m.id === moveId; })) return;
  if (mon.moves.length < 4) {
    mon.moves.push({ id: moveId, pp: MOVES[moveId].pp });
    Audio2.sfx.levelup();
    await this.say(Rules.nameOf(mon) + "は\n" + MOVES[moveId].name + "を おぼえた!");
    return;
  }
  await this.say(Rules.nameOf(mon) + "は あたらしく\n" + MOVES[moveId].name + "を おぼえたい…");
  await this.say("しかし わざは 4つまでしか\nおぼえられない!");
  var opts = mon.moves.map(function (m) { return MOVES[m.id].name; }).concat(["あきらめる"]);
  var ci = await Dialogue.choice(opts, { cancelable: false, width: 280 });
  if (ci >= 0 && ci < 4) {
    var old = MOVES[mon.moves[ci].id].name;
    mon.moves[ci] = { id: moveId, pp: MOVES[moveId].pp };
    await this.say(old + "を わすれて\n" + MOVES[moveId].name + "を おぼえた!");
  } else {
    await this.say(MOVES[moveId].name + "を\nおぼえるのを あきらめた…");
  }
};

// ---------- カプセル ----------
BattleScene.prototype.throwBall = async function (itemId) {
  var self = this;
  Rules.removeItem(itemId);
  Audio2.sfx.throwBall();
  await this.say("ユウは " + ITEMS[itemId].name + "を\nなげた!");
  this.ballAnim = { phase: "fly", k: 0 };
  await this.animate(500, function (k) { self.ballAnim.k = k; });
  this.ballAnim = { phase: "shake", k: 0 };

  var result = Rules.catchCheck(this.eMon(), this.eStats(), ITEMS[itemId].ballMod);
  for (var i = 0; i < result.shakes; i++) {
    Audio2.sfx.shake();
    await this.animate(450, function (k) { self.ballAnim.k = Math.sin(k * Math.PI * 2) * (1 - k); });
    await this.pause(200);
  }
  if (result.success) {
    Audio2.sfx.catchOk();
    this.ballAnim = { phase: "done", k: 0 };
    var wild = this.eMon();
    await this.say("やったー!\n" + Rules.nameOf(wild) + "を つかまえた!");
    var dest = Rules.addMon(wild);
    if (dest === "box") {
      await this.say("パーティが いっぱいなので\nボックスへ おくられた!");
    }
    await this.endBattle("catch");
    return true;
  }
  this.ballAnim = null;
  Audio2.sfx.breakout();
  await this.say("ああっ!\n" + Rules.nameOf(this.eMon()) + "は でてきてしまった!");
  return false;
};

// ---------- しょうはい ----------
BattleScene.prototype.winBattle = async function () {
  Audio2.play("victory");
  if (this.kind === "trainer") {
    await this.say(this.opts.trainerName + "との\nしょうぶに かった!");
    if (this.opts.defeatDialogue) {
      await this.say(this.opts.defeatDialogue.join("\n").split("\n").slice(0, 2).join("\n"));
    }
  }
  await this.endBattle("win");
};

BattleScene.prototype.endBattle = async function (result) {
  this.ended = true;
  // しんか チェック (かち/つかまえたときのみ)
  if (result === "win" || result === "catch") {
    for (var i = 0; i < Game.party.length; i++) {
      var m = Game.party[i];
      var sp = MONSTERS[m.species];
      if (sp.evolvesTo && sp.evolveLevel && m.level >= sp.evolveLevel) {
        await new Promise(function (res) { G.push(new EvolutionScene(m, res)); });
      }
    }
  }
  var r = this.resolve;
  this.resolve = null;
  G.pop();
  if (r) r(result);
};

// ---------- 敵AI ----------
BattleScene.prototype.enemyPickMove = function () {
  var e = this.eMon();
  var usable = e.moves.filter(function (m) { return m.pp > 0; });
  if (usable.length === 0) return { def: STRUGGLE, slot: null };
  var self = this;
  var dmgMoves = [], otherMoves = [];
  usable.forEach(function (slot) {
    var def = MOVES[slot.id];
    if (def.power > 0) {
      var eff = typeMultiplier(def.type, MONSTERS[self.pMon().species].types);
      var stab = MONSTERS[e.species].types.indexOf(def.type) >= 0 ? 1.5 : 1;
      dmgMoves.push({ slot: slot, def: def, score: def.power * eff * stab * (def.accuracy / 100) * (0.8 + Math.random() * 0.4) });
    } else {
      otherMoves.push({ slot: slot, def: def });
    }
  });
  if (otherMoves.length && this.turn <= 2 && Math.random() < 0.45) {
    var o = otherMoves[Math.floor(Math.random() * otherMoves.length)];
    return o;
  }
  if (dmgMoves.length === 0) return otherMoves[Math.floor(Math.random() * otherMoves.length)];
  dmgMoves.sort(function (a, b) { return b.score - a.score; });
  return dmgMoves[0];
};

// ---------- アニメ/更新 ----------
BattleScene.prototype.animate = function (ms, fn) {
  // rAFが止まる環境でも進むよう タイマー駆動
  return new Promise(function (res) {
    var start = performance.now();
    var iv = setInterval(function () {
      var k = Math.min(1, (performance.now() - start) / ms);
      fn(k);
      if (k >= 1) { clearInterval(iv); res(); }
    }, 16);
  });
};
BattleScene.prototype.animateHP = function (side) {
  var self = this;
  return new Promise(function (res) {
    var check = setInterval(function () {
      var target = side === "p" ? self.pMon().curHP : self.eMon().curHP;
      var show = side === "p" ? self.pHPShow : self.eHPShow;
      if (Math.abs(show - target) < 0.5) { clearInterval(check); res(); }
    }, 50);
  });
};
BattleScene.prototype.animateExp = function () {
  var self = this;
  return new Promise(function (res) {
    var check = setInterval(function () {
      if (Math.abs(self.expShow - self.expRatio()) < 0.01) { clearInterval(check); res(); }
    }, 50);
  });
};

BattleScene.prototype.update = function (dt) {
  this.t += dt;
  // メッセージ タイプライター
  var speed = Game.settings.textSpeed === 2 ? 300 : Game.settings.textSpeed === 1 ? 80 : 45;
  if (this.msg && this.msgChars < this.msg.length) {
    this.msgChars = Math.min(this.msg.length, this.msgChars + speed * dt);
    if (Input.p("a") || Input.p("b")) this.msgChars = this.msg.length;
    this._msgTimer = 0;
  } else if (this._sayDone) {
    this._msgTimer = (this._msgTimer || 0) + dt;
    var wait = this._sayHold ? 9999 : 0.75;
    if (Input.p("a") || Input.p("b") || this._msgTimer > wait) {
      var r = this._sayDone;
      this._sayDone = null;
      r();
    }
  }
  // HP/EXPバーの補間
  if (this.pHPShow !== null) {
    var pt = this.pMon() ? this.pMon().curHP : 0;
    this.pHPShow += (pt - this.pHPShow) * Math.min(1, dt * 6);
    if (Math.abs(this.pHPShow - pt) < 0.4) this.pHPShow = pt;
  }
  if (this.eHPShow !== null && this.eMon()) {
    var et = this.eMon().curHP;
    this.eHPShow += (et - this.eHPShow) * Math.min(1, dt * 6);
    if (Math.abs(this.eHPShow - et) < 0.4) this.eHPShow = et;
  }
  if (this.expShow !== null) {
    var xr = this.expRatio();
    this.expShow += (xr - this.expShow) * Math.min(1, dt * 4);
    if (Math.abs(this.expShow - xr) < 0.005) this.expShow = xr;
  }
  this.pFlash = Math.max(0, this.pFlash - dt);
  this.eFlash = Math.max(0, this.eFlash - dt);
  this.shake = Math.max(0, this.shake - dt);

  // メニュー入力
  if (this.ui === "menu" && this._menuResolve) {
    if (Input.p("up") || Input.p("down")) { this.menuIdx ^= 2; Audio2.sfx.select(); }
    if (Input.p("left") || Input.p("right")) { this.menuIdx ^= 1; Audio2.sfx.select(); }
    if (Input.p("a")) {
      Audio2.sfx.confirm();
      var mr = this._menuResolve; this._menuResolve = null; this.ui = "none";
      mr(this.menuIdx);
    }
  } else if (this.ui === "moves" && this._menuResolve) {
    var n = this.pMon().moves.length;
    if (Input.p("up") && this.moveIdx >= 1) { this.moveIdx--; Audio2.sfx.select(); }
    if (Input.p("down") && this.moveIdx < n - 1) { this.moveIdx++; Audio2.sfx.select(); }
    if (Input.p("a")) {
      Audio2.sfx.confirm();
      var mr2 = this._menuResolve; this._menuResolve = null; this.ui = "none";
      mr2(this.moveIdx);
    } else if (Input.p("b")) {
      Audio2.sfx.cancel();
      var mr3 = this._menuResolve; this._menuResolve = null; this.ui = "none";
      mr3(-1);
    }
  }
};

// ---------- 描画 ----------
BattleScene.prototype.draw = function (c) {
  var outdoor = MAPS[Game.map] ? MAPS[Game.map].outdoor : true;
  var sx = this.shake > 0 ? (Math.random() - 0.5) * 14 : 0;
  var sy = this.shake > 0 ? (Math.random() - 0.5) * 10 : 0;
  c.save();
  c.translate(sx, sy);

  // はいけい (Guardian Monsters backdrops)
  c.imageSmoothingEnabled = false;
  var mapDef = MAPS[Game.map] || {};
  var bgKey = mapDef.music === "cave" ? "bg_cave" : outdoor ? "bg_grass" : "bg_forest";
  var bg = SpriteLib.getImage(bgKey);
  if (bg) {
    c.drawImage(bg, -20, -20, G.W + 40, 460);
  } else {
    c.fillStyle = "#544a64";
    c.fillRect(-20, -20, G.W + 40, 460);
  }
  // たちいちの かげ
  c.fillStyle = "rgba(0,0,0,0.18)";
  c.beginPath(); c.ellipse(470, 244, 110, 26, 0, 0, 7); c.fill();
  c.beginPath(); c.ellipse(180, 426, 130, 30, 0, 0, 7); c.fill();

  // レア/でんせつの オーラ (てきの うしろ)
  var e = this.eMon();
  if (this.opts.special && e && this.t < 8 && !this.portraitOn) {
    var aCx = 470 + this.eOff.x, aCy = 168;
    var fade = Math.max(0, Math.min(0.5, (8 - this.t) * 0.18));
    c.save();
    c.translate(aCx, aCy);
    c.rotate(this.t * 0.9);
    c.globalAlpha = fade;
    c.fillStyle = this.opts.special === "legend" ? "#b78cff" : "#ffd95e";
    for (var ar = 0; ar < 10; ar++) {
      c.rotate(Math.PI / 5);
      c.beginPath();
      c.moveTo(0, 0); c.lineTo(-22, 240); c.lineTo(22, 240);
      c.fill();
    }
    c.restore();
    c.globalAlpha = 1;
    // キラキラ
    for (var sp2 = 0; sp2 < 7; sp2++) {
      var ang = this.t * 1.4 + sp2 * 0.9;
      var rad = 86 + Math.sin(this.t * 2 + sp2 * 2.4) * 26;
      var sx2 = aCx + Math.cos(ang) * rad, sy2 = aCy + Math.sin(ang) * rad * 0.55;
      var ss = 2.5 + Math.abs(Math.sin(this.t * 3.1 + sp2)) * 3;
      c.fillStyle = this.opts.special === "legend" ? "#e6d4ff" : "#fff3b0";
      c.save();
      c.translate(sx2, sy2); c.rotate(Math.PI / 4);
      c.fillRect(-ss / 2, -ss / 2, ss, ss);
      c.restore();
    }
  }

  // てき (トレーナーせん イントロちゅうは ポートレート)
  if (this.portraitOn && this.opts.portrait) {
    var pim = SpriteLib.getImage(this.opts.portrait);
    if (pim) {
      c.drawImage(pim, 378 + this.eOff.x, 52, 196, 196);
    }
  } else if (e && !(this.ballAnim && (this.ballAnim.phase === "shake" || this.ballAnim.phase === "done"))) {
    var ec = SpriteLib.monsterCanvas(e.species);
    var alpha = this.eFlash > 0 && Math.floor(this.eFlash * 16) % 2 === 0 ? 0.2 : 1;
    c.globalAlpha = alpha;
    var eBob = Math.sin(this.t * 2.3) * 4;
    c.drawImage(ec, 398 + this.eOff.x, 96 + eBob + this.eOff.y * 0.4, 144, 144);
    c.globalAlpha = 1;
  }
  // カプセルアニメ
  if (this.ballAnim) {
    var ba = this.ballAnim;
    var bx, by;
    if (ba.phase === "fly") {
      bx = 160 + (470 - 160) * ba.k;
      by = 300 - Math.sin(ba.k * Math.PI) * 160;
    } else {
      bx = 470 + (ba.k || 0) * 22;
      by = 210;
    }
    c.fillStyle = "#2b2017";
    c.beginPath(); c.arc(bx, by, 13, 0, 7); c.fill();
    c.fillStyle = "#e53935";
    c.beginPath(); c.arc(bx, by, 11, Math.PI, Math.PI * 2); c.fill();
    c.fillStyle = "#fafafa";
    c.beginPath(); c.arc(bx, by, 11, 0, Math.PI); c.fill();
    c.fillStyle = "#2b2017"; c.fillRect(bx - 11, by - 1.5, 22, 3);
    c.fillStyle = "#fff"; c.beginPath(); c.arc(bx, by, 3.5, 0, 7); c.fill();
  }

  // みかた (はんてん・おおきく)
  var p = this.pMon();
  if (p) {
    var pc = SpriteLib.monsterCanvas(p.species);
    var alpha2 = this.pFlash > 0 && Math.floor(this.pFlash * 16) % 2 === 0 ? 0.2 : 1;
    c.globalAlpha = alpha2;
    c.save();
    var pBob = Math.sin(this.t * 2.3 + 1.9) * 3;
    c.translate(90 + this.pOff.x + 184, 252 + pBob + this.pOff.y * 0.4);
    c.scale(-1, 1);
    c.drawImage(pc, 0, 0, 184, 184);
    c.restore();
    c.globalAlpha = 1;
  }

  // てきステータスパネル
  if (e) {
    var est = this.eStats();
    G.panel(c, 24, 24, 290, 86);
    G.text(c, Rules.nameOf(e), 44, 38, 22, "#222238");
    G.text(c, "Lv" + e.level, 272, 38, 20, "#444", "right");
    G.hpBar(c, 60, 74, 200, this.eHPShow, est.hp);
    if (e.status) G.text(c, Rules.STATUS_NAME[e.status], 44, 68, 16, "#8e24aa");
  }
  // みかたステータスパネル
  if (p) {
    var pst = this.pStats();
    G.panel(c, 330, 318, 290, 104);
    G.text(c, Rules.nameOf(p), 350, 330, 22, "#222238");
    G.text(c, "Lv" + p.level, 580, 330, 20, "#444", "right");
    G.hpBar(c, 366, 366, 150, this.pHPShow, pst.hp);
    G.text(c, Math.round(this.pHPShow) + "/" + pst.hp, 600, 362, 18, "#444", "right");
    if (p.status) G.text(c, Rules.STATUS_NAME[p.status], 350, 360, 16, "#8e24aa");
    // EXPバー
    c.fillStyle = "#30304a";
    c.fillRect(348, 392, 256, 10);
    c.fillStyle = "#42a5f5";
    c.fillRect(350, 394, Math.round(252 * (this.expShow || 0)), 6);
    G.text(c, "EXP", 350, 386, 12, "#666");
  }

  c.restore();

  // メッセージウィンドウ
  G.panel(c, 16, 432, this.ui === "menu" ? 360 : G.W - 32, 128, { bg: "#f8f8f0" });
  if (this.msg) {
    var shown = this.msg.substring(0, Math.floor(this.msgChars));
    var lines = shown.split("\n");
    for (var i = 0; i < lines.length && i < 2; i++) {
      G.text(c, lines[i], 42, 458 + i * 40, 23, "#222238");
    }
  }

  // コマンドメニュー
  if (this.ui === "menu") {
    G.panel(c, 384, 432, 240, 128);
    var labels = ["たたかう", "バッグ", "いれかえ", "にげる"];
    for (var m = 0; m < 4; m++) {
      var mx = 404 + (m % 2) * 116;
      var my = 452 + Math.floor(m / 2) * 52;
      if (m === this.menuIdx) {
        c.fillStyle = "#e53935";
        c.beginPath();
        c.moveTo(mx - 4, my + 2); c.lineTo(mx - 4, my + 20); c.lineTo(mx + 8, my + 11);
        c.fill();
      }
      G.text(c, labels[m], mx + 12, my, 20, "#222238");
    }
  } else if (this.ui === "moves") {
    var mvs = this.pMon().moves;
    G.panel(c, 16, 432, G.W - 32, 128);
    for (var w = 0; w < mvs.length; w++) {
      var def = MOVES[mvs[w].id];
      var wx = 50 + (w % 2) * 300;
      var wy = 450 + Math.floor(w / 2) * 52;
      if (w === this.moveIdx) {
        c.fillStyle = "#e53935";
        c.beginPath();
        c.moveTo(wx - 14, wy + 2); c.lineTo(wx - 14, wy + 20); c.lineTo(wx - 2, wy + 11);
        c.fill();
      }
      G.text(c, def.name, wx, wy, 21, "#222238");
      c.fillStyle = TYPES[def.type].color;
      G.roundRect(c, wx + 160, wy + 2, 70, 22, 5);
      c.fill();
      G.text(c, TYPES[def.type].name, wx + 195, wy + 4, 14, "#fff", "center");
      G.text(c, mvs[w].pp + "/" + def.pp, wx + 270, wy + 4, 16, "#666", "right");
    }
  }
};
