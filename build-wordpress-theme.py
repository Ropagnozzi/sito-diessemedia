# -*- coding: utf-8 -*-
"""
Genera il tema WordPress 'diessemedia' a partire dal sito statico.
Uso:  python build-wordpress-theme.py
Output: wordpress-theme/diessemedia/  +  wordpress-theme/diessemedia-theme.zip

Il sito statico resta il master: dopo ogni modifica al design,
rilanciare questo script per rigenerare il tema.
"""
import io, os, re, shutil, zipfile

BASE = os.path.dirname(os.path.abspath(__file__))
THEME = os.path.join(BASE, 'wordpress-theme', 'diessemedia')
VERSION = '1.0.0'

PAGES = {
    'index.html':     'front-page.php',
    'servizi.html':   'page-servizi.php',
    'impianti.html':  'page-impianti.php',
    'chi-siamo.html': 'page-chi-siamo.php',
    'contatti.html':  'page-contatti.php',
}

TPL_URI = "<?php echo esc_url( get_template_directory_uri() ); ?>"

LINK_MAP = [
    ('href="index.html"',     'href="<?php echo esc_url( home_url( \'/\' ) ); ?>"'),
    ('href="servizi.html"',   'href="<?php echo esc_url( home_url( \'/servizi/\' ) ); ?>"'),
    ('href="impianti.html"',  'href="<?php echo esc_url( home_url( \'/impianti/\' ) ); ?>"'),
    ('href="chi-siamo.html"', 'href="<?php echo esc_url( home_url( \'/chi-siamo/\' ) ); ?>"'),
    ('href="contatti.html"',  'href="<?php echo esc_url( home_url( \'/contatti/\' ) ); ?>"'),
    ('src="assets/',          'src="' + TPL_URI + '/assets/'),
]


def read(path):
    return io.open(path, encoding='utf-8').read()


def write(path, content):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    io.open(path, 'w', encoding='utf-8', newline='\n').write(content)


def apply_links(html):
    for old, new in LINK_MAP:
        html = html.replace(old, new)
    return html


def extract(html, start_marker, end_marker, include_end=False):
    i = html.index(start_marker)
    j = html.index(end_marker, i)
    if include_end:
        j += len(end_marker)
    return html[i:j]


def body_content(html):
    """Contenuto tra la chiusura dell'header del sito e il footer."""
    i = html.index('</header>') + len('</header>')
    j = html.index('<footer class="site-footer">')
    return html[i:j].strip('\n')


def page_scripts(html):
    """Script inline dopo il footer (es. buildMail in contatti), esclusi i CDN GSAP e hero."""
    i = html.index('</footer>')
    tail = html[i:]
    scripts = re.findall(r'<script>.*?</script>', tail, re.S)
    return [s for s in scripts if 'gsap' not in s and 'cinema' not in s]


def hero_js(index_html):
    # greedy: cattura TUTTI gli IIFE dentro l'unico blocco <script> inline della home
    m = re.search(r'<script>\s*(\(function \(\) \{.*\}\)\(\);)\s*</script>', index_html, re.S)
    return m.group(1)


