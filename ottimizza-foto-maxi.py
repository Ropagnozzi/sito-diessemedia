# -*- coding: utf-8 -*-
"""
Ottimizza e normalizza le foto dei maxi impianti in assets/foto/maxi/.

Per ogni immagine:
  - raddrizza secondo l'orientamento EXIF (foto da telefono spesso ruotate)
  - ridimensiona al lato lungo massimo (1600px)
  - comprime in JPG leggero (per il web)
  - normalizza il nome: tutto minuscolo, estensione .jpg
    (es. "NA93-1.JPG" e "na93-1.png" -> "na93-1.jpg")

È IDEMPOTENTE: le foto già a posto (minuscolo .jpg e <= 1600px) vengono
saltate, quindi puoi rilanciarlo quante volte vuoi senza perdere qualità.

USO: viene lanciato in automatico da AGGIORNA_MAPPA_MAXI.bat, prima della
     rigenerazione dei dati. Oppure a mano:  python ottimizza-foto-maxi.py
"""
import os, glob
from PIL import Image, ImageOps

FOLDER = os.path.join('assets', 'foto', 'maxi')
MAXL = 1600
QUALITY = 82
EXTS = ('.jpg', '.jpeg', '.png')


def main():
    if not os.path.isdir(FOLDER):
        print('Cartella non trovata:', FOLDER); return

    files = [f for f in glob.glob(os.path.join(FOLDER, '*'))
             if f.lower().endswith(EXTS)]
    done = 0
    skipped = 0
    for f in sorted(files):
        name = os.path.basename(f)
        base = os.path.splitext(name)[0].lower()
        target = os.path.join(FOLDER, base + '.jpg')

        try:
            im = Image.open(f)
            im = ImageOps.exif_transpose(im).convert('RGB')
        except Exception as e:
            print('  !! impossibile aprire', name, '-', e); continue

        w, h = im.size
        already_ok = (name == base + '.jpg') and (max(w, h) <= MAXL)
        if already_ok:
            skipped += 1
            continue

        if max(w, h) > MAXL:
            if w >= h:
                im = im.resize((MAXL, round(h * MAXL / w)), Image.LANCZOS)
            else:
                im = im.resize((round(w * MAXL / h), MAXL), Image.LANCZOS)

        tmp = target + '.__tmp'
        im.save(tmp, 'JPEG', quality=QUALITY, optimize=True, progressive=True)
        # rimuove il sorgente (gestisce maiuscole su filesystem case-insensitive)
        try:
            os.remove(f)
        except OSError:
            pass
        if os.path.exists(target):
            try:
                os.remove(target)
            except OSError:
                pass
        os.rename(tmp, target)
        done += 1
        print('  ottimizzata:', name, '->', base + '.jpg')

    print('Foto ottimizzate: %d   |   gia a posto (saltate): %d' % (done, skipped))


if __name__ == '__main__':
    main()
