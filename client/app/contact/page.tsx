import { Header } from "@/components/boty/header"
import { Footer } from "@/components/boty/footer"
import { Mail, Phone, MapPin, MessageCircle } from "lucide-react"

export default function ContactPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <div className="pt-28 pb-20">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-sm tracking-[0.3em] uppercase text-primary mb-4 block">Get In Touch</span>
            <h1 className="font-serif text-5xl text-foreground mb-4">Contact Us</h1>
            <p className="text-muted-foreground max-w-md mx-auto">We're here to help. Reach out through any of the channels below.</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 mb-16">
            {[
              { icon: Phone, label: "Phone / WhatsApp", value: "+254 700 000 000", href: "tel:+254700000000" },
              { icon: Mail, label: "Email", value: "support@radiantmotors.co.ke", href: "mailto:support@radiantmotors.co.ke" },
              { icon: MessageCircle, label: "WhatsApp Chat", value: "Chat with us on WhatsApp", href: "https://wa.me/254700000000" },
              { icon: MapPin, label: "Location", value: "Nairobi, Kenya", href: "#" },
            ].map(c => (
              <a key={c.label} href={c.href} target={c.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer"
                className="bg-card border border-border rounded-2xl p-6 flex items-start gap-4 hover:border-primary/30 transition-colors group">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <c.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{c.label}</p>
                  <p className="text-foreground font-medium group-hover:text-primary transition-colors">{c.value}</p>
                </div>
              </a>
            ))}
          </div>

          <div className="bg-card border border-border rounded-2xl p-8">
            <h2 className="font-serif text-2xl text-foreground mb-6">Send a Message</h2>
            <form className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-xs text-muted-foreground uppercase tracking-wider mb-2 block">Name</label>
                  <input type="text" placeholder="Your name" className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground uppercase tracking-wider mb-2 block">Email</label>
                  <input type="email" placeholder="you@example.com" className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors" />
                </div>
              </div>
              <div>
                <label className="text-xs text-muted-foreground uppercase tracking-wider mb-2 block">Message</label>
                <textarea rows={5} placeholder="How can we help?" className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors resize-none" />
              </div>
              <button type="submit" className="bg-primary text-primary-foreground px-8 py-3.5 rounded-xl font-semibold text-sm hover:bg-primary/90 transition-all">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}
