#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""家の屋根/壁タイルを輝度構造ごと色変換し、同品質のテーマ建物タイルを作る。

PixelLabの map-object は透過スプライトになりがちなので、
ユーザーが気に入っている既存 R/B タイルをベースに再着色する。
"""
import os
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
REF_ROOF = os.path.join(ROOT, "assets", "gen", "ref", "roof_ref.png")
REF_WALL = os.path.join(ROOT, "assets", "gen", "ref", "wall_ref.png")
OUT = os.path.join(ROOT, "assets", "gen", "tiles")


def lerp(a, b, t):
    return int(a + (b - a) * t)


def recolor_by_luma(im, stops):
    """stops: list of (luma_threshold_0to1, (r,g,b)) sorted by threshold ascending.
    各ピクセルの輝度で stops 間を補間して再着色。アルファは維持。
    """
    out = Image.new("RGBA", im.size)
    px = im.load()
    op = out.load()
    w, h = im.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if a < 8:
                op[x, y] = (0, 0, 0, 0)
                continue
            luma = (0.299 * r + 0.587 * g + 0.114 * b) / 255.0
            # find segment
            if luma <= stops[0][0]:
                col = stops[0][1]
            elif luma >= stops[-1][0]:
                col = stops[-1][1]
            else:
                col = stops[0][1]
                for i in range(len(stops) - 1):
                    t0, c0 = stops[i]
                    t1, c1 = stops[i + 1]
                    if t0 <= luma <= t1:
                        t = 0 if t1 == t0 else (luma - t0) / (t1 - t0)
                        col = (lerp(c0[0], c1[0], t), lerp(c0[1], c1[1], t), lerp(c0[2], c1[2], t))
                        break
            op[x, y] = (col[0], col[1], col[2], 255)
    return out


def enhance_gloss(im, amount=18):
    """ハイライト帯を少し持ち上げて光沢感を足す"""
    out = im.copy()
    px = out.load()
    w, h = out.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if a < 8:
                continue
            luma = (r + g + b) / 3
            if luma > 160:
                f = min(1.0, (luma - 160) / 80.0) * amount
                px[x, y] = (min(255, int(r + f)), min(255, int(g + f)), min(255, int(b + f)), 255)
    return out


def make_wall_variant(wall, wall_stops, glass_rgb, frame_rgb=None):
    """壁は壁面を再着色し、窓ガラス部分(青系)は差し替え"""
    out = Image.new("RGBA", wall.size)
    px = wall.load()
    op = out.load()
    w, h = wall.size
    # 仮の壁色で全面再着色
    base = recolor_by_luma(wall, wall_stops)
    bp = base.load()
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if a < 8:
                op[x, y] = (0, 0, 0, 0)
                continue
            # ガラス判定: 青みが強い
            if b > r + 15 and b > g + 5 and b > 80:
                # ガラス内のハイライト(明るい青/白)
                luma = (r + g + b) / 3
                if luma > 180:
                    op[x, y] = (min(255, glass_rgb[0] + 70), min(255, glass_rgb[1] + 70), min(255, glass_rgb[2] + 50), 255)
                else:
                    dark = (max(0, glass_rgb[0] - 40), max(0, glass_rgb[1] - 30), max(0, glass_rgb[2] - 20))
                    # 対角ハイライト風
                    if x + y < 28:
                        op[x, y] = (min(255, glass_rgb[0] + 35), min(255, glass_rgb[1] + 35), min(255, glass_rgb[2] + 25), 255)
                    else:
                        op[x, y] = (*dark, 255)
            elif frame_rgb and abs(r - g) < 40 and r < 180 and r > 60 and b < r:
                # 木枠っぽい茶 → テーマ枠色
                luma = (r + g + b) / 3 / 255
                op[x, y] = (
                    max(0, min(255, int(frame_rgb[0] * (0.55 + 0.7 * luma)))),
                    max(0, min(255, int(frame_rgb[1] * (0.55 + 0.7 * luma)))),
                    max(0, min(255, int(frame_rgb[2] * (0.55 + 0.7 * luma)))),
                    255,
                )
            else:
                op[x, y] = bp[x, y]
    return out


def save(name, im):
    d = os.path.join(OUT, name)
    os.makedirs(d, exist_ok=True)
    path = os.path.join(d, "object.png")
    im.save(path)
    print("saved", path)


def main():
    roof = Image.open(REF_ROOF).convert("RGBA")
    wall = Image.open(REF_WALL).convert("RGBA")

    # 白病院屋根: 瓦の陰影を保った白〜ライトグレー
    mc_roof = enhance_gloss(recolor_by_luma(roof, [
        (0.0, (120, 128, 136)),
        (0.35, (180, 188, 196)),
        (0.55, (220, 226, 232)),
        (0.75, (245, 248, 250)),
        (1.0, (255, 255, 255)),
    ]), 22)
    save("mc_roof", mc_roof)

    mc_wall = enhance_gloss(make_wall_variant(
        wall,
        [(0.0, (170, 175, 180)), (0.45, (230, 233, 236)), (0.7, (245, 247, 248)), (1.0, (255, 255, 255))],
        glass_rgb=(100, 180, 230),
        frame_rgb=(140, 150, 160),
    ), 12)
    # 病院は足元の土汚れを薄くして清潔感を出す
    px = mc_wall.load()
    for y in range(26, 32):
        for x in range(32):
            r, g, b, a = px[x, y]
            if a > 200 and (r + g + b) / 3 < 200:
                px[x, y] = (235, 238, 240, 255)
    save("mc_wall", mc_wall)

    rock_roof = enhance_gloss(recolor_by_luma(roof, [
        (0.0, (70, 75, 82)),
        (0.35, (110, 118, 126)),
        (0.55, (145, 152, 160)),
        (0.75, (175, 182, 190)),
        (1.0, (210, 216, 222)),
    ]), 16)
    save("rock_roof", rock_roof)

    rock_wall = enhance_gloss(make_wall_variant(
        wall,
        [(0.0, (55, 58, 62)), (0.4, (95, 100, 108)), (0.65, (130, 136, 142)), (1.0, (170, 176, 182))],
        glass_rgb=(50, 55, 65),
        frame_rgb=(75, 70, 65),
    ), 10)
    save("rock_wall", rock_wall)

    elec_roof = enhance_gloss(recolor_by_luma(roof, [
        (0.0, (20, 28, 40)),
        (0.35, (40, 55, 75)),
        (0.55, (55, 70, 95)),
        (0.75, (90, 100, 70)),   # 黄みのハイライト帯
        (1.0, (255, 230, 80)),
    ]), 20)
    save("elec_roof", elec_roof)

    elec_wall = enhance_gloss(make_wall_variant(
        wall,
        [(0.0, (15, 25, 55)), (0.4, (30, 45, 95)), (0.65, (45, 60, 120)), (1.0, (70, 90, 150))],
        glass_rgb=(0, 220, 255),
        frame_rgb=(255, 220, 60),
    ), 18)
    save("elec_wall", elec_wall)

    ghost_roof = enhance_gloss(recolor_by_luma(roof, [
        (0.0, (25, 10, 45)),
        (0.35, (55, 30, 90)),
        (0.55, (90, 55, 140)),
        (0.75, (150, 120, 190)),
        (1.0, (220, 200, 255)),
    ]), 18)
    save("ghost_roof", ghost_roof)

    ghost_wall = enhance_gloss(make_wall_variant(
        wall,
        [(0.0, (20, 8, 40)), (0.4, (50, 25, 80)), (0.65, (80, 45, 120)), (1.0, (120, 90, 160))],
        glass_rgb=(220, 180, 255),
        frame_rgb=(100, 70, 140),
    ), 14)
    save("ghost_wall", ghost_wall)

    # プレビュー: 家と並べて 5x2
    tiles = [
        ("roof_ref", roof), ("wall_ref", wall),
        ("mc_roof", mc_roof), ("mc_wall", mc_wall),
        ("rock_roof", rock_roof), ("rock_wall", rock_wall),
        ("elec_roof", elec_roof), ("elec_wall", elec_wall),
        ("ghost_roof", ghost_roof), ("ghost_wall", ghost_wall),
    ]
    prev = Image.new("RGBA", (32 * 5, 32 * 2), (30, 30, 45, 255))
    for i, (_, im) in enumerate(tiles):
        prev.paste(im, ((i % 5) * 32, (i // 5) * 32))
    prev = prev.resize((prev.width * 4, prev.height * 4), Image.NEAREST)
    prev_path = os.path.join(ROOT, "assets", "gen", "preview", "buildings_v2.png")
    os.makedirs(os.path.dirname(prev_path), exist_ok=True)
    prev.save(prev_path)
    print("preview", prev_path)


if __name__ == "__main__":
    main()
