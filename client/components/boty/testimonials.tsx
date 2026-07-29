"use client"

import { useEffect, useRef, useState } from "react"
import { Star } from "lucide-react"

const testimonials = [
  {
    id: 1,
    name: "Brian Otieno",
    location: "Nairobi, Kenya",
    rating: 5,
    text: "Nilinunua H4 LED kit na ilifika siku moja tu. Installation ilikuwa rahisi sana — plug and play kweli kweli. Gari yangu sasa inaangaza vizuri sana usiku.",
    product: "H4 LED Headlight Kit"
  },
  {
    id: 2,
    name: "Wanjiku Kamau",
    location: "Westlands, Nairobi",
    rating: 5,
    text: "Nilikuwa na shaka kidogo kuorder online lakini Radiant Motors walinisaidia kupata bulb sahihi kwa gari yangu. Quality ni ya kweli, tofauti kubwa na za kawaida.",
    product: "H11 Fog Light Bulbs"
  },
  {
    id: 3,
    name: "Kevin Mwangi",
    location: "Thika Road, Nairobi",
    rating: 5,
    text: "Interior ambient kit ni fire! Gari yangu inaonekana kama showroom. Delivery ilikuwa haraka na packaging ilikuwa nzuri. Definitely nitaorder tena.",
    product: "Interior Ambient Kit"
  },
  {
    id: 4,
    name: "Aisha Mohamed",
    location: "Mombasa Road, Nairobi",
    rating: 5,
    text: "Best LED shop in Nairobi hands down. Walisaidia kuchagua tail lights zinazofaa Vitz yangu. Price ni fair na quality ni top notch.",
    product: "LED Tail Light Strip"
  },
  {
    id: 5,
    name: "James Kariuki",
    location: "Kiambu, Kenya",
    rating: 5,
    text: "Nilikuwa naendesha usiku bila kuona vizuri. Baada ya H7 LED kit kutoka Radiant Motors, tofauti ni kubwa sana. Worth every shilling.",
    product: "H7 LED Conversion Kit"
  },
  {
    id: 6,
    name: "Grace Njeri",
    location: "Karen, Nairobi",
    rating: 5,
    text: "Customer service ni excellent. Walijibu maswali yangu yote haraka na walinisaidia kuchagua bidhaa sahihi. Delivery ilifika saa tatu tu baada ya kuorder.",
    product: "HB3 LED Bulbs"
  },
  {
    id: 7,
    name: "Dennis Ochieng",
    location: "Kisumu, Kenya",
    rating: 5,
    text: "Niliorder kutoka Kisumu na ilifika siku mbili. Fog lights ni bright sana, hata mvua kubwa sioni shida tena. Highly recommended kwa wote.",
    product: "H8 LED Fog Kit"
  },
  {
    id: 8,
    name: "Mercy Wambui",
    location: "Ruiru, Kenya",
    rating: 5,
    text: "Gari yangu ilikuwa na dome light mbaya. Niliorder LED replacement na ilifika haraka. Sasa interior inaangaza vizuri. Bei ni nzuri sana.",
    product: "LED Dome Light"
  },
  {
    id: 9,
    name: "Peter Njoroge",
    location: "Ngong Road, Nairobi",
    rating: 5,
    text: "Nimekuwa nikitumia Radiant Motors kwa miaka miwili sasa. Kila wakati quality ni consistent na delivery ni reliable. Hii ni duka la kuamini.",
    product: "D2S HID Xenon Kit"
  }
]

