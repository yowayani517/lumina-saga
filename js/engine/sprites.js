// スプライト/タイル描画ライブラリ
var SpriteLib = (function () {
  var TILE = 32;

  // ---------- ピクセル文字列 → キャンバス ----------
  function gridToCanvas(rows, palette, w, h) {
    var c = document.createElement("canvas");
    c.width = w; c.height = h;
    var x2 = c.getContext("2d");
    for (var y = 0; y < rows.length; y++) {
      for (var x = 0; x < rows[y].length; x++) {
        var ch = rows[y][x];
        if (ch === ".") continue;
        var col = palette[ch];
        if (!col) continue;
        x2.fillStyle = col;
        x2.fillRect(x, y, 1, 1);
      }
    }
    return c;
  }

  // ---------- 人物テンプレート (16x16) ----------
  // O=りんかく H=かみ S=はだ C=ふく P=ズボン W=アクセント
  var TPL_KID = [
    "................",
    "....OOOOOOO.....",
    "...OHHHHHHHO....",
    "..OHHHHHHHHHO...",
    "..OHHSSSSSHHO...",
    "..OSSSSSSSSSO...",
    "..OSOSSSSOSSO...",
    "..OSSSSSSSSSO...",
    "...OSSSSSSSO....",
    "..OOCCCCCCCOO...",
    "..OSOCCCCCOSO...",
    "...OCCCCCCCO....",
    "....OCCCCCO.....",
    "....OPPOPPO.....",
    "....OPO.OPO.....",
    "....OO...OO....."
  ];
  var TPL_GIRL = [
    "................",
    "....OOOOOOO.....",
    "...OHHHHHHHO....",
    "..OHHHHHHHHHO...",
    "..OHHSSSSSHHO...",
    "..OHSSSSSSSHO...",
    "..OHOSSSSOSHO...",
    "..OHSSSSSSSHO...",
    "..OHHSSSSSHHO...",
    "..OHOCCCCCOHO...",
    "..OSOCCCCCOSO...",
    "...OCCCCCCCO....",
    "....OCCCCCO.....",
    "....OCC.CCO.....",
    "....OPO.OPO.....",
    "....OO...OO....."
  ];
  var TPL_ADULT = [
    "....OOOOOOO.....",
    "...OHHHHHHHO....",
    "..OHHHHHHHHHO...",
    "..OHHSSSSSHHO...",
    "..OSOSSSSOSSO...",
    "..OSSSSSSSSSO...",
    "...OSSSSSSSO....",
    "..OOCCCCCCCOO...",
    "..OSCCCWCCCSO...",
    "..OSOCCWCCOSO...",
    "...OCCCWCCCO....",
    "...OCCCCCCCO....",
    "....OPPPPPO.....",
    "....OPPOPPO.....",
    "....OPO.OPO.....",
    "....OO...OO....."
  ];
  var TPL_ELDER = [
    "................",
    "....OOOOOOO.....",
    "...OHHHHHHHO....",
    "..OHHHHHHHHHO...",
    "..OHHSSSSSHHO...",
    "..OSOSSSSOSSO...",
    "..OWWWWWWWWWO...",
    "...OWWWWWWWO....",
    "...OCCCCCCCO....",
    "..OOCCCCCCCOO...",
    "..OSOCCCCCOSO...",
    "...OCCCCCCCO....",
    "....OCCCCCO.....",
    "....OPPPPPO.....",
    "....OPO.OPO.....",
    "....OO...OO....."
  ];
  var TPL_SIGN = [
    "................",
    "................",
    "..OOOOOOOOOOOO..",
    ".OWWWWWWWWWWWWO.",
    ".OWHHWHHHWHHWWO.",
    ".OWWWWWWWWWWWWO.",
    ".OWHHHWHHWHHHWO.",
    ".OWWWWWWWWWWWWO.",
    "..OOOOOOOOOOOO..",
    "......OCCO......",
    "......OCCO......",
    "......OCCO......",
    "......OCCO......",
    ".....OCCCCO.....",
    "................",
    "................"
  ];

  var BASE = { O: "#2b2017", S: "#ffd9a0" };
  function pal(p) {
    var out = { O: BASE.O, S: BASE.S };
    for (var k in p) out[k] = p[k];
    return out;
  }

  var SPRITE_DEFS = {
    boy:     { tpl: TPL_KID,   pal: pal({ H: "#6d4318", C: "#2e86de", P: "#34495e", W: "#fff" }) },
    girl:    { tpl: TPL_GIRL,  pal: pal({ H: "#e17055", C: "#e84393", P: "#6c5ce7", W: "#fff" }) },
    rival:   { tpl: TPL_KID,   pal: pal({ H: "#6c5ce7", C: "#341f97", P: "#2d3436", W: "#fff" }) },
    man:     { tpl: TPL_ADULT, pal: pal({ H: "#2d3436", C: "#16a085", P: "#34495e", W: "#0e6655" }) },
    woman:   { tpl: TPL_ADULT, pal: pal({ H: "#a0522d", C: "#e17055", P: "#74508d", W: "#c44d33" }) },
    oldman:  { tpl: TPL_ELDER, pal: pal({ H: "#cfd8dc", C: "#5d4037", P: "#455a64", W: "#eceff1" }) },
    oldwoman:{ tpl: TPL_ADULT, pal: pal({ H: "#cfd8dc", C: "#8d6e63", P: "#4e342e", W: "#d7ccc8" }) },
    prof:    { tpl: TPL_ADULT, pal: pal({ H: "#6d4c41", C: "#fafafa", P: "#5d4037", W: "#bdbdbd" }) },
    nurse:   { tpl: TPL_ADULT, pal: pal({ H: "#f48fb1", C: "#ffffff", P: "#f8bbd0", W: "#ef5350" }) },
    clerk:   { tpl: TPL_ADULT, pal: pal({ H: "#37474f", C: "#1e88e5", P: "#263238", W: "#90caf9" }) },
    leader1: { tpl: TPL_ADULT, pal: pal({ H: "#8d6e63", C: "#a1887f", P: "#5d4037", W: "#3e2723" }) },
    leader2: { tpl: TPL_ADULT, pal: pal({ H: "#fdd835", C: "#f9a825", P: "#424242", W: "#212121" }) },
    leader3: { tpl: TPL_ADULT, pal: pal({ H: "#9575cd", C: "#4a148c", P: "#311b92", W: "#b39ddb" }) },
    champ:   { tpl: TPL_ADULT, pal: pal({ H: "#d32f2f", C: "#b71c1c", P: "#212121", W: "#ffd54f" }) },
    sign:    { tpl: TPL_SIGN,  pal: pal({ W: "#d7b98c", H: "#8a6b46", C: "#6b4f33" }) }
  };

  // ---------- 主人公 (4方向 x 歩行) ----------
  var HERO_PAL = pal({ R: "#e74c3c", r: "#a93226", H: "#5d4037", C: "#2e86de", P: "#1b4f72", W: "#fff" });
  var HERO_DOWN = [
    "................",
    "....OOOOOOO.....",
    "...ORRRRRRRO....",
    "..ORRRRRRRRRO...",
    "..OrrrrrrrrrO...",
    "..OSHSSSSSHSO...",
    "..OSOSSSSOSSO...",
    "..OSSSSSSSSSO...",
    "...OSSSSSSSO....",
    "..OOCCCCCCCOO...",
    "..OSOCCCCCOSO...",
    "...OCCCCCCCO....",
    "....OCCCCCO.....",
    "....OPPOPPO.....",
    "....OPO.OPO.....",
    "....OO...OO....."
  ];
  var HERO_DOWN_W = HERO_DOWN.slice(0, 13).concat([
    "....OPPOPPO.....",
    "....OPO.O.O.....",
    "....OO.........."
  ]);
  var HERO_UP = [
    "................",
    "....OOOOOOO.....",
    "...ORRRRRRRO....",
    "..ORRRRRRRRRO...",
    "..ORRRRRRRRRO...",
    "..OHHHHHHHHHO...",
    "..OHHHHHHHHHO...",
    "..OSHHHHHHHSO...",
    "...OSSSSSSSO....",
    "..OOCCCCCCCOO...",
    "..OSOCCCCCOSO...",
    "...OCCCCCCCO....",
    "....OCCCCCO.....",
    "....OPPOPPO.....",
    "....OPO.OPO.....",
    "....OO...OO....."
  ];
  var HERO_UP_W = HERO_UP.slice(0, 13).concat([
    "....OPPOPPO.....",
    "....O.O.OPO.....",
    ".........OO....."
  ]);
  var HERO_LEFT = [
    "................",
    "....OOOOOOO.....",
    "...ORRRRRRRO....",
    "..ORRRRRRRRO....",
    "..ORrrrrrrrO....",
    "..OSSSSHHHHO....",
    "..OSOSSSHHHO....",
    "..OSSSSSHHHO....",
    "...OSSSSHHO.....",
    "...OCCCCCCO.....",
    "..OSCCCCCCCO....",
    "..OOCCCCCCCO....",
    "....OCCCCO......",
    "....OPPPPO......",
    "....OPOOPO......",
    "....OO..OO......"
  ];
  var HERO_LEFT_W = HERO_LEFT.slice(0, 13).concat([
    "....OPPPPO......",
    "...OPO..OPO.....",
    "...OO....OO....."
  ]);

  var spriteCache = {};
  function npcCanvas(name) {
    if (spriteCache[name]) return spriteCache[name];
    var def = SPRITE_DEFS[name] || SPRITE_DEFS.man;
    var c = gridToCanvas(def.tpl, def.pal, 16, 16);
    spriteCache[name] = c;
    return c;
  }
  function heroCanvas(dir, walk) {
    var key = "hero_" + dir + (walk ? "_w" : "");
    if (spriteCache[key]) return spriteCache[key];
    var grid;
    if (dir === "down") grid = walk ? HERO_DOWN_W : HERO_DOWN;
    else if (dir === "up") grid = walk ? HERO_UP_W : HERO_UP;
    else grid = walk ? HERO_LEFT_W : HERO_LEFT;
    var c = gridToCanvas(grid, HERO_PAL, 16, 16);
    spriteCache[key] = c;
    return c;
  }

  // ---------- 人物 画像スプライト (Pokemon Tutorial風 16x32シート) ----------
  var DIR_ROW = { down: 0, right: 1, up: 2, left: 3 };

  // しゅじんこう: 歩き4フレーム / 走り3フレーム
  function drawHero(c, dir, animFrame, dashing, px, py) {
    var img = images.hero;
    if (!img) {
      var hc = heroCanvas(dir === "right" ? "left" : dir, animFrame % 2 === 1);
      if (dir === "right") {
        c.save(); c.translate(px + 32, py - 8); c.scale(-1, 1);
        c.drawImage(hc, 0, 0, 32, 40); c.restore();
      } else c.drawImage(hc, px, py - 8, 32, 40);
      return;
    }
    var col = dashing ? 5 + (animFrame % 3) : (animFrame % 4);
    var row = DIR_ROW[dir] || 0;
    c.drawImage(img, col * 16, row * 32, 16, 32, px, py - TILE, TILE, TILE * 2);
  }

  // NPC: 服(青)の色相だけ置換して種類を作る。肌・髪は維持
  // mode: [色相0-360] / "white"(白衣) / "gray"(老人)
  var NPC_RECOLOR = {
    boy: null,
    girl: 310, man: 130, woman: 25, clerk: 170,
    oldman: "gray", oldwoman: "sepia",
    prof: "white", nurse: 330,
    rival: 265, leader1: 15, leader2: 55, leader3: 280, champ: 350
  };

  function rgb2hsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    var mx = Math.max(r, g, b), mn = Math.min(r, g, b);
    var h = 0, s = 0, l = (mx + mn) / 2;
    if (mx !== mn) {
      var d = mx - mn;
      s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn);
      if (mx === r) h = ((g - b) / d + (g < b ? 6 : 0)) * 60;
      else if (mx === g) h = ((b - r) / d + 2) * 60;
      else h = ((r - g) / d + 4) * 60;
    }
    return [h, s, l];
  }
  function hsl2rgb(h, s, l) {
    h /= 360;
    function f(p, q, t) {
      if (t < 0) t += 1; if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    }
    var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    var p = 2 * l - q;
    return [Math.round(f(p, q, h + 1 / 3) * 255), Math.round(f(p, q, h) * 255), Math.round(f(p, q, h - 1 / 3) * 255)];
  }

  var npcImgCache = {};
  function npcSheet(name) {
    if (npcImgCache[name]) return npcImgCache[name];
    var img = images.npcsheet;
    if (!img) return null;
    var c = document.createElement("canvas");
    c.width = img.width; c.height = img.height;
    var x2 = c.getContext("2d");
    x2.drawImage(img, 0, 0);
    var mode = NPC_RECOLOR[name];
    if (mode !== null && mode !== undefined) {
      var data;
      try {
        data = x2.getImageData(0, 0, c.width, c.height);
      } catch (e) {
        // file://でcanvasが汚染された場合は色置換なしで返す
        npcImgCache[name] = c;
        return c;
      }
      var d = data.data;
      for (var i = 0; i < d.length; i += 4) {
        if (d[i + 3] < 30) continue;
        var hsl = rgb2hsl(d[i], d[i + 1], d[i + 2]);
        var isBlue = hsl[0] >= 180 && hsl[0] <= 265 && hsl[1] > 0.18;
        if (!isBlue) continue;
        var out;
        if (mode === "white") out = hsl2rgb(hsl[0], 0.05, Math.min(0.92, hsl[2] + 0.42));
        else if (mode === "gray") out = hsl2rgb(hsl[0], 0.04, hsl[2] + 0.12);
        else if (mode === "sepia") out = hsl2rgb(330, 0.25, hsl[2] + 0.18);
        else out = hsl2rgb(mode, Math.max(0.45, hsl[1]), hsl[2]);
        d[i] = out[0]; d[i + 1] = out[1]; d[i + 2] = out[2];
      }
      x2.putImageData(data, 0, 0);
    }
    npcImgCache[name] = c;
    return c;
  }

  function drawNPCImg(c, name, px, py, dir) {
    var sheet = npcSheet(name);
    if (!sheet) {
      var sc = npcCanvas(name);
      c.drawImage(sc, px, py - 8, 32, 40);
      return;
    }
    var row = DIR_ROW[dir || "down"] || 0;
    c.drawImage(sheet, 0, row * 32, 16, 32, px, py - TILE, TILE, TILE * 2);
  }

  // ---------- モンスター (Guardian Monsters 画像スプライト) ----------
  var images = {};   // ファイルid -> Image (main.jsのプリローダーが登録)
  function registerImage(key, img) { images[key] = img; }
  function getImage(key) { return images[key] || null; }

  var monsterCache = {};
  function monsterCanvas(id, silhouette) {
    var key = id + (silhouette ? "_s" : "");
    if (monsterCache[key]) return monsterCache[key];
    var c = document.createElement("canvas");
    c.width = 128; c.height = 128;
    var sp = MONSTERS[id] && MONSTERS[id].sprite;
    var img = sp ? images["m_" + sp] : null;
    if (img) {
      var x2 = c.getContext("2d");
      x2.imageSmoothingEnabled = false;
      x2.drawImage(img, 0, 0, 128, 128);
      if (silhouette) {
        x2.globalCompositeOperation = "source-in";
        x2.fillStyle = "#3a3a4a";
        x2.fillRect(0, 0, 128, 128);
      }
    }
    monsterCache[key] = c;
    return c;
  }

  // ---------- ハッシュ(タイル装飾の揺らぎ用) ----------
  function h2(x, y) {
    var n = (x * 73856093) ^ (y * 19349663);
    n = (n ^ (n >> 13)) & 0x7fffffff;
    return n % 100;
  }

  // ---------- タイル描画 (32px) ----------
  function grassBase(c, x, y) {
    if (images.tileset) {
      c.drawImage(images.tileset, 0, 0, 16, 16, x, y, TILE, TILE);
      return;
    }
    c.fillStyle = "#8bc34a";
    c.fillRect(x, y, TILE, TILE);
    c.fillStyle = "#7cb342";
    var r = h2(x / TILE, y / TILE);
    c.fillRect(x + (r % 5) * 5 + 2, y + ((r * 7) % 5) * 5 + 3, 3, 2);
    c.fillRect(x + ((r * 3) % 6) * 4 + 4, y + ((r * 11) % 6) * 4 + 6, 3, 2);
  }
  function caveBase(c, x, y) {
    if (images.tileset) {
      c.drawImage(images.tileset, 26 * 16, 13 * 16, 16, 16, x, y, TILE, TILE);
      return;
    }
    c.fillStyle = "#4e4458";
    c.fillRect(x, y, TILE, TILE);
    c.fillStyle = "#453c4e";
    var r = h2(x / TILE, y / TILE);
    c.fillRect(x + (r % 6) * 4 + 2, y + ((r * 5) % 6) * 4 + 2, 4, 3);
  }
  function floorBase(c, x, y) {
    if (images.tileset) {
      c.drawImage(images.tileset, 25 * 16, 5 * 16, 16, 16, x, y, TILE, TILE);
      return;
    }
    c.fillStyle = "#e3c89a";
    c.fillRect(x, y, TILE, TILE);
    c.strokeStyle = "#d2b07c";
    c.lineWidth = 1;
    c.beginPath();
    c.moveTo(x, y + 15.5); c.lineTo(x + TILE, y + 15.5);
    c.moveTo(x, y + 31.5); c.lineTo(x + TILE, y + 31.5);
    var off = (Math.floor(y / TILE) % 2) ? 8 : 20;
    c.moveTo(x + off + 0.5, y); c.lineTo(x + off + 0.5, y + 16);
    c.stroke();
  }

  var TileArt = {
    ".": function (c, x, y, f, o) { o ? grassBase(c, x, y) : caveBase(c, x, y); },
    ",": function (c, x, y, f, o) {
      grassBase(c, x, y);
      var ph = Math.floor(f / 40) % 2;
      var cols = ["#ff5e7a", "#ffd166"];
      var r = h2(x / TILE, y / TILE);
      function flower(fx, fy, col) {
        c.fillStyle = col;
        c.fillRect(fx - 2, fy, 2, 2); c.fillRect(fx + 2, fy, 2, 2);
        c.fillRect(fx, fy - 2, 2, 2); c.fillRect(fx, fy + 2, 2, 2);
        c.fillStyle = "#fff8dc";
        c.fillRect(fx, fy, 2, 2);
      }
      flower(x + 8, y + 9 + ph, cols[r % 2]);
      flower(x + 21, y + 20 - ph, cols[(r + 1) % 2]);
    },
    "G": function (c, x, y, f, o) {
      if (o) {
        grassBase(c, x, y);
        c.fillStyle = "#558b2f";
        for (var i = 0; i < 4; i++)
          for (var j = 0; j < 4; j++) {
            var bx = x + i * 8 + 1, by = y + j * 8 + 2;
            c.fillRect(bx, by + 3, 2, 4); c.fillRect(bx + 3, by, 2, 7); c.fillRect(bx + 6, by + 3, 2, 4);
          }
        c.fillStyle = "#33691e";
        c.fillRect(x + 4, y + 26, 2, 4); c.fillRect(x + 14, y + 10, 2, 5); c.fillRect(x + 24, y + 22, 2, 5);
      } else {
        caveBase(c, x, y);
        c.fillStyle = "#6c5f7a";
        for (var i2 = 0; i2 < 3; i2++) c.fillRect(x + 4 + i2 * 9, y + 6 + (i2 % 2) * 10, 5, 4);
        c.fillStyle = "#8e7f9e";
        c.fillRect(x + 8, y + 20, 4, 3);
      }
    },
    "P": function (c, x, y) {
      c.fillStyle = "#dcc188";
      c.fillRect(x, y, TILE, TILE);
      c.fillStyle = "#cbb077";
      var r = h2(x / TILE, y / TILE);
      c.fillRect(x + (r % 7) * 4, y + ((r * 3) % 7) * 4, 3, 2);
      c.fillRect(x + ((r * 5) % 7) * 4 + 2, y + ((r * 7) % 7) * 4 + 2, 2, 2);
    },
    "S": function (c, x, y) {
      c.fillStyle = "#f0dca8";
      c.fillRect(x, y, TILE, TILE);
      c.fillStyle = "#e3cd92";
      var r = h2(x / TILE, y / TILE);
      c.fillRect(x + (r % 6) * 5, y + ((r * 3) % 6) * 5 + 2, 4, 2);
    },
    "C": function (c, x, y) { caveBase(c, x, y); },
    "_": function (c, x, y) { floorBase(c, x, y); },
    "m": function (c, x, y) {
      floorBase(c, x, y);
      c.fillStyle = "#c62828";
      c.fillRect(x + 1, y + 1, TILE - 2, TILE - 2);
      c.fillStyle = "#e57373";
      c.fillRect(x + 4, y + 4, TILE - 8, TILE - 8);
      c.fillStyle = "#c62828";
      c.fillRect(x + 8, y + 8, TILE - 16, TILE - 16);
    },
    "E": function (c, x, y) {
      floorBase(c, x, y);
      c.fillStyle = "#9e9e9e";
      c.fillRect(x + 3, y + 3, TILE - 6, TILE - 6);
      c.fillStyle = "#757575";
      c.fillRect(x + 6, y + 6, TILE - 12, TILE - 12);
      c.fillStyle = "#eeeeee";
      c.beginPath();
      c.moveTo(x + 16, y + 24); c.lineTo(x + 10, y + 14); c.lineTo(x + 22, y + 14);
      c.fill();
    },
    "W": function (c, x, y, f) {
      c.fillStyle = "#4f9bf0";
      c.fillRect(x, y, TILE, TILE);
      var ph = Math.floor(f / 30) % 2;
      c.fillStyle = "#7ab8ff";
      var r = h2(x / TILE, y / TILE) % 3;
      c.fillRect(x + 4 + ph * 3, y + 7 + r * 2, 9, 2);
      c.fillRect(x + 18 - ph * 3, y + 21 - r * 2, 9, 2);
      c.fillStyle = "#3d7fd4";
      c.fillRect(x + 12, y + 14 + ph, 7, 2);
    },
    "T": function (c, x, y, f, o) {
      grassBase(c, x, y);
      c.fillStyle = "#6d4c41";
      c.fillRect(x + 12, y + 22, 8, 9);
      c.fillStyle = "#2e7d32";
      c.beginPath(); c.arc(x + 16, y + 12, 12, 0, 7); c.fill();
      c.beginPath(); c.arc(x + 8, y + 18, 8, 0, 7); c.fill();
      c.beginPath(); c.arc(x + 24, y + 18, 8, 0, 7); c.fill();
      c.fillStyle = "#43a047";
      c.beginPath(); c.arc(x + 13, y + 10, 7, 0, 7); c.fill();
      c.fillStyle = "#66bb6a";
      c.fillRect(x + 9, y + 7, 4, 3); c.fillRect(x + 17, y + 13, 4, 3);
    },
    "F": function (c, x, y, f, o) {
      o ? grassBase(c, x, y) : floorBase(c, x, y);
      c.fillStyle = "#a1887f";
      c.fillRect(x + 3, y + 8, 5, 18); c.fillRect(x + 24, y + 8, 5, 18);
      c.fillStyle = "#8d6e63";
      c.fillRect(x, y + 11, TILE, 4); c.fillRect(x, y + 19, TILE, 4);
      c.fillStyle = "#bcaaa4";
      c.fillRect(x + 3, y + 8, 5, 2); c.fillRect(x + 24, y + 8, 5, 2);
    },
    "M": function (c, x, y) {
      c.fillStyle = "#6d5d6e";
      c.fillRect(x, y, TILE, TILE);
      c.fillStyle = "#857286";
      c.fillRect(x + 2, y + 2, 13, 12); c.fillRect(x + 18, y + 16, 12, 13);
      c.fillStyle = "#9d8a9e";
      c.fillRect(x + 4, y + 4, 6, 4); c.fillRect(x + 20, y + 18, 5, 4);
      c.fillStyle = "#594a5a";
      c.fillRect(x + 16, y + 2, 14, 12); c.fillRect(x + 2, y + 16, 14, 13);
      c.fillStyle = "#6d5d6e";
      c.fillRect(x + 18, y + 4, 9, 7); c.fillRect(x + 4, y + 18, 9, 8);
    },
    "R": function (c, x, y) {
      c.fillStyle = "#d35450";
      c.fillRect(x, y, TILE, TILE);
      c.fillStyle = "#b03e3b";
      for (var i = 0; i < 4; i++) c.fillRect(x, y + i * 8 + 6, TILE, 3);
      c.fillStyle = "#e57f7b";
      c.fillRect(x, y, TILE, 3);
    },
    "B": function (c, x, y) {
      c.fillStyle = "#efe5cd";
      c.fillRect(x, y, TILE, TILE);
      c.strokeStyle = "#d6c8a8";
      c.lineWidth = 2;
      c.strokeRect(x + 1, y + 1, TILE - 2, TILE - 2);
      var r = h2(x / TILE, y / TILE);
      if (r % 3 === 0) {
        c.fillStyle = "#7ec8e3";
        c.fillRect(x + 8, y + 8, 16, 14);
        c.strokeStyle = "#5d6d7e";
        c.strokeRect(x + 8, y + 8, 16, 14);
        c.beginPath(); c.moveTo(x + 16, y + 8); c.lineTo(x + 16, y + 22); c.stroke();
        c.fillStyle = "#ffffff66";
        c.fillRect(x + 10, y + 10, 4, 8);
      }
    },
    "D": function (c, x, y) {
      c.fillStyle = "#efe5cd";
      c.fillRect(x, y, TILE, TILE);
      c.fillStyle = "#6d4c41";
      c.fillRect(x + 4, y + 4, 24, 28);
      c.fillStyle = "#8d6e63";
      c.fillRect(x + 7, y + 7, 18, 25);
      c.fillStyle = "#ffd54f";
      c.fillRect(x + 21, y + 18, 3, 4);
      c.fillStyle = "#5d4037";
      c.fillRect(x + 4, y + 4, 24, 2);
    },
    "#": function (c, x, y) {
      c.fillStyle = "#a98f68";
      c.fillRect(x, y, TILE, TILE);
      c.fillStyle = "#8a7354";
      c.fillRect(x, y + 24, TILE, 8);
      c.fillStyle = "#c2a87e";
      c.fillRect(x, y, TILE, 4);
      c.strokeStyle = "#94794f";
      c.lineWidth = 1;
      c.beginPath();
      c.moveTo(x + 10.5, y); c.lineTo(x + 10.5, y + 24);
      c.moveTo(x + 21.5, y); c.lineTo(x + 21.5, y + 24);
      c.stroke();
    },
    "b": function (c, x, y) {
      c.fillStyle = "#5d4037";
      c.fillRect(x, y, TILE, TILE);
      c.fillStyle = "#3e2723";
      c.fillRect(x + 2, y + 4, 28, 11); c.fillRect(x + 2, y + 18, 28, 11);
      var cols = ["#e53935", "#1e88e5", "#fdd835", "#43a047", "#8e24aa"];
      var r = h2(x / TILE, y / TILE);
      for (var i = 0; i < 6; i++) {
        c.fillStyle = cols[(r + i) % 5];
        c.fillRect(x + 4 + i * 4, y + 6, 3, 8);
        c.fillStyle = cols[(r + i + 2) % 5];
        c.fillRect(x + 4 + i * 4, y + 20, 3, 8);
      }
    },
    "c": function (c, x, y) {
      floorBase(c, x, y);
      c.fillStyle = "#8d6e63";
      c.fillRect(x, y + 6, TILE, 26);
      c.fillStyle = "#a1887f";
      c.fillRect(x, y + 6, TILE, 6);
      c.fillStyle = "#bcaaa4";
      c.fillRect(x, y + 6, TILE, 2);
      c.fillStyle = "#6d4c41";
      c.fillRect(x, y + 16, TILE, 2);
    },
    "t": function (c, x, y) {
      floorBase(c, x, y);
      c.fillStyle = "#78909c";
      c.fillRect(x + 2, y + 6, 28, 24);
      c.fillStyle = "#90a4ae";
      c.fillRect(x + 2, y + 6, 28, 6);
      c.fillStyle = "#37474f";
      c.fillRect(x + 6, y + 16, 20, 10);
      c.fillStyle = "#4dd0e1";
      c.fillRect(x + 8, y + 18, 10, 6);
      c.fillStyle = "#ef5350";
      c.fillRect(x + 21, y + 18, 3, 3);
      c.fillStyle = "#66bb6a";
      c.fillRect(x + 21, y + 23, 3, 3);
    },
    "h": function (c, x, y, f) {
      floorBase(c, x, y);
      c.fillStyle = "#eceff1";
      c.fillRect(x + 3, y + 4, 26, 26);
      c.fillStyle = "#cfd8dc";
      c.fillRect(x + 3, y + 24, 26, 6);
      var on = Math.floor(f / 25) % 2;
      c.fillStyle = on ? "#ef5350" : "#b71c1c";
      c.fillRect(x + 13, y + 8, 6, 14);
      c.fillRect(x + 9, y + 12, 14, 6);
      c.fillStyle = on ? "#66bb6a" : "#2e7d32";
      c.fillRect(x + 6, y + 25, 4, 3);
      c.fillRect(x + 22, y + 25, 4, 3);
    },
    "x": function (c, x, y, f, o) {
      o ? grassBase(c, x, y) : caveBase(c, x, y);
      c.fillStyle = "#9e9e9e";
      c.beginPath(); c.arc(x + 16, y + 18, 12, 0, 7); c.fill();
      c.fillStyle = "#bdbdbd";
      c.beginPath(); c.arc(x + 13, y + 15, 7, 0, 7); c.fill();
      c.fillStyle = "#757575";
      c.fillRect(x + 8, y + 24, 16, 4);
    }
  };

  var WALKABLE = { ".": 1, ",": 1, "G": 1, "P": 1, "S": 1, "C": 1, "_": 1, "m": 1, "D": 1, "E": 1 };

  // タイルセット(Guardian Monsters limbusdev_world2)の座標マップ [tx, ty] (16px単位)
  // b=ベース o=オーバーレイ tall=[tx,ty]の16x32を上のマスにはみ出して描画(木など)
  var TSDEF = {
    ".": { b: [0, 0] },
    ",": { b: [0, 0], o: [6, 5] },
    "G": { b: [0, 0], o: [6, 3], cave: { b: [26, 13], o: [11, 19] } },
    "P": { b: [2, 1] },
    "S": { b: [9, 12] },
    "C": { b: [26, 13] },
    "W": { b: [8, 8] },
    "T": { b: [0, 0], tall: [0, 19] },
    "F": { b: [0, 0], o: [1, 12] },
    "M": { b: [10, 24], cave: { b: [35, 0] } },
    "x": { b: [0, 0], o: [13, 14], cave: { b: [26, 13], o: [13, 14] } },
    "R": { b: [58, 15] },
    "B": { b: [58, 20] },
    "#": { b: [35, 0] },
    "_": { b: [25, 5] }
  };

  function drawTs(c, t, px, py) {
    var img = images.tileset;
    c.drawImage(img, t[0] * 16, t[1] * 16, 16, 16, px, py, TILE, TILE);
  }

  function drawTile(c, ch, px, py, frame, outdoor) {
    var img = images.tileset;
    var def = TSDEF[ch];
    if (img && def) {
      var d = (!outdoor && def.cave) ? def.cave : def;
      if (d.b) drawTs(c, d.b, px, py);
      if (d.o) drawTs(c, d.o, px, py);
      if (d.tall) {
        c.drawImage(img, d.tall[0] * 16, d.tall[1] * 16, 16, 32, px, py - TILE, TILE, TILE * 2);
      }
      if (ch === "W") {
        // なみの ゆらぎ
        var ph = Math.floor(frame / 30) % 2;
        var r = h2(px / TILE, py / TILE) % 3;
        c.fillStyle = "rgba(255,255,255,0.22)";
        c.fillRect(px + 4 + ph * 3, py + 7 + r * 3, 9, 2);
        c.fillRect(px + 18 - ph * 3, py + 22 - r * 3, 8, 2);
      }
      return;
    }
    if (img && ch === "D") {
      // とびら: タイルセットの かべ + プロシージャルのドア
      drawTs(c, TSDEF.B.b, px, py);
      drawDoorOverlay(c, px, py);
      return;
    }
    var fn = TileArt[ch] || TileArt["."];
    fn(c, px, py, frame, outdoor);
  }

  function drawDoorOverlay(c, x, y) {
    c.fillStyle = "#5d4037";
    c.fillRect(x + 4, y + 4, 24, 28);
    c.fillStyle = "#8d6e63";
    c.fillRect(x + 7, y + 7, 18, 25);
    c.fillStyle = "#ffd54f";
    c.fillRect(x + 21, y + 18, 3, 4);
    c.fillStyle = "#3e2723";
    c.fillRect(x + 4, y + 4, 24, 2);
  }

  function drawBall(c, x, y) {
    c.fillStyle = "#2b2017";
    c.beginPath(); c.arc(x + 16, y + 18, 9, 0, 7); c.fill();
    c.fillStyle = "#e53935";
    c.beginPath(); c.arc(x + 16, y + 18, 7.5, Math.PI, Math.PI * 2); c.fill();
    c.fillStyle = "#fafafa";
    c.beginPath(); c.arc(x + 16, y + 18, 7.5, 0, Math.PI); c.fill();
    c.fillStyle = "#2b2017";
    c.fillRect(x + 9, y + 17, 15, 2);
    c.fillStyle = "#fff";
    c.beginPath(); c.arc(x + 16, y + 18, 2.5, 0, 7); c.fill();
    c.strokeStyle = "#2b2017";
    c.stroke();
  }

  return {
    TILE: TILE,
    WALKABLE: WALKABLE,
    drawTile: drawTile,
    npcCanvas: npcCanvas,
    heroCanvas: heroCanvas,
    drawHero: drawHero,
    drawNPCImg: drawNPCImg,
    npcSheet: npcSheet,
    monsterCanvas: monsterCanvas,
    drawBall: drawBall,
    gridToCanvas: gridToCanvas,
    registerImage: registerImage,
    getImage: getImage
  };
})();
