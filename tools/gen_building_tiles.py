#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""既存屋根/壁のスタイルに寄せて、シームレスな建物タイルを bitforge で生成する。

  python tools/gen_building_tiles.py
出力: assets/gen/tiles/<name>/object.png (32x32 不透明)
"""
import base64
import io
import json
import os
import sys
import time
import urllib.request

from PIL import Image

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from pixellab_gen import TOKEN, BASE, _b64_of  # noqa: E402

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "assets", "gen", "tiles")
REF_ROOF = os.path.join(ROOT, "assets", "gen", "ref", "roof_ref.png")
REF_WALL = os.path.join(ROOT, "assets", "gen", "ref", "wall_ref.png")

# 右の家と同じ「光沢のあるシームレス瓦/壁」品質を狙う。ロゴや大きな十字は禁止。
JOBS = [
    ("mc_roof", REF_ROOF,
     "seamless 32x32 top-down RPG roof tile, white ceramic hospital shingles, soft gray grout, glossy specular highlights, same pixel shading style as reference, NO crosses NO logos NO icons, fully opaque square filling entire frame"),
    ("mc_wall", REF_WALL,
     "seamless 32x32 top-down RPG building wall tile, clean white plaster hospital wall, one small blue glass window with wooden frame and glossy glass highlight, soft shading, same style as reference, tiny red cross only inside window optional, fully opaque"),
    ("rock_roof", REF_ROOF,
     "seamless 32x32 top-down RPG roof tile, sturdy gray stone slab shingles, rocky gym, carved stone texture, soft gloss highlights, same pixel shading style as reference, NO icons, fully opaque square"),
    ("rock_wall", REF_WALL,
     "seamless 32x32 top-down RPG building wall tile, sturdy brown-gray stone brick gym wall, one small dark window with stone frame, soft shading and highlights, same style as reference, fully opaque"),
    ("elec_roof", REF_ROOF,
     "seamless 32x32 top-down RPG roof tile, dark metal electric gym shingles with subtle yellow edge highlights, cool glossy finish, same pixel shading style as reference, NO large lightning bolts, fully opaque square"),
    ("elec_wall", REF_WALL,
     "seamless 32x32 top-down RPG building wall tile, dark navy metal gym wall, one cyan glowing glass window with glossy highlight, yellow trim line, same style as reference, fully opaque"),
    ("ghost_roof", REF_ROOF,
     "seamless 32x32 top-down RPG roof tile, deep purple misty shingles for ghost gym, soft violet gloss highlights, eerie but polished, same pixel shading style as reference, NO skulls NO icons, fully opaque square"),
    ("ghost_wall", REF_WALL,
     "seamless 32x32 top-down RPG building wall tile, dark violet stone ghost gym wall, one pale lavender glowing window with glossy glass, soft shading, same style as reference, fully opaque"),
]


def _post(path, payload):
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


def _save_tile(resp, out_path):
    img = resp.get("image")
    if isinstance(img, dict):
        b64 = img.get("base64", "")
    else:
        b64 = img or ""
    if "," in b64:
        b64 = b64.split(",", 1)[1]
    raw = base64.b64decode(b64)
    im = Image.open(io.BytesIO(raw)).convert("RGBA")
    # 32x32へ。透過は不透明ベースに合成（家タイルと同じ使い方）
    if im.size != (32, 32):
        im = im.resize((32, 32), Image.NEAREST)
    # ほぼ透明なら失敗扱い
    opaque = sum(1 for p in im.getdata() if p[3] > 200)
    if opaque < 200:
        # 黒背景に載せるのではなく、壁/屋根らしいベース色で埋める
        base = Image.new("RGBA", (32, 32), (200, 200, 200, 255))
        base.paste(im, (0, 0), im)
        im = base
    else:
        # 端の透明を近傍色で埋めてシームレスに
        bg = Image.new("RGBA", (32, 32), im.getpixel((16, 16)))
        bg.paste(im, (0, 0), im)
        im = bg
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    im.save(out_path)
    print("saved", out_path, "opaque~", opaque)


def gen_one(name, style_path, desc):
    print("===", name, flush=True)
    resp = _post("/create-image-bitforge", {
        "description": desc,
        "image_size": {"width": 32, "height": 32},
        "style_image": {"type": "base64", "base64": _b64_of(style_path)},
        "no_background": False,
    })
    d = os.path.join(OUT, name)
    os.makedirs(d, exist_ok=True)
    with open(os.path.join(d, "resp.json"), "w", encoding="utf-8") as f:
        json.dump({k: v for k, v in resp.items() if k != "image"}, f, ensure_ascii=False, indent=2)
    _save_tile(resp, os.path.join(d, "object.png"))
    usd = (resp.get("usage") or {}).get("usd")
    if usd is not None:
        print("  cost $", usd)


def main():
    if not TOKEN:
        sys.exit("PIXELLAB_TOKEN missing")
    only = set(sys.argv[1:]) if len(sys.argv) > 1 else None
    for name, style, desc in JOBS:
        if only and name not in only:
            continue
        try:
            gen_one(name, style, desc)
        except Exception as e:
            print("FAIL", name, e)
            time.sleep(2)
        time.sleep(1)


if __name__ == "__main__":
    main()
