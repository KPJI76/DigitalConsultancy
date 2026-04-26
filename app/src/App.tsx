import { useEffect, useRef, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import { AuthProvider } from './contexts/AuthContext'
import { ContentProvider, useContent } from './contexts/ContentContext'
import ProtectedRoute from './components/ProtectedRoute'
import { useSmoothScroll } from './hooks/use-animation'

import Navigation from './sections/Navigation'
import Hero from './sections/Hero'
import About from './sections/About'
import Expertise from './sections/Expertise'
import Industries from './sections/Industries'
import Insights from './sections/Insights'
import Videos from './sections/Videos'
import Contact from './sections/Contact'
import Footer from './sections/Footer'
import LoadingScreen from './sections/LoadingScreen'
import CustomCursor from './components/CustomCursor'

import Login from './pages/Login'
import Signup from './pages/Signup'
import Profile from './pages/Profile'
import Article from './pages/Article'
import Blog from './pages/Blog'
import AdminDashboard from './pages/admin/AdminDashboard'

import './App.css'

gsap.registerPlugin(ScrollTrigger)

const MainContent = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [isReady, setIsReady] = useState(false)
  const mainRef = useRef<HTMLDivElement>(null)
  const { previewMode, content } = useContent()

  useSmoothScroll()

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
      setTimeout(() => setIsReady(true), 500)
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!isReady) return
    ScrollTrigger.refresh()
    document.querySelectorAll('.reveal-up').forEach((el) => {
      gsap.fromTo(
        el,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      )
    })
  }, [isReady])

  return (
    <>
      <CustomCursor />

      {isLoading && <LoadingScreen />}

      {previewMode && (
        <div className="fixed top-0 left-0 right-0 z-[100] bg-cyan text-navy px-4 py-2 flex items-center justify-between">
          <span className="font-semibold text-sm">Preview Mode — Showing unsaved changes</span>
          <button
            onClick={() => { window.location.href = '/admin' }}
            className="text-sm font-medium hover:underline"
          >
            Return to Admin →
          </button>
        </div>
      )}

      <div
        ref={mainRef}
        className={`relative min-h-screen transition-opacity duration-500 ${isReady ? 'opacity-100' : 'opacity-0'} ${previewMode ? 'pt-10' : ''}`}
      >
        <Navigation />
        <main className="relative">
          {content.visibleSections.hero       && <Hero />}
          {content.visibleSections.about      && <About />}
          {content.visibleSections.expertise  && <Expertise />}
          {content.visibleSections.industries && <Industries />}
          {content.visibleSections.insights   && <Insights />}
          {content.visibleSections.videos     && <Videos />}
          {content.visibleSections.contact    && <Contact />}
        </main>
        <Footer />
      </div>
    </>
  )
}

const RouterContent = () => {
  // Suppress unused variable warnings — location used for future route-specific logic
  const _location = useLocation()
  void _location

  return (
    <Routes>
      <Route path="/" element={<MainContent />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute requireAdmin>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route path="/article/:slug" element={<Article />} />
      <Route path="/blog" element={<Blog />} />
    </Routes>
  )
}

function App() {
  return (
    <AuthProvider>
      <ContentProvider>
        <Router basename={import.meta.env.BASE_URL}>
          <RouterContent />
        </Router>
      </ContentProvider>
    </AuthProvider>
  )
}

export default App
