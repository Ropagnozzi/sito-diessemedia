# Sito Diesse Media — www.diessemedia.it

Sito vetrina multi-pagina statico (HTML + CSS puro), pronto per GitHub Pages.

## Struttura

| File | Pagina |
|------|--------|
| `index.html` | Home |
| `servizi.html` | Servizi |
| `impianti.html` | Impianti e Copertura |
| `chi-siamo.html` | Chi Siamo |
| `contatti.html` | Contatti (form via mailto) |
| `css/style.css` | Stile condiviso (brand nero + arancione, font Lexend + Source Sans 3) |
| `css/hero.css` | Hero cinematografico della home (scroll-driven, GSAP ScrollTrigger da cdnjs) |
| `CNAME` | Dominio custom per GitHub Pages |

## Da completare prima della pubblicazione

1. **Logo ufficiale**: salvare il file del logo come `assets/logo.png` e sostituire
   nel header/footer di ogni pagina il blocco `<span class="logo-mark">…` con
   `<img src="assets/logo.png" alt="Diesse Media SRL">`. Il CSS è già pronto (`.logo img`).
2. **Foto reali**: copiare le foto degli impianti in `assets/foto/` con i nomi
   indicati nei placeholder grigi (es. `impianto-1.jpg`, `home-metodo.jpg`) e
   sostituire i `<div class="photo">…</div>` con `<div class="photo"><img src="…"></div>`.
   **Hero cinematografico**: le tre scene caricano automaticamente
   `assets/foto/scena1-6x3.jpg` (poster 6x3 con SUV DR5 — lo zoom punta alla
   vetratura), `assets/foto/scena2-maxi.jpg` (maxi affissione MD notturna) e
   `assets/foto/scena3-digital.jpg` (totem digitale in stazione — lo zoom finale
   punta allo schermo). Se un file manca, resta l'illustrazione SVG di fallback.
   Nota: i file originali nella root del sito (`6x3 1.jpg`, `MAXI MD1.jpg`,
   `STAZIONE 1.jpeg`, `LOGO DSM CON SCRITTA SRL.png`) sono duplicati di lavoro:
   rimuoverli prima della pubblicazione.
3. **Dati aziendali**: cercare nel codice `[Telefono da inserire]`,
   `[Indirizzo da inserire]`, `[da inserire]` (P.IVA) e sostituire con i dati reali.
4. **Email**: verificare che `info@diessemedia.it` sia l'indirizzo corretto
   (usato nel form contatti e nel footer).

## Pubblicazione su GitHub Pages

1. Creare un repo (es. `Ropagnozzi/sito-diessemedia`) e caricare il contenuto di questa cartella.
2. Settings → Pages → Deploy from branch `main`, cartella `/ (root)`.
3. Il file `CNAME` imposta automaticamente `www.diessemedia.it`.
4. Dal pannello del dominio (registrar), creare un record DNS:
   - `CNAME` per `www` → `ropagnozzi.github.io`
   - (opzionale) redirect di `diessemedia.it` → `www.diessemedia.it`
5. In Settings → Pages attivare **Enforce HTTPS** quando il certificato è pronto.
