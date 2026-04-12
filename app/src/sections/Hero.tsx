import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { ChevronDown, ArrowRight } from 'lucide-react'
import * as THREE from 'three'
import { useContent } from '../contexts/ContentContext'

// WebGL Fluid Background Component
const FluidBackground = () => {
  const meshRef = useRef<THREE.Mesh>(null)
  const mouseRef = useRef({ x: 0.5, y: 0.5 })
  const { viewport } = useThree()

  const uniforms = useRef({
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    uResolution: { value: new THREE.Vector2(viewport.width, viewport.height) },
  })

  useFrame((state) => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.ShaderMaterial
      material.uniforms.uTime.value = state.clock.elapsedTime
      
      // Smooth mouse following
      material.uniforms.uMouse.value.x += (mouseRef.current.x - material.uniforms.uMouse.value.x) * 0.05
      material.uniforms.uMouse.value.y += (mouseRef.current.y - material.uniforms.uMouse.value.y) * 0.05
    }
  })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: e.clientX / window.innerWidth,
        y: 1 - e.clientY / window.innerHeight,
      }
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const vertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `

  const fragmentShader = `
    uniform float uTime;
    uniform vec2 uMouse;
    uniform vec2 uResolution;
    varying vec2 vUv;

    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

    float snoise(vec2 v) {
      const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
      vec2 i  = floor(v + dot(v, C.yy));
      vec2 x0 = v - i + dot(i, C.xx);
      vec2 i1;
      i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;
      i = mod289(i);
      vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
      vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
      m = m*m;
      m = m*m;
      vec3 x = 2.0 * fract(p * C.www) - 1.0;
      vec3 h = abs(x) - 0.5;
      vec3 ox = floor(x + 0.5);
      vec3 a0 = x - ox;
      m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
      vec3 g;
      g.x = a0.x * x0.x + h.x * x0.y;
      g.yz = a0.yz * x12.xz + h.yz * x12.yw;
      return 130.0 * dot(m, g);
    }

    void main() {
      vec2 uv = vUv;
      
      float noise1 = snoise(uv * 2.0 + uTime * 0.1);
      float noise2 = snoise(uv * 4.0 - uTime * 0.15);
      float noise3 = snoise(uv * 1.5 + uTime * 0.08);
      
      float mouseDist = distance(uv, uMouse);
      float mouseInfluence = smoothstep(0.5, 0.0, mouseDist) * 0.3;
      
      float finalNoise = (noise1 + noise2 * 0.5 + noise3 * 0.25) / 1.75;
      finalNoise += mouseInfluence;
      
      vec3 navy = vec3(0.039, 0.122, 0.267);
      vec3 cyan = vec3(0.0, 0.851, 1.0);
      vec3 darkBlue = vec3(0.024, 0.071, 0.157);
      
      vec3 color = mix(navy, darkBlue, finalNoise * 0.5 + 0.5);
      color = mix(color, cyan, smoothstep(0.3, 0.7, finalNoise) * 0.15 + mouseInfluence * 0.5);
      
      float vignette = 1.0 - smoothstep(0.3, 1.2, length(uv - 0.5));
      color *= vignette * 0.3 + 0.7;
      
      gl_FragColor = vec4(color, 1.0);
    }
  `

  return (
    <mesh ref={meshRef} scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1, 32, 32]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms.current}
      />
    </mesh>
  )
}

const Hero = () => {
  const sectionRef = useRef<HTMLElement>(null)
  const headlineRef = useRef<HTMLDivElement>(null)
  const subheadlineRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const scrollIndicatorRef = useRef<HTMLDivElement>(null)
  const { content } = useContent()
  const { hero } = content

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Headline animation
      const lines = headlineRef.current?.querySelectorAll('.headline-line')
      if (lines && lines.length > 0) {
        gsap.fromTo(lines,
          { 
            y: 100, 
            opacity: 0,
            clipPath: 'polygon(0 100%, 100% 100%, 100% 100%, 0 100%)'
          },
          { 
            y: 0, 
            opacity: 1,
            clipPath: 'polygon(0 0%, 100% 0%, 100% 100%, 0 100%)',
            duration: 1.2,
            stagger: 0.15,
            delay: 2.5,
            ease: 'power4.out',
          }
        )
      }

      // Subheadline animation
      if (subheadlineRef.current) {
        gsap.fromTo(subheadlineRef.current,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 1, delay: 3.2, ease: 'power3.out' }
        )
      }

      // CTA animation
      if (ctaRef.current) {
        gsap.fromTo(ctaRef.current,
          { y: 30, opacity: 0, scale: 0.9 },
          { y: 0, opacity: 1, scale: 1, duration: 0.8, delay: 3.5, ease: 'back.out(1.7)' }
        )
      }

      // Scroll indicator animation
      if (scrollIndicatorRef.current) {
        gsap.fromTo(scrollIndicatorRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.8, delay: 4 }
        )
      }

      // Continuous scroll indicator bounce
      const bounceIcon = scrollIndicatorRef.current?.querySelector('.bounce-icon')
      if (bounceIcon) {
        gsap.to(bounceIcon, {
          y: 10,
          duration: 1,
          repeat: -1,
          yoyo: true,
          ease: 'power1.inOut',
        })
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const scrollToAbout = () => {
    document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section 
      id="hero" 
      ref={sectionRef}
      className="relative min-h-screen w-full overflow-hidden"
    >
      {/* WebGL Background */}
      <div className="absolute inset-0">
        <Canvas camera={{ position: [0, 0, 1] }}>
          <FluidBackground />
        </Canvas>
      </div>

      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-navy/50 pointer-events-none" />

      {/* Content */}
      <div className="hero-content relative z-10 min-h-screen flex flex-col items-center justify-center px-6">
        <div className="max-w-5xl mx-auto text-center">
          {/* Headline */}
          <div ref={headlineRef} className="mb-8">
            {hero.headline.map((line, index) => (
              <div key={index} className="headline-line overflow-hidden">
                <h1 
                  className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight"
                  dangerouslySetInnerHTML={{ __html: line }}
                />
              </div>
            ))}
          </div>

          {/* Subheadline */}
          <p 
            ref={subheadlineRef}
            className="text-lg sm:text-xl md:text-2xl text-white/70 mb-12 max-w-2xl mx-auto"
          >
            {hero.subheadline}
          </p>

          {/* CTA Buttons */}
          <div ref={ctaRef} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={scrollToAbout}
              className="group flex items-center gap-3 px-8 py-4 bg-cyan text-navy font-semibold rounded-lg hover:bg-white transition-all duration-300 hover:shadow-glow-strong magnetic-btn"
            >
              <span>{hero.ctaPrimary}</span>
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <a
              href="#insights"
              onClick={(e) => { e.preventDefault(); document.querySelector('#insights')?.scrollIntoView({ behavior: 'smooth' }) }}
              className="flex items-center gap-3 px-8 py-4 glass text-white font-semibold rounded-lg hover:bg-white/10 transition-all duration-300 magnetic-btn"
            >
              <span>{hero.ctaSecondary}</span>
            </a>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div 
          ref={scrollIndicatorRef}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
        >
          <span className="text-white/50 text-sm uppercase tracking-widest">Scroll to Explore</span>
          <div className="bounce-icon">
            <ChevronDown size={24} className="text-cyan" />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
