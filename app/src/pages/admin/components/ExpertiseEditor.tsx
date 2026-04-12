import { useContent } from '../../../contexts/ContentContext'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Plus, Trash2 } from 'lucide-react'

const ExpertiseEditor = () => {
  const { content, updateExpertise } = useContent()
  const { expertise } = content

  const updateArea = (index: number, field: string, value: string) => {
    const newAreas = [...expertise.areas]
    newAreas[index] = { ...newAreas[index], [field]: value }
    updateExpertise({ areas: newAreas })
  }

  const updateFeature = (areaIndex: number, featureIndex: number, value: string) => {
    const newAreas = [...expertise.areas]
    const newFeatures = [...newAreas[areaIndex].features]
    newFeatures[featureIndex] = value
    newAreas[areaIndex] = { ...newAreas[areaIndex], features: newFeatures }
    updateExpertise({ areas: newAreas })
  }

  const addFeature = (areaIndex: number) => {
    const newAreas = [...expertise.areas]
    newAreas[areaIndex] = {
      ...newAreas[areaIndex],
      features: [...newAreas[areaIndex].features, 'New Feature'],
    }
    updateExpertise({ areas: newAreas })
  }

  const removeFeature = (areaIndex: number, featureIndex: number) => {
    const newAreas = [...expertise.areas]
    newAreas[areaIndex] = {
      ...newAreas[areaIndex],
      features: newAreas[areaIndex].features.filter((_, i) => i !== featureIndex),
    }
    updateExpertise({ areas: newAreas })
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Expertise Section Editor</h2>
        <p className="text-white/60">Edit your areas of expertise and services.</p>
      </div>

      {/* Section Header */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="sectionTitle" className="text-white/80">Section Title</Label>
          <Input
            id="sectionTitle"
            value={expertise.title}
            onChange={(e) => updateExpertise({ title: e.target.value })}
            placeholder="e.g., Areas of Expertise"
            className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-cyan"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="sectionSubtitle" className="text-white/80">Section Subtitle</Label>
          <Textarea
            id="sectionSubtitle"
            value={expertise.subtitle}
            onChange={(e) => updateExpertise({ subtitle: e.target.value })}
            placeholder="Brief description of your expertise"
            rows={2}
            className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-cyan"
          />
        </div>
      </div>

      {/* Expertise Areas */}
      <div className="space-y-6">
        {expertise.areas.map((area, areaIndex) => (
          <div key={areaIndex} className="bg-white/5 border border-white/10 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-8 h-8 rounded-lg bg-cyan/20 text-cyan flex items-center justify-center font-semibold">
                {areaIndex + 1}
              </span>
              <h3 className="text-lg font-semibold text-white">Expertise Area {areaIndex + 1}</h3>
            </div>

            <div className="space-y-4">
              {/* Title */}
              <div className="space-y-2">
                <Label className="text-white/80">Title</Label>
                <Input
                  value={area.title}
                  onChange={(e) => updateArea(areaIndex, 'title', e.target.value)}
                  placeholder="e.g., SAP Service Expertise"
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-cyan"
                />
              </div>

              {/* Subtitle */}
              <div className="space-y-2">
                <Label className="text-white/80">Subtitle</Label>
                <Input
                  value={area.subtitle}
                  onChange={(e) => updateArea(areaIndex, 'subtitle', e.target.value)}
                  placeholder="e.g., Enterprise Resource Planning"
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-cyan"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label className="text-white/80">Description</Label>
                <Textarea
                  value={area.description}
                  onChange={(e) => updateArea(areaIndex, 'description', e.target.value)}
                  placeholder="Describe this expertise area..."
                  rows={3}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-cyan"
                />
              </div>

              {/* Features */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-white/80">Features</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addFeature(areaIndex)}
                    className="border-cyan text-cyan hover:bg-cyan hover:text-navy"
                  >
                    <Plus size={14} className="mr-1" />
                    Add Feature
                  </Button>
                </div>
                
                {area.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center gap-3">
                    <span className="text-cyan text-sm">•</span>
                    <Input
                      value={feature}
                      onChange={(e) => updateFeature(areaIndex, featureIndex, e.target.value)}
                      placeholder={`Feature ${featureIndex + 1}`}
                      className="flex-1 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-cyan"
                    />
                    <button
                      onClick={() => removeFeature(areaIndex, featureIndex)}
                      className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-400 hover:bg-red-500/20"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ExpertiseEditor
