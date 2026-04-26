import { useState } from 'react'
import { useContent } from '@/contexts/ContentContext'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Save } from 'lucide-react'
import type { SiteContent } from '@/types/content'

const NAV_LABELS: { key: keyof SiteContent['branding']['navLinks']; label: string }[] = [
  { key: 'home',       label: 'Home' },
  { key: 'about',      label: 'About' },
  { key: 'expertise',  label: 'Expertise' },
  { key: 'industries', label: 'Industries' },
  { key: 'insights',   label: 'Insights' },
  { key: 'videos',     label: 'Videos' },
  { key: 'contact',    label: 'Contact' },
]

const BrandingEditor = () => {
  const { content, updateBranding } = useContent()
  const [form, setForm] = useState(content.branding)
  const [saved, setSaved] = useState(false)

  const set = (field: keyof typeof form, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
    setSaved(false)
  }

  const setNavLabel = (key: keyof SiteContent['branding']['navLinks'], value: string) => {
    setForm(prev => ({ ...prev, navLinks: { ...prev.navLinks, [key]: value } }))
    setSaved(false)
  }

  const handleSave = () => {
    updateBranding(form)
    setSaved(true)
  }

  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">Branding & Navigation</h2>
        <p className="text-white/50 text-sm">Edit site name, tagline and nav link labels.</p>
      </div>

      {/* Site identity */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-4">
        <h3 className="text-white font-semibold">Site Identity</h3>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-white/80">Name (primary)</Label>
            <Input
              value={form.siteNamePrimary}
              onChange={e => set('siteNamePrimary', e.target.value)}
              placeholder="Enterprise"
              className="bg-white/5 border-white/10 text-white focus:border-cyan"
            />
            <p className="text-white/30 text-xs">Shown in white</p>
          </div>
          <div className="space-y-2">
            <Label className="text-white/80">Name (accent)</Label>
            <Input
              value={form.siteNameAccent}
              onChange={e => set('siteNameAccent', e.target.value)}
              placeholder="Consult"
              className="bg-white/5 border-white/10 text-white focus:border-cyan"
            />
            <p className="text-white/30 text-xs">Shown in cyan</p>
          </div>
        </div>

        <div className="p-3 bg-navy rounded-lg text-center">
          <span className="text-white font-semibold">{form.siteNamePrimary}</span>
          <span className="text-cyan font-semibold">{form.siteNameAccent}</span>
          <span className="text-white/30 text-xs ml-2">← live preview</span>
        </div>

        <div className="space-y-2">
          <Label className="text-white/80">Admin Dashboard Tagline</Label>
          <Input
            value={form.siteTagline}
            onChange={e => set('siteTagline', e.target.value)}
            placeholder="Enterprise Consulting Platform"
            className="bg-white/5 border-white/10 text-white focus:border-cyan"
          />
        </div>
      </div>

      {/* Nav link labels */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-4">
        <h3 className="text-white font-semibold">Navigation Link Labels</h3>
        <p className="text-white/40 text-xs">Rename any nav item. Hidden sections are automatically removed from the nav.</p>
        <div className="grid grid-cols-2 gap-3">
          {NAV_LABELS.map(({ key, label }) => (
            <div key={key} className="space-y-1">
              <Label className="text-white/50 text-xs">{label}</Label>
              <Input
                value={form.navLinks[key]}
                onChange={e => setNavLabel(key, e.target.value)}
                className="bg-white/5 border-white/10 text-white text-sm focus:border-cyan"
              />
            </div>
          ))}
        </div>
      </div>

      <Button onClick={handleSave} className="bg-cyan text-navy hover:bg-white w-full">
        <Save size={16} className="mr-2" />
        {saved ? 'Saved!' : 'Save Branding'}
      </Button>
    </div>
  )
}

export default BrandingEditor
