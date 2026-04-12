import React, { createContext, useContext, useState, useEffect } from 'react'

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

const defaultContent: SiteContent = {
  hero: {
    headline: ['TRANSFORMING', 'ENTERPRISES THROUGH', 'AI & SERVICE EXCELLENCE'],
    subheadline: '25+ Years Architecting SAP & Salesforce Solutions for the Wind Energy Industry',
    ctaPrimary: 'Explore My Work',
    ctaSecondary: 'Read Insights',
  },
  about: {
    title: 'The Architect Behind The Systems',
    description: [
      'I bridge the gap between legacy ERP systems and the AI-driven future. With over 25 years of experience in enterprise technology, I specialize in transforming service operations through innovative SAP and Salesforce solutions.',
      'My decade-long journey in the Wind Energy sector as Head of Product Area has given me unique insights into the challenges of field service, maintenance planning, and supply chain optimization at scale.',
      'Today, I am passionate about integrating Agentic AI tools and emerging technologies into enterprise workflows, helping organizations build resilient, future-ready service operations.',
    ],
    stats: [
      { value: '25+', label: 'Years Experience' },
      { value: '100+', label: 'Projects Delivered' },
      { value: '11', label: 'Years in Wind Energy' },
      { value: '50+', label: 'Enterprise Clients' },
    ],
  },
  expertise: {
    title: 'Areas of Expertise',
    subtitle: 'Three decades of hands-on experience across the enterprise technology landscape, from legacy ERP systems to cutting-edge AI solutions.',
    areas: [
      {
        title: 'SAP Service Expertise',
        subtitle: 'Enterprise Resource Planning',
        description: 'Deep expertise in SAP Plant Maintenance (PM), Customer Service (CS), and Logistics modules. I help organizations optimize their service operations through proven SAP methodologies.',
        features: [
          'SAP PM Implementation & Optimization',
          'Customer Service Module Configuration',
          'Supply Chain Integration',
          'Legacy System Migration',
          'Custom ABAP Development',
        ],
      },
      {
        title: 'Salesforce FSL',
        subtitle: 'Field Service Lightning',
        description: 'Certified Salesforce Consultant specializing in Field Service Lightning and Service Cloud implementations. I bridge the gap between field operations and customer experience.',
        features: [
          'FSL Implementation & Configuration',
          'Service Cloud Setup',
          'Dispatcher Console Optimization',
          'Mobile Workforce Enablement',
          'Integration with SAP/ERP Systems',
        ],
      },
      {
        title: 'AI & Agentic Tools',
        subtitle: 'Future-Ready Intelligence',
        description: 'Pioneering the integration of Large Language Models and Agentic AI into enterprise service workflows. Transform how your teams work with intelligent automation.',
        features: [
          'LLM Integration for Service Desk',
          'AI-Powered Predictive Maintenance',
          'Intelligent Workflow Automation',
          'Natural Language Processing',
          'Custom AI Agent Development',
        ],
      },
    ],
  },
  articles: [
    {
      id: '1',
      slug: 'future-of-agentic-ai-field-service',
      title: 'The Future of Agentic AI in Field Service',
      excerpt: 'How autonomous AI agents are revolutionizing field service operations, from predictive maintenance to intelligent dispatching.',
      content: `<p>The field service industry is on the brink of a major transformation with the advent of Agentic AI...</p>`,
      category: 'AI & Technology',
      date: 'Jan 15, 2026',
      readTime: '8 min read',
      image: 'AI visualization',
      tags: ['AI', 'Field Service', 'Innovation'],
      likes: 124,
      views: 1250,
      published: true,
    },
    {
      id: '2',
      slug: 'sap-pm-to-salesforce-fsl-migration-guide',
      title: 'Migrating from SAP PM to Salesforce FSL: A Complete Guide',
      excerpt: 'A strategic roadmap for organizations looking to transition their maintenance operations from SAP to Salesforce Field Service Lightning.',
      content: `<p>Migrating from SAP Plant Maintenance to Salesforce Field Service Lightning is a significant undertaking...</p>`,
      category: 'SAP & Salesforce',
      date: 'Jan 10, 2026',
      readTime: '12 min read',
      image: 'System integration',
      tags: ['SAP', 'Salesforce', 'Migration'],
      likes: 89,
      views: 980,
      published: true,
    },
    {
      id: '3',
      slug: 'resilient-supply-chains-predictive-analytics',
      title: 'Building Resilient Supply Chains with Predictive Analytics',
      excerpt: 'Leveraging data and AI to create supply chains that can withstand disruptions and adapt to changing market conditions.',
      content: `<p>The past few years have taught us that supply chain resilience is no longer optional...</p>`,
      category: 'Supply Chain',
      date: 'Jan 5, 2026',
      readTime: '10 min read',
      image: 'Supply chain network',
      tags: ['Supply Chain', 'Analytics', 'Strategy'],
      likes: 67,
      views: 756,
      published: true,
    },
  ],
  videos: [
    {
      id: '1',
      title: 'SAP PM Best Practices for Wind Energy',
      description: 'Learn the key strategies for optimizing SAP Plant Maintenance in the wind energy sector.',
      youtubeUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      thumbnail: 'SAP PM Video',
      category: 'SAP',
      date: 'Jan 20, 2026',
      duration: '15:30',
      views: 850,
      likes: 45,
      published: true,
    },
    {
      id: '2',
      title: 'Salesforce FSL Implementation Guide',
      description: 'Step-by-step guide to implementing Field Service Lightning for your organization.',
      youtubeUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      thumbnail: 'FSL Video',
      category: 'Salesforce',
      date: 'Jan 18, 2026',
      duration: '22:15',
      views: 620,
      likes: 38,
      published: true,
    },
    {
      id: '3',
      title: 'AI Agents in Enterprise Service',
      description: 'Exploring how AI agents are transforming enterprise service operations.',
      youtubeUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      thumbnail: 'AI Video',
      category: 'AI & Technology',
      date: 'Jan 12, 2026',
      duration: '18:45',
      views: 1100,
      likes: 72,
      published: true,
    },
  ],
}

