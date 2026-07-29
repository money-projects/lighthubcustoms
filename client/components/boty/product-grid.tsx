"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { ShoppingBag } from "lucide-react"
import { useCart } from "./cart-context"

type Product = {
  product_id: string
  name: string
  description: string
  price: number
  originalPrice?: number | null
  image_url: string
  category: string
  discount?: string
}

const CATEGORIES = ["Headlight Projectors", "Fog Lights & Auxiliary Lighting", "Taillights", "Turn Signals", "Angel Eyes & Halo Rings", "Exterior Accessories"]

export function ProductGrid() {
  const [products, setProducts] = useState<Product[]>([])
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0])
  const [isVisible, setIsVisible] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [headerVisible, setHeaderVisible] = useState(false)
  const gridRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const { addItem } = useCart()

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`)
      .then(r => r.json())
      .then(d => setProducts(d.data || []))
      .catch(() => {})
  }, [])

  const filtered = products.filter(p => p.category === selectedCategory)

  const handleCategoryChange = (cat: string) => {
    if (cat !== selectedCategory) {
      setIsTransitioning(true)
      setTimeout(() => {
        setSelectedCategory(cat)
        setTimeout(() => setIsTransitioning(false), 50)
      }, 300)
    }
  }

  useEffect(() => {
    const obs = (ref: React.RefObject<HTMLDivElement | null>, setter: (v: boolean) => void) => {
      const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) setter(true) }, { threshold: 0.1 })
      if (ref.current) o.observe(ref.current)
      return o
    }
    const o1 = obs(gridRef, setIsVisible)
    const o2 = obs(headerRef, setHeaderVisible)
    return () => { o1.disconnect(); o2.disconnect() }
  }, [])

  return (
    <section className="py-24 bg-card">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div ref={headerRef} className="text-center mb-16">
          <span className={`text-sm tracking-[0.3em] uppercase text-primary mb-4 block ${headerVisible ? 'animate-blur-in opacity-0' : 'opacity-0'}`} style={headerVisible ? { animationDelay: '0.2s', animationFillMode: 'forwards' } : {}}>
            Our Products
          </span>
          <h2 className={`font-serif leading-tight text-foreground mb-4 text-balance text-7xl ${headerVisible ? 'animate-blur-in opacity-0' : 'opacity-0'}`} style={headerVisible ? { animationDelay: '0.4s', animationFillMode: 'forwards' } : {}}>
            Premium Lighting
          </h2>
          <p className={`text-lg text-muted-foreground max-w-md mx-auto ${headerVisible ? 'animate-blur-in opacity-0' : 'opacity-0'}`} style={headerVisible ? { animationDelay: '0.6s', animationFillMode: 'forwards' } : {}}>
            Upgrade your vehicle with the brightest, most reliable LED lighting on the market
          </p>
        </div>

        {/* Category tabs — scrollable on mobile */}
        <div className="flex justify-center mb-12 overflow-x-auto pb-2">
          <div className="inline-flex bg-background rounded-full p-1 gap-1">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => handleCategoryChange(cat)}
                className={`px-4 py-2.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-300 ${
                  selectedCategory === cat
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div ref={gridRef} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((product, index) => (
            <Link
              key={product.product_id}
              href={`/product/${product.product_id}`}
              className={`group transition-all duration-500 ease-out ${isVisible && !isTransitioning ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
              style={{ transitionDelay: isTransitioning ? '0ms' : `${index * 80}ms` }}
            >
              <div className="bg-background rounded-3xl overflow-hidden boty-shadow boty-transition group-hover:scale-[1.02]">
                <div className="relative aspect-square bg-muted overflow-hidden">
                  <Image
                    src={product.image_url || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-cover boty-transition group-hover:scale-105"
                  />
                  {product.discount && (
                    <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs tracking-wide bg-primary text-primary-foreground">
                      Sale
                    </span>
                  )}
                  <button
                    type="button"
                    className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-background/90 backdrop-blur-sm flex items-center justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 boty-transition boty-shadow"
                    onClick={(e) => {
                      e.preventDefault(); e.stopPropagation()
                      addItem({ id: product.product_id, name: product.name, description: product.description, price: product.price, image: product.image_url })
                    }}
                    aria-label="Add to cart"
                  >
                    <ShoppingBag className="w-4 h-4 text-foreground" />
                  </button>
                </div>
                <div className="p-5">
                  <h3 className="font-serif text-base text-foreground mb-1 line-clamp-1">{product.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{product.description}</p>
                  <span className="font-medium text-primary">KES {product.price.toLocaleString()}</span>
                </div>
              </div>
            </Link>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-4 text-center py-16 text-muted-foreground">Loading products...</div>
          )}
        </div>

        <div className="text-center mt-12">
          <Link href="/shop" className="inline-flex items-center justify-center gap-2 bg-transparent border border-foreground/20 text-foreground px-8 py-4 rounded-full text-sm tracking-wide boty-transition hover:bg-foreground/5">
            View All Products
          </Link>
        </div>
      </div>
    </section>
  )
}

type Category = "headlights" | "fog" | "interior"

const products = [
  // Headlights
  {
    id: "h4-led-kit",
    name: "H4 LED Headlight Kit",
    description: "6000K white, 8000LM per pair",
    price: 3500,
    originalPrice: 5000,
    image: "/images/products/serum-bottles-1.png",
    badge: "Bestseller",
    category: "headlights" as Category
  },
  {
    id: "h7-led-kit",
    name: "H7 LED Conversion Kit",
    description: "Plug & play, no wiring needed",
    price: 3200,
    originalPrice: null,
    image: "/images/products/amber-dropper-bottles.png",
    badge: null,
    category: "headlights" as Category
  },
  {
    id: "hb3-led",
    name: "HB3 9005 LED Bulbs",
    description: "High beam upgrade, 12000LM",
    price: 2800,
    originalPrice: null,
    image: "/images/products/pump-bottles-lavender.png",
    badge: "New",
    category: "headlights" as Category
  },
  {
    id: "d2s-hid",
    name: "D2S HID Xenon Kit",
    description: "OEM replacement, 4300K",
    price: 5500,
    originalPrice: 7000,
    image: "/images/products/spray-bottles.png",
    badge: "Sale",
    category: "headlights" as Category
  },
  // Fog Lights
  {
    id: "h11-fog",
    name: "H11 Fog Light Bulbs",
    description: "Yellow 3000K, all-weather",
    price: 1800,
    originalPrice: null,
    image: "/images/products/cream-jars-colored.png",
    badge: null,
    category: "fog" as Category
  },
  {
    id: "h8-fog",
    name: "H8 LED Fog Kit",
    description: "Wide beam, 4000LM",
    price: 2100,
    originalPrice: 2600,
    image: "/images/products/tube-bottles.png",
    badge: "Sale",
    category: "fog" as Category
  },
  {
    id: "psx24w-fog",
    name: "PSX24W Fog Bulbs",
    description: "Direct OEM replacement",
    price: 1600,
    originalPrice: null,
    image: "/images/products/jars-wooden-lid.png",
    badge: "Bestseller",
    category: "fog" as Category
  },
  {
    id: "h16-fog",
    name: "H16 LED Fog Light",
    description: "Super bright, 3200LM",
    price: 1900,
    originalPrice: null,
    image: "/images/products/pump-bottles-cream.png",
    badge: null,
    category: "fog" as Category
  },
  // Interior
  {
    id: "ambient-kit",
    name: "Interior Ambient Kit",
    description: "RGB footwell & door lights",
    price: 1200,
    originalPrice: null,
    image: "/images/products/eye-serum-bottles.png",
    badge: "New",
    category: "interior" as Category
  },
  {
    id: "dome-led",
    name: "LED Dome Light",
    description: "Bright white interior upgrade",
    price: 600,
    originalPrice: null,
    image: "/images/products/serum-bottles-1.png",
    badge: null,
    category: "interior" as Category
  },
  {
    id: "trunk-light",
    name: "LED Trunk Light",
    description: "Motion-activated, easy fit",
    price: 800,
    originalPrice: null,
    image: "/images/products/spray-bottles.png",
    badge: null,
    category: "interior" as Category
  },
  {
    id: "dash-kit",
    name: "Dashboard LED Kit",
    description: "Full instrument cluster upgrade",
    price: 2200,
    originalPrice: 2800,
    image: "/images/products/amber-dropper-bottles.png",
    badge: "Sale",
    category: "interior" as Category
  }
]

const categories = [
  { value: "headlights" as Category, label: "Headlights" },
  { value: "fog" as Category, label: "Fog Lights" },
  { value: "interior" as Category, label: "Interior" }
]

