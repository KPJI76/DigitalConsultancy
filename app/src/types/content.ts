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
  externalUrl?: string   // if set, opens the external URL in a new tab
  isFullPage?: boolean   // if set, content is a full HTML doc rendered via srcdoc iframe
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

export interface IndustryItem {
  title: string
  description: string
  projects: string
  experience: string
}

export interface SiteContent {
  branding: {
    siteNamePrimary: string
    siteNameAccent: string
    siteTagline: string
    navLinks: {
      home: string
      about: string
      expertise: string
      industries: string
      insights: string
      videos: string
      contact: string
    }
  }
  visibleSections: {
    hero: boolean
    about: boolean
    expertise: boolean
    industries: boolean
    insights: boolean
    videos: boolean
    contact: boolean
  }
  industries: {
    title: string
    subtitle: string
    items: IndustryItem[]
  }
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
  contact: {
    email: string
    phone: string
    location: string
    linkedin: string
    youtube: string
  }
}
