import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'
import { docsLoader } from '@astrojs/starlight/loaders'
import { docsSchema } from '@astrojs/starlight/schema'
import { z } from 'astro/zod'
import { DEFAULT_ISSUE_TEXT, DEFAULT_ISSUE_URL } from '@lib/constants.ts'

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
    schema: docsSchema({
      extend: z.object({
        issueUrl: z
          .union([z.string(), z.literal(false)])
          .optional()
          .default(DEFAULT_ISSUE_URL),
        issueText: z.string().optional().default(DEFAULT_ISSUE_TEXT)
      })
    })
  }),
  blog: defineCollection({
    loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
    schema: blogSchema
  })
}
