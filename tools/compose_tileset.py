#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""PixelLab生成素材から 32px格子の新タイルセット assets/ai/tilesets/world_ai.png を合成する。

レイアウト (32px単位 [col,row]):
  [0,0] 草ベース(.)      [1,0] 道(P)        [2,0] 砂(S)        [3,0] 水(W)
  [4,0] 花overlay(,)     [5,0] 草むらoverlay(G) [6,0] 岩overlay(x) [7,0] 柵overlay(F)
  [0,1] 洞窟床(C)        [1,1] 岩壁(M)      [2,1] 室内床(_)     [3,1] 室内壁(#)
  [4,1] 屋根(R)          [5,1] 壁+窓(B)     [7,1]-[7,2] 木32x64(T tall)
  [0,3] MC屋根(H)        [1,3] MC壁(K)
  [2,3] いわ屋根(Y)      [3,3] いわ壁(Z)
  [4,3] でんき屋根       [5,3] でんき壁
  [6,3] ゴースト屋根     [7,3] ゴースト壁
  ※ row2 の [7,1]-[7,2] は木(T)のためテーマ建物は row3
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
        p = os.path.join(G, name, "image.png")
    if not os.path.exists(p):
        p = glob.glob(os.path.join(G, name, "*.png"))[0]
    im = Image.open(p).convert("RGBA")
    if im.size != (32, 32) and name != "tree":
        # 透過オブジェクトは不透明ベースに載せてタイル化
        base = Image.new("RGBA", (32, 32), (40, 40, 50, 255))
        im2 = im.resize((32, 32), Image.NEAREST) if im.size != (32, 32) else im
        base.paste(im2, (0, 0), im2)
        return base
    return im


def main():
    ts = Image.new("RGBA", (256, 256), (0, 0, 0, 0))

    def put(img, col, row):
        # 32x32に正規化
        if img.size != (32, 32):
            img = img.resize((32, 32), Image.NEAREST)
        ts.paste(img, (col * 32, row * 32), img if img.mode == "RGBA" else None)

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

    # テーマ建物 (row 3) — 木(T)が [7,1]-[7,2] を使うため
    put(obj("mc_roof"), 0, 3)
    put(obj("mc_wall"), 1, 3)
    put(obj("rock_roof"), 2, 3)
    put(obj("rock_wall"), 3, 3)
    put(obj("elec_roof"), 4, 3)
    put(obj("elec_wall"), 5, 3)
    put(obj("ghost_roof"), 6, 3)
    put(obj("ghost_wall"), 7, 3)

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
