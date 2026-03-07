import { defineRouteMiddleware } from '@astrojs/starlight/route-data'
import { getCollection } from 'astro:content'

/**
 * Adds blog post data to Starlight route data. The page component passes only
 * title and description to StarlightPage's frontmatter prop since Starlight
 * validates against the docs schema (which doesn't include blog-specific fields
 * like pubDate and authors). This middleware injects them from the blog content
 * collection so components like CustomPageTitle can display full post metadata.
 */
export const onRequest = defineRouteMiddleware(async (context) => {
  const { id, entry } = context.locals.starlightRoute

  if (!id.startsWith('blog/')) return

  const slug = id.replace(/^blog\//, '')
  const posts = await getCollection('blog')
  const post = posts.find((p) => p.id === slug)

  if (post) {
    entry.data.pubDate = post.data.pubDate
    entry.data.authors = post.data.authors
  }
})
