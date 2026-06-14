// 開発用の静的ファイルサーバー + スクリーンショット受信 (テスト用)
var http = require("http");
var fs = require("fs");
var path = require("path");
var root = path.join(__dirname, "..");
var MIME = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8", ".md": "text/plain; charset=utf-8" };

http.createServer(function (req, res) {
  var urlPath = decodeURIComponent(req.url.split("?")[0]);
  if (req.method === "POST" && urlPath === "/snap") {
    var body = "";
    req.on("data", function (c) { body += c; });
    req.on("end", function () {
      var b64 = body.replace(/^data:image\/png;base64,/, "");
      fs.writeFileSync(path.join(__dirname, "snap.png"), Buffer.from(b64, "base64"));
      res.writeHead(200, { "Content-Type": "text/plain", "Access-Control-Allow-Origin": "*" });
      res.end("saved");
    });
    return;
  }
  if (urlPath === "/") urlPath = "/index.html";
  var file = path.join(root, urlPath);
  if (file.indexOf(root) !== 0) { res.writeHead(403); res.end(); return; }
  fs.readFile(file, function (err, data) {
    if (err) { res.writeHead(404); res.end("not found"); return; }
    res.writeHead(200, {
      "Content-Type": MIME[path.extname(file)] || "application/octet-stream",
      "Cache-Control": "no-store"
    });
    res.end(data);
  });
}).listen(8766, function () {
  console.log("snap server on http://localhost:8766");
});
