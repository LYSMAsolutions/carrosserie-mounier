import { access, readdir, readFile } from 'node:fs/promises'
import path from 'node:path'

const htmlFiles = ['index.html']

for (const entry of await readdir('pages', { withFileTypes: true }).catch(() => [])) {
  if (entry.isFile() && entry.name.endsWith('.html')) {
    htmlFiles.push(path.join('pages', entry.name))
  }
}

async function collectIndexFiles(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true }).catch(() => [])) {
    const filePath = path.join(directory, entry.name)
    if (entry.isDirectory()) {
      await collectIndexFiles(filePath)
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      htmlFiles.push(filePath)
    }
  }
}

await collectIndexFiles('prestations')
await collectIndexFiles('faq')

const errors = []
const htmlSet = new Set(htmlFiles.map((file) => path.normalize(file)))

async function exists(file) {
  try {
    await access(file)
    return true
  } catch {
    return false
  }
}

function isExternalUrl(value) {
  return /^(?:[a-z][a-z0-9+.-]*:|#|tel:|mailto:|javascript:)/i.test(value)
}

function stripHashAndQuery(value) {
  return value.split('#')[0].split('?')[0]
}

for (const file of htmlFiles) {
  const html = await readFile(file, 'utf8')

  if (html.includes('```')) {
    errors.push(`${file} contient des marqueurs Markdown \`\`\``)
  }

  if (!html.includes('</html>')) {
    errors.push(`${file} ne contient pas de balise </html>`)
  }

  for (const match of html.matchAll(/<a\b[^>]*>/gi)) {
    const tag = match[0]
    const href = tag.match(/\bhref=["']([^"']+)["']/i)?.[1]
    const target = tag.match(/\btarget=["']_blank["']/i)
    const rel = tag.match(/\brel=["']([^"']+)["']/i)?.[1] ?? ''

    if (target && !/\bnoopener\b/i.test(rel)) {
      errors.push(`${file} contient un lien target="_blank" sans rel="noopener"`)
    }

    if (!href || isExternalUrl(href)) continue

    const cleanHref = stripHashAndQuery(href)
    if (!cleanHref) continue

    const targetPath = path.normalize(path.join(path.dirname(file), cleanHref))
    const resolvedTarget = cleanHref.endsWith('/') ? path.join(targetPath, 'index.html') : targetPath

    if (!htmlSet.has(resolvedTarget) && !(await exists(resolvedTarget))) {
      errors.push(`${file} pointe vers un fichier introuvable : ${href}`)
    }
  }
}

if (errors.length) {
  console.error(errors.join('\n'))
  process.exit(1)
}

console.log('Static site check OK')