interface ContentContextType {
  content: SiteContent
  updateHero: (updates: Partial<SiteContent['hero']>) => void
  updateAbout: (updates: Partial<SiteContent['about']>) => void
  updateExpertise: (updates: Partial<SiteContent['expertise']>) => void
  addArticle: (article: Omit<Article, 'id' | 'slug' | 'likes' | 'views'>) => void
  updateArticle: (id: string, updates: Partial<Article>) => void
  deleteArticle: (id: string) => void
  toggleArticlePublish: (id: string) => void
  incrementArticleViews: (id: string) => void
  incrementArticleLikes: (id: string) => void
  getPublishedArticles: () => Article[]
  getArticleBySlug: (slug: string) => Article | undefined
  addVideo: (video: Omit<Video, 'id' | 'likes' | 'views'>) => void
  updateVideo: (id: string, updates: Partial<Video>) => void
  deleteVideo: (id: string) => void
  toggleVideoPublish: (id: string) => void
  incrementVideoViews: (id: string) => void
  incrementVideoLikes: (id: string) => void
  getPublishedVideos: () => Video[]
  previewMode: boolean
  setPreviewMode: (mode: boolean) => void
  hasUnsavedChanges: boolean
  saveChanges: () => void
  discardChanges: () => void
}

const ContentContext = createContext<ContentContextType | undefined>(undefined)

