// タイプ定義と相性表 (担当: リード)
var TYPES = {
  normal:   { name: "ノーマル", color: "#9aa0a6" },
  fire:     { name: "ほのお",   color: "#f08030" },
  water:    { name: "みず",     color: "#6890f0" },
  grass:    { name: "くさ",     color: "#78c850" },
  electric: { name: "でんき",   color: "#f8d030" },
  fighting: { name: "かくとう", color: "#c03028" },
  flying:   { name: "ひこう",   color: "#a890f0" },
  psychic:  { name: "エスパー", color: "#f85888" },
  rock:     { name: "いわ",     color: "#b8a038" },
  ghost:    { name: "ゴースト", color: "#705898" }
};

// TYPE_CHART[攻撃タイプ][防御タイプ] = 倍率 (未記載は1.0)
var TYPE_CHART = {
  normal:   { rock: 0.5, ghost: 0 },
  fire:     { fire: 0.5, water: 0.5, grass: 2, rock: 0.5 },
  water:    { fire: 2, water: 0.5, grass: 0.5, rock: 2 },
  grass:    { fire: 0.5, water: 2, grass: 0.5, flying: 0.5, rock: 2 },
  electric: { water: 2, grass: 0.5, electric: 0.5, flying: 2, rock: 0.5 },
  fighting: { normal: 2, flying: 0.5, psychic: 0.5, rock: 2, ghost: 0 },
  flying:   { grass: 2, electric: 0.5, fighting: 2, rock: 0.5 },
  psychic:  { fighting: 2, psychic: 0.5 },
  rock:     { fire: 2, fighting: 0.5, flying: 2 },
  ghost:    { normal: 0, psychic: 2, ghost: 2 }
};

function typeMultiplier(attType, defTypes) {
  var m = 1;
  for (var i = 0; i < defTypes.length; i++) {
    var row = TYPE_CHART[attType] || {};
    var v = row[defTypes[i]];
    if (v !== undefined) m *= v;
  }
  return m;
}
