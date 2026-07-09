#!/usr/bin/env python3
"""
PixelLab API でドット絵アセットを生成する。
APIトークンは環境変数 PIXELLAB_TOKEN から読む（コードに書かない・コミットしない）。

使い方:
  # 残高確認
  python tools/pixellab_gen.py balance

  # テキストから単発生成（pixflux）。まず assets/gen/ に出す（レビュー用）
  python tools/pixellab_gen.py pixflux "cute green baby dragon, front view, rpg monster" assets/gen/test.png

  # 既存スプライトの絵柄に寄せて生成（bitforge, style_image でスタイル参照）
  python tools/pixellab_gen.py bitforge "fierce fire lizard, front view" assets/gm/monsters/3_0.png assets/gen/fire.png

環境変数の設定例:
  PowerShell:  $env:PIXELLAB_TOKEN = "あなたのトークン"
  Bash:        export PIXELLAB_TOKEN="あなたのトークン"
"""
import base64
import io
import os
import sys
import json
import urllib.request

BASE = "https://api.pixellab.ai/v2"


def _load_token():
    tok = os.environ.get("PIXELLAB_TOKEN", "")
    if tok:
        return tok
    # リポジトリ直下の .env から読む（.gitignore済み）
    env_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), ".env")
    if os.path.exists(env_path):
        for line in open(env_path, encoding="utf-8"):
            line = line.strip()
            if line.startswith("PIXELLAB_TOKEN="):
                return line.split("=", 1)[1].strip().strip('"').strip("'")
    return ""


TOKEN = _load_token()


def _post(path, payload):
    if not TOKEN:
        sys.exit("環境変数 PIXELLAB_TOKEN が未設定です。")
    req = urllib.request.Request(
        BASE + path,
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "Authorization": "Bearer " + TOKEN,
            "Content-Type": "application/json",
        },
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=180) as r:
        return json.loads(r.read().decode("utf-8"))


def _get(path):
    req = urllib.request.Request(BASE + path, headers={"Authorization": "Bearer " + TOKEN})
    with urllib.request.urlopen(req, timeout=60) as r:
        return json.loads(r.read().decode("utf-8"))


def _b64_of(path):
    with open(path, "rb") as f:
        return "data:image/png;base64," + base64.b64encode(f.read()).decode("ascii")


def _save_image(resp, out_path):
    b64 = resp["image"]["base64"]
    if "," in b64:
        b64 = b64.split(",", 1)[1]
    raw = base64.b64decode(b64)
    os.makedirs(os.path.dirname(out_path) or ".", exist_ok=True)
    # 必要なら128pxへ正規化（GMスプライトに合わせる）
    try:
        from PIL import Image
        im = Image.open(io.BytesIO(raw)).convert("RGBA")
        if im.size != (128, 128):
            im = im.resize((128, 128), Image.NEAREST)
        im.save(out_path)
    except ImportError:
        with open(out_path, "wb") as f:
            f.write(raw)
    usd = resp.get("usage", {}).get("usd")
    print(f"saved {out_path}" + (f"  (cost ${usd})" if usd is not None else ""))


def cmd_balance():
    try:
        print(json.dumps(_get("/balance"), ensure_ascii=False, indent=2))
    except Exception as e:
        print("balance取得エラー:", e)
        print("※ /balance が無い場合は https://api.pixellab.ai/mcp のダッシュボードで残高を確認してください。")


def cmd_pixflux(description, out_path, w=128, h=128):
    resp = _post("/create-image-pixflux", {
        "description": description,
        "image_size": {"width": w, "height": h},
        "no_background": True,
    })
    _save_image(resp, out_path)


def cmd_bitforge(description, style_path, out_path, w=128, h=128):
    # bitforgeは最大200x200。スタイル参照は128でOK
    resp = _post("/create-image-bitforge", {
        "description": description,
        "image_size": {"width": w, "height": h},
        "style_image": {"type": "base64", "base64": _b64_of(style_path)},
        "no_background": True,
    })
    _save_image(resp, out_path)


if __name__ == "__main__":
    args = sys.argv[1:]
    if not args:
        print(__doc__); sys.exit(0)
    cmd = args[0]
    if cmd == "balance":
        cmd_balance()
    elif cmd == "pixflux" and len(args) >= 3:
        cmd_pixflux(args[1], args[2])
    elif cmd == "bitforge" and len(args) >= 4:
        cmd_bitforge(args[1], args[2], args[3])
    else:
        print(__doc__); sys.exit(1)
