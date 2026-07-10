#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""PixelLab生成素材から 32px格子の新タイルセット assets/ai/tilesets/world_ai.png を合成する。

レイアウト (32px単位 [col,row]):
  [0,0] 草ベース(.)      [1,0] 道(P)        [2,0] 砂(S)        [3,0] 水(W)
  [4,0] 花overlay(,)     [5,0] 草むらoverlay(G) [6,0] 岩overlay(x) [7,0] 柵overlay(F)
  [0,1] 洞窟床(C)        [1,1] 岩壁(M)      [2,1] 室内床(_)     [3,1] 室内壁(#)
  [4,1] 屋根(R)          [5,1] 壁+窓(B)     [7,1]-[7,2] 木32x64(T tall)
"""
import glob
import os
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
G = os.path.join(ROOT, "assets", "gen", "tiles")
OUT_DIR = os.path.join(ROOT, "assets", "ai", "tilesets")


def cell(setname, cx, cy):
    im = Image.open(os.path.join(G, setname, "image.png")).convert("RGBA")
    return im.crop((cx * 32, cy * 32, cx * 32 + 32, cy * 32 + 32))


def obj(name):
    p = os.path.join(G, name, "object.png")
    if not os.path.exists(p):
        p = glob.glob(os.path.join(G, name, "*.png"))[0]
    return Image.open(p).convert("RGBA")


def main():
    ts = Image.new("RGBA", (256, 256), (0, 0, 0, 0))

    def put(img, col, row):
        ts.paste(img, (col * 32, row * 32))

    put(cell("grass_path_v2", 7, 0), 0, 0)   # 草
    put(cell("grass_path_v2", 3, 3), 1, 0)   # 道
    put(obj("sand"), 2, 0)                    # 砂
    put(cell("grass_water", 3, 3), 3, 0)      # 水
    put(obj("flowers"), 4, 0)                 # 花overlay
    put(obj("tallgrass"), 5, 0)               # 草むらoverlay
    put(obj("rock"), 6, 0)                    # 岩overlay
    put(obj("fence"), 7, 0)                   # 柵overlay
    put(cell("cave_floor_wall", 0, 0), 0, 1)  # 洞窟床
    put(cell("cave_floor_wall", 3, 3), 1, 1)  # 岩壁
    put(cell("indoor", 5, 2), 2, 1)           # 室内床
    put(cell("indoor", 0, 0), 3, 1)           # 室内壁
    put(obj("roof"), 4, 1)                    # 屋根
    put(obj("wallwin"), 5, 1)                 # 壁+窓
    tree = obj("tree")                        # 32x64
    ts.paste(tree, (7 * 32, 1 * 32))          # 木 (7,1)-(7,2)

    os.makedirs(OUT_DIR, exist_ok=True)
    out = os.path.join(OUT_DIR, "world_ai.png")
    ts.save(out)
    print("saved", out)
    prev = ts.resize((512, 512), Image.NEAREST)
    bg = Image.new("RGBA", prev.size, (30, 30, 45, 255))
    bg.paste(prev, (0, 0), prev)
    bg.convert("RGB").save(os.path.join(G, "world_ai_preview.png"))


if __name__ == "__main__":
    main()
