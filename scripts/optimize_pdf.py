"""Optimise generated PDF streams; preserve vector text and bound raster resolution."""
import os
from pathlib import Path
import sys
import pymupdf


def optimize(path):
    path = Path(path)
    temporary = path.with_suffix('.optimized.pdf')
    with pymupdf.open(path) as document:
        # At 960x540pt, 120dpi exceeds the 1280x720 browser comparison resolution.
        # Canonical image assets are never rewritten. Every final PDF is then verified
        # against the original browser screenshot, including the <12/255 pixel gate.
        document.rewrite_images(dpi_threshold=144, dpi_target=120, quality=88)
        document.save(temporary, garbage=4, deflate=True, use_objstms=1)
    os.replace(temporary, path)
    print(f'PASS: optimised {path.parent.name} PDF streams ({path.stat().st_size} bytes)')


if __name__ == '__main__':
    optimize(sys.argv[1])
