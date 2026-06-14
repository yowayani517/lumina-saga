# 連番PNG -> アニメGIF (撮影用ユーティリティ)
import sys, os, glob
from PIL import Image

prefix = sys.argv[1] if len(sys.argv) > 1 else "evo_"
out = sys.argv[2] if len(sys.argv) > 2 else "../docs/lumina_evolution.gif"
scale = float(sys.argv[3]) if len(sys.argv) > 3 else 0.75
dur = int(sys.argv[4]) if len(sys.argv) > 4 else 70
step = int(sys.argv[5]) if len(sys.argv) > 5 else 1

here = os.path.dirname(os.path.abspath(__file__))
shotdir = os.path.join(here, "..", "docs", "screenshots")
files = sorted(glob.glob(os.path.join(shotdir, prefix + "*.png")))[::step]
if not files:
    print("no frames"); sys.exit(1)

frames = []
for f in files:
    im = Image.open(f).convert("RGB")
    if scale != 1.0:
        im = im.resize((int(im.width * scale), int(im.height * scale)), Image.LANCZOS)
    # 256色パレットに変換してGIFを軽量化
    im = im.quantize(colors=128, method=Image.MEDIANCUT)
    frames.append(im)

outpath = os.path.join(here, out)
frames[0].save(outpath, save_all=True, append_images=frames[1:],
               duration=dur, loop=0, optimize=True, disposal=2)
print("wrote", outpath, len(frames), "frames", os.path.getsize(outpath)//1024, "KB")
