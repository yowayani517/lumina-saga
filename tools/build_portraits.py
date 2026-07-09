#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Downloads/ の JPG立ち絵(白背景・全身)を、背景透過した256x256 RGBA PNGに変換して
assets/ai/people/<key>.png に配置する。
"""
import os
from PIL import Image, ImageFilter

DL = os.path.join(os.path.expanduser("~"), "Downloads")
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_DIR = os.path.join(ROOT, "assets", "ai", "people")
DRAFT_DIR = os.path.join(ROOT, "assets", "gen", "portraits_draft")
SIZE = 256
WHITE_THRESH = 245  # これ以上明るい画素は背景候補


def flood_remove_white_bg(im):
    """外周から白背景をflood fillして透過。キャラ内部の白(服等)は残す。"""
    im = im.convert("RGBA")
    w, h = im.size
    px = im.load()
    visited = bytearray(w * h)
    stack = []
    for x in range(w):
        stack.append((x, 0)); stack.append((x, h - 1))
    for y in range(h):
        stack.append((0, y)); stack.append((w - 1, y))

    def is_bg(r, g, b):
        return r >= WHITE_THRESH and g >= WHITE_THRESH and b >= WHITE_THRESH

    while stack:
        x, y = stack.pop()
        if x < 0 or x >= w or y < 0 or y >= h:
            continue
        idx = y * w + x
        if visited[idx]:
            continue
        visited[idx] = 1
        r, g, b, a = px[x, y]
        if not is_bg(r, g, b):
            continue
        px[x, y] = (r, g, b, 0)
        stack.append((x + 1, y)); stack.append((x - 1, y))
        stack.append((x, y + 1)); stack.append((x, y - 1))
    return im


def soften_edge(im):
    """輪郭のアンチエイリアス縁に残る白フチを、アルファに応じて縮小させる"""
    r, g, b, a = im.split()
    a2 = a.filter(ImageFilter.MinFilter(3))
    im.putalpha(a2)
    return im


def build_one(key, src_ext="jpg", out_dir=None):
    src = os.path.join(DL, f"{key}.{src_ext}")
    im = Image.open(src).convert("RGB")
    im = flood_remove_white_bg(im)
    im = soften_edge(im)
    bbox = im.getbbox()
    if bbox:
        im = im.crop(bbox)
    w, h = im.size
    scale = min(SIZE / w, SIZE / h)
    nw, nh = max(1, round(w * scale)), max(1, round(h * scale))
    im = im.resize((nw, nh), Image.LANCZOS)
    canvas = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
    x = (SIZE - nw) // 2
    y = SIZE - nh  # 下寄せ(足元を枠下端に)
    canvas.paste(im, (x, y), im)
    out_path = os.path.join(out_dir or OUT_DIR, f"{key}.png")
    canvas.save(out_path)
    print(f"saved {out_path}  ({nw}x{nh} placed)")


if __name__ == "__main__":
    import sys
    keys = sys.argv[1:] or ["prof", "champ", "leader1", "leader2", "leader3"]
    os.makedirs(DRAFT_DIR, exist_ok=True)
    for k in keys:
        build_one(k, out_dir=DRAFT_DIR)
