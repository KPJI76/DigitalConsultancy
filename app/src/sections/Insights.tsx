import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ArrowRight, Calendar, Clock, BookOpen, Share2, MessageCircle, Heart, Eye, Copy, Check } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useContent } from '../contexts/ContentContext'

const Insights = () => {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const cursorImageRef = useRef<HTMLDivElement>(null)
  const [hoveredArticle, setHoveredArticle] = useState<ReturnType<typeof useContent>['content']['articles'][0] | null>(null)

  const { user, isAuthenticated, toggleLike } = useAuth()
  const { getPublishedArticles, incrementArticleViews, incrementArticleLikes } = useContent()

  const publishedArticles = getPublishedArticles()

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header animation
      const headerItems = headerRef.current?.querySelectorAll('.reveal-item')
      if (headerItems && headerItems.length > 0) {
        gsap.fromTo(headerItems,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: headerRef.current,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            }
          }
        )
      }

      // List items animation
      const listItems = listRef.current?.querySelectorAll('.article-item')
      if (listItems) {
        listItems.forEach((item, index) => {
          gsap.fromTo(item,
            { x: -30, opacity: 0 },
            {
              x: 0,
              opacity: 1,
              duration: 0.6,
              delay: index * 0.1,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: listRef.current,
                start: 'top 75%',
                toggleActions: 'play none none reverse',
              }
            }
          )
        })
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  // Cursor-following image
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (cursorImageRef.current && hoveredArticle) {
        gsap.to(cursorImageRef.current, {
          x: e.clientX + 20,
          y: e.clientY - 80,
          duration: 0.3,
          ease: 'power2.out',
        })
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [hoveredArticle])

  const handleLike = (e: React.MouseEvent, articleId: string) => {
    e.stopPropagation()
    if (!isAuthenticated) {
      alert('Please sign in to like articles')
      return
    }
    toggleLike(articleId)
    incrementArticleLikes(articleId)
  }

  const isLiked = (articleId: string) => {
    return user?.likedArticles?.includes(articleId) || false
  }

  const [copiedId, setCopiedId] = useState<string | null>(null)

  const shareArticle = (article: typeof publishedArticles[0], e: React.MouseEvent) => {
    e.stopPropagation()
    const shareUrl = `${window.location.origin}${import.meta.env.BASE_URL}article/${article.slug}`
    const shareData = {
      title: article.title,
      text: article.excerpt,
      url: shareUrl,
    }
    
    if (navigator.share) {
      navigator.share(shareData)
    } else {
      navigator.clipboard.writeText(shareUrl)
      setCopiedId(article.id)
      setTimeout(() => setCopiedId(null), 2000)
    }
  }

  const copyArticleLink = (article: typeof publishedArticles[0], e: React.MouseEvent) => {
    e.stopPropagation()
    const shareUrl = `${window.location.origin}${import.meta.env.BASE_URL}article/${article.slug}`
    navigator.clipboard.writeText(shareUrl)
    setCopiedId(article.id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <section 
      id="insights" 
      ref={sectionRef}
      className="relative py-24 lg:py-32 bg-navy overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-navy via-navy to-navy/95" />
      <div className="absolute top-1/3 right-0 w-96 h-96 bg-cyan/10 rounded-full blur-[150px]" />

      {/* Floating cursor image */}
      <div
        ref={cursorImageRef}
        className={`fixed pointer-events-none z-50 w-64 h-40 rounded-lg overflow-hidden shadow-2xl transition-opacity duration-300 ${
          hoveredArticle ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ transform: 'translate(-50%, -50%)' }}
      >
        <div className="w-full h-full bg-gradient-to-br from-cyan/30 to-blue-500/30 flex items-center justify-center">
          <span className="text-white/60 text-sm">{hoveredArticle?.image}</span>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div ref={headerRef} className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-16">
          <div>
            <span className="reveal-item inline-block px-4 py-1.5 bg-cyan/10 text-cyan text-sm font-medium rounded-full mb-6">
              Knowledge Hub
            </span>
            <h2 className="reveal-item text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              Latest <span className="text-cyan">Insights</span>
            </h2>
            <p className="reveal-item text-lg text-white/60 max-w-xl">
              Thought leadership on enterprise technology, AI integration, and service transformation.
            </p>
          </div>
          <div className="reveal-item mt-6 lg:mt-0 flex items-center gap-4">
            {!isAuthenticated ? (
              <a 
                href="/login"
                className="inline-flex items-center gap-2 px-4 py-2 bg-cyan/10 text-cyan rounded-lg hover:bg-cyan hover:text-navy transition-all"
              >
                <Heart size={18} />
                <span>Sign in to like & subscribe</span>
              </a>
            ) : (
              <div className="flex items-center gap-2 text-white/60">
                <Heart size={18} className={user?.likedArticles?.length ? 'text-pink-400 fill-pink-400' : ''} />
                <span>{user?.likedArticles?.length || 0} liked</span>
              </div>
            )}
            <a 
              href="#contact"
              onClick={(e) => { e.preventDefault(); document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' }) }}
              className="inline-flex items-center gap-2 text-cyan hover:text-white transition-colors"
            >
              <BookOpen size={18} />
              <span>Subscribe for Updates</span>
            </a>
          </div>
        </div>

        {/* Articles List */}
        <div ref={listRef} className="space-y-1">
          {publishedArticles.map((article, index) => (
            <article
              key={article.id}
              className="article-item group relative"
              onMouseEnter={() => setHoveredArticle(article)}
              onMouseLeave={() => setHoveredArticle(null)}
            >
              <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-8 py-8 border-t border-white/10">
                {/* Number */}
                <span className="text-cyan/30 text-sm font-mono w-8 shrink-0">
                  {String(index + 1).padStart(2, '0')}
                </span>

                {/* Clickable content area → goes to article page */}
                <Link
                  to={`/article/${article.slug}`}
                  className="flex-1 min-w-0"
                  onClick={() => incrementArticleViews(article.id)}
                >
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <span className="px-3 py-1 bg-white/5 text-cyan text-xs font-medium rounded-full">
                      {article.category}
                    </span>
                    <span className="flex items-center gap-1 text-white/40 text-xs">
                      <Calendar size={12} />
                      {article.date}
                    </span>
                    <span className="flex items-center gap-1 text-white/40 text-xs">
                      <Clock size={12} />
                      {article.readTime}
                    </span>
                    <span className="flex items-center gap-1 text-white/40 text-xs">
                      <Eye size={12} /> {article.views}
                    </span>
                  </div>

                  <h3 className="text-xl lg:text-2xl font-semibold text-white mb-2 group-hover:text-cyan transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-white/50 text-sm lg:text-base line-clamp-2 group-hover:text-white/70 transition-colors">
                    {article.excerpt}
                  </p>
                </Link>

                {/* Actions — stopPropagation so they don't trigger navigation */}
                <div className="flex items-center gap-3 shrink-0">
                  <button
                    onClick={(e) => handleLike(e, article.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                      isLiked(article.id)
                        ? 'bg-pink-500/20 text-pink-400'
                        : 'bg-white/5 text-white/40 hover:text-pink-400 hover:bg-pink-500/10'
                    }`}
                  >
                    <Heart size={16} className={isLiked(article.id) ? 'fill-pink-400' : ''} />
                    <span className="text-sm">{article.likes}</span>
                  </button>

                  <button
                    onClick={(e) => copyArticleLink(article, e)}
                    className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-cyan hover:bg-cyan/10 transition-all"
                    title="Copy link"
                  >
                    {copiedId === article.id ? <Check size={15} className="text-green-400" /> : <Copy size={15} />}
                  </button>

                  <button
                    onClick={(e) => shareArticle(article, e)}
                    className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-cyan hover:bg-cyan/10 transition-all"
                    title="Share article"
                  >
                    <Share2 size={15} />
                  </button>

                  <Link
                    to={`/article/${article.slug}`}
                    className="w-9 h-9 rounded-full bg-cyan/10 flex items-center justify-center text-cyan hover:bg-cyan hover:text-navy transition-all"
                    onClick={() => incrementArticleViews(article.id)}
                  >
                    <ArrowRight size={15} />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 pt-12 border-t border-white/10 text-center">
          <p className="text-white/50 mb-4">
            Want to discuss these topics or suggest new ones?
          </p>
          <a 
            href="#contact"
            onClick={(e) => { e.preventDefault(); document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' }) }}
            className="inline-flex items-center gap-2 px-6 py-3 border border-cyan text-cyan font-semibold rounded-lg hover:bg-cyan hover:text-navy transition-all duration-300"
          >
            <MessageCircle size={18} />
            <span>Start a Conversation</span>
          </a>
        </div>
      </div>

    </section>
  )
}

export default Insights
