"""Chroma-key the About photo's green screen into a transparent PNG.

Flood-fills from the frame edge so isolated greens (necklace pendant,
rose leaves on the jeans) stay put. Then despills the leftover halo.
"""

from collections import deque
from colorsys import rgb_to_hsv
from pathlib import Path

from PIL import Image

src = Path("public/images/superzydan-linknova.jpg")
dest = Path("public/images/superzydan-linknova.png")

img = Image.open(src).convert("RGBA")
width, height = img.size
pixels = img.load()


def hsv(r: int, g: int, b: int) -> tuple[float, float, float]:
    return rgb_to_hsv(r / 255.0, g / 255.0, b / 255.0)


def is_dark_backdrop(r: int, g: int, b: int) -> bool:
    """Floor/corner shadows that are green-tinted but too dark for the main key."""
    h, s, v = hsv(r, g, b)
    if v > 0.30:
        return False
    if b > g + 6:
        return False
    return g >= r + 3 and g >= b + 1


def is_screen_green(r: int, g: int, b: int, loose: bool = False) -> bool:
    """Neon studio green, including the darker shadow on the backdrop."""
    h, s, v = hsv(r, g, b)
    hue_ok = 0.18 <= h <= 0.47  # yellow-green through cyan-green
    g_lead = g >= r + (8 if loose else 14) and g >= b + (8 if loose else 14)

    if loose:
        return g_lead and (s >= 0.18 or g >= 40) and (v >= 0.08 or g >= 35)

    return (hue_ok and s >= 0.28 and v >= 0.12) or (g_lead and g >= 48 and s >= 0.22)


def spill_amount(r: int, g: int, b: int) -> float:
    """How much leftover green is riding on an edge pixel (0–1)."""
    if g <= r or g <= b:
        return 0.0
    excess = min(g - r, g - b)
    if excess <= 10:
        return 0.0
    return min(1.0, (excess - 10) / 50)


screen = [[False] * width for _ in range(height)]
visited = [[False] * width for _ in range(height)]
queue: deque[tuple[int, int]] = deque()

for x in range(width):
    queue.append((x, 0))
    queue.append((x, height - 1))
for y in range(height):
    queue.append((0, y))
    queue.append((width - 1, y))

while queue:
    x, y = queue.popleft()
    if x < 0 or y < 0 or x >= width or y >= height or visited[y][x]:
        continue
    visited[y][x] = True
    r, g, b, _ = pixels[x, y]
    if not is_screen_green(r, g, b):
        continue
    screen[y][x] = True
    queue.extend(((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)))

# Grow once into darker leftover screen that failed the strict test.
grow: list[tuple[int, int]] = []
for y in range(height):
    for x in range(width):
        if screen[y][x]:
            continue
        r, g, b, _ = pixels[x, y]
        if not is_screen_green(r, g, b, loose=True):
            continue
        for dy, dx in ((-1, 0), (1, 0), (0, -1), (0, 1)):
            nx, ny = x + dx, y + dy
            if 0 <= nx < width and 0 <= ny < height and screen[ny][nx]:
                grow.append((x, y))
                break

for x, y in grow:
    screen[y][x] = True

# Second grow: leftover dark screen in the corners/floor that is
# still attached to the keyed backdrop (won't reach the pendant).
grow = []
for y in range(height):
    for x in range(width):
        if screen[y][x]:
            continue
        r, g, b, _ = pixels[x, y]
        h, s, v = hsv(r, g, b)
        dark_screen = g >= r + 4 and g >= b + 2 and g <= 80 and v <= 0.32 and (
            s >= 0.12 or g >= 18
        )
        if not dark_screen:
            continue
        for dy, dx in ((-1, 0), (1, 0), (0, -1), (0, 1)):
            nx, ny = x + dx, y + dy
            if 0 <= nx < width and 0 <= ny < height and screen[ny][nx]:
                grow.append((x, y))
                break
for x, y in grow:
    screen[y][x] = True

# Dark floor/corner shadows, flooded from the frame so shirts stay opaque.
dark_visited = [[False] * width for _ in range(height)]
dark_queue: deque[tuple[int, int]] = deque()
for x in range(width):
    dark_queue.append((x, 0))
    dark_queue.append((x, height - 1))
for y in range(height):
    dark_queue.append((0, y))
    dark_queue.append((width - 1, y))

while dark_queue:
    x, y = dark_queue.popleft()
    if x < 0 or y < 0 or x >= width or y >= height or dark_visited[y][x]:
        continue
    dark_visited[y][x] = True
    if screen[y][x]:
        dark_queue.extend(((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)))
        continue
    r, g, b, _ = pixels[x, y]
    if not is_dark_backdrop(r, g, b):
        continue
    screen[y][x] = True
    dark_queue.extend(((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)))

# Punch the keyed backdrop, then knock green spill off neighboring fringe.
for y in range(height):
    for x in range(width):
        r, g, b, a = pixels[x, y]
        if screen[y][x]:
            pixels[x, y] = (r, g, b, 0)
            continue

        near_screen = False
        for dy in (-2, -1, 0, 1, 2):
            for dx in (-2, -1, 0, 1, 2):
                nx, ny = x + dx, y + dy
                if 0 <= nx < width and 0 <= ny < height and screen[ny][nx]:
                    near_screen = True
                    break
            if near_screen:
                break

        if not near_screen:
            continue

        spill = spill_amount(r, g, b)
        if spill <= 0:
            continue

        new_g = int(g - spill * (g - min(r, b)))
        new_a = int(255 * (1 - spill * 0.9))
        pixels[x, y] = (r, new_g, b, max(0, min(255, new_a)))

img.save(dest, "PNG")
print(f"wrote {dest} {dest.stat().st_size}")
