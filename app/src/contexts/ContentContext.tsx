import React, { createContext, useContext, useState, useEffect } from 'react'
import type { Article, Video, SiteContent, IndustryItem } from '@/types/content'
import { loadContent, saveContent } from '@/lib/storage'
import { sanitizeArticleHtml, sanitizeYoutubeUrl } from '@/lib/sanitize'

export type { Article, Video, SiteContent }

const defaultContent: SiteContent = {
  branding: {
    siteNamePrimary: 'Enterprise',
    siteNameAccent: 'Consult',
    siteTagline: 'Enterprise Consulting Platform',
    navLinks: {
      home: 'Home',
      about: 'About',
      expertise: 'Expertise',
      industries: 'Industries',
      insights: 'Insights',
      videos: 'Videos',
      contact: 'Contact',
    },
  },
  visibleSections: {
    hero: true,
    about: true,
    expertise: true,
    industries: true,
    insights: true,
    videos: true,
    contact: true,
  },
  industries: {
    title: 'Industries I Transform',
    subtitle: 'Deep domain expertise across sectors that power our world, from renewable energy to advanced manufacturing.',
    items: [
      { title: 'Wind Energy', description: 'Leading digital transformation for onshore and offshore wind farm operations, from turbine maintenance to field service optimization.', projects: '25+', experience: '11 Years' },
      { title: 'Manufacturing', description: 'Streamlining production workflows and equipment maintenance with integrated ERP solutions.', projects: '30+', experience: '15 Years' },
      { title: 'Supply Chain', description: 'End-to-end supply chain visibility and logistics optimization across global operations.', projects: '20+', experience: '12 Years' },
      { title: 'Utilities', description: 'Power distribution and utility service management with predictive maintenance capabilities.', projects: '15+', experience: '8 Years' },
    ],
  },
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
  contact: {
    email: 'aanyaus@gmail.com',
    phone: '+91 98765 43210',
    location: 'Global - Remote Consulting',
    linkedin: 'https://linkedin.com',
    youtube: 'https://youtube.com',
  },
  articles: [
    {
      id: '1',
      slug: 'future-of-agentic-ai-field-service',
      title: 'The Future of Agentic AI in Field Service',
      excerpt: 'How autonomous AI agents are revolutionizing field service operations, from predictive maintenance to intelligent dispatching.',
      content: '<p>The field service industry is on the brink of a major transformation with the advent of Agentic AI...</p>',
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
      content: '<p>Migrating from SAP Plant Maintenance to Salesforce Field Service Lightning is a significant undertaking...</p>',
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
      content: '<p>The past few years have taught us that supply chain resilience is no longer optional...</p>',
      category: 'Supply Chain',
      date: 'Jan 5, 2026',
      readTime: '10 min read',
      image: 'Supply chain network',
      tags: ['Supply Chain', 'Analytics', 'Strategy'],
      likes: 67,
      views: 756,
      published: true,
    },
    {
      id: 'ai-architecture-framework',
      slug: 'ai-architecture-accountability-framework',
      title: 'AI Architecture Accountability Framework',
      excerpt: 'An interactive framework for establishing clear accountability boundaries in enterprise AI architecture — separating the "what" from the "how" across Salesforce FSL, SAP, and ServiceNow transformation programs.',
      content: '',
      category: 'AI & Technology',
      date: 'May 1, 2026',
      readTime: '15 min read',
      image: 'Architecture Framework',
      tags: ['AI', 'Architecture', 'Enterprise', 'SAP', 'Salesforce'],
      likes: 0,
      views: 0,
      published: true,
      externalUrl: 'https://kpji76.github.io/architecture-accountability/ai-architecture-framework.html',
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
  updateBranding: (updates: Partial<SiteContent['branding']>) => void
  updateHero: (updates: Partial<SiteContent['hero']>) => void
  updateAbout: (updates: Partial<SiteContent['about']>) => void
  updateExpertise: (updates: Partial<SiteContent['expertise']>) => void
  updateContact: (updates: Partial<SiteContent['contact']>) => void
  updateIndustries: (updates: Partial<SiteContent['industries']>) => void
  updateIndustryItem: (index: number, updates: Partial<IndustryItem>) => void
  toggleSectionVisibility: (section: keyof SiteContent['visibleSections']) => void
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
  function mergeWithDefaults(stored: Partial<SiteContent>): SiteContent {
    // Seed any default articles that aren't yet in stored data (by id)
    const storedArticleIds = new Set((stored.articles ?? []).map(a => a.id))
    const unseenDefaults = defaultContent.articles.filter(a => !storedArticleIds.has(a.id))
    const mergedArticles = stored.articles
      ? [...stored.articles, ...unseenDefaults]
      : defaultContent.articles

    return {
      ...defaultContent,
      ...stored,
      branding: { ...defaultContent.branding, ...(stored.branding ?? {}), navLinks: { ...defaultContent.branding.navLinks, ...(stored.branding?.navLinks ?? {}) } },
      visibleSections: { ...defaultContent.visibleSections, ...(stored.visibleSections ?? {}) },
      industries: { ...defaultContent.industries, ...(stored.industries ?? {}), items: stored.industries?.items ?? defaultContent.industries.items },
      contact: { ...defaultContent.contact, ...(stored.contact ?? {}) },
      articles: mergedArticles,
    }
  }

  const [content, setContent] = useState<SiteContent>(() =>
    mergeWithDefaults(loadContent<Partial<SiteContent>>(defaultContent))
  )
  const [previewMode, setPreviewMode] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [originalContent, setOriginalContent] = useState<SiteContent>(() =>
    mergeWithDefaults(loadContent<Partial<SiteContent>>(defaultContent))
  )

  useEffect(() => {
    saveContent(content)
  }, [content])

  const updateBranding = (updates: Partial<SiteContent['branding']>) => {
    setContent(prev => ({ ...prev, branding: { ...prev.branding, ...updates } }))
    setHasUnsavedChanges(true)
  }

  const updateHero = (updates: Partial<SiteContent['hero']>) => {
    setContent(prev => ({ ...prev, hero: { ...prev.hero, ...updates } }))
    setHasUnsavedChanges(true)
  }

  const updateAbout = (updates: Partial<SiteContent['about']>) => {
    setContent(prev => ({ ...prev, about: { ...prev.about, ...updates } }))
    setHasUnsavedChanges(true)
  }

  const updateExpertise = (updates: Partial<SiteContent['expertise']>) => {
    setContent(prev => ({ ...prev, expertise: { ...prev.expertise, ...updates } }))
    setHasUnsavedChanges(true)
  }

  const updateContact = (updates: Partial<SiteContent['contact']>) => {
    setContent(prev => ({ ...prev, contact: { ...prev.contact, ...updates } }))
    setHasUnsavedChanges(true)
  }

  const updateIndustries = (updates: Partial<SiteContent['industries']>) => {
    setContent(prev => ({ ...prev, industries: { ...prev.industries, ...updates } }))
    setHasUnsavedChanges(true)
  }

  const updateIndustryItem = (index: number, updates: Partial<IndustryItem>) => {
    setContent(prev => {
      const items = prev.industries.items.map((item, i) =>
        i === index ? { ...item, ...updates } : item
      )
      return { ...prev, industries: { ...prev.industries, items } }
    })
    setHasUnsavedChanges(true)
  }

  const toggleSectionVisibility = (section: keyof SiteContent['visibleSections']) => {
    setContent(prev => ({
      ...prev,
      visibleSections: { ...prev.visibleSections, [section]: !prev.visibleSections[section] },
    }))
    setHasUnsavedChanges(true)
  }

  function generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
      .substring(0, 60)
  }

  // Auto-detect full HTML documents — if content starts with <!DOCTYPE or <html, treat as full page
  function detectFullPage(content: string, explicitFlag?: boolean): boolean {
    if (explicitFlag) return true
    const trimmed = content.trimStart()
    return trimmed.startsWith('<!DOCTYPE') || trimmed.startsWith('<!doctype') || trimmed.startsWith('<html')
  }

  const addArticle = (article: Omit<Article, 'id' | 'slug' | 'likes' | 'views'>) => {
    setContent(prev => {
      const slug = generateSlug(article.title)
      let uniqueSlug = slug
      let counter = 1
      while (prev.articles.some(a => a.slug === uniqueSlug)) {
        uniqueSlug = `${slug}-${counter}`
        counter++
      }
      const isFullPage = detectFullPage(article.content, article.isFullPage)
      const newArticle: Article = {
        ...article,
        isFullPage,
        content: isFullPage ? article.content : sanitizeArticleHtml(article.content),
        id: `article-${Date.now()}`,
        slug: uniqueSlug,
        likes: 0,
        views: 0,
      }
      return { ...prev, articles: [...prev.articles, newArticle] }
    })
    setHasUnsavedChanges(true)
  }

  const updateArticle = (id: string, updates: Partial<Article>) => {
    const existingArticle = content.articles.find(a => a.id === id)
    const isFullPage = updates.content !== undefined
      ? detectFullPage(updates.content, updates.isFullPage ?? existingArticle?.isFullPage)
      : (updates.isFullPage ?? existingArticle?.isFullPage ?? false)
    const sanitizedUpdates = updates.content !== undefined
      ? { ...updates, isFullPage, content: isFullPage ? updates.content : sanitizeArticleHtml(updates.content) }
      : { ...updates, isFullPage }
    setContent(prev => ({
      ...prev,
      articles: prev.articles.map(a => a.id === id ? { ...a, ...sanitizedUpdates } : a),
    }))
    setHasUnsavedChanges(true)
  }

  const deleteArticle = (id: string) => {
    setContent(prev => ({ ...prev, articles: prev.articles.filter(a => a.id !== id) }))
    setHasUnsavedChanges(true)
  }

  const toggleArticlePublish = (id: string) => {
    setContent(prev => ({
      ...prev,
      articles: prev.articles.map(a => a.id === id ? { ...a, published: !a.published } : a),
    }))
    setHasUnsavedChanges(true)
  }

  const incrementArticleViews = (id: string) => {
    setContent(prev => ({
      ...prev,
      articles: prev.articles.map(a => a.id === id ? { ...a, views: a.views + 1 } : a),
    }))
  }

  const incrementArticleLikes = (id: string) => {
    setContent(prev => ({
      ...prev,
      articles: prev.articles.map(a => a.id === id ? { ...a, likes: a.likes + 1 } : a),
    }))
  }

  const getPublishedArticles = (): Article[] => content.articles.filter(a => a.published)

  const getArticleBySlug = (slug: string): Article | undefined =>
    content.articles.find(a => a.slug === slug && a.published)

  const addVideo = (video: Omit<Video, 'id' | 'likes' | 'views'>) => {
    const safeUrl = sanitizeYoutubeUrl(video.youtubeUrl)
    if (!safeUrl) return
    const newVideo: Video = {
      ...video,
      youtubeUrl: safeUrl,
      id: `video-${Date.now()}`,
      likes: 0,
      views: 0,
    }
    setContent(prev => ({ ...prev, videos: [...prev.videos, newVideo] }))
    setHasUnsavedChanges(true)
  }

  const updateVideo = (id: string, updates: Partial<Video>) => {
    const sanitizedUpdates =
      updates.youtubeUrl !== undefined
        ? { ...updates, youtubeUrl: sanitizeYoutubeUrl(updates.youtubeUrl) ?? updates.youtubeUrl }
        : updates
    setContent(prev => ({
      ...prev,
      videos: prev.videos.map(v => v.id === id ? { ...v, ...sanitizedUpdates } : v),
    }))
    setHasUnsavedChanges(true)
  }

  const deleteVideo = (id: string) => {
    setContent(prev => ({ ...prev, videos: prev.videos.filter(v => v.id !== id) }))
    setHasUnsavedChanges(true)
  }

  const toggleVideoPublish = (id: string) => {
    setContent(prev => ({
      ...prev,
      videos: prev.videos.map(v => v.id === id ? { ...v, published: !v.published } : v),
    }))
    setHasUnsavedChanges(true)
  }

  const incrementVideoViews = (id: string) => {
    setContent(prev => ({
      ...prev,
      videos: prev.videos.map(v => v.id === id ? { ...v, views: v.views + 1 } : v),
    }))
  }

  const incrementVideoLikes = (id: string) => {
    setContent(prev => ({
      ...prev,
      videos: prev.videos.map(v => v.id === id ? { ...v, likes: v.likes + 1 } : v),
    }))
  }

  const getPublishedVideos = (): Video[] => content.videos.filter(v => v.published)

  const saveChanges = () => {
    saveContent(content)
    setOriginalContent(content)
    setHasUnsavedChanges(false)
  }

  const discardChanges = () => {
    setContent(originalContent)
    setHasUnsavedChanges(false)
  }

  return (
    <ContentContext.Provider
      value={{
        content,
        updateBranding,
        updateHero,
        updateAbout,
        updateExpertise,
        updateContact,
        updateIndustries,
        updateIndustryItem,
        toggleSectionVisibility,
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
      }}
    >
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
