# Carrosserie Mounier

Site vitrine premium de Carrosserie Mounier, carrosserie automobile situee a Trelissac en Dordogne.

Le site est statique : HTML, CSS et JavaScript vanilla. Il peut etre repris par un autre prestataire sans dependance serveur complexe.

## Objectifs du site

- Presenter l'atelier, les realisations et les prestations.
- Generer des appels et demandes de devis.
- Rassurer avec les assurances, les avis, les photos et les pages de prestations.
- Travailler le referencement local : carrosserie, peinture automobile, lustrage, covering, flocage, entretien et reparation en Dordogne.

## Arborescence

- `index.html` : page d'accueil.
- `pages/` : pages transverses, contact, recrutement, prestations, realisations, cookies, zone locale.
- `prestations/` : une page dediee par prestation.
- `faq/` : FAQ generale et pages FAQ SEO.
- `css/` : styles principaux et responsive.
- `js/` : interactions, menu, cookies, animations, surcharges de contenu.
- `assets/` : images, logos, pictogrammes, logos partenaires.
- `content/site.json` : contenus modifiables sans toucher au HTML pour certaines zones.
- `content/communes-dordogne.json` : liste des communes de Dordogne issue de l'API publique geo.api.gouv.fr.
- `scripts/` : scripts de generation, build et verification.
- `robots.txt` : directives robots.
- `sitemap.xml` : plan de site XML.
- `vercel.json` : configuration de build et headers de securite.

## Pages principales

- Accueil : `/index.html`
- Prestations : `/prestations/`
- Realisations : `/realisations/`
- Contact : `/contact/`
- Recrutement : `/recrutement/`
- Zones d'intervention : `/zones-intervention/`
- FAQ : `/faq/`
- Cookies : `/cookies/`

## Prestations

Prestations mecaniques :

- Revision et vidange
- Courroie de distribution
- Freinage
- Amortisseurs
- Liquide de refroidissement
- Bougies d'allumage

Prestations carrosserie :

- Rayure profonde
- Reparation carrosserie
- Reparation pare-chocs plastique
- Renovation optique de phare

Services complementaires :

- Covering automobile
- Flocage vehicule et entreprise

## SEO local

La page `zones-intervention/` sert de socle SEO local. Elle mentionne les services principaux :

- carrosserie Dordogne
- carrosserie Trelissac
- carrosserie Perigueux
- peinture automobile
- lustrage automobile
- covering automobile
- flocage vehicule
- reparation pare-chocs
- renovation optique de phare

Elle contient aussi une liste visible et consultable des communes de Dordogne. Le contenu n'est pas cache pour Google : il est place dans un accordéon HTML natif `<details>`, ce qui reste propre pour l'utilisateur et acceptable pour le referencement.

Source communes : API Decoupage Administratif du gouvernement, endpoint `/departements/24/communes`.

## Sitemap et robots

Le fichier `sitemap.xml` est genere automatiquement par :

```bash
pnpm run seo
```

Il liste les pages HTML du site avec l'URL de production :

```txt
https://carrosserie-mounier.fr
```

Si le domaine change, modifier `siteUrl` dans :

```txt
scripts/generate-seo-assets.mjs
```

Puis relancer :

```bash
pnpm run seo
pnpm run build
```

Le fichier `robots.txt` autorise l'indexation et reference le sitemap.

## Commandes

Depuis la racine du site Carrosserie Mounier :

```bash
pnpm run dev
```

Lance un serveur local sur le port `3021`.

```bash
pnpm run check
```

Verifie les liens locaux et les attributs de securite des liens externes.

```bash
pnpm run seo
```

Regénère la page SEO locale, `sitemap.xml` et `robots.txt`.

```bash
pnpm run build
```

Genere les assets SEO puis copie le site dans `dist/`.

## Formulaire de contact

La page `contact/` envoie les demandes vers Google Apps Script.

Le script front ajoute :

- `type: "contact"`
- honeypot anti-spam `site_web`
- limitation de longueur des champs
- desactivation du bouton pendant l'envoi

Le endpoint Apps Script est a verifier dans le fichier HTML si le deploiement change.

## Formulaire recrutement

La page `recrutement/` envoie :

- nom et prenom
- email
- telephone
- poste recherche
- message
- CV en base64
- `type: "recrutement"`

Le front limite les CV a 5 Mo et accepte PDF, DOC et DOCX. Le controle doit aussi exister cote Google Apps Script.

## Securite

Le site utilise des headers dans `vercel.json` :

- Content Security Policy
- X-Content-Type-Options
- Referrer-Policy
- Permissions-Policy
- X-Frame-Options

Important : la CSP conserve `unsafe-inline` car le site contient encore des scripts et styles inline. Pour durcir davantage, il faudra sortir les scripts inline dans des fichiers JS separes.

## Cookies

La logique cookies est dans `js/main.js` et la page d'information dans `cookies/`.

Le bandeau permet :

- accepter
- refuser
- personnaliser
- rouvrir les preferences depuis la page cookies

## Modifier les images

Images principales :

- `assets/images/hero-atelier.jpg`
- `assets/images/realisations/`
- `assets/images/cabine-novaverta.jpg`
- `assets/images/labo-peinture.jpg`
- `assets/images/aire-preparation.jpg`
- `assets/images/outillage-premium.jpg`
- `assets/images/atelier-resine.jpg`

Logos :

- `assets/logos/` : logo Carrosserie Mounier et equipementiers atelier.
- `assets/logo_partenaire/` : compagnies d'assurance.
- `assets/logo-marque-mecanique/` : marques et equipementiers mecaniques.
- `assets/logo-reseau-sociaux/` : Facebook et Instagram.

## Modifier les couleurs

Les variables principales sont dans :

```txt
css/variables.css
```

Couleurs actuelles :

- anthracite premium : proche RAL 7016
- orange premium : `#FF6A00`

## Deploiement

Le projet est pret pour Vercel :

- build command : `pnpm run build`
- output directory : `dist`
- config : `vercel.json`

Pour un hebergement classique, lancer le build puis publier le contenu du dossier `dist/`.

## Points de vigilance pour un futur prestataire

- Garder une page dediee par prestation pour le SEO.
- Ne pas recreer une page prestations geante.
- Ne pas masquer du texte uniquement pour Google.
- Mettre a jour `sitemap.xml` apres ajout ou suppression de page.
- Verifier les endpoints Google Apps Script apres chaque redeploiement.
- Conserver les photos reelles et les avant/apres comme preuve principale.
- Tester mobile en priorite : la majorite des visiteurs viendra probablement depuis smartphone.

## Maintenance rapide

Apres une modification importante :

```bash
pnpm run check
pnpm run build
```

Si une page est ajoutee :

```bash
pnpm run seo
pnpm run check
pnpm run build
```


