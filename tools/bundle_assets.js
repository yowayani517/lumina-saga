// 画像アセットを base64 で js/data/assets_b64.js に埋め込む (file:// 対応)
var fs = require("fs");
var path = require("path");
var root = path.join(__dirname, "..");

eval(fs.readFileSync(path.join(root, "js/data/moves.js"), "utf8"));
eval(fs.readFileSync(path.join(root, "js/data/monsters.js"), "utf8"));

var entries = [];
Object.keys(MONSTERS).forEach(function (id) {
  var sp = MONSTERS[id].sprite;
  if (typeof sp === "string") entries.push(["m_" + sp, (sp.indexOf("ai_") === 0 ? "assets/ai/monsters/" : "assets/gm/monsters/") + sp + ".png"]);
});
["grass", "forest", "cave"].forEach(function (b) {
  entries.push(["bg_" + b, "assets/gm/backdrops/" + b + ".png"]);
});
entries.push(["tileset", "assets/ai/tilesets/world_ai.png"]);
entries.push(["hero", "assets/people/hero.png"]);
entries.push(["npcsheet", "assets/people/npc.png"]);
["prof", "rival", "oldman", "oldwoman", "woman", "boy", "man", "champ", "leader1", "leader2", "leader3", "nurse", "girl"].forEach(function (k) {
  entries.push(["npc_" + k, "assets/people/npc_" + k + ".png"]);
});
["prof", "rival", "leader1", "leader2", "leader3", "champ"].forEach(function (k) {
  entries.push(["p_" + k, "assets/ai/people/" + k + ".png"]);
});

var out = "// 自動生成: tools/bundle_assets.js (file://起動でも画像が動くようbase64埋め込み)\n";
out += "var ASSET_B64 = {\n";
var total = 0;
entries.forEach(function (e, i) {
  var buf = fs.readFileSync(path.join(root, e[1]));
  total += buf.length;
  out += '  "' + e[0] + '": "data:image/png;base64,' + buf.toString("base64") + '"' + (i < entries.length - 1 ? "," : "") + "\n";
});
out += "};\n";
fs.writeFileSync(path.join(root, "js/data/assets_b64.js"), out);
console.log("bundled " + entries.length + " images, raw total " + Math.round(total / 1024) + " KB");
