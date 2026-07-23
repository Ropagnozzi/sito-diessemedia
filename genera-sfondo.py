# -*- coding: utf-8 -*-
"""
Genera un PNG con lo sfondo del sito Diesse Media (tema scuro tecnologico).
Riproduce fedelmente il CSS di css/style.css (body::before + body::after):
base #07080d + 4 aurore radiali + 8 particelle + griglia 52px con maschera.

USO:
    python genera-sfondo.py                 -> 1920x1080
    python genera-sfondo.py 2560 1440       -> dimensione personalizzata
    python genera-sfondo.py 1080 1920       -> verticale (social/stories)
"""
import sys
import numpy as np
from PIL import Image

BASE = (7, 8, 13)          # --bg #07080d

# aurore: (rx%, ry%, cx%, cy%, (r,g,b), alpha, stop_transparent)
AURORE = [
    (0.40, 0.32, 0.16, 0.10, (238, 125,   0), 0.34, 0.70),
    (0.44, 0.36, 0.88, 0.18, ( 70, 100, 190), 0.38, 0.70),
    (0.52, 0.42, 0.72, 0.90, (238, 125,   0), 0.22, 0.70),
    (0.38, 0.32, 0.08, 0.82, ( 52,  82, 160), 0.30, 0.70),
]
# particelle: (raggio_px, cx%, cy%, (r,g,b), alpha)
PARTICELLE = [
    (3.0,  0.22, 0.34, (255, 170,  80), 0.90),
    (2.0,  0.68, 0.22, (255, 255, 255), 0.70),
    (2.5,  0.42, 0.64, (255, 154,  46), 0.80),
    (2.0,  0.85, 0.55, (160, 190, 255), 0.80),
    (3.0,  0.12, 0.58, (255, 154,  46), 0.70),
    (2.0,  0.55, 0.42, (255, 255, 255), 0.55),
    (2.5,  0.78, 0.76, (255, 170,  80), 0.75),
    (2.0,  0.34, 0.18, (170, 200, 255), 0.70),
]
GRID_STEP  = 52
GRID_ALPHA = 0.05


def over(dst, src_rgb, src_a):
    """Compositing source-over: dst e src_rgb float (H,W,3), src_a float (H,W,1)."""
    return src_rgb * src_a + dst * (1.0 - src_a)


def genera(W, H):
    # body::before ha inset:-25% -> il box è il 150% del viewport
    Wb, Hb = int(W * 1.5), int(H * 1.5)
    ox, oy = (Wb - W) // 2, (Hb - H) // 2

    yy, xx = np.mgrid[0:Hb, 0:Wb].astype(np.float32)
    canvas = np.zeros((Hb, Wb, 3), np.float32)
    canvas[:] = np.array(BASE, np.float32) / 255.0

    # I layer CSS si dipingono dall'ultimo al primo (il primo sta sopra)
    layers = [(rx * Wb, ry * Hb, cx * Wb, cy * Hb, col, a, stop)
              for (rx, ry, cx, cy, col, a, stop) in AURORE]
    layers += [(r, r, cx * Wb, cy * Hb, col, a, 1.0)
               for (r, cx, cy, col, a) in PARTICELLE]

    for (rx, ry, cx, cy, col, a0, stop) in reversed(layers):
        t = np.sqrt(((xx - cx) / rx) ** 2 + ((yy - cy) / ry) ** 2)
        alpha = np.clip(1.0 - t / stop, 0.0, 1.0) * a0
        rgb = np.empty((Hb, Wb, 3), np.float32)
        rgb[:] = np.array(col, np.float32) / 255.0
        canvas = over(canvas, rgb, alpha[..., None])

    # ritaglia il viewport dal box al 150%
    img = canvas[oy:oy + H, ox:ox + W]

    # body::after: griglia 52px, mascherata da radial-gradient(85% 75% at 50% 25%, #000 25%, transparent)
    gy, gx = np.mgrid[0:H, 0:W]
    grid = ((gx % GRID_STEP == 0) | (gy % GRID_STEP == 0)).astype(np.float32)
    mrx, mry, mcx, mcy = 0.85 * W, 0.75 * H, 0.50 * W, 0.25 * H
    t = np.sqrt(((gx - mcx) / mrx) ** 2 + ((gy - mcy) / mry) ** 2)
    mask = np.clip((1.0 - t) / 0.75, 0.0, 1.0)      # pieno fino a t=.25, poi sfuma a 0 in t=1
    ga = (grid * mask * GRID_ALPHA)[..., None]
    white = np.ones((H, W, 3), np.float32)
    img = over(img, white, ga)

    return Image.fromarray((np.clip(img, 0, 1) * 255).astype(np.uint8), 'RGB')


if __name__ == '__main__':
    W = int(sys.argv[1]) if len(sys.argv) > 2 else 1920
    H = int(sys.argv[2]) if len(sys.argv) > 2 else 1080
    out = 'assets/sfondo-diessemedia-%dx%d.png' % (W, H)
    genera(W, H).save(out, optimize=True)
    print('creato:', out)
