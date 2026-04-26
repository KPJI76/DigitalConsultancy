import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { Settings, Cloud, Brain, CheckCircle } from 'lucide-react'
import { useContent } from '../contexts/ContentContext'

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  'Settings': Settings,
  'Cloud': Cloud,
  'Brain': Brain,
}

const colorMap: Record<number, string> = {
  0: 'from-blue-500/20 to-cyan/20 border-blue-500/30',
  1: 'from-cyan/20 to-teal/20 border-cyan/30',
  2: 'from-purple-500/20 to-cyan/20 border-purple-500/30',
}

const Expertise = () => {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const cardsContainerRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)
  const { content } = useContent()
  const { expertise } = content

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

      // Cards stagger animation
      const cards = cardsRef.current?.querySelectorAll('.expertise-card')
      if (cards) {
        cards.forEach((card, index) => {
          gsap.fromTo(card,
            { y: 60, opacity: 0, rotateX: 15 },
            {
              y: 0,
              opacity: 1,
              rotateX: 0,
              duration: 0.8,
              delay: index * 0.15,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: cardsContainerRef.current,
                start: 'top 75%',
                toggleActions: 'play none none reverse',
              }
            }
          )
        })
      }

      // Background grid animation
      const gridLines = sectionRef.current?.querySelectorAll('.grid-line')
      if (gridLines && gridLines.length > 0) {
        gsap.fromTo(gridLines,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 1.5,
            stagger: 0.1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            }
          }
        )
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section 
      id="expertise" 
      ref={sectionRef}
      className="relative py-24 lg:py-32 bg-navy overflow-hidden"
    >
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-20">
        {[...Array(8)].map((_, i) => (
          <div 
            key={`h-${i}`}
            className="grid-line absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan/50 to-transparent"
            style={{ top: `${(i + 1) * 12}%` }}
          />
        ))}
        {[...Array(12)].map((_, i) => (
          <div 
            key={`v-${i}`}
            className="grid-line absolute top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-cyan/30 to-transparent"
            style={{ left: `${(i + 1) * 8}%` }}
          />
        ))}
      </div>

      {/* Glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px]" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-16 lg:mb-20">
          <span className="reveal-item inline-block px-4 py-1.5 bg-cyan/10 text-cyan text-sm font-medium rounded-full mb-6">
            Core Competencies
          </span>
          <h2 className="reveal-item text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            {expertise.title.split(' ').map((word, i, arr) => (
              <span key={i}>
                {word}{' '}
                {i === arr.length - 2 && <span className="text-cyan">{arr[arr.length - 1]}</span>}
              </span>
            ))}
          </h2>
          <p className="reveal-item text-lg text-white/60 max-w-2xl mx-auto">
            {expertise.subtitle}
          </p>
        </div>

        {/* Cards */}
        <div ref={cardsContainerRef} className="relative">
          <div 
            ref={cardsRef}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
          >
            {expertise.areas.map((area, index) => {
              const Icon = iconMap[Object.keys(iconMap)[index] ?? ''] ?? Settings
              const colorClass = colorMap[index] ?? colorMap[0] ?? 'from-cyan/20 to-cyan/5'
              
              return (
                <div
                  key={index}
                  className={`expertise-card group relative p-8 rounded-2xl bg-gradient-to-br ${colorClass} backdrop-blur-sm border hover:border-cyan/50 transition-all duration-500 card-lift`}
                  style={{ perspective: '1000px' }}
                >
                  {/* Icon */}
                  <div className="relative mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center group-hover:bg-cyan/20 group-hover:scale-110 transition-all duration-300">
                      <Icon className="w-8 h-8 text-cyan" />
                    </div>
                    {/* Decorative ring */}
                    <div className="absolute inset-0 w-16 h-16 rounded-2xl border border-cyan/30 scale-150 opacity-0 group-hover:scale-125 group-hover:opacity-100 transition-all duration-500" />
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {area.title}
                  </h3>
                  <p className="text-cyan text-sm font-medium mb-4">
                    {area.subtitle}
                  </p>
                  <p className="text-white/60 mb-6 leading-relaxed">
                    {area.description}
                  </p>

                  {/* Features List */}
                  <ul className="space-y-3 mb-8">
                    {area.features.map((feature, fIndex) => (
                      <li 
                        key={fIndex}
                        className="flex items-start gap-3 text-white/70 text-sm"
                      >
                        <CheckCircle className="w-4 h-4 text-cyan mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Hover glow */}
                  <div className="absolute inset-0 rounded-2xl bg-cyan/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                </div>
              )
            })}
          </div>
        </div>

      </div>
    </section>
  )
}

export default Expertise
