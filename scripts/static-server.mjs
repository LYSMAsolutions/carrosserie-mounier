import { createServer } from 'node:http'
import { createReadStream, existsSync } from 'node:fs'
import { stat } from 'node:fs/promises'
import path from 'node:path'

const root = process.cwd()
const portArgIndex = process.argv.indexOf('--port')
const port = Number(portArgIndex >= 0 ? process.argv[portArgIndex + 1] : process.env.PORT) || 3021

const types = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
}

function resolveFile(url) {
  const cleanUrl = decodeURIComponent(url.split('?')[0]).replace(/^\/+/, '')
  const target = path.resolve(root, cleanUrl || 'index.html')
  if (target !== root && !target.startsWith(root + path.sep)) return null
  return target
}

createServer(async (req, res) => {
  const requested = resolveFile(req.url || '/')
  if (!requested) {
    res.writeHead(403)
    res.end('Forbidden')
    return
  }

  let file = requested
  if (existsSync(file) && (await stat(file)).isDirectory()) {
    file = path.join(file, 'index.html')
  }

  if (!existsSync(file)) {
    res.writeHead(404)
    res.end('Not found')
    return
  }

  res.writeHead(200, {
    'Content-Type': types[path.extname(file).toLowerCase()] || 'application/octet-stream',
    'Cache-Control': 'no-store',
  })
  createReadStream(file).pipe(res)
}).listen(port, () => {
  console.log(`Static site ready on http://localhost:${port}`)
})




