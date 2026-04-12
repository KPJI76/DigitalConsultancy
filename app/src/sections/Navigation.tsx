import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { Link } from 'react-router-dom'
import { Menu, X, Linkedin, Youtube, BookOpen, User, LogOut, Heart } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const navLinks = [
  { label: 'Home', href: '#hero' },
  { label: 'About', href: '#about' },
  { label: 'Expertise', href: '#expertise' },
  { label: 'Industries', href: '#industries' },
  { label: 'Insights', href: '#insights' },
  { label: 'Videos', href: '#videos' },
  { label: 'Contact', href: '#contact' },
]

const Navigation = () => {
  const navRef = useRef<HTMLElement>(null)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const { user, isAuthenticated, isAdmin, logout } = useAuth()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    // Initial animation
    if (navRef.current) {
      gsap.fromTo(navRef.current,
        { y: -100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, delay: 2.5, ease: 'power3.out' }
      )
    }
  }, [])

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
    setIsMobileMenuOpen(false)
  }

  return (
    <>
      <nav
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled 
            ? 'bg-navy/80 backdrop-blur-xl border-b border-white/10' 
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <a 
              href="#hero" 
              onClick={(e) => { e.preventDefault(); scrollToSection('#hero') }}
              className="flex items-center gap-3 group"
            >
              <div className="w-10 h-10 relative">
                <svg viewBox="0 0 40 40" fill="none" className="w-full h-full">
                  <path 
                    d="M20 3L35 12V28L20 37L5 28V12L20 3Z" 
                    stroke="#00D9FF" 
                    strokeWidth="1.5"
                    fill="none"
                    className="group-hover:fill-cyan/20 transition-all duration-300"
                  />
                  <circle cx="20" cy="20" r="6" fill="#00D9FF" className="group-hover:scale-110 transition-transform" />
                </svg>
              </div>
              <span className="text-white font-semibold text-lg tracking-tight">
                Enterprise<span className="text-cyan">Consult</span>
              </span>
            </a>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => { e.preventDefault(); scrollToSection(link.href) }}
                  className="nav-link underline-animate"
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Right side actions */}
            <div className="hidden lg:flex items-center gap-4">
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full glass flex items-center justify-center text-white/70 hover:text-cyan hover:border-cyan/50 transition-all"
              >
                <Linkedin size={18} />
              </a>
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full glass flex items-center justify-center text-white/70 hover:text-cyan hover:border-cyan/50 transition-all"
              >
                <Youtube size={18} />
              </a>

              {/* User menu or Login */}
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg hover:bg-white/10 transition-all"
                  >
                    <div className="w-8 h-8 rounded-full bg-cyan/20 flex items-center justify-center">
                      <User size={16} className="text-cyan" />
                    </div>
                    <span className="text-white text-sm">{user?.name}</span>
                    {user?.likedArticles && user.likedArticles.length > 0 && (
                      <span className="flex items-center gap-1 text-pink-400 text-xs">
                        <Heart size={12} className="fill-pink-400" />
                        {user.likedArticles.length}
                      </span>
                    )}
                  </button>

                  {/* Dropdown menu */}
                  {showUserMenu && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-navy border border-white/10 rounded-xl shadow-xl overflow-hidden">
                      <Link
                        to="/profile"
                        className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/5 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <User size={16} />
                        My Profile
                      </Link>
                      {isAdmin && (
                        <Link
                          to="/admin"
                          className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/5 transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <span className="w-2 h-2 rounded-full bg-cyan" />
                          Admin Dashboard
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          logout()
                          setShowUserMenu(false)
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-white hover:bg-red-500/10 hover:text-red-400 transition-colors text-left"
                      >
                        <LogOut size={16} />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="px-4 py-2 text-white/70 hover:text-white transition-colors"
                  >
                    Sign In
                  </Link>
                  <a 
                    href="#insights"
                    onClick={(e) => { e.preventDefault(); scrollToSection('#insights') }}
                    className="flex items-center gap-2 px-5 py-2.5 bg-cyan text-navy font-semibold rounded-lg hover:bg-white transition-all duration-300 hover:shadow-glow"
                  >
                    <BookOpen size={16} />
                    <span>Read Blog</span>
                  </a>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden w-10 h-10 rounded-full glass flex items-center justify-center text-white"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-all duration-500 ${
          isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        <div className="absolute inset-0 bg-navy/95 backdrop-blur-xl" onClick={() => setIsMobileMenuOpen(false)} />
        <div className="relative h-full flex flex-col items-center justify-center gap-8">
          {navLinks.map((link, index) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => { e.preventDefault(); scrollToSection(link.href) }}
              className="text-3xl font-semibold text-white hover:text-cyan transition-colors"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {link.label}
            </a>
          ))}
          
          {/* Mobile auth buttons */}
          <div className="flex flex-col items-center gap-4 mt-8">
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-3 text-white">
                  <div className="w-10 h-10 rounded-full bg-cyan/20 flex items-center justify-center">
                    <User size={20} className="text-cyan" />
                  </div>
                  <span>{user?.name}</span>
                </div>
                <Link
                  to="/profile"
                  className="px-6 py-3 border border-white/20 text-white rounded-lg"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  My Profile
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="px-6 py-3 bg-cyan text-navy font-semibold rounded-lg"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={() => {
                    logout()
                    setIsMobileMenuOpen(false)
                  }}
                  className="flex items-center gap-2 text-red-400"
                >
                  <LogOut size={18} />
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-6 py-3 border border-white/20 text-white rounded-lg"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="px-6 py-3 bg-cyan text-navy font-semibold rounded-lg"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Create Account
                </Link>
              </>
            )}
          </div>

          <div className="flex items-center gap-6 mt-8">
            <a 
              href="https://linkedin.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full glass flex items-center justify-center text-white hover:text-cyan transition-colors"
            >
              <Linkedin size={24} />
            </a>
            <a 
              href="https://youtube.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full glass flex items-center justify-center text-white hover:text-cyan transition-colors"
            >
              <Youtube size={24} />
            </a>
          </div>
        </div>
      </div>
    </>
  )
}

export default Navigation
