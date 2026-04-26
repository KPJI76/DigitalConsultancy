import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useContent } from '../../contexts/ContentContext'
import { Button } from '@/components/ui/button'
import {
  LayoutDashboard,
  FileText,
  Settings,
  Users,
  Eye,
  Save,
  RotateCcw,
  LogOut,
  ChevronRight,
  BarChart3,
  Heart,
  Mail,
  Youtube,
  Factory,
  Layers,
} from 'lucide-react'
// Youtube is used in VideoManager component
import HeroEditor from './components/HeroEditor'
import AboutEditor from './components/AboutEditor'
import ArticlesManager from './components/ArticlesManager'
import ExpertiseEditor from './components/ExpertiseEditor'
import VideoManager from './components/VideoManager'
import ContactEditor from './components/ContactEditor'
import IndustriesEditor from './components/IndustriesEditor'
import SectionsManager from './components/SectionsManager'

const AdminDashboard = () => {
  const navigate = useNavigate()
  const { user, logout, isAdmin } = useAuth()
  const { 
    content, 
    hasUnsavedChanges, 
    saveChanges, 
    discardChanges,
    previewMode,
    setPreviewMode,
    getPublishedArticles 
  } = useContent()
  
  const [activeTab, setActiveTab] = useState('overview')

  // Redirect if not admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-white/60 mb-6">You don't have permission to access this page.</p>
          <Button onClick={() => navigate('/')} className="bg-cyan text-navy">
            Go Home
          </Button>
        </div>
      </div>
    )
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const handlePreview = () => {
    setPreviewMode(!previewMode)
    if (!previewMode) {
      navigate('/')
    }
  }

  const publishedArticles = getPublishedArticles()
  const totalViews = content.articles.reduce((sum, a) => sum + a.views, 0) + content.videos.reduce((sum, v) => sum + v.views, 0)
  const totalLikes = content.articles.reduce((sum, a) => sum + a.likes, 0) + content.videos.reduce((sum, v) => sum + v.likes, 0)
  const publishedVideos = content.videos.filter(v => v.published)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  void publishedVideos

  return (
    <div className="min-h-screen bg-navy">
      {/* Header */}
      <header className="bg-navy/80 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 relative">
              <svg viewBox="0 0 40 40" fill="none" className="w-full h-full">
                <path d="M20 3L35 12V28L20 37L5 28V12L20 3Z" stroke="#00D9FF" strokeWidth="1.5" fill="none" />
                <circle cx="20" cy="20" r="6" fill="#00D9FF" />
              </svg>
            </div>
            <div>
              <h1 className="text-white font-semibold">Admin Dashboard</h1>
              <p className="text-white/40 text-xs">EnterpriseConsult</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Unsaved changes indicator */}
            {hasUnsavedChanges && (
              <span className="px-3 py-1 bg-orange/20 text-orange text-xs rounded-full">
                Unsaved Changes
              </span>
            )}

            {/* Preview button */}
            <Button
              variant="outline"
              size="sm"
              onClick={handlePreview}
              className="border-white/20 text-white hover:bg-white/10"
            >
              <Eye size={16} className="mr-2" />
              {previewMode ? 'Exit Preview' : 'Preview'}
            </Button>

            {/* Save/Discard */}
            {hasUnsavedChanges && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={discardChanges}
                  className="border-white/20 text-white hover:bg-red-500/20 hover:text-red-400"
                >
                  <RotateCcw size={16} className="mr-2" />
                  Discard
                </Button>
                <Button
                  size="sm"
                  onClick={saveChanges}
                  className="bg-cyan text-navy hover:bg-white"
                >
                  <Save size={16} className="mr-2" />
                  Save Changes
                </Button>
              </>
            )}

            {/* User menu */}
            <div className="flex items-center gap-3 pl-4 border-l border-white/10">
              <div className="text-right">
                <p className="text-white text-sm">{user?.name}</p>
                <p className="text-cyan text-xs">{user?.role}</p>
              </div>
              <button
                onClick={handleLogout}
                className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center text-white/60 hover:text-red-400 hover:bg-red-500/10 transition-all"
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-navy/50 border-r border-white/10 min-h-[calc(100vh-64px)] p-4">
          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${
                activeTab === 'overview' 
                  ? 'bg-cyan/20 text-cyan' 
                  : 'text-white/60 hover:bg-white/5 hover:text-white'
              }`}
            >
              <LayoutDashboard size={18} />
              <span>Overview</span>
              {activeTab === 'overview' && <ChevronRight size={16} className="ml-auto" />}
            </button>

            <button
              onClick={() => setActiveTab('hero')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${
                activeTab === 'hero' 
                  ? 'bg-cyan/20 text-cyan' 
                  : 'text-white/60 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Settings size={18} />
              <span>Hero Section</span>
              {activeTab === 'hero' && <ChevronRight size={16} className="ml-auto" />}
            </button>

            <button
              onClick={() => setActiveTab('about')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${
                activeTab === 'about' 
                  ? 'bg-cyan/20 text-cyan' 
                  : 'text-white/60 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Users size={18} />
              <span>About Section</span>
              {activeTab === 'about' && <ChevronRight size={16} className="ml-auto" />}
            </button>

            <button
              onClick={() => setActiveTab('expertise')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${
                activeTab === 'expertise' 
                  ? 'bg-cyan/20 text-cyan' 
                  : 'text-white/60 hover:bg-white/5 hover:text-white'
              }`}
            >
              <BarChart3 size={18} />
              <span>Expertise</span>
              {activeTab === 'expertise' && <ChevronRight size={16} className="ml-auto" />}
            </button>

            <button
              onClick={() => setActiveTab('articles')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${
                activeTab === 'articles' 
                  ? 'bg-cyan/20 text-cyan' 
                  : 'text-white/60 hover:bg-white/5 hover:text-white'
              }`}
            >
              <FileText size={18} />
              <span>Articles</span>
              <span className="ml-auto px-2 py-0.5 bg-white/10 rounded text-xs">
                {content.articles.length}
              </span>
              {activeTab === 'articles' && <ChevronRight size={16} className="ml-2" />}
            </button>

            <button
              onClick={() => setActiveTab('videos')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${
                activeTab === 'videos'
                  ? 'bg-cyan/20 text-cyan'
                  : 'text-white/60 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Youtube size={18} />
              <span>Videos</span>
              <span className="ml-auto px-2 py-0.5 bg-white/10 rounded text-xs">
                {content.videos.length}
              </span>
              {activeTab === 'videos' && <ChevronRight size={16} className="ml-2" />}
            </button>

            <button
              onClick={() => setActiveTab('industries')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${
                activeTab === 'industries'
                  ? 'bg-cyan/20 text-cyan'
                  : 'text-white/60 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Factory size={18} />
              <span>Industries</span>
              {activeTab === 'industries' && <ChevronRight size={16} className="ml-auto" />}
            </button>

            <button
              onClick={() => setActiveTab('contact')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${
                activeTab === 'contact'
                  ? 'bg-cyan/20 text-cyan'
                  : 'text-white/60 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Mail size={18} />
              <span>Contact Info</span>
              {activeTab === 'contact' && <ChevronRight size={16} className="ml-auto" />}
            </button>

            <div className="pt-2 border-t border-white/10 mt-2">
              <button
                onClick={() => setActiveTab('sections')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${
                  activeTab === 'sections'
                    ? 'bg-cyan/20 text-cyan'
                    : 'text-white/60 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Layers size={18} />
                <span>Show / Hide Sections</span>
                {activeTab === 'sections' && <ChevronRight size={16} className="ml-auto" />}
              </button>
            </div>
          </nav>

          {/* Quick stats */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <p className="text-white/40 text-xs uppercase tracking-wider mb-4">Quick Stats</p>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-white/60 text-sm">Articles</span>
                <span className="text-cyan font-semibold">{content.articles.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/60 text-sm">Published</span>
                <span className="text-green-400 font-semibold">{publishedArticles.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/60 text-sm">Total Views</span>
                <span className="text-white font-semibold">{totalViews.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/60 text-sm">Total Likes</span>
                <span className="text-pink-400 font-semibold">{totalLikes.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/60 text-sm">Videos</span>
                <span className="text-red-400 font-semibold">{content.videos.length}</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-8 overflow-auto">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Dashboard Overview</h2>
                <p className="text-white/60">Welcome back, {user?.name}! Here's what's happening with your site.</p>
              </div>

              {/* Stats cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-cyan/10 rounded-lg flex items-center justify-center">
                      <FileText className="w-6 h-6 text-cyan" />
                    </div>
                    <span className="text-green-400 text-sm">+2 this week</span>
                  </div>
                  <p className="text-white/60 text-sm">Total Articles</p>
                  <p className="text-3xl font-bold text-white">{content.articles.length}</p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                      <Eye className="w-6 h-6 text-green-400" />
                    </div>
                    <span className="text-green-400 text-sm">+12%</span>
                  </div>
                  <p className="text-white/60 text-sm">Total Views</p>
                  <p className="text-3xl font-bold text-white">{totalViews.toLocaleString()}</p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-pink-500/10 rounded-lg flex items-center justify-center">
                      <Heart className="w-6 h-6 text-pink-400" />
                    </div>
                    <span className="text-green-400 text-sm">+8%</span>
                  </div>
                  <p className="text-white/60 text-sm">Total Likes</p>
                  <p className="text-3xl font-bold text-white">{totalLikes.toLocaleString()}</p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                      <Mail className="w-6 h-6 text-blue-400" />
                    </div>
                    <span className="text-white/40 text-sm">New</span>
                  </div>
                  <p className="text-white/60 text-sm">Subscribers</p>
                  <p className="text-3xl font-bold text-white">24</p>
                </div>
              </div>

              {/* Recent articles */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Recent Articles</h3>
                <div className="space-y-4">
                  {content.articles.slice(0, 5).map((article) => (
                    <div 
                      key={article.id} 
                      className="flex items-center justify-between py-3 border-b border-white/5 last:border-0"
                    >
                      <div>
                        <p className="text-white font-medium">{article.title}</p>
                        <p className="text-white/40 text-sm">{article.category} • {article.date}</p>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-white/40 flex items-center gap-1">
                          <Eye size={14} /> {article.views}
                        </span>
                        <span className="text-white/40 flex items-center gap-1">
                          <Heart size={14} /> {article.likes}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs ${
                          article.published 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-orange/20 text-orange'
                        }`}>
                          {article.published ? 'Published' : 'Draft'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'hero'       && <HeroEditor />}
          {activeTab === 'about'      && <AboutEditor />}
          {activeTab === 'expertise'  && <ExpertiseEditor />}
          {activeTab === 'industries' && <IndustriesEditor />}
          {activeTab === 'articles'   && <ArticlesManager />}
          {activeTab === 'videos'     && <VideoManager />}
          {activeTab === 'contact'    && <ContactEditor />}
          {activeTab === 'sections'   && <SectionsManager />}
        </main>
      </div>
    </div>
  )
}

export default AdminDashboard
