#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""assets/gen/npc_src/<key>/*/rotations/{south,east,north,west}.png を読み、
32x64セル x 4行(down,right,up,left) のNPCシートを assets/people/npc_<key>.png に出力する。
"""
import glob
import os
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "assets", "gen", "npc_src")
OUT_DIR = os.path.join(ROOT, "assets", "people")

# ゲームの行順: down=0, right=1, up=2, left=3
ROW_FROM_DIR = {"south": 0, "east": 1, "north": 2, "west": 3}
CW, CH = 32, 64


def find_rotations_dir(key):
    hits = glob.glob(os.path.join(SRC, key, "*", "rotations"))
    if not hits:
        raise SystemExit(f"rotations dir not found for {key}")
    return hits[0]


def build_one(key):
    rdir = find_rotations_dir(key)
    frames = {}
    bbox = None
    for d in ROW_FROM_DIR:
        im = Image.open(os.path.join(rdir, f"{d}.png")).convert("RGBA")
        frames[d] = im
        b = im.getbbox()
        if b:
            bbox = b if bbox is None else (
                min(bbox[0], b[0]), min(bbox[1], b[1]),
                max(bbox[2], b[2]), max(bbox[3], b[3]))
    l, t, r, btm = bbox
    w, h = r - l, btm - t
    s = min(CW / w, CH / h)
    nw, nh = max(1, round(w * s)), max(1, round(h * s))

    sheet = Image.new("RGBA", (CW, CH * 4), (0, 0, 0, 0))
    for d, row in ROW_FROM_DIR.items():
        crop = frames[d].crop(bbox).resize((nw, nh), Image.NEAREST)
        x = (CW - nw) // 2
        y = row * CH + (CH - nh)
        sheet.paste(crop, (x, y), crop)

    out_path = os.path.join(OUT_DIR, f"npc_{key}.png")
    sheet.save(out_path)
    print(f"saved {out_path}  (frame {nw}x{nh})")
    return out_path


if __name__ == "__main__":
    keys = ["prof", "rival", "oldman", "oldwoman", "girl", "woman", "boy", "man"]
    os.makedirs(OUT_DIR, exist_ok=True)
    for k in keys:
        build_one(k)
