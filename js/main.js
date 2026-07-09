// 起動処理 + アセットプリロード
window.addEventListener("load", function () {
  var missing = [];
  if (!window.MONSTERS) missing.push("monsters");
  if (!window.MOVES) missing.push("moves");
  if (!window.MAPS) missing.push("maps");
  if (!window.MUSIC_TRACKS) missing.push("music");
  var c = document.getElementById("game").getContext("2d");
  if (missing.length) {
    c.fillStyle = "#200";
    c.fillRect(0, 0, 640, 576);
    c.fillStyle = "#f88";
    c.font = "20px sans-serif";
    c.fillText("データファイルがよみこめません: " + missing.join(", "), 40, 280);
    return;
  }

  // よみこむ画像: モンスター26種 + バトル背景
  var manifest = [];
  Object.keys(MONSTERS).forEach(function (id) {
    var sp = MONSTERS[id].sprite;
    if (typeof sp === "string") manifest.push(["m_" + sp, (sp.indexOf("ai_") === 0 ? "assets/ai/monsters/" : "assets/gm/monsters/") + sp + ".png"]);
  });
  ["grass", "forest", "cave"].forEach(function (b) {
    manifest.push(["bg_" + b, "assets/gm/backdrops/" + b + ".png"]);
  });
  manifest.push(["tileset", "assets/gm/tilesets/limbusdev_world2.png"]);
  manifest.push(["hero", "assets/people/hero.png"]);
  manifest.push(["npcsheet", "assets/people/npc.png"]);
  ["prof", "rival", "oldman", "oldwoman", "woman", "boy", "man", "champ", "leader1", "leader2", "leader3"].forEach(function (k) {
    manifest.push(["npc_" + k, "assets/people/npc_" + k + ".png"]);
  });
  ["prof", "rival", "leader1", "leader2", "leader3", "champ"].forEach(function (k) {
    manifest.push(["p_" + k, "assets/ai/people/" + k + ".png"]);
  });

  var total = manifest.length;
  var done = 0;
  function progress() {
    c.fillStyle = "#10122a";
    c.fillRect(0, 0, 640, 576);
    c.fillStyle = "#ffd95e";
    c.font = "bold 24px sans-serif";
    c.textAlign = "center";
    c.fillText("よみこみちゅう…", 320, 260);
    c.fillStyle = "#30304a";
    c.fillRect(170, 300, 300, 14);
    c.fillStyle = "#ffd95e";
    c.fillRect(172, 302, Math.round(296 * done / total), 10);
    c.textAlign = "left";
  }
  progress();

  function finish() {
    G.init();
    G.push(new TitleScene());
  }
  manifest.forEach(function (entry) {
    var img = new Image();
    img.onload = img.onerror = function () {
      SpriteLib.registerImage(entry[0], img);
      done++;
      progress();
      if (done === total) finish();
    };
    // base64バンドルがあれば優先 (file://起動でも動く)
    img.src = (window.ASSET_B64 && ASSET_B64[entry[0]]) ? ASSET_B64[entry[0]] : entry[1];
  });
  if (total === 0) finish();
});
