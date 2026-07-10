#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""PixelLab APIでマップタイル素材を生成する。

使い方:
  python tools/pixellab_tiles.py tileset <name> "<lower>" "<upper>"   # Wangタイルセット生成(32px)
  python tools/pixellab_tiles.py object <name> "<description>" [WxH]  # 単体オブジェクト(透過)
  python tools/pixellab_tiles.py pixflux <name> "<description>" [WxH] # 単発タイル画像
  python tools/pixellab_tiles.py job <job_id> <name>                  # ジョブ再取得

出力: assets/gen/tiles/<name>/ に raw JSON と PNG群
"""
import base64
import io
import json
import os
import sys
import time

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from pixellab_hero import _req  # noqa: E402

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "assets", "gen", "tiles")


def _to_img(o):
    from PIL import Image
    raw = base64.b64decode(o["base64"].split(",")[-1])
    if o.get("type") == "rgba_bytes" and "width" in o:
        return Image.frombytes("RGBA", (o["width"], o["height"]), raw)
    try:
        return Image.open(io.BytesIO(raw)).convert("RGBA")
    except Exception:
        # PNGでなければ正方形の生RGBAとして解釈（tilesetは256x256等）
        import math
        n = len(raw) // 4
        side = int(math.isqrt(n))
        if side * side == n:
            return Image.frombytes("RGBA", (side, side), raw)
        raise


def _extract_all(obj, out_dir, prefix=""):
    """レスポンス内の画像を全部保存"""
    from PIL import Image
    n = 0

    def save_raw_b64(b64, path):
        nonlocal n
        raw = base64.b64decode(b64.split(",")[-1])
        try:
            img = Image.open(io.BytesIO(raw)).convert("RGBA")
        except Exception:
            import math
            side = int(math.isqrt(len(raw) // 4))
            img = Image.frombytes("RGBA", (side, side), raw)
        safe = path.strip("/").replace("/", "_")[:90] or f"img{n}"
        # map-objects は compose が object.png を期待
        out_name = "object.png" if safe.endswith("image") or safe == "image" else f"{prefix}{safe}.png"
        if safe == "image" or safe.endswith("_image"):
            out_name = "object.png"
        img.save(os.path.join(out_dir, out_name))
        n += 1

    def walk(o, path=""):
        nonlocal n
        if isinstance(o, dict):
            if "base64" in o and isinstance(o["base64"], str) and len(o["base64"]) > 100:
                img = _to_img(o)
                safe = path.strip("/").replace("/", "_")[:90] or f"img{n}"
                out_name = "object.png" if "image" in safe else f"{prefix}{safe}.png"
                img.save(os.path.join(out_dir, out_name))
                n += 1
                return
            # 新API: image が生base64文字列
            if "image" in o and isinstance(o["image"], str) and len(o["image"]) > 100:
                save_raw_b64(o["image"], path + "/image")
                return
            for k, v in o.items():
                walk(v, path + "/" + str(k))
        elif isinstance(o, list):
            for i, v in enumerate(o):
                walk(v, path + "/" + str(i))

    walk(obj)
    return n


def _poll_and_save(job_id, name, minutes=8):
    d = os.path.join(OUT, name)
    os.makedirs(d, exist_ok=True)
    st = None
    for i in range(int(minutes * 4)):
        time.sleep(15)
        r = _req("GET", f"/background-jobs/{job_id}")
        st = r.get("status")
        print("poll", i + 1, st, flush=True)
        if st in ("completed", "failed"):
            break
    if st == "completed":
        with open(os.path.join(d, "job.json"), "w", encoding="utf-8") as f:
            json.dump(r, f, ensure_ascii=False)
        n = _extract_all(r.get("last_response", r), d)
        print(f"DONE: {n} images -> {d}")
    elif st == "failed":
        print("FAILED:", json.dumps(r.get("last_response"), ensure_ascii=False)[:400])
    else:
        print("TIMEOUT (job may still finish; rerun: job", job_id, name, ")")


def cmd_tileset(name, lower, upper):
    payload = {
        "lower_description": lower,
        "upper_description": upper,
        "tile_size": {"width": 32, "height": 32},
    }
    r = _req("POST", "/create-tileset", payload)
    print(json.dumps({k: v for k, v in r.items() if "base64" not in str(v)[:200]}, ensure_ascii=False)[:400])
    jid = r.get("background_job_id")
    if jid:
        _poll_and_save(jid, name)
    else:
        d = os.path.join(OUT, name)
        os.makedirs(d, exist_ok=True)
        with open(os.path.join(d, "resp.json"), "w", encoding="utf-8") as f:
            json.dump(r, f, ensure_ascii=False)
        n = _extract_all(r, d)
        print(f"SYNC DONE: {n} images -> {d}")


def cmd_object(name, description, size="32x32"):
    w, h = map(int, size.lower().split("x"))
    payload = {
        "description": description,
        "image_size": {"width": w, "height": h},
    }
    r = _req("POST", "/map-objects", payload)
    jid = r.get("background_job_id")
    print("job:", jid)
    if jid:
        _poll_and_save(jid, name)
    else:
        d = os.path.join(OUT, name)
        os.makedirs(d, exist_ok=True)
        n = _extract_all(r, d)
        print(f"SYNC DONE: {n} images -> {d}")


def cmd_pixflux(name, description, size="32x32"):
    w, h = map(int, size.lower().split("x"))
    r = _req("POST", "/create-image-pixflux", {
        "description": description,
        "image_size": {"width": w, "height": h},
    })
    d = os.path.join(OUT, name)
    os.makedirs(d, exist_ok=True)
    n = _extract_all(r, d)
    print(f"DONE: {n} images -> {d}")


if __name__ == "__main__":
    a = sys.argv[1:]
    if not a:
        print(__doc__)
        sys.exit(0)
    os.makedirs(OUT, exist_ok=True)
    if a[0] == "tileset" and len(a) >= 4:
        cmd_tileset(a[1], a[2], a[3])
    elif a[0] == "object" and len(a) >= 3:
        cmd_object(a[1], a[2], a[3] if len(a) > 3 else "32x32")
    elif a[0] == "pixflux" and len(a) >= 3:
        cmd_pixflux(a[1], a[2], a[3] if len(a) > 3 else "32x32")
    elif a[0] == "job" and len(a) >= 3:
        _poll_and_save(a[1], a[2])
    else:
        print(__doc__)
        sys.exit(1)
