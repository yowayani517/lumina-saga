// データ整合性バリデータ (node tools/validate.js)
var fs = require("fs");
var path = require("path");
var root = path.join(__dirname, "..");

function loadIf(p) {
  var full = path.join(root, p);
  if (!fs.existsSync(full)) return false;
  eval.call(global, fs.readFileSync(full, "utf8"));
  return true;
}

var errors = [], warns = [];
function err(s) { errors.push(s); }
function warn(s) { warns.push(s); }

loadIf("js/data/typechart.js");
var hasMon = loadIf("js/data/monsters.js");
var hasMov = loadIf("js/data/moves.js");
loadIf("js/data/items.js");
var hasMap = loadIf("js/data/maps.js");
var hasMus = loadIf("js/data/music.js");

var WALKABLE = { ".": 1, ",": 1, "G": 1, "P": 1, "S": 1, "C": 1, "_": 1, "m": 1, "D": 1, "E": 1 };
var ALLTILES = ".,GPSC_mDEWTFMRB#bcthx";

// ---------- マップ ----------
if (hasMap) {
  var mapIds = Object.keys(MAPS);
  mapIds.forEach(function (id) {
    var m = MAPS[id];
    var w = m.tiles[0].length;
    m.tiles.forEach(function (row, y) {
      if (row.length !== w) err(id + ": 行" + y + " の長さ " + row.length + " != " + w);
      for (var x = 0; x < row.length; x++) {
        if (ALLTILES.indexOf(row[x]) < 0) err(id + ": 不明タイル '" + row[x] + "' at " + x + "," + y);
      }
    });
    function tile(x, y) {
      if (y < 0 || y >= m.tiles.length || x < 0 || x >= w) return "T";
      return m.tiles[y][x];
    }
    // warp
    (m.warps || []).forEach(function (wp) {
      if (!MAPS[wp.to]) { err(id + ": warp先 " + wp.to + " が存在しない"); return; }
      if (!WALKABLE[tile(wp.x, wp.y)]) err(id + ": warp元(" + wp.x + "," + wp.y + ")が通行不可タイル " + tile(wp.x, wp.y));
      var t = MAPS[wp.to];
      var tw = t.tiles[0].length;
      if (wp.tx < 0 || wp.tx >= tw || wp.ty < 0 || wp.ty >= t.tiles.length) {
        err(id + ": warp先座標(" + wp.tx + "," + wp.ty + ")が " + wp.to + " の範囲外");
      } else if (!WALKABLE[t.tiles[wp.ty][wp.tx]]) {
        err(id + ": warp先 " + wp.to + "(" + wp.tx + "," + wp.ty + ") が通行不可タイル " + t.tiles[wp.ty][wp.tx]);
      }
      // 双方向: warp先マップに戻りwarpがあるか
      var back = (t.warps || []).some(function (bw) { return bw.to === id; });
      if (!back) warn(id + " -> " + wp.to + " の戻りwarpがない");
    });
    // NPC
    var seenIds = {};
    (m.npcs || []).forEach(function (n) {
      if (seenIds[n.id]) err(id + ": npc id重複 " + n.id);
      seenIds[n.id] = 1;
      if (n.x < 0 || n.x >= w || n.y < 0 || n.y >= m.tiles.length) err(id + ": npc " + n.id + " が範囲外");
      if (n.trainer) {
        n.trainer.party.forEach(function (p) {
          if (!p.rival && !MONSTERS[p.species]) err(id + ": npc " + n.id + " のspecies " + p.species + " が不正");
          if (p.rival && [1, 2, 3].indexOf(p.stage) < 0) err(id + ": npc " + n.id + " rival stage不正");
        });
      }
      if (n.item && !ITEMS[n.item]) err(id + ": npc " + n.id + " のitem " + n.item + " が不明");
      if (n.shop) n.shop.forEach(function (s) { if (!ITEMS[s]) err(id + ": shop item " + s + " 不明"); });
    });
    // エンカウント
    (m.encounters || []).concat(m.rareEncounters || []).forEach(function (e) {
      if (!MONSTERS[e.species]) err(id + ": encounter species " + e.species + " 不正");
      if (e.min > e.max) err(id + ": encounter min>max");
    });
    // BFS到達性: 最初のwarpから 全warp・全NPC隣接マスへ
    // NPCはすべて壁とみなす(=ゲートを閉じた最悪条件)。ただしhideIfFlagつきは消える可能性があるので
    // 2パスで判定する。
    function bfs(blockNpcAll) {
      var blocked = {};
      (m.npcs || []).forEach(function (n) {
        if (blockNpcAll || !n.hideIfFlag) blocked[n.x + "," + n.y] = 1;
      });
      var starts = (m.warps || []).slice(0, 1);
      if (!starts.length) return null;
      var seen = {};
      var q = [[starts[0].x, starts[0].y]];
      seen[starts[0].x + "," + starts[0].y] = 1;
      while (q.length) {
        var cur = q.shift();
        [[0, 1], [0, -1], [1, 0], [-1, 0]].forEach(function (d) {
          var nx = cur[0] + d[0], ny = cur[1] + d[1];
          var k = nx + "," + ny;
          if (seen[k]) return;
          if (!WALKABLE[tile(nx, ny)]) return;
          if (blocked[k]) return;
          seen[k] = 1;
          q.push([nx, ny]);
        });
      }
      return seen;
    }
    var reach = bfs(false); // hideIfFlagのNPCは消えた状態(=最終的な到達性)
    if (reach) {
      (m.warps || []).forEach(function (wp) {
        if (!reach[wp.x + "," + wp.y]) err(id + ": warp(" + wp.x + "," + wp.y + ")に到達できない");
      });
      (m.npcs || []).forEach(function (n) {
        var ok = [[0, 1], [0, -1], [1, 0], [-1, 0]].some(function (d) {
          return reach[(n.x + d[0]) + "," + (n.y + d[1])];
        });
        if (!ok) err(id + ": npc " + n.id + "(" + n.x + "," + n.y + ") に隣接到達できない");
      });
    }
    // ゲート密閉チェック: blocker(hideIfFlag=badgeX)があるマップで、
    // blockerを壁にした場合に そのマップの「badgeを要求する先のwarp」へ到達できないこと
    (m.npcs || []).forEach(function (n) {
      if (!n.hideIfFlag || n.hideIfFlag.indexOf("badge") !== 0 || n.trainer) return;
      var sealed = bfs(true);
      // blockerより先のwarp = blockerに最も近いwarpと仮定せず、全warpの到達数を報告
      var unreachable = (m.warps || []).filter(function (wp) { return !sealed[wp.x + "," + wp.y]; });
      if (unreachable.length === 0) {
        err(id + ": ゲート " + n.id + " が機能していない(全warpに到達可能=迂回路がある)");
      } else {
        console.log("  [gate] " + id + "." + n.id + " が封鎖するwarp: " + unreachable.map(function (wp) { return wp.to; }).join(","));
      }
    });
  });

  // GAME_START
  var sm = MAPS[GAME_START.map];
  if (!sm) err("GAME_STARTのマップが存在しない");
  else if (!WALKABLE[sm.tiles[GAME_START.y][GAME_START.x]]) err("GAME_STARTが通行不可");
}

