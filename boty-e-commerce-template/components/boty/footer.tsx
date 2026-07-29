"use client"

import Link from "next/link"
import { Instagram, Facebook, MessageCircle } from "lucide-react"

const footerLinks = {
  shop: [
    { name: "All Products", href: "/shop" },
    { name: "Headlights", href: "/shop?category=headlights" },
    { name: "Fog Lights", href: "/shop?category=fog-lights" },
    { name: "Tail Lights", href: "/shop?category=taillights" },
    { name: "Interior Lighting", href: "/shop?category=interior" },
    { name: "Fitment Guide", href: "/fitment" }
  ],
  about: [
    { name: "Our Story", href: "/" },
    { name: "Why LED?", href: "/" },
    { name: "2-Year Warranty", href: "/" },
    { name: "Press", href: "/" }
  ],
  support: [
    { name: "Contact Us", href: "/contact" },
    { name: "FAQ", href: "/faq" },
    { name: "Delivery Info", href: "/delivery" },
    { name: "Returns", href: "/returns" }
  ]
}

export function Footer() {
  return (
    <footer className="bg-card pt-20 pb-10 relative overflow-hidden">
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 pointer-events-none select-none z-0">
        <span className="font-serif text-[200px] md:text-[400px] font-bold text-white/5 whitespace-nowrap leading-none">
          RADIANT
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-16">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <h2 className="font-serif text-3xl text-foreground mb-1">⚡ Radiant<span className="text-primary">Motors</span></h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6 mt-3">
              Kenya's #1 LED lighting store. Premium bulbs for every vehicle, delivered to your door.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-background flex items-center justify-center text-foreground/60 hover:text-foreground boty-transition boty-shadow" aria-label="Instagram">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-background flex items-center justify-center text-foreground/60 hover:text-foreground boty-transition boty-shadow" aria-label="Facebook">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="https://wa.me/254700000000" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-background flex items-center justify-center text-foreground/60 hover:text-foreground boty-transition boty-shadow" aria-label="WhatsApp">
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-foreground mb-4">Shop</h3>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground boty-transition">{link.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-foreground mb-4">About</h3>
            <ul className="space-y-3">
              {footerLinks.about.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground boty-transition">{link.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-foreground mb-4">Support</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground boty-transition">{link.name}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-10 border-t border-border/50">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} Radiant Motors. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="/" className="text-sm text-muted-foreground hover:text-foreground boty-transition">Privacy Policy</Link>
              <Link href="/" className="text-sm text-muted-foreground hover:text-foreground boty-transition">Terms of Service</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
