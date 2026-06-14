// アイテム定義 (担当: リード)
var ITEMS = {
  capsule:      { name: "モンスターカプセル", price: 200,  kind: "ball",   ballMod: 1.0,
                  desc: "やせいの モンスターを つかまえる カプセル" },
  greatcapsule: { name: "スーパーカプセル",   price: 600,  kind: "ball",   ballMod: 1.8,
                  desc: "つかまえやすさが アップした カプセル" },
  hypercapsule: { name: "ハイパーカプセル",   price: 1200, kind: "ball",   ballMod: 2.5,
                  desc: "とても つかまえやすい さいこうきゅうの カプセル" },
  potion:       { name: "キズぐすり",         price: 300,  kind: "heal",   amount: 30,
                  desc: "モンスターの HPを 30 かいふくする" },
  superpotion:  { name: "いいキズぐすり",     price: 700,  kind: "heal",   amount: 80,
                  desc: "モンスターの HPを 80 かいふくする" },
  hyperpotion:  { name: "すごいキズぐすり",   price: 1500, kind: "heal",   amount: 200,
                  desc: "モンスターの HPを 200 かいふくする" },
  fullheal:     { name: "なんでもなおし",     price: 600,  kind: "status",
                  desc: "じょうたい いじょうを すべて なおす" },
  revive:       { name: "げんきのかけら",     price: 1500, kind: "revive",
                  desc: "ひんしの モンスターを HPはんぶんで ふっかつさせる" }
};
