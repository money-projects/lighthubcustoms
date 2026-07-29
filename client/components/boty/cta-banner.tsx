"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowRight, Zap, Shield, Wrench } from "lucide-react"

export function CTABanner() {
  const [isVisible, setIsVisible] = useState(false)
  const bannerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true) },
      { threshold: 0.1 }
    )
    if (bannerRef.current) observer.observe(bannerRef.current)
    return () => { if (bannerRef.current) observer.unobserve(bannerRef.current) }
  }, [])

  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div
          ref={bannerRef}
          className={`rounded-3xl p-12 md:p-16 flex flex-col justify-center relative overflow-hidden min-h-[400px] transition-all duration-700 ease-out ${
            isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
        >
          <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover">
            <source src="/vid1.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/60" />

          <div className="relative z-10 text-left max-w-2xl">
            <h3 className="text-4xl md:text-5xl text-white mb-4 lg:text-5xl font-serif">
              Find the Right Bulb
            </h3>
            <h3 className="text-3xl md:text-4xl lg:text-5xl text-white/70 mb-8 font-serif">
              For Your Car
            </h3>

            <div className="flex flex-col items-start gap-4 mb-10">
              <div className="flex items-center gap-3 text-white/90">
                <Zap className="w-5 h-5 flex-shrink-0" strokeWidth={1} />
                <span className="text-base">500+ Vehicle Models Covered</span>
              </div>
              <div className="flex items-center gap-3 text-white/90">
                <Shield className="w-5 h-5 flex-shrink-0" strokeWidth={1} />
                <span className="text-base">Guaranteed Correct Fitment</span>
              </div>
              <div className="flex items-center gap-3 text-white/90">
                <Wrench className="w-5 h-5 flex-shrink-0" strokeWidth={1} />
                <span className="text-base">Plug & Play — No Modifications</span>
              </div>
            </div>

            <a
              href="/fitment"
              className="group inline-flex items-center gap-3 bg-primary text-primary-foreground px-8 py-4 rounded-full text-sm tracking-wide font-semibold hover:bg-primary/90 transition-all"
            >
              Try Fitment Guide
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
