import { mkdir, readdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

const logoMecaniqueDir = path.join('assets', 'logo-marque-mecanique')
const logoMecaniqueFiles = (await readdir(logoMecaniqueDir, { withFileTypes: true }).catch(() => []))
  .filter((entry) => entry.isFile() && /\.(png|jpe?g|webp|avif|svg)$/i.test(entry.name))
  .map((entry) => entry.name)
  .sort((a, b) => a.localeCompare(b, 'fr'))

const prestations = [
  {
    slug: 'revision-vidange',
    title: 'Révision et vidange',
    category: 'Entretien automobile',
    seo: 'révision voiture, vidange voiture, entretien automobile, garage entretien Périgueux',
    image: 'atelier-resine.jpg',
    intro: "Un entretien régulier protège le moteur, maîtrise la consommation et préserve la fiabilité de votre véhicule. À Trélissac, Carrosserie Mounier réalise votre révision avec une lecture claire des besoins réels.",
    why: "La vidange moteur, les filtres, les niveaux et les contrôles de sécurité permettent de limiter l’usure et de conserver un véhicule sain au quotidien.",
    symptoms: ['Voyant entretien allumé', 'Kilométrage ou échéance atteinte', 'Huile ancienne ou niveau bas', 'Surconsommation', 'Départ en vacances ou contrôle avant trajet'],
    includes: ['Vidange moteur', 'Remplacement des filtres selon besoin', 'Contrôle des niveaux', 'Contrôle sécurité', 'Diagnostic visuel des points essentiels'],
    faq: [['Quand faire une vidange voiture ?', "La fréquence dépend du modèle, de l’huile utilisée et de votre usage. Nous vérifions les préconisations adaptées."], ['Puis-je conserver ma garantie constructeur ?', "Oui, un entretien réalisé selon les recommandations du constructeur contribue au bon suivi du véhicule."]],
    related: ['freinage', 'liquide-refroidissement', 'diagnostic-securite'],
  },
  {
    slug: 'courroie-distribution',
    title: 'Courroie de distribution',
    category: 'Moteur',
    seo: 'changement courroie distribution, kit distribution, distribution voiture',
    image: 'aire-preparation.jpg',
    intro: "La courroie de distribution est un élément vital du moteur. Son remplacement préventif évite une casse moteur et sécurise l’utilisation du véhicule.",
    why: "Anticiper le changement du kit distribution permet d’éviter une panne lourde, souvent coûteuse, et de repartir sur une base mécanique fiable.",
    symptoms: ['Échéance constructeur dépassée', 'Historique d’entretien incertain', 'Bruit suspect côté moteur', 'Fuite autour de la pompe à eau', 'Véhicule acheté récemment sans justificatif'],
    includes: ['Kit distribution', 'Galets', 'Pompe à eau si nécessaire', 'Contrôle courroie accessoires', 'Vérification après intervention'],
    faq: [['Quand changer une distribution voiture ?', "Selon l’âge, le kilométrage et la motorisation. Nous vous indiquons l’échéance adaptée."], ['Faut-il changer la pompe à eau ?', "Elle est souvent remplacée avec la distribution lorsque son accès est commun."]],
    related: ['revision-vidange', 'liquide-refroidissement', 'bougies-allumage'],
  },
  {
    slug: 'freinage',
    title: 'Disques et plaquettes de frein',
    category: 'Sécurité',
    seo: 'plaquettes frein, disques frein, freinage voiture',
    image: 'atelier-resine.jpg',
    intro: "Un freinage efficace est essentiel à votre sécurité. Nous contrôlons disques, plaquettes et liquide de frein pour vous conseiller avec précision.",
    why: "Des freins en bon état garantissent une réponse stable, une distance de freinage maîtrisée et une conduite plus rassurante.",
    symptoms: ['Bruit au freinage', 'Vibrations', 'Pédale molle', 'Voyant frein', 'Distance de freinage plus longue'],
    includes: ['Contrôle des plaquettes', 'Contrôle des disques', 'Vérification du liquide de frein', 'Remplacement des pièces nécessaires', 'Essai routier'],
    faq: [['Faut-il remplacer disques et plaquettes ensemble ?', "Cela dépend de l’état des disques. Le diagnostic permet de choisir la solution juste."], ['Où contrôler son freinage près de Périgueux ?', "Carrosserie Mounier vous accueille à Trélissac, près de Périgueux, Boulazac et Champcevinel."]],
    related: ['liquide-frein', 'amortisseurs', 'diagnostic-securite'],
  },
  {
    slug: 'climatisation',
    title: 'Recharge climatisation',
    category: 'Confort',
    seo: 'recharge climatisation voiture, clim auto Périgueux',
    image: 'carrosserie-ext.jpeg',
    intro: "Une climatisation performante améliore le confort, le désembuage et l’agrément de conduite en toute saison.",
    why: "Le contrôle du système permet de vérifier que la recharge est pertinente et que le fonctionnement reste régulier.",
    symptoms: ['Air moins froid', 'Désembuage lent', 'Odeur inhabituelle', 'Climatisation inutilisée longtemps', 'Confort réduit en été'],
    includes: ['Contrôle de fonctionnement', 'Recherche de symptôme visible', 'Recharge selon compatibilité', 'Vérification du froid', 'Conseil d’utilisation'],
    faq: [['Une clim doit-elle être rechargée régulièrement ?', "Oui, selon l’utilisation et l’état du circuit. Un contrôle évite une recharge inutile."], ['La clim aide-t-elle en hiver ?', "Oui, elle participe au désembuage et au confort intérieur."]],
    related: ['revision-vidange', 'diagnostic-electronique', 'diagnostic-securite'],
  },
  {
    slug: 'amortisseurs',
    title: 'Amortisseurs',
    category: 'Tenue de route',
    seo: 'amortisseurs voiture, suspension automobile',
    image: 'atelier-resine.jpg',
    intro: "Les amortisseurs influencent directement la tenue de route, le confort et la stabilité au freinage.",
    why: "Une suspension en bon état maintient les pneus au contact de la route et améliore la maîtrise du véhicule.",
    symptoms: ['Véhicule qui rebondit', 'Bruit sur route dégradée', 'Usure irrégulière des pneus', 'Perte de confort', 'Sensation d’instabilité'],
    includes: ['Contrôle amortisseurs', 'Contrôle suspension', 'Coupelles selon besoin', 'Conseil sur la tenue de route', 'Vérification après intervention'],
    faq: [['Quand changer des amortisseurs voiture ?', "Lorsque la tenue de route, le confort ou l’usure des pneus deviennent anormaux."], ['Les amortisseurs influencent-ils la sécurité ?', "Oui, ils participent à la stabilité, au confort et au comportement du véhicule au freinage."]],
    related: ['parallelisme-geometrie', 'freinage', 'diagnostic-securite'],
  },
  {
    slug: 'parallelisme-geometrie',
    title: 'Parallélisme et géométrie',
    category: 'Train roulant',
    seo: 'parallélisme voiture, géométrie automobile Périgueux',
    image: 'aire-preparation.jpg',
    intro: "Un réglage de parallélisme et de géométrie améliore la précision de conduite et limite l’usure irrégulière des pneus.",
    why: "Après un choc, un changement de pneus ou une intervention suspension, la géométrie contribue à retrouver un comportement stable.",
    symptoms: ['Voiture qui tire d’un côté', 'Volant décentré', 'Pneus usés irrégulièrement', 'Choc trottoir', 'Remplacement suspension'],
    includes: ['Contrôle du train roulant', 'Mesure géométrie', 'Réglage selon faisabilité', 'Conseil sur les pneus', 'Essai ou contrôle final'],
    faq: [['Quand faire un parallélisme ?', "Après un choc, un changement de pneus ou si le véhicule tire d’un côté."], ['Le parallélisme réduit-il l’usure des pneus ?', "Oui, un réglage correct limite l’usure prématurée."]],
    related: ['amortisseurs', 'freinage', 'diagnostic-securite'],
  },
  {
    slug: 'liquide-refroidissement',
    title: 'Purge liquide de refroidissement',
    category: 'Moteur',
    seo: 'liquide refroidissement, surchauffe moteur',
    image: 'atelier-resine.jpg',
    intro: "Le liquide de refroidissement protège le moteur contre la surchauffe et participe à sa longévité.",
    why: "Avec le temps, le liquide perd ses qualités. Une purge préventive aide le moteur à fonctionner à bonne température.",
    symptoms: ['Température moteur élevée', 'Niveau qui baisse', 'Liquide sale', 'Odeur chaude', 'Entretien ancien'],
    includes: ['Contrôle du circuit', 'Vidange ou purge', 'Remplissage adapté', 'Contrôle du niveau', 'Vérification de fuite visible'],
    faq: [['Pourquoi purger le liquide de refroidissement ?', "Pour préserver le moteur et limiter les risques de surchauffe."], ['Une baisse de niveau est-elle normale ?', "Elle doit être contrôlée, car elle peut révéler une fuite."]],
    related: ['courroie-distribution', 'revision-vidange', 'diagnostic-electronique'],
  },
  {
    slug: 'diagnostic-electronique',
    title: 'Diagnostic électronique',
    category: 'Diagnostic',
    seo: 'diagnostic électronique voiture, voyant moteur',
    image: 'outillage-premium.jpg',
    intro: "Un voyant ou un comportement inhabituel mérite une lecture précise avant de remplacer des pièces inutilement.",
    why: "Le diagnostic électronique aide à identifier l’origine d’un défaut et à orienter la réparation avec méthode.",
    symptoms: ['Voyant moteur', 'Perte de puissance', 'Démarrage difficile', 'À-coups', 'Message au tableau de bord'],
    includes: ['Lecture des défauts', 'Interprétation des symptômes', 'Contrôle cohérence', 'Conseil réparation', 'Effacement si approprié'],
    faq: [['Un diagnostic donne-t-il toujours la panne exacte ?', "Il oriente le contrôle. L’analyse de l’équipe reste essentielle."], ['Puis-je rouler avec un voyant moteur ?', "Cela dépend du voyant et du comportement du véhicule. Mieux vaut faire contrôler rapidement."]],
    related: ['vanne-egr', 'bougies-allumage', 'diagnostic-securite'],
  },
  {
    slug: 'liquide-frein',
    title: 'Purge liquide de frein',
    category: 'Sécurité',
    seo: 'liquide de frein, purge frein voiture',
    image: 'atelier-resine.jpg',
    intro: "Le liquide de frein vieillit avec le temps et influence la constance du freinage.",
    why: "Une purge préventive aide à conserver une pédale régulière et une sécurité optimale.",
    symptoms: ['Pédale molle', 'Freinage moins franc', 'Entretien ancien', 'Voyant frein', 'Usage intensif'],
    includes: ['Contrôle du liquide', 'Purge du circuit', 'Remplissage adapté', 'Contrôle du freinage', 'Conseil sécurité'],
    faq: [['Pourquoi remplacer le liquide de frein ?', "Parce qu’il absorbe l’humidité et perd progressivement en efficacité."], ['Est-ce lié aux plaquettes ?', "C’est complémentaire : les plaquettes freinent, le liquide transmet l’effort."]],
    related: ['freinage', 'diagnostic-securite', 'revision-vidange'],
  },
  {
    slug: 'vanne-egr',
    title: 'Changement vanne EGR',
    category: 'Moteur',
    seo: 'vanne EGR, perte puissance diesel',
    image: 'outillage-premium.jpg',
    intro: "Une vanne EGR encrassée ou défaillante peut perturber le fonctionnement moteur et provoquer des pertes de puissance.",
    why: "Un diagnostic préalable évite de remplacer une pièce sans confirmer l’origine du problème.",
    symptoms: ['Perte de puissance', 'Fumées', 'Voyant moteur', 'À-coups', 'Mode dégradé'],
    includes: ['Diagnostic électronique', 'Contrôle des symptômes', 'Remplacement si confirmé', 'Vérification du fonctionnement', 'Conseil d’usage'],
    faq: [['Une vanne EGR se nettoie-t-elle toujours ?', "Cela dépend de son état et du défaut constaté."], ['Pourquoi le voyant moteur s'allume ?', "La vanne EGR peut être en cause, mais un diagnostic est nécessaire."]],
    related: ['diagnostic-electronique', 'revision-vidange', 'pot-echappement'],
  },
  {
    slug: 'bougies-allumage',
    title: "Bougies d’allumage",
    category: 'Moteur essence',
    seo: 'bougies allumage, moteur essence',
    image: 'outillage-premium.jpg',
    intro: "Les bougies d’allumage assurent une combustion régulière sur un moteur essence.",
    why: "Des bougies en bon état facilitent le démarrage, stabilisent le fonctionnement moteur et limitent la consommation.",
    symptoms: ['Démarrage difficile', 'À-coups', 'Perte de puissance', 'Surconsommation', 'Voyant moteur'],
    includes: ['Contrôle des symptômes', 'Remplacement des bougies adaptées', 'Vérification allumage', 'Diagnostic si nécessaire', 'Conseil entretien'],
    faq: [['Quand changer les bougies ?', "Selon les préconisations constructeur ou en cas de symptômes moteur."], ['Les bougies influencent-elles la consommation ?', "Oui, un allumage irrégulier peut augmenter la consommation."]],
    related: ['diagnostic-electronique', 'revision-vidange', 'courroie-distribution'],
  },
  {
    slug: 'pot-echappement',
    title: "Pot d’échappement",
    category: 'Échappement',
    seo: 'pot échappement voiture, échappement automobile',
    image: 'atelier-resine.jpg',
    intro: "Un échappement en bon état limite les bruits anormaux et contribue au bon fonctionnement du véhicule.",
    why: "Une fuite ou une corrosion peut gêner la conduite, augmenter le bruit et poser problème au contrôle technique.",
    symptoms: ['Bruit plus fort', 'Odeur inhabituelle', 'Corrosion visible', 'Vibration', 'Fuite suspecte'],
    includes: ['Contrôle visuel', 'Recherche de fuite', 'Remplacement si nécessaire', 'Contrôle fixation', 'Conseil sécurité'],
    faq: [['Un pot bruyant doit-il être remplacé ?', "Pas toujours, mais une inspection permet de confirmer l’origine du bruit."], ['L’échappement est-il contrôlé au contrôle technique ?', "Oui, son état et ses fuites peuvent être signalés."]],
    related: ['diagnostic-electronique', 'vanne-egr', 'diagnostic-securite'],
  },
  {
    slug: 'diagnostic-securite',
    title: 'Diagnostic sécurité',
    category: 'Contrôle',
    seo: 'diagnostic sécurité voiture, contrôle véhicule Dordogne',
    image: 'carrosserie-ext.jpeg',
    intro: "Avant un départ, une vente ou après un choc, le diagnostic sécurité permet de contrôler les points essentiels du véhicule.",
    why: "Il offre une vision claire des éléments à surveiller avant qu’ils ne deviennent problématiques.",
    symptoms: ['Départ en vacances', 'Achat ou vente', 'Bruit suspect', 'Après un choc', 'Doute sur l’état général'],
    includes: ['Contrôle visuel sécurité', 'Freinage', 'Niveaux', 'Pneus et trains roulants', 'Conseil priorisé'],
    faq: [['Quand demander un diagnostic sécurité ?', "Avant un trajet important, après un choc ou si vous avez un doute."], ['Est-ce un contrôle technique ?', "Non, c’est un contrôle de conseil réalisé par l’atelier."]],
    related: ['freinage', 'amortisseurs', 'revision-vidange'],
  },
  {
    slug: 'rayure-profonde',
    title: 'Réparation rayure profonde',
    category: 'Carrosserie',
    seo: 'rayure voiture, réparation carrosserie',
    image: 'realisations/rayures-profonde-apres.png',
    compare: {
      before: 'realisations/rayures-profonde-avant.png',
      after: 'realisations/rayures-profonde-apres.png',
      position: 42,
      label: 'Comparer une rayure profonde avant et après',
    },
    gallery: ['realisations/rayures-profonde-avant.png', 'realisations/rayures-profonde-apres.png', 'realisations/aile-avant-apres.png'],
    intro: "Une rayure profonde dégrade l’esthétique et peut exposer la carrosserie à la corrosion.",
    why: "Réparer rapidement protège la surface, valorise le véhicule et évite que le défaut ne s'aggrave.",
    symptoms: ['Rayure sensible au toucher', 'Peinture traversée', 'Trace blanche ou mate', 'Début d’oxydation', 'Frottement parking'],
    includes: ['Diagnostic profondeur', 'Préparation surface', 'Correction ou peinture', 'Contrôle de finition', 'Conseil protection'],
    faq: [['Peut-on enlever une rayure profonde sans repeindre ?', "Cela dépend de la profondeur. Si la peinture est traversée, une reprise peinture peut être nécessaire."], ['Où réparer une rayure près de Périgueux ?', "À Trélissac, Carrosserie Mounier accueille les clients de Périgueux, Champcevinel et Dordogne."]],
    related: ['reparation-carrosserie', 'reparation-parechoc-plastique', 'renovation-optique'],
  },
  {
    slug: 'reparation-carrosserie',
    title: 'Réparation carrosserie',
    category: 'Carrosserie',
    seo: 'réparation carrosserie Dordogne, carrosserie Périgueux',
    image: 'realisations/choc-apres.png',
    gallery: ['realisations/choc-avant.png', 'realisations/choc-apres.png', 'realisations/choc-lateral-apres.png'],
    intro: "Choc léger, dommage intermédiaire ou réparation plus importante : chaque véhicule est examiné avec méthode.",
    why: "Une carrosserie réparée protège le véhicule, restaure son apparence et préserve sa valeur.",
    symptoms: ['Frottement parking', 'Rayure profonde', 'Petit enfoncement', 'Aile ou portière touchée', 'Pare-chocs déplacé'],
    includes: ['Diagnostic du dommage', 'Choc léger, intermédiaire ou structurel', 'Préparation carrosserie', 'Peinture si nécessaire', 'Contrôle qualité'],
    faq: [['Comment est estimée une réparation carrosserie ?', "Selon la zone, la profondeur du dommage, les pièces et la finition attendue."], ['Les montants sont-ils fixes ?', "Chaque dommage étant unique, un examen du véhicule est nécessaire pour établir un devis précis."]],
    related: ['rayure-profonde', 'reparation-parechoc-plastique', 'renovation-optique'],
  },
  {
    slug: 'reparation-parechoc-plastique',
    title: 'Réparation pare-chocs plastique',
    category: 'Carrosserie',
    seo: 'réparation pare-chocs, pare-chocs plastique',
    image: 'realisations/pc_AR-apres.png',
    gallery: ['realisations/pc_AR-avant.png', 'realisations/pc_AR-apres.png', 'realisations/pc_AR-avant-apres.png'],
    intro: "Un pare-chocs plastique abîmé ne nécessite pas toujours un remplacement complet.",
    why: "Lorsque c’est possible, réparer permet de conserver l’élément d’origine et de maîtriser le coût.",
    symptoms: ['Fissure', 'Frottement', 'Rayure', 'Déformation légère', 'Fixation fragilisée'],
    includes: ['Diagnostic faisabilité', 'Préparation support', 'Réparation plastique', 'Peinture', 'Contrôle rendu'],
    faq: [['Un pare-chocs plastique se répare-t-il toujours ?', "Non, cela dépend de la fissure, des fixations et de l’état général."], ['Pourquoi demander un diagnostic ?', "Pour choisir entre réparation et remplacement avec une estimation adaptée."]],
    related: ['reparation-carrosserie', 'rayure-profonde', 'peinture'],
  },
  {
    slug: 'renovation-optique',
    title: 'Rénovation optique de phare',
    category: 'Optiques',
    seo: 'rénovation phare, optique voiture Périgueux',
    image: 'realisations/phare-apres.png',
    gallery: ['realisations/phare-avant.png', 'realisations/phare-apres.png', 'realisations/phare-avant-apres.png'],
    intro: "Des phares ternis réduisent la visibilité, vieillissent l’apparence du véhicule et peuvent poser problème au contrôle technique.",
    why: "La rénovation optique améliore la transparence, l’esthétique et la sécurité de nuit.",
    symptoms: ['Optique jaunie', 'Voile opaque', 'Éclairage faible', 'Contrôle technique défavorable', 'Aspect vieilli'],
    includes: ['Diagnostic de l’altération', 'Préparation optique', 'Rénovation adaptée', 'Contrôle résultat', 'Conseil entretien'],
    faq: [['Quel est le tarif indicatif ?', "À partir de 80 € à 150 €*. Le tarif varie selon l’état et la méthode nécessaire."], ['Un diagnostic est-il nécessaire ?', "Oui, il permet d’établir une estimation précise et adaptée au véhicule."]],
    related: ['diagnostic-securite', 'reparation-carrosserie', 'rayure-profonde'],
  },
  {
    slug: 'covering',
    title: 'Covering automobile',
    category: 'Personnalisation',
    seo: 'covering automobile, covering partiel, protection carrosserie',
    image: 'carrosserie-ext.jpeg',
    gallery: ['carrosserie-ext.jpeg', 'atelier-resine.jpg', 'labo-peinture.jpg'],
    intro: "Le covering automobile permet de personnaliser, protéger ou transformer l’apparence d’un véhicule avec une finition premium.",
    why: "C’est une solution flexible pour un covering partiel, complet ou une protection ciblée de la carrosserie.",
    symptoms: ['Envie de personnalisation', 'Peinture à protéger', 'Projet esthétique', 'Véhicule professionnel', 'Changement d’image'],
    includes: ['Conseil projet', 'Préparation support', 'Covering partiel ou complet', 'Pose soignée', 'Contrôle finition'],
    faq: [['Covering partiel ou complet ?', "Le choix dépend du rendu recherché, de l’état du véhicule et du budget."], ['Le covering protège-t-il la carrosserie ?', "Il peut protéger certaines zones selon le film choisi et la pose."]],
    related: ['flocage', 'rayure-profonde', 'reparation-carrosserie'],
  },
  {
    slug: 'flocage',
    title: 'Flocage professionnel',
    category: 'Marquage',
    seo: 'flocage utilitaire, marquage publicitaire véhicule',
    image: 'carrosserie-ext.jpeg',
    gallery: ['carrosserie-ext.jpeg', 'atelier-resine.jpg', 'outillage-premium.jpg'],
    intro: "Le flocage professionnel transforme un utilitaire, un véhicule commercial ou une flotte en support de communication visible.",
    why: "Un marquage propre renforce votre image et rend votre entreprise identifiable dans vos déplacements locaux.",
    symptoms: ['Véhicule sans identité', 'Ancien marquage fatigué', 'Nouvelle activité', 'Flotte à harmoniser', 'Besoin de visibilité'],
    includes: ['Conseil marquage', 'Préparation support', 'Pose sur utilitaire ou flotte', 'Marquage publicitaire', 'Contrôle rendu'],
    faq: [['Peut-on floquer plusieurs véhicules ?', "Oui, la prestation peut être pensée pour harmoniser une flotte."], ['Faut-il fournir un logo ?', "Oui si vous l’avez. Sinon, l’équipe vous guide sur les éléments nécessaires."]],
    related: ['covering', 'reparation-carrosserie', 'peinture'],
  },
]

const hiddenPrestations = new Set([
  'climatisation',
  'parallelisme-geometrie',
  'diagnostic-electronique',
  'liquide-frein',
  'vanne-egr',
  'pot-echappement',
  'diagnostic-securite',
])

const activePrestations = prestations.filter((item) => !hiddenPrestations.has(item.slug))
const bySlug = Object.fromEntries(activePrestations.map((item) => [item.slug, item]))
const mechanicalPrestations = new Set([
  'revision-vidange',
  'courroie-distribution',
  'freinage',
  'amortisseurs',
  'liquide-refroidissement',
  'bougies-allumage',
])

function pageUrl(slug) {
  return `../${slug}/`
}

function listItems(items) {
  return items.map((item) => `<li>${item}</li>`).join('\n')
}

function relatedLinks(current) {
  return current.related
    .filter((slug) => bySlug[slug])
    .map((slug) => `<a class="related-card" href="${pageUrl(slug)}"><span>${bySlug[slug].category}</span><strong>${bySlug[slug].title}</strong><small>Découvrir</small></a>`)
    .join('\n')
}

function mechanicalLogoSection() {
  const aaiLogo = logoMecaniqueFiles.find((file) => /aai/i.test(file)) ?? logoMecaniqueFiles[0]
  const carouselLogos = logoMecaniqueFiles.filter((file) => file !== aaiLogo)
  const trackLogos = carouselLogos.length ? carouselLogos : logoMecaniqueFiles

  if (!aaiLogo) return ''

  const track = [...trackLogos, ...trackLogos]
    .map((file) => `<div class="mechanic-equipment-logo"><img loading="lazy" src="../../assets/logo-marque-mecanique/${file}" alt="${path.parse(file).name}"></div>`)
    .join('\n              ')

  return `
    <section class="section section-soft mechanic-equipment">
      <div class="container mechanic-equipment-grid">
        <div class="mechanic-equipment-main reveal">
          <span>Fournisseur principal</span>
          <img loading="lazy" src="../../assets/logo-marque-mecanique/${aaiLogo}" alt="AAI">
        </div>
        <div class="mechanic-equipment-content reveal">
          <div class="kicker">&Eacute;quipementiers m&eacute;caniques</div>
          <h2 class="section-title">Des pi&egrave;ces et &eacute;quipements s&eacute;lectionn&eacute;s avec soin.</h2>
          <p class="section-desc">Notre atelier travaille avec des r&eacute;f&eacute;rences adapt&eacute;es aux interventions m&eacute;caniques courantes afin de proposer un service clair, fiable et coh&eacute;rent.</p>
          <div class="mechanic-logo-marquee" aria-label="Logos &eacute;quipementiers m&eacute;caniques">
            <div class="mechanic-logo-track">
              ${track}
            </div>
          </div>
        </div>
      </div>
    </section>`
}

function html(item) {
  const image = `../../assets/images/${item.image}`
  const gallery = item.gallery ?? [item.image, 'atelier-resine.jpg', 'outillage-premium.jpg']
  const isOptique = item.slug === 'renovation-optique'
  const mechanicEquipmentSection = mechanicalPrestations.has(item.slug) ? mechanicalLogoSection() : ''
  const photosSection = mechanicalPrestations.has(item.slug) ? '' : `
    <section class="section section-soft">
      <div class="container">
        <div class="section-head reveal">
          <div><div class="kicker">Photos</div><h2 class="section-title">Un aperçu du savoir-faire.</h2></div>
        </div>
        <div class="premium-gallery">
          ${gallery.map((src, index) => {
            const href = `../../assets/images/${src}`
            const alt = index === 0 ? `${item.title} Carrosserie Mounier` : `Réalisation ${item.title}`
            return `<a class="premium-gallery-item reveal" href="${href}"><img loading="lazy" src="${href}" alt="${alt}"></a>`
          }).join('\n          ')}
        </div>
      </div>
    </section>`
  return `<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" href="../../assets/icons/favicon-mounier.ico" type="image/x-icon">
  <title>${item.title} à Trélissac | Carrosserie Mounier</title>
  <meta name="description" content="${item.title} chez Carrosserie Mounier à Trélissac près de Périgueux. ${item.seo}. Devis clair, diagnostic et accompagnement.">
  <link rel="stylesheet" href="../../css/style.css">
  <link rel="stylesheet" href="../../css/responsive.css">
</head>
<body>
  <header class="site-header">
    <div class="container header-inner">
      <a class="logo" href="../../" aria-label="Accueil Carrosserie Mounier">
        <img src="../../assets/logos/logo-mounier.png" alt="Carrosserie Mounier" class="logo-img">
      </a>
      <nav class="main-nav" aria-label="Navigation principale">
        <a href="../../">Accueil</a>
        <div class="nav-group"><button type="button">Prestations mécaniques</button><div><a href="../../prestations/revision-vidange/">Révision et Vidange</a><a href="../../prestations/courroie-distribution/">Courroie de Distribution</a><a href="../../prestations/freinage/">Freinage</a><a href="../../prestations/amortisseurs/">Amortisseurs</a><a href="../../prestations/liquide-refroidissement/">Liquide de Refroidissement</a><a href="../../prestations/bougies-allumage/">Bougies d’Allumage</a></div></div>
        <div class="nav-group"><button type="button">Prestations carrosserie</button><div><a href="../../prestations/rayure-profonde/">Rayure Profonde</a><a href="../../prestations/reparation-carrosserie/">Réparation Carrosserie</a><a href="../../prestations/reparation-parechoc-plastique/">Pare-Chocs Plastique</a><a href="../../prestations/parebrise/">Pare-brise</a><a href="../../prestations/renovation-optique/">Rénovation Optique</a></div></div>
        <div class="nav-group"><button type="button">Covering & Flocage</button><div><a href="../../prestations/covering/">Covering Automobile</a><a href="../../prestations/flocage/">Flocage Véhicule & Entreprise</a></div></div>
        <a href="../../realisations/">Réalisations</a>
        <a href="../../faq/">FAQ</a>
        <a href="../../contact/">Contact</a>
        <a href="../../recrutement/">Recrutement</a>
        <div class="menu-actions"><a href="tel:+33608378217">Appeler</a><a href="../../contact/">Devis</a></div>
      </nav>
      <a class="btn btn-header" href="../../contact/">Demander un devis</a>
      <button class="mobile-toggle" type="button" aria-label="Ouvrir le menu"><span></span><span></span><span></span></button>
    </div>
  </header>

  <main>
    <section class="hero hero-premium hero-refined page-hero">
      <div class="hero-glow"></div>
      <div class="container hero-content">
        <div class="hero-copy reveal">
          <div class="eyebrow">${item.category}</div>
          <h1 class="section-title">${item.title}</h1>
          <p class="section-desc">${item.intro}</p>
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
          <h2>Description</h2>
          <p>${item.intro}</p>
          <h2>Pourquoi réaliser cette intervention ?</h2>
          <p>${item.why}</p>
          <h2>Symptômes</h2>
          <ul>${listItems(item.symptoms)}</ul>
          <h2>Notre intervention comprend</h2>
          <ul>${listItems(item.includes)}</ul>
          ${isOptique ? `<div class="price-note"><strong>À partir de 80 € à 150 €*</strong><br>Le tarif peut varier selon le niveau d’altération des optiques, leur état général ainsi que la méthode de rénovation nécessaire. Un diagnostic préalable réalisé par notre équipe permettra d’établir une estimation précise et adaptée à votre véhicule.</div>` : ''}
        </article>
        <aside class="service-page-side reveal">
          <strong>Carrosserie Mounier</strong>
          <span>Trélissac, Périgueux, Champcevinel, Boulazac, Chancelade et Dordogne.</span>
          <div class="service-side-actions">
            <a class="side-action" href="tel:+33608378217"><span>&#9742;</span><strong>Appeler</strong><small>06 08 37 82 17</small></a>
            <a class="side-action side-action-devis" href="../../contact/"><span>&#8599;</span><strong>Devis</strong><small>Demande rapide</small></a>
            <a class="side-action" href="../../prestations/"><span>&#8769;</span><strong>Prestations</strong><small>Tout consulter</small></a>
          </div>
        </aside>
      </div>
    </section>

    ${mechanicEquipmentSection}

    <section class="section section-dark">
      <div class="container">
        <div class="section-head reveal">
          <div><div class="kicker">FAQ</div><h2 class="section-title">Questions fréquentes</h2></div>
        </div>
        <div class="accordion">
          ${item.faq.map(([q, a]) => `<div class="accordion-item reveal"><button type="button">${q}</button><div><p>${a}</p></div></div>`).join('\n')}
          <div class="accordion-item reveal"><button type="button">Comment obtenir un devis ?</button><div><p>Appelez l’atelier ou envoyez votre demande depuis la page contact. Une photo peut aider, mais un examen sur place reste recommandé pour une estimation précise.</p></div></div>
        </div>
      </div>
    </section>

    ${photosSection}

    <section class="section section-soft">
      <div class="container">
        <div class="cta-final reveal">
          <h2>Besoin d’un diagnostic pour ${item.title.toLowerCase()} ?</h2>
          <p>Contactez l’atelier pour une réponse claire et une estimation adaptée à votre véhicule.</p>
          <div class="hero-actions cta-bubble-actions">
            <a class="side-action" href="tel:+33608378217"><span>&#9742;</span><strong>Appeler</strong><small>06 08 37 82 17</small></a>
            <a class="side-action side-action-devis" href="../../contact/"><span>&#8599;</span><strong>Devis</strong><small>Demande rapide</small></a>
          </div>
        </div>

        <div class="section-head related-head reveal">
          <div><div class="kicker">Prestations associées</div><h2 class="section-title">Continuer votre recherche.</h2></div>
        </div>
        <div class="related-grid reveal">
          ${relatedLinks(item)}
        </div>
      </div>
    </section>
  </main>

  <div class="mobile-sticky-cta" aria-label="Actions rapides mobile">
    <a href="tel:+33608378217">📞 Appeler</a>
    <a href="../../contact/">📄 Devis</a>
  </div>

  <footer class="site-footer">
    <div class="container footer-inner">
      <div><strong>Carrosserie Mounier</strong><br>Carrosserie, peinture, entretien, covering et flocage à Trélissac.</div>
      <div class="footer-links">
        <a href="../../atelier/">L’atelier</a>
        <a href="../../prestations/">Prestations</a>
        <a href="../../realisations/">Réalisations</a>
        <a href="../../contact/">Contact</a>
        <a href="../../recrutement/">Recrutement</a>
      </div>
      <div>© <span data-year></span> Carrosserie Mounier</div>
    </div>
  </footer>

  <script src="../../js/main.js"></script>
  <script src="../../js/animations.js"></script>
  <script src="../../js/content-overrides.js"></script>
</body>
</html>
`
}

for (const item of activePrestations) {
  const directory = path.join('prestations', item.slug)
  await mkdir(directory, { recursive: true })
  await writeFile(path.join(directory, 'index.html'), html(item), 'utf8')
}

console.log(`Generated ${activePrestations.length} prestation pages.`)





