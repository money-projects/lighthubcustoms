"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
import { ChevronLeft, Minus, Plus, ChevronDown, Zap, Shield, Truck, Wrench, Star, Check } from "lucide-react"
import { Header } from "@/components/boty/header"
import { Footer } from "@/components/boty/footer"
import { useCart } from "@/components/boty/cart-context"

const API = process.env.NEXT_PUBLIC_API_URL

type Product = {
  product_id: string
  name: string
  description: string
  price: number
  original_price?: number | null
  image_url: string
  category: string
  discount?: string | null
  stock?: number
  specifications?: Record<string, string> | null
  compatibility?: string | null
  warranty?: string | null
  installation?: string | null
}

const benefits = [
  { icon: Zap,    label: "Premium LED" },
  { icon: Shield, label: "2-Year Warranty" },
  { icon: Wrench, label: "Plug & Play" },
  { icon: Truck,  label: "Fast Delivery" },
]

type AccordionKey = "description" | "specs" | "compatibility" | "installation" | "delivery"

export default function ProductPage() {
  const params = useParams()
  const productId = params.id as string
  const { addItem } = useCart()

  const [product, setProduct] = useState<Product | null>(null)
  const [related, setRelated] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [openAccordion, setOpenAccordion] = useState<AccordionKey | null>("description")
  const [isAdded, setIsAdded] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
    fetch(`${API}/api/products/${productId}`)
      .then(r => r.ok ? r.json() : null)
      .then(d => {
        setProduct(d)
        if (d?.category) {
          fetch(`${API}/api/products?category=${encodeURIComponent(d.category)}&limit=5`)
            .then(r => r.json())
            .then(res => setRelated((res.data || []).filter((p: Product) => p.product_id !== productId).slice(0, 4)))
        }
      })
      .finally(() => setLoading(false))
  }, [productId])

  // Track recently viewed
  useEffect(() => {
    if (!product) return
    try {
      const rv: Product[] = JSON.parse(localStorage.getItem("rm_recently_viewed") || "[]")
      const filtered = rv.filter(p => p.product_id !== product.product_id)
      localStorage.setItem("rm_recently_viewed", JSON.stringify([product, ...filtered].slice(0, 10)))
    } catch {}
  }, [product])

  const handleAddToCart = () => {
    if (!product) return
    addItem({ id: product.product_id, name: product.name, description: product.description, price: product.price, image: product.image_url })
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 2000)
  }

  if (loading) return (
    <main className="min-h-screen">
      <Header />
      <div className="pt-28 flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    </main>
  )

  if (!product) return (
    <main className="min-h-screen">
      <Header />
      <div className="pt-28 flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-foreground font-medium">Product not found</p>
        <Link href="/shop" className="text-sm text-primary hover:underline">Back to Shop</Link>
      </div>
    </main>
  )

  const accordionItems: { key: AccordionKey; title: string; content: string | null }[] = [
    { key: "description",   title: "Description",         content: product.description },
    { key: "specs",         title: "Specifications",      content: product.specifications ? Object.entries(product.specifications).map(([k, v]) => `${k}: ${v}`).join("\n") : null },
    { key: "compatibility", title: "Vehicle Compatibility", content: product.compatibility || null },
    { key: "installation",  title: "Installation",        content: product.installation || null },
    { key: "delivery",      title: "Delivery & Returns",  content: "Free delivery within Nairobi on orders over KES 2,000. Nationwide delivery available. Returns accepted within 7 days if product is unused and in original packaging." },
  ].filter(i => i.content)

  return (
    <main className="min-h-screen">
      <Header />

      <div className="pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <Link href="/shop" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground boty-transition mb-8">
            <ChevronLeft className="w-4 h-4" /> Back to Shop
          </Link>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Image */}
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-card boty-shadow">
              <Image src={product.image_url || "/placeholder.svg"} alt={product.name} fill className="object-cover" priority />
              {product.discount && (
                <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs tracking-wide bg-primary/10 text-primary">Sale</span>
              )}
            </div>

            {/* Info */}
            <div className="flex flex-col">
              <div className="mb-8">
                <span className="text-sm tracking-[0.3em] uppercase text-primary mb-2 block">{product.category}</span>
                <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-4">{product.name}</h1>

                <div className="flex items-center gap-2 mb-4">
                  <div className="flex">{[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-primary text-primary" />)}</div>
                  <span className="text-sm text-muted-foreground">(reviews)</span>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-center gap-3 mb-8">
                <span className="text-3xl font-medium text-foreground">KES {product.price.toLocaleString()}</span>
                {product.original_price && (
                  <span className="text-xl text-muted-foreground line-through">KES {product.original_price.toLocaleString()}</span>
                )}
              </div>

              {/* Stock */}
              {product.stock !== undefined && (
                <p className={`text-sm mb-6 ${product.stock > 0 ? "text-green-400" : "text-destructive"}`}>
                  {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                </p>
              )}

              {/* Quantity */}
              <div className="mb-8">
                <label className="text-sm font-medium text-foreground mb-3 block">Quantity</label>
                <div className="inline-flex items-center gap-4 bg-card rounded-full px-2 py-2 boty-shadow">
                  <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-full bg-background flex items-center justify-center text-foreground/60 hover:text-foreground boty-transition">
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center font-medium text-foreground">{quantity}</span>
                  <button type="button" onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 rounded-full bg-background flex items-center justify-center text-foreground/60 hover:text-foreground boty-transition">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* CTA */}
              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <button type="button" onClick={handleAddToCart}
                  className={`flex-1 inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-sm tracking-wide boty-transition boty-shadow ${isAdded ? "bg-primary/80 text-primary-foreground" : "bg-primary text-primary-foreground hover:bg-primary/90"}`}>
                  {isAdded ? <><Check className="w-4 h-4" /> Added to Cart</> : "Add to Cart"}
                </button>
                <button type="button"
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-transparent border border-foreground/20 text-foreground px-8 py-4 rounded-full text-sm tracking-wide boty-transition hover:bg-foreground/5">
                  Buy Now
                </button>
              </div>

              {/* Benefits */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
                {benefits.map(b => (
                  <div key={b.label} className="flex flex-col items-center gap-2 p-4">
                    <b.icon className="w-5 h-5 text-primary" />
                    <span className="text-xs text-muted-foreground text-center">{b.label}</span>
                  </div>
                ))}
              </div>

              {/* Accordion */}
              <div className="border-t border-border/50">
                {accordionItems.map(item => (
                  <div key={item.key} className="border-b border-border/50">
                    <button type="button" onClick={() => setOpenAccordion(openAccordion === item.key ? null : item.key)}
                      className="w-full flex items-center justify-between py-5 text-left">
                      <span className="font-medium text-foreground">{item.title}</span>
                      <ChevronDown className={`w-5 h-5 text-muted-foreground boty-transition ${openAccordion === item.key ? "rotate-180" : ""}`} />
                    </button>
                    <div className={`overflow-hidden boty-transition ${openAccordion === item.key ? "max-h-96 pb-5" : "max-h-0"}`}>
                      <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{item.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* More Like This */}
          {related.length > 0 && (
            <div className="mt-24">
              <h2 className="font-serif text-3xl text-foreground mb-8">More Like This</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {related.map(p => (
                  <Link key={p.product_id} href={`/product/${p.product_id}`} className="group">
                    <div className="bg-card rounded-3xl overflow-hidden boty-shadow boty-transition group-hover:scale-[1.02]">
                      <div className="relative aspect-square bg-muted overflow-hidden">
                        <Image src={p.image_url || "/placeholder.svg"} alt={p.name} fill className="object-cover boty-transition group-hover:scale-105" />
                      </div>
                      <div className="p-5">
                        <h3 className="font-serif text-base text-foreground mb-1 line-clamp-1">{p.name}</h3>
                        <p className="text-sm text-muted-foreground mb-2 line-clamp-1">{p.description}</p>
                        <span className="text-primary font-medium">KES {p.price.toLocaleString()}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </main>
  )
}
