import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { Send, Linkedin, Youtube, Mail, MapPin, Phone, ArrowRight, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

const Contact = () => {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
  })

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

      // Form animation
      if (formRef.current) {
        gsap.fromTo(formRef.current,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: formRef.current,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            }
          }
        )
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setIsSubmitting(false)
    setIsSubmitted(true)
    setFormData({ name: '', email: '', company: '', message: '' })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <section 
      id="contact" 
      ref={sectionRef}
      className="relative py-24 lg:py-32 bg-navy overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-navy via-navy/95 to-navy" />
      
      {/* Animated background dots */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyan/30 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>
      
      {/* Glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan/10 rounded-full blur-[150px]" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[150px]" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left Column - Info */}
          <div ref={headerRef}>
            <span className="reveal-item inline-block px-4 py-1.5 bg-cyan/10 text-cyan text-sm font-medium rounded-full mb-6">
              Get In Touch
            </span>
            
            <h2 className="reveal-item text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              Let's Build The <span className="text-cyan">Future</span> Together
            </h2>
            
            <p className="reveal-item text-lg text-white/60 mb-10">
              Ready to modernize your service operations? Whether you're looking for 
              SAP optimization, Salesforce implementation, or AI integration, I'd love 
              to discuss how we can transform your business.
            </p>

            {/* Contact Info */}
            <div className="reveal-item space-y-6 mb-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-cyan/10 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-cyan" />
                </div>
                <div>
                  <p className="text-white/40 text-sm">Email</p>
                  <a href="mailto:contact@enterpriseconsult.com" className="text-white hover:text-cyan transition-colors">
                    contact@enterpriseconsult.com
                  </a>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-cyan/10 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-cyan" />
                </div>
                <div>
                  <p className="text-white/40 text-sm">Location</p>
                  <p className="text-white">Global - Remote Consulting</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-cyan/10 flex items-center justify-center">
                  <Phone className="w-5 h-5 text-cyan" />
                </div>
                <div>
                  <p className="text-white/40 text-sm">Availability</p>
                  <p className="text-white">Monday - Friday, 9AM - 6PM CET</p>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="reveal-item">
              <p className="text-white/40 text-sm mb-4">Connect on social media</p>
              <div className="flex items-center gap-4">
                <a 
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-white/60 hover:text-cyan hover:bg-cyan/10 transition-all"
                >
                  <Linkedin size={20} />
                </a>
                <a 
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-white/60 hover:text-cyan hover:bg-cyan/10 transition-all"
                >
                  <Youtube size={20} />
                </a>
                <a 
                  href="mailto:contact@enterpriseconsult.com"
                  className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-white/60 hover:text-cyan hover:bg-cyan/10 transition-all"
                >
                  <Mail size={20} />
                </a>
              </div>
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="relative">
            {isSubmitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-white/5 rounded-2xl border border-white/10">
                <div className="w-20 h-20 rounded-full bg-cyan/20 flex items-center justify-center mb-6">
                  <CheckCircle className="w-10 h-10 text-cyan" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Message Sent!</h3>
                <p className="text-white/60 mb-6">
                  Thank you for reaching out. I'll get back to you within 24-48 hours.
                </p>
                <Button
                  onClick={() => setIsSubmitted(false)}
                  variant="outline"
                  className="border-cyan text-cyan hover:bg-cyan hover:text-navy"
                >
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form 
                ref={formRef}
                onSubmit={handleSubmit}
                className="p-8 lg:p-10 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10"
              >
                <h3 className="text-xl font-semibold text-white mb-6">
                  Send a Message
                </h3>

                <div className="space-y-6">
                  {/* Name */}
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-white/80">
                      Full Name <span className="text-cyan">*</span>
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      required
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-cyan focus:ring-cyan/20"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white/80">
                      Email Address <span className="text-cyan">*</span>
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@company.com"
                      required
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-cyan focus:ring-cyan/20"
                    />
                  </div>

                  {/* Company */}
                  <div className="space-y-2">
                    <Label htmlFor="company" className="text-white/80">
                      Company
                    </Label>
                    <Input
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      placeholder="Your Company Ltd."
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-cyan focus:ring-cyan/20"
                    />
                  </div>

                  {/* Message */}
                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-white/80">
                      Message <span className="text-cyan">*</span>
                    </Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell me about your project, challenges, or questions..."
                      required
                      rows={5}
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-cyan focus:ring-cyan/20 resize-none"
                    />
                  </div>

                  {/* Submit */}
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-6 bg-cyan text-navy font-semibold hover:bg-white transition-all duration-300 hover:shadow-glow disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-navy/30 border-t-navy rounded-full animate-spin" />
                        Sending...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Send size={18} />
                        Send Message
                        <ArrowRight size={18} />
                      </span>
                    )}
                  </Button>
                </div>

                <p className="mt-6 text-white/40 text-sm text-center">
                  Your information is secure and will never be shared with third parties.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Contact
