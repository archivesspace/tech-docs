import rss from '@astrojs/rss'
import { getCollection } from 'astro:content'

export async function GET(context) {
  const blog = await getCollection('docs')
  return rss({
    title: 'TechDocs',
    description: "An ArchiveNaut's guide to the ArchivesSpace",
    site: context.site,
    items: blog.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      // Compute RSS link from post `id`
      // This example assumes all posts are rendered as `/[id]` routes
      link: `/${post.id}/`
    }))
  })
}
