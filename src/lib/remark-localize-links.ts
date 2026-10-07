import { visit } from 'unist-util-visit'
import type { Root } from 'mdast'
import type { VFile } from 'vfile'

/**
 * Locale folders under `src/content/docs/` for translated content, in
 * addition to the `en.yml` languages listed in `TD-21-i18n_project.md`.
 * Keep in sync with the `locales` configured for Starlight once i18n is
 * enabled in `astro.config.mjs`.
 */
const LOCALE_CODES = ['fr', 'de', 'ja', 'es', 'uk', 'nl'] as const

type LocaleCode = (typeof LOCALE_CODES)[number]

const DOCS_COLLECTION_SEGMENT = 'content/docs/'

/**
 * Remark plugin that rewrites internal documentation links so they point at
 * the current file's own locale instead of always pointing at the English
 * (root) path.
 *
 * Starlight does not localize plain Markdown/MDX link hrefs on its own --
 * that only happens for helpers like `getRelativeLocaleUrl()` used inside
 * `.astro` components. Without this plugin, a link such as
 * `[Public user interface](/architecture/public)` written in a translated
 * page would keep sending readers back to the English page.
 *
 * English is the `root` locale (unprefixed paths, e.g. `/architecture/public`
 * stays as-is), so files outside a locale folder are left untouched. Files
 * under `src/content/docs/<locale>/` get every internal, non-blog doc link
 * prefixed with `/<locale>`. This is safe even before a page has been
 * translated: Starlight generates a route for every locale-prefixed path and
 * automatically falls back to the English content (with a "not yet
 * translated" notice) until a real translation exists -- see "Fallback
 * content" in `TD-21-i18n_project.md`.
 */
export function remarkLocalizeLinks() {
  return (tree: Root, file: VFile) => {
    const locale = getFileLocale(file.path)
    if (!locale) return // root (English) content -- links are already correct

    visit(tree, 'link', (node) => {
      if (shouldLocalize(node.url)) {
        node.url = `/${locale}${node.url}`
      }
    })
  }
}

function getFileLocale(filePath: string | undefined): LocaleCode | undefined {
  if (!filePath) return undefined

  const normalizedPath = filePath.replaceAll('\\', '/')
  const collectionIndex = normalizedPath.indexOf(DOCS_COLLECTION_SEGMENT)
  if (collectionIndex === -1) return undefined

  const relativePath = normalizedPath.slice(
    collectionIndex + DOCS_COLLECTION_SEGMENT.length
  )
  const [firstSegment] = relativePath.split('/')

  return (LOCALE_CODES as readonly string[]).includes(firstSegment)
    ? (firstSegment as LocaleCode)
    : undefined
}

function shouldLocalize(url: string): boolean {
  if (!url.startsWith('/')) return false // relative, anchor-only, or external
  if (url.startsWith('/blog/')) return false // blog is not a localized collection

  return !isAlreadyLocalized(url)
}

function isAlreadyLocalized(url: string): boolean {
  return LOCALE_CODES.some(
    (locale) => url === `/${locale}` || url.startsWith(`/${locale}/`)
  )
}