def build():
    if os.path.isdir(THEME):
        shutil.rmtree(THEME)
    os.makedirs(THEME)

    # ---------- style.css (header tema WP + CSS del sito) ----------
    wp_header = (
        "/*\n"
        "Theme Name: Diesse Media\n"
        "Theme URI: https://www.diessemedia.it\n"
        "Author: Diesse Media SRL\n"
        "Description: Tema personalizzato Diesse Media - centro media comunicazione outdoor. Generato dal sito statico con build-wordpress-theme.py.\n"
        "Version: " + VERSION + "\n"
        "License: proprietario\n"
        "Text Domain: diessemedia\n"
        "*/\n\n"
    )
    write(os.path.join(THEME, 'style.css'), wp_header + read(os.path.join(BASE, 'css', 'style.css')))
    write(os.path.join(THEME, 'css', 'hero.css'), read(os.path.join(BASE, 'css', 'hero.css')))

    # ---------- assets ----------
    shutil.copytree(os.path.join(BASE, 'assets'), os.path.join(THEME, 'assets'))

    # ---------- hero.js + site.js ----------
    index_html = read(os.path.join(BASE, 'index.html'))
    write(os.path.join(THEME, 'js', 'hero.js'), hero_js(index_html) + '\n')
    write(os.path.join(THEME, 'js', 'site.js'), read(os.path.join(BASE, 'js', 'site.js')))
    write(os.path.join(THEME, 'js', 'fx.js'), read(os.path.join(BASE, 'js', 'fx.js')))
    write(os.path.join(THEME, 'js', 'i18n.js'), read(os.path.join(BASE, 'js', 'i18n.js')))

    # ---------- functions.php ----------
    write(os.path.join(THEME, 'functions.php'), r"""<?php
/**
 * Tema Diesse Media - setup e asset.
 */

function dsm_setup() {
    add_theme_support( 'title-tag' );
    add_theme_support( 'automatic-feed-links' );
    register_nav_menus( array( 'primary' => 'Menu principale' ) );
}
add_action( 'after_setup_theme', 'dsm_setup' );

function dsm_assets() {
    $v = wp_get_theme()->get( 'Version' );
    wp_enqueue_style( 'dsm-style', get_stylesheet_uri(), array(), $v );
    wp_enqueue_style( 'dsm-hero', get_template_directory_uri() . '/css/hero.css', array( 'dsm-style' ), $v );
    wp_enqueue_script( 'lenis', 'https://cdn.jsdelivr.net/npm/lenis@1.1.14/dist/lenis.min.js', array(), '1.1.14', true );
    wp_enqueue_script( 'three', 'https://cdn.jsdelivr.net/npm/three@0.149.0/build/three.min.js', array(), '0.149.0', true );
    wp_enqueue_script( 'dsm-i18n', get_template_directory_uri() . '/js/i18n.js', array(), $v, true );
    wp_enqueue_script( 'dsm-site', get_template_directory_uri() . '/js/site.js', array( 'lenis', 'dsm-i18n' ), $v, true );
    wp_enqueue_script( 'dsm-fx', get_template_directory_uri() . '/js/fx.js', array( 'three' ), $v, true );
    if ( is_front_page() ) {
        wp_enqueue_script( 'gsap', 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js', array(), '3.12.5', true );
        wp_enqueue_script( 'dsm-hero', get_template_directory_uri() . '/js/hero.js', array( 'gsap' ), $v, true );
    }
}
add_action( 'wp_enqueue_scripts', 'dsm_assets' );
""")

    # ---------- header.php ----------
    write(os.path.join(THEME, 'header.php'), r"""<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
<meta charset="<?php bloginfo( 'charset' ); ?>">
<meta name="viewport" content="width=device-width, initial-scale=1">
<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<!-- Preloader: animazione completa solo alla prima visita della sessione -->
<div class="preloader" id="preloader" aria-hidden="true">
  <div class="preloader-inner">
    <img src="<?php echo esc_url( get_template_directory_uri() ); ?>/assets/logo-white.png" alt="">
    <div class="preloader-bar"><span></span></div>
  </div>
</div>
<script>
(function () {
  var p = document.getElementById('preloader');
  try {
    if (sessionStorage.getItem('dsmSeen')) { p.classList.add('skip'); }
    else { sessionStorage.setItem('dsmSeen', '1'); }
  } catch (e) { p.classList.add('skip'); }
  setTimeout(function () { p.classList.add('done'); }, 3000);
})();
</script>

<header class="site-header">
  <div class="container header-inner">
    <a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="logo" aria-label="Diesse Media — Home">
      <img src="<?php echo esc_url( get_template_directory_uri() ); ?>/assets/logo.png" alt="Diesse Media SRL" class="logo-light">
      <img src="<?php echo esc_url( get_template_directory_uri() ); ?>/assets/logo-white.png" alt="" class="logo-dark" aria-hidden="true">
    </a>
    <span class="lang-switch lang-switch-mobile" role="group" aria-label="Language">
      <button type="button" data-lang-btn="it">IT</button>
      <button type="button" data-lang-btn="en">EN</button>
    </span>
    <button class="nav-toggle" aria-label="Apri menu" data-i18n-aria-label="a11y.menu" onclick="document.getElementById('nav').classList.toggle('open')">
      <span></span><span></span><span></span>
    </button>
    <nav class="main-nav" id="nav">
      <?php
      $dsm_items = array(
          array( home_url( '/' ),           'Home',                 is_front_page(),        'nav.home' ),
          array( home_url( '/servizi/' ),   'Servizi',              is_page( 'servizi' ),   'nav.servizi' ),
          array( home_url( '/impianti/' ),  'Impianti e Copertura', is_page( 'impianti' ),  'nav.impianti' ),
          array( home_url( '/chi-siamo/' ), 'Chi Siamo',            is_page( 'chi-siamo' ), 'nav.chisiamo' ),
          array( home_url( '/contatti/' ),  'Contatti',             is_page( 'contatti' ),  'nav.contatti' ),
      );
      foreach ( $dsm_items as $it ) {
          printf(
              '<a href="%s"%s data-i18n="%s">%s</a>',
              esc_url( $it[0] ),
              $it[2] ? ' class="active"' : '',
              esc_attr( $it[3] ),
              esc_html( $it[1] )
          );
      }
      ?>
      <a href="<?php echo esc_url( home_url( '/contatti/' ) ); ?>" class="btn btn-primary" data-i18n="nav.cta">Richiedi preventivo</a>
      <span class="lang-switch" role="group" aria-label="Language">
        <button type="button" data-lang-btn="it">IT</button>
        <button type="button" data-lang-btn="en">EN</button>
        <button type="button" data-lang-btn="zh">中文</button>
      </span>
    </nav>
  </div>
</header>
""")

    # ---------- footer.php (dal footer del sito statico) ----------
    footer_html = extract(index_html, '<footer class="site-footer">', '</footer>', include_end=True)
    footer_html = apply_links(footer_html)
    write(os.path.join(THEME, 'footer.php'), footer_html + "\n\n<?php wp_footer(); ?>\n</body>\n</html>\n")

    # ---------- template delle pagine ----------
    for src, dst in PAGES.items():
        html = read(os.path.join(BASE, src))
        content = apply_links(body_content(html))
        extra = '\n'.join(apply_links(s) for s in page_scripts(html))
        php = "<?php\n/**\n * Template generato da " + src + " — non modificare a mano, rilanciare build-wordpress-theme.py\n */\nget_header();\n?>\n\n<main>\n" + content + "\n</main>\n"
        if extra:
            php += "\n" + extra + "\n"
        php += "\n<?php get_footer(); ?>\n"
        write(os.path.join(THEME, dst), php)

    # ---------- fallback generici ----------
    write(os.path.join(THEME, 'page.php'), r"""<?php get_header(); ?>
<section class="page-hero">
  <div class="container">
    <h1><?php the_title(); ?></h1>
  </div>
</section>
<main class="section">
  <div class="container">
    <?php while ( have_posts() ) : the_post(); the_content(); endwhile; ?>
  </div>
</main>
<?php get_footer(); ?>
""")
    write(os.path.join(THEME, 'index.php'), r"""<?php get_header(); ?>
<main class="section">
  <div class="container">
    <?php while ( have_posts() ) : the_post(); ?>
      <h2><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h2>
      <?php the_excerpt(); ?>
    <?php endwhile; ?>
  </div>
</main>
<?php get_footer(); ?>
""")

    # ---------- screenshot.png ----------
    try:
        from PIL import Image
        shot = Image.new('RGB', (1200, 900), (16, 16, 16))
        logo = Image.open(os.path.join(BASE, 'assets', 'logo-white.png')).convert('RGBA')
        logo.thumbnail((640, 400))
        shot.paste(logo, ((1200 - logo.size[0]) // 2, (900 - logo.size[1]) // 2), logo)
        shot.save(os.path.join(THEME, 'screenshot.png'))
    except Exception as e:
        print('screenshot saltato:', e)

    # ---------- zip ----------
    zip_path = os.path.join(BASE, 'wordpress-theme', 'diessemedia-theme.zip')
    if os.path.exists(zip_path):
        os.remove(zip_path)
    with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as z:
        for root, _dirs, files in os.walk(THEME):
            for f in files:
                full = os.path.join(root, f)
                rel = os.path.join('diessemedia', os.path.relpath(full, THEME))
                z.write(full, rel)
    print('Tema generato in:', THEME)
    print('Zip pronto:', zip_path)


if __name__ == '__main__':
    build()
