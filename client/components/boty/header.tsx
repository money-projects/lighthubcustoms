"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Menu, X, ShoppingBag, Search, User } from "lucide-react"
import { CartDrawer } from "./cart-drawer"
import { useCart } from "./cart-context"
import { useAuth } from "./auth-context"

const navLinks = [
  { name: "Shop", href: "/shop" },
  { name: "Headlights", href: "/shop?category=headlights" },
  { name: "Fog Lights", href: "/shop?category=fog-lights" },
  { name: "Fitment Guide", href: "/fitment" },
]

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { setIsOpen, itemCount } = useCart()
  const { user } = useAuth()
  const router = useRouter()

  const handleAccount = () => router.push(user ? "/account" : "/login")

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 pt-4">
      <nav className="max-w-7xl mx-auto px-6 lg:px-8 backdrop-blur-md rounded-lg py-0 my-0 animate-scale-fade-in bg-[rgba(12,15,10,0.75)] border border-[rgba(201,168,76,0.2)]" style={{ boxShadow: 'rgba(0,0,0,0.4) 0px 10px 50px' }}>
        <div className="flex items-center justify-between h-[68px]">
          {/* Mobile menu button */}
          <button
            type="button"
            className="lg:hidden p-2 text-foreground/80 hover:text-foreground boty-transition"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Desktop Navigation - Left */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map(link => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm tracking-wide text-foreground/70 hover:text-primary boty-transition"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Logo */}
          <Link href="/" className="absolute left-1/2 -translate-x-1/2">
            <h1 className="font-serif text-xl tracking-wider text-foreground font-bold">
              ⚡ RADIANT<span className="text-primary">MOTORS</span>
            </h1>
          </Link>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <button type="button" className="p-2 text-foreground/70 hover:text-foreground boty-transition" aria-label="Search">
              <Search className="w-5 h-5" />
            </button>
            <button onClick={handleAccount} className="hidden sm:block p-2 text-foreground/70 hover:text-foreground boty-transition" aria-label="Account">
              <User className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="relative p-2 text-foreground/70 hover:text-foreground boty-transition"
              aria-label="Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-0 -right-0 w-4 h-4 bg-primary text-primary-foreground text-[10px] flex items-center justify-center rounded-full">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        <CartDrawer />

        {/* Mobile Navigation */}
        <div className={`lg:hidden overflow-hidden boty-transition ${isMenuOpen ? "max-h-64 pb-6" : "max-h-0"}`}>
          <div className="flex flex-col gap-4 pt-4 border-t border-border/50">
            {navLinks.map(link => (
              <Link key={link.name} href={link.href} className="text-sm tracking-wide text-foreground/70 hover:text-primary boty-transition">
                {link.name}
              </Link>
            ))}
            <Link href="/account" className="text-sm tracking-wide text-foreground/70 hover:text-primary boty-transition">
              Account
            </Link>
          </div>
        </div>
      </nav>
    </header>
  )
}
