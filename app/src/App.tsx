import { useEffect, useRef, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from '@studio-freight/lenis'

import { AuthProvider } from './contexts/AuthContext'
import { ContentProvider, useContent } from './contexts/ContentContext'
import ProtectedRoute from './components/ProtectedRoute'

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
import AdminDashboard from './pages/admin/AdminDashboard'

import './App.css'

gsap.registerPlugin(ScrollTrigger)

// Main content wrapper that uses content context
const MainContent = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [isReady, setIsReady] = useState(false)
  const mainRef = useRef<HTMLDivElement>(null)
  const lenisRef = useRef<Lenis | null>(null)
  const { previewMode } = useContent()

  useEffect(() => {
    // Initialize Lenis smooth scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    })

    lenisRef.current = lenis

    // Connect Lenis to GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update)

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000)
    })

    gsap.ticker.lagSmoothing(0)

    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false)
      setTimeout(() => setIsReady(true), 500)
    }, 2000)

    return () => {
      clearTimeout(timer)
      lenis.destroy()
      ScrollTrigger.getAll().forEach(st => st.kill())
    }
  }, [])

  useEffect(() => {
    if (!isReady) return

    // Refresh ScrollTrigger after content loads
    ScrollTrigger.refresh()

    // Setup reveal animations
    const revealElements = document.querySelectorAll('.reveal-up')
    
    revealElements.forEach((el) => {
      gsap.fromTo(el,
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
          }
        }
      )
    })
  }, [isReady])

  // If in preview mode, show admin bar
  const PreviewBar = () => (
    <div className="fixed top-0 left-0 right-0 z-[100] bg-cyan text-navy px-4 py-2 flex items-center justify-between">
      <span className="font-semibold text-sm">Preview Mode - Showing unsaved changes</span>
      <button 
        onClick={() => window.location.href = '/admin'}
        className="text-sm font-medium hover:underline"
      >
        Return to Admin →
      </button>
    </div>
  )

  return (
    <>
      <CustomCursor />
      
      {isLoading && <LoadingScreen />}
      
      {previewMode && <PreviewBar />}
      
      <div 
        ref={mainRef}
        className={`relative min-h-screen transition-opacity duration-500 ${isReady ? 'opacity-100' : 'opacity-0'} ${previewMode ? 'pt-10' : ''}`}
      >
        <Navigation />
        
        <main className="relative">
          <Hero />
          <About />
          <Expertise />
          <Industries />
          <Insights />
          <Videos />
          <Contact />
        </main>
        
        <Footer />
      </div>
    </>
  )
}

// Router wrapper to handle location changes
const RouterContent = () => {
  const location = useLocation()
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup'
  const isAdminPage = location.pathname.startsWith('/admin')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  void isAuthPage
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  void isAdminPage

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
    </Routes>
  )
}

function App() {
  return (
    <AuthProvider>
      <ContentProvider>
        <Router>
          <RouterContent />
        </Router>
      </ContentProvider>
    </AuthProvider>
  )
}

export default App
