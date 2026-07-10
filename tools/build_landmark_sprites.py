#!/usr/bin/env python3
"""Generated landmark art -> transparent, game-sized building sprites."""

from collections import deque
from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "assets" / "gen" / "buildings_src"
OUT = ROOT / "assets" / "ai" / "buildings"

BUILDINGS = {
    "monster_center": (192, 128),
    "rock_gym": (192, 128),
    "electric_gym": (192, 128),
    "ghost_gym": (192, 128),
    "lumina_hall": (224, 160),
}


def remove_checkerboard(image):
    """Flood-fill the connected gray checkerboard without erasing white walls."""
    rgba = image.convert("RGBA")
    pixels = rgba.load()
    width, height = rgba.size
    seen = bytearray(width * height)
    queue = deque()

    def is_background(x, y):
        red, green, blue, _ = pixels[x, y]
        spread = max(red, green, blue) - min(red, green, blue)
        average = (red + green + blue) / 3
        return spread <= 10 and 220 <= average <= 255

    for x in range(width):
        queue.append((x, 0))
        queue.append((x, height - 1))
    for y in range(height):
        queue.append((0, y))
        queue.append((width - 1, y))

    while queue:
        x, y = queue.popleft()
        index = y * width + x
        if seen[index] or not is_background(x, y):
            continue
        seen[index] = 1
        red, green, blue, _ = pixels[x, y]
        pixels[x, y] = (red, green, blue, 0)
        if x > 0:
            queue.append((x - 1, y))
        if x + 1 < width:
            queue.append((x + 1, y))
        if y > 0:
            queue.append((x, y - 1))
        if y + 1 < height:
            queue.append((x, y + 1))

    # Remove pale checker fringe touching transparent pixels.
    for _ in range(3):
        next_image = rgba.copy()
        next_pixels = next_image.load()
        for y in range(1, height - 1):
            for x in range(1, width - 1):
                red, green, blue, alpha = pixels[x, y]
                if alpha == 0:
                    continue
                transparent_neighbor = any(
                    pixels[x + dx, y + dy][3] == 0
                    for dx, dy in ((-1, 0), (1, 0), (0, -1), (0, 1))
                )
                spread = max(red, green, blue) - min(red, green, blue)
                average = (red + green + blue) / 3
                if transparent_neighbor and spread <= 12 and 215 <= average <= 255:
                    next_pixels[x, y] = (red, green, blue, 0)
        rgba = next_image
        pixels = rgba.load()

    return rgba


def fit_to_canvas(image, canvas_size):
    bbox = image.getbbox()
    if not bbox:
        raise ValueError("foreground could not be detected")
    cropped = image.crop(bbox)
    canvas_width, canvas_height = canvas_size
    scale = min(canvas_width / cropped.width, canvas_height / cropped.height)
    target = (
        max(1, round(cropped.width * scale)),
        max(1, round(cropped.height * scale)),
    )
    resized = cropped.resize(target, Image.Resampling.LANCZOS)
    canvas = Image.new("RGBA", canvas_size, (0, 0, 0, 0))
    canvas.alpha_composite(
        resized,
        ((canvas_width - target[0]) // 2, canvas_height - target[1]),
    )
    return canvas


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    preview = Image.new("RGBA", (224 * len(BUILDINGS), 176), (108, 185, 77, 255))
    for index, (name, canvas_size) in enumerate(BUILDINGS.items()):
        source = Image.open(SRC / f"{name}.png")
        sprite = fit_to_canvas(remove_checkerboard(source), canvas_size)
        destination = OUT / f"{name}.png"
        sprite.save(destination)
        preview.alpha_composite(sprite, (index * 224 + (224 - canvas_size[0]) // 2, 176 - canvas_size[1]))
        print("saved", destination, sprite.size)

    preview_path = ROOT / "assets" / "gen" / "preview" / "landmarks.png"
    preview_path.parent.mkdir(parents=True, exist_ok=True)
    preview.resize((preview.width * 2, preview.height * 2), Image.Resampling.NEAREST).save(preview_path)
    print("saved", preview_path)


if __name__ == "__main__":
    main()
