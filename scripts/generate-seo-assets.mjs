import { readdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

const siteUrl = 'https://carrosserie-mounier.fr'

const root = process.cwd()
const communesPath = path.join(root, 'content', 'communes-dordogne.json')
const communes = JSON.parse((await readFile(communesPath, 'utf8')).replace(/^\uFEFF/, ''))
  .sort((a, b) => a.nom.localeCompare(b.nom, 'fr'))

const localFocusCommunes = [
  'Trélissac',
  'Champcevinel',
  'Périgueux',
  'Boulazac Isle Manoire',
  'Chancelade',
  'Coulounieix-Chamiers',
  'Sanilhac',
  'Marsac-sur-l’Isle',
  'Bassillac et Auberoche',
  'Antonne-et-Trigonant',
  'Agonac',
  'Sarliac-sur-l’Isle',
]

const services = [
  {
    title: 'Carrosserie et peinture automobile',
    text: 'Réparation carrosserie, peinture automobile, reprise de rayures profondes, pare-chocs plastique et rénovation optique de phare près de Périgueux.',
    href: '../prestations/reparation-carrosserie/',
  },
  {
    title: 'Lustrage et finition esthétique',
    text: 'Préparation, finition, correction visuelle et soin du détail pour retrouver une carrosserie plus nette et plus valorisante.',
    href: '../realisations/',
  },
  {
    title: 'Covering automobile',
    text: 'Covering partiel ou complet, personnalisation et protection esthétique pour véhicules particuliers et professionnels.',
    href: '../prestations/covering/',
  },
  {
    title: 'Flocage véhicule et entreprise',
    text: 'Marquage publicitaire, flocage d’utilitaires, véhicules commerciaux et flottes professionnelles en Dordogne.',
    href: '../prestations/flocage/',
  },
]

const communeItems = communes
  .map((commune) => {
    const cp = commune.codesPostaux?.join(', ') ?? ''
    return `<li><span>${escapeHtml(commune.nom)}</span><small>${escapeHtml(cp)}</small></li>`
  })
  .join('\n')

const focusItems = localFocusCommunes
  .map((name) => `<span>${escapeHtml(name)}</span>`)
  .join('\n')

const serviceCards = services
  .map(
    (service) => `
          <a class="local-service-card reveal" href="${service.href}">
            <strong>${escapeHtml(service.title)}</strong>
            <span>${escapeHtml(service.text)}</span>
          </a>`
  )
  .join('\n')

await writeFile(
  path.join(root, 'zones-intervention', 'index.html'),
  `<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" href="../assets/icons/favicon-mounier.ico" type="image/x-icon">
  <title>Carrosserie, lustrage, covering et flocage en Dordogne | Carrosserie Mounier</title>
  <meta name="description" content="Carrosserie Mounier intervient à Trélissac, Périgueux et en Dordogne pour carrosserie, peinture automobile, lustrage, covering et flocage véhicule.">
  <link rel="canonical" href="${siteUrl}/zones-intervention/">
  <link rel="stylesheet" href="../css/style.css">
  <link rel="stylesheet" href="../css/responsive.css">
</head>

<body>
  <header class="site-header">
    <div class="container header-inner">
      <a class="logo" href="../" aria-label="Accueil Carrosserie Mounier">
        <img src="../assets/logos/logo-mounier.png" alt="Carrosserie Mounier" class="logo-img">
      </a>
      <nav class="main-nav" aria-label="Navigation principale">
        <a href="../">Accueil</a>
        <div class="nav-group"><button type="button">Prestations mécaniques</button><div><a href="../prestations/revision-vidange/">Révision et Vidange</a><a href="../prestations/courroie-distribution/">Courroie de Distribution</a><a href="../prestations/freinage/">Freinage</a><a href="../prestations/amortisseurs/">Amortisseurs</a><a href="../prestations/liquide-refroidissement/">Liquide de Refroidissement</a><a href="../prestations/bougies-allumage/">Bougies d’Allumage</a></div></div>
        <div class="nav-group"><button type="button">Prestations carrosserie</button><div><a href="../prestations/rayure-profonde/">Rayure Profonde</a><a href="../prestations/reparation-carrosserie/">Réparation Carrosserie</a><a href="../prestations/reparation-parechoc-plastique/">Pare-Chocs Plastique</a><a href="../prestations/parebrise/">Pare-brise</a><a href="../prestations/renovation-optique/">Rénovation Optique</a></div></div>
        <div class="nav-group"><button type="button">Covering & Flocage</button><div><a href="../prestations/covering/">Covering Automobile</a><a href="../prestations/flocage/">Flocage Véhicule & Entreprise</a></div></div>
        <a href="../prestations/">Prestations</a>
        <a href="../realisations/">Réalisations</a>
        <a href="../faq/">FAQ</a>
        <a href="../contact/">Contact</a>
        <a href="../recrutement/">Recrutement</a>
        <div class="menu-actions"><a href="tel:+33608378217">Appeler</a><a href="../contact/">Devis</a></div>
      </nav>
      <a class="btn btn-header" href="../contact/">Demander un devis</a>
      <button class="mobile-toggle" type="button" aria-label="Ouvrir le menu"><span></span><span></span><span></span></button>
    </div>
  </header>

  <main>
    <section class="hero hero-premium hero-refined page-hero">
      <div class="hero-glow"></div>
      <div class="container hero-content">
        <div class="hero-copy reveal">
          <div class="eyebrow">Référencement local Dordogne</div>
          <h1>Carrosserie, lustrage, covering et flocage en Dordogne</h1>
          <p>Basée à Trélissac, Carrosserie Mounier accompagne les automobilistes et professionnels autour de Périgueux et dans l’ensemble de la Dordogne.</p>
          <div class="hero-actions hero-bubble-actions">
            <a class="side-action" href="tel:+33608378217"><span>&#9742;</span><strong>Appeler</strong><small>06 08 37 82 17</small></a>
            <a class="side-action side-action-devis" href="../contact/"><span>&#8599;</span><strong>Devis</strong><small>Demande rapide</small></a>
          </div>
        </div>
      </div>
    </section>

    <section class="section section-soft">
      <div class="container local-seo-intro">
        <div class="section-head reveal">
          <div>
            <div class="kicker">Zone d’intervention</div>
            <h2 class="section-title">Un atelier de référence près de Périgueux.</h2>
          </div>
          <p class="section-desc">Cette page présente clairement les prestations et les communes desservies, sans texte masqué ni bourrage de mots-clés.</p>
        </div>
        <p class="local-seo-text reveal">Pour une réparation carrosserie, une peinture automobile, un lustrage de finition, une rénovation d’optique, un covering automobile ou un flocage professionnel, l’atelier accueille les clients de Trélissac, Champcevinel, Périgueux, Boulazac, Chancelade et plus largement de Dordogne.</p>
        <div class="local-focus-grid reveal">${focusItems}</div>
      </div>
    </section>

    <section class="section section-dark">
      <div class="container">
        <div class="section-head reveal">
          <div>
            <div class="kicker">Prestations locales</div>
            <h2 class="section-title">Carrosserie, lustrage, covering et flocage.</h2>
          </div>
          <p class="section-desc">Chaque service renvoie vers une page utile pour comprendre l’intervention et demander une estimation.</p>
        </div>
        <div class="local-service-grid">${serviceCards}
        </div>
      </div>
    </section>

    <section class="section section-soft">
      <div class="container">
        <div class="section-head reveal">
          <div>
            <div class="kicker">Communes de Dordogne</div>
            <h2 class="section-title">${communes.length} communes référencées.</h2>
          </div>
          <p class="section-desc">Liste issue de l’API Découpage Administratif du gouvernement, utilisée pour clarifier la zone locale du site.</p>
        </div>
        <details class="local-communes-details reveal">
          <summary>Afficher la liste des communes de Dordogne</summary>
          <ul class="local-communes-grid">
${communeItems}
          </ul>
        </details>
      </div>
    </section>

    <section class="section section-dark">
      <div class="container">
        <div class="cta-final reveal">
          <h2>Besoin d’une estimation pour votre véhicule ?</h2>
          <p>Envoyez une demande de devis ou appelez directement l’atelier. Une photo peut aider à orienter le premier échange.</p>
          <div class="hero-actions cta-bubble-actions">
            <a class="side-action" href="tel:+33608378217"><span>&#9742;</span><strong>Appeler</strong><small>06 08 37 82 17</small></a>
            <a class="side-action side-action-devis" href="../contact/"><span>&#8599;</span><strong>Devis</strong><small>Demande rapide</small></a>
          </div>
        </div>
      </div>
    </section>
  </main>

  <div class="mobile-sticky-cta" aria-label="Actions rapides mobile"><a href="tel:+33608378217">Appeler</a><a href="../contact/">Devis</a></div>

  <footer class="site-footer">
    <div class="container footer-inner">
      <div><strong>Carrosserie Mounier</strong><br>Carrosserie, entretien, covering et flocage à Trélissac.</div>
      <div class="footer-links"><a href="../prestations/">Prestations</a><a href="../realisations/">Réalisations</a><a href="./">Zones d’intervention</a><a href="../faq/">FAQ</a><a href="../contact/">Contact</a></div>
      <div>&copy; <span data-year></span> Carrosserie Mounier</div>
    </div>
  </footer>

  <script src="../js/main.js"></script>
  <script src="../js/animations.js"></script>
  <script src="../js/content-overrides.js"></script>
</body>
</html>
`
)

const htmlFiles = await listHtmlFiles(root)
const urls = htmlFiles
  .filter((file) => !file.includes(`${path.sep}dist${path.sep}`))
  .map((file) => path.relative(root, file).replaceAll(path.sep, '/'))
  .sort()

const sitemapEntries = urls
  .map((url) => {
    const cleanUrl = url === 'index.html'
      ? ''
      : url.endsWith('/index.html')
        ? `/${url.slice(0, -'index.html'.length)}`
        : `/${url}`
    const loc = `${siteUrl}${cleanUrl}`
    const priority = url === 'index.html' ? '1.0' : url.includes('prestations/') ? '0.8' : '0.7'
    return `  <url><loc>${loc}</loc><changefreq>monthly</changefreq><priority>${priority}</priority></url>`
  })
  .join('\n')

await writeFile(
  path.join(root, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapEntries}\n</urlset>\n`
)

await writeFile(
  path.join(root, 'robots.txt'),
  `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`
)

async function listHtmlFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    if (entry.name === 'node_modules' || entry.name === 'dist') continue
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) files.push(...await listHtmlFiles(fullPath))
    if (entry.isFile() && entry.name.endsWith('.html')) files.push(fullPath)
  }

  return files
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}






