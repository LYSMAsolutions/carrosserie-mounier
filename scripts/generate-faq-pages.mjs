import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

const faqs = [
  {
    slug: 'choisir-carrossier-apres-accident',
    title: 'Puis-je choisir mon carrossier après un accident ?',
    answer: "Oui. Vous restez libre du choix de votre réparateur, quelle que soit votre compagnie d’assurance. Après un accident, vous pouvez confier votre véhicule à l’atelier de votre choix. Carrosserie Mounier vous accompagne dans la compréhension des démarches et dans l’estimation des réparations nécessaires.",
  },
  {
    slug: 'prise-en-charge-assurance',
    title: 'Comment se passe une prise en charge assurance ?',
    answer: "Après un sinistre, l’équipe vous aide à clarifier les étapes : première prise de contact, analyse des dommages, devis, échanges administratifs et organisation de la réparation. L’objectif est de rendre le parcours plus simple, plus lisible et plus rassurant.",
  },
  {
    slug: 'prix-renovation-phare',
    title: 'Combien coûte une rénovation de phare ?',
    answer: "La rénovation optique est proposée à partir de 80 € à 150 €*. Le tarif dépend du niveau d’altération, de l’état général des optiques et de la méthode nécessaire. Un diagnostic préalable permet d’établir une estimation adaptée à votre véhicule.",
  },
  {
    slug: 'duree-reparation-carrosserie',
    title: 'Combien de temps dure une réparation carrosserie ?',
    answer: "La durée dépend de l’étendue du dommage, de la zone touchée, des pièces éventuelles et du niveau de finition nécessaire. Après examen du véhicule, l’atelier vous donne une estimation claire du délai d’immobilisation.",
  },
  {
    slug: 'changer-courroie-distribution',
    title: 'Quand faut-il changer sa courroie de distribution ?',
    answer: "La courroie de distribution se remplace selon l’âge, le kilométrage et les préconisations du constructeur. C’est une intervention préventive importante, car une rupture peut entraîner une casse moteur coûteuse.",
  },
]

function layout({ title, body, root = '..' }) {
  return `<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" href="${root}/assets/icons/favicon-mounier.ico" type="image/x-icon">
  <title>${title} | Carrosserie Mounier</title>
  <meta name="description" content="${title} - Réponse claire par Carrosserie Mounier à Trélissac près de Périgueux.">
  <link rel="stylesheet" href="${root}/css/style.css">
  <link rel="stylesheet" href="${root}/css/responsive.css">
</head>
<body>
  <header class="site-header">
    <div class="container header-inner">
      <a class="logo" href="${root}/" aria-label="Accueil Carrosserie Mounier"><img src="${root}/assets/logos/logo-mounier.png" alt="Carrosserie Mounier" class="logo-img"></a>
      <nav class="main-nav" aria-label="Navigation principale">
        <a href="${root}/">Accueil</a>
        <div class="nav-group"><button type="button">Prestations mécaniques</button><div><a href="${root}/prestations/revision-vidange/">Révision et Vidange</a><a href="${root}/prestations/courroie-distribution/">Courroie de Distribution</a><a href="${root}/prestations/freinage/">Freinage</a><a href="${root}/prestations/amortisseurs/">Amortisseurs</a><a href="${root}/prestations/liquide-refroidissement/">Liquide de Refroidissement</a><a href="${root}/prestations/bougies-allumage/">Bougies d’Allumage</a></div></div>
        <div class="nav-group"><button type="button">Prestations carrosserie</button><div><a href="${root}/prestations/rayure-profonde/">Rayure Profonde</a><a href="${root}/prestations/reparation-carrosserie/">Réparation Carrosserie</a><a href="${root}/prestations/reparation-parechoc-plastique/">Pare-Chocs Plastique</a><a href="${root}/prestations/renovation-optique/">Rénovation Optique</a></div></div>
        <div class="nav-group"><button type="button">Covering & Flocage</button><div><a href="${root}/prestations/covering/">Covering Automobile</a><a href="${root}/prestations/flocage/">Flocage Véhicule & Entreprise</a></div></div>
        <a href="${root}/realisations/">Réalisations</a>
        <a class="active" href="${root}/faq/">FAQ</a>
        <a href="${root}/contact/">Contact</a>
        <a href="${root}/recrutement/">Recrutement</a>
        <div class="menu-actions"><a href="tel:+33608378217">Appeler</a><a href="${root}/contact/">Devis</a></div>
      </nav>
      <a class="btn btn-header" href="${root}/contact/">Demander un devis</a>
      <button class="mobile-toggle" type="button" aria-label="Ouvrir le menu"><span></span><span></span><span></span></button>
    </div>
  </header>
  ${body}
  <footer class="site-footer">
    <div class="container footer-inner">
      <div><strong>Carrosserie Mounier</strong><br>Carrosserie, entretien, covering et flocage à Trélissac.</div>
      <div class="footer-links"><a href="${root}/prestations/">Prestations</a><a href="${root}/realisations/">Réalisations</a><a href="${root}/faq/">FAQ</a><a href="${root}/contact/">Contact</a><a href="${root}/recrutement/">Recrutement</a></div>
      <div>© <span data-year></span> Carrosserie Mounier</div>
    </div>
  </footer>
  <script src="${root}/js/main.js"></script>
  <script src="${root}/js/animations.js"></script>
</body>
</html>`
}

