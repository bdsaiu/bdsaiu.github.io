"""Make web-sized copies of an event's photos for the gallery.

python3 tools/prepare_album.py <folder with original photos> <album slug>

Writes assets/images/gallery/<slug>/full/ (long edge 1920 px) and thumb/ (long edge 640 px) as JPEG.
Byte-identical duplicates are skipped. Photos are rotated upright from their EXIF orientation, and all metadata (camera, GPS location) is removed.
The originals are not changed; keep them out of git (see .gitignore), only the web copies are published.
"""

import hashlib
import sys
from pathlib import Path

from PIL import Image, ImageOps

SIZES = {"full": (1920, 82), "thumb": (640, 78)}

src, slug = Path(sys.argv[1]), sys.argv[2]
out = Path(__file__).resolve().parent.parent / "assets" / "images" / "gallery" / slug
photos, seen = [], set()
for p in sorted(src.iterdir(), key=lambda p: ("(" in p.stem, p.name)):  # skip copies such as "IMG_1234(1).jpg"
    digest = hashlib.md5(p.read_bytes()).hexdigest() if p.suffix.lower() in (".jpg", ".jpeg", ".png") else None
    if digest and digest not in seen:
        seen.add(digest)
        photos.append(p)
for name in SIZES:
    (out / name).mkdir(parents=True, exist_ok=True)
for i, p in enumerate(photos, 1):
    with Image.open(p) as im:
        im = ImageOps.exif_transpose(im).convert("RGB")
        for name, (edge, quality) in SIZES.items():
            copy = im.copy()
            copy.thumbnail((edge, edge), Image.LANCZOS)
            copy.save(out / name / f"{p.stem.lower()}.jpg", "JPEG", quality=quality, optimize=True, progressive=True)
    print(f"{i}/{len(photos)} {p.name}", flush=True)
print("wrote", out)
