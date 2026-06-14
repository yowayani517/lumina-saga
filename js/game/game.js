// ゲーム状態とルール (ステータス計算/経験値/ダメージ/セーブ)
var Game = {
  party: [], box: [], bag: {}, money: 3000,
  flags: {}, map: null, x: 0, y: 0, dir: "down",
  dex: { seen: {}, caught: {} },
  lastHeal: null,
  settings: { bgm: true, textSpeed: 1 },
  playStart: 0
};

var Rules = (function () {
  var SAVE_KEY = "lumina_saga_save_v1";
  var STAGE_MULT = [0.25, 0.28, 0.33, 0.4, 0.5, 0.66, 1, 1.5, 2, 2.5, 3, 3.5, 4]; // -6..+6
  var STATUS_NAME = { psn: "どく", brn: "やけど", par: "まひ", slp: "ねむり" };

  function expForLevel(l) { return l * l * l; }
  function levelFromExp(exp) {
    var l = 1;
    while (l < 100 && expForLevel(l + 1) <= exp) l++;
    return l;
  }

  function statsOf(mon) {
    var b = MONSTERS[mon.species].baseStats;
    var L = mon.level;
    return {
      hp: Math.floor(b.hp * 2 * L / 100) + L + 10,
      atk: Math.floor(b.atk * 2 * L / 100) + 5,
      def: Math.floor(b.def * 2 * L / 100) + 5,
      spa: Math.floor(b.spa * 2 * L / 100) + 5,
      spdef: Math.floor(b.spdef * 2 * L / 100) + 5,
      spe: Math.floor(b.spe * 2 * L / 100) + 5
    };
  }

  function movesAtLevel(speciesId, level) {
    var ls = MONSTERS[speciesId].learnset.filter(function (e) { return e.level <= level; });
    var picked = [];
    for (var i = ls.length - 1; i >= 0 && picked.length < 4; i--) {
      if (picked.indexOf(ls[i].move) < 0) picked.push(ls[i].move);
    }
    picked.reverse();
    return picked;
  }

  function newMon(speciesId, level) {
    var mon = {
      species: speciesId,
      level: level,
      exp: expForLevel(level),
      status: null,
      moves: movesAtLevel(speciesId, level).map(function (m) {
        return { id: m, pp: MOVES[m].pp };
      })
    };
    mon.curHP = statsOf(mon).hp;
    return mon;
  }

  function nameOf(mon) { return MONSTERS[mon.species].name; }

  // ---------- ダメージ ----------
  function effStat(mon, stats, key, stages) {
    var v = stats[key];
    var st = (stages && stages[key]) || 0;
    v = Math.floor(v * STAGE_MULT[st + 6]);
    if (key === "atk" && mon.status === "brn") v = Math.floor(v / 2);
    if (key === "spe" && mon.status === "par") v = Math.floor(v / 2);
    return Math.max(1, v);
  }

  function calcDamage(attacker, aStats, aStages, defender, dStats, dStages, move) {
    if (move.power <= 0) return { dmg: 0, eff: 1, crit: false };
    var phys = move.category === "physical";
    var A = effStat(attacker, aStats, phys ? "atk" : "spa", aStages);
    var D = effStat(defender, dStats, phys ? "def" : "spdef", dStages);
    var L = attacker.level;
    var base = Math.floor(Math.floor(Math.floor(2 * L / 5 + 2) * move.power * A / D) / 50) + 2;
    var stab = MONSTERS[attacker.species].types.indexOf(move.type) >= 0 ? 1.5 : 1;
    var eff = typeMultiplier(move.type, MONSTERS[defender.species].types);
    var crit = Math.random() < 1 / 16;
    var rand = 0.85 + Math.random() * 0.15;
    var dmg = Math.floor(base * stab * eff * (crit ? 1.5 : 1) * rand);
    if (eff > 0) dmg = Math.max(1, dmg);
    return { dmg: dmg, eff: eff, crit: crit };
  }

  // ---------- 経験値 ----------
  function expGain(faintedMon, isTrainer) {
    var y = MONSTERS[faintedMon.species].expYield;
    var g = Math.floor(y * faintedMon.level / 4);  // テンポよくレベルが上がる調整
    if (isTrainer) g = Math.floor(g * 1.5);
    return Math.max(1, g);
  }

  // ---------- つかまえる ----------
  function catchCheck(wild, wildStats, ballMod) {
    var species = MONSTERS[wild.species];
    var statusBonus = wild.status === "slp" ? 2 : wild.status ? 1.5 : 1;
    var a = (3 * wildStats.hp - 2 * wild.curHP) * species.catchRate * ballMod * statusBonus / (3 * wildStats.hp);
    var p = Math.min(1, a / 255);
    var shakes = 0;
    for (var i = 0; i < 3; i++) {
      if (Math.random() < Math.pow(p, 1 / 3)) shakes++;
      else break;
    }
    return { success: shakes === 3, shakes: shakes };
  }

  // ---------- パーティ ----------
  function healParty() {
    Game.party.forEach(function (m) {
      m.curHP = statsOf(m).hp;
      m.status = null;
      m.moves.forEach(function (mv) { mv.pp = MOVES[mv.id].pp; });
    });
  }
  function aliveCount() {
    return Game.party.filter(function (m) { return m.curHP > 0; }).length;
  }
  function firstAlive() {
    for (var i = 0; i < Game.party.length; i++) if (Game.party[i].curHP > 0) return i;
    return -1;
  }
  function addMon(mon) {
    markDex(mon.species, true);
    if (Game.party.length < 6) { Game.party.push(mon); return "party"; }
    Game.box.push(mon); return "box";
  }
  function markDex(speciesId, caught) {
    Game.dex.seen[speciesId] = true;
    if (caught) Game.dex.caught[speciesId] = true;
  }

  // ---------- もちもの ----------
  function addItem(id, n) { Game.bag[id] = (Game.bag[id] || 0) + (n || 1); }
  function removeItem(id, n) {
    Game.bag[id] = (Game.bag[id] || 0) - (n || 1);
    if (Game.bag[id] <= 0) delete Game.bag[id];
  }

  // ---------- セーブ ----------
  function save() {
    var data = {
      party: Game.party, box: Game.box, bag: Game.bag, money: Game.money,
      flags: Game.flags, map: Game.map, x: Game.x, y: Game.y, dir: Game.dir,
      dex: Game.dex, lastHeal: Game.lastHeal, settings: Game.settings,
      savedAt: Date.now()
    };
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(data));
      return true;
    } catch (e) { return false; }
  }
  function load() {
    try {
      var raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return false;
      var d = JSON.parse(raw);
      Game.party = d.party; Game.box = d.box || []; Game.bag = d.bag || {};
      Game.money = d.money; Game.flags = d.flags || {};
      Game.map = d.map; Game.x = d.x; Game.y = d.y; Game.dir = d.dir || "down";
      Game.dex = d.dex || { seen: {}, caught: {} };
      Game.lastHeal = d.lastHeal;
      Game.settings = d.settings || { bgm: true, textSpeed: 1 };
      return true;
    } catch (e) { return false; }
  }
  function hasSave() { return !!localStorage.getItem(SAVE_KEY); }

  function newGame() {
    Game.party = []; Game.box = []; Game.bag = { potion: 2, capsule: 5 };
    Game.money = 3000; Game.flags = {};
    Game.map = GAME_START.map; Game.x = GAME_START.x; Game.y = GAME_START.y;
    Game.dir = "down";
    Game.dex = { seen: {}, caught: {} };
    Game.lastHeal = { map: GAME_START.map, x: GAME_START.x, y: GAME_START.y };
    Game.settings = { bgm: true, textSpeed: 1 };
  }

  // ライバルの御三家: プレイヤーに相性有利
  function rivalSpecies(stage) {
    var starter = Game.flags.starterChoice || 1; // 1=くさ 4=ほのお 7=みず
    var counter = { 1: 4, 4: 7, 7: 1 }[starter] || 4;
    return counter + (stage - 1);
  }

  function resolveTrainerParty(def) {
    return def.map(function (e) {
      if (e.rival) return newMon(rivalSpecies(e.stage), e.level);
      return newMon(e.species, e.level);
    });
  }

  return {
    expForLevel: expForLevel, levelFromExp: levelFromExp,
    statsOf: statsOf, newMon: newMon, nameOf: nameOf, movesAtLevel: movesAtLevel,
    calcDamage: calcDamage, effStat: effStat, expGain: expGain, catchCheck: catchCheck,
    healParty: healParty, aliveCount: aliveCount, firstAlive: firstAlive,
    addMon: addMon, markDex: markDex, addItem: addItem, removeItem: removeItem,
    save: save, load: load, hasSave: hasSave, newGame: newGame,
    resolveTrainerParty: resolveTrainerParty,
    STATUS_NAME: STATUS_NAME, STAGE_MULT: STAGE_MULT
  };
})();
