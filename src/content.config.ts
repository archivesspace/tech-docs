import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'
import { docsLoader } from '@astrojs/starlight/loaders'
import { docsSchema } from '@astrojs/starlight/schema'
import { z } from 'astro/zod'

const blogSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  excerpt: z.string().optional(),
  pubDate: z.coerce.date(),
  authors: z.array(z.string()),
  updatedDate: z.coerce.date().optional()
})

export const collections = {
  docs: defineCollection({
    loader: docsLoader(),
    schema: docsSchema()
  }),
  blog: defineCollection({
    loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
    schema: blogSchema
  })
}
