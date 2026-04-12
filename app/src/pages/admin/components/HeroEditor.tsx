import { useContent } from '../../../contexts/ContentContext'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

const HeroEditor = () => {
  const { content, updateHero } = useContent()
  const { hero } = content

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Hero Section Editor</h2>
        <p className="text-white/60">Edit the main headline and call-to-action on your homepage.</p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-6">
        {/* Headline Lines */}
        <div className="space-y-4">
          <Label className="text-white/80">Headline Lines</Label>
          {hero.headline.map((line, index) => (
            <div key={index} className="flex items-center gap-3">
              <span className="text-white/40 text-sm w-8">{index + 1}.</span>
              <Input
                value={line}
                onChange={(e) => {
                  const newHeadline = [...hero.headline]
                  newHeadline[index] = e.target.value
                  updateHero({ headline: newHeadline })
                }}
                placeholder={`Headline line ${index + 1}`}
                className="flex-1 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-cyan"
              />
            </div>
          ))}
          <p className="text-white/40 text-sm">Tip: Use {'<span className="text-cyan">text</span>'} for cyan highlighted text</p>
        </div>

        {/* Subheadline */}
        <div className="space-y-2">
          <Label htmlFor="subheadline" className="text-white/80">Subheadline</Label>
          <Textarea
            id="subheadline"
            value={hero.subheadline}
            onChange={(e) => updateHero({ subheadline: e.target.value })}
            placeholder="Enter subheadline text"
            rows={2}
            className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-cyan"
          />
        </div>

        {/* CTA Buttons */}
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="ctaPrimary" className="text-white/80">Primary CTA Text</Label>
            <Input
              id="ctaPrimary"
              value={hero.ctaPrimary}
              onChange={(e) => updateHero({ ctaPrimary: e.target.value })}
              placeholder="e.g., Explore My Work"
              className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-cyan"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ctaSecondary" className="text-white/80">Secondary CTA Text</Label>
            <Input
              id="ctaSecondary"
              value={hero.ctaSecondary}
              onChange={(e) => updateHero({ ctaSecondary: e.target.value })}
              placeholder="e.g., Read Insights"
              className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-cyan"
            />
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="bg-navy border border-white/10 rounded-xl p-8">
        <p className="text-white/40 text-sm mb-4 uppercase tracking-wider">Preview</p>
        <div className="text-center">
          {hero.headline.map((line, index) => (
            <h1 
              key={index} 
              className="text-3xl md:text-4xl font-bold text-white"
              dangerouslySetInnerHTML={{ __html: line }}
            />
          ))}
          <p className="text-white/70 mt-4">{hero.subheadline}</p>
          <div className="flex justify-center gap-4 mt-6">
            <span className="px-6 py-3 bg-cyan text-navy font-semibold rounded-lg">
              {hero.ctaPrimary}
            </span>
            <span className="px-6 py-3 border border-white/20 text-white rounded-lg">
              {hero.ctaSecondary}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeroEditor
