import { Linkedin, Youtube, Mail, ArrowUp, Heart } from 'lucide-react'
import { useContent } from '@/contexts/ContentContext'

const Footer = () => {
  const { content } = useContent()
  const { visibleSections, branding, contact } = content

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })
  const scrollToSection = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }

  // Navigation column — mirrors top nav, respects visibility
  const navLinks = [
    { label: branding.navLinks.home,       href: '#hero',       show: visibleSections.hero },
    { label: branding.navLinks.about,      href: '#about',      show: visibleSections.about },
    { label: branding.navLinks.expertise,  href: '#expertise',  show: visibleSections.expertise },
    { label: branding.navLinks.industries, href: '#industries', show: visibleSections.industries },
    { label: branding.navLinks.insights,   href: '#insights',   show: visibleSections.insights },
    { label: branding.navLinks.videos,     href: '#videos',     show: visibleSections.videos },
    { label: branding.navLinks.contact,    href: '#contact',    show: visibleSections.contact },
  ].filter(l => l.show)

  // Services — filter out links pointing to hidden sections
  const services = [
    { label: 'SAP Consulting',        href: '#expertise',  show: visibleSections.expertise },
    { label: 'Salesforce FSL',        href: '#expertise',  show: visibleSections.expertise },
    { label: 'AI Integration',        href: '#expertise',  show: visibleSections.expertise },
    { label: 'Digital Transformation',href: '#industries', show: visibleSections.industries },
  ].filter(l => l.show)

  // Resources — filter out links pointing to hidden sections
  const resources = [
    { label: 'Blog Articles',    href: '#insights',   show: visibleSections.insights },
    { label: 'Case Studies',     href: '#industries', show: visibleSections.industries },
    { label: 'White Papers',     href: '#insights',   show: visibleSections.insights },
    { label: 'Training Materials',href: '#insights',  show: visibleSections.insights },
  ].filter(l => l.show)

  return (
    <footer className="relative bg-navy border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12">

          {/* Brand Column */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1 mb-8 lg:mb-0">
            <a href="#hero" onClick={(e) => { e.preventDefault(); scrollToSection('#hero') }} className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 relative">
                <svg viewBox="0 0 40 40" fill="none" className="w-full h-full">
                  <path d="M20 3L35 12V28L20 37L5 28V12L20 3Z" stroke="#00D9FF" strokeWidth="1.5" fill="none" />
                  <circle cx="20" cy="20" r="6" fill="#00D9FF" />
                </svg>
              </div>
              <span className="text-white font-semibold text-lg">
                {branding.siteNamePrimary}<span className="text-cyan">{branding.siteNameAccent}</span>
              </span>
            </a>
            <p className="text-white/50 text-sm leading-relaxed mb-6">
              Transforming enterprises through AI and service excellence.
              25+ years of SAP &amp; Salesforce expertise.
            </p>
            <div className="flex items-center gap-3">
              <a href={contact.linkedin} target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-white/50 hover:text-cyan hover:bg-cyan/10 transition-all">
                <Linkedin size={18} />
              </a>
              <a href={contact.youtube} target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-white/50 hover:text-cyan hover:bg-cyan/10 transition-all">
                <Youtube size={18} />
              </a>
              <a href={`mailto:${contact.email}`}
                className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-white/50 hover:text-cyan hover:bg-cyan/10 transition-all">
                <Mail size={18} />
              </a>
            </div>
          </div>

          {/* Navigation */}
          {navLinks.length > 0 && (
            <div>
              <h4 className="text-white font-semibold mb-4">Navigation</h4>
              <ul className="space-y-3">
                {navLinks.map((link) => (
                  <li key={link.href + link.label}>
                    <a href={link.href} onClick={(e) => { e.preventDefault(); scrollToSection(link.href) }}
                      className="text-white/50 text-sm hover:text-cyan transition-colors">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Services */}
          {services.length > 0 && (
            <div>
              <h4 className="text-white font-semibold mb-4">Services</h4>
              <ul className="space-y-3">
                {services.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} onClick={(e) => { e.preventDefault(); scrollToSection(link.href) }}
                      className="text-white/50 text-sm hover:text-cyan transition-colors">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Resources */}
          {resources.length > 0 && (
            <div>
              <h4 className="text-white font-semibold mb-4">Resources</h4>
              <ul className="space-y-3">
                {resources.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} onClick={(e) => { e.preventDefault(); scrollToSection(link.href) }}
                      className="text-white/50 text-sm hover:text-cyan transition-colors">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/40 text-sm flex items-center gap-1">
              © 2026 {branding.siteNamePrimary}{branding.siteNameAccent}. Made with <Heart size={14} className="text-cyan fill-cyan" /> for enterprise excellence.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-white/40 text-sm hover:text-cyan transition-colors">Privacy Policy</a>
              <a href="#" className="text-white/40 text-sm hover:text-cyan transition-colors">Terms of Service</a>
              <button onClick={scrollToTop}
                className="w-10 h-10 rounded-full bg-cyan/10 flex items-center justify-center text-cyan hover:bg-cyan hover:text-navy transition-all">
                <ArrowUp size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
