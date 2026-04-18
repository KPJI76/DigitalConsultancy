import { z } from 'zod'

export const articleSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200),
  excerpt: z.string().min(10, 'Excerpt must be at least 10 characters').max(500),
  content: z.string().min(10, 'Content is required'),
  category: z.string().min(1, 'Category is required'),
  readTime: z.string().min(1, 'Read time is required'),
  image: z.string().url('Must be a valid URL').or(z.literal('')),
  tags: z.array(z.string()).max(10),
  published: z.boolean(),
})

export const videoSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200),
  description: z.string().min(10, 'Description is required').max(1000),
  youtubeUrl: z.string().min(1, 'YouTube URL is required'),
  category: z.string().min(1, 'Category is required'),
  date: z.string().min(1, 'Date is required'),
  duration: z.string().min(1, 'Duration is required'),
  published: z.boolean(),
})

export type ArticleInput = z.infer<typeof articleSchema>
export type VideoInput = z.infer<typeof videoSchema>
