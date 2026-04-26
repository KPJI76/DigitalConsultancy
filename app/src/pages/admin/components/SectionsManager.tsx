import { useContent } from '@/contexts/ContentContext'
import type { SiteContent } from '@/types/content'
import {
  Sparkles, Users, BarChart3, Factory, BookOpen, Youtube, Mail
} from 'lucide-react'

type SectionKey = keyof SiteContent['visibleSections']

const SECTIONS: { key: SectionKey; label: string; description: string; icon: React.ComponentType<{ size?: number; className?: string }> }[] = [
  { key: 'hero',       label: 'Hero',       description: 'Full-screen intro with WebGL animation and headline',  icon: Sparkles  },
  { key: 'about',      label: 'About',      description: 'Your background, story and key statistics',            icon: Users     },
  { key: 'expertise',  label: 'Expertise',  description: 'SAP, Salesforce and AI capability cards',              icon: BarChart3 },
  { key: 'industries', label: 'Industries', description: 'Wind Energy, Manufacturing, Supply Chain, Utilities',  icon: Factory   },
  { key: 'insights',   label: 'Insights',   description: 'Published blog articles and thought leadership',        icon: BookOpen  },
  { key: 'videos',     label: 'Videos',     description: 'YouTube video gallery',                                icon: Youtube   },
  { key: 'contact',    label: 'Contact',    description: 'Contact form, email, phone and social links',           icon: Mail      },
]

const SectionsManager = () => {
  const { content, toggleSectionVisibility } = useContent()

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">Section Visibility</h2>
        <p className="text-white/50 text-sm">Toggle sections on or off. Hidden sections are invisible to visitors. Changes save automatically.</p>
      </div>

      <div className="space-y-3">
        {SECTIONS.map(({ key, label, description, icon: Icon }) => {
          const isVisible = content.visibleSections[key]
          return (
            <div
              key={key}
              className={`flex items-center justify-between p-5 rounded-xl border transition-all ${
                isVisible
                  ? 'bg-white/5 border-white/10'
                  : 'bg-white/[0.02] border-white/5 opacity-60'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  isVisible ? 'bg-cyan/10' : 'bg-white/5'
                }`}>
                  <Icon size={18} className={isVisible ? 'text-cyan' : 'text-white/30'} />
                </div>
                <div>
                  <p className="text-white font-medium">{label}</p>
                  <p className="text-white/40 text-sm">{description}</p>
                </div>
              </div>

              {/* Toggle switch */}
              <button
                onClick={() => toggleSectionVisibility(key)}
                className={`relative w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none ${
                  isVisible ? 'bg-cyan' : 'bg-white/20'
                }`}
                aria-label={`${isVisible ? 'Hide' : 'Show'} ${label} section`}
              >
                <span
                  className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${
                    isVisible ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          )
        })}
      </div>

      <p className="text-white/30 text-xs text-center">
        {Object.values(content.visibleSections).filter(Boolean).length} of {SECTIONS.length} sections visible
      </p>
    </div>
  )
}

export default SectionsManager
