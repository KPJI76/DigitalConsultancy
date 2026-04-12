import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

const LoadingScreen = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<SVGSVGElement>(null)
  const leftCurtainRef = useRef<HTMLDivElement>(null)
  const rightCurtainRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const tl = gsap.timeline()

    // Logo draw animation
    const paths = logoRef.current?.querySelectorAll('path')
    if (paths) {
      paths.forEach((path) => {
        const length = (path as SVGPathElement).getTotalLength?.() || 200
        gsap.set(path, {
          strokeDasharray: length,
          strokeDashoffset: length,
        })
      })

      tl.to(paths, {
        strokeDashoffset: 0,
        duration: 1.5,
        stagger: 0.2,
        ease: 'power2.inOut',
      })
    }

    // Logo fill and scale
    tl.to(logoRef.current, {
      fill: '#00D9FF',
      scale: 1.1,
      duration: 0.5,
      ease: 'power2.out',
    })

    // Curtain reveal
    tl.to([leftCurtainRef.current, rightCurtainRef.current], {
      scaleX: 0,
      duration: 0.8,
      ease: 'power4.inOut',
      transformOrigin: (i) => i === 0 ? 'left' : 'right',
    }, '-=0.2')

    // Fade out container
    tl.to(containerRef.current, {
      opacity: 0,
      duration: 0.3,
      onComplete: () => {
        if (containerRef.current) {
          containerRef.current.style.display = 'none'
        }
      },
    })
  }, [])

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-[9999] flex items-center justify-center"
    >
      {/* Left curtain */}
      <div 
        ref={leftCurtainRef}
        className="absolute inset-y-0 left-0 w-1/2 bg-navy"
      />
      
      {/* Right curtain */}
      <div 
        ref={rightCurtainRef}
        className="absolute inset-y-0 right-0 w-1/2 bg-navy"
      />

      {/* Logo */}
      <svg 
        ref={logoRef}
        width="120" 
        height="120" 
        viewBox="0 0 120 120" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10"
      >
        {/* Hexagon outline */}
        <path 
          d="M60 10L105 35V85L60 110L15 85V35L60 10Z" 
          stroke="#00D9FF" 
          strokeWidth="2"
          fill="none"
        />
        {/* Inner connections */}
        <path 
          d="M60 10V55M60 55L105 35M60 55L15 35M60 55V110" 
          stroke="#00D9FF" 
          strokeWidth="2"
          fill="none"
        />
        {/* Center circle */}
        <circle 
          cx="60" 
          cy="55" 
          r="15" 
          stroke="#00D9FF" 
          strokeWidth="2"
          fill="none"
        />
        {/* Letter E */}
        <text 
          x="60" 
          y="62" 
          textAnchor="middle" 
          fill="#00D9FF" 
          fontSize="16" 
          fontWeight="bold"
          fontFamily="Inter, sans-serif"
        >
          E
        </text>
      </svg>
    </div>
  )
}

export default LoadingScreen
