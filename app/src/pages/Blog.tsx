import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useContent } from '../contexts/ContentContext'
import { useAuth } from '../contexts/AuthContext'
import Navigation from '../sections/Navigation'
import Footer from '../sections/Footer'
import {
  Search, Calendar, Clock, Eye, Heart, Tag, ArrowRight, BookOpen, Filter, ExternalLink
} from 'lucide-react'

const Blog = () => {
  const { getPublishedArticles } = useContent()
  const { isAuthenticated } = useAuth()
  const articles = getPublishedArticles()

  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')

  const categories = useMemo(() => {
    const cats = Array.from(new Set(articles.map(a => a.category)))
    return ['All', ...cats]
  }, [articles])

  const filtered = useMemo(() => {
    return articles.filter(a => {
      const matchCat = activeCategory === 'All' || a.category === activeCategory
      const matchSearch = !search ||
        a.title.toLowerCase().includes(search.toLowerCase()) ||
        a.excerpt.toLowerCase().includes(search.toLowerCase()) ||
        a.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
      return matchCat && matchSearch
    })
  }, [articles, activeCategory, search])

  const featured = filtered[0]
  const rest = filtered.slice(1)

  return (
    <div className="min-h-screen bg-navy">
      <Navigation />

      {/* Hero header */}
      <section className="relative pt-32 pb-16 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan/5 via-transparent to-transparent" />
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-cyan/10 rounded-full blur-[150px]" />

        <div className="relative max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen size={16} className="text-cyan" />
            <span className="text-cyan text-sm font-medium">Knowledge Hub</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
            Latest <span className="text-cyan">Insights</span>
          </h1>
          <p className="text-white/60 text-lg max-w-xl mb-10">
            Thought leadership on enterprise technology, AI integration, and service transformation.
          </p>

          {/* Search + filter row */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="text"
                placeholder="Search articles..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:border-cyan text-sm"
              />
            </div>

            {/* Category tabs */}
            <div className="flex items-center gap-2 flex-wrap">
              <Filter size={14} className="text-white/40" />
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    activeCategory === cat
                      ? 'bg-cyan text-navy'
                      : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-24">
        {filtered.length === 0 ? (
          <div className="text-center py-24 text-white/40">
            <BookOpen size={40} className="mx-auto mb-4 opacity-30" />
            <p className="text-lg">No articles match your search.</p>
          </div>
        ) : (
          <>
            {/* Featured article */}
            {featured && (
              <Link
                to={`/article/${featured.slug}`}
                className="group block mb-12 p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan/30 transition-all duration-300"
              >
                <div className="flex flex-col lg:flex-row gap-8">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="px-3 py-1 bg-cyan/10 text-cyan text-xs font-medium rounded-full">
                        {featured.category}
                      </span>
                      <span className="px-2 py-0.5 bg-white/10 text-white/40 text-xs rounded-full">Featured</span>
                      {featured.externalUrl && (
                        <span className="flex items-center gap-1 px-2 py-0.5 bg-purple-500/15 text-purple-400 text-xs rounded-full">
                          <ExternalLink size={10} /> External
                        </span>
                      )}
                    </div>
                    <h2 className="text-2xl lg:text-3xl font-bold text-white mb-3 group-hover:text-cyan transition-colors">
                      {featured.title}
                    </h2>
                    <p className="text-white/60 leading-relaxed mb-6">{featured.excerpt}</p>
                    <div className="flex flex-wrap items-center gap-4 text-white/40 text-sm mb-6">
                      <span className="flex items-center gap-1.5"><Calendar size={14} /> {featured.date}</span>
                      <span className="flex items-center gap-1.5"><Clock size={14} /> {featured.readTime}</span>
                      <span className="flex items-center gap-1.5"><Eye size={14} /> {featured.views.toLocaleString()}</span>
                      <span className="flex items-center gap-1.5"><Heart size={14} /> {featured.likes}</span>
                    </div>
                    <div className="flex items-center gap-2 text-cyan font-medium">
                      Read Article <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                  {featured.tags.length > 0 && (
                    <div className="lg:w-48 flex flex-col justify-end gap-2">
                      {featured.tags.map(tag => (
                        <span key={tag} className="flex items-center gap-1 text-white/30 text-xs">
                          <Tag size={11} /> {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            )}

            {/* Article grid */}
            {rest.length > 0 && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rest.map(article => (
                  <Link
                    key={article.id}
                    to={`/article/${article.slug}`}
                    className="group flex flex-col p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan/30 transition-all duration-300"
                  >
                    <div className="flex items-center gap-2 mb-4 flex-wrap">
                      <span className="px-3 py-1 bg-cyan/10 text-cyan text-xs font-medium rounded-full">
                        {article.category}
                      </span>
                      {article.externalUrl && (
                        <span className="flex items-center gap-1 px-2 py-0.5 bg-purple-500/15 text-purple-400 text-xs rounded-full">
                          <ExternalLink size={10} /> External
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-white/50 text-sm leading-relaxed mb-4 flex-1 line-clamp-3">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-white/30 text-xs mt-auto pt-4 border-t border-white/5">
                      <span className="flex items-center gap-1"><Calendar size={12} /> {article.date}</span>
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1"><Eye size={12} /> {article.views}</span>
                        <span className="flex items-center gap-1"><Heart size={12} /> {article.likes}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}

        {/* Sign-in prompt for non-authenticated users */}
        {!isAuthenticated && filtered.length > 0 && (
          <div className="mt-16 text-center p-8 rounded-2xl bg-white/5 border border-white/10">
            <Heart size={24} className="text-cyan mx-auto mb-3" />
            <p className="text-white/60 mb-4">Sign in to like articles and subscribe for updates</p>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-cyan text-navy font-semibold rounded-lg hover:bg-white transition-all"
            >
              Sign In
            </Link>
          </div>
        )}
      </section>

      <Footer />
    </div>
  )
}

export default Blog
