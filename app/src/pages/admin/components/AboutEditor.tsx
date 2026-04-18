import { useContent } from '../../../contexts/ContentContext'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Plus, Trash2 } from 'lucide-react'

const AboutEditor = () => {
  const { content, updateAbout } = useContent()
  const { about } = content

  const addDescription = () => {
    updateAbout({ description: [...about.description, ''] })
  }

  const updateDescription = (index: number, value: string) => {
    const newDescription = [...about.description]
    newDescription[index] = value
    updateAbout({ description: newDescription })
  }

  const removeDescription = (index: number) => {
    const newDescription = about.description.filter((_, i) => i !== index)
    updateAbout({ description: newDescription })
  }

  const updateStat = (index: number, field: 'value' | 'label', value: string) => {
    const newStats = [...about.stats]
    const stat = newStats[index]
    if (!stat) return
    newStats[index] = { ...stat, [field]: value }
    updateAbout({ stats: newStats as typeof about.stats })
  }

  const addStat = () => {
    updateAbout({ stats: [...about.stats, { value: '0', label: 'New Stat' }] })
  }

  const removeStat = (index: number) => {
    const newStats = about.stats.filter((_, i) => i !== index)
    updateAbout({ stats: newStats })
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">About Section Editor</h2>
        <p className="text-white/60">Edit your bio, experience, and statistics.</p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-6">
        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="title" className="text-white/80">Section Title</Label>
          <Input
            id="title"
            value={about.title}
            onChange={(e) => updateAbout({ title: e.target.value })}
            placeholder="e.g., The Architect Behind The Systems"
            className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-cyan"
          />
        </div>

        {/* Description Paragraphs */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-white/80">Description Paragraphs</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addDescription}
              className="border-cyan text-cyan hover:bg-cyan hover:text-navy"
            >
              <Plus size={16} className="mr-1" />
              Add Paragraph
            </Button>
          </div>
          
          {about.description.map((paragraph, index) => (
            <div key={index} className="flex items-start gap-3">
              <Textarea
                value={paragraph}
                onChange={(e) => updateDescription(index, e.target.value)}
                placeholder={`Paragraph ${index + 1}`}
                rows={3}
                className="flex-1 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-cyan"
              />
              <button
                onClick={() => removeDescription(index)}
                className="mt-2 w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-400 hover:bg-red-500/20"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-white/80">Statistics</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addStat}
              className="border-cyan text-cyan hover:bg-cyan hover:text-navy"
            >
              <Plus size={16} className="mr-1" />
              Add Stat
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {about.stats.map((stat, index) => (
              <div key={index} className="flex items-center gap-3 bg-white/5 rounded-lg p-4">
                <div className="flex-1 space-y-2">
                  <Input
                    value={stat.value}
                    onChange={(e) => updateStat(index, 'value', e.target.value)}
                    placeholder="e.g., 25+"
                    className="bg-white/10 border-white/10 text-white text-center font-bold text-xl"
                  />
                  <Input
                    value={stat.label}
                    onChange={(e) => updateStat(index, 'label', e.target.value)}
                    placeholder="e.g., Years Experience"
                    className="bg-white/10 border-white/10 text-white text-center text-sm"
                  />
                </div>
                <button
                  onClick={() => removeStat(index)}
                  className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-400 hover:bg-red-500/20"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="bg-off-white border border-white/10 rounded-xl p-8">
        <p className="text-navy/40 text-sm mb-4 uppercase tracking-wider">Preview</p>
        <h2 className="text-3xl font-bold text-navy mb-4">{about.title}</h2>
        <div className="space-y-4 mb-8">
          {about.description.map((paragraph, index) => (
            <p key={index} className="text-gray-600">{paragraph}</p>
          ))}
        </div>
        <div className="grid grid-cols-4 gap-4">
          {about.stats.map((stat, index) => (
            <div key={index} className="text-center p-4 bg-white rounded-lg shadow-sm">
              <p className="text-2xl font-bold text-navy">{stat.value}</p>
              <p className="text-gray-500 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AboutEditor
