import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()

const moves = new Map([
  ['contact/', 'contact/index.html'],
  ['realisations/', 'realisations/index.html'],
  ['prestations/', 'prestations/index.html'],
  ['recrutement/', 'recrutement/index.html'],
  ['cookies/', 'cookies/index.html'],
  ['atelier/', 'atelier/index.html'],
  ['technologies/', 'technologies/index.html'],
  ['zones-intervention/', 'zones-intervention/index.html'],
])

function slash(value) {
  return value.replaceAll(path.sep, '/')
}

function isExternal(href) {
  return /^(https?:|mailto:|tel:|sms:|javascript:|#)/i.test(href)
}

function normalizeRel(value) {
  return slash(path.normalize(value)).replace(/^\.\//, '')
}

function splitHref(href) {
  const hashIndex = href.indexOf('#')
  if (hashIndex < 0) return { hrefPath: href, hash: '' }
  return { hrefPath: href.slice(0, hashIndex), hash: href.slice(hashIndex) }
}

function targetFromHref(fromRel, href) {
  const clean = href.split('?')[0]
  if (!clean) return null
  let target = normalizeRel(path.join(path.dirname(fromRel), clean))
  if (clean.endsWith('/')) target = normalizeRel(path.join(target, 'index.html'))
  return target
}

function cleanHref(fromNewRel, targetNewRel, hash = '') {
  let targetForUrl = targetNewRel
  if (targetNewRel.endsWith('/index.html')) targetForUrl = path.dirname(targetNewRel)
  if (targetNewRel === 'index.html') targetForUrl = ''

  let rel = slash(path.relative(path.dirname(fromNewRel), targetForUrl))
  if (!rel) rel = './'
  if (targetNewRel.endsWith('/index.html') && !rel.endsWith('/')) rel += '/'
  return rel + hash
}

function rewriteHtml(text, oldRel, newRel) {
  return text.replace(/\bhref="([^"]+)"/g, (match, href) => {
    if (isExternal(href)) return match

    const { hrefPath, hash } = splitHref(href)
    const targetOld = targetFromHref(oldRel, hrefPath)
    if (!targetOld) return match

    const targetNew = moves.get(targetOld) || targetOld
    const isHtmlTarget = targetNew.endsWith('.html') || targetOld.endsWith('.html')
    if (!isHtmlTarget) return match

    return `href="${cleanHref(newRel, targetNew, hash)}"`
  })
}

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'dist') continue
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) walk(full, files)
    if (entry.isFile() && entry.name.endsWith('.html')) files.push(full)
  }
  return files
}

const movedTargets = new Set(moves.values())

for (const full of walk(root)) {
  const oldRel = slash(path.relative(root, full))
  if (movedTargets.has(oldRel)) continue

  const newRel = moves.get(oldRel) || oldRel
  const updated = rewriteHtml(fs.readFileSync(full, 'utf8'), oldRel, newRel)
  const target = path.join(root, newRel)
  fs.mkdirSync(path.dirname(target), { recursive: true })
  fs.writeFileSync(target, updated, 'utf8')
}

for (const oldRel of moves.keys()) {
  const oldPath = path.join(root, oldRel)
  if (fs.existsSync(oldPath)) fs.rmSync(oldPath)
}

const pagesDir = path.join(root, 'pages')
if (fs.existsSync(pagesDir) && fs.readdirSync(pagesDir).length === 0) fs.rmdirSync(pagesDir)




