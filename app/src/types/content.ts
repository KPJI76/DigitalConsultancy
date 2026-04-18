export interface Article {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  category: string
  date: string
  readTime: string
  image: string
  tags: string[]
  likes: number
  views: number
  published: boolean
}

export interface Video {
  id: string
  title: string
  description: string
  youtubeUrl: string
  thumbnail: string
  category: string
  date: string
  duration: string
  views: number
  likes: number
  published: boolean
}

export interface SiteContent {
  hero: {
    headline: string[]
    subheadline: string
    ctaPrimary: string
    ctaSecondary: string
  }
  about: {
    title: string
    description: string[]
    stats: { value: string; label: string }[]
  }
  expertise: {
    title: string
    subtitle: string
    areas: {
      title: string
      subtitle: string
      description: string
      features: string[]
    }[]
  }
  articles: Article[]
  videos: Video[]
}
