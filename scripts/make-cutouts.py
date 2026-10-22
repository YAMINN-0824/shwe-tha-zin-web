"""料理の写真の白い背景をとって、すける PNG にする（DESIGN.md「写真」）

使い方（プロジェクトのフォルダで）:
    python3 scripts/make-cutouts.py

もとの写真: assets/photos/
できる写真: public/images/
いるもの: Pillow（pip install pillow）
"""

from pathlib import Path

from PIL import Image, ImageChops, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "assets" / "photos"
OUT = ROOT / "public" / "images"

# 白い背景の料理の写真
CUTOUTS = ["laphet", "rice-set", "fritters"]
# そのまま使う写真（JPEG にして軽くする）
PHOTOS = ["hometown-gate"]

# 背景とみなす色：明るくて（R・G・B のいちばん小さい値がこれ以上）
LIGHT_THRESHOLD = 185
# 色みがない（いちばん大きい値との差がこれ以下）。もとの写真のうすい影も、これで消える
NEUTRAL_THRESHOLD = 18


def cut_out(name: str) -> None:
    image = Image.open(SRC / f"{name}.png").convert("RGB")
    width, height = image.size

    # 白や、うすい灰色の画素を 255、それ以外を 0 にする
    r, g, b = image.split()
    darkest = ImageChops.darker(ImageChops.darker(r, g), b)
    lightest = ImageChops.lighter(ImageChops.lighter(r, g), b)
    light = darkest.point(lambda v: 255 if v >= LIGHT_THRESHOLD else 0)
    neutral = ImageChops.subtract(lightest, darkest).point(
        lambda v: 255 if v <= NEUTRAL_THRESHOLD else 0
    )
    mask = ImageChops.multiply(light, neutral)

    # 写真のふちから、つながっている白だけを背景にする（128 でぬる）
    # お皿の中の白いもの（ごはん、にんにく）は、ふちとつながっていないので残る
    edges = [(0, 0), (width - 1, 0), (0, height - 1), (width - 1, height - 1)]
    for x in range(0, width, 50):
        edges += [(x, 0), (x, height - 1)]
    for y in range(0, height, 50):
        edges += [(0, y), (width - 1, y)]
    for point in edges:
        if mask.getpixel(point) == 255:
            ImageDraw.floodfill(mask, point, 128)

    # 背景 = 0、料理 = 255
    alpha = mask.point(lambda v: 0 if v == 128 else 255)
    # ふちの白いにじみを消すため、少しだけ内側にけずってから、やわらかくする
    alpha = alpha.filter(ImageFilter.MinFilter(5)).filter(ImageFilter.GaussianBlur(1.2))

    result = image.convert("RGBA")
    result.putalpha(alpha)
    # まわりのすけている部分を切りとる
    bbox = alpha.point(lambda v: 255 if v > 8 else 0).getbbox()
    if bbox:
        result = result.crop(bbox)
    result.save(OUT / f"{name}.png", optimize=True)
    print(f"{name}.png  {result.size[0]}x{result.size[1]}")


def to_jpeg(name: str) -> None:
    image = Image.open(SRC / f"{name}.png").convert("RGB")
    image.save(OUT / f"{name}.jpg", quality=85, optimize=True, progressive=True)
    print(f"{name}.jpg  {image.size[0]}x{image.size[1]}")


if __name__ == "__main__":
    OUT.mkdir(parents=True, exist_ok=True)
    for name in CUTOUTS:
        cut_out(name)
    for name in PHOTOS:
        to_jpeg(name)
