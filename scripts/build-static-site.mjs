import { cp, mkdir, rm } from 'node:fs/promises'

const entries = [
  'index.html',
  'favicon.ico',
  'robots.txt',
  'sitemap.xml',
  'atelier',
  'contact',
  'cookies',
  'prestations',
  'realisations',
  'recrutement',
  'technologies',
  'zones-intervention',
  'faq',
  'css',
  'js',
  'assets',
  'content',
]

await rm('dist', { recursive: true, force: true })
await mkdir('dist', { recursive: true })

for (const entry of entries) {
  await cp(entry, `dist/${entry}`, { recursive: true, force: true }).catch((error) => {
    if (error?.code !== 'ENOENT') throw error
  })
}

console.log('Static site built in dist/')