await mkdir('faq', { recursive: true })

const indexBody = `<main>
  <section class="hero hero-premium hero-refined page-hero">
    <div class="hero-glow"></div>
    <div class="container hero-content">
      <div class="hero-copy reveal">
        <div class="eyebrow">FAQ</div>
        <h1 class="section-title">Questions fr&eacute;quentes.</h1>
        <p class="section-desc">Des r&eacute;ponses simples sur l’assurance, les d&eacute;lais, les devis et les principales interventions.</p>
        <div class="hero-actions hero-bubble-actions">
          <a class="side-action" href="tel:+33608378217"><span>&#9742;</span><strong>Appeler</strong><small>06 08 37 82 17</small></a>
          <a class="side-action side-action-devis" href="../contact/"><span>&#8599;</span><strong>Devis</strong><small>Demande rapide</small></a>
        </div>
      </div>
    </div>
  </section>
  <section class="section section-soft">
    <div class="container faq-page-grid">
      ${faqs.map((faq) => `<a class="faq-link-card reveal" href="${faq.slug}/"><strong>${faq.title}</strong><span>Lire la réponse</span></a>`).join('\n')}
    </div>
  </section>
</main>`

await writeFile('faq/', layout({ title: 'FAQ carrosserie et assurance', body: indexBody, root: '..' }), 'utf8')

for (const faq of faqs) {
  const dir = path.join('faq', faq.slug)
  await mkdir(dir, { recursive: true })
  const body = `<main>
  <section class="hero hero-premium hero-refined page-hero">
    <div class="hero-glow"></div>
    <div class="container hero-content">
      <div class="hero-copy reveal">
        <div class="eyebrow">FAQ</div>
        <h1 class="section-title">${faq.title}</h1>
        <div class="hero-actions hero-bubble-actions">
          <a class="side-action" href="tel:+33608378217"><span>&#9742;</span><strong>Appeler</strong><small>06 08 37 82 17</small></a>
          <a class="side-action side-action-devis" href="../../contact/"><span>&#8599;</span><strong>Devis</strong><small>Demande rapide</small></a>
        </div>
      </div>
    </div>
  </section>
  <section class="section section-soft">
    <div class="container service-page-layout">
      <article class="service-page-main reveal">
        <h2>Réponse détaillée</h2>
        <p>${faq.answer}</p>
        <h2>Besoin d’un avis sur votre véhicule ?</h2>
        <p>Contactez l’atelier pour obtenir une réponse adaptée à votre situation, à votre véhicule et au type d’intervention envisagé.</p>
        <div class="hero-actions cta-bubble-actions"><a class="side-action side-action-devis" href="../../contact/"><span>&#8599;</span><strong>Devis</strong><small>Demande rapide</small></a><a class="side-action" href="tel:+33608378217"><span>&#9742;</span><strong>Appeler</strong><small>06 08 37 82 17</small></a></div>
      </article>
      <aside class="service-page-side reveal">
        <strong>À lire aussi</strong>
        <a class="btn btn-outline dark" href="../../prestations/reparation-carrosserie/">Réparation carrosserie</a>
        <a class="btn btn-outline dark" href="../../prestations/renovation-optique/">Rénovation optique</a>
        <a class="btn btn-outline dark" href="../../faq/">Toutes les FAQ</a>
      </aside>
    </div>
  </section>
</main>`
  await writeFile(path.join(dir, 'index.html'), layout({ title: faq.title, body, root: '../..' }), 'utf8')
}

console.log(`Generated ${faqs.length + 1} FAQ pages.`)





