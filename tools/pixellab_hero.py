#!/usr/bin/env python3
"""
PixelLab APIで主人公スプライトを生成し、ゲーム用シートに合成する。

手順（トークンは .env の PIXELLAB_TOKEN）:
  1) python tools/pixellab_hero.py create "説明文"   # キャラ生成ジョブ開始 → character_id 表示
  2) python tools/pixellab_hero.py fetch <character_id>   # 4方向+アニメを assets/gen/hero/ に保存
  3) python tools/pixellab_hero.py animate <character_id> walk   # 歩きアニメ生成（必要なら run も）
  4) python tools/pixellab_hero.py assemble   # assets/gen/hero/ からシート合成 → assets/gen/hero_sheet.png

ゲームのシート仕様 (js/engine/sprites.js drawHero):
  セル: 幅16×高32（新シートでは32×64に拡大し、drawHero側も更新する）
  行: down=0, right=1, up=2, left=3
  列: 歩き=0..3 / 走り=5..7
"""
import base64
import io
import json
import os
import sys
import time
import urllib.request

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from pixellab_gen import _load_token, BASE  # noqa: E402

TOKEN = _load_token()
GEN_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "assets", "gen", "hero")

# PixelLabの方角 → ゲームの行
DIR_TO_ROW = {"south": 0, "east": 1, "north": 2, "west": 3}


def _req(method, path, payload=None):
    if not TOKEN:
        sys.exit("PIXELLAB_TOKEN が未設定です（.env に PIXELLAB_TOKEN=... を書いてください）")
    data = json.dumps(payload).encode("utf-8") if payload is not None else None
    req = urllib.request.Request(
        BASE + path, data=data, method=method,
        headers={"Authorization": "Bearer " + TOKEN, "Content-Type": "application/json"},
    )
    try:
        with urllib.request.urlopen(req, timeout=300) as r:
            return json.loads(r.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8", "replace")
        sys.exit(f"HTTP {e.code} {path}\n{body[:2000]}")


def _save_b64(b64, path):
    if "," in b64:
        b64 = b64.split(",", 1)[1]
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "wb") as f:
        f.write(base64.b64decode(b64))
    print("saved", path)


def _walk_images(obj, found, prefix=""):
    """レスポンス構造を再帰的に探索して base64 画像を全部拾う（スキーマ差異に強くする）"""
    if isinstance(obj, dict):
        if "base64" in obj and isinstance(obj["base64"], str) and len(obj["base64"]) > 100:
            found.append((prefix.strip("/"), obj["base64"]))
            return
        for k, v in obj.items():
            _walk_images(v, found, prefix + "/" + str(k))
    elif isinstance(obj, list):
        for i, v in enumerate(obj):
            _walk_images(v, found, prefix + "/" + str(i))


def cmd_create(description):
    payload = {
        "description": description,
        "image_size": {"width": 32, "height": 32},
        "view": "low_top_down",
        "proportions": {"type": "preset", "name": "chibi"},
    }
    resp = _req("POST", "/create-character-with-4-directions", payload)
    print(json.dumps(resp, ensure_ascii=False, indent=2)[:1500])
    os.makedirs(GEN_DIR, exist_ok=True)
    with open(os.path.join(GEN_DIR, "create_resp.json"), "w", encoding="utf-8") as f:
        json.dump(resp, f, ensure_ascii=False, indent=2)


def cmd_job(job_id):
    resp = _req("GET", f"/background-jobs/{job_id}")
    print(json.dumps({k: v for k, v in resp.items() if k != "last_response"}, ensure_ascii=False, indent=2)[:1200])
    if resp.get("status") == "completed":
        with open(os.path.join(GEN_DIR, f"job_{job_id}.json"), "w", encoding="utf-8") as f:
            json.dump(resp, f, ensure_ascii=False, indent=2)
        found = []
        _walk_images(resp, found)
        for name, b64 in found:
            safe = name.replace("/", "_")[:80]
            _save_b64(b64, os.path.join(GEN_DIR, f"job_{safe}.png"))
        print(f"{len(found)} images extracted")


def cmd_fetch(character_id):
    resp = _req("GET", f"/characters/{character_id}")
    os.makedirs(GEN_DIR, exist_ok=True)
    with open(os.path.join(GEN_DIR, "character.json"), "w", encoding="utf-8") as f:
        json.dump(resp, f, ensure_ascii=False, indent=2)
    found = []
    _walk_images(resp, found)
    for name, b64 in found:
        safe = name.replace("/", "_")[:100]
        _save_b64(b64, os.path.join(GEN_DIR, f"{safe}.png"))
    print(f"{len(found)} images extracted -> {GEN_DIR}")


def cmd_animate(character_id, action):
    payload = {"character_id": character_id, "action": action, "mode": "template"}
    resp = _req("POST", "/characters/animations", payload)
    print(json.dumps(resp, ensure_ascii=False, indent=2)[:1200])


def cmd_assemble():
    """assets/gen/hero/ の 方向別フレーム(手動リネーム済み: walk_{dir}_{i}.png, run_{dir}_{i}.png)
    から 32x64セル・8列×4行 のシートを合成"""
    from PIL import Image
    CW, CH = 32, 64
    sheet = Image.new("RGBA", (CW * 8, CH * 4), (0, 0, 0, 0))

    def paste(img_path, col, row):
        im = Image.open(img_path).convert("RGBA")
        if im.size != (32, 32):
            im = im.resize((32, 32), Image.NEAREST)
        sheet.paste(im, (col * CW, row * CH + (CH - 32)), im)

    ok = 0
    for d, row in [("down", 0), ("right", 1), ("up", 2), ("left", 3)]:
        for i in range(4):
            p = os.path.join(GEN_DIR, f"walk_{d}_{i}.png")
            if os.path.exists(p):
                paste(p, i, row); ok += 1
        for i in range(3):
            p = os.path.join(GEN_DIR, f"run_{d}_{i}.png")
            if os.path.exists(p):
                paste(p, 5 + i, row); ok += 1
    out = os.path.join(os.path.dirname(GEN_DIR), "hero_sheet.png")
    sheet.save(out)
    print(f"assembled {ok} frames -> {out}")


if __name__ == "__main__":
    a = sys.argv[1:]
    if not a:
        print(__doc__); sys.exit(0)
    if a[0] == "create" and len(a) >= 2:
        cmd_create(a[1])
    elif a[0] == "job" and len(a) >= 2:
        cmd_job(a[1])
    elif a[0] == "fetch" and len(a) >= 2:
        cmd_fetch(a[1])
    elif a[0] == "animate" and len(a) >= 3:
        cmd_animate(a[1], a[2])
    elif a[0] == "assemble":
        cmd_assemble()
    else:
        print(__doc__); sys.exit(1)
