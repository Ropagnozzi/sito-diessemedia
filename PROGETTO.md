# Sito Diesse Media — Stato del progetto

> Documento di riferimento del progetto. Va letto per primo da chiunque
> (persona o assistente AI) riprenda il lavoro, su qualsiasi computer.
> Ultimo aggiornamento: 2026-07-09.

## Cos'è

Sito vetrina di **Diesse Media SRL**, centro media specializzato in
comunicazione outdoor (affissioni) a Napoli / Campania e in tutta Italia.
Sito statico multi-pagina in HTML/CSS/JS puro, senza framework.

**Obiettivo dichiarato dal committente (Roberto Pagnozzi):** deve essere
"il sito più bello d'Italia" — massima eleganza + massima tecnologia di
effetti visivi, ma **sempre sobrio**: gli effetti devono essere ben
visibili senza mai competere con il contenuto o dare fastidio alla vista.

## Dove vive

| Cosa | Dove |
|------|------|
| Sorgente | questa cartella (`sito-diessemedia/`) |
| Repo GitHub | `Ropagnozzi/sito-diessemedia` |
| Staging pubblico (test) | https://ropagnozzi.github.io/sito-diessemedia/ |
| Dominio finale (non ancora collegato) | www.diessemedia.it |

## Lavorare da più computer

Il sorgente è su GitHub, quindi è portabile.

```
# la prima volta, su un nuovo PC:
git clone https://github.com/Ropagnozzi/sito-diessemedia.git

# a inizio sessione:  scarica le ultime modifiche
git pull

# a fine sessione:    carica le tue
git add -A && git commit -m "descrizione" && git push
```

Regola d'oro: **`git pull` prima di iniziare**, per non creare conflitti
tra fisso e portatile. Ogni `push` aggiorna automaticamente lo staging
GitHub Pages in circa un minuto.

## Struttura dei file

```
index.html          Home
servizi.html        Servizi
impianti.html       Impianti e Copertura
chi-siamo.html      Chi Siamo
contatti.html       Contatti (form via mailto)
css/style.css       Stile globale (tema scuro tech)
css/hero.css        Hero: giostra 3D + riquadro showreel
js/site.js          Preloader, scroll fluido, reveal, titoli split, contatori
js/fx.js            Cursore magnetico (desktop) + rete metallica WebGL
assets/logo.png     Logo colori originali (ritagliato)
assets/logo-white.png  Logo bianco con M arancione (usato ovunque)
assets/foto/        Foto usate dal sito
build-wordpress-theme.py   Genera il tema WordPress dal sito statico
```

File originali di lavoro (nella cartella, da cui derivano gli asset):
`6x3 1.jpg`, `MAXI MD1.jpg`, `STAZIONE 1.jpeg`, `LOGO DSM CON SCRITTA SRL.png`.

## Cache-buster: IMPORTANTE

I riferimenti a CSS/JS nelle pagine hanno un `?v=N` (es. `style.css?v=8`).
**Dopo ogni modifica a un file CSS/JS, incrementare quel numero in tutte
le pagine**, altrimenti il browser mostra la versione vecchia in cache.

## Pubblicazione su WordPress

Il sito statico è il "master". Da esso si genera un tema WordPress:

```
python build-wordpress-theme.py
```

Produce `wordpress-theme/diessemedia/` e `diessemedia-theme.zip` (la cartella
è rigenerabile, quindi NON è su git). Istruzioni d'installazione in
`wordpress-theme/README-INSTALLAZIONE.md` (rigenerare lo script per averlo).
Dopo ogni modifica al sito, ri-lanciare lo script e ricaricare lo zip.

## Identità visiva

- **Brand:** nero + arancione `#EE7D00` (arancione brillante `#FF9A2E`).
- **Font:** Lexend (titoli) + Source Sans 3 (testo).
- **Tema scuro tecnologico:** fondo `#07080d`, aurora animata + rete
  metallica WebGL sullo sfondo, card in vetro scuro con glow arancione.

## Effetti implementati

| Effetto | File | Note |
|---------|------|------|
| Preloader logo | site.js + markup inline | animazione completa solo alla 1ª visita (sessionStorage) |
| Scroll fluido | site.js (Lenis, CDN) | |
| Reveal allo scroll | site.js | con **rete di sicurezza** `sweep()`: nessun testo resta mai invisibile se l'observer non scatta |
| Titoli lettera per lettera | site.js (`splitHeading`) | |
| Contatori animati | site.js | 8.000+, 7.900… contano da zero |
| Giostra 3D | index.html + hero.css | 6 card che ruotano su asse verticale; hover ferma, drag col dito, click naviga |
| Riquadro showreel | index.html + hero.css | sequenza cinematografica poster→maxi→stazione, sotto i numeri |
| Cursore magnetico | fx.js | SOLO desktop (hover+pointer fine) |
| Sfondo rete metallica | fx.js (Three.js 0.149) | fili acciaio che si deformano al passaggio del mouse |

## Lezioni critiche (non ripetere gli errori)

1. **Touch/mobile:** hover solo dentro `(hover:hover)`; gestire sempre
   `pointercancel`; `touch-action` NON basta → serve anche direction-lock +
   `preventDefault` su `touchmove` orizzontale; `draggable=false` su link/img;
   `overflow-x: clip` sulla pagina.
2. **`overflow-x` non-visible rompe `position: sticky`** → l'header è
   `position: fixed` (+ `body { padding-top: 77px }`).
3. **Reveal:** ogni animazione che parte con `opacity:0` DEVE avere un
   fallback che rende il contenuto visibile anche se l'IntersectionObserver
   non scatta (scheda in background, browser lento).
4. **Three.js:** usare la 0.149 UMD; versioni ≥ r150 danno warning di
   deprecazione UMD. Non chiamare `getContext()` sul canvas di Three per
   diagnostica (blocca la creazione del contesto WebGL).
5. **Effetti d'ambiente:** sobri e uniformi. Bocciate: particelle bokeh
   colorate ("carnevale") e sfere metalliche ("fastidiose alla vista").

## Stato dei contenuti

- **Testi Home:** riscrittura copy in corso, pagina per pagina, insieme al
  committente. Fatte: hero, "cosa facciamo", 3 card servizi, metodo,
  showreel, tutte e 6 le card della giostra. Da rivedere: didascalie
  showreel, banda CTA finale.
- **Pagine interne (servizi/impianti/chi-siamo/contatti):** testi ancora
  in bozza, da rivedere.

## Da completare prima della pubblicazione ufficiale

- [ ] Dati reali: telefono, indirizzo sede, P.IVA (cercare `[da inserire]`).
- [ ] Validare i numeri: 8.000+ impianti, 7.900 comuni, 20+ anni; e i dati
      della dashboard giostra (142 impianti / 38 comuni / 1,2M popolazione).
- [ ] Foto reali per gallery e riquadri delle pagine interne (`assets/foto/`,
      nomi indicati nei riquadri grigi segnaposto).
- [ ] Confermare email `info@diessemedia.it`.
- [ ] Collegare il dominio www.diessemedia.it (vedi README.md).
- [ ] La campagna "VELOCE GT" nell'illustrazione di riserva scena 1 è finta.
```
