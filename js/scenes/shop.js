// ショップシーン
function ShopScene(stock, resolve) {
  this.stock = stock;
  this.resolve = resolve;
  this.idx = 0;
}
ShopScene.prototype.enter = function () {
  this.prevTrack = Audio2.currentTrack();
};
ShopScene.prototype.update = function () {
  var n = this.stock.length + 1; // +1 = やめる
  if (Input.p("down")) { this.idx = (this.idx + 1) % n; Audio2.sfx.select(); }
  if (Input.p("up")) { this.idx = (this.idx + n - 1) % n; Audio2.sfx.select(); }
  if (Input.p("b")) { this.close(); return; }
  if (Input.p("a")) {
    if (this.idx === this.stock.length) { this.close(); return; }
    var id = this.stock[this.idx];
    var item = ITEMS[id];
    var self = this;
    if (Game.money < item.price) {
      Audio2.sfx.cancel();
      Dialogue.show(["おかねが たりないよ。"]);
      return;
    }
    Audio2.sfx.confirm();
    Dialogue.choice(["1こ かう", "5こ かう", "やめる"]).then(function (ci) {
      if (ci < 0 || ci === 2) return;
      var count = ci === 0 ? 1 : 5;
      var cost = item.price * count;
      if (Game.money < cost) {
        Dialogue.show(["おかねが たりないよ。"]);
        return;
      }
      Game.money -= cost;
      Rules.addItem(id, count);
      Audio2.sfx.save();
      Dialogue.show([item.name + "を " + count + "こ かった!"]);
    });
  }
};
ShopScene.prototype.close = function () {
  Audio2.sfx.cancel();
  G.pop();
  if (this.resolve) this.resolve();
};
ShopScene.prototype.draw = function (c) {
  c.fillStyle = "#4e342e";
  c.fillRect(0, 0, G.W, G.H);
  G.textOutlined(c, "ショップ", 24, 16, 30, "#fff", "#222238");
  G.textOutlined(c, "しょじきん " + Game.money + "えん", G.W - 24, 22, 22, "#ffd95e", "#222238", "right");
  G.panel(c, 20, 70, G.W - 40, 420);
  for (var i = 0; i < this.stock.length; i++) {
    var item = ITEMS[this.stock[i]];
    var y = 96 + i * 48;
    if (i === this.idx) {
      c.fillStyle = "#e53935";
      c.beginPath();
      c.moveTo(40, y + 2); c.lineTo(40, y + 22); c.lineTo(54, y + 12);
      c.fill();
    }
    G.text(c, item.name, 66, y, 22, "#222238");
    G.text(c, item.price + "えん", 460, y, 22, "#444", "right");
    G.text(c, "もちもの x" + (Game.bag[this.stock[i]] || 0), G.W - 60, y, 19, "#888", "right");
  }
  var yEnd = 96 + this.stock.length * 48;
  if (this.idx === this.stock.length) {
    c.fillStyle = "#e53935";
    c.beginPath();
    c.moveTo(40, yEnd + 2); c.lineTo(40, yEnd + 22); c.lineTo(54, yEnd + 12);
    c.fill();
  }
  G.text(c, "やめる", 66, yEnd, 22, "#222238");
  // せつめい
  G.panel(c, 20, 500, G.W - 40, 60);
  if (this.idx < this.stock.length) {
    G.text(c, ITEMS[this.stock[this.idx]].desc, 44, 518, 19, "#222238");
  } else {
    G.text(c, "おみせを でる", 44, 518, 19, "#222238");
  }
};
