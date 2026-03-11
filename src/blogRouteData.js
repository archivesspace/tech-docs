import { defineRouteMiddleware } from '@astrojs/starlight/route-data'
import { getCollection } from 'astro:content'
import { stripHtml } from '@utils/utils.mjs'

/**
 * Adds blog post metadata[0] and prev/next posts pagination[1] to Starlight route data.
 *
 * [0] The page component passes only title and description to StarlightPage's
 * frontmatter prop since Starlight validates against the docs schema (which
 * doesn't include blog-specific fields like pubDate and authors). This middleware
 * injects them from the blog content collection so components like CustomPageTitle
 * can display full post metadata.
 *
 * [1] Descending order by pubDate, newest first. "Previous" = earlier/older post,
 * "Next" = more recent post.
 */
export const onRequest = defineRouteMiddleware(async (context) => {
  const { id, entry } = context.locals.starlightRoute

  if (!id.startsWith('blog/')) return

  const slug = id.replace(/^blog\//, '')
  const posts = (await getCollection('blog')).sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
  )
  const post = posts.find((p) => p.id === slug)

  if (post) {
    entry.data.pubDate = post.data.pubDate
    entry.data.authors = post.data.authors
    entry.data.postTitle = post.data.title // Blog post titles can include inline HTML

    const pagination = {}
    const index = posts.findIndex((p) => p.id === slug)

    // Starlight renders pagination labels as plain text so strip HTML from titles
    if (index < posts.length - 1) {
      const prevPost = posts[index + 1]

      pagination.prev = {
        href: `/blog/${prevPost.id}`,
        label: stripHtml(prevPost.data.title)
      }
    }
    if (index > 0) {
      const nextPost = posts[index - 1]

      pagination.next = {
        href: `/blog/${nextPost.id}`,
        label: stripHtml(nextPost.data.title)
      }
    }

    context.locals.starlightRoute.pagination = pagination
  }
})