// ---------- モンスター ----------
if (hasMon && hasMov) {
  Object.keys(MONSTERS).forEach(function (k) {
    var sp = MONSTERS[k];
    if (!sp.name) err("monster " + k + ": nameなし");
    sp.types.forEach(function (t) { if (!TYPES[t]) err("monster " + k + ": 不明タイプ " + t); });
    if (!sp.learnset || !sp.learnset.length) err("monster " + k + ": learnsetなし");
    else {
      sp.learnset.forEach(function (e) {
        if (!MOVES[e.move]) err("monster " + k + " (" + sp.name + "): 不明わざ " + e.move);
      });
      var lv1 = sp.learnset.filter(function (e) { return e.level <= 5 && MOVES[e.move] && MOVES[e.move].power > 0; });
      if (!lv1.length) err("monster " + k + ": Lv5までに攻撃わざがない");
    }
    if (sp.evolvesTo && !MONSTERS[sp.evolvesTo]) err("monster " + k + ": 進化先 " + sp.evolvesTo + " が存在しない");
    var spr = sp.sprite;
    if (typeof spr !== "string") {
      err("monster " + k + ": spriteがファイルID文字列でない");
    } else if (!fs.existsSync(path.join(root, (spr.indexOf("ai_") === 0 ? "assets/ai/monsters/" : "assets/gm/monsters/") + spr + ".png"))) {
      err("monster " + k + ": スプライト画像 " + spr + ".png が存在しない");
    }
  });
  Object.keys(MOVES).forEach(function (k) {
    var mv = MOVES[k];
    if (!TYPES[mv.type]) err("move " + k + ": 不明タイプ");
    if (["physical", "special", "status"].indexOf(mv.category) < 0) err("move " + k + ": category不正");
  });
  console.log("monsters: " + Object.keys(MONSTERS).length + " / moves: " + Object.keys(MOVES).length);
} else {
  warn("monsters.js / moves.js 未検証(ファイル未生成)");
}

// ---------- ミュージック ----------
if (hasMus) {
  var need = ["title", "town", "route", "cave", "center", "gym", "battle", "trainerbattle", "victory", "ending"];
  need.forEach(function (t) { if (!MUSIC_TRACKS[t]) err("music: " + t + " がない"); });
}

console.log("");
warns.forEach(function (w) { console.log("WARN: " + w); });
if (errors.length) {
  errors.forEach(function (e) { console.log("ERROR: " + e); });
  console.log("\n" + errors.length + " errors, " + warns.length + " warns");
  process.exit(1);
} else {
  console.log("ALL OK (" + warns.length + " warns)");
}
