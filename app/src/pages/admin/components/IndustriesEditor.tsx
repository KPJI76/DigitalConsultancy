import { useState } from 'react'
import { useContent } from '@/contexts/ContentContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Save } from 'lucide-react'

const IndustriesEditor = () => {
  const { content, updateIndustries, updateIndustryItem } = useContent()
  const [saved, setSaved] = useState(false)

  const handleHeader = (field: 'title' | 'subtitle', value: string) => {
    updateIndustries({ [field]: value })
    setSaved(false)
  }

  const handleItem = (index: number, field: string, value: string) => {
    updateIndustryItem(index, { [field]: value })
    setSaved(false)
  }

  const handleSave = () => setSaved(true)

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">Industries Section</h2>
        <p className="text-white/50 text-sm">Edit the section heading and each industry card.</p>
      </div>

      {/* Section header */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-4">
        <h3 className="text-white font-semibold">Section Heading</h3>
        <div className="space-y-2">
          <Label className="text-white/80">Title</Label>
          <Input
            value={content.industries.title}
            onChange={e => handleHeader('title', e.target.value)}
            className="bg-white/5 border-white/10 text-white focus:border-cyan"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-white/80">Subtitle</Label>
          <Textarea
            value={content.industries.subtitle}
            onChange={e => handleHeader('subtitle', e.target.value)}
            rows={2}
            className="bg-white/5 border-white/10 text-white focus:border-cyan resize-none"
          />
        </div>
      </div>

      {/* Industry cards */}
      {content.industries.items.map((item, index) => (
        <div key={index} className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-4">
          <h3 className="text-cyan font-semibold">Card {index + 1}: {item.title}</h3>
          <div className="space-y-2">
            <Label className="text-white/80">Industry Name</Label>
            <Input
              value={item.title}
              onChange={e => handleItem(index, 'title', e.target.value)}
              className="bg-white/5 border-white/10 text-white focus:border-cyan"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-white/80">Description</Label>
            <Textarea
              value={item.description}
              onChange={e => handleItem(index, 'description', e.target.value)}
              rows={3}
              className="bg-white/5 border-white/10 text-white focus:border-cyan resize-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-white/80">Projects (e.g. 25+)</Label>
              <Input
                value={item.projects}
                onChange={e => handleItem(index, 'projects', e.target.value)}
                className="bg-white/5 border-white/10 text-white focus:border-cyan"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white/80">Experience (e.g. 11 Years)</Label>
              <Input
                value={item.experience}
                onChange={e => handleItem(index, 'experience', e.target.value)}
                className="bg-white/5 border-white/10 text-white focus:border-cyan"
              />
            </div>
          </div>
        </div>
      ))}

      <Button onClick={handleSave} className="bg-cyan text-navy hover:bg-white w-full">
        <Save size={16} className="mr-2" />
        {saved ? 'Saved!' : 'Save Industries'}
      </Button>
    </div>
  )
}

export default IndustriesEditor
