#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""主人公シート合成（歩きアニメ版）

ソース:
  south: assets/gen/hero/walk_down_0..7   (テンプレート歩行 8コマ)
  east : assets/gen/hero/walk_right_0..7  (テンプレート歩行 8コマ)
  west : east の左右反転
  north: assets/gen/hero/awt_north_*.png があればそれ、なければ静止画ボブ

重要: 全フレーム共通の union bbox で単一スケール
      （フレームごとに縮尺を変えると「動くと縮む」バグになる）
出力: assets/people/hero.png (32x64セル×8列4行)
      列0-3=歩き / 列5-7=ダッシュ
"""
import glob
import os
from PIL import Image, ImageOps

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
G = os.path.join(ROOT, "assets", "gen", "hero")
STILL_N = os.path.join(ROOT, "assets", "gen", "npc_src",
                       "hero_new", "young_monster_trainer_protagonist_ordinary",
                       "rotations", "north.png")
CW, CH = 32, 64


def load(p):
    return Image.open(p).convert("RGBA")


def main():
    south = [load(os.path.join(G, f"walk_down_{i}.png")) for i in range(8)]
    east = [load(os.path.join(G, f"walk_right_{i}.png")) for i in range(8)]
    west = [ImageOps.mirror(f) for f in east]

    awt = sorted(glob.glob(os.path.join(G, "awt_north_*.png")))
    if awt:
        north = [load(p) for p in awt]
        north_mode = f"v3 ({len(north)} frames)"
    else:
        # フォールバック: 静止画(64pxパディング版と同処理)を全コマに
        im = load(STILL_N)
        b = im.getbbox(); im = im.crop(b)
        w, h = im.size
        s = 48.0 / h
        im = im.resize((max(1, round(w * s)), 48), Image.NEAREST)
        cv = Image.new("RGBA", (64, 64), (0, 0, 0, 0))
        cv.paste(im, ((64 - im.width) // 2, 64 - 8 - im.height), im)
        north = [cv] * 8
        north_mode = "still (bob)"
    print("north source:", north_mode)

    dirs = {"south": south, "east": east, "north": north, "west": west}

    # 方向ごとの union bbox（方向内のコマ間ジッタを防ぐ）
    # スケールは全方向で共通の1値（方向間でサイズが変わる「縮む」バグを防ぐ）
    dbbox = {}
    s = None
    for d, frames in dirs.items():
        bb = None
        for f in frames:
            b = f.getbbox()
            if b:
                bb = b if bb is None else (
                    min(bb[0], b[0]), min(bb[1], b[1]),
                    max(bb[2], b[2]), max(bb[3], b[3]))
        dbbox[d] = bb
        w, h = bb[2] - bb[0], bb[3] - bb[1]
        fit = min(CW / w, CH / h)
        s = fit if s is None else min(s, fit)
        print(f"{d}: bbox {w}x{h}")
    print(f"common scale {s:.3f}")

    def sample(frames, n):
        m = len(frames)
        return [frames[round(i * (m - 1) / (n - 1))] for i in range(n)] if m > 1 else frames * n

    ROW = {"south": 0, "east": 1, "north": 2, "west": 3}
    sheet = Image.new("RGBA", (CW * 8, CH * 4), (0, 0, 0, 0))

    def put(img, col, row, bob=0, bbox=None):
        c = img.crop(bbox)
        nw, nh = max(1, round(c.width * s)), max(1, round(c.height * s))
        c = c.resize((nw, nh), Image.NEAREST)
        sheet.paste(c, (col * CW + (CW - nw) // 2, row * CH + (CH - nh) + bob), c)

    for d, row in ROW.items():
        frames = dirs[d]
        bb = dbbox[d]
        if d == "north" and north_mode.startswith("still"):
            WALK_BOB = [0, -1, 0, -1]
            DASH_BOB = [0, -2, -1]
            for ci in range(4):
                put(frames[0], ci, row, WALK_BOB[ci], bb)
            for ci in range(3):
                put(frames[0], 5 + ci, row, DASH_BOB[ci], bb)
            continue
        walk = sample(frames, 4)
        # ダッシュは歩幅が大きく見えるコマを選ぶ(全体から3点)
        dash = sample(frames, 3)
        for ci, f in enumerate(walk):
            put(f, ci, row, 0, bb)
        for ci, f in enumerate(dash):
            put(f, 5 + ci, row, 0, bb)

    out = os.path.join(ROOT, "assets", "people", "hero.png")
    sheet.save(out)
    print("saved", out)

    prev = sheet.resize((sheet.width * 2, sheet.height * 2), Image.NEAREST)
    bg = Image.new("RGBA", prev.size, (44, 50, 98, 255))
    bg.paste(prev, (0, 0), prev)
    bg.convert("RGB").save(os.path.join(G, "final_sheet_preview.png"))


if __name__ == "__main__":
    main()
