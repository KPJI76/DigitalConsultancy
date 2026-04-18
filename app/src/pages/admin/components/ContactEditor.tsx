import { useState } from 'react'
import { useContent } from '@/contexts/ContentContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Save } from 'lucide-react'

const ContactEditor = () => {
  const { content, updateContact } = useContent()
  const [form, setForm] = useState(content.contact)
  const [saved, setSaved] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setSaved(false)
  }

  const handleSave = () => {
    updateContact(form)
    setSaved(true)
  }

  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">Contact Info</h2>
        <p className="text-white/50 text-sm">Changes appear live on the Contact section of your site.</p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-5">
        <div className="space-y-2">
          <Label className="text-white/80">Email Address</Label>
          <Input
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
            className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-cyan"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-white/80">Phone Number</Label>
          <Input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="+91 98765 43210"
            className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-cyan"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-white/80">Location</Label>
          <Input
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="Global - Remote Consulting"
            className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-cyan"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-white/80">LinkedIn URL</Label>
          <Input
            name="linkedin"
            value={form.linkedin}
            onChange={handleChange}
            placeholder="https://linkedin.com/in/yourprofile"
            className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-cyan"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-white/80">YouTube Channel URL</Label>
          <Input
            name="youtube"
            value={form.youtube}
            onChange={handleChange}
            placeholder="https://youtube.com/@yourchannel"
            className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-cyan"
          />
        </div>

        <Button onClick={handleSave} className="bg-cyan text-navy hover:bg-white w-full">
          <Save size={16} className="mr-2" />
          {saved ? 'Saved!' : 'Save Contact Info'}
        </Button>
      </div>
    </div>
  )
}

export default ContactEditor