const TestimonialCard = ({ testimonial }: { testimonial: typeof testimonials[0] }) => (
  <div className="rounded-3xl p-6 bg-white mb-4 flex-shrink-0"
    style={{
      boxShadow: "rgba(14, 63, 126, 0.04) 0px 0px 0px 1px, rgba(42, 51, 69, 0.04) 0px 1px 1px -0.5px, rgba(42, 51, 70, 0.04) 0px 3px 3px -1.5px, rgba(42, 51, 70, 0.04) 0px 6px 6px -3px, rgba(14, 63, 126, 0.04) 0px 12px 12px -6px, rgba(14, 63, 126, 0.04) 0px 24px 24px -12px"
    }}
  >
    {/* Stars */}
    

    {/* Quote */}
    <p className="text-foreground/80 leading-relaxed mb-4 text-pretty font-medium text-xl font-serif tracking-wide">
      &ldquo;{testimonial.text}&rdquo;
    </p>

    {/* Author */}
    <div className="flex items-start justify-between gap-2">
      <div>
        <p className="text-foreground text-sm font-bold">{testimonial.name}</p>
        <p className="text-xs text-muted-foreground">{testimonial.location}</p>
      </div>
      <span className="text-xs tracking-wide text-primary/70 bg-primary/5 px-2 py-1 rounded-full whitespace-nowrap">
        {testimonial.product}
      </span>
    </div>
  </div>
)

export function Testimonials() {
  const [headerVisible, setHeaderVisible] = useState(false)
  const headerRef = useRef<HTMLDivElement>(null)
  
  const column1 = [testimonials[0], testimonials[3], testimonials[6]]
  const column2 = [testimonials[1], testimonials[4], testimonials[7]]
  const column3 = [testimonials[2], testimonials[5], testimonials[8]]

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHeaderVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (headerRef.current) {
      observer.observe(headerRef.current)
    }

    return () => {
      if (headerRef.current) {
        observer.unobserve(headerRef.current)
      }
    }
  }, [])

  return (
    <section className="py-24 bg-background overflow-hidden pb-24 pt-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-16">
          <span className={`text-sm tracking-[0.3em] uppercase text-primary mb-4 block ${headerVisible ? 'animate-blur-in opacity-0' : 'opacity-0'}`} style={headerVisible ? { animationDelay: '0.2s', animationFillMode: 'forwards' } : {}}>
            Customer Reviews
          </span>

        </div>

        {/* Scrolling Testimonials */}
        <div className="relative">
          {/* Gradient Overlays */}
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-background to-transparent z-10 pointer-events-none" />
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none" />
          
          {/* Mobile - Single Column */}
          <div className="md:hidden h-[600px]">
            <div className="relative overflow-hidden h-full">
              <div className="animate-scroll-down hover:animate-scroll-down-slow">
                {[...testimonials, ...testimonials].map((testimonial, index) => (
                  <TestimonialCard key={`mobile-${testimonial.id}-${index}`} testimonial={testimonial} />
                ))}
              </div>
            </div>
          </div>

          {/* Desktop - Three Columns */}
          <div className="hidden md:grid md:grid-cols-3 gap-4 h-[600px]">
            {/* Column 1 - Scrolling Down */}
            <div className="relative overflow-hidden">
              <div className="animate-scroll-down hover:animate-scroll-down-slow">
                {[...column1, ...column1].map((testimonial, index) => (
                  <TestimonialCard key={`col1-${testimonial.id}-${index}`} testimonial={testimonial} />
                ))}
              </div>
            </div>

            {/* Column 2 - Scrolling Up */}
            <div className="relative overflow-hidden">
              <div className="animate-scroll-up hover:animate-scroll-up-slow">
                {[...column2, ...column2].map((testimonial, index) => (
                  <TestimonialCard key={`col2-${testimonial.id}-${index}`} testimonial={testimonial} />
                ))}
              </div>
            </div>

            {/* Column 3 - Scrolling Down */}
            <div className="relative overflow-hidden">
              <div className="animate-scroll-down hover:animate-scroll-down-slow">
                {[...column3, ...column3].map((testimonial, index) => (
                  <TestimonialCard key={`col3-${testimonial.id}-${index}`} testimonial={testimonial} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll-down {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(-50%);
          }
        }

        @keyframes scroll-up {
          0% {
            transform: translateY(-50%);
          }
          100% {
            transform: translateY(0);
          }
        }

        .animate-scroll-down {
          animation: scroll-down 30s linear infinite;
        }

        .animate-scroll-up {
          animation: scroll-up 30s linear infinite;
        }

        .animate-scroll-down-slow {
          animation: scroll-down 60s linear infinite;
        }

        .animate-scroll-up-slow {
          animation: scroll-up 60s linear infinite;
        }
      `}</style>
    </section>
  )
}
