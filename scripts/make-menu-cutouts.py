"""メニューの料理の写真の白い背景をとって、すける PNG にする（DESIGN.md「写真」「メニュー」）
できた写真は、Supabase Storage の menu-images バケットの dishes/ に入れる

使い方（プロジェクトのフォルダで）:
    python3 scripts/make-menu-cutouts.py

もとの写真: photos-raw/（Git に入れない。PNG / JPEG / HEIC）
できる写真: photos-upload/dishes/（ファイルの名前は、もとの名前を小文字と - にしたもの）
いるもの: Pillow（pip install pillow）。HEIC があるときは、macOS の sips で JPEG にする

scripts/make-cutouts.py とのちがい:
白いお皿やグラスのふちを消さないように、写真のふちとつながっている「ほぼ真っ白」のところだけを背景にする
そのあと、もとの写真のうすい影（背景から、なめらかに少しずつ暗くなるところ）を消す
（サイトでは Plate が影をつけるので、もとの影はいらない）
白いお皿そのものまで影と見分けられないときは、影は消さずに、白い背景だけを消す
"""

import re
import subprocess
import tempfile
from pathlib import Path

from PIL import Image, ImageChops, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "photos-raw"
OUT = ROOT / "photos-upload" / "dishes"

# Supabase Storage の menu-images は 5MB まで
MAX_BYTES = 5 * 1024 * 1024
# 背景とみなす色：写真のふちの白から、R・G・B それぞれ、この差まで
WHITE_TOLERANCE = 14
# 大きすぎる写真は、長い辺をこの大きさまで小さくする
MAX_SIDE = 1600
# 影：となりの画素より、この差までしか暗くならない（なめらか）
SHADOW_STEP = 3
# 影：明るくて（R・G・B のいちばん小さい値がこれ以上）、色みがない（差がこれ以下）
SHADOW_BRIGHT = 150
SHADOW_NEUTRAL = 14
# 影を消して、料理の部分がこれより多く減ったら、お皿まで消えている。影は消さない
SHADOW_MAX_SHARE = 0.18


def slug(name: str) -> str:
    # 「Burmese Pork Noodle Soup (Dry Style)」→「burmese-pork-noodle-soup-dry-style」
    return re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")


def open_photo(path: Path) -> Image.Image:
    if path.suffix.lower() in {".heic", ".heif"}:
        # HEIC は、まず JPEG にする
        with tempfile.TemporaryDirectory() as tmp:
            jpeg = Path(tmp) / f"{path.stem}.jpg"
            subprocess.run(
                ["sips", "-s", "format", "jpeg", str(path), "--out", str(jpeg)],
                check=True,
                capture_output=True,
            )
            return Image.open(jpeg).convert("RGB")
    return Image.open(path).convert("RGB")


def white_background(image: Image.Image) -> Image.Image:
    # 写真のふちから、つながっている白だけをぬる（料理の中の白いもの・お皿のふちは残る）
    # 背景 = 255、料理 = 0
    width, height = image.size
    marker = (255, 0, 255)
    filled = image.copy()
    edges = [(x, y) for x in range(0, width, 25) for y in (0, height - 1)]
    edges += [(x, y) for y in range(0, height, 25) for x in (0, width - 1)]
    for point in edges:
        r, g, b = filled.getpixel(point)
        if min(r, g, b) >= 255 - WHITE_TOLERANCE:
            ImageDraw.floodfill(filled, point, marker, thresh=WHITE_TOLERANCE)
    background = Image.new("L", (width, height), 0)
    background.putdata([255 if pixel == marker else 0 for pixel in filled.getdata()])
    return background


def with_shadow(image: Image.Image, background: Image.Image) -> Image.Image:
    # 背景から、1 画素ずつ、影を広げる
    # 広げてよいのは：明るい灰色で、となり（もう背景）より少しだけ暗いところ
    # 明るくなったら止める（お皿のふちの細い線のあとは、また明るくなる）
    r, g, b = image.split()
    lowest = ImageChops.darker(ImageChops.darker(r, g), b)
    highest = ImageChops.lighter(ImageChops.lighter(r, g), b)
    gray = ImageChops.multiply(
        lowest.point(lambda v: 255 if v >= SHADOW_BRIGHT else 0),
        ImageChops.subtract(highest, lowest).point(lambda v: 255 if v <= SHADOW_NEUTRAL else 0),
    )
    lum = image.convert("L")
    shifts = [(1, 0), (-1, 0), (0, 1), (0, -1)]
    allowed = {}
    for shift in shifts:
        neighbor = ImageChops.offset(lum, *shift)
        darker = ImageChops.subtract(neighbor, lum).point(lambda v: 255 if v <= SHADOW_STEP else 0)
        not_brighter = ImageChops.subtract(lum, neighbor).point(lambda v: 255 if v <= 1 else 0)
        allowed[shift] = ImageChops.multiply(gray, ImageChops.multiply(darker, not_brighter))

    region = background
    while True:
        grown = region
        for shift in shifts:
            grown = ImageChops.lighter(grown, ImageChops.multiply(allowed[shift], ImageChops.offset(region, *shift)))
        if ImageChops.difference(grown, region).getbbox() is None:
            return region
        region = grown


def cut_out(path: Path) -> tuple[Path, bool]:
    image = open_photo(path)
    image.thumbnail((MAX_SIDE, MAX_SIDE))
    width, height = image.size

    background = white_background(image)
    shadow = with_shadow(image, background)
    dish = width * height - background.histogram()[255]
    removed = shadow.histogram()[255] - background.histogram()[255]
    shadow_removed = removed <= dish * SHADOW_MAX_SHARE
    if shadow_removed:
        background = shadow

    # 背景 = 0、料理 = 255
    alpha = ImageChops.invert(background)
    # ふちの白いにじみを消すため、少しだけ内側にけずってから、やわらかくする
    alpha = alpha.filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(1))

    result = image.convert("RGBA")
    result.putalpha(alpha)
    # まわりのすけている部分を切りとる
    bbox = alpha.point(lambda v: 255 if v > 8 else 0).getbbox()
    if bbox:
        result = result.crop(bbox)

    out = OUT / f"{slug(path.stem)}.png"
    result.save(out, optimize=True)
    # 5MB をこえたら、小さくしてもう一度
    while out.stat().st_size > MAX_BYTES:
        result = result.resize((int(result.width * 0.85), int(result.height * 0.85)), Image.LANCZOS)
        result.save(out, optimize=True)
    return out, shadow_removed


if __name__ == "__main__":
    OUT.mkdir(parents=True, exist_ok=True)
    photos = sorted(
        path
        for path in SRC.iterdir()
        if path.suffix.lower() in {".png", ".jpg", ".jpeg", ".heic", ".heif"}
    )
    for path in photos:
        out, shadow_removed = cut_out(path)
        with Image.open(out) as done:
            size = f"{done.width}x{done.height}"
        note = "" if shadow_removed else "  （影は残した）"
        print(f"{out.name:45} {size:>10}  {out.stat().st_size / 1024 / 1024:.1f}MB  ← {path.name}{note}")
