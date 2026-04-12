import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { Award, Briefcase, Users, TrendingUp } from 'lucide-react'
import { useContent } from '../contexts/ContentContext'

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  'Briefcase': Briefcase,
  'Award': Award,
  'Users': Users,
  'TrendingUp': TrendingUp,
}

const About = () => {
  const sectionRef = useRef<HTMLElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const { content } = useContent()
  const { about } = content

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Image reveal animation with mask
      if (imageRef.current) {
        gsap.fromTo(imageRef.current,
          { 
            clipPath: 'circle(0% at 50% 50%)',
            opacity: 0 
          },
          {
            clipPath: 'circle(75% at 50% 50%)',
            opacity: 1,
            duration: 1.5,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 70%',
              toggleActions: 'play none none reverse',
            }
          }
        )
      }

      // Content slide up
      const revealItems = contentRef.current?.querySelectorAll('.reveal-item')
      if (revealItems && revealItems.length > 0) {
        gsap.fromTo(revealItems,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: contentRef.current,
              start: 'top 75%',
              toggleActions: 'play none none reverse',
            }
          }
        )
      }

      // Stats counter animation
      const statItems = statsRef.current?.querySelectorAll('.stat-item')
      if (statItems) {
        statItems.forEach((item, index) => {
          const valueEl = item.querySelector('.stat-value')
          const targetValue = parseInt(about.stats[index]?.value || '0')
          
          gsap.fromTo(item,
            { y: 30, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.6,
              delay: index * 0.1,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: statsRef.current,
                start: 'top 85%',
                toggleActions: 'play none none reverse',
              }
            }
          )

          // Counter animation
          if (valueEl) {
            gsap.fromTo({ val: 0 },
              { val: 0 },
              {
                val: targetValue,
                duration: 2,
                delay: 0.5 + index * 0.1,
                ease: 'power2.out',
                scrollTrigger: {
                  trigger: statsRef.current,
                  start: 'top 85%',
                  toggleActions: 'play none none reverse',
                },
                onUpdate: function() {
                  const val = Math.round(this.targets()[0].val)
                  valueEl.textContent = val + (about.stats[index]?.value?.includes('+') ? '+' : '')
                }
              }
            )
          }
        })
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [about])

  return (
    <section 
      id="about" 
      ref={sectionRef}
      className="relative py-24 lg:py-32 bg-off-white"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image Column */}
          <div ref={imageRef} className="relative">
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden">
              {/* Abstract geometric background */}
              <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy/90 to-cyan/20" />
              
              {/* Decorative elements */}
              <div className="absolute top-10 left-10 w-20 h-20 border-2 border-cyan/30 rounded-lg rotate-12" />
              <div className="absolute bottom-20 right-10 w-32 h-32 border border-cyan/20 rounded-full" />
              <div className="absolute top-1/3 right-5 w-3 h-3 bg-cyan rounded-full animate-pulse" />
              <div className="absolute bottom-1/3 left-8 w-2 h-2 bg-cyan/60 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
              
              {/* Content overlay */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
                <div className="w-32 h-32 mb-6 relative">
                  <svg viewBox="0 0 120 120" fill="none" className="w-full h-full">
                    <path 
                      d="M60 10L105 35V85L60 110L15 85V35L60 10Z" 
                      stroke="#00D9FF" 
                      strokeWidth="2"
                      fill="none"
                      className="animate-pulse-glow"
                    />
                    <circle cx="60" cy="60" r="25" fill="rgba(0, 217, 255, 0.1)" stroke="#00D9FF" strokeWidth="1.5" />
                    <text x="60" y="68" textAnchor="middle" fill="#00D9FF" fontSize="28" fontWeight="bold">25+</text>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white text-center mb-2">Years of</h3>
                <h3 className="text-2xl font-bold text-cyan text-center">Excellence</h3>
              </div>
            </div>
            
            {/* Floating badge */}
            <div className="absolute -bottom-6 -right-6 lg:right-10 bg-white rounded-xl shadow-xl p-4 flex items-center gap-3">
              <div className="w-12 h-12 bg-cyan/10 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-cyan" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Certified Expert</p>
                <p className="font-semibold text-navy">SAP & Salesforce</p>
              </div>
            </div>
          </div>

          {/* Content Column */}
          <div ref={contentRef} className="lg:pl-8">
            <div className="reveal-item">
              <span className="inline-block px-4 py-1.5 bg-cyan/10 text-cyan text-sm font-medium rounded-full mb-6">
                About Me
              </span>
            </div>
            
            <h2 
              className="reveal-item text-3xl sm:text-4xl lg:text-5xl font-bold text-navy mb-6 leading-tight"
              dangerouslySetInnerHTML={{ __html: about.title }}
            />
            
            <div className="reveal-item space-y-4 text-gray-600 text-lg leading-relaxed mb-8">
              {about.description.map((paragraph, index) => (
                <p key={index} dangerouslySetInnerHTML={{ __html: paragraph }} />
              ))}
            </div>

            {/* Key expertise tags */}
            <div className="reveal-item flex flex-wrap gap-2 mb-10">
              {['SAP PM', 'Salesforce FSL', 'Service Cloud', 'AI Integration', 'Supply Chain', 'Field Service'].map((tag) => (
                <span 
                  key={tag}
                  className="px-4 py-2 bg-navy/5 text-navy text-sm font-medium rounded-lg hover:bg-cyan/10 hover:text-cyan transition-colors cursor-default"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div 
          ref={statsRef}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-20"
        >
          {about.stats.map((stat, index) => {
            const Icon = iconMap[Object.keys(iconMap)[index]] || Briefcase
            return (
              <div 
                key={index}
                className="stat-item group p-6 bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100"
              >
                <div className="w-12 h-12 bg-cyan/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-cyan group-hover:scale-110 transition-all duration-300">
                  <Icon className="w-6 h-6 text-cyan group-hover:text-white transition-colors" />
                </div>
                <p className="stat-value text-4xl font-bold text-navy mb-1 stat-number">0</p>
                <p className="text-gray-500 text-sm">{stat.label}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default About
