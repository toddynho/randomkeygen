import fs from 'node:fs'
import path from 'node:path'

const ROOT = process.cwd()
const APP_DIR = path.join(ROOT, 'app')

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const absolute = path.join(directory, entry.name)
    return entry.isDirectory() ? walk(absolute) : [absolute]
  })
}

function routeForPage(file) {
  const relative = path.relative(APP_DIR, file).replace(/\/page\.tsx$/, '')
  return relative === 'page.tsx' ? '/' : `/${relative}`
}

const sourceFiles = walk(APP_DIR).filter((file) => /\.(?:ts|tsx)$/.test(file))
const pageFiles = sourceFiles.filter((file) => file.endsWith(`${path.sep}page.tsx`) || file === path.join(APP_DIR, 'page.tsx'))
const pageRoutes = new Set(pageFiles.map(routeForPage))
const failures = []
const nextConfigSource = fs.readFileSync(path.join(ROOT, 'next.config.js'), 'utf8')
const redirectSources = new Set(
  [...nextConfigSource.matchAll(/source:\s*["']([^"']+)["']/g)].map((match) => match[1])
)

// Static internal route references. Asset paths and fragments are intentionally ignored.
const internalReferencePattern = /(?:href|path|prefetch)\s*[:=]\s*["'`](\/[^"'`?#\s]*)/g
const brokenReferences = []

for (const file of sourceFiles) {
  const source = fs.readFileSync(file, 'utf8')
  let match
  while ((match = internalReferencePattern.exec(source))) {
    const route = match[1]
    if (route === '/' || /\.[a-z0-9]+$/i.test(route) || route.startsWith('/_next/')) continue
    if (!pageRoutes.has(route)) {
      brokenReferences.push(`${route} (${path.relative(ROOT, file)})`)
    }
  }
}

if (brokenReferences.length) {
  failures.push(`Broken static internal routes:\n  ${[...new Set(brokenReferences)].sort().join('\n  ')}`)
}

const sitemapFile = path.join(APP_DIR, 'sitemap.ts')
const sitemapSource = fs.readFileSync(sitemapFile, 'utf8')
const sitemapRoutes = [...sitemapSource.matchAll(/path:\s*["']([^"']*)["']/g)].map((match) => match[1] || '/')
const sitemapSet = new Set(sitemapRoutes)
const sitemapDuplicates = [...new Set(sitemapRoutes.filter((route, index) => sitemapRoutes.indexOf(route) !== index))]
const sitemapMissing = [...pageRoutes]
  .filter((route) => !redirectSources.has(route) && !sitemapSet.has(route))
  .sort()
const sitemapInvalid = sitemapRoutes.filter((route) => !pageRoutes.has(route)).sort()

if (sitemapDuplicates.length) failures.push(`Duplicate sitemap routes: ${sitemapDuplicates.join(', ')}`)
if (sitemapMissing.length) failures.push(`Live routes missing from sitemap: ${sitemapMissing.join(', ')}`)
if (sitemapInvalid.length) failures.push(`Sitemap routes without pages: ${sitemapInvalid.join(', ')}`)

const pagesWithoutCanonical = pageFiles
  .filter((file) => !/alternates\s*:/.test(fs.readFileSync(file, 'utf8')))
  .map((file) => path.relative(ROOT, file))
  .sort()

if (pagesWithoutCanonical.length) {
  failures.push(`Pages without an explicit canonical:\n  ${pagesWithoutCanonical.join('\n  ')}`)
}

const hydrationGates = sourceFiles
  .filter((file) => /if\s*\(\s*!mounted\s*\)[\s\S]{0,240}Loading\.\.\./.test(fs.readFileSync(file, 'utf8')))
  .map((file) => path.relative(ROOT, file))
  .sort()

if (hydrationGates.length) {
  failures.push(`Full-page mounted/loading hydration gates:\n  ${hydrationGates.join('\n  ')}`)
}

if (failures.length) {
  console.error(`SEO audit failed (${failures.length} categories)\n`)
  console.error(failures.join('\n\n'))
  process.exit(1)
}

console.log(`SEO audit passed: ${pageRoutes.size} routes, ${sitemapRoutes.length} sitemap entries, no broken static routes.`)