export function ContentProvider({ children }: { children: React.ReactNode }) {
  const [content, setContent] = useState<SiteContent>(defaultContent)
  const [previewMode, setPreviewMode] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [originalContent, setOriginalContent] = useState<SiteContent>(defaultContent)

  useEffect(() => {
    // Load saved content from localStorage
    const saved = localStorage.getItem('ec_content')
    if (saved) {
      const parsed = JSON.parse(saved)
      setContent(parsed)
      setOriginalContent(parsed)
    }
  }, [])

  const saveToStorage = (newContent: SiteContent) => {
    localStorage.setItem('ec_content', JSON.stringify(newContent))
  }

  const updateHero = (updates: Partial<SiteContent['hero']>) => {
    const newContent = { ...content, hero: { ...content.hero, ...updates } }
    setContent(newContent)
    setHasUnsavedChanges(true)
  }

  const updateAbout = (updates: Partial<SiteContent['about']>) => {
    const newContent = { ...content, about: { ...content.about, ...updates } }
    setContent(newContent)
    setHasUnsavedChanges(true)
  }

  const updateExpertise = (updates: Partial<SiteContent['expertise']>) => {
    const newContent = { ...content, expertise: { ...content.expertise, ...updates } }
    setContent(newContent)
    setHasUnsavedChanges(true)
  }

  // Generate URL-friendly slug from title
  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
      .substring(0, 60)
  }

  const addArticle = (article: Omit<Article, 'id' | 'slug' | 'likes' | 'views'>) => {
    const slug = generateSlug(article.title)
    // Ensure unique slug
    let uniqueSlug = slug
    let counter = 1
    while (content.articles.find(a => a.slug === uniqueSlug)) {
      uniqueSlug = `${slug}-${counter}`
      counter++
    }
    
    const newArticle: Article = {
      ...article,
      id: `article-${Date.now()}`,
      slug: uniqueSlug,
      likes: 0,
      views: 0,
    }
    const newContent = { ...content, articles: [...content.articles, newArticle] }
    setContent(newContent)
    setHasUnsavedChanges(true)
  }

  const updateArticle = (id: string, updates: Partial<Article>) => {
    const newArticles = content.articles.map(a => a.id === id ? { ...a, ...updates } : a)
    const newContent = { ...content, articles: newArticles }
    setContent(newContent)
    setHasUnsavedChanges(true)
  }

  const deleteArticle = (id: string) => {
    const newArticles = content.articles.filter(a => a.id !== id)
    const newContent = { ...content, articles: newArticles }
    setContent(newContent)
    setHasUnsavedChanges(true)
  }

  const toggleArticlePublish = (id: string) => {
    const article = content.articles.find(a => a.id === id)
    if (article) {
      updateArticle(id, { published: !article.published })
    }
  }

  const incrementArticleViews = (id: string) => {
    const article = content.articles.find(a => a.id === id)
    if (article) {
      const newArticles = content.articles.map(a => 
        a.id === id ? { ...a, views: a.views + 1 } : a
      )
      setContent({ ...content, articles: newArticles })
    }
  }

  const incrementArticleLikes = (id: string) => {
    const article = content.articles.find(a => a.id === id)
    if (article) {
      const newArticles = content.articles.map(a => 
        a.id === id ? { ...a, likes: a.likes + 1 } : a
      )
      setContent({ ...content, articles: newArticles })
    }
  }

  const getPublishedArticles = () => {
    return content.articles.filter(a => a.published)
  }

  const getArticleBySlug = (slug: string) => {
    return content.articles.find(a => a.slug === slug && a.published)
  }

  const addVideo = (video: Omit<Video, 'id' | 'likes' | 'views'>) => {
    const newVideo: Video = {
      ...video,
      id: `video-${Date.now()}`,
      likes: 0,
      views: 0,
    }
    const newContent = { ...content, videos: [...content.videos, newVideo] }
    setContent(newContent)
    setHasUnsavedChanges(true)
  }

  const updateVideo = (id: string, updates: Partial<Video>) => {
    const newVideos = content.videos.map(v => v.id === id ? { ...v, ...updates } : v)
    const newContent = { ...content, videos: newVideos }
    setContent(newContent)
    setHasUnsavedChanges(true)
  }

  const deleteVideo = (id: string) => {
    const newVideos = content.videos.filter(v => v.id !== id)
    const newContent = { ...content, videos: newVideos }
    setContent(newContent)
    setHasUnsavedChanges(true)
  }

  const toggleVideoPublish = (id: string) => {
    const video = content.videos.find(v => v.id === id)
    if (video) {
      updateVideo(id, { published: !video.published })
    }
  }

  const incrementVideoViews = (id: string) => {
    const video = content.videos.find(v => v.id === id)
    if (video) {
      const newVideos = content.videos.map(v => 
        v.id === id ? { ...v, views: v.views + 1 } : v
      )
      setContent({ ...content, videos: newVideos })
    }
  }

  const incrementVideoLikes = (id: string) => {
    const video = content.videos.find(v => v.id === id)
    if (video) {
      const newVideos = content.videos.map(v => 
        v.id === id ? { ...v, likes: v.likes + 1 } : v
      )
      setContent({ ...content, videos: newVideos })
    }
  }

  const getPublishedVideos = () => {
    return content.videos.filter(v => v.published)
  }

  const saveChanges = () => {
    saveToStorage(content)
    setOriginalContent(content)
    setHasUnsavedChanges(false)
  }

  const discardChanges = () => {
    setContent(originalContent)
    setHasUnsavedChanges(false)
  }

  return (
    <ContentContext.Provider value={{
      content,
      updateHero,
      updateAbout,
      updateExpertise,
      addArticle,
      updateArticle,
      deleteArticle,
      toggleArticlePublish,
      incrementArticleViews,
      incrementArticleLikes,
      getPublishedArticles,
      getArticleBySlug,
      addVideo,
      updateVideo,
      deleteVideo,
      toggleVideoPublish,
      incrementVideoViews,
      incrementVideoLikes,
      getPublishedVideos,
      previewMode,
      setPreviewMode,
      hasUnsavedChanges,
      saveChanges,
      discardChanges,
    }}>
      {children}
    </ContentContext.Provider>
  )
}

export function useContent() {
  const context = useContext(ContentContext)
  if (context === undefined) {
    throw new Error('useContent must be used within a ContentProvider')
  }
  return context
}
