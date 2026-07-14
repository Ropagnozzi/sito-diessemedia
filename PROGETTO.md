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
| Multilingua IT/EN/ZH | i18n.js + attributi data-i18n | selettore IT/EN/中文 nell'header; IT default; scelta salvata in localStorage |

### Come funziona il multilingua (i18n)

- Lingue: **italiano (fonte), inglese, cinese semplificato (中文)**.
- **L'italiano è la fonte** e resta nell'HTML; inglese e cinese vivono nei
  dizionari `DICTS.en` / `DICTS.zh` in `js/i18n.js` (chiavi `data-i18n`).
- Il **cinese** carica il font Noto Sans SC solo quando selezionato; l'animazione
  dei titoli va a capo per singolo carattere (CJK). Per aggiungere una lingua:
  nuovo dizionario in `DICTS` + pulsante `data-lang-btn` nel selettore.
- Ogni testo traducibile ha `data-i18n="chiave"` (o `data-i18n-placeholder`,
  `data-i18n-alt`, `data-i18n-content`, `data-i18n-aria-label` per gli attributi).
- `i18n.js` gira PRIMA di `site.js` (cattura l'italiano, applica la lingua salvata).
- **Per aggiungere/modificare un testo:** modifica l'italiano nell'HTML e, se la
  frase ha una chiave `data-i18n`, aggiorna la traduzione inglese in `js/i18n.js`.
  Per un testo NUOVO: aggiungi `data-i18n="nuova.chiave"` nell'HTML e la voce
  corrispondente nel dizionario EN di `i18n.js`.
- Al cambio lingua `site.js` ri-divide i titoli (effetto lettera per lettera) e
  i contatori usano il separatore migliaia giusto (it: `.` / en: `,`).

## GDPR / Aspetti legali

- Pagine **`privacy.html`** (informativa privacy ex artt. 13-14 GDPR) e
  **`cookie.html`** (cookie policy). Link nel footer di tutte le pagine
  (`.footer-legal`).
- **Banner cookie** (`.cookie-banner`, id `cookie-banner`) su tutte le pagine:
  informativo (solo cookie tecnici, nessuna profilazione), con "Ho capito";
  la presa visione è salvata in localStorage `dsmCookieOK`.
- Il **corpo legale resta in italiano** (lingua che fa fede, indicato nella nota
  in cima); header/footer/banner/hero/intestazioni-tabella traducono (IT/EN/ZH).
- **DA COMPLETARE prima della pubblicazione** (testi template, non consulenza legale):
  far validare da un consulente/DPO e compilare i segnaposto — `[Indirizzo]`,
  `[P.IVA]`, `[PEC]`, `[Telefono]`, eventuale DPO. Valutare l'auto-hosting di
  font/librerie (ora caricati da Google/jsDelivr/cdnjs: trasmettono l'IP a terzi,
  disclosure già presente nella cookie policy).

## SEO

Audit completo eseguito con la skill Claude SEO (2026-07-14): Health Score ~40/100
(sito pre-lancio). **Quick-win tecnici già implementati:**
- `robots.txt` (con regole bot AI), `sitemap.xml`, `llms.txt`, `404.html` brandizzata.
- **Schema.org JSON-LD** in ogni pagina: `AdvertisingAgency` (Organization) + `WebSite`
  (home) + `BreadcrumbList` (pagine interne) + 6× `Service` (servizi). Dominio
  `www.diessemedia.it`. Telefono/P.IVA/indirizzo-via/sameAs OMESSI dallo schema
  finché non ci sono i dati reali (meglio omettere che mettere segnaposto non validi).
- `canonical`, **Open Graph + Twitter Card** (+ immagine social `assets/og-cover.jpg`
  1200×630), **favicon** (`favicon.ico` + `assets/icons/`) su tutte le pagine.
- Performance: font Google spostati da `@import` (in style.css) a `<link>`+preconnect
  nell'`<head>`; foto scena compresse (668→158 KB, 593→132 KB); `preload` LCP in home.

**Ancora da fare (richiedono dati/decisioni del committente):** completare NAP reale
(→ poi aggiornare lo schema), foto reali + validare i numeri, profili social (`sameAs`),
Google Business Profile ("Advertising agency"), decisione EN/ZH (URL statici+hreflang
per SEO oppure solo UX), pagine città (Napoli/Caserta/…), FAQ, case study, H1 con keyword.
Nota WP: OG/canonical per-pagina nel tema WordPress vanno aggiunti via functions.php (il
build inietta solo font+favicon+Organization nell'header.php).

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
