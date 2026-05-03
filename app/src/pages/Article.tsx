import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useContent } from '../contexts/ContentContext'
import { useAuth } from '../contexts/AuthContext'
import { Calendar, Clock, Eye, Heart, Share2, ArrowLeft, Tag, Copy, Check, ExternalLink } from 'lucide-react'
import Navigation from '../sections/Navigation'
import Footer from '../sections/Footer'
import { SafeHtml } from '../components/SafeHtml'

const Article = () => {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const { getArticleBySlug, incrementArticleViews, incrementArticleLikes } = useContent()
  const { user, isAuthenticated, toggleLike } = useAuth()
  const [copied, setCopied] = useState(false)
  
  const article = slug ? getArticleBySlug(slug) : undefined

  useEffect(() => {
    if (article) {
      incrementArticleViews(article.id)
    }
  }, [article?.id])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  if (!article) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Article Not Found</h1>
          <p className="text-white/60 mb-6">The article you're looking for doesn't exist.</p>
          <Link to="/" className="px-6 py-3 bg-cyan text-navy font-semibold rounded-lg hover:bg-white transition-all">
            Go Home
          </Link>
        </div>
      </div>
    )
  }

  const isLiked = user?.likedArticles?.includes(article.id) || false

  const handleLike = () => {
    if (!isAuthenticated) {
      alert('Please sign in to like articles')
      return
    }
    toggleLike(article.id)
    incrementArticleLikes(article.id)
  }

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}${import.meta.env.BASE_URL}article/${article.slug}`
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.excerpt,
          url: shareUrl,
        })
      } catch {
        // User cancelled share
      }
    } else {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const copyLink = async () => {
    const shareUrl = `${window.location.origin}${import.meta.env.BASE_URL}article/${article.slug}`
    await navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-navy">
      <Navigation />
      
      {/* Hero Section */}
      <div className="pt-32 pb-16 bg-gradient-to-b from-navy to-navy/90">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          {/* Back Button */}
          <button
            onClick={() => window.history.length > 1 ? navigate(-1) : navigate('/')}
            className="flex items-center gap-2 text-white/60 hover:text-cyan transition-colors mb-8"
          >
            <ArrowLeft size={18} />
            Back
          </button>

          {/* Category & Meta */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <span className="px-4 py-1.5 bg-cyan/10 text-cyan text-sm font-medium rounded-full">
              {article.category}
            </span>
            <span className="flex items-center gap-1 text-white/50 text-sm">
              <Calendar size={14} />
              {article.date}
            </span>
            <span className="flex items-center gap-1 text-white/50 text-sm">
              <Clock size={14} />
              {article.readTime}
            </span>
            <span className="flex items-center gap-1 text-white/50 text-sm">
              <Eye size={14} />
              {article.views} views
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
            {article.title}
          </h1>

          {/* Excerpt */}
          <p className="text-xl text-white/70 mb-8 leading-relaxed">
            {article.excerpt}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-8">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-1 px-3 py-1 bg-white/5 text-white/60 text-sm rounded-full"
              >
                <Tag size={12} />
                {tag}
              </span>
            ))}
          </div>

          {/* Share & Like Actions */}
          <div className="flex flex-wrap items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10">
            <div className="flex items-center gap-2">
              <span className="text-white/50 text-sm">Share:</span>
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 bg-cyan/10 text-cyan rounded-lg hover:bg-cyan hover:text-navy transition-all"
              >
                <Share2 size={16} />
                Share
              </button>
              <button
                onClick={copyLink}
                className="flex items-center gap-2 px-4 py-2 bg-white/5 text-white/70 rounded-lg hover:bg-white/10 transition-all"
              >
                {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
                {copied ? 'Copied!' : 'Copy Link'}
              </button>
            </div>
            
            <div className="flex-1" />
            
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                isLiked
                  ? 'bg-pink-500/20 text-pink-400'
                  : 'bg-white/5 text-white/70 hover:text-pink-400 hover:bg-pink-500/10'
              }`}
            >
              <Heart size={16} className={isLiked ? 'fill-pink-400' : ''} />
              {article.likes} likes
            </button>
          </div>
        </div>
      </div>

      {/* Article Content */}
      {article.isFullPage ? (
        /* Full HTML page — render via srcdoc iframe (bypasses X-Frame-Options) */
        <div className="bg-navy">
          <div className="flex items-center justify-between px-6 py-3 bg-white/5 border-b border-white/10">
            <span className="text-white/50 text-sm">Rendering full HTML page</span>
            <button
              onClick={() => {
                const blob = new Blob([article.content], { type: 'text/html' })
                window.open(URL.createObjectURL(blob), '_blank')
              }}
              className="flex items-center gap-2 px-4 py-1.5 bg-cyan text-navy font-semibold text-sm rounded-lg hover:bg-white transition-all"
            >
              <ExternalLink size={14} />
              Open in new tab
            </button>
          </div>
          <iframe
            srcDoc={article.content}
            title={article.title}
            className="w-full border-0"
            style={{ height: 'calc(100vh - 80px)' }}
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          />
        </div>
      ) : article.externalUrl ? (
        /* External article — show a launch card (iframes blocked by GitHub Pages) */
        <div className="py-16 bg-navy">
          <div className="max-w-2xl mx-auto px-6 lg:px-8 text-center">
            {/* Icon */}
            <div className="w-20 h-20 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mx-auto mb-8">
              <ExternalLink size={36} className="text-purple-400" />
            </div>

            <h2 className="text-2xl font-bold text-white mb-3">This is an external resource</h2>
            <p className="text-white/60 mb-10 leading-relaxed">
              This article lives on an external page. Click below to open it — it will load in a new tab so you never lose your place here.
            </p>

            {/* Primary CTA */}
            <a
              href={article.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 bg-cyan text-navy font-bold text-lg rounded-xl hover:bg-white transition-all duration-300 shadow-lg hover:shadow-cyan/20 mb-6"
            >
              <ExternalLink size={20} />
              Open Full Article
            </a>

            {/* URL preview */}
            <div className="flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-xl text-left">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                <ExternalLink size={14} className="text-white/50" />
              </div>
              <p className="text-white/40 text-sm truncate">{article.externalUrl}</p>
            </div>
          </div>
        </div>
      ) : (
        <article className="py-16 bg-navy">
          <div className="max-w-3xl mx-auto px-6 lg:px-8">
            <SafeHtml
              html={article.content}
              mode="article"
              className="prose prose-invert prose-lg max-w-none"
            />

            {/* Share at bottom */}
            <div className="mt-16 pt-8 border-t border-white/10">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <p className="text-white font-medium mb-1">Enjoyed this article?</p>
                  <p className="text-white/50 text-sm">Share it with your network</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={copyLink}
                    className="flex items-center gap-2 px-4 py-2 bg-white/5 text-white/70 rounded-lg hover:bg-white/10 transition-all"
                  >
                    {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
                    {copied ? 'Link Copied!' : 'Copy Article Link'}
                  </button>
                  <button
                    onClick={handleShare}
                    className="flex items-center gap-2 px-4 py-2 bg-cyan text-navy font-semibold rounded-lg hover:bg-white transition-all"
                  >
                    <Share2 size={16} />
                    Share
                  </button>
                </div>
              </div>
            </div>
          </div>
        </article>
      )}

      <Footer />
    </div>
  )
}

export default Article
