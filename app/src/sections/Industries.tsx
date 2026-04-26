import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { Wind, Factory, Truck, Zap, ArrowUpRight } from 'lucide-react'
import { useContent } from '@/contexts/ContentContext'

const CARD_META = [
  { icon: Wind,    color: 'from-cyan/30 to-blue-500/30',      size: 'large'  },
  { icon: Factory, color: 'from-orange/30 to-red-500/30',     size: 'medium' },
  { icon: Truck,   color: 'from-green-500/30 to-emerald/30',  size: 'medium' },
  { icon: Zap,     color: 'from-yellow-500/30 to-orange/30',  size: 'large'  },
]

const Industries = () => {
  const { content } = useContent()
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

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

      // Grid items animation
      const gridItems = gridRef.current?.querySelectorAll('.industry-card')
      if (gridItems) {
        gridItems.forEach((item, index) => {
          gsap.fromTo(item,
            { y: 50, opacity: 0, scale: 0.95 },
            {
              y: 0,
              opacity: 1,
              scale: 1,
              duration: 0.7,
              delay: index * 0.1,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: gridRef.current,
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

  return (
    <section 
      id="industries" 
      ref={sectionRef}
      className="relative py-24 lg:py-32 bg-off-white overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-cyan/5 to-transparent" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-navy/5 rounded-full blur-[100px]" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-16">
          <span className="reveal-item inline-block px-4 py-1.5 bg-navy/10 text-navy text-sm font-medium rounded-full mb-6">
            Industry Focus
          </span>
          <h2 className="reveal-item text-3xl sm:text-4xl lg:text-5xl font-bold text-navy mb-6">
            {content.industries.title}
          </h2>
          <p className="reveal-item text-lg text-gray-600 max-w-2xl mx-auto">
            {content.industries.subtitle}
          </p>
        </div>

        {/* Bento Grid */}
        <div 
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-[280px]"
        >
          {content.industries.items.map((industry, index) => {
            const meta = CARD_META[index] ?? CARD_META[0]
            const Icon = meta!.icon
            return (
              <div
                key={index}
                className={`industry-card group relative rounded-2xl overflow-hidden cursor-pointer ${
                  meta!.size === 'large' ? 'md:col-span-2' : ''
                }`}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${meta!.color} opacity-60 group-hover:opacity-80 transition-opacity duration-500`} />
                <div className="absolute inset-0 bg-navy/80 group-hover:bg-navy/70 transition-colors duration-500" />
                <div className="relative h-full p-8 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-14 h-14 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-cyan/20 group-hover:scale-110 transition-all duration-300">
                        <Icon className="w-7 h-7 text-cyan" />
                      </div>
                      <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <ArrowUpRight className="w-5 h-5 text-cyan" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-cyan transition-colors">
                      {industry.title}
                    </h3>
                    <p className="text-white/60 text-sm leading-relaxed group-hover:text-white/80 transition-colors">
                      {industry.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-6 pt-4 border-t border-white/10">
                    <div>
                      <p className="text-2xl font-bold text-cyan">{industry.projects}</p>
                      <p className="text-white/40 text-xs">Projects</p>
                    </div>
                    <div className="w-px h-10 bg-white/10" />
                    <div>
                      <p className="text-2xl font-bold text-white">{industry.experience}</p>
                      <p className="text-white/40 text-xs">Experience</p>
                    </div>
                  </div>
                </div>
                <div className={`absolute inset-0 bg-cyan/10 transition-opacity duration-500 ${hoveredIndex === index ? 'opacity-100' : 'opacity-0'}`} />
              </div>
            )
          })}
        </div>

        {/* Industry logos or trust indicators */}
        <div className="mt-16 pt-12 border-t border-gray-200">
          <p className="text-center text-gray-500 text-sm mb-8">
            Trusted by leading organizations across these industries
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 lg:gap-16 opacity-50">
            {['Global Wind Energy Co.', 'TechManufacturing Inc.', 'LogiChain Solutions', 'PowerGrid Utilities'].map((company, index) => (
              <div 
                key={index}
                className="text-navy/40 font-semibold text-lg hover:text-navy/70 transition-colors cursor-default"
              >
                {company}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Industries
