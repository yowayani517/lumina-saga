// 静的配信 + スクリーンショット保存サーバ (撮影用・READMEには含めない)
// POST /__save?name=foo.png  body=base64(dataURL可)  -> docs/screenshots/foo.png
var http = require("http");
var fs = require("fs");
var path = require("path");
var root = path.join(__dirname, "..");
var shotDir = path.join(root, "docs", "screenshots");
fs.mkdirSync(shotDir, { recursive: true });

var MIME = {
  ".html": "text/html", ".js": "application/javascript", ".css": "text/css",
  ".png": "image/png", ".json": "application/json", ".gif": "image/gif"
};

http.createServer(function (req, res) {
  if (req.method === "POST" && req.url.indexOf("/__save") === 0) {
    var u = new URL(req.url, "http://localhost");
    var name = (u.searchParams.get("name") || "shot.png").replace(/[^a-zA-Z0-9_.-]/g, "");
    var body = "";
    req.on("data", function (c) { body += c; });
    req.on("end", function () {
      var b64 = body.replace(/^data:image\/\w+;base64,/, "");
      fs.writeFileSync(path.join(shotDir, name), Buffer.from(b64, "base64"));
      res.writeHead(200, { "Access-Control-Allow-Origin": "*" });
      res.end("ok");
    });
    return;
  }
  var p = decodeURIComponent(req.url.split("?")[0]);
  if (p === "/") p = "/index.html";
  var fp = path.join(root, p);
  fs.readFile(fp, function (err, data) {
    if (err) { res.writeHead(404); res.end("404"); return; }
    res.writeHead(200, { "Content-Type": MIME[path.extname(fp)] || "application/octet-stream" });
    res.end(data);
  });
}).listen(8770, function () { console.log("shotserver on 8770"); });
